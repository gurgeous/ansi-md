// Turns bare GitHub repository references into concise links.
import { SKIP, visit } from "unist-util-visit";

const repoPattern = /(?<![\w./-])(?:(?:https?:\/\/)?github\.com|github)\/([\w.-]+)\/([\w.-]*[\w-])/g;

function repoPath(href) {
  if (href.startsWith("github.com/")) href = `https://${href}`;
  if (href.startsWith("github/")) href = `https://github.com/${href.slice(7)}`;

  let url;
  try {
    url = new URL(href);
  } catch {
    return;
  }
  if (url.hostname !== "github.com") return;
  const [owner, repo] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo) return;
  return `${owner}/${repo}`;
}

function repoLabel(repo, overrides) {
  return overrides[repo] ?? repo.split("/")[1];
}

function rawHref(node) {
  if (node.children.length !== 1) return;
  const [child] = node.children;
  if (child.type !== "text" || child.value !== node.url) return;
  return child;
}

export function remarkGitHubRepoLinks({ overrides = {} } = {}) {
  return (tree) => {
    visit(tree, "link", (node) => {
      const child = rawHref(node);
      if (!child) return;
      const repo = repoPath(node.url);
      if (!repo) return;
      node.url = node.url.startsWith("http") ? node.url : `https://github.com/${repo}`;
      child.value = repoLabel(repo, overrides);
    });

    visit(tree, "text", (node, index, parent) => {
      if (parent?.type === "link" || index === undefined) return;

      const children = [];
      let offset = 0;
      for (const match of node.value.matchAll(repoPattern)) {
        if (match.index > offset) children.push({ type: "text", value: node.value.slice(offset, match.index) });
        const repo = `${match[1]}/${match[2]}`;
        children.push({
          type: "link",
          url: `https://github.com/${repo}`,
          children: [{ type: "text", value: repoLabel(repo, overrides) }],
        });
        offset = match.index + match[0].length;
      }
      if (!children.length) return;
      if (offset < node.value.length) children.push({ type: "text", value: node.value.slice(offset) });
      parent.children.splice(index, 1, ...children);
      return [SKIP, index + children.length];
    });
  };
}
