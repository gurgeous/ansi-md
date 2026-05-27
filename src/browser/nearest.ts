// Client-side behavior for nearest color stuff
import Ansi from "@/lib/ansi.ts";
import type { Colors, Palette } from "@/lib/palettes";
import Color from "colorjs.io";
import { nearestColorIndex, normalizeHexInput, parseHex } from "@/lib/color.ts";

//
// types
//

const EMPTY_SWATCH = "#d4d4d4";

type PaletteState = {
  colors: Color[];
  hexes: string[];
  ids: string[];
};

type Init = {
  ansi256: Colors;
  tailwind: Palette;
};

//
// main
//

// Owns DOM state and rendering for one converter instance.
class NearestTool {
  ansi256: PaletteState;
  tailwind: PaletteState;
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
    const ansi = nearestColorIndex(needle, this.ansi256.colors);
    const tailwind = nearestColorIndex(needle, this.tailwind.colors);

    this.$root.classList.remove("is-empty");

    this.$fields.inputHex.textContent = hex;
    this.$swatches.input.setAttribute("fill", hex);

    this.$swatches.ansi.setAttribute("fill", this.ansi256.hexes[ansi]!);
    this.$fields.ansiHex.textContent = this.ansi256.hexes[ansi]!;
    this.$fields.ansiIndex.textContent = this.ansi256.ids[ansi]!;
    this.$fields.ansiFg.textContent = Ansi.fg256(Number(this.ansi256.ids[ansi]!));
    this.$fields.ansiBg.textContent = Ansi.bg256(Number(this.ansi256.ids[ansi]!));

    this.$swatches.tailwind.setAttribute("fill", this.tailwind.hexes[tailwind]!);
    this.$fields.tailwindHex.textContent = this.tailwind.hexes[tailwind]!;
    this.$fields.tailwindName.textContent = this.tailwind.ids[tailwind]!;
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

// Build one flat search state from a simple color map.
function buildColors(colors: Colors): PaletteState {
  const ids = Object.keys(colors);
  const hexes = ids.map((id) => colors[id]!);
  return { ids, hexes, colors: hexes.map((hex) => new Color(hex)) };
}

// Flatten a nested palette into one color-id map, then parse it once.
function buildPalette(palette: Palette): PaletteState {
  const colors = Object.fromEntries(
    Object.entries(palette).flatMap(([family, shades]) => {
      return Object.entries(shades).map(([shade, hex]) => [`${family}-${shade}`, hex]);
    }),
  );
  return buildColors(colors);
}
