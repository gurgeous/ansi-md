default:
  just --list

build:
  just banner "astro..." && astro build
  just banner "prettier..." && prettier --log-level error --write .
  just banner "✓ build ✓"

test-code:
  just banner "generated code..." && node test/ansi256-code.mjs
  just banner "✓ test-code ✓"

clean:
  rm -rf tmp .astro

dev:
  astro dev --host

fmt:
  prettier --list-different --write .

#
# banner
#

set quiet

banner +ARGS:  (_banner '\e[48;2;064;160;043m' ARGS)
warning +ARGS: (_banner '\e[48;2;251;100;011m' ARGS)
fatal +ARGS:   (_banner '\e[48;2;210;015;057m' ARGS)
  exit 1
_banner BG +ARGS:
  printf '\e[38;5;231m{{BOLD+BG}}[%s] %-72s {{NORMAL}}\n' "$(date +%H:%M:%S)" "{{ARGS}}"
