#!/bin/bash
# EAS Build pre-install hook: restore sdk.key from the EAS file secret.
# - On EAS: EVERYSIGHT_SDK_KEY_FILE points at a temp file containing the key;
#   copy it to ./sdk.key where the evskit config plugin expects it
#   (['@therealitycrafters/react-native-evskit', { bundleResources: ['./sdk.key'] }]).
# - Locally: no EAS env, so expect ./sdk.key already on disk (gitignored) and no-op.
# NOTE: for production/preview builds, upload the appropriate key content
# (Everysight distinguishes sdk.key (dev) from app.key (production)) under the
# same variable name in that environment — the on-disk filename stays sdk.key
# because that is the path the plugin reads.
set -euo pipefail

if [ -n "${EVERYSIGHT_SDK_KEY_FILE:-}" ] && [ -f "$EVERYSIGHT_SDK_KEY_FILE" ]; then
  cp "$EVERYSIGHT_SDK_KEY_FILE" ./sdk.key
  echo "sdk.key restored from EAS file secret"
else
  echo "No EVERYSIGHT_SDK_KEY_FILE secret; checking for local sdk.key..."
  if [ ! -f ./sdk.key ]; then
    echo "ERROR: sdk.key missing and no EAS file secret provided" >&2
    exit 1
  fi
  echo "Local sdk.key present, continuing"
fi
