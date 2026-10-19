#!/usr/bin/env bash
# Prints the last tag, the commits since it and the next @tc96/parttens version.
# feat or a breaking change bumps the minor (the package is pre-1.0), fix and
# anything else bump the patch. Usage: next-version.sh [ref], default origin/main.
set -euo pipefail

ref="${1:-origin/main}"
git fetch --quiet --tags origin main

last_tag="$(git tag --sort=-v:refname --list 'v[0-9]*' | head -n 1)"
if [[ -z "$last_tag" ]]; then
  echo "No vX.Y.Z tag found" >&2
  exit 1
fi

subjects="$(git log "$last_tag..$ref" --no-merges --format=%s)"
if [[ -z "$subjects" ]]; then
  echo "No commits since $last_tag on $ref: nothing to release" >&2
  exit 1
fi

IFS=. read -r major minor patch <<<"${last_tag#v}"
if grep -Eq '^[a-z]+(\([^)]*\))?!:|^feat(\([^)]*\))?:' <<<"$subjects" ||
  git log "$last_tag..$ref" --format=%b | grep -q '^BREAKING CHANGE:'; then
  bump=minor
  next="$major.$((minor + 1)).0"
else
  bump=patch
  next="$major.$minor.$((patch + 1))"
fi

echo "Last tag: $last_tag"
echo "Commits since $last_tag on $ref:"
sed 's/^/  /' <<<"$subjects"
echo "Bump: $bump"
echo "Next version: $next"
