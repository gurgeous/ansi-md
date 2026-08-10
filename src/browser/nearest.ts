// Client-side behavior for nearest color stuff
import Ansi from "@/lib/ansi.ts";
import { nearestColor, normalizeHexInput, parseHex } from "@/lib/color.ts";
import type { Colors, Palette } from "@/lib/palettes";
import Color from "colorjs.io";

//
// types
//

const EMPTY_SWATCH = "#d4d4d4";

type Init = {
  ansi256: Colors;
  tailwind: Palette;
};

// simple subclass to stuff our name in there
class ColorWithName extends Color {
  name: string;

  constructor(name: string, value: string) {
    super(value);
    this.name = name;
  }
}

//
// main
//

// Owns DOM state and rendering for one converter instance.
class NearestTool {
  ansi256: ColorWithName[];
  tailwind: ColorWithName[];
  $root: HTMLElement;
  $input: HTMLInputElement;
  $fields: Record<string, HTMLElement>;
  $swatches: Record<string, SVGRectElement>;

  constructor($root: HTMLElement, init: Init) {
    this.ansi256 = buildColors(init.ansi256);
    this.tailwind = buildPalette(init.tailwind);
    this.$root = $root;
    this.$input = $root.querySelector("input")!;
    this.$fields = dataMap<HTMLElement>($root, "field");
    this.$swatches = dataMap<SVGRectElement>($root, "swatch");
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
    const needle = new Color(hex);

    this.$root.classList.remove("is-empty");

    this.$fields.inputHex.textContent = hex;
    this.$swatches.input.setAttribute("fill", hex);

    // ansi
    const ansi = nearestColor(needle, this.ansi256) as ColorWithName;
    const ansiHex = ansi.toString({ format: "hex", collapse: false });
    this.$swatches.ansi.setAttribute("fill", ansiHex);
    this.$fields.ansiHex.textContent = ansiHex;
    this.$fields.ansiIndex.textContent = ansi.name;

    // tailwind
    const tailwind = nearestColor(needle, this.tailwind) as ColorWithName;
    const tailwindHex = tailwind.toString({ format: "hex", collapse: false });
    this.$swatches.tailwind.setAttribute("fill", tailwindHex);
    this.$fields.tailwindHex.textContent = tailwindHex;
    this.$fields.tailwindName.textContent = tailwind.name;
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

// Build one flat search list from a simple color map.
function buildColors(colors: Colors): ColorWithName[] {
  return Object.entries(colors).map(([name, hex]) => new ColorWithName(name, hex));
}

// Flatten a nested palette into one color-id map, then parse it once.
function buildPalette(palette: Palette): ColorWithName[] {
  const colors = Object.fromEntries(
    Object.entries(palette).flatMap(([family, shades]) => {
      return Object.entries(shades).map(([shade, hex]) => [`${family}-${shade}`, hex]);
    }),
  );
  return buildColors(colors);
}
