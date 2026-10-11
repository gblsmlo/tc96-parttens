---
capability: settings-usages
plan: 0001
owner: project-manager
status: Ready
appetite: small, one implementation session per unit (two units)
inputs: none accepted; scope is implementation detail, so no requirements.md, design.md, user-experience.md or ADR
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | not needed: story-only usages, no product behavior change |
| `../design.md` | not needed: no boundary or contract change; no change to `packages/parttens` (`packages/parttens/src/surfaces/settings/core.ts:3-25`) |
| `../user-experience.md` | not needed: layout follows the owner's SLAs screenshot and the precedent story |
| `../../adr/NNNN-<slug>.md` | none |

Open gaps (a) and (c) below are not closed. Both are flagged `fecha-em: planejamento`, so this plan stays `Draft` until the owner closes them (`WF-CORE-09`).

### Order

- T1 and T2 are independent, share no contract and can run in parallel.
- Precedent for both: `apps/storybook/src/patterns/surfaces/settings/usages/project-statuses.stories.tsx:93-136`.

### Tasks

- [ ] **T1 · Add the Labels usage story [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** none
  - **Inputs:** none (no spec files). Sources:
    - `packages/parttens/src/surfaces/settings/core.ts:3-25` (SettingsSection, SettingsRow title/description/startSlot/endSlot, SettingsCollapsed title/actions/open).
    - `packages/parttens/src/surfaces/settings/AGENTS.md:24-30` (no domain screens in the pattern).
    - `docs/architecture/tc96-parttens.md:89,99` (ProjectStatuses moved to a usage story).
  - **Scope:**
    - New file `apps/storybook/src/patterns/surfaces/settings/usages/labels.stories.tsx`, title `Patterns/Surfaces/Settings/Usages/Labels`.
    - Domain data and types live in the story file.
    - Story `Default`:
      - Two parent groups with children, each rendered with `SettingsCollapsed`.
      - One empty parent group whose child is a muted "No labels in this group" line.
      - Two ungrouped labels as `SettingsRow`, placed after the groups wrapper.
      - The groups wrapper uses `first:pt-2 last:pb-2` (precedent `project-statuses.stories.tsx:93-136`).
    - Story `Empty`: COSS `Empty` with a "New label" action.
    - Color: `aria-hidden` swatch dot in `startSlot`, `-500` shades; the label name carries the meaning (WCAG 1.4.11).
    - Group actions: ghost `PlusIcon` button named "Add label to <group>".
    - Row `endSlot`: `Menu` named "Actions for <label>" with Edit and a destructive Delete.
    - Page header: "New label" and "New group" in a COSS `Group`.
    - Each story has a `!dev` Interaction twin (`packages/parttens/src/surfaces/settings/AGENTS.md` Verify).
    - Two label levels only.
  - **Acceptance:**
    - Domain data and types are declared in `labels.stories.tsx`, not in `packages/parttens`.
    - `git diff --stat packages/parttens docs/architecture/public-api-exports.json` prints nothing.
    - axe passes in light and dark.
    - The `Default` play asserts the two group names, the "No labels in this group" text and the menu accessible names "Actions for <label>".
    - The `Default` play asserts the "Add label to <group>" button name for each group.
    - The `Empty` play asserts the "New label" action is present.
    - No border, radius, color or shadow class sits on a COSS part.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bunx biome check <touched files>` | exit 0 |
    | `bun run storybook:typecheck` | exit 0 |
    | `bun run storybook:lint` | exit 0 |
    | `bun run verify:public-api` | exit 0, baseline unchanged |
    | `git diff --stat packages/parttens docs/architecture/public-api-exports.json` | empty output |
    | `vitest --project=storybook --project=storybook-dark` filtered to the Labels stories | all pass, zero axe violations |
  - **Test types:**

    | Type | Cost class | What it covers |
    | --- | --- | --- |
    | static | cheapest | biome, `storybook:typecheck`, `storybook:lint`, `verify:public-api`, grep for border/radius/color/shadow classes on COSS parts (`overrides:check` skips `apps/`) |
    | component | next | play in the `!dev` twin; only it catches rendered roles, accessible names and axe violations |
    | manual | highest | swatch contrast ratios (3:1 for graphics) in both themes, recorded in `docs/architecture/tc96-parttens.md` per the AGENTS.md visual-work rule |

    No E2E: nothing outside the rendered story can fail.
  - **Out of this Task:** loading and failure states, label drag-reorder, more than two label levels, any change to `packages/parttens`.
  - **Ships alone safely because:** it adds one story file and one doc note; no consumer imports a story file and the public API baseline is untouched.

- [ ] **T2 · Add the SLAs usage story [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** none
  - **Inputs:** none (no spec files). Sources:
    - `packages/parttens/src/surfaces/settings/core.ts:3-25`.
    - `packages/parttens/src/surfaces/settings/composition/settings-row/settings-row.tsx:28,35` (title and description render in `<p>`).
    - `packages/ui/src/group.tsx:19` (strips inner radius and border for `data-slot` children).
    - `packages/ui/src/badge.tsx:56` (`data-slot="badge"`).
    - `scripts/check-overrides.ts:24` (scans only `packages/parttens/src` and `packages/elements/src`).
  - **Scope:**
    - New file `apps/storybook/src/patterns/surfaces/settings/usages/slas.stories.tsx`, title `Patterns/Surfaces/Settings/Usages/SLAs`.
    - Domain data and types live in the story file.
    - Story `Gated` (follows the owner's screenshot):
      - Header, description and a Docs link as `<a>`.
      - Plan `SettingsRow` "SLAs" with an Upgrade `Button` in `endSlot`.
      - "Automation rules" `SettingsSection` with a description and a disabled "Add rule" button in a header row outside the card, with `aria-describedby` pointing to "Upgrade to add rules".
      - Rules are read-only and dimmed only through `text-muted-foreground`, never opacity; menu triggers are disabled.
    - Story `Available`: no plan row, "Add rule" enabled, Edit and Delete menus on each rule.
    - Story `AvailableEmpty`: COSS `Empty` "No rules yet" plus "Add rule".
    - Rule composition:
      - One `SettingsSection`; each rule is a story-local child with `py-3` holding one div per line.
      - Line "When": label plus a COSS `Group` (`role=group`, `aria-label` "Condition") with three `Badge variant="outline"` separated by `GroupSeparator`.
      - Line "Then": icon plus action text; the menu sits at the end.
      - Not `SettingsRow`, because its title and description render in `<p>` and `Group` is a div.
    - No classes on COSS parts; no override exception needed.
    - Each story has a `!dev` Interaction twin.
  - **Acceptance:**
    - Domain data and types are declared in `slas.stories.tsx`, not in `packages/parttens`.
    - `git diff --stat packages/parttens docs/architecture/public-api-exports.json` prints nothing.
    - axe passes in light and dark.
    - `getByRole('group', { name: 'Condition' })` contains "Priority", "is" and "Urgent".
    - "Add rule" is disabled in `Gated` and enabled in `Available`.
    - In `Gated`, rule menu triggers are disabled and no `opacity-*` class is used.
    - No border, radius, color or shadow class sits on `Badge`, `Group` or `GroupSeparator`.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bunx biome check <touched files>` | exit 0 |
    | `bun run storybook:typecheck` | exit 0 |
    | `bun run storybook:lint` | exit 0 |
    | `bun run verify:public-api` | exit 0, baseline unchanged |
    | `git diff --stat packages/parttens docs/architecture/public-api-exports.json` | empty output |
    | `vitest --project=storybook --project=storybook-dark` filtered to the SLAs stories | all pass, zero axe violations |
  - **Test types:**

    | Type | Cost class | What it covers |
    | --- | --- | --- |
    | static | cheapest | biome, `storybook:typecheck`, `storybook:lint`, `verify:public-api`, grep for border/radius/color/shadow classes on `Badge`, `Group`, `GroupSeparator` (`overrides:check` skips `apps/`) |
    | component | next | play in the `!dev` twin; only it catches the `group` role and name, the disabled states and axe violations |
    | manual | highest | contrast ratios of the Urgent icon and badge in both themes (3:1 graphics, 4.5:1 text), recorded in `docs/architecture/tc96-parttens.md`; `GroupSeparator` height at `Badge` size checked in the screenshot (gap b) |

    No E2E: nothing outside the rendered story can fail.
  - **Out of this Task:** rule editing flow, loading and failure states, any change to `packages/parttens`.
  - **Ships alone safely because:** it adds one story file and one doc note; no consumer imports a story file and the public API baseline is untouched.

Circuit breaker (both Tasks): if a composition needs a COSS override or a new pattern compound, stop and return to `workflow-research`.

Decision D2 (default, owner may flip): two story files, Labels and SLAs. If flipped to one file, T1 and T2 merge and lose parallelism.

### Open gaps

| Gap | Decide | Fecha-em |
| --- | --- | --- |
| (a) Capability slug `settings-usages` and the D2 two-file split await owner confirmation | dono | planejamento |
| (b) `GroupSeparator` height at `Badge` size is not rendered yet; inference from `packages/ui/src/separator.tsx:13`. Non-blocking, verified in the T2 screenshot | none (verified in T2) | planejamento |
| (c) Read-only rules under the gate, versus hiding them, follows the screenshot and is not user-validated. Accepted as a premise pending the owner | product-designer | planejamento |

### Board items

none

### Done when

- Every Task names one owner, its dependencies and its inputs: met above.
- Every Task has a written acceptance criterion and an evidence plan: met above.
- Every Task names its test types, and no type sits above the cheapest that catches its defect: met; manual covers contrast ratios only, which no automated level measures.
- Gaps (a) and (c) are closed by the owner; until then `status` stays `Draft` (`WF-CORE-09`).
- The sum of the Tasks fits the appetite (small, one session per unit); if it does not, the plan returns to the decision table instead of growing (`WF-PLAN-02`).

### Out of this file

| Belongs in | What |
| --- | --- |
| `requirements.md` | none: not created for this capability |
| `design.md` | none: not created for this capability |
| `user-experience.md` | none: not created for this capability |
| the board | none: the project keeps no tracker record yet |
