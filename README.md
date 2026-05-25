### WEEKEND TODO

- ship ansi.md

- windows

- colors
  - rgb => ansi 256 (show both colors)
  - tailwind colors as RGB
  - catppuccin colors as RGB
  - https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=9
  - http://vrl.cs.brown.edu/color

- escape codes (the only ones I've ever used)
  - color
  - show/hide cursor
  - move cursor
  - sync
  - carriage return / newline
  - OSC11
  - raw/cooked
  - progress bar
  - image protocol
  - "notify"
  - clear/reset/ctrl-l
  - echo mode
  - terminal size

- palettes / themes
  ansi 256
  tailwind
  css named colors
  catppuccin
  downsampling
  closest 256
  closest tailwind
  format as RGB

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
  alacritty
  ghostty
  kitty
  iterm
  ConEmu
  vscode/zed
  https://github.com/dalance/termbg

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
  clig.dev
  charmbracelet

- atuin
- bat
- chafa
- doggo
- dust
- eza
- fd
- fx
- ghostty
- gron
- gum
- hexyl
- oh-my-posh
- pastel
- rg
- sd
- sequin
- tennis
- trippy
- vd
- vhs
- yazi
- zmx

REMIND

- articles should have "updated at"
- github link
- www.cl.cam.ac.uk/~mgk25/unicode.html
- tldp.org/HOWTO/Xterm-Title.html
- feedback/email me

Those first 16 ansi colors are interesting. Helpfully labeled `Black, Red, Green, Yellow, Blue, Magenta, Cyan & White`, your enthusiastic cli users will map these to radically different themes. The "bright" ansi colors Nearly every modern terminal supports theming by customizing the values for the first 16 ansi colors. Personally I am using [catppuccin](catppuccin.com) at the moment, but I used [solarized](ethanschoonover.com/solarized/) for a long time. There are also **bright** variants for each color. Decades ago "bright green" was literally a chipper green, but these days your users are just as likely to make it a dour gray. Actual solarized colors in iterm2:

- how apps figure out what the terminal can do
- tty vs not a tty (redirect)
- `/dev/tty`
- `COLORTERM`
- `TERM`
- `TERMINFO`
- none vs ansi vs 256 vs 16m
- terminfo / and the term database
- termcap
- querying bg color, mostly bg
- "raw mode"
- terminal size
- `tmux`, `ssh`
- ghostty injection terminfo
- `printf` 256 16m what do you see?
- `echo`
- note: how does this stuff end up using ncurses/terminfo?
- invisible-island.net/xterm/ctlseqs/ctlseqs.html

- escape codes - 16 fg/bg/bright, fg256, bg256, fg rgba, bg rgba, curshor show/hide/mode, mouse sync, reset bold... or just refer to someone else's site

REMIND: chalk
github.com/basiclines/os-theme#terminal-support
github.com/termstandard/colors

- clig.dev/#foreword
  - clig.dev/#the-basics
  - **Use formatting in your help text**
  - Ubuntu 20.04 has a nice progress bar that sticks to the bottom of the terminal.
  - There are many good libraries for generating progress bars. For example, ~[tqdm](github.com/tqdm/tqdm)~ for Python, ~[schollz/progressbar](github.com/schollz/progressbar)~ for Go, and ~[node-progress](github.com/visionmedia/node-progress)~ for Node.js.

  gist.github.com/kurahaupo/6ce0eaefe5e730841f03cb82b061daa2
