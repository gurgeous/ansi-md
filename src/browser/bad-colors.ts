// Client-side controls for the Bad Colors ANSI theme grid.
type Theme = { name: string; foreground: string; background: string; colors: string[] };
type Init = { colorOrders: Record<string, number[]>; themes: Theme[] };

class BadColorsTool {
  colorOrders: Record<string, number[]>;
  themes: Theme[];
  nameOrder: number[];
  $root: HTMLElement;
  $grid: HTMLElement;
  $background: HTMLSelectElement;
  $foreground: HTMLSelectElement;
  $sortName: HTMLInputElement;
  $themeName: HTMLElement;
  $cells: HTMLElement[];

  constructor($root: HTMLElement, init: Init) {
    this.colorOrders = init.colorOrders;
    this.themes = init.themes;
    this.nameOrder = init.themes.map((_, index) => index);
    this.$root = $root;
    this.$grid = $root.querySelector("[data-grid]")!;
    this.$background = $root.querySelector("[data-background]")!;
    this.$foreground = $root.querySelector("[data-foreground]")!;
    this.$sortName = $root.querySelector("[data-sort-name]")!;
    this.$themeName = $root.querySelector("[data-theme-name]")!;
    this.$cells = [];
    for (const $cell of $root.querySelectorAll<HTMLElement>("[data-index]")) {
      this.$cells[Number($cell.dataset.index)] = $cell;
    }

    this.$background.addEventListener("change", this.render.bind(this));
    this.$foreground.addEventListener("change", this.render.bind(this));
    this.$sortName.addEventListener("change", this.render.bind(this));
    this.$grid.addEventListener("pointerover", this.inspect.bind(this));
    this.$grid.addEventListener("focusin", this.inspect.bind(this));
  }

  render() {
    const background = this.$background.value;
    const foreground = this.$foreground.value;
    const order = this.$sortName.checked ? this.nameOrder : this.colorOrders[background];
    const $fragment = document.createDocumentFragment();

    for (const index of order) {
      const theme = this.themes[index];
      const $cell = this.$cells[index];
      $cell.style.backgroundColor = background === "background" ? theme.background : theme.colors[Number(background)];
      $cell.style.color =
        foreground === "foreground"
          ? theme.foreground
          : foreground === "background"
            ? theme.background
            : theme.colors[Number(foreground)];
      $fragment.append($cell);
    }
    this.$grid.replaceChildren($fragment);
  }

  inspect(event: PointerEvent | FocusEvent) {
    if (!(event.target instanceof Element)) return;
    const $cell = event.target.closest<HTMLElement>("[data-index]");
    if (!$cell || !this.$grid.contains($cell)) return;
    this.$themeName.textContent = this.themes[Number($cell.dataset.index)].name;
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
