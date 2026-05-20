import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ansi256Languages, renderAnsi256 } from "../src/data/ansi256.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "tmp", "test", "ansi256-code");

const files = {
  go: join(out, "go", "ansi256.go"),
  ruby: join(out, "ruby", "ansi256.rb"),
  rust: join(out, "rust", "ansi256.rs"),
  typescript: join(out, "typescript", "ansi256.ts"),
  zig: join(out, "zig", "ansi256.zig"),
};

const commands = {
  go: ["go", ["test", "."], dirname(files.go)],
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

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
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

rmSync(out, { force: true, recursive: true });

for (const language of ansi256Languages) {
  const file = files[language];
  mkdirSync(dirname(file), { recursive: true });
  const source = renderAnsi256(language);
  writeFileSync(file, source);

  assertExcludes(language, source, "Grey0");
  assertIncludes(language, source, "#000000");
  assertIncludes(language, source, "#0000d7");
}

assertIncludes("go", renderAnsi256("go"), "Black");
assertIncludes("go", renderAnsi256("go"), "Blue3_20");
assertIncludes("ruby", renderAnsi256("ruby"), "black:");
assertIncludes("ruby", renderAnsi256("ruby"), "blue_3_20:");
assertIncludes("rust", renderAnsi256("rust"), "BLACK");
assertIncludes("rust", renderAnsi256("rust"), "BLUE_3_20");
assertIncludes("typescript", renderAnsi256("typescript"), "black:");
assertIncludes("typescript", renderAnsi256("typescript"), "blue3_20:");
assertIncludes("zig", renderAnsi256("zig"), "black");
assertIncludes("zig", renderAnsi256("zig"), "blue_3_20");

writeFileSync(join(dirname(files.go), "go.mod"), "module ansi256test\n\ngo 1.22\n");

for (const language of ansi256Languages) {
  const [command, args, cwd] = commands[language];
  run(command, args, cwd);
}
