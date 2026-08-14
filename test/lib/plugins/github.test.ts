import { remarkGitHubRepoLinks } from "@/lib/plugins/github.mjs";

function transform(child: object, overrides = {}) {
  const paragraph = { type: "paragraph", children: [child] };
  remarkGitHubRepoLinks({ overrides })({ type: "root", children: [paragraph] });
  return paragraph.children;
}

describe("remarkGitHubRepoLinks", () => {
  test.each([
    {
      type: "link",
      url: "https://github.com/yorukot/superfile",
      children: [{ type: "text", value: "https://github.com/yorukot/superfile" }],
    },
    { type: "text", value: "github.com/yorukot/superfile" },
    { type: "text", value: "github/yorukot/superfile" },
  ])("links and shortens $type repository references", (child) => {
    expect(transform(child)).toEqual([
      {
        type: "link",
        url: "https://github.com/yorukot/superfile",
        children: [{ type: "text", value: "superfile" }],
      },
    ]);
  });

  test("preserves surrounding text and applies overrides", () => {
    expect(
      transform({ type: "text", value: "See github/yorukot/superfile." }, { "yorukot/superfile": "Superfile" }),
    ).toEqual([
      { type: "text", value: "See " },
      {
        type: "link",
        url: "https://github.com/yorukot/superfile",
        children: [{ type: "text", value: "Superfile" }],
      },
      { type: "text", value: "." },
    ]);
  });
});
