#!/usr/bin/env bash
# 🌐 Put the PUBLIC version of the game on GitHub Pages.
#
#   npm run deploy:pages
#
# How it works:
#   1. Builds the game with real names swapped for made-up ones (see PUBLIC_NAMES in vite.config.js).
#   2. Stops if any private word is still in the build.
#   3. Pushes ONLY the built game (no code, no history, no PROMPTS.md) to a separate
#      public repo, which GitHub Pages serves. The code repo stays private.
set -euo pipefail
cd "$(dirname "$0")/.."

OWNER=$(gh api user --jq .login)
REPO=pips-adventure
OUT=dist-pages

npx vite build --mode pages --outDir "$OUT" --emptyOutDir

# 2. Safety check: no real names allowed in the public build.
WORDS=$(node -e "import('./vite.config.js').then(m => console.log(m.PRIVATE_WORDS.join('|')))")
if grep -rliE "$WORDS" "$OUT"; then
  echo "🛑 A private name is still in the files above. Add it to PUBLIC_NAMES in vite.config.js. Nothing was published."
  exit 1
fi
echo "✅ No private names in the public build."

# 3. Publish.
touch "$OUT/.nojekyll"
gh repo view "$OWNER/$REPO" >/dev/null 2>&1 ||
  gh repo create "$REPO" --public --description "Pip's Adventure: a 3D platformer designed by a kid, built with Claude Code"
cd "$OUT"
rm -rf .git
git init -q -b main
git add -A
git -c user.name="Pip's Adventure" -c user.email="$OWNER@users.noreply.github.com" commit -q -m "Publish the game"
git push -q -f "https://github.com/$OWNER/$REPO.git" main
rm -rf .git
gh api "repos/$OWNER/$REPO/pages" >/dev/null 2>&1 ||
  gh api "repos/$OWNER/$REPO/pages" -X POST -f "source[branch]=main" -f "source[path]=/" >/dev/null
echo "🎉 Published! It can take a minute to appear: https://$OWNER.github.io/$REPO/"
