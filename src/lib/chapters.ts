type Chapter = {
  name: string;
  url: string;
  phrase: string;
};

export const chapters: Chapter[] = [
  { name: "Home", url: "/", phrase: "start here" },
  { name: "ENV & Capabilities", url: "/detection", phrase: "OMG why is this so hard" },
  { name: "ANSI 256, Tailwind...", url: "/colors", phrase: "color tooling" },
  { name: "How to CLI", url: "/rules", phrase: "the difference between meh and awesome cli" },
  { name: "Progress Bars & Spinners", url: "/progs", phrase: "the fun stuff" },
  { name: "Recommended Apps", url: "/apps", phrase: "I love CLI. Like, a lot" },
  { name: "Recommended Libraries", url: "/libs", phrase: "modern cli libraries" },
  { name: "Recommended Terminals", url: "/terms", phrase: "modern terminals" },
  { name: "Advanced ANSI Stuff", url: "/advanced", phrase: "don't read this" },
  { name: "LLMs and CLI", url: "/llms", phrase: "prompting suggestions" },
  { name: "Windows", url: "/windows", phrase: "I know very little about this topic" },
  { name: "Further Reading", url: "/more", phrase: "if you aren't bored yet" },
];
