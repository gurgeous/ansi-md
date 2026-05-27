default:
  just --list

build: check
  just banner "astro..." && astro build
  just banner "prettier..." && prettier --log-level error --write .
  just banner "✓ build ✓"

check:
  just banner "lint..." && just lint
  just banner "test..." && just test
  just banner "tsc..." && just tsc
  just banner "✓ check ✓"

clean:
  rm -rf tmp .astro

dev:
  astro dev --host

fmt:
  prettier --list-different --write .

lint:
  eslint .

llm: fmt build

organize:
  organize-imports.ts

test:
  just banner "gen-test-code.ts..." && node-ts bin/gen-test-code.ts
  just banner "check-chapters.ts..." && node-ts bin/check-chapters.ts
  just banner "vitest..." ; vitest run
  just banner "✓ test ✓"

tsc:
  tsc


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
