// Defines the site chapter order used by navigation and placeholder pages.
// Keep this list human-curated so the outline reflects editorial intent.
export const chapters: Chapter[] = [
  { name: "Home", url: "/", phrase: "start here" },
  { name: "ENV & Detection", url: "/env", phrase: "OMG why is this so hard" },
  { name: "Color Design", url: "/colors", phrase: "all about color palettes" },
  { name: "CLI Design", url: "/cli", phrase: "the difference between meh and awesome cli" },
  { name: "Progress Bars & Spinners", url: "/progs", phrase: "the fun stuff" },
  { name: "ANSI Escape Codes", url: "/ansi", phrase: "just the basics, ha" },
  { name: "Advanced ANSI", url: "/advanced", phrase: "don't read this" },
  { name: "Recommended Apps, Libraries & Terminals", url: "/recs", phrase: "stuff I personally like" },
];

// Navigation item rendered in the site table of contents.
type Chapter = {
  name: string;   // Title shown in navigation.
  url: string;    // Site route for this chapter.
  phrase: string; // Informal teaser copy; editorial, not generated.
};
