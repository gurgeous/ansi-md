// Shiki transformer that adds small color chips before rendered hex colors.
// It edits HAST nodes only, so copied code remains the original text.
import type { Element, ElementContent } from "hast";
import type { ShikiTransformer } from "shiki";

const hexColorPattern = /#[0-9a-fA-F]{6}/;
const globalHexColorPattern = /#[0-9a-fA-F]{6}/g;
const quotedHexColorPattern = /"#[0-9a-fA-F]{6}"/g;

// Build a tiny inline SVG instead of styling a span so copied code stays pure.
function chip(hex: string): Element {
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

// Split a text token and insert chips before hex color substrings.
function decorateText(value: string): ElementContent[] {
  const nodes: ElementContent[] = [];
  let lastIndex = 0;

  // If the whole string literal is present, place the chip before the quote.
  const pattern = value.match(quotedHexColorPattern) ? quotedHexColorPattern : globalHexColorPattern;
  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    const text = match[0];
    const hex = text.replaceAll('"', "");
    if (index > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, index) });
    }

    // Keep the original text node after the chip so copy/paste is unchanged.
    nodes.push(chip(hex));
    nodes.push({ type: "text", value: text });
    lastIndex = index + text.length;
  }
  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }
  return nodes;
}

// Create the Shiki transformer used by code sample rendering.
export function hexChips(): ShikiTransformer {
  return {
    name: "ansi-md-hex-color-chips",

    // Decorate only token spans that contain expanded hex colors.
    span(hast, _line, _column, _lineElement, token) {
      if (!hexColorPattern.test(token.content)) return;

      hast.children = hast.children.flatMap((child) => {
        return child.type === "text" ? decorateText(child.value) : child;
      });
    },
  };
}
