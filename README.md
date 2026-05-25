REMIND

- contrast checker

### 2. Color Design

- proofread
- some discussion of the ansi color cube
- https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=9
- http://vrl.cs.brown.edu/color
  css named colors

### 3. CLI Design

- 12 factor cli apps
- clig.dev
- charmbracelet

### 4. progress bars and spinners

- There are many good libraries for generating progress bars. For example, ~[tqdm](github.com/tqdm/tqdm)~ for Python, ~[schollz/progressbar](github.com/schollz/progressbar)~ for Go, and ~[node-progress](github.com/visionmedia/node-progress)~ for Node.js.

### 5. ANSI Escape Basics

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
- tldp.org/HOWTO/Xterm-Title.html
- novelty codes : progress bar
- novelty codes : notify
- hyperlinks
- window title

### 6. Advanced ANSI

- alpha blending
- half block
- terminfo
- termcap
- tputs
- ncurses (curses)
- readline
- `stty sane`
- printf (and 16m detection)
- ascii art
- proper images ("kitty graphics")
- https://www.cl.cam.ac.uk/~mgk25/unicode.html
- `tmux`, `ssh`, `zellij`
- ghostty injection terminfo
- invisible-island.net/xterm/ctlseqs/ctlseqs.html
- randos ("kitty color")
- carriage return
- queries

### 7. apps/terms

- alacritty
- ghostty
- kitty
- iterm
- ConEmu
- vscode/zed
- https://github.com/dalance/termbg
- atuin, bat, chafa, doggo, dust, eza, fd, fx, ghostty, gron, gum, hexyl, oh-my-posh, pastel, rg, sd, sequin, tennis, trippy, vd, vhs, yazi, zmx

### 8. libs

- cli args / ansicolor / tui / detection / spinner / progressbar / react-like libs
- go
- python
- node
- ruby
- rust
- zig
- REMIND: chalk

### style

- mobile look and feel, TOC (hamburger?)

### ops

- ship ansi.md
- feedback/email me
