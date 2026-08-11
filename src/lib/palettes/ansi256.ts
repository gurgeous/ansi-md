// Shared ANSI 256 palette data for code generation and color tools.

import { rgbHex } from "@/lib/color";
import type { Colors } from "@/lib/palettes";

const CUBE = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff] as const;

// Calculate one ANSI 256 palette color from its 16-255 index.
// https://gist.github.com/hSATAC/1095100
export function hex256(index: number) {
  if (index >= 232) {
    const gray = 8 + (index - 232) * 10;
    return rgbHex(gray, gray, gray);
  }

  const off = index - 16;
  const r = CUBE[Math.floor(off / 36) % 6];
  const g = CUBE[Math.floor(off / 6) % 6];
  const b = CUBE[off % 6];
  return rgbHex(r, g, b);
}

// export Colors
export default Object.fromEntries(range(16, 256).map((ii) => [String(ii), hex256(ii)])) as Colors;

//
// curated names
//

export const ansi256Table = {
  black: 16, // #000000
  navy: 17, // #00005f
  darkblue: 18, // #000087
  dukeblue: 19, // #0000af
  mediumblue: 20, // #0000d7
  blue: 21, // #0000ff
  darkgreen: 22, // #005f00
  bluestone: 23, // #005f5f
  seablue: 24, // #005f87
  endeavour: 25, // #005faf
  royalblue: 26, // #005fd7
  blueribbon: 27, // #005fff
  green: 28, // #008700
  seagreen: 29, // #00875f
  darkcyan: 30, // #008787
  bubbles: 31, // #0087af
  strongblue: 32, // #0087d7
  dodgerblue: 33, // #0087ff
  phosphor: 34, // #00af00
  jade: 35, // #00af5f
  arcadia: 36, // #00af87
  lightseagreen: 37, // #00afaf
  cerulean: 38, // #00afd7
  deepskyblue: 39, // #00afff
  limegreen: 40, // #00d700
  malachite: 41, // #00d75f
  underwater: 42, // #00d787
  oceanic: 43, // #00d7af
  mediumturquoise: 44, // #00d7d7
  neonblue: 45, // #00d7ff
  lime: 46, // #00ff00
  cathode: 47, // #00ff5f
  springgreen: 48, // #00ff87
  mediumspringgreen: 49, // #00ffaf
  plunge: 50, // #00ffd7
  aqua: 51, // #00ffff
  rosewood: 52, // #5f0000
  imperial: 53, // #5f005f
  indigo: 54, // #5f0087
  rebeccapurple: 55, // #5f00af
  spaceopera: 56, // #5f00d7
  electricindigo: 57, // #5f00ff
  darkolivegreen: 58, // #5f5f00
  scorpion: 59, // #5f5f5f
  comet: 60, // #5f5f87
  liberty: 61, // #5f5faf
  slateblue: 62, // #5f5fd7
  genie: 63, // #5f5fff
  olivedrab: 64, // #5f8700
  glade: 65, // #5f875f
  juniper: 66, // #5f8787
  steelblue: 67, // #5f87af
  cornflowerblue: 68, // #5f87d7
  blueberry: 69, // #5f87ff
  kermit: 70, // #5faf00
  mediumseagreen: 71, // #5faf5f
  verdigris: 72, // #5faf87
  tradewind: 73, // #5fafaf
  flyway: 74, // #5fafd7
  bluejeans: 75, // #5fafff
  corrosive: 76, // #5fd700
  koopa: 77, // #5fd75f
  snowpea: 78, // #5fd787
  mediumaquamarine: 79, // #5fd7af
  viking: 80, // #5fd7d7
  athena: 81, // #5fd7ff
  lawngreen: 82, // #5fff00
  scream: 83, // #5fff5f
  flora: 84, // #5fff87
  venice: 85, // #5fffaf
  spindrift: 86, // #5fffd7
  cyan: 87, // #5fffff
  darkred: 88, // #870000
  purple: 89, // #87005f
  darkmagenta: 90, // #870087
  poison: 91, // #8700af
  darkviolet: 92, // #8700d7
  blueviolet: 93, // #8700ff
  brown: 94, // #875f00
  copper: 95, // #875f5f
  candy: 96, // #875f87
  deluge: 97, // #875faf
  gloomy: 98, // #875fd7
  mediumslateblue: 99, // #875fff
  olive: 100, // #878700
  shadow: 101, // #87875f
  mithril: 102, // #878787
  shadowblue: 103, // #8787af
  ube: 104, // #8787d7
  periwinkle: 105, // #8787ff
  applegreen: 106, // #87af00
  asparagus: 107, // #87af5f
  darkseagreen: 108, // #87af87
  gulfstream: 109, // #87afaf
  polo: 110, // #87afd7
  malibu: 111, // #87afff
  pistachio: 112, // #87d700
  lettuce: 113, // #87d75f
  garden: 114, // #87d787
  vista: 115, // #87d7af
  skyblue: 116, // #87d7d7
  lightskyblue: 117, // #87d7ff
  chartreuse: 118, // #87ff00
  stadium: 119, // #87ff5f
  palegreen: 120, // #87ff87
  fungus: 121, // #87ffaf
  aquamarine: 122, // #87ffd7
  glitter: 123, // #87ffff
  firebrick: 124, // #af0000
  darkpink: 125, // #af005f
  flirt: 126, // #af0087
  pirate: 127, // #af00af
  darkorchid: 128, // #af00d7
  brightviolet: 129, // #af00ff
  sienna: 130, // #af5f00
  matrix: 131, // #af5f5f
  tapestry: 132, // #af5f87
  pearlypurple: 133, // #af5faf
  mediumorchid: 134, // #af5fd7
  hedonist: 135, // #af5fff
  darkgoldenrod: 136, // #af8700
  bronze: 137, // #af875f
  rosybrown: 138, // #af8787
  bouquet: 139, // #af87af
  blossom: 140, // #af87d7
  illicit: 141, // #af87ff
  mustard: 142, // #afaf00
  darkkhaki: 143, // #afaf5f
  sage: 144, // #afaf87
  tinfoil: 145, // #afafaf
  lightsteelblue: 146, // #afafd7
  melrose: 147, // #afafff
  kinglime: 148, // #afd700
  conifer: 149, // #afd75f
  wasabi: 150, // #afd787
  fizz: 151, // #afd7af
  lightblue: 152, // #afd7d7
  droplet: 153, // #afd7ff
  greenyellow: 154, // #afff00
  inchworm: 155, // #afff5f
  mintgreen: 156, // #afff87
  menthol: 157, // #afffaf
  aeroblue: 158, // #afffd7
  celeste: 159, // #afffff
  crimson: 160, // #d70000
  debianred: 161, // #d7005f
  mediumvioletred: 162, // #d70087
  explosive: 163, // #d700af
  deepmagenta: 164, // #d700d7
  phlox: 165, // #d700ff
  chocolate: 166, // #d75f00
  indianred: 167, // #d75f5f
  palevioletred: 168, // #d75f87
  superpink: 169, // #d75faf
  orchid: 170, // #d75fd7
  heliotrope: 171, // #d75fff
  peru: 172, // #d78700
  coppertan: 173, // #d7875f
  lightcoral: 174, // #d78787
  cancan: 175, // #d787af
  deepmauve: 176, // #d787d7
  lilac: 177, // #d787ff
  goldenrod: 178, // #d7af00
  equator: 179, // #d7af5f
  tan: 180, // #d7af87
  clam: 181, // #d7afaf
  thistle: 182, // #d7afd7
  mauve: 183, // #d7afff
  corn: 184, // #d7d700
  energized: 185, // #d7d75f
  deco: 186, // #d7d787
  greenmist: 187, // #d7d7af
  tundra: 188, // #d7d7d7
  lavender: 189, // #d7d7ff
  limezest: 190, // #d7ff00
  spritz: 191, // #d7ff5f
  honeysuckle: 192, // #d7ff87
  reef: 193, // #d7ffaf
  frost: 194, // #d7ffd7
  lightcyan: 195, // #d7ffff
  red: 196, // #ff0000
  raspberry: 197, // #ff005f
  deeppink: 198, // #ff0087
  purepink: 199, // #ff00af
  vicecity: 200, // #ff00d7
  fuchsia: 201, // #ff00ff
  blaze: 202, // #ff5f00
  tomato: 203, // #ff5f5f
  strawberry: 204, // #ff5f87
  hotpink: 205, // #ff5faf
  rosepink: 206, // #ff5fd7
  flamingo: 207, // #ff5fff
  darkorange: 208, // #ff8700
  coral: 209, // #ff875f
  salmon: 210, // #ff8787
  pinksalmon: 211, // #ff87af
  pout: 212, // #ff87d7
  violet: 213, // #ff87ff
  orange: 214, // #ffaf00
  sandybrown: 215, // #ffaf5f
  lightsalmon: 216, // #ffaf87
  lightpink: 217, // #ffafaf
  cottoncandy: 218, // #ffafd7
  shampoo: 219, // #ffafff
  gold: 220, // #ffd700
  lightgoldenrod: 221, // #ffd75f
  jasmine: 222, // #ffd787
  peachpuff: 223, // #ffd7af
  mistyrose: 224, // #ffd7d7
  bubblegum: 225, // #ffd7ff
  yellow: 226, // #ffff00
  canary: 227, // #ffff5f
  dolly: 228, // #ffff87
  lemonchiffon: 229, // #ffffaf
  lightyellow: 230, // #ffffd7
  white: 231, // #ffffff

  // grays
  gray1: 232, // #080808
  gray2: 233, // #121212
  gray3: 234, // #1c1c1c
  gray4: 235, // #262626
  gray5: 236, // #303030
  gray6: 237, // #3a3a3a
  gray7: 238, // #444444
  gray8: 239, // #4e4e4e
  gray9: 240, // #585858
  gray10: 241, // #626262
  gray11: 242, // #6c6c6c
  dimgray: 242, // #6c6c6c
  gray12: 243, // #767676
  gray13: 244, // #808080
  gray: 244, // #808080
  gray14: 245, // #8a8a8a
  gray15: 246, // #949494
  gray16: 247, // #9e9e9e
  gray17: 248, // #a8a8a8
  darkgray: 248, // #a8a8a8
  gray18: 249, // #b2b2b2
  gray19: 250, // #bcbcbc
  silver: 250, // #bcbcbc
  gray20: 251, // #c6c6c6
  gray21: 252, // #d0d0d0
  lightgray: 252, // #d0d0d0
  gray22: 253, // #dadada
  gainsboro: 253, // #dadada
  gray23: 254, // #e4e4e4
  gray24: 255, // #eeeeee
};
