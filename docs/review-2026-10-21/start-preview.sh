#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
task_node="${PORTFOLIO_NODE:-$(command -v node || true)}"
if [ -z "$task_node" ] || [ "$("$task_node" -p 'process.versions.node.split(".")[0]')" != 24 ]; then
  task_node="/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [ ! -x "$task_node" ] || [ "$("$task_node" -p 'process.versions.node.split(".")[0]')" != 24 ]; then
  echo 'Node 24 is required. Set PORTFOLIO_NODE to an installed Node 24 executable.' >&2
  exit 1
fi
export PATH="$(dirname "$task_node"):$PATH"
export ASTRO_TELEMETRY_DISABLED=1
npm run build
exec npm run preview -- --host 127.0.0.1 --port "${PORTFOLIO_PORT:-4332}"
