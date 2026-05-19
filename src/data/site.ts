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
  seeAlso?: DocLink[];
};

export type DocLink = {
  label: string;
  href: string;
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
    synopsis: [
      "plain output first",
      "isatty(stdout) && !NO_COLOR",
      "8 color -> 256 color -> truecolor",
      "stderr logs, stdout data",
    ],
    description: [
      "A good CLI has a plain-text contract before it has color. Color, motion, hyperlinks, and full-screen screens are enhancements over output that already works in pipes, logs, terminals, and issue comments.",
      "Decide interaction, color depth, motion, and output channels explicitly. Most terminal bugs come from guessing one of those.",
    ],
    sections: [
      {
        id: "path",
        title: "Reading Order",
        items: [
          "ANSI: bytes, SGR, resets, cursor motion, erase, OSC.",
          "Capabilities: TTY detection, NO_COLOR, TERM, terminfo, truecolor signals.",
          "Color: semantic roles first, exact palette second.",
          "Patterns: stdout/stderr, quiet/verbose/json, errors, tables.",
          "Progress and libraries: pick the smallest renderer that preserves the output contract.",
        ],
      },
      {
        id: "contract",
        title: "Output Contract",
        table: {
          headers: ["Question", "Default", "Richer mode"],
          rows: [
            ["Is stdout a TTY?", "Plain, stable lines.", "Color, tables, live redraw."],
            ["Is output data?", "Data on stdout; logs on stderr.", "Add --json or --format for scripts."],
            ["Is progress useful?", "Append-only status in CI/pipes.", "Spinner/bar only on TTY."],
            ["Is color required?", "No. State must survive monochrome.", "Use semantic 8-color labels first."],
            [
              "Can output be copied?",
              "Yes: no hidden state, final newline.",
              "Hyperlinks only supplement visible URLs/paths.",
            ],
          ],
        },
      },
      {
        id: "color-choice",
        title: "Color Choice",
        table: {
          headers: ["Need", "Use", "Why"],
          rows: [
            ["status labels", "8/16 color", "Theme-aware and most portable."],
            ["charts or heatmaps", "256 color", "Repeatable palette without requiring RGB."],
            ["brand/exact swatch", "24-bit RGB", "Use only when truecolor is likely or user-forced."],
            ["logs/pipes/CI", "none", "Durability beats decoration."],
          ],
        },
      },
      {
        id: "minimum",
        title: "Minimum Safe Output",
        code: "if [ -t 1 ] && [ -z \"${NO_COLOR:-}\" ]; then\n  printf '\\033[32mok\\033[0m built site\\n'\nelse\n  printf 'ok built site\\n'\nfi",
      },
      {
        id: "checklist",
        title: "Pre-Release Checklist",
        items: [
          "Every styled span has a reset: SGR 0, or targeted resets such as 22, 23, 24, 25, 27, 29, 39, and 49.",
          "NO_COLOR disables default color; FORCE_COLOR or config may opt back in deliberately.",
          "Write data to stdout and diagnostics to stderr.",
          "A non-TTY run has no cursor movement, hidden cursor, alternate screen, or spinner debris.",
          "Tables and progress fit 80 columns, or degrade to a simpler layout.",
          "Interrupts restore cursor, screen, terminal modes, and newline.",
        ],
      },
    ],
    seeAlso: [
      { label: "ANSI escape code reference", href: "/ansi" },
      { label: "Querying terminal capabilities", href: "/capabilities" },
      { label: "CLI output patterns", href: "/patterns" },
      { label: "Toolbox", href: "/toolbox" },
    ],
  },
  {
    slug: "ansi",
    title: "ANSI escape code reference",
    manual: "ANSI(7)",
    name: "ansi - escape sequences for terminal styling and control",
    synopsis: ["CSI: ESC [ params intermediates final", "SGR: ESC [ params m", "OSC: ESC ] command ; payload ST"],
    description: [
      "Escape sequences are terminal instructions embedded in a byte stream. The important split is CSI for structured controls, SGR for graphic rendition, and OSC/DCS for string protocols.",
      "Emit only what you can clean up. Most CLI bugs are missing resets, cursor state leaks, writing controls to logs, or assuming a terminal supports an xterm extension.",
    ],
    sections: [
      {
        id: "grammar",
        title: "Sequence Grammar",
        table: {
          headers: ["Form", "Bytes", "Use"],
          rows: [
            ["C0", "0x00-0x1f", "BEL, BS, TAB, LF, CR, ESC."],
            ["ESC", "ESC final", "Charset shifts, RIS reset, 7-bit C1 introducers."],
            ["CSI", "ESC [ params final", "Cursor motion, erase, SGR, modes."],
            ["OSC", "ESC ] command ; text ST", "Title, hyperlinks, palette, clipboard."],
            ["DCS", "ESC P payload ST", "Device strings, sixel, terminal-specific protocols."],
          ],
        },
      },
      {
        id: "control",
        title: "Control Bytes",
        table: {
          headers: ["Token", "Bytes", "Meaning"],
          rows: [
            ["ESC", "0x1b", "Starts most escape sequences."],
            ["BEL", "0x07", "Terminator for some OSC sequences; also the audible bell."],
            ["CR", "0x0d", "Return to column 1 without advancing; useful for one-line status."],
            ["LF", "0x0a", "Advance to next line; terminal may also perform CR depending on mode."],
            ["CSI", "ESC [", "Control Sequence Introducer, used for SGR, cursor movement, and erasing."],
            ["OSC", "ESC ]", "Operating System Command, used for title changes, hyperlinks, and clipboard operations."],
            ["ST", "ESC \\\\", "String Terminator for OSC and related sequences."],
          ],
        },
      },
      {
        id: "sgr",
        title: "SGR Attributes",
        table: {
          headers: ["Code", "Name", "Reset", "Notes"],
          rows: [
            ["0", "reset", "0", "Clear all rendition state; safest cleanup."],
            ["1", "bold", "22", "May also brighten 8-color foregrounds in some themes."],
            ["2", "faint", "22", "Often unsupported or low contrast."],
            ["3", "italic", "23", "Common in modern terminals, absent in old ones."],
            ["4", "underline", "24", "Good for links and paths; styled underlines vary."],
            ["5", "blink", "25", "Often disabled; reserve for rare alerts or compatibility notes."],
            ["7", "inverse", "27", "Good for selected rows; theme-dependent contrast."],
            ["8", "conceal", "28", "Avoid for secrets; copied text may still contain it."],
            ["9", "strike", "29", "Useful for deleted/obsolete state; uneven support."],
            ["39", "default fg", "39", "Reset foreground without touching other attributes."],
            ["49", "default bg", "49", "Reset background without touching other attributes."],
          ],
        },
      },
      {
        id: "color",
        title: "Color Forms",
        table: {
          headers: ["Form", "Foreground", "Background", "Use"],
          rows: [
            ["default", "39", "49", "Return to theme default without clearing bold/underline."],
            ["8 color", "30-37", "40-47", "Portable semantic color; user theme chooses actual RGB."],
            ["16 color", "90-97", "100-107", "Bright aliases; can conflict with bold-as-bright behavior."],
            ["256 color", "38;5;n", "48;5;n", "Stable xterm palette for charts, swatches, progress lanes."],
            ["24-bit RGB", "38;2;r;g;b", "48;2;r;g;b", "Exact color when truecolor support is likely."],
          ],
        },
      },
      {
        id: "palette-256",
        title: "256-Color Indexes",
        table: {
          headers: ["Range", "Meaning", "Formula"],
          rows: [
            ["0-15", "ANSI and bright ANSI colors", "Theme-controlled; not fixed RGB."],
            ["16-231", "6x6x6 color cube", "16 + 36r + 6g + b, with r/g/b in 0..5."],
            ["232-255", "24 grayscale steps", "Dark to light; useful for separators and ramps."],
          ],
        },
      },
      {
        id: "cursor",
        title: "Cursor And Erase",
        table: {
          headers: ["Sequence", "Meaning", "Typical use"],
          rows: [
            ["ESC[nA/B/C/D", "move up/down/right/left", "Bounded redraw; never assume scrollback position."],
            ["ESC[nG", "move to column n", "Counters, labels, fixed progress columns."],
            ["ESC[s / ESC[u", "save / restore cursor", "Convenient but less portable than explicit movement."],
            ["ESC[?25l / ESC[?25h", "hide / show cursor", "Always restore on exit and signal."],
            ["ESC[2K", "clear entire line", "Rewrite shorter status lines safely."],
            ["ESC[J / ESC[2J", "clear below / screen", "Only for full-screen tools; hostile in logs."],
            ["ESC[?1049h / ESC[?1049l", "alternate screen on/off", "Full-screen TUIs; restore even on crash."],
          ],
        },
      },
      {
        id: "osc",
        title: "OSC Protocols",
        table: {
          headers: ["Command", "Form", "Use", "Risk"],
          rows: [
            ["0/2", "OSC 2 ; title ST", "Window/tab title.", "Restore or keep polite."],
            ["8", "OSC 8 ; params ; URI ST text OSC 8 ;; ST", "Clickable links.", "Visible text must still be useful."],
            [
              "52",
              "OSC 52 ; target ; base64 ST",
              "Clipboard write/read in some terminals.",
              "Sensitive; never from untrusted output.",
            ],
            ["10/11", "OSC 10/11 ; ? ST", "Query/set foreground/background.", "Responses can confuse simple readers."],
          ],
        },
      },
      {
        id: "failure",
        title: "Failure Modes",
        items: [
          "Missing SGR reset bleeds color into the shell prompt.",
          "Writing cursor controls to a pipe creates unreadable logs.",
          "Unterminated OSC strings can swallow following output until BEL or ST.",
          "Counting bytes instead of display cells misaligns Unicode output.",
          "Printing untrusted escape sequences can spoof logs, links, titles, or clipboard operations.",
        ],
      },
    ],
    seeAlso: [
      { label: "ECMA-48", href: "https://ecma-international.org/publications-and-standards/standards/ecma-48/" },
      { label: "xterm control sequences", href: "https://invisible-island.net/xterm/ctlseqs/ctlseqs.html" },
      { label: "terminfo(5)", href: "https://man7.org/linux/man-pages/man5/terminfo.5.html" },
      { label: "console_codes(4)", href: "https://man7.org/linux/man-pages/man4/console_codes.4.html" },
    ],
  },
  {
    slug: "capabilities",
    title: "Querying terminal capabilities",
    manual: "CAPABILITIES(7)",
    name: "capabilities - detect terminal features without lying to users",
    synopsis: ["isatty(1)", "NO_COLOR / FORCE_COLOR", "TERM=xterm-256color", "infocmp $TERM && tput colors"],
    description: [
      "Capability detection is a policy decision over imperfect signals. TTY state tells you whether live output is appropriate; environment variables express user intent; terminfo describes portable capabilities; probes confirm specific extensions.",
      "Use detection to choose a ceiling, not to override users. A wrong false positive is usually worse than a conservative fallback.",
    ],
    sections: [
      {
        id: "order",
        title: "Decision Order",
        table: {
          headers: ["Step", "Signal", "Action"],
          rows: [
            ["1", "stdout/stderr is not a TTY", "Disable live redraw and default color for that stream."],
            ["2", "NO_COLOR is non-empty", "Disable default ANSI color unless config explicitly overrides."],
            ["3", "FORCE_COLOR or explicit --color=always", "Allow color, but still avoid cursor motion in logs."],
            ["4", "TERM=dumb or unknown", "Use plain text; no cursor addressing."],
            ["5", "terminfo/tput", "Enable portable colors, clear-line, cursor movement, alternate screen."],
            ["6", "COLORTERM/probes/allowlist", "Enable truecolor, hyperlinks, images, or clipboard only when useful."],
          ],
        },
      },
      {
        id: "environment",
        title: "Environment Variables",
        terms: [
          {
            term: "TERM",
            description: "Names the terminal capability entry. It is necessary but often not sufficient.",
          },
          {
            term: "COLORTERM",
            description: "Common truecolor hint when value is truecolor or 24bit; not standardized by terminfo.",
          },
          { term: "NO_COLOR", description: "Non-empty value means default color should be disabled." },
          {
            term: "FORCE_COLOR",
            description: "User or tooling request to force color; define precedence with --color and config.",
          },
          { term: "CI", description: "Prefer append-only logs; some CI systems still support color." },
          { term: "TERM_PROGRAM", description: "Useful for extension allowlists, not a portable capability contract." },
          { term: "WT_SESSION", description: "Windows Terminal hint; still treat legacy conhost separately." },
        ],
      },
      {
        id: "terminfo",
        title: "terminfo",
        body: [
          "terminfo is the portable vocabulary for classic terminal features. Prefer it for cursor movement, erase sequences, color count, and alternate screen when writing low-level renderers.",
        ],
        code: "infocmp \"$TERM\" | sed -n '1,20p'\nprintf 'colors=%s\\n' \"$(tput colors 2>/dev/null || printf 0)\"\nprintf 'setaf-red=%q\\n' \"$(tput setaf 1 2>/dev/null)\"\nprintf 'clear-line=%q\\n' \"$(tput el 2>/dev/null)\"",
      },
      {
        id: "capabilities",
        title: "Useful terminfo Names",
        table: {
          headers: ["Capability", "Meaning", "Use"],
          rows: [
            ["colors", "number of colors", "0/8/16/256 gate for palette choice."],
            ["setaf/setab", "ANSI foreground/background", "Use instead of hard-coding when portability matters."],
            ["sgr0", "reset attributes", "Cleanup; equivalent intent to SGR 0."],
            ["bold, dim, smul, rmul, rev", "text attributes", "Style only when present or harmless."],
            ["el", "clear to end of line", "Safer single-line redraw."],
            ["cuu/cud/cuf/cub/hpa", "cursor movement", "Multi-line progress and fixed columns."],
            ["civis/cnorm", "hide/show cursor", "Live renderers; restore on exit."],
            ["smcup/rmcup", "alternate screen", "Full-screen TUIs."],
          ],
        },
      },
      {
        id: "truecolor",
        title: "Truecolor",
        table: {
          headers: ["Signal", "Strength", "Notes"],
          rows: [
            ["COLORTERM=truecolor/24bit", "strong hint", "Common in modern terminals."],
            ["TERM contains -direct", "strong hint", "Direct-color terminfo entries exist but are not universal."],
            ["Known terminal allowlist", "medium", "Good for bundled apps; keep override available."],
            ["Probe response", "strongest", "Interactive only; avoid blocking startup."],
            ["TERM=xterm-256color", "not enough", "Often means 256 colors, not RGB."],
          ],
        },
      },
      {
        id: "compatibility",
        title: "Compatibility Matrix",
        table: {
          headers: ["Terminal", "Generally safe assumptions", "Check before use"],
          rows: [
            ["xterm", "CSI, SGR, 256 colors, alternate screen", "OSC 52, hyperlinks, direct color config"],
            ["iTerm2", "truecolor, OSC 8, inline images", "protocol-specific media and clipboard policy"],
            ["Terminal.app", "SGR, 256 colors, truecolor", "OSC extensions and profile differences"],
            ["Windows Terminal", "truecolor, OSC 8, modern VT", "legacy conhost and older Windows versions"],
            ["Alacritty", "truecolor, fast CSI/SGR", "image protocols and optional extensions"],
            ["Kitty", "truecolor, keyboard protocol, graphics protocol", "fallback outside Kitty-compatible terminals"],
            ["WezTerm", "truecolor, OSC 8, rich protocols", "user config can disable features"],
            ["Ghostty", "modern color/protocol support", "version-specific feature gates"],
          ],
        },
      },
      {
        id: "unicode",
        title: "Unicode Width",
        items: [
          "Measure display width, not string length.",
          "Emoji, combining marks, and ambiguous-width characters can break aligned output.",
          "East Asian ambiguous width may differ by locale or terminal setting.",
          "Cache measured widths only by Unicode version and terminal policy if you control both.",
          "Use ASCII fallbacks for progress and spinners when width support is uncertain.",
        ],
      },
    ],
    seeAlso: [
      { label: "terminfo(5)", href: "https://man7.org/linux/man-pages/man5/terminfo.5.html" },
      { label: "infocmp(1)", href: "https://man7.org/linux/man-pages/man1/infocmp.1.html" },
      { label: "tput(1)", href: "https://man7.org/linux/man-pages/man1/tput.1.html" },
      { label: "NO_COLOR", href: "https://no-color.org/" },
    ],
  },
  {
    slug: "color",
    title: "Color and palettes",
    manual: "COLOR(7)",
    name: "color - terminal palettes, contrast, and practical ANSI color use",
    synopsis: [
      "semantic role -> ANSI color",
      "8/16 for status, 256 for ramps, RGB for exact swatches",
      "never color-only",
    ],
    description: [
      "Terminal color is negotiated with the user theme. ANSI colors are semantic slots, not fixed RGB. Exact colors are useful, but only after the interface works with ordinary foreground, background, bold, and spacing.",
    ],
    sections: [
      {
        id: "depth",
        title: "Color Depth",
        table: {
          headers: ["Depth", "Best use", "Avoid"],
          rows: [
            ["none", "pipes, logs, CI, accessibility baseline", "encoding state only in lost color"],
            ["8 color", "status roles and readable emphasis", "precise brand or chart palettes"],
            ["16 color", "stronger semantic contrast", "assuming bright means same RGB everywhere"],
            ["256 color", "charts, sparklines, ramps, fixed swatches", "theme-sensitive foreground text"],
            ["24-bit", "exact previews, gradients, brand, images", "default CLI status output"],
          ],
        },
      },
      {
        id: "roles",
        title: "Semantic Roles",
        table: {
          headers: ["Role", "Suggested ANSI", "Fallback"],
          rows: [
            ["success", "green", "ok, done, checkmark, final count"],
            ["warning", "yellow", "warn label, reason, next action"],
            ["error", "red", "error label, path:line, exit code"],
            ["info", "blue or cyan", "info label and indentation"],
            ["muted", "default + dim", "parentheses, punctuation, lower detail"],
            ["selection", "inverse", "leading marker and current row text"],
            ["link/path", "underline or cyan", "visible URL/path text"],
          ],
        },
      },
      {
        id: "ansi-slots",
        title: "ANSI Color Slots",
        table: {
          headers: ["Slot", "FG", "BG", "Typical role"],
          rows: [
            ["black", "30", "40", "rare foreground; separators on light themes"],
            ["red", "31", "41", "errors, destructive state"],
            ["green", "32", "42", "success, passing state"],
            ["yellow", "33", "43", "warnings, waiting, partial state"],
            ["blue", "34", "44", "links, information, headings"],
            ["magenta", "35", "45", "special category, diff metadata"],
            ["cyan", "36", "46", "paths, hints, secondary facts"],
            ["white", "37", "47", "high contrast, but theme-dependent"],
            ["default", "39", "49", "reset a color channel without clearing attributes"],
          ],
        },
      },
      {
        id: "palette-256",
        title: "256-Color Palette",
        table: {
          headers: ["Range", "What it is", "Good use"],
          rows: [
            ["0-15", "theme-controlled ANSI slots", "semantic status and user-respecting UI"],
            ["16-231", "6-level RGB cube", "heatmaps, color pickers, deterministic examples"],
            ["232-255", "grayscale ramp", "subtle rules, disabled state, monochrome charts"],
          ],
        },
      },
      {
        id: "contrast",
        title: "Contrast",
        items: [
          "Assume light, dark, transparent, image, and high-contrast terminal themes.",
          "Prefer labels, punctuation, indentation, and ordering over low-contrast shade differences.",
          "Do not put fixed RGB foreground on an unknown theme background unless you also set background.",
          "Check both light and dark theme contrast when designing a fixed palette.",
          "Use default foreground for body text; color the smallest useful token.",
        ],
      },
      {
        id: "mistakes",
        title: "Common Mistakes",
        items: [
          "Using red/green as the only success/failure signal.",
          "Using dim for important diagnostics; some themes make it nearly invisible.",
          "Using truecolor for routine success/error output, bypassing user themes.",
          "Resetting with SGR 0 mid-sentence and accidentally dropping bold/underline state.",
          "Assuming ANSI 0-15 have fixed RGB values.",
        ],
      },
    ],
    seeAlso: [
      { label: "NO_COLOR", href: "https://no-color.org/" },
      { label: "WCAG contrast", href: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" },
      { label: "xterm 256 color palette", href: "/ansi#palette-256" },
    ],
  },
  {
    slug: "cli-renaissance",
    title: "The CLI renaissance",
    manual: "TOOLS(7)",
    name: "tools - modern command line tools worth studying",
    synopsis: ["rg pattern", "fd name", "bat file", "yazi", "zoxide query"],
    description: [
      "Modern CLIs are design references. The best ones are fast, pipeable, respectful of ignore files, readable by default, and richer only when attached to a terminal.",
      "Study the behavior, not just the features: defaults, output channels, color policy, preview ergonomics, config discoverability, and fallbacks.",
    ],
    sections: [
      {
        id: "search",
        title: "Search And Discovery",
        table: {
          headers: ["Tool", "Use", "Design lesson"],
          rows: [
            ["ripgrep", "recursive text search", "Fast default path, respects ignore files, useful plain output."],
            ["fd", "file discovery", "Human defaults over POSIX completeness; still scriptable."],
            ["fzf", "interactive selection", "Turns streams into UI without owning the whole workflow."],
            ["skim", "fzf-like filtering", "Good reminder to keep fuzzy pickers stream-oriented."],
          ],
        },
      },
      {
        id: "navigation",
        title: "Viewing And Navigation",
        table: {
          headers: ["Tool", "Use", "Design lesson"],
          rows: [
            ["bat", "file viewing", "Color and paging enhance cat/less without hiding text."],
            ["eza", "directory listing", "Dense columns, icons optional, git state as compact annotation."],
            ["yazi", "TUI file manager", "Preview panes and async work can still feel terminal-native."],
            ["zoxide", "directory jumping", "Approximate commands can be predictable with good ranking."],
            ["lsd", "directory listing", "Icon/color defaults need strong no-icon/plain modes."],
          ],
        },
      },
      {
        id: "workflows",
        title: "Workflow Tools",
        table: {
          headers: ["Area", "Tools", "What to copy"],
          rows: [
            ["git", "delta, lazygit, gh", "Side-by-side diffs, readable commands, hosted workflow shortcuts."],
            ["system", "btop, dust, duf, hyperfine", "Visual summaries with fast startup and obvious units."],
            ["data/http", "jq, yq, xh, httpie", "Structured output, color when TTY, machine mode when piped."],
            ["shell", "starship, atuin, direnv, just, mise", "Small prompt/task/env tools with explicit scope."],
            ["dev", "watchexec, entr, bacon, cargo-nextest", "Fast feedback loops, concise failure display."],
          ],
        },
      },
      {
        id: "recommendation",
        title: "Recommendation Standard",
        items: [
          "Name the job, the classic baseline, and the real improvement.",
          "State the scriptability story: stdout data, stderr logs, color policy, JSON support.",
          "Prefer tools with stable releases, cross-platform packages, and documented plain modes.",
          "Include one command that demonstrates the value in under ten seconds.",
          "Mention where the classic tool is still better: minimal systems, POSIX scripts, muscle memory.",
        ],
      },
      {
        id: "evaluation",
        title: "Evaluation Questions",
        table: {
          headers: ["Question", "Good sign"],
          rows: [
            ["Does it respect pipes?", "No pager, spinner, cursor motion, or color unless requested."],
            ["Can users disable style?", "NO_COLOR, --color=never, --plain, or config."],
            ["Is output stable?", "Human output may change; machine output has a versioned schema."],
            ["Does it fail clearly?", "Exit code, concise error, actionable hint, no stack trace by default."],
            ["Can it compose?", "Reads stdin or paths, writes useful stdout, separates diagnostics."],
          ],
        },
      },
      {
        id: "anti-patterns",
        title: "Anti-Patterns",
        items: [
          "A beautiful default that breaks scripts.",
          "A full-screen TUI for a task that needs one command and a table.",
          "Color themes that cannot be disabled or made accessible.",
          "Progress bars in CI logs.",
          "Shell integration that mutates user config without an explicit install step.",
        ],
      },
    ],
    seeAlso: [
      { label: "bat", href: "https://github.com/sharkdp/bat" },
      { label: "fd", href: "https://github.com/sharkdp/fd" },
      { label: "fzf", href: "https://github.com/junegunn/fzf" },
      { label: "ripgrep", href: "https://github.com/BurntSushi/ripgrep" },
      { label: "yazi", href: "https://yazi-rs.github.io/" },
      { label: "zoxide", href: "https://github.com/ajeetdsouza/zoxide" },
    ],
  },
  {
    slug: "progress",
    title: "Progress and motion",
    manual: "PROGRESS(7)",
    name: "progress - terminal spinners, progress bars, and live redraws",
    synopsis: ["spinner: unknown duration", "bar: known total", "log: durable output"],
    description: [
      "Progress output should reduce uncertainty without corrupting logs or leaving the terminal in a bad state.",
      "Every live renderer needs a fixed footprint, bounded redraw, cleanup on every exit path, and a non-TTY fallback.",
    ],
    sections: [
      {
        id: "contract",
        title: "Renderer Contract",
        table: {
          headers: ["Requirement", "Reason"],
          rows: [
            ["fixed footprint", "A shorter later frame must not leave old bytes behind."],
            ["single owner", "Only one renderer writes cursor controls at a time."],
            ["bounded refresh rate", "Fast spinners waste CPU and make logs unreadable if captured."],
            ["cleanup hook", "SIGINT, SIGTERM, errors, and normal exit restore cursor and newline."],
            ["non-TTY fallback", "CI and pipes get durable append-only status."],
          ],
        },
      },
      {
        id: "patterns",
        title: "Patterns",
        terms: [
          { term: "spinner", description: "Unknown total; proves liveness only. Pair with current operation text." },
          { term: "progress bar", description: "Known total; include count, unit, rate, and final state when useful." },
          {
            term: "multi-line progress",
            description: "Concurrent work; fixed lanes, cursor-up redraw, stable ordering.",
          },
          { term: "status line", description: "Single changing fact; CR + clear-line is usually enough." },
          { term: "append-only log", description: "CI, pipes, audit trails, or verbose mode." },
        ],
      },
      {
        id: "redraw",
        title: "Single-Line Redraw",
        code: "printf '\\033[?25l'        # hide cursor\nprintf '\\r\\033[2Kbuild [####------] 42%%'\nprintf '\\r\\033[2K\\033[?25h' # clear and restore",
      },
      {
        id: "when",
        title: "Which Pattern",
        table: {
          headers: ["Workload", "TTY", "Non-TTY"],
          rows: [
            ["unknown duration", "spinner + current step", "start/end lines"],
            ["known count", "bar + count + rate", "periodic count lines"],
            ["parallel tasks", "fixed lanes", "task-prefixed append lines"],
            ["fast command", "no progress", "no progress"],
            ["verbose debug", "append log", "append log"],
          ],
        },
      },
      {
        id: "rules",
        title: "Rules",
        items: [
          "Throttle rendering separately from work updates.",
          "Use ASCII fallbacks for bars/spinners when Unicode width is uncertain.",
          "Use ESC[2K before rewriting a line that may become shorter.",
          "Print a final summary line after clearing the live renderer.",
          "Never hide the cursor unless the same code path guarantees restoration.",
        ],
      },
      {
        id: "bad",
        title: "Bad Smells",
        items: [
          "A spinner that keeps running after an error is printed.",
          "A progress bar that emits thousands of lines when redirected.",
          "Multiple workers writing directly to stdout.",
          "A percent with no numerator, denominator, or unit.",
          "Animated output for a command that normally completes in under a second.",
        ],
      },
    ],
    seeAlso: [
      { label: "ESC[2K", href: "/ansi#cursor" },
      { label: "ESC[?25l", href: "/ansi#cursor" },
      { label: "SIGINT", href: "https://man7.org/linux/man-pages/man7/signal.7.html" },
      { label: "CI logs", href: "/patterns#channels" },
    ],
  },
  {
    slug: "patterns",
    title: "CLI output patterns",
    manual: "PATTERNS(7)",
    name: "patterns - durable conventions for command output",
    synopsis: ["tool [--json] [--quiet] [--verbose]", "tool subcommand --help"],
    description: [
      "Beautiful CLI output is an interface contract: predictable channels, stable machine output, readable human output, recoverable errors, and optional richness.",
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
          "Put the most actionable token first: status, path, command, or failing test.",
        ],
      },
      {
        id: "channels",
        title: "Channels",
        table: {
          headers: ["Channel", "Put here", "Avoid"],
          rows: [
            ["stdout", "requested data, normal command result", "progress, debug logs, prompts in scripts"],
            ["stderr", "diagnostics, warnings, progress, prompts", "machine-readable primary data"],
            ["exit code", "success/failure category", "encoding detailed data that belongs in output"],
            ["file", "explicit reports/artifacts", "surprising writes without a flag"],
          ],
        },
      },
      {
        id: "machine",
        title: "Machine Output",
        items: [
          "Provide --json or --format for tools that expose data.",
          "Keep schemas stable and version breaking changes.",
          "Separate logs from data, usually stderr for logs and stdout for data.",
          "Use stable exit codes and document them.",
          "Do not localize machine keys or values unless the format says so.",
        ],
      },
      {
        id: "status",
        title: "Status Labels",
        table: {
          headers: ["Label", "Meaning", "Color"],
          rows: [
            ["ok", "completed successfully", "green"],
            ["warn", "completed with caveat", "yellow"],
            ["error", "failed; action required", "red"],
            ["skip", "intentionally not run", "dim/default"],
            ["run", "currently executing", "cyan/blue"],
            ["info", "context only", "default/cyan"],
          ],
        },
      },
      {
        id: "shell",
        title: "Shell Integration",
        items: [
          "Generate completions for common shells.",
          "Generate help and manpages from the same command model when possible.",
          "Document environment variables and config precedence.",
          "Keep examples safe to paste.",
          "Never edit shell startup files without an explicit install command and a preview.",
        ],
      },
      {
        id: "errors",
        title: "Errors",
        table: {
          headers: ["Part", "Good default"],
          rows: [
            ["headline", "what failed, in one line"],
            ["location", "path:line:column, URL, command, or resource id"],
            ["cause", "short reason without stack trace by default"],
            ["hint", "one next action when known"],
            ["debug", "--verbose or log file for stack traces and internals"],
          ],
        },
      },
      {
        id: "testing",
        title: "Testing",
        items: [
          "Snapshot plain output and colored output separately.",
          "Test with stdout as TTY and as pipe.",
          "Test narrow terminal widths.",
          "Use pseudo-terminals for live redraw behavior.",
          "Strip ANSI before comparing semantic text, but snapshot ANSI for renderer contracts.",
        ],
      },
    ],
    seeAlso: [
      { label: "stdout", href: "/patterns#channels" },
      { label: "stderr", href: "/patterns#channels" },
      { label: "isatty", href: "https://man7.org/linux/man-pages/man3/isatty.3.html" },
      { label: "shell completions", href: "/patterns#shell" },
    ],
  },
  {
    slug: "libraries",
    title: "Library and framework recommendations",
    manual: "LIBRARIES(7)",
    name: "libraries - recommended building blocks for CLI and TUI apps",
    synopsis: ["parser + output helper", "parser + prompt library", "tui framework"],
    description: [
      "Choose the smallest library that matches the interface. A command parser, an output helper, and a full-screen TUI framework solve different problems.",
      "A good recommendation says what job the library owns, what it should not own, how it handles non-TTY output, and how hard it is to test.",
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
            ["Ruby", "OptionParser, Thor", "Small scripts or command suites in Ruby projects."],
            ["Shell", "getopts, docopt-style wrappers", "Minimal scripts; keep parsing boring."],
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
            ["Node.js", "Picocolors, Chalk", "Portable color helpers; keep NO_COLOR policy explicit."],
            ["Go", "Lip Gloss, termenv", "Styles, layout primitives, color profiles."],
            ["Rust", "owo-colors, console, anstyle", "Typed styling, terminal detection, ecosystem integration."],
            ["Ruby", "pastel, tty-color", "Simple styling and color capability checks."],
          ],
        },
      },
      {
        id: "prompts",
        title: "Prompts And Forms",
        table: {
          headers: ["Language", "Recommended", "Use"],
          rows: [
            ["Go", "Huh, survey", "Forms, confirms, selects; good for setup flows."],
            ["Rust", "dialoguer, inquire", "Prompts without committing to a full TUI."],
            ["Python", "questionary, prompt-toolkit", "Shell-like prompts, completions, rich input."],
            ["Node.js", "prompts, enquirer, inquirer", "Interactive setup and generators."],
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
        id: "choice",
        title: "Choosing Scope",
        table: {
          headers: ["Need", "Use", "Do not use"],
          rows: [
            ["flags and help", "parser", "TUI framework"],
            ["colored lines/tables", "output helper", "full app framework"],
            ["one setup wizard", "prompt library", "alternate-screen dashboard"],
            ["live progress", "progress helper", "manual cursor state if library is solid"],
            ["persistent workspace", "TUI framework", "ad hoc escape soup"],
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
          "Do not couple business logic to terminal rendering; keep renderers replaceable in tests.",
          "Do not choose a framework whose layout model cannot handle narrow terminals.",
        ],
      },
      {
        id: "review",
        title: "Library Review Checklist",
        items: [
          "TTY detection and color policy are documented or easy to override.",
          "Renderer can be snapshot-tested without sleeping or racing timers.",
          "Plain output path is first-class.",
          "Dependencies are acceptable for a CLI startup path.",
          "Signals and cleanup are handled or easy to wrap.",
        ],
      },
    ],
    seeAlso: [
      { label: "Cobra", href: "https://cobra.dev/" },
      { label: "Clap", href: "https://docs.rs/clap/latest/clap/" },
      { label: "Rich", href: "https://rich.readthedocs.io/" },
      { label: "Bubble Tea", href: "https://github.com/charmbracelet/bubbletea" },
      { label: "Ratatui", href: "https://ratatui.rs/" },
      { label: "Textual", href: "https://textual.textualize.io/" },
      { label: "Ink", href: "https://github.com/vadimdemedes/ink" },
    ],
  },
  {
    slug: "images",
    title: "Images and rich media",
    manual: "IMAGES(7)",
    name: "images - graphics protocols and terminal media output",
    synopsis: ["chafa image.png", "sixel", "kitty graphics protocol", "iTerm2 inline images"],
    description: [
      "Terminal image support is useful for previews, media tools, and visual debugging, but it is fragmented. Treat image protocols as optional capabilities with text fallbacks.",
    ],
    sections: [
      {
        id: "protocols",
        title: "Protocols",
        table: {
          headers: ["Protocol/tool", "Best use", "Fallback"],
          rows: [
            ["Sixel", "Bitmap graphics in compatible terminals.", "Unicode/ANSI approximation or file path."],
            ["Kitty graphics", "High-quality inline images where supported.", "Chafa or open external viewer."],
            ["iTerm2 images", "Inline images in iTerm2-compatible environments.", "Visible path/link."],
            ["Chafa", "Convert images to terminal cells.", "Plain metadata and dimensions."],
            ["Unicode blocks/Braille", "Tiny plots and thumbnails.", "ASCII art or no preview."],
          ],
        },
      },
      {
        id: "decision",
        title: "When To Use",
        table: {
          headers: ["Task", "Image output?", "Why"],
          rows: [
            ["file manager preview", "yes", "The image is the selected object."],
            ["chart in report", "maybe", "Prefer text table unless shape matters."],
            ["brand logo on startup", "no", "Decoration slows and breaks logs."],
            ["debugging visual data", "yes", "Fast inspection can be worth protocol branching."],
            ["CI output", "no", "Link artifacts instead."],
          ],
        },
      },
      {
        id: "rules",
        title: "Rules",
        items: [
          "Provide text fallbacks.",
          "Gate by terminal support.",
          "Avoid writing binary or opaque escape payloads into logs.",
          "Prefer image output for previews, diagrams, and media tools rather than general CLI branding.",
          "Constrain dimensions; terminal cells are not pixels.",
          "Clear or separate image output before returning to ordinary text.",
        ],
      },
      {
        id: "metadata",
        title: "Useful Fallback Metadata",
        items: [
          "Path or URL.",
          "Dimensions and file size.",
          "Format and color mode.",
          "Generated thumbnail path if available.",
          "Command to open externally.",
        ],
      },
    ],
    seeAlso: [
      { label: "chafa", href: "https://hpjansson.org/chafa/" },
      { label: "Sixel", href: "https://invisible-island.net/xterm/ctlseqs/ctlseqs.html" },
      { label: "Kitty graphics protocol", href: "https://sw.kovidgoyal.net/kitty/graphics-protocol/" },
      { label: "iTerm2 inline images", href: "https://iterm2.com/documentation-images.html" },
    ],
  },
  {
    slug: "appendix",
    title: "Appendix",
    manual: "APPENDIX(7)",
    name: "appendix - history, safety, accessibility, and references",
    synopsis: ["ECMA-48", "VT100", "xterm", "ANSI.SYS"],
    description: [
      "The terminal is old, layered, and still changing. The appendix keeps context, safety rules, and primary references close to the practical guide.",
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
          "Modern emulators add OSC, DCS, graphics, keyboard, and hyperlink extensions unevenly.",
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
          "Use labels and ordering before hue and animation.",
          "Avoid dim text for required diagnostics.",
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
          "Render remote output through an escape-stripping or escaping layer by default.",
          "Do not allow untrusted text to create hyperlinks with trusted-looking labels.",
        ],
      },
      {
        id: "recovery",
        title: "Recovery Commands",
        table: {
          headers: ["Symptom", "Command"],
          rows: [
            ["broken echo/input", "stty sane"],
            ["bad colors/cursor/screen", "reset"],
            ["hidden cursor", "printf '\\033[?25h'"],
            ["alternate screen stuck", "printf '\\033[?1049l'"],
            ["line discipline oddities", "stty sane; reset"],
          ],
        },
      },
      {
        id: "glossary",
        title: "Glossary",
        table: {
          headers: ["Term", "Meaning"],
          rows: [
            ["CSI", "Control Sequence Introducer; ESC [ in 7-bit form."],
            ["SGR", "Select Graphic Rendition; CSI ... m styling."],
            ["OSC", "Operating System Command; string control for titles, links, clipboard."],
            ["DCS", "Device Control String; used by device-specific protocols."],
            ["TTY", "Terminal device; proxy for interactive output."],
            ["terminfo", "Capability database used by curses/tput."],
          ],
        },
      },
      {
        id: "source-quality",
        title: "Source Quality",
        items: [
          "Prefer primary specs, terminal docs, and man pages.",
          "Treat blog posts and wiki tables as hints until checked against primary docs.",
          "Record terminal-specific behavior as terminal-specific, not universal.",
          "Include recovery and fallback guidance next to powerful escape sequences.",
        ],
      },
      {
        id: "references",
        title: "Primary References",
        items: [
          "xterm control sequences: invisible-island.net/xterm/ctlseqs/ctlseqs.html",
          "terminfo(5): man7.org/linux/man-pages/man5/terminfo.5.html",
          "NO_COLOR: no-color.org",
          "console_codes(4): Linux manual pages",
          "ECMA-48 / ISO 6429 control functions",
          "Terminal emulator docs for Kitty, iTerm2, WezTerm, Windows Terminal, xterm.",
        ],
      },
    ],
    seeAlso: [
      { label: "reset(1)", href: "https://man7.org/linux/man-pages/man1/reset.1.html" },
      { label: "stty(1)", href: "https://man7.org/linux/man-pages/man1/stty.1.html" },
      { label: "terminfo(5)", href: "https://man7.org/linux/man-pages/man5/terminfo.5.html" },
      { label: "xterm control sequences", href: "https://invisible-island.net/xterm/ctlseqs/ctlseqs.html" },
    ],
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
