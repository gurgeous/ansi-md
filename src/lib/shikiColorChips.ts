import type { ShikiTransformer } from "shiki";

type HastElement = {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children: HastNode[];
};

type HastText = {
  type: "text";
  value: string;
};

type HastNode = HastElement | HastText;

const hexColorPattern = /#[0-9a-fA-F]{6}/g;
const quotedHexColorPattern = /"#[0-9a-fA-F]{6}"/g;

function colorChip(hex: string): HastElement {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      "aria-hidden": "true",
      class: "hex-chip",
      focusable: "false",
      viewBox: "0 0 12 12",
    },
    children: [
      {
        type: "element",
        tagName: "rect",
        properties: {
          fill: hex,
          height: "12",
          width: "12",
          x: "0",
          y: "0",
        },
        children: [],
      },
    ],
  };
}

function decorateText(value: string): HastNode[] {
  const nodes: HastNode[] = [];
  let lastIndex = 0;
  const pattern = value.match(quotedHexColorPattern) ? quotedHexColorPattern : hexColorPattern;
  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    const text = match[0];
    const hex = text.replaceAll('"', "");
    if (index > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, index) });
    }
    nodes.push(colorChip(hex));
    nodes.push({ type: "text", value: text });
    lastIndex = index + text.length;
  }
  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }
  return nodes;
}

export function hexColorChipTransformer(): ShikiTransformer {
  return {
    name: "ansi-md-hex-color-chips",
    span(hast, _line, _column, _lineElement, token) {
      if (!hexColorPattern.test(token.content)) return;
      hexColorPattern.lastIndex = 0;
      hast.children = hast.children.flatMap((child) => (child.type === "text" ? decorateText(child.value) : child));
    },
  };
}
