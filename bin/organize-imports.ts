// Organize TypeScript imports in place using the installed TS language service.
// This is a thin CLI around TypeScript, so a dedicated test is not needed here.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";
import Util from "@/lib/util.ts";

//
// main
//

const REPO = (await Util.shellEx("git", "rev-parse", "--show-toplevel")).trim();

// Expand targets, organize imports, and rewrite changed files in place.
async function main() {
  // get list of files from globbed argv. for simplicity we always operate in REPO
  let files = process.argv.slice(2);
  if (!files.length) files = ["."];
  files = files.map((f) => path.relative(REPO, path.resolve(f)));
  process.chdir(REPO);
  files = await buildTargets(files);

  // fire up the lsp
  const lsp = ts.createLanguageService(buildHost(files));

  // now run
  for (const file of files) {
    const edits = lsp.organizeImports(
      { type: "file", fileName: file, mode: ts.OrganizeImportsMode.All },
      ts.getDefaultFormatCodeSettings(),
      {},
    );
    for (const edit of edits) {
      await writeEdit(edit);
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
    getCompilationSettings() {
      return tsconfig.options;
    },
    getCurrentDirectory() {
      return process.cwd();
    },
    getDefaultLibFileName(compilerOptions) {
      return ts.getDefaultLibFilePath(compilerOptions);
    },
    getScriptFileNames() {
      return all;
    },
    getScriptSnapshot(file) {
      const text = ts.sys.readFile(file);
      if (!text) return;
      return ts.ScriptSnapshot.fromString(text);
    },
    getScriptVersion() {
      return "0";
    },
    fileExists: ts.sys.fileExists,
    readDirectory: ts.sys.readDirectory,
    readFile: ts.sys.readFile,
  };
}

// Load tsconfig so organizeImports has the same project context as editors.
function readConfig() {
  // find
  const tsconfig = ts.findConfigFile(process.cwd(), ts.sys.fileExists);
  if (!tsconfig) return { fileNames: [], options: {} };

  // read
  const opaque = ts.readConfigFile(tsconfig, ts.sys.readFile);
  if (opaque.error) Util.fatal(ts.flattenDiagnosticMessageText(opaque.error.messageText, "\n"));
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
  if (after === before) return 0;
  await Util.writeFile(edit.fileName, after);
  return 1;
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
  if (!a.length) Util.fatal(`no ts files found in ${args}`);
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
  console.log(files);
  const result = await Util.shell("git", "check-ignore", ...files);
  console.log(result);

  if (result.status === 128) Util.fatal("git -C failed");
  const ignored = result.output.split("\n");
  return difference(files, ignored);
}

await main();
