// Client-side behavior for nearest color stuff
import { nearestColor, normalizeHexInput, parseHex, rgbHex } from "@/lib/color.ts";
import type { Colors, Palette } from "@/lib/palettes";
import Color from "colorjs.io";

//
// types
//

const EMPTY_SWATCH = "#d4d4d4";

type Init = {
  ansi256: Colors;
  ansi256Names: Record<string, string>;
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
  ansi256Names: Record<string, string>;
  tailwind: ColorWithName[];
  $root: HTMLElement;
  $wheel: HTMLCanvasElement;
  $input: HTMLInputElement;
  $fields: Record<string, HTMLElement>;
  $swatches: Record<string, SVGRectElement>;

  constructor($root: HTMLElement, init: Init) {
    this.ansi256 = buildColors(init.ansi256);
    this.ansi256Names = init.ansi256Names;
    this.tailwind = buildPalette(init.tailwind);
    this.$root = $root;
    this.$wheel = $root.querySelector("[data-color-wheel]")!;
    this.$input = $root.querySelector("input")!;
    this.$fields = dataMap<HTMLElement>($root, "field");
    this.$swatches = dataMap<SVGRectElement>($root, "swatch");
    this.$input.addEventListener("input", this.onInput.bind(this));
    this.$wheel.addEventListener("pointermove", this.onWheel.bind(this));
    this.drawWheel();
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

  // Convert wheel position to a full-brightness HSV color.
  onWheel(event: PointerEvent) {
    const rect = this.$wheel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    const saturation = Math.hypot(x, y);
    if (saturation > 1) return;

    const hue = (Math.atan2(y, x) / (Math.PI * 2) + 1) % 1;
    const [r, g, b] = hsvRgb(hue, saturation);
    const hex = rgbHex(r, g, b);
    this.inputValue = hex;
    this.render(hex);
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
    this.$fields.ansiName.textContent = `(${this.ansi256Names[ansi.name]})`;

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

  // Paint the same hue/saturation space used by pointer conversion.
  drawWheel() {
    const context = this.$wheel.getContext("2d")!;
    const image = context.createImageData(this.$wheel.width, this.$wheel.height);
    const center = this.$wheel.width / 2;
    const radius = center - 1;

    for (let y = 0; y < this.$wheel.height; y++) {
      for (let x = 0; x < this.$wheel.width; x++) {
        const dx = x + 0.5 - center;
        const dy = y + 0.5 - center;
        const saturation = Math.hypot(dx, dy) / radius;
        if (saturation > 1) continue;

        const hue = (Math.atan2(dy, dx) / (Math.PI * 2) + 1) % 1;
        const [r, g, b] = hsvRgb(hue, saturation);
        const offset = (y * this.$wheel.width + x) * 4;
        image.data.set([r, g, b, 255], offset);
      }
    }
    context.putImageData(image, 0, 0);
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

// Convert full-brightness HSV coordinates to 8-bit RGB.
function hsvRgb(hue: number, saturation: number) {
  const sector = hue * 6;
  const part = sector - Math.floor(sector);
  const low = 1 - saturation;
  const falling = 1 - part * saturation;
  const rising = 1 - (1 - part) * saturation;
  const channels = [
    [1, rising, low],
    [falling, 1, low],
    [low, 1, rising],
    [low, falling, 1],
    [rising, low, 1],
    [1, low, falling],
  ][Math.floor(sector) % 6];
  return channels.map((channel) => Math.round(channel * 255));
}
