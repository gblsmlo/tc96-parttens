---
name: npm-release
description: Release @tc96/cli to npm end to end in this repository. Picks the next version from the commits since the last tag (feat bumps the minor, fix the patch), prepares the chore/release-X.Y.Z branch and PR, runs the release gate, and after the owner merges the PR follows the Publish workflow, which publishes to npm and creates the GitHub release on its own, then confirms the version on npm. Use when asked to release, publish, cut or ship a new version of the package, bump its version, or check whether a publish finished. Do not use for publishing another package, for npm login or token setup, or to change the release workflows themselves.
---

# npm release of @tc96/cli

The package is never published from a laptop. Merging a PR that changes the version in `packages/registry/src/build-registry.ts` into `main` runs `.github/workflows/publish.yml`, which publishes `dist/cli` to npm with provenance through the trusted publisher and then creates the GitHub release `vX.Y.Z`. The owner's only step is merging the release PR. No `npm login` is needed in CI.

## Facts this flow depends on

| What | Where |
| --- | --- |
| The version, the only line a release changes | `packages/registry/src/build-registry.ts`, `version: 'X.Y.Z'` inside the `@tc96/cli` package.json it writes |
| Local release gate | `bun run release:check` (full `check`, consumer registry and SSR tests, view benchmarks, `pack:check`) |
| CI release gate | `.github/workflows/tooling.yml` (job `static` on every PR, job `release` with the consumer tests, benchmarks and `pack:check`), `.github/workflows/unit.yml` (one job per `test:*` suite) and `.github/workflows/storybook.yml` (play tests in five shards, `storybook:build`, `docs:build` and the `storybook` gate job), the release jobs on PRs whose branch starts with `chore/release-`; the `skip-storybook` label skips only the play shards |
| Publish | `.github/workflows/publish.yml`: on a push to `main` that touches `build-registry.ts`, or `workflow_dispatch`; builds, reads the version from `dist/cli/package.json`, stops when the tag `vX.Y.Z` exists, skips the publish when npm already has the version, otherwise runs typecheck, test, `pack:check`, `npm publish --access public --provenance --tag latest` from `dist/cli`, and `gh release create vX.Y.Z --target <merge commit> --generate-notes --latest` |

Verify these against the files before step 1; if one moved, follow the file and say so.

## Rules

- Each step that changes something shared waits for the owner's go-ahead: pushing the release branch and, above all, merging the PR, which publishes to npm and cannot be undone.
- Never run `npm publish`, `npm unpublish` or `npm deprecate` yourself.
- Commit messages and PR bodies follow the repository rules: no attribution trailer.

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
chore(release): Prepare @tc96/cli X.Y.Z
```

The `chore/release-` prefix matters: it is what makes the `release` job of `Tooling` and the `Storybook` workflow run on the PR.

## Step 3: Test

1. Run `bun run release:check` locally. It takes several minutes; run it in the background and read the log when it ends.
2. If a step fails, quote the failing lines. A failure caused by the release itself (version, pack) is fixed on this branch. A failure that already exists on `main` is not fixed here: link or file its issue and let the owner decide whether to release anyway, because `publish.yml` runs only typecheck, test, build and `pack:check`.
3. After the owner's go-ahead, push and open the PR (title `chore(release): Prepare @tc96/cli X.Y.Z`, `Closes: none`), then wait for the checks with `gh pr checks <number> --watch`.

## Step 4: Wait and confirm

After the owner merges the PR:

1. Find the run the merge started and follow it:

   ```bash
   gh run list --workflow publish.yml --branch main --limit 1 --json databaseId,status,conclusion,headSha
   gh run watch <databaseId> --exit-status
   ```

   `headSha` is the merge commit. If no run shows up within a minute, check that the merge touched `build-registry.ts`; otherwise start it with `gh workflow run publish.yml --ref main` after the owner agrees.
2. Confirm npm serves the version and the release exists; the registry can lag a minute behind:

   ```bash
   npm view @tc96/cli@X.Y.Z version
   npm view @tc96/cli dist-tags
   gh release view vX.Y.Z --json url
   ```

   `latest` must be `X.Y.Z`.
3. Report: version, release URL, publish run URL and conclusion, and the `npm view` output.

## When the publish fails

- Read the failing step with `gh run view <databaseId> --log-failed` and quote it.
- A transient failure (network, npm 5xx) is retried with `gh run rerun <databaseId> --failed` after the owner agrees.
- `E404` on the npm `PUT` means the trusted publisher on npmjs.com does not match `gblsmlo/tc96-ui` and `publish.yml`.
- A failure after `npm publish` succeeded (the release step) is fixed by rerunning the job: when npm already has the version and the tag is missing, the workflow skips the publish and only creates the release.
- A failure in the code means `main` cannot publish: fix on `main` and release the next patch.

## Output

```
Release: @tc96/cli X.Y.Z (minor|patch, from <last tag>)
Gate: release:check <passed|failed at step>, PR #N checks <state>
Release: <release URL>
Publish run: <run URL> <conclusion>
npm: <npm view output>
Open items: <one line each, or none>
```
