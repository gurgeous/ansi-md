// Prettier plugin for aligning trailing `//` comments on single-line TypeScript
// type members during normal Prettier formatting.
import estree from "prettier/plugins/estree";
import ts from "prettier/plugins/typescript";

//
// constants
//

// Stash an attached suffix comment on one node
const symAlignedComment = Symbol("symAlignedComment");
// Stash the extra spaces needed
const symPadding = Symbol("symPadding");
// Memoize alignment groups
const symSeen = Symbol("symSeen");

//
// main
//

// Delegate to Prettier's estree printer, then append aligned suffix comments
// only for the TS member nodes we annotated during parsing.
const printer = {
  ...estree.printers.estree,
  print(path, options, print, ...args) {
    const node = path.node;
    if (isEligible(node)) {
      prepare(node);
    }

    const printed = estree.printers.estree.print(path, options, print, ...args);
    const comment = node[symAlignedComment];
    if (node.type !== "TSPropertySignature" || !comment) {
      return printed;
    }

    const padding = " ".repeat((node[symPadding] ?? 0) + 1);
    return [printed, padding, comment];
  },
};

// Wrap the stock TypeScript parser so we can annotate the AST before the estree
// printer sees it.
function wrapParser(parser) {
  return {
    ...parser,
    parse(text, options) {
      return attachSuffixComments(parser.parse(text, options));
    },
  };
}

// Wrap the TypeScript parser
export const parsers = { typescript: wrapParser(ts.parsers.typescript) };

// Override the estree printer (because TypeScript parses through estree)
export const printers = { estree: printer };

//
// helpers
//

// Match both `type X = { ... }` and `interface X { ... }` bodies.
function isEligible(node) {
  return node?.type === "TSTypeLiteral" || node?.type === "TSInterfaceBody";
}

// Only align members that already fit on one source line.
function isSingleLineTypeMember(node) {
  return node?.type === "TSPropertySignature" && node.loc?.start.line === node.loc?.end.line;
}

// Read the member array for a supported container shape.
function membersOf(node) {
  if (node.type === "TSTypeLiteral") return node.members ?? [];
  if (node.type === "TSInterfaceBody") return node.body ?? [];
  return [];
}

// Walk the estree with Prettier's visitor keys so we only follow real child
// nodes and avoid accidental cycles or metadata traversal.
function visit(node, fn) {
  const seen = new Set();

  // Keep a visited set because we mutate nodes with symbol metadata.
  function walk(current) {
    if (!current || typeof current !== "object" || seen.has(current)) return;
    seen.add(current);
    fn(current);

    const { getVisitorKeys } = estree.printers.estree;
    for (const key of getVisitorKeys(current)) {
      const value = current[key];
      if (Array.isArray(value)) {
        for (const item of value) {
          walk(item);
        }
        continue;
      }
      walk(value);
    }
  }

  walk(node);
}

// Index line comments by source line for fast same-line suffix lookup.
function groupCommentsByLine(comments) {
  const byLine = new Map();

  for (const comment of comments) {
    const line = comment.loc?.start.line;
    if (!line) continue;
    const group = byLine.get(line) ?? [];
    group.push(comment);
    byLine.set(line, group);
  }

  return byLine;
}

//
// transforms
//

// Attach same-line suffix comments to type members before printing so the
// custom printer can treat them as part of the member output.
function attachSuffixComments(ast) {
  if (!Array.isArray(ast.comments) || ast.comments.length === 0) return ast;

  const usedComments = new Set();
  const lineComments = ast.comments.filter((comment) => comment.type === "Line");
  const commentsByLine = groupCommentsByLine(lineComments);

  visit(ast, (node) => {
    if (!isEligible(node)) return;

    // Match only comments that start on the member's end line and appear
    // after the member's printed range.
    for (const member of membersOf(node)) {
      if (!isSingleLineTypeMember(member)) continue;

      const comment = commentsByLine.get(member.loc?.end.line)?.find((entry) => {
        return (
          !usedComments.has(entry) &&
          entry.loc?.start.line === member.loc?.end.line &&
          entry.range?.[0] >= member.range?.[1]
        );
      });

      if (!comment) continue;
      member[symAlignedComment] = `//${comment.value}`;
      usedComments.add(comment);
    }
  });

  ast.comments = ast.comments.filter((comment) => !usedComments.has(comment));
  return ast;
}

// Split members into contiguous runs so blank lines and multiline members form
// natural alignment boundaries.
function commentedMemberGroups(node) {
  const groups = [];
  let group = [];
  let previousLine = null;

  for (const member of membersOf(node)) {
    if (!isSingleLineTypeMember(member) || !member[symAlignedComment]) {
      group = [];
      previousLine = null;
      continue;
    }

    const line = member.loc.start.line;
    if (previousLine !== null && line !== previousLine + 1) {
      group = [];
    }
    if (group.length === 0) {
      groups.push(group);
    }

    group.push(member);
    previousLine = line;
  }

  return groups.filter((members) => members.length > 1);
}

// Precompute one alignment width per contiguous member group and store the
// padding on each member so the printer stays simple.
function prepare(node) {
  if (node[symSeen]) return;
  node[symSeen] = true;

  for (const group of commentedMemberGroups(node)) {
    const width = Math.max(...group.map((member) => member.loc.end.column));
    for (const member of group) {
      member[symPadding] = width - member.loc.end.column;
    }
  }
}
