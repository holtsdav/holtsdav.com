#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
# Honor the repo's Node 24 requirement without changing the user's shell setup.
if ! command -v node >/dev/null 2>&1 || [ "$(node -p 'process.versions.node.split(".")[0]')" != 24 ]; then
  for runtime in \
    /Users/holtsdav/.local/share/fnm/node-versions/v24.18.0/installation/bin \
    /Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin; do
    if [ -x "$runtime/node" ]; then
      PATH="$runtime:$PATH"
      export PATH
      break
    fi
  done
fi
if [ "$(node -p 'process.versions.node.split(".")[0]')" != 24 ]; then
  printf 'This repo requires Node 24. Select it with your Node version manager, then rerun.\n' >&2
  exit 1
fi
if [ ! -d node_modules ]; then
  printf 'Dependencies are missing. Run npm ci with Node 24, then rerun this script.\n' >&2
  exit 1
fi
# Always rebuild so an older dist/ cannot masquerade as the reviewed source.
ASTRO_TELEMETRY_DISABLED=1
export ASTRO_TELEMETRY_DISABLED
npm run build
exec npm run preview -- --host 127.0.0.1 --port "${PORTFOLIO_PORT:-4326}"
