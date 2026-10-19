---
name: npm-release
description: Release @tc96/parttens to npm end to end in this repository. Picks the next version from the commits since the last tag (feat bumps the minor, fix the patch), prepares the chore/release-X.Y.Z branch and PR, runs the release gate, creates the GitHub release that triggers the Publish workflow, then waits for the run and confirms the version on npm. Use when asked to release, publish, cut or ship a new version of the package, bump its version, or check whether a publish finished. Do not use for publishing another package, for npm login or token setup, or to change the release workflows themselves.
---

# npm release of @tc96/parttens

The package is never published from a laptop. `bun run release` creates the GitHub release `vX.Y.Z`, and `.github/workflows/publish.yml` publishes `dist/cli` to npm with provenance when that release is published. No `npm login` is needed.

## Facts this flow depends on

| What | Where |
| --- | --- |
| The version, the only line a release changes | `packages/registry/src/build-registry.ts`, `version: 'X.Y.Z'` inside the `@tc96/parttens` package.json it writes |
| Local release gate | `bun run release:check` (full `check`, consumer registry and SSR tests, view benchmarks, `pack:check`) |
| CI release gate | `.github/workflows/release-check.yml`, runs `release:check` on PRs whose branch starts with `chore/release-` |
| Release command | `scripts/release.ts`: requires `main`, a clean tree, `main` equal to `origin/main`, no `vX.Y.Z` tag on origin and no `X.Y.Z` on npm; `--dry-run` prints the `gh release create` command without running it |
| Publish | `.github/workflows/publish.yml`: on `release: published`, skips prereleases, checks the tag commit is on `main`, runs typecheck, test, build, checks the tag equals `dist/cli/package.json` version, `pack:check`, `npm publish --provenance --tag latest` |

Verify these against the files before step 1; if one moved, follow the file and say so.

## Rules

- Each step that changes something shared waits for the owner's go-ahead: pushing the release branch, merging the PR, and above all `bun run release`, which creates a public tag and starts an npm publish that cannot be undone.
- Never run `npm publish`, `npm unpublish` or `npm deprecate` yourself.
- Commit messages and PR bodies follow the repository rules: no attribution trailer, PR body from `.github/pull_request_template.md`.

## Step 1: Pick the version

1. Make sure every PR meant for this release is merged into `main`.
2. Run `bash .claude/skills/npm-release/scripts/next-version.sh`. It prints the last tag, the commits since it on `origin/main` and the next version:
   - any `feat:` subject, `type!:` subject or `BREAKING CHANGE:` footer: minor (`0.16.0` to `0.17.0`);
   - otherwise (`fix:`, `docs:`, `chore:`, `ref:` and so on): patch (`0.16.0` to `0.16.1`).
3. Show the owner the commit list and the proposed version. A breaking change stays a minor while the package is below 1.0; going to `1.0.0` is the owner's call, never inferred.

## Step 2: Prepare the release branch

```bash
git switch main && git pull --ff-only
git switch -c chore/release-X.Y.Z
```

Change only the `version` line in `packages/registry/src/build-registry.ts`, then commit:

```
chore(release): Prepare @tc96/parttens X.Y.Z
```

The `chore/release-` prefix matters: it is what makes the `Release check` workflow run on the PR.

## Step 3: Test

1. Run `bun run release:check` locally. It takes several minutes; run it in the background and read the log when it ends.
2. If a step fails, quote the failing lines. A failure caused by the release itself (version, pack) is fixed on this branch. A failure that already exists on `main` is not fixed here: link or file its issue and let the owner decide whether to release anyway, because `publish.yml` runs only typecheck, test, build and `pack:check`.
3. After the owner's go-ahead, push and open the PR (title `chore(release): Prepare @tc96/parttens X.Y.Z`, `Closes: none`), then wait for the checks with `gh pr checks <number> --watch`.

## Step 4: Release

After the owner merges the PR:

```bash
git switch main && git pull --ff-only
bun run release -- --dry-run
```

Show the printed `gh release create vX.Y.Z --target main --generate-notes --latest --title vX.Y.Z` and ask for the go-ahead. Only then run `bun run release`.

## Step 5: Wait and confirm

1. Find the run the release started and follow it:

   ```bash
   gh run list --workflow publish.yml --limit 1 --json databaseId,status,conclusion,headBranch
   gh run watch <databaseId> --exit-status
   ```

   `headBranch` is the tag `vX.Y.Z`. If no run shows up within a minute, check that the release is published and not a prerelease: `gh release view vX.Y.Z`.
2. Confirm npm serves the version; the registry can lag a minute behind the workflow:

   ```bash
   npm view @tc96/parttens@X.Y.Z version
   npm view @tc96/parttens dist-tags
   ```

   `latest` must be `X.Y.Z`.
3. Report: version, release URL, publish run URL and conclusion, and the `npm view` output.

## When the publish fails

- Read the failing step with `gh run view <databaseId> --log-failed` and quote it.
- A transient failure (network, npm 5xx) is retried with `gh run rerun <databaseId> --failed` after the owner agrees.
- A failure in the code or in the tag check means the tag points at a commit that cannot publish. Do not move or delete the tag on your own: propose either deleting the release and tag `vX.Y.Z` (only if npm does not have `X.Y.Z`) or fixing on `main` and releasing the next patch, and let the owner choose.

## Output

```
Release: @tc96/parttens X.Y.Z (minor|patch, from <last tag>)
Gate: release:check <passed|failed at step>, PR #N checks <state>
Release: <release URL>
Publish run: <run URL> <conclusion>
npm: <npm view output>
Open items: <one line each, or none>
```
