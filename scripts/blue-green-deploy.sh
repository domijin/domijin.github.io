#!/usr/bin/env bash
set -euo pipefail

# Blue-Green Deployment & Promotion Manager for domij.info (domijin.github.io)
# Usage:
#   ./scripts/blue-green-deploy.sh status
#   ./scripts/blue-green-deploy.sh build-green
#   ./scripts/blue-green-deploy.sh promote-green
#   ./scripts/blue-green-deploy.sh rollback-blue

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GREEN_APP_DIR="${ROOT_DIR}/green-app"
BLUE_BACKUP_DIR="${ROOT_DIR}/classic"

cmd="${1:-status}"

case "$cmd" in
  status)
    echo "=== Blue-Green Deployment Status (domij.info) ==="
    if [ -f "${ROOT_DIR}/next/index.html" ]; then
      echo "  [GREEN]  Staged & Live at:  /next/ (Next.js 15 + Three.js)"
    else
      echo "  [GREEN]  Not yet built at /next/"
    fi
    if [ -f "${BLUE_BACKUP_DIR}/index.html" ]; then
      echo "  [ACTIVE] Root (/) is serving: GREEN (Blue backed up at /classic/)"
    else
      echo "  [ACTIVE] Root (/) is serving: BLUE (Classic Pelican), with switcher to /next/"
    fi
    echo "  [AGENT]  /llms.txt, /llms-full.txt, /agent-context.json, /sitemap.xml"
    ;;

  build-green)
    echo "Building Green environment to /next/ ..."
    cd "${GREEN_APP_DIR}"
    npm run export:green
    echo "Done. Green environment exported to ${ROOT_DIR}/next/ and .nojekyll ensured."
    ;;

  promote-green)
    echo "Promoting Green (Next.js + Three.js) to root (/) while preserving all classic .html permalinks..."
    mkdir -p "${BLUE_BACKUP_DIR}"
    if [ ! -f "${BLUE_BACKUP_DIR}/index.html" ]; then
      cp "${ROOT_DIR}/index.html" "${BLUE_BACKUP_DIR}/index.html"
    fi
    cd "${GREEN_APP_DIR}"
    NEXT_BASE_PATH="" npx next build
    # Remove the previous root export so stale hashed chunks do not accumulate.
    rm -rf "${ROOT_DIR}/_next" "${ROOT_DIR}/404" "${ROOT_DIR}/index.txt" "${ROOT_DIR}/404.html"
    cp -R "${GREEN_APP_DIR}/out/"* "${ROOT_DIR}/"
    touch "${ROOT_DIR}/.nojekyll"
    echo "Green promoted to root (/). Classic home page backed up to /classic/index.html."
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
    echo "Usage: $0 {status|build-green|promote-green|rollback-blue}"
    exit 1
    ;;
esac
