#!/usr/bin/env -S sh -c 'node --experimental-strip-types --import "$(dirname "$0")/preload.ts" "$0" "$@"'
// ^^ note magic shebang. this is how we run node w/ preload, no matte where we are

// Organize TypeScript imports in place using the installed TS language service.
// This is a thin CLI around TypeScript, so a dedicated test is not needed here.

import Util from "@/lib/util.ts";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const REPO = (await Util.shellEx("git", "rev-parse", "--show-toplevel")).trim();

//
// main
//

// Expand targets, organize imports, and rewrite changed files in place.
async function main() {
  const args = process.argv.slice(2);

  // get list of files from globbed argv. for simplicity we always operate in REPO
  let files = args;
  files = files.map((f) => path.relative(REPO, path.resolve(f)));
  process.chdir(REPO);
  files = files.length ? files : ["."];
  files = await buildTargets(files);
  if (!files.length) Util.fatal(`no ts files found in ${args}`);

  // fire up the lsp
  const lsp = ts.createLanguageService(buildHost(files));

  // run
  for (const file of files) {
    process.stdout.write(file);
    const edits = lsp.organizeImports(
      {
        type: "file",
        fileName: file,
        mode: ts.OrganizeImportsMode.All,
      },
      ts.getDefaultFormatCodeSettings(),
      {},
    );
    let changed = false;
    for (const edit of edits) {
      if (await writeEdit(edit)) {
        changed = true;
      }
    }
    if (changed) {
      console.log("    [updated]");
    } else {
      console.log();
    }
  }
}

//
// lsp
//

// Bridge TypeScript's file-based language service API to the local filesystem.
function buildHost(src: string[]): ts.LanguageServiceHost {
  const tsconfig = readConfig();
  const all = uniq([...tsconfig.fileNames, ...src]);

  return {
    getScriptSnapshot(file) {
      const text = ts.sys.readFile(file);
      if (!text) return;
      return ts.ScriptSnapshot.fromString(text);
    },

    // one-liners
    getCompilationSettings() { return tsconfig.options }, // prettier-ignore
    getCurrentDirectory() { return "." }, // prettier-ignore
    getDefaultLibFileName(compilerOptions) { return ts.getDefaultLibFilePath(compilerOptions) }, // prettier-ignore
    getScriptFileNames() { return all }, // prettier-ignore
    getScriptVersion() { return "0" }, // prettier-ignore

    fileExists: ts.sys.fileExists,
    readDirectory: ts.sys.readDirectory,
    readFile: ts.sys.readFile,
  };
}

// Load tsconfig so organizeImports has the same project context as editors.
function readConfig() {
  // find
  const tsconfig = ts.findConfigFile(".", ts.sys.fileExists);
  if (!tsconfig) return { fileNames: [], options: {} };

  // read
  const opaque = ts.readConfigFile(tsconfig, ts.sys.readFile);
  if (opaque.error) throw new Error(ts.flattenDiagnosticMessageText(opaque.error.messageText, "\n"));
  return ts.parseJsonConfigFileContent(opaque.config, ts.sys, path.dirname(tsconfig));
}

// Rewrite one changed file after TypeScript returns text edits.
async function writeEdit(edit: ts.FileTextChanges) {
  const before = await Util.readFile(edit.fileName);
  const after = [...edit.textChanges]
    .sort((a, b) => b.span.start - a.span.start)
    .reduce((text, change) => {
      const start = change.span.start;
      const end = start + change.span.length;
      return `${text.slice(0, start)}${change.newText}${text.slice(end)}`;
    }, before);

  // this is slow, so show progress
  if (after === before) return false;
  await Util.writeFile(edit.fileName, after);
  return true;
}

//
// helpers
//

async function buildTargets(args: string[]) {
  let a = args;
  a = a.length ? a : ["."]; // default
  a = uniq(a.flatMap(resolve)) as string[]; // glob
  a = await gitignore(a); // gitignore
  a = a.filter((f) => !f.endsWith(".d.ts")); // ignore d.ts
  a = a.sort();
  return a;
}

// Expand one file, dir, glob, or "." target into matching TypeScript files.
function resolve(arg: string) {
  if (!fs.existsSync(arg)) {
    Util.fatal(`file not found '${arg}'`);
    return;
  }

  // process file/dir
  let list: string[];
  if (fs.statSync(arg).isFile()) {
    list = [arg];
  } else {
    const exclude = ["**/{.git,node_modules,tmp}/**"];
    const pattern = `${arg}/**/*.ts`;
    list = fs.globSync(pattern, { exclude });
  }

  return list;
}

// Drop files ignored by git so "." behaves like the rest of the repo tools.
async function gitignore(files: string[]) {
  if (!files.length) return files;
  const result = await Util.shell("git", "check-ignore", ...files);
  if (result.status === 128) throw `git check-ignore ${files} failed`;
  const ignored = result.output.split("\n");
  return difference(files, ignored);
}

await main();
