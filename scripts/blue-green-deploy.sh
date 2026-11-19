#!/usr/bin/env bash
set -euo pipefail

# Blue-Green Deployment & Rollout Manager for domij.info (domijin.github.io)
# Usage:
#   ./scripts/blue-green-deploy.sh status
#   ./scripts/blue-green-deploy.sh promote-green
#   ./scripts/blue-green-deploy.sh rollback-blue

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GREEN_APP_DIR="${ROOT_DIR}/green-app"
BLUE_BACKUP_DIR="${ROOT_DIR}/classic"

cmd="${1:-status}"

case "$cmd" in
  status)
    echo "=== Deployment Status (domij.info) ==="
    if [ -f "${BLUE_BACKUP_DIR}/index.html" ]; then
      echo "  [ACTIVE] Root (/) is serving: GREEN (Next.js 15 + Three.js; Classic Blue backed up at /classic/)"
    else
      echo "  [ACTIVE] Root (/) is serving: BLUE (Classic Pelican)"
    fi
    echo "  [AGENT]  /llms.txt, /llms-full.txt, /agent-context.json, /sitemap.xml"
    ;;

  promote-green)
    echo "Deploying Green (Next.js + Three.js) to root (/) while preserving all classic .html permalinks..."
    mkdir -p "${BLUE_BACKUP_DIR}"
    if [ ! -f "${BLUE_BACKUP_DIR}/index.html" ]; then
      cp "${ROOT_DIR}/index.html" "${BLUE_BACKUP_DIR}/index.html"
    fi
    # Hold on to the outgoing generation's assets, so a browser still holding
    # the previous HTML can fetch the chunks that HTML names, or its reload
    # throws instead of rendering the site. See scripts/keep-previous-assets.py.
    KEEP_DIR="$(mktemp -d)"
    trap 'rm -rf "${KEEP_DIR}"' EXIT
    python3 "${ROOT_DIR}/scripts/keep-previous-assets.py" collect \
      "${ROOT_DIR}" "${ROOT_DIR}" "${KEEP_DIR}" "" || true

    cd "${GREEN_APP_DIR}"
    npm run export:root
    # Replace the previous root export so stale hashed chunks do not
    # accumulate. The outgoing generation's files are put back below, so one
    # generation of them is always kept.
    rm -rf "${ROOT_DIR}/_next" "${ROOT_DIR}/404" "${ROOT_DIR}/index.txt" "${ROOT_DIR}/404.html"
    cp -R "${GREEN_APP_DIR}/out/"* "${ROOT_DIR}/"
    python3 "${ROOT_DIR}/scripts/keep-previous-assets.py" restore \
      "${KEEP_DIR}" "${ROOT_DIR}"
    # Gate: every asset the published HTML names, and every chunk a kept
    # generation's manifest names, must be in the tree. A generation kept for
    # a cached client but missing its chunks turns that client's reload into
    # "Application error" instead of the site.
    # Withdraw private prompt material even from retained client generations.
    node "${ROOT_DIR}/scripts/scrub-editorial-record.cjs" "${ROOT_DIR}/_next"
    python3 "${ROOT_DIR}/scripts/verify-build-assets.py"
    touch "${ROOT_DIR}/.nojekyll"
    echo "Green deployed to root (/). Classic home page backed up to /classic/index.html."
    ;;

  rollback-blue)
    if [ -f "${BLUE_BACKUP_DIR}/index.html" ]; then
      cp "${BLUE_BACKUP_DIR}/index.html" "${ROOT_DIR}/index.html"
      rm -rf "${BLUE_BACKUP_DIR}"
      echo "Rolled back root (/) to Blue (Classic Pelican)."
    else
      echo "Root (/) is already serving Blue."
    fi
    ;;

  *)
    echo "Usage: $0 {status|promote-green|rollback-blue}"
    exit 1
    ;;
esac
