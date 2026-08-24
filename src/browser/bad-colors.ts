// Client-side controls for the Bad Colors ANSI theme grid.
type Theme = { name: string; foreground: string; background: string; colors: string[] };
type Init = { colorOrders: Record<string, number[]>; themes: Theme[] };

class BadColorsTool {
  colorOrders: Record<string, number[]>;
  themes: Theme[];
  nameOrder: number[];
  $grid: HTMLElement;
  $bg: HTMLSelectElement;
  $fg: HTMLSelectElement;
  $sort: HTMLInputElement;
  $name: HTMLElement;
  $cells: HTMLElement[];

  constructor($root: HTMLElement, init: Init) {
    this.colorOrders = init.colorOrders;
    this.themes = init.themes;
    this.nameOrder = init.themes.map((_, index) => index);

    this.$grid = $root.querySelector("[data-grid]")!;
    this.$fg = $root.querySelector("[data-foreground]")!;
    this.$bg = $root.querySelector("[data-background]")!;
    this.$sort = $root.querySelector("[data-sort-name]")!;
    this.$name = $root.querySelector("[data-theme-name]")!;

    this.$cells = [];
    for (const $cell of $root.querySelectorAll<HTMLElement>("[data-index]")) {
      this.$cells[Number($cell.dataset.index)] = $cell;
    }

    this.$bg.addEventListener("change", this.render.bind(this));
    this.$fg.addEventListener("change", this.render.bind(this));
    this.$sort.addEventListener("change", this.render.bind(this));
    this.$grid.addEventListener("pointerover", this.onUpdate.bind(this));
    this.$grid.addEventListener("focusin", this.onUpdate.bind(this));
  }

  render() {
    const fg = this.$fg.value;
    const bg = this.$bg.value;
    const order = this.$sort.checked ? this.nameOrder : this.colorOrders[bg];
    const $i = document.createDocumentFragment();

    for (const index of order) {
      const theme = this.themes[index];
      const $cell = this.$cells[index];
      $cell.style.backgroundColor = bg === "background" ? theme.background : theme.colors[Number(bg)];
      $cell.style.color =
        fg === "foreground" ? theme.foreground : fg === "background" ? theme.background : theme.colors[Number(fg)];
      $i.append($cell);
    }
    this.$grid.replaceChildren($i);
  }

  onUpdate(event: PointerEvent | FocusEvent) {
    if (!(event.target instanceof Element)) return;
    const $cell = event.target.closest<HTMLElement>("[data-index]");
    if (!$cell || !this.$grid.contains($cell)) return;
    this.$name.textContent = this.themes[Number($cell.dataset.index)].name;
  }
}

// Attach behavior to the rendered tool once.
export function initBadColors() {
  const $root = document.querySelector(".bad-colors") as HTMLElement;
  if ($root.dataset.ready === "true") return;
  $root.dataset.ready = "true";

  const $script = $root.querySelector("script") as HTMLScriptElement;
  new BadColorsTool($root, JSON.parse($script.textContent));
}
