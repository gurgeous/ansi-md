Ansi.md

- intro

- detection
  how apps figure out what the terminal can do
  tty vs not a tty (redirect)
  /dev/tty
  NO_COLOR
  FORCE_COLOR
  COLORTERM
  TERM
  TERMINFO
  none vs ansi vs 256 vs 16m
  terminfo / and the term database
  termcap
  querying fg/bg color, mostly bg
  "raw mode"
  terminal size
  uh oh, windows
  tmux, ssh
  ghostty injection terminfo
  printf 256 16m what do you see?
  sequin
  echo
  (note: how does this stuff end up using ncurses/terminfo?)
  https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Functions-using-CSI-*-ordered-by-the-final-character*s*

- palettes / themes
  ansi 256
  tailwind
  css named colors
  catppuccin
  downsampling
  closest 256
  closest tailwind
  format as RGB

- history, how did we get here
  "vt100"
  "xterm"

- advanced stuff
  alpha blending
  half block

- random commands and misc
  terminfo
  termcap
  tputs
  ncurses (curses)
  readline
  `stty sane`
  printf (and 16m detection)

- modern terminals
  ghostty
  alacritty
  kitty
  iterm
  ConEmu

- libraries
  cli args / ansicolor / tui / detection / spinner / progressbar / react-like libs
  go
  python
  node
  ruby
  rust
  zig

- ansi codes
  common stuff
  fg bg
  reset
  bold
  there are many more codes
  novelty codes : progress bar
  novelty codes : notify
  show/hide cursor
  carriage return
  hyperlinks
  randos ("kitty color")
  set window title

- images
  ascii art
  proper images ("kitty graphics")

- also see
  12 factor cli apps
  https://clig.dev/
  charmbracelet
