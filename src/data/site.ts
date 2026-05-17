export type DocTable = {
  headers: string[];
  rows: string[][];
};

export type DocTerm = {
  term: string;
  description: string;
};

export type DocSection = {
  id: string;
  title: string;
  body?: string[];
  items?: string[];
  terms?: DocTerm[];
  table?: DocTable;
  code?: string;
};

export type DocPage = {
  slug: string;
  title: string;
  manual: string;
  name: string;
  synopsis: string[];
  description: string[];
  sections: DocSection[];
  seeAlso?: string[];
};

export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const docPages: DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    manual: "INTRO(7)",
    name: "getting-started - a short path through terminal output decisions",
    synopsis: ["stdout is a TTY?", "NO_COLOR and FORCE_COLOR", "8 color -> 256 color -> RGB", "plain output first"],
    description: [
      "Start with output that is correct when copied, piped, logged, and read in a narrow terminal. Add color, motion, and full-screen behavior only after the plain form is useful.",
      "Most CLI polish comes from a few early decisions: whether stdout is interactive, how much color to emit, how progress is represented, and which library owns parsing or rendering.",
    ],
    sections: [
      {
        id: "path",
        title: "Reading Path",
        items: [
          "Learn the core escape sequence vocabulary in ANSI.",
          "Check terminal capabilities before relying on color depth, cursor movement, hyperlinks, or Unicode width.",
          "Design a small semantic color palette before choosing exact RGB values.",
          "Choose output patterns before choosing a progress renderer or TUI framework.",
          "Use the toolbox for quick color conversion, contrast checks, and terminal probes.",
        ],
      },
      {
        id: "decisions",
        title: "First Decisions",
        terms: [
          {
            term: "interactive",
            description:
              "If stdout is a TTY, rich output may help. If it is a pipe, stable plain text usually matters more.",
          },
          {
            term: "color",
            description:
              "Default to semantic 8-color output. Use 256-color or truecolor only when the detail is meaningful.",
          },
          {
            term: "motion",
            description: "Use spinners and progress bars for uncertainty, but keep CI and logs append-only.",
          },
          {
            term: "structure",
            description:
              "Separate human output from machine output. Offer JSON or another stable format when data is the product.",
          },
        ],
      },
      {
        id: "minimum",
        title: "Minimum Safe Output",
        code: "if [ -t 1 ]; then\n  printf '\\033[32mok\\033[0m built site\\n'\nelse\n  printf 'ok built site\\n'\nfi",
      },
      {
        id: "checklist",
        title: "Checklist",
        items: [
          "Reset SGR styling before returning control to the shell.",
          "Honor NO_COLOR and document any FORCE_COLOR behavior.",
          "Keep important state visible without color.",
          "Write data to stdout and diagnostics to stderr.",
          "Test with a TTY, with a pipe, and at a narrow width.",
        ],
      },
    ],
    seeAlso: ["ANSI escape code reference", "Querying terminal capabilities", "CLI output patterns", "Toolbox"],
  },
  {
    slug: "ansi",
    title: "ANSI escape code reference",
    manual: "ANSI(7)",
    name: "ansi - escape sequences for terminal styling and control",
    synopsis: ["ESC [ params final", "ESC [ params m       # SGR styling", "ESC ] command ; data ST"],
    description: [
      "ANSI escape sequences are byte strings interpreted by terminals rather than printed literally. They are the low-level vocabulary behind colored output, cursor movement, line clearing, hyperlinks, alternate screens, and most terminal UI renderers.",
      "Use them deliberately. Reset styles, avoid control sequences when stdout is not a TTY, and prefer terminfo or capability checks when behavior varies by terminal.",
    ],
    sections: [
      {
        id: "control",
        title: "Control Bytes",
        table: {
          headers: ["Token", "Bytes", "Meaning"],
          rows: [
            ["ESC", "0x1b", "Starts most escape sequences."],
            ["BEL", "0x07", "Terminator for some OSC sequences; also the audible bell."],
            ["CSI", "ESC [", "Control Sequence Introducer, used for SGR, cursor movement, and erasing."],
            ["OSC", "ESC ]", "Operating System Command, used for title changes, hyperlinks, and clipboard operations."],
            ["ST", "ESC \\\\", "String Terminator for OSC and related sequences."],
          ],
        },
      },
      {
        id: "sgr",
        title: "SGR Styling",
        table: {
          headers: ["Code", "Name", "Notes"],
          rows: [
            ["0", "reset", "Clear all active graphic rendition state."],
            ["1", "bold", "May render as heavier text or brighter color."],
            ["2", "dim", "Useful for secondary text; support is uneven."],
            ["3", "italic", "Not universal in older terminals."],
            ["4", "underline", "Common for links and file references."],
            ["7", "inverse", "Good for selections and active states."],
            ["9", "strike", "Use sparingly; terminal support varies."],
          ],
        },
      },
      {
        id: "color",
        title: "Color Forms",
        table: {
          headers: ["Form", "Foreground", "Background", "Use"],
          rows: [
            ["8 color", "30-37", "40-47", "Most portable semantic color."],
            ["16 color", "90-97", "100-107", "Bright variants; theme dependent."],
            ["256 color", "38;5;n", "48;5;n", "Stable palette for charts, bars, and compact UI."],
            ["24-bit RGB", "38;2;r;g;b", "48;2;r;g;b", "Exact color when truecolor is supported."],
          ],
        },
      },
      {
        id: "cursor",
        title: "Cursor And Erase",
        table: {
          headers: ["Sequence", "Meaning", "Typical use"],
          rows: [
            ["ESC[nA", "move up n rows", "Multi-line progress redraw."],
            ["ESC[nG", "move to column n", "Aligned counters and status lanes."],
            ["ESC[?25l", "hide cursor", "Spinners and live renderers."],
            ["ESC[?25h", "show cursor", "Cleanup after animation."],
            ["ESC[2K", "clear entire line", "Rewrite a shorter status line safely."],
            ["ESC[2J", "clear screen", "Full-screen TUI setup; avoid in logs."],
          ],
        },
      },
      {
        id: "osc",
        title: "OSC Notes",
        items: [
          "OSC 8 hyperlinks can make file paths and documentation links clickable in supporting terminals.",
          "OSC 52 can access the clipboard; treat it as sensitive and do not emit it from untrusted data.",
          "Window title changes are useful for long-running TUIs, but should be polite and reversible.",
        ],
      },
    ],
    seeAlso: ["ECMA-48", "xterm control sequences", "terminfo(5)", "console_codes(4)"],
  },
  {
    slug: "capabilities",
    title: "Querying terminal capabilities",
    manual: "CAPABILITIES(7)",
    name: "capabilities - detect terminal features without lying to users",
    synopsis: ["TERM=xterm-256color", "COLORTERM=truecolor", "infocmp $TERM", "tput colors"],
    description: [
      "Terminal capability detection is a negotiation between environment variables, terminfo, direct probes, and user preference. No single signal is perfect.",
      "Prefer a conservative baseline, then enable richer output only when support is likely or the user explicitly asks for it.",
    ],
    sections: [
      {
        id: "environment",
        title: "Environment Variables",
        terms: [
          {
            term: "TERM",
            description: "Names the terminal capability entry. It is necessary but often not sufficient.",
          },
          { term: "COLORTERM", description: "Frequently set to truecolor or 24bit by RGB-capable terminals." },
          { term: "NO_COLOR", description: "A user request to disable color output." },
          {
            term: "FORCE_COLOR",
            description: "A user or tooling request to force color even when detection is uncertain.",
          },
          { term: "CI", description: "Often means append-only logs are better than live animations." },
        ],
      },
      {
        id: "terminfo",
        title: "terminfo",
        body: [
          "terminfo describes terminal capabilities such as colors, cursor movement, erase sequences, alternate screen support, and function keys. It is the portable answer for many classic terminal questions.",
        ],
        code: "infocmp $TERM\nprintf 'colors=%s\\n' \"$(tput colors)\"\nprintf 'clear-line=%q\\n' \"$(tput el)\"",
      },
      {
        id: "compatibility",
        title: "Compatibility Matrix",
        table: {
          headers: ["Terminal", "Generally safe assumptions", "Check before use"],
          rows: [
            ["xterm", "CSI, SGR, 256 colors, many OSC features", "clipboard and hyperlinks"],
            ["iTerm2", "truecolor, hyperlinks, images", "protocol-specific media"],
            ["Terminal.app", "SGR, 256 colors, truecolor", "newer OSC features"],
            ["Windows Terminal", "truecolor, hyperlinks, modern VT processing", "legacy conhost behavior"],
            ["Alacritty", "truecolor, fast rendering", "image protocols"],
            ["Kitty", "truecolor, keyboard protocol, graphics protocol", "fallbacks outside Kitty"],
            ["WezTerm", "truecolor, hyperlinks, rich protocol support", "user config differences"],
            ["Ghostty", "modern color and protocol support", "version-specific feature gates"],
          ],
        },
      },
      {
        id: "unicode",
        title: "Unicode Width",
        items: [
          "Measure display width, not string length.",
          "Emoji, combining marks, and ambiguous-width characters can break aligned output.",
          "Use ASCII fallbacks for progress and spinners when width support is uncertain.",
        ],
      },
    ],
    seeAlso: ["terminfo(5)", "infocmp(1)", "tput(1)", "NO_COLOR"],
  },
  {
    slug: "color",
    title: "Color and palettes",
    manual: "COLOR(7)",
    name: "color - terminal palettes, contrast, and practical ANSI color use",
    synopsis: ["ESC[31mredESC[0m", "ESC[38;5;208morangeESC[0m", "ESC[38;2;255;176;0mamberESC[0m"],
    description: [
      "Terminal color is contextual. Users choose themes, backgrounds, fonts, and contrast preferences. Good CLI color works with that reality instead of fighting it.",
    ],
    sections: [
      {
        id: "rules",
        title: "Rules Of Thumb",
        items: [
          "Use semantic 8-color output for status: red for error, yellow for warning, green for success, blue/cyan for information.",
          "Use 256-color output when visual structure depends on repeatable swatches.",
          "Use RGB output when brand, charts, or gradients genuinely benefit from exact color.",
          "Never communicate important state by color alone.",
          "Always support plain output for pipes, logs, scripts, and accessibility.",
        ],
      },
      {
        id: "palette",
        title: "Basic Foreground Palette",
        table: {
          headers: ["Color", "Normal", "Bright", "Common use"],
          rows: [
            ["black", "30", "90", "subtle separators on light themes"],
            ["red", "31", "91", "errors and destructive warnings"],
            ["green", "32", "92", "success and completed work"],
            ["yellow", "33", "93", "warnings and waiting states"],
            ["blue", "34", "94", "links and informational labels"],
            ["magenta", "35", "95", "rare accents and categories"],
            ["cyan", "36", "96", "secondary information and paths"],
            ["white", "37", "97", "high-contrast foreground"],
          ],
        },
      },
      {
        id: "contrast",
        title: "Contrast",
        items: [
          "Assume the background may be light, dark, transparent, or image-based.",
          "Prefer bold, punctuation, indentation, or labels over low-contrast color differences.",
          "Check both light and dark theme contrast when designing a fixed palette.",
        ],
      },
    ],
    seeAlso: ["NO_COLOR", "WCAG contrast", "xterm 256 color palette"],
  },
  {
    slug: "cli-renaissance",
    title: "The CLI renaissance",
    manual: "TOOLS(7)",
    name: "tools - modern command line tools worth studying",
    synopsis: ["rg pattern", "fd name", "bat file", "yazi", "zoxide query"],
    description: [
      "A wave of modern CLIs has reset expectations for speed, defaults, color, previews, structured output, and interactive terminal workflows.",
      "These tools are useful to recommend, but they are also design references: each shows how a terminal program can feel faster or clearer without becoming a full GUI.",
    ],
    sections: [
      {
        id: "search",
        title: "Search And Discovery",
        table: {
          headers: ["Tool", "Replaces or complements", "Why it matters"],
          rows: [
            ["ripgrep", "grep", "Fast recursive search that respects ignore files by default."],
            ["fd", "find", "Human-friendly file finding with useful defaults."],
            ["fzf", "shell history, pickers, ad hoc menus", "Turns streams into interactive fuzzy selections."],
          ],
        },
      },
      {
        id: "navigation",
        title: "Viewing And Navigation",
        table: {
          headers: ["Tool", "Replaces or complements", "Why it matters"],
          rows: [
            ["bat", "cat, less", "Syntax highlighting, paging, git markers, and readable defaults."],
            ["eza", "ls", "Color, git status, tree views, and modern listing ergonomics."],
            ["yazi", "ranger, file managers", "Fast TUI file management with previews."],
            ["zoxide", "cd", "Learns frequent directories and makes navigation approximate."],
          ],
        },
      },
      {
        id: "workflows",
        title: "Workflow Tools",
        table: {
          headers: ["Area", "Tools", "Notes"],
          rows: [
            ["git", "delta, lazygit, gh", "Diff readability, TUI workflows, and hosted GitHub operations."],
            ["system", "btop, dust, duf, hyperfine", "Resource views, disk usage, and benchmarking."],
            ["data/http", "jq, yq, xh, httpie", "Structured data and readable HTTP calls."],
            ["shell", "starship, atuin, direnv, just, mise", "Prompt, history, environment, tasks, and tool versions."],
          ],
        },
      },
      {
        id: "recommendation",
        title: "Recommendation Standard",
        items: [
          "Explain what the tool replaces and what it does better.",
          "Explain where the classic tool is still better, especially in scripts and minimal systems.",
          "Prefer tools with stable maintenance, cross-platform packaging, and plain-output modes.",
          "Show one command that proves the value quickly.",
        ],
      },
    ],
    seeAlso: ["bat", "fd", "fzf", "ripgrep", "yazi", "zoxide"],
  },
  {
    slug: "progress",
    title: "Progress and motion",
    manual: "PROGRESS(7)",
    name: "progress - terminal spinners, progress bars, and live redraws",
    synopsis: ["spinner: unknown duration", "bar: known total", "log: durable output"],
    description: [
      "Progress output should reduce uncertainty without corrupting logs or leaving the terminal in a bad state.",
      "Every live renderer needs a fixed footprint, a cleanup path, and a non-TTY fallback.",
    ],
    sections: [
      {
        id: "patterns",
        title: "Patterns",
        terms: [
          { term: "spinner", description: "Use when a task is alive but has no meaningful total." },
          { term: "progress bar", description: "Use when files, bytes, rows, tests, or steps can be counted." },
          { term: "multi-line progress", description: "Use fixed lanes and cursor-up redraws for concurrent work." },
          { term: "append-only log", description: "Use in CI and when output must be audited later." },
        ],
      },
      {
        id: "redraw",
        title: "Single-Line Redraw",
        code: "printf '\\033[?25l'        # hide cursor\nprintf '\\r\\033[2Kbuild [####------] 42%%'\nprintf '\\r\\033[2K\\033[?25h' # clear and restore",
      },
      {
        id: "rules",
        title: "Rules",
        items: [
          "Keep animation intervals modest; fast spinners waste CPU and distract readers.",
          "Use ASCII fallbacks when Unicode width is uncertain.",
          "Restore the cursor on success, failure, SIGINT, and SIGTERM.",
          "Print a final newline when the task ends.",
        ],
      },
    ],
    seeAlso: ["ESC[2K", "ESC[?25l", "SIGINT", "CI logs"],
  },
  {
    slug: "patterns",
    title: "CLI output patterns",
    manual: "PATTERNS(7)",
    name: "patterns - durable conventions for command output",
    synopsis: ["tool [--json] [--quiet] [--verbose]", "tool subcommand --help"],
    description: [
      "Beautiful CLI output is not just color. It is hierarchy, rhythm, stable flags, predictable errors, and output that behaves correctly when piped to another program.",
    ],
    sections: [
      {
        id: "human",
        title: "Human Output",
        items: [
          "Use short labels for status lines: ok, warn, error, skip, run.",
          "Align columns only when the content is tabular and widths are bounded.",
          "Make paths and line references copyable.",
          "Avoid noisy success output in commands that are commonly scripted.",
        ],
      },
      {
        id: "machine",
        title: "Machine Output",
        items: [
          "Provide --json or --format for tools that expose data.",
          "Keep schemas stable and version breaking changes.",
          "Separate logs from data, usually stderr for logs and stdout for data.",
          "Use stable exit codes and document them.",
        ],
      },
      {
        id: "shell",
        title: "Shell Integration",
        items: [
          "Generate completions for common shells.",
          "Generate help and manpages from the same command model when possible.",
          "Document environment variables and config precedence.",
          "Keep examples safe to paste.",
        ],
      },
      {
        id: "testing",
        title: "Testing",
        items: [
          "Snapshot plain output and colored output separately.",
          "Test with stdout as TTY and as pipe.",
          "Test narrow terminal widths.",
          "Use pseudo-terminals for live redraw behavior.",
        ],
      },
    ],
    seeAlso: ["stdout", "stderr", "isatty", "shell completions"],
  },
  {
    slug: "libraries",
    title: "Library and framework recommendations",
    manual: "LIBRARIES(7)",
    name: "libraries - recommended building blocks for CLI and TUI apps",
    synopsis: ["parser + output helper", "parser + prompt library", "tui framework"],
    description: [
      "Choose the smallest library that matches the interface. A command parser, an output helper, and a full-screen TUI framework solve different problems.",
      "Recommendations should include fit, tradeoffs, maintenance state, portability, and a minimal example.",
    ],
    sections: [
      {
        id: "parsers",
        title: "CLI Parsers",
        table: {
          headers: ["Language", "Recommended", "Best fit"],
          rows: [
            ["Go", "Cobra", "Large command suites and generated shell completions."],
            ["Rust", "Clap", "Typed command definitions and strong validation."],
            ["Python", "Typer, Click", "Readable command definitions and Python ecosystem fit."],
            ["Node.js", "Commander, Oclif", "Small CLIs through larger command platforms."],
          ],
        },
      },
      {
        id: "output",
        title: "Output Helpers",
        table: {
          headers: ["Ecosystem", "Libraries", "Use"],
          rows: [
            ["Python", "Rich", "Tables, progress, markup, tracebacks, prompts."],
            [".NET", "Spectre.Console", "Tables, prompts, progress, markup, widgets."],
            ["Node.js", "Chalk, Picocolors", "Portable color and style helpers."],
            ["Go", "Lip Gloss, termenv", "Styles, layout primitives, color profiles."],
          ],
        },
      },
      {
        id: "tui",
        title: "TUI Frameworks",
        table: {
          headers: ["Language", "Recommended", "Best fit"],
          rows: [
            ["Go", "Bubble Tea", "Stateful interactive tools with an Elm-style update loop."],
            ["Rust", "Ratatui", "Fast dashboards, inspectors, and terminal workbenches."],
            ["Python", "Textual", "Widget-rich Python apps with CSS-like styling."],
            ["Node.js", "Ink", "React-oriented terminal interfaces."],
            ["JVM", "Lanterna", "Portable terminal UIs in Java/Kotlin environments."],
          ],
        },
      },
      {
        id: "avoid",
        title: "Avoid When",
        items: [
          "Do not pull in a full TUI framework for a command that only needs help text and flags.",
          "Do not use color libraries that ignore NO_COLOR or non-TTY output.",
          "Do not make scripts depend on non-standard tools unless the dependency is explicit.",
        ],
      },
    ],
    seeAlso: ["Cobra", "Clap", "Rich", "Bubble Tea", "Ratatui", "Textual", "Ink"],
  },
  {
    slug: "images",
    title: "Images and rich media",
    manual: "IMAGES(7)",
    name: "images - graphics protocols and terminal media output",
    synopsis: ["chafa image.png", "sixel", "kitty graphics protocol", "iTerm2 inline images"],
    description: [
      "Terminal image support is powerful and fragmented. Use it when the image is the work, not as decoration.",
    ],
    sections: [
      {
        id: "protocols",
        title: "Protocols",
        terms: [
          { term: "Sixel", description: "Older bitmap graphics protocol with support in several terminals." },
          {
            term: "Kitty graphics",
            description: "Modern image protocol associated with Kitty and compatible terminals.",
          },
          { term: "iTerm2 images", description: "OSC-based inline image support popularized by iTerm2." },
          { term: "Chafa", description: "Tool for converting images into terminal-friendly character graphics." },
        ],
      },
      {
        id: "rules",
        title: "Rules",
        items: [
          "Provide text fallbacks.",
          "Gate by terminal support.",
          "Avoid writing binary or opaque escape payloads into logs.",
          "Prefer image output for previews, diagrams, and media tools rather than general CLI branding.",
        ],
      },
    ],
    seeAlso: ["chafa", "Sixel", "Kitty graphics protocol", "iTerm2 inline images"],
  },
  {
    slug: "appendix",
    title: "Appendix",
    manual: "APPENDIX(7)",
    name: "appendix - history, safety, accessibility, and references",
    synopsis: ["ECMA-48", "VT100", "xterm", "ANSI.SYS"],
    description: [
      "The terminal is old, layered, and still changing. The appendix keeps historical context and operational cautions close to the practical guide.",
    ],
    sections: [
      {
        id: "history",
        title: "History",
        items: [
          "ECMA-48 standardized control functions for coded character sets.",
          "DEC VT terminals shaped much of the vocabulary still used by terminal emulators.",
          "xterm became a practical compatibility target for many modern terminals.",
          "ANSI.SYS brought escape-sequence control into DOS-era environments.",
        ],
      },
      {
        id: "accessibility",
        title: "Accessibility",
        items: [
          "Do not rely on color alone.",
          "Respect reduced-motion expectations by avoiding constant animation unless useful.",
          "Make output readable when copied into issues, chat, email, and logs.",
          "Consider screen readers and plain text fallbacks for important workflows.",
        ],
      },
      {
        id: "security",
        title: "Security And Safety",
        items: [
          "Sanitize untrusted escape sequences before printing logs or remote output.",
          "Treat OSC 52 clipboard writes as sensitive.",
          "Be careful with bracketed paste and terminal reset behavior.",
          "Document recovery commands such as reset and stty sane.",
        ],
      },
      {
        id: "references",
        title: "Primary References",
        items: [
          "xterm control sequences",
          "ECMA-48",
          "terminfo(5)",
          "console_codes(4)",
          "OpenBSD and Linux manual pages",
        ],
      },
    ],
    seeAlso: ["reset(1)", "stty(1)", "terminfo(5)", "xterm control sequences"],
  },
];

const navLabels: Record<string, string> = {
  "cli-renaissance": "tools",
  "getting-started": "getting started",
};

const pageBySlug = Object.fromEntries(docPages.map((page) => [page.slug, page]));

function navPage(slug: string): NavItem {
  const page = pageBySlug[slug];
  return {
    href: `/${slug}`,
    label: navLabels[slug] ?? page?.slug ?? slug,
  };
}

export const navGroups: NavGroup[] = [
  {
    label: "start",
    items: [{ href: "/", label: "home" }, navPage("getting-started")],
  },
  {
    label: "terminal",
    items: [navPage("ansi"), navPage("capabilities"), navPage("color")],
  },
  {
    label: "output",
    items: [navPage("patterns"), navPage("progress"), { href: "/toolbox", label: "toolbox" }],
  },
  {
    label: "ecosystem",
    items: [navPage("cli-renaissance"), navPage("libraries")],
  },
  {
    label: "media",
    items: [navPage("images")],
  },
  {
    label: "reference",
    items: [navPage("appendix")],
  },
];

export const navPages = navGroups.flatMap((group) => group.items).filter((item) => item.href !== "/");

export function getPage(slug: string) {
  return docPages.find((page) => page.slug === slug);
}
