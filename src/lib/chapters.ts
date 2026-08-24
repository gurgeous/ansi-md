// Defines the site navigation used by the sidebar and home page.
// Keep this list human-curated so the outline reflects editorial intent.
export const chapters: Section[] = [
  {
    name: "Pages",
    items: [
      { name: "Home", url: "/", phrase: "you are here" },
      { name: "ENV & Capabilities", url: "/env", phrase: "OMG why is this so hard" },
      { name: "Color Depth", url: "/colors", phrase: "all about color palettes" },
      { name: "CLI Best Practices", url: "/cli", phrase: "the difference between meh and awesome cli" },
      { name: "Progress Bars & Spinners", url: "/progress", phrase: "the fun stuff" },
      { name: "The TUI", url: "/tui", phrase: "pretty apps" },
      { name: "ANSI Escape Codes", url: "/escapes", phrase: "just the basics, ha" },
      { name: "Advanced ANSI Stuff", url: "/advanced", phrase: "don't read this" },
      { name: "Recommended Apps & Libs", url: "/recs", phrase: "stuff I personally like" },
    ],
  },
  {
    name: "Tools",
    items: [
      {
        name: "Bad Colors",
        url: "/bad-colors",
        phrase: "see ANSI 16 fail across terminal themes",
      },
      {
        name: "Nearest Color",
        url: "/nearest",
        phrase: "nearest ANSI 256 and Tailwind matches",
      },
      {
        name: "Giant Contrast Table",
        url: "/giant",
        phrase: "see lots of colors on light and dark",
      },
    ],
  },
  {
    name: "Palettes",
    items: [
      { name: "ANSI 256 Color Cube", url: "/ansi256", phrase: "ansi 256 names-as-code" },
      { name: "Catppuccin Colors", url: "/catppuccin", phrase: "Catppuccin-as-code" },
      {
        name: "D3 Ordinal Scales",
        url: "/d3-ordinal",
        phrase: "d3 scales-as-code",
      },
      { name: "Tailwind Colors", url: "/tailwind", phrase: "tailwind colors-as-code" },
    ],
  },
];

// Navigation section rendered in the site table of contents.
type Section = {
  name: string;
  items: Chapter[];
};

// Navigation item rendered in the site table of contents.
type Chapter = {
  name: string;   // Title shown in navigation.
  url: string;    // Site route for this chapter.
  phrase: string; // Informal teaser copy; editorial, not generated.
};
