import Util from "@/lib/util.ts";
import { delay } from "es-toolkit";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

//
// hooks
//

beforeEach(() => {
  let seed = 12345;
  const fakerand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 0x100000000;
  vi.spyOn(Math, "random").mockImplementation(fakerand);
});
afterEach(() => vi.restoreAllMocks());

//
// tests
//

test("banner", () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  Util.banner("hello");
  expect(log).toHaveBeenCalledTimes(1);
  expect(log.mock.calls[0]?.[0]).toContain("hello");
  expect(log.mock.calls[0]?.[0]).toContain("\u001b[");
});

test("detach", async () => {
  const pid = await Util.detach("node", "-e", "setInterval(() => {}, 1000)");
  await expect(Util.isProcessAlive(pid)).resolves.toBe(true);
  process.kill(pid, "SIGKILL");
  await delay(50);
  await expect(Util.isProcessAlive(pid)).resolves.toBe(false);
});

test("fatal", () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const exit = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
    throw new Error(`exit:${code ?? ""}`);
  }) as never);
  expect(() => Util.fatal("boom")).toThrow("exit:1");
  expect(log).toHaveBeenCalledTimes(1);
  expect(log.mock.calls[0]?.[0]).toContain("boom");
  expect(exit).toHaveBeenCalledWith(1);
});

test("fileExists", async () => {
  const file = path.join(os.tmpdir(), `gurge-util-${Date.now()}-exists.txt`);
  await fs.promises.writeFile(file, "hello", "utf8");
  await expect(Util.fileExists(file)).resolves.toBe(true);
  await expect(Util.fileExists(`${file}.missing`)).resolves.toBe(false);
});

test("hostname", () => {
  expect(Util.hostname("https://sub.example.com:8080/path?q=1")).toBe("sub.example.com");
});

test("isPortOpen", async () => {
  await expect(Util.isPortOpen(9)).resolves.toBe(false);
  const net = await import("node:net");
  const server = net.createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  await expect(Util.isPortOpen(port)).resolves.toBe(true);
  await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

test("isProcessAlive", async () => {
  await expect(Util.isProcessAlive(999_999_999)).resolves.toBe(false);
  await expect(Util.isProcessAlive(process.pid)).resolves.toBe(true);
});

test("matchAll", () => {
  expect(Util.matchAll("ab12 cd34 ef", /\d+/g)).toEqual(["12", "34"]);
});

test("sortStrings", () => {
  expect(Util.sortStrings(["beta", "Alpha", "alpha"])).toEqual(["Alpha", "alpha", "beta"]);
  expect(Util.sortStrings(["beta", "Alpha", "alpha"], true)).toEqual(["alpha", "Alpha", "beta"]);
});

test("md5", () => {
  expect(Util.md5("hello")).toBe("5d41402abc4b2a76b9719d911017c592");
});

test("mkdir", async () => {
  const dir = path.join(os.tmpdir(), `gurge-util-${Date.now()}`, "a", "b");
  await Util.mkdir(dir);
  expect(fs.existsSync(dir)).toBe(true);
});

test("mv", async () => {
  const root = path.join(os.tmpdir(), `gurge-util-${Date.now()}-mv`);
  const src = path.join(root, "src.txt");
  const dst = path.join(root, "nested", "dst.txt");
  await fs.promises.mkdir(root, { recursive: true });
  await fs.promises.writeFile(src, "hello", "utf8");
  await Util.mv(src, dst);
  await expect(fs.promises.readFile(dst, "utf8")).resolves.toBe("hello");
  expect(fs.existsSync(src)).toBe(false);
});

test("PidFile", async () => {
  const pidfile = path.join(os.tmpdir(), `gurge-util-${Date.now()}.pid`);
  const pf = new Util.PidFile(pidfile);
  await expect(pf.isAlive()).resolves.toBe(false);
  await pf.spawn("node", "-e", "setInterval(() => {}, 1000)");
  await expect(Util.fileExists(pidfile)).resolves.toBe(true);
  await expect(pf.isAlive()).resolves.toBe(true);
  await pf.cleanup();
  await expect(Util.fileExists(pidfile)).resolves.toBe(false);
  await expect(pf.isAlive()).resolves.toBe(false);
});

test("readFile", async () => {
  const file = path.join(os.tmpdir(), `gurge-util-${Date.now()}-read.txt`);
  await fs.promises.writeFile(file, "hello", "utf8");
  await expect(Util.readFile(file)).resolves.toBe("hello");
});

test("readJson", async () => {
  const file = path.join(os.tmpdir(), `gurge-util-${Date.now()}-data.json`);
  await fs.promises.writeFile(file, '{"name":"gurge","count":2}\n', "utf8");
  await expect(Util.readJson<{ name: string; count: number }>(file)).resolves.toEqual({
    count: 2,
    name: "gurge",
  });
});

test("randAlpha", () => {
  const value = Util.randAlpha(12);
  expect(value).toBe("bbHN4gEHKWcU");
  expect(value).toHaveLength(12);
  expect(value).toMatch(/^[A-Za-z0-9]+$/);
});

test.skip("gitSha", async () => {
  const expected = (await Util.shEx("git rev-parse --short HEAD")).trim();
  await expect(Util.gitSha()).resolves.toBe(expected);
});

test("rm", async () => {
  const file = path.join(os.tmpdir(), `gurge-util-${Date.now()}-rm.txt`);
  await fs.promises.writeFile(file, "hello", "utf8");
  await Util.rm(file);
  await Util.rm(file);
  expect(fs.existsSync(file)).toBe(false);
});

test("sha256", () => {
  expect(Util.sha256("hello")).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});

test("sh", async () => {
  const result = await Util.sh("printf 'hello'");
  expect(result.status).toBe(0);
  expect(result.output).toBe("hello");
});

test("shell", async () => {
  const empty = await Util.shell("echo");
  expect(empty.status).toBe(0);

  const variadic = await Util.shell("echo", "hello", "world");
  expect(variadic.status).toBe(0);
  expect(variadic.output).toContain("hello world");

  const array = await Util.shell("echo", ["hello", "world"]);
  expect(array.status).toBe(0);
  expect(array.output).toContain("hello world");

  const result = await Util.shell("node", [
    "-e",
    'process.stdout.write("out\\n"); process.stderr.write("err\\n"); process.exit(3)',
  ]);
  expect(result.status).toBe(3);
  expect(result.output).toContain("out");
  expect(result.output).toContain("err");
});

test("shEx", async () => {
  await expect(Util.shEx("printf 'ok'")).resolves.toBe("ok");
  await expect(Util.shEx("printf 'boom' 1>&2; exit 5")).rejects.toThrow("boom");
});

test("shellEx", async () => {
  await expect(Util.shellEx("node", ["-e", 'process.stdout.write("ok")'])).resolves.toBe("ok");
  await expect(Util.shellEx("node", ["-e", 'process.stderr.write("boom"); process.exit(5)'])).rejects.toThrow("boom");
});

test("slugify", () => {
  expect(Util.slugify(" Hello, world! ")).toBe("Hello-world");
});

test("squish", () => {
  expect(Util.squish(" \n hello   there \t world \n ")).toBe("hello there world");
});

test("january312026", () => {
  expect(Util.january312026(new Date("2026-01-31T12:00:00Z"))).toBe("January 31, 2026");
});

test("january2026", () => {
  expect(Util.january2026(new Date("2026-02-01T12:00:00Z"))).toBe("February 2026");
  expect(Util.january2026(new Date("2026-01-01T12:00:00Z"))).toBe("REMIND");
});

test("urlWithQuery", () => {
  expect(Util.urlWithQuery("https://example.com/search", { exact: true, page: 2, q: "hello world" })).toBe(
    "https://example.com/search?exact=true&page=2&q=hello+world",
  );
});

test("warning", () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  Util.warning("careful");
  expect(log).toHaveBeenCalledTimes(1);
  expect(log.mock.calls[0]?.[0]).toContain("careful");
  expect(log.mock.calls[0]?.[0]).toContain("48;2;251;100;11");
});

test("writeFile", async () => {
  const file = path.join(os.tmpdir(), `gurge-util-${Date.now()}`, "nested", "file.txt");
  await Util.writeFile(file, "hello");
  await expect(fs.promises.readFile(file, "utf8")).resolves.toBe("hello");
});

test("writeJson", async () => {
  const file = path.join(os.tmpdir(), `gurge-util-${Date.now()}`, "nested", "data.json");
  await Util.writeJson(file, { count: 2, name: "gurge" });
  await expect(fs.promises.readFile(file, "utf8")).resolves.toBe('{\n  "count": 2,\n  "name": "gurge"\n}\n');
});
