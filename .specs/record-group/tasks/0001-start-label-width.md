---
capability: record-group
plan: 0001
owner: project-manager
status: Ready
appetite: small, one implementation session (one unit)
inputs: none accepted; issue #129 is a scale decision on an existing pattern, so no requirements.md, design.md, user-experience.md or ADR
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | not needed: no product behavior change, only the label column width |
| `../design.md` | not needed for options A and B below; option C (column follows the longest label) would need one, see Decision D1 |
| `../user-experience.md` | not needed |
| `../../adr/NNNN-<slug>.md` | none |

Gap (a) was closed by the owner on 2026-10-11: option B. The owner approved the plan on the same date by asking for the implementation (`WF-SPEC-06`).

### Facts

- The issue predates the 2026-10-09 story reorganization. Its paths are stale:
  - `packages/parttens/src/record-group/lib/variants.ts:42` is now `packages/parttens/src/records/group/lib/variants.ts:57-58`.
  - `Patterns/RecordGroup/Usages/Single Footer` is now `Patterns/Records/Group/Usages`.
  - The Brief and Versão rows are no longer `RecordGroupSubgroup` children. They render as `RecordGroupRow` inside a `RecordPreview`, opened from the `Briefing` and `Versions` stories (`apps/storybook/src/patterns/records/group/fixtures/blocks.tsx:271,326`).
- `variants.ts:57-58`: `start` is `w-30 shrink-0` and `between` is `min-w-0 max-w-30`. Both are 120px.
- `docs/architecture/tc96-parttens.md` disagrees with itself:
  - `:73` and `:75` say `w-30`/`max-w-30`, 120px. `:75` is the owner decision of 2026-10-06.
  - `:79` says "Decisão de escala: o rótulo `start` tem `w-32` (128px…)". This does not match the code.
  - `:85` says the row label is "limitado a `w-30`".
- Measured on 2026-10-11 in Storybook, light theme. The label font is `14px/20px` `system-ui`. Natural text widths:

  | Label | Characters | Width | Where |
  | --- | --- | --- | --- |
  | Objetivo secundário | 19 | 133px | `Briefing`, `Versions` (no `leading`) |
  | Data de nascimento | 18 | 132px | `Details` (no `leading`), truncated today |
  | Objetivo primário | 17 | 114px | `Briefing`, `Versions` |
  | Reference code | 14 | 105px | `Patterns/Records/Group` `Default` (with `leading`), truncated today |
  | Responsável pelo caso | 21 | 153px | probe only |
  | Área de atuação principal | 25 | 170px | probe only |

- `leading` sits inside the label column. The icon (16px) plus `gap-2` (8px) takes 24px, so with an icon the text gets the column width minus 24px. That is why `Default` truncates "Reference code" at 96px.
- `RecordGroupRow` is used only by the pattern itself, its tests and the Storybook stories and fixtures. No other pattern and no app imports it.
- Only two assertions encode 120px: `apps/storybook/src/patterns/records/group/record-group.stories.tsx:284` (`LongLabelStartInteraction`) and `:312` (`LongLabelBetweenInteraction`).

### Decision D1 (gap a, closed 2026-10-11: B)

How wide is the label column?

| Option | Change | Effect |
| --- | --- | --- |
| A · stays 120px | doc only: fix `:79` to `w-30` (120px) | "Objetivo secundário", "Data de nascimento" and "Reference code" keep truncating; the consumer shortens labels or uses `between` |
| **B · grows to `w-36` (144px), recommended** | `start` `w-36 shrink-0`, `between` `min-w-0 max-w-36`, so one step for both | fits every story label, ~20 pt-BR characters without `leading` (11px margin over 133px) and ~17 with it. At the 420px footer width the value keeps 244px, and 208px in the 384px `Default` |
| B′ · grows to `w-40` (160px) | same as B with `40` | ~22 characters without `leading` and ~19 with it; the value keeps 228px / 192px |
| C · follows the longest label | the container owns the column (CSS subgrid) | out of this plan. Each row is its own `dl`, valid anywhere (`AGENTS.md`, Markup). A shared column needs every container (group body, `RecordGroupSubgroup`, `RecordPreview` from another pattern) to opt in, plus a cap anyway. That is a contract change: return to `workflow-research` and write `design.md` |

The owner chose B on 2026-10-11, and the tasks below implement it.

### Tasks

- [x] **T1 · Set one label width and record it [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** none (D1 closed)
  - **Inputs:** none (no spec files). Sources:
    - `packages/parttens/src/records/group/lib/variants.ts:51-62`
    - `packages/parttens/src/records/group/AGENTS.md` (Styling, Verify)
    - `docs/architecture/tc96-parttens.md:73,75,79,85`
    - `apps/storybook/src/patterns/records/group/record-group.stories.tsx:267-322`
    - `apps/storybook/src/patterns/records/group/usages/blocks.stories.tsx:101-176,257-274`
  - **Scope:**
    - `variants.ts`: `start` becomes `w-36 shrink-0` and `between` becomes `min-w-0 max-w-36`. The `between` grid (`minmax(4rem,1fr)`) does not change.
    - `LongLabelStartInteraction`:
      - Every label is 144px, within ±0.5px (`toBeCloseTo`), instead of `≤ 120`.
      - The very long label still truncates.
    - `LongLabelBetweenInteraction`: label `≤ 144`.
    - `DefaultInteraction`: "Reference code" (with `leading`) is not truncated (`scrollWidth ≤ clientWidth`).
    - Usages:
      - `Details` asserts that "Data de nascimento" is not truncated.
      - `Briefing` asserts that "Objetivo secundário" is not truncated inside the open `RecordPreview`. The dialog is in a portal, so query through `screen`.
      - `Versions` asserts the same inside the preview of Versão 1.
    - `docs/architecture/tc96-parttens.md`:
      - `:73` says `w-36`.
      - `:79` replaces the `w-32` (128px) sentence with `w-36` (144px), measured with `getBoundingClientRect`.
      - `:85` says "limitado a `w-36`".
      - A new dated paragraph after the record-group entries: "Decidido em 2026-10-11, a pedido do dono (issue #129)". It holds the measurements table above (in Portuguese), the 24px that `leading` takes, why C was not chosen, and that it replaces the 120px cap of 2026-10-06.
      - `:75` keeps its history and points to the new paragraph.
      - Also fix the stale path at the end of `:73`: `packages/parttens/src/record-group/AGENTS.md` becomes `records/group/AGENTS.md`.
    - `packages/parttens/src/records/group/AGENTS.md`:
      - Styling, the "capped at a Tailwind scale step" bullet: add the reason. The step fits ~20-character pt-BR labels without `leading`, and `leading` takes 24px of the column. The number itself stays in `variants.ts`.
      - Verify: fix `src/patterns/record-group` to `src/patterns/records/group`.
  - **Acceptance:**
    - `variants.ts` and the architecture doc state the same width, and `grep -n "w-30\|w-32\|120px\|128px"` over the record-group text of the doc returns only history that points to the new decision.
    - In `Details`, `Briefing` and `Versions` at 420px, no label in the measurements table is truncated.
    - In `LongLabelStart` every row label is 144px and the long label truncates; the value stays visible.
    - `between` rows never overflow horizontally (`LongValueBetweenInteraction` unchanged and green).
    - `git diff --stat docs/architecture/public-api-exports.json` prints nothing.
    - `overrides:check` passes without a new entry. The label is the pattern's own `dt`, not a COSS part.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bunx biome check packages/parttens/src/records/group apps/storybook/src/patterns/records/group` | exit 0 |
    | `bun run typecheck && bun run storybook:typecheck` | exit 0 |
    | `bun test --isolate packages/parttens/src/records/group` | all pass |
    | `bun run check:coss && bun run boundaries:check && bun run overrides:check && bun run verify:public-api` | exit 0, baseline unchanged |
    | `cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/records/group` | all pass, zero axe violations |
    | light and dark screenshots of `Default`, `LongLabelStart`, `Details`, `Briefing` (preview open) | label column aligned; value starts after it with no clipping |
  - **Test types:**

    | Type | Cost class | What it covers |
    | --- | --- | --- |
    | static | cheapest | biome, typecheck, the three check scripts, `verify:public-api` |
    | component | next | the play functions above. Only a real browser measures width and truncation; jsdom does not lay out, so no bun test asserts the width, and a class-name assertion would test Tailwind, not the row |
    | manual | highest | the screenshots. Contrast does not change (same tokens), so the doc paragraph says so instead of measuring again |

    No E2E: nothing outside the rendered stories can fail.
  - **Out of this Task:** option C, a `labelWidth` prop or CSS variable, `RecordGroupItem` and `RecordGroupLink` caps, and the consumer's G3 7rem column (the consumer's call).
  - **Ships alone safely because:** it changes one class pair in a pattern that only Storybook renders today. The public API and the registry item's file list do not change. A consumer who already copied the pattern keeps 120px until it pulls the new source.

Circuit breaker: if a story shows that the value column gets too narrow at 144px (a `properties` editor clipping in `Briefing` or `Details`), stop and return to D1 rather than adding a per-row override.

### Open gaps

- none. (a) was closed on 2026-10-11 with option B, `w-36` (144px).
