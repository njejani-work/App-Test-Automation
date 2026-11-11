#!/usr/bin/env bash
#
# build-apk.sh: turn an Android app's source code into a clearly named APK.
#
# Part of wikiApp_compileToTest: step 1 of "compile, then test".
# Usage:   scripts/build-apk.sh [variant]     (default variant: devDebug)
#          npm run build:apk                  (same, from any shell)
# Example: APP_REF=some-branch scripts/build-apk.sh devDebug
# Output:  out/<app>-<variant>-<commit>.apk + out/<same>.build-info.txt
#          (wdio.conf.js picks the newest one automatically)
#
# Two modes:
#   Fetch mode (default): download the app from APP_REPO into ./app-src, then build.
#   In-place mode: build code that is already checked out somewhere (set APP_SRC).
#
# Settings you can change with environment variables:
#   APP_REPO     Git URL of the app (fetch mode; default: Wikipedia Android fork)
#   APP_REF      branch, tag or full commit (fetch mode; default: default branch)
#   APP_SRC      folder with the app code -> in-place mode
#   APP_NAME     short name used in the APK file name (default: from repo name)
#   GRADLE_ARGS  extra arguments for Gradle  (default: none)
#   CI           set by CI systems; turns off the Gradle daemon
#
# Exit codes: 0 ok · 1 bad input · 2 missing tool · 3 could not get source
#             4 Gradle build failed · 5 APK not found or ambiguous

set -euo pipefail

# ---------------------------------------------------------------- settings
VARIANT="${1:-devDebug}"
GRADLE_ARGS="${GRADLE_ARGS:-}"
# Project root = the folder above scripts/. app-src/ and out/ live there.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${OUT_DIR:-$ROOT_DIR/out}"

# In this project the app always comes from its own repository, so in-place mode is
# only used when you ask for it (we don't auto-detect BITBUCKET_CLONE_DIR: that would
# be this test project, not the app).
APP_SRC="${APP_SRC:-}"
if [[ -n "$APP_SRC" ]]; then
  MODE="in-place"
  SRC_DIR="$(cd "$APP_SRC" && pwd)"
else
  MODE="fetch"
  SRC_DIR="$ROOT_DIR/app-src"
  APP_REPO="${APP_REPO:-https://github.com/njejani-work/apps-android-wikipedia.git}"
  APP_REF="${APP_REF:-HEAD}"
fi

# ---------------------------------------------------------------- helpers
log() { echo "[build-apk] $*"; }
# Remove any user:password@ or token@ from a URL so secrets never reach logs or files
strip_credentials() { sed -E 's#(https?://)[^/@]+@#\1#'; }
die() { local code="$1"; shift; echo "[build-apk] ERROR: $*" >&2; exit "$code"; }

usage() {
  awk 'NR > 2 && /^#/ { sub(/^# ?/, ""); print; next } NR > 2 { exit }' "${BASH_SOURCE[0]}"
}

# ---------------------------------------------------------------- 1. check input
if [[ "$VARIANT" == "-h" || "$VARIANT" == "--help" ]]; then
  usage; exit 0
fi
if [[ ! "$VARIANT" =~ ^[a-z][A-Za-z0-9]*$ ]]; then
  die 1 "Variant '$VARIANT' is not valid. Use a name like devDebug or prodRelease (letters and digits, starting lower-case)."
fi
TASK="assemble${VARIANT^}"          # devDebug -> assembleDevDebug

# ---------------------------------------------------------------- 2. check tools
command -v git  >/dev/null 2>&1 || die 2 "git is not installed or not on PATH."
command -v sha256sum >/dev/null 2>&1 || die 2 "sha256sum is not available (use Git Bash on Windows)."
if [[ -z "${ANDROID_HOME:-}" && -z "${ANDROID_SDK_ROOT:-}" ]]; then
  die 2 "ANDROID_HOME is not set. Point it at your Android SDK folder."
fi
if [[ -z "${JAVA_HOME:-}" ]] && ! command -v java >/dev/null 2>&1; then
  die 2 "No Java found. Set JAVA_HOME or put java on PATH."
fi

log "Mode: $MODE   Variant: $VARIANT  ->  Gradle task: $TASK"

# ---------------------------------------------------------------- 3. get the source
if [[ "$MODE" == "fetch" ]]; then
  # Make sure app-src is a Git repo, fetch only the one commit we need (--depth 1),
  # and check it out exactly. Same steps for a first run and for later runs.
  log "App: $(echo "$APP_REPO" | strip_credentials)  (ref: $APP_REF)"
  if [[ ! -d "$SRC_DIR/.git" ]]; then
    log "First run: creating $SRC_DIR"
    git init -q "$SRC_DIR"
    git -C "$SRC_DIR" remote add origin "$APP_REPO"
  fi
  git -C "$SRC_DIR" remote set-url origin "$APP_REPO"

  log "Fetching $APP_REF ..."
  git -C "$SRC_DIR" fetch -q --depth 1 origin "$APP_REF" \
    || die 3 "Could not fetch '$APP_REF'. Check the URL, the ref name and your network."
  git -C "$SRC_DIR" checkout -q --force --detach FETCH_HEAD \
    || die 3 "Could not check out the fetched code."
else
  # The code is already here (e.g. Bitbucket cloned it). Just check it looks like an app.
  [[ -f "$SRC_DIR/gradlew" ]] || die 3 "No gradlew found in $SRC_DIR. Is APP_SRC the app's root folder?"
  git -C "$SRC_DIR" rev-parse HEAD >/dev/null 2>&1 || die 3 "$SRC_DIR is not a Git checkout."
  APP_REPO="${BITBUCKET_GIT_HTTP_ORIGIN:-$(git -C "$SRC_DIR" remote get-url origin 2>/dev/null || echo unknown)}"
  APP_REF="${BITBUCKET_BRANCH:-${BITBUCKET_TAG:-$(git -C "$SRC_DIR" rev-parse --abbrev-ref HEAD)}}"
  log "App: $(echo "$APP_REPO" | strip_credentials)  (ref: $APP_REF, already checked out)"
fi
APP_REPO="$(echo "$APP_REPO" | strip_credentials)"
APP_NAME="${APP_NAME:-${BITBUCKET_REPO_SLUG:-$(basename "$APP_REPO" .git)}}"

COMMIT_FULL="$(git -C "$SRC_DIR" rev-parse HEAD)"
COMMIT_SHORT="$(git -C "$SRC_DIR" rev-parse --short=10 HEAD)"
COMMIT_DATE="$(git -C "$SRC_DIR" log -1 --format=%cI)"
log "Building commit $COMMIT_SHORT ($COMMIT_DATE)"

# ---------------------------------------------------------------- 4. build
GRADLE_FLAGS=(--console=plain --stacktrace)
if [[ -n "${CI:-}" ]]; then
  GRADLE_FLAGS+=(--no-daemon)       # CI containers are thrown away; a daemon only wastes memory
fi
# shellcheck disable=SC2206
EXTRA=($GRADLE_ARGS)

chmod +x "$SRC_DIR/gradlew" 2>/dev/null || true
log "Running: ./gradlew $TASK ${GRADLE_FLAGS[*]} ${EXTRA[*]:-}"
START=$SECONDS
if ! (cd "$SRC_DIR" && ./gradlew "$TASK" "${GRADLE_FLAGS[@]}" "${EXTRA[@]}"); then
  die 4 "Gradle build failed (see output above). If it says the task was not found, list variants with:
       (cd app-src && ./gradlew tasks --all | grep '^assemble')"
fi
BUILD_SECONDS=$(( SECONDS - START ))
log "Build finished in ${BUILD_SECONDS}s"

# ---------------------------------------------------------------- 5. find the APK
# The Android Gradle Plugin writes output-metadata.json next to every APK it builds.
# It names the variant and the APK file, so we look for the one that matches our variant
# instead of guessing folder names.
METADATA=""
while IFS= read -r -d '' f; do
  if grep -q "\"variantName\": *\"$VARIANT\"" "$f"; then
    METADATA="$f"
    break
  fi
done < <(find "$SRC_DIR" -path "*/build/outputs/apk/*" -name output-metadata.json -print0)

[[ -n "$METADATA" ]] || die 5 "Build succeeded but no APK for variant '$VARIANT' was found under */build/outputs/apk/."

APK_DIR="$(dirname "$METADATA")"
mapfile -t APK_FILES < <(grep -o '"outputFile": *"[^"]*"' "$METADATA" | sed 's/.*"\([^"]*\)"$/\1/')
if (( ${#APK_FILES[@]} != 1 )); then
  die 5 "Expected exactly 1 APK for '$VARIANT' but found ${#APK_FILES[@]}: ${APK_FILES[*]:-none}. (ABI or density splits?)"
fi
APK_PATH="$APK_DIR/${APK_FILES[0]}"
[[ -f "$APK_PATH" ]] || die 5 "Metadata points to $APK_PATH but the file does not exist."

APPLICATION_ID="$(grep -o '"applicationId": *"[^"]*"' "$METADATA" | sed 's/.*"\([^"]*\)"$/\1/')"
VERSION_NAME="$(grep -o '"versionName": *"[^"]*"' "$METADATA" | head -1 | sed 's/.*"\([^"]*\)"$/\1/')"

# ---------------------------------------------------------------- 6. name it and record it
mkdir -p "$OUT_DIR"
BASE="${APP_NAME}-${VARIANT}-${COMMIT_SHORT}"
FINAL_APK="$OUT_DIR/$BASE.apk"
INFO_FILE="$OUT_DIR/$BASE.build-info.txt"

cp -f "$APK_PATH" "$FINAL_APK"
SHA256="$(sha256sum "$FINAL_APK" | cut -d' ' -f1)"

cat > "$INFO_FILE" <<EOF
app_name=$APP_NAME
app_repo=$APP_REPO
app_ref=$APP_REF
commit=$COMMIT_FULL
commit_date=$COMMIT_DATE
variant=$VARIANT
gradle_task=$TASK
application_id=$APPLICATION_ID
version_name=$VERSION_NAME
apk_file=$(basename "$FINAL_APK")
apk_sha256=$SHA256
apk_bytes=$(wc -c < "$FINAL_APK" | tr -d ' ')
built_at_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)
build_seconds=$BUILD_SECONDS
built_on=$(uname -n)
EOF

# ---------------------------------------------------------------- 7. report
log "Done."
log "APK:        $FINAL_APK"
log "Build info: $INFO_FILE"
log "Package:    $APPLICATION_ID   Version: $VERSION_NAME"
log "SHA-256:    $SHA256"
exit 0
