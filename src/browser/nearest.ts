// Client-side behavior for nearest color stuff
import Ansi from "@/lib/ansi.ts";
import { NamedColor, nearestColor, normalizeHexInput, parseHex, type NamedColorInit } from "@/lib/color.ts";

//
// types
//

const EMPTY_SWATCH = "#d4d4d4";

//
// main
//

// Owns DOM state and rendering for one converter instance.
class NearestTool {
  ansi256: NamedColor[]; // lazy ANSI 256 lookup entries
  tailwind: NamedColor[]; // lazy Tailwind lookup entries
  $root: HTMLElement;
  $input: HTMLInputElement;
  $fields: Record<string, HTMLElement>;
  $swatches: Record<string, SVGRectElement>;

  constructor($root: HTMLElement, init: any) {
    // parse init data
    this.ansi256 = NamedColor.fromData(init.ansi256);
    this.tailwind = NamedColor.fromData(init.tailwind);

    // find elements
    this.$root = $root;
    this.$input = $root.querySelector("input")!;
    this.$fields = dataMap<HTMLElement>($root, "field");
    this.$swatches = dataMap<SVGRectElement>($root, "swatch");

    // events
    this.$input.addEventListener("input", this.onInput.bind(this));
  }

  //
  // events
  //

  // Normalize as the user types and search once a full hex exists.
  onInput() {
    this.inputValue = normalizeHexInput(this.inputValue);
    const hex = parseHex(this.inputValue);
    if (!hex) {
      this.reset();
    } else {
      this.render(hex);
    }
  }

  //
  // one-liners
  //

  get inputValue() { return this.$input.value } // prettier-ignore
  set inputValue(value: string) { this.$input.value = value } // prettier-ignore

  //
  // render
  //

  // Render one complete converter result.
  render(hex: string) {
    const matches = {
      ansi: nearestColor(hex, this.ansi256),
      tailwind: nearestColor(hex, this.tailwind),
    };

    this.$root.classList.remove("is-empty");

    this.$fields.inputHex.textContent = hex;
    this.$swatches.input.setAttribute("fill", hex);

    this.$swatches.ansi.setAttribute("fill", matches.ansi.hex);
    this.$fields.ansiHex.textContent = matches.ansi.hex;
    this.$fields.ansiIndex.textContent = matches.ansi.name;
    this.$fields.ansiFg.textContent = Ansi.fg256(Number(matches.ansi.name));
    this.$fields.ansiBg.textContent = Ansi.bg256(Number(matches.ansi.name));

    this.$swatches.tailwind.setAttribute("fill", matches.tailwind.hex);
    this.$fields.tailwindHex.textContent = matches.tailwind.hex;
    this.$fields.tailwindName.textContent = matches.tailwind.name;
  }

  // Restore the initial waiting state for empty or incomplete input.
  reset() {
    for (const $swatch of Object.values(this.$swatches)) {
      $swatch.setAttribute("fill", EMPTY_SWATCH);
    }
    this.$root.classList.add("is-empty");
  }
}

//
// init
//

// Attach converter behavior to every matching tool on the page.
export function initNearest() {
  const $root = document.querySelector(".nearest") as HTMLElement;
  if ($root.dataset.ready === "true") return;
  $root.dataset.ready = "true";

  const $script = $root.querySelector("script") as HTMLScriptElement;
  new NearestTool($root, JSON.parse($script.textContent));
}

//
// helpers
//

// Map elements by a required data attribute.
function dataMap<T extends Element>($root: HTMLElement, name: string) {
  const [selector, attr] = [`[data-${name}]`, `data-${name}`];
  const $array = [...$root.querySelectorAll<T>(selector)];
  return Object.fromEntries($array.map(($i) => [$i.getAttribute(attr) ?? "", $i]));
}
