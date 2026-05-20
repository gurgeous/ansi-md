import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { languages, renderAnsi256 } from "../src/data/ansi256.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "tmp", "test", "ansi256-code");
const expectedLanguages = ["go", "python", "ruby", "rust", "typescript", "zig"];

const files = {
  go: join(out, "go", "ansi256.go"),
  python: join(out, "python", "ansi256.py"),
  ruby: join(out, "ruby", "ansi256.rb"),
  rust: join(out, "rust", "ansi256.rs"),
  typescript: join(out, "typescript", "ansi256.ts"),
  zig: join(out, "zig", "ansi256.zig"),
};

const commands = {
  go: ["go", ["test", "."], dirname(files.go)],
  python: ["python3", ["-m", "py_compile", files.python], root],
  ruby: ["ruby", ["-c", files.ruby], root],
  rust: ["rustc", ["--crate-type", "lib", files.rust, "-o", join(out, "rust", "libansi256.rlib")], root],
  typescript: [
    "tsc",
    [
      "--noEmit",
      "--ignoreConfig",
      "--strict",
      "--target",
      "ES2022",
      "--module",
      "ESNext",
      "--moduleResolution",
      "Bundler",
      "--skipLibCheck",
      files.typescript,
    ],
    root,
  ],
  zig: ["zig", ["test", files.zig], root],
};

function assertSameLanguages(label, actual) {
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expectedLanguages].sort();
  if (actualSorted.join(",") !== expectedSorted.join(",")) {
    throw new Error(`${label} languages ${actualSorted.join(",")} did not match ${expectedSorted.join(",")}`);
  }
}

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

function output(command, args, cwd) {
  return execFileSync(command, args, { cwd, encoding: "utf8" });
}

function assertIncludes(language, source, value) {
  if (!source.includes(value)) {
    throw new Error(`${language} output is missing ${value}`);
  }
}

function assertExcludes(language, source, value) {
  if (source.includes(value)) {
    throw new Error(`${language} output unexpectedly includes ${value}`);
  }
}

function compilableSource(language, source) {
  if (language === "go") return `package ansi256\n\n${source}`;
  if (language === "zig") return `const std = @import("std");\n\n${source}`;
  return source;
}

rmSync(out, { force: true, recursive: true });

assertSameLanguages("languages", languages);
assertSameLanguages("file targets", Object.keys(files));
assertSameLanguages("compiler commands", Object.keys(commands));

for (const language of languages) {
  const file = files[language];
  mkdirSync(dirname(file), { recursive: true });
  const source = renderAnsi256(language);
  writeFileSync(file, compilableSource(language, source));

  assertExcludes(language, source, "Grey0");
  assertIncludes(language, source, "#000000");
  assertIncludes(language, source, "#0000d7");
}

assertIncludes("go", renderAnsi256("go"), "map[string]string");
assertIncludes("go", renderAnsi256("go"), '"black":');
assertIncludes("go", renderAnsi256("go"), '"white":');
assertIncludes("go", renderAnsi256("go"), '"blue_3_20":');
assertExcludes("go", renderAnsi256("go"), "package ansi256");
assertIncludes("python", renderAnsi256("python"), "ANSI_256: dict[str, str]");
assertIncludes("python", renderAnsi256("python"), '"black":');
assertIncludes("python", renderAnsi256("python"), '"white":');
assertIncludes("python", renderAnsi256("python"), '"blue_3_20":');
assertIncludes("ruby", renderAnsi256("ruby"), "black:");
assertIncludes("ruby", renderAnsi256("ruby"), "white:");
assertIncludes("ruby", renderAnsi256("ruby"), "blue_3_20:");
assertIncludes("rust", renderAnsi256("rust"), "pub const ANSI_256: &[(&str, &str)]");
assertIncludes("rust", renderAnsi256("rust"), '"black"');
assertIncludes("rust", renderAnsi256("rust"), '"white"');
assertIncludes("rust", renderAnsi256("rust"), '"blue_3_20"');
assertIncludes("typescript", renderAnsi256("typescript"), "Record<string, string>");
assertIncludes("typescript", renderAnsi256("typescript"), "black:");
assertIncludes("typescript", renderAnsi256("typescript"), "white:");
assertIncludes("typescript", renderAnsi256("typescript"), "blue_3_20:");
assertIncludes("zig", renderAnsi256("zig"), "StaticStringMap");
assertIncludes("zig", renderAnsi256("zig"), '"black"');
assertIncludes("zig", renderAnsi256("zig"), '"white"');
assertIncludes("zig", renderAnsi256("zig"), '"blue_3_20"');
assertIncludes("zig", renderAnsi256("zig"), "std.StaticStringMap");
assertExcludes("zig", renderAnsi256("zig"), "const std");
assertExcludes("zig", renderAnsi256("zig"), '@import("std")');

writeFileSync(join(dirname(files.go), "go.mod"), "module ansi256test\n\ngo 1.22\n");

const gofmtDiff = output("gofmt", ["-d", files.go], root);
if (gofmtDiff.length > 0) {
  console.error(gofmtDiff);
  throw new Error("go output is not gofmt-formatted");
}

for (const language of languages) {
  const [command, args, cwd] = commands[language];
  console.log(language);
  run(command, args, cwd);
}

run("rustfmt", ["--check", files.rust], root);
run("prettier", ["--check", files.typescript], root);
run("zig", ["fmt", "--check", files.zig], root);
