export type Rgb = readonly [number, number, number];

// Convert a six-digit hex color string into RGB channel integers.
export function hexToRgb(hex: string): Rgb {
  const value = hex.startsWith("#") ? hex.slice(1) : hex;
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error(`invalid hex color: ${hex}`);
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

// Render rows with shared key/value widths for aligned generated code.
export function paddedRows<T>(
  items: T[],
  render: (item: T, widths: { key: number; value: number }) => string,
  measure: (item: T) => { key: string; value: string },
): string {
  const measured = items.map(measure);
  const widths = {
    key: Math.max(...measured.map((item) => item.key.length)),
    value: Math.max(...measured.map((item) => item.value.length)),
  };
  return items.map((item) => render(item, widths)).join("\n");
}
