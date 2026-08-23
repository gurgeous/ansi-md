//
// standalone helpers
//
// NOTE
// - fns that touch files, network, pids, processes, etc.should be async.
// - every fn should use a typescript return type if not void
//

/* eslint-disable no-restricted-imports */
import { range, sample } from "es-toolkit";
import child_process from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";

// and don't forget about stuff from es-toolkit
// capitalize, random, range, sample, snakeCase, truncate

//
// shell/sh
//

// Runs a command and returns combined stdout/stderr plus the exit status.
async function shell(cmd: string, ...args: VarArgs): Promise<{ output: string; status: number }> {
  return await new Promise((resolve, reject) => {
    let output = "";
    const proc = child_process.spawn(cmd, vargs(args));
    proc.stdout.on("data", (chunk) => (output += chunk.toString()));
    proc.stderr.on("data", (chunk) => (output += chunk.toString()));
    proc.once("close", (code) => resolve({ output, status: code ?? 1 }));
    proc.once("error", reject);
  });
}

// Runs a command and throws if it exits with a non-zero status.
async function shellEx(cmd: string, ...args: VarArgs): Promise<string> {
  const argv = vargs(args);
  const result = await shell(cmd, argv);
  if (result.status) {
    throw new Error(`${cmd} ${argv.join(" ")} failed with code ${result.status}\nOutput: ${result.output}`);
  }
  return result.output;
}

// Runs a shell command string via `sh -c`.
async function sh(cmd: string): ReturnType<typeof shell> {
  return shell("sh", ["-c", cmd]);
}

// Runs a shell command string via `sh -c` and throws on failure.
async function shEx(cmd: string): ReturnType<typeof shellEx> {
  return shellEx("sh", ["-c", cmd]);
}

// Spawns a detached background process and returns its pid.
async function detach(cmd: string, ...args: VarArgs): Promise<number> {
  const argv = vargs(args);
  const child = child_process.spawn(cmd, argv, { detached: true, stdio: "ignore" });
  child.unref();
  const { pid } = child;
  if (!pid) throw new Error(`could not spawn ${cmd} ${argv.join(" ")}`);
  return pid;
}

type VarArgs = string[] | [string[]];

function vargs(args: VarArgs): string[] {
  if (args.length === 1 && Array.isArray(args[0])) return args[0];
  return args as string[];
}

//
// alive checks
//

// Checks whether a TCP port is accepting connections on localhost.
async function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    const done = (result: boolean) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(250);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

// Checks whether a process id is currently alive.
async function isProcessAlive(pid: number): Promise<boolean> {
  try {
    process.kill(pid, 0);
  } catch {
    return false;
  }
  return true;
}

//
// regex/string
//

// Returns every full regex match from a string.
function matchAll(str: string, re: RegExp): string[] {
  return [...str.matchAll(re)].map((m) => m[0]);
}

// Builds a random alphanumeric string of the requested length.
function randAlpha(length: number): string {
  const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return range(length)
    .map(() => sample([...ALPHA]))
    .join("");
}

// Returns a new string list sorted with optional case sensitivity.
function sortStrings(list: string[], caseSensitive: boolean = false): string[] {
  const sensitivity = caseSensitive ? "variant" : "base";
  return [...list].sort((a, b) => a.localeCompare(b, undefined, { sensitivity }));
}

// Collapses internal whitespace and trims the ends of a string.
function squish(str: string): string {
  return str.trim().replace(/\s+/g, " ");
}

// Returns the current git commit short sha or `unknown` outside a repo.
async function gitSha(): Promise<string> {
  let sha = "unknown";
  try {
    sha = await shellEx("git", "rev-parse", "--short", "HEAD");
  } catch {}
  return sha.trim();
}

// Replaces non-alphanumeric runs with hyphens for URL-like text.
function slugify(str: string): string {
  return str.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Returns the md5 hash of a string as lowercase hex.
function md5(str: string): string {
  return crypto.createHash("md5").update(str).digest("hex");
}

// Returns the sha256 hash of a string as lowercase hex.
function sha256(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

//
// files
//

// Checks whether a filesystem path exists.
async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path);
  } catch {
    return false;
  }
  return true;
}

// Creates a directory and any missing parent directories.
async function mkdir(dir: string): Promise<void> {
  await fs.promises.mkdir(dir, { recursive: true });
}

// Moves a file after creating the destination parent directory.
async function mv(src: string, dst: string): Promise<void> {
  await mkdir(path.dirname(dst));
  await fs.promises.rename(src, dst);
}

// Removes a file or path without failing if it is already missing.
async function rm(file: string): Promise<void> {
  await fs.promises.rm(file, { force: true });
}

//
// read/write
//

// Reads a UTF-8 file into a string.
async function readFile(file: string): Promise<string> {
  return await fs.promises.readFile(file, "utf8");
}

// Writes a UTF-8 file atomically through a temporary file.
async function writeFile(file: string, content: string): Promise<void> {
  await mkdir(path.dirname(file));
  const tmp = `${file}.tmp.${process.pid}.${Date.now()}`;
  try {
    await fs.promises.writeFile(tmp, content, "utf8");
    await mv(tmp, file);
  } finally {
    await rm(tmp);
  }
}

// Reads and parses a JSON file.
async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file)) as T;
}

// Serializes a value as pretty JSON and writes it atomically.
async function writeJson(file: string, value: unknown): Promise<void> {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

//
// urls
//

// Extracts the hostname from a URL string.
function hostname(url: string): string {
  return new URL(url).hostname;
}

// Returns a URL with query parameters set from a plain object.
function urlWithQuery(base: string, query: Record<string, string | number | boolean>): string {
  const url = new URL(base);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

//
// dates
//

// Formats a date like `January 31, 2026`.
function january312026(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Formats a date like `January 2026`
function january2026(date: Date): string {
  if (date.getUTCFullYear() === 2026 && date.getUTCMonth() === 0 && date.getUTCDate() === 1) {
    return "REMIND";
  }
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

//
// banner/fatal/warning
//

const FG = "1;38;5;231";
const GREEN = "48;2;064;160;043";
const ORANGE = "48;2;251;100;11";
const RED = "48;2;210;15;57";

// Prints a timestamped banner line using an ANSI background color.
function banner(msg: string, color: string = GREEN) {
  const now = new Date().toTimeString().slice(0, 8);
  console.log(`\u001b[${FG};${color}m[${now}] ${msg.padEnd(72, " ")}\u001b[0m`);
}

// Prints a warning banner line.
function warning(msg: string) {
  banner(msg, ORANGE);
}

// Prints a fatal banner line and exits the process.
function fatal(msg: string) {
  banner(msg, RED);
  process.exit(1);
}

//
// PidFile
//

// Manages a pidfile for a detached background process.
class PidFile {
  readonly pidfile: string;

  constructor(pidfile: string) {
    this.pidfile = pidfile;
  }

  async isAlive(): Promise<boolean> {
    const pid = await this.read();
    if (!pid) return false;
    return await isProcessAlive(pid);
  }

  async spawn(cmd: string, ...args: VarArgs): Promise<void> {
    const pid = await detach(cmd, ...args);
    await this.write(pid);
  }

  async cleanup(): Promise<void> {
    const pid = await this.read();
    if (pid) {
      try {
        process.kill(pid, "SIGKILL");
      } catch {}
    }
    await rm(this.pidfile);
  }

  private async read(): Promise<number | undefined> {
    if (!(await fileExists(this.pidfile))) return;
    return Number.parseInt(await readFile(this.pidfile), 10);
  }

  private async write(pid: number): Promise<void> {
    await writeFile(this.pidfile, `${pid}\n`);
  }
}

export default {
  banner,
  detach,
  fatal,
  fileExists,
  gitSha,
  hostname,
  isPortOpen,
  isProcessAlive,
  january2026,
  january312026,
  matchAll,
  md5,
  mkdir,
  mv,
  PidFile,
  randAlpha,
  readFile,
  readJson,
  rm,
  sh,
  sha256,
  shell,
  shellEx,
  shEx,
  slugify,
  sortStrings,
  squish,
  urlWithQuery,
  warning,
  writeFile,
  writeJson,
};
