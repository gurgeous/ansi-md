type Chapter = {
  num: number;
  name: string;
  url: string;
  phrase: string;
};

export const chapters: Chapter[] = [
  { num: 0, name: "Home", url: "/", phrase: "Home" },
  { num: 0, name: "ENV & Capabilities", url: "/detection", phrase: "OMG why is this so hard" },
  { num: 0, name: "ANSI 256, Tailwind ...", url: "/colors", phrase: "color tooling" },
  { num: 0, name: "How to CLI", url: "/rules", phrase: "the difference between meh and awesome cli" },
  { num: 0, name: "Progress Bars & Spinners", url: "/progs", phrase: "the fun stuff" },
  { num: 0, name: "Recommended Apps", url: "/apps", phrase: "I love CLI. Like, a lot" },
  { num: 0, name: "Recommended Libraries", url: "/libs", phrase: "modern cli libraries" },
  { num: 0, name: "Recommended Terminals", url: "/terms", phrase: "modern terminals" },
  { num: 0, name: "Advanced ANSI Stuff", url: "/advanced", phrase: "don't read this" },
  { num: 0, name: "LLMs and CLI", url: "/llms", phrase: "prompting suggestions" },
  { num: 0, name: "Windows", url: "/windows", phrase: "I know very little about this topic" },
  { num: 0, name: "Further Reading", url: "/more", phrase: "if you aren't bored yet" },
];

for (const [ii, c] of chapters.entries()) {
  c.num = ii;
}
