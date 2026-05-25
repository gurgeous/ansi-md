// Defines the site chapter order used by navigation and placeholder pages.
// Keep this list human-curated so the outline reflects editorial intent.
export const chapters: Chapter[] = [
  { name: "Home", url: "/", phrase: "start here" },
  { name: "ENV & Detection", url: "/env", phrase: "OMG why is this so hard" },
  { name: "Color Design", url: "/colors", phrase: "all about color palettes" },
  { name: "CLI Design", url: "/cli", phrase: "the difference between meh and awesome cli" },
  { name: "Progress Bars & Spinners", url: "/progs", phrase: "the fun stuff" },
  { name: "Advanced ANSI", url: "/advanced", phrase: "don't read this" },
  { name: "Recommended Apps and Terminals", url: "/apps_terms", phrase: "modern terminals" },
  { name: "Recommended Libraries", url: "/libs", phrase: "modern cli libraries" },
];

// Navigation item rendered in the site table of contents.
type Chapter = {
  name: string;   // Title shown in navigation.
  url: string;    // Site route for this chapter.
  phrase: string; // Informal teaser copy; editorial, not generated.
};
