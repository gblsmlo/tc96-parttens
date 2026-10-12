---
capability: editable-display
plan: 0001
owner: project-manager
status: Draft
issue: https://github.com/gblsmlo/tc96-parttens/issues/133
branch: feat/editable-display-field
appetite: small, three units; T1 and T2 in one session, T3 after gap (a) closes
inputs: none accepted; implementation detail inside two patterns, no requirements.md, design.md, user-experience.md or ADR
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | not needed: no product behavior change; `EditableText` keeps its props and tests |
| `../design.md` | not needed: the API choice is delegated to the PR by the issue and recorded in `fields/editable/AGENTS.md` and `docs/architecture/tc96-parttens.md` |
| `../user-experience.md` | not needed: keyboard and focus contract copied from `EditableText` as it is today |
| `../../adr/NNNN-<slug>.md` | none |

Gap (a) was flagged `fecha-em: planejamento`. The owner asked to finalize and open the PR without choosing, so T3 applies the recommended option (2) and the PR names it as the decision to confirm in review.

### Problem

`properties` ships its own inline editor, `EditableText` (`packages/parttens/src/fields/properties/display/editable-text/editable-text.tsx`), and no pattern uses `editable`. `Editable` cannot replace it: its parts swap `EditablePreview` (not editing) for `EditableInput` (editing) (`fields/editable/composition/editable/editable.tsx:398`, `:520`), while `EditableText` is one field that is always mounted, reads as text and starts editing on focus. Its session rules also differ: commit and Escape act only when the draft changed since focus (`editable-text.tsx:76-100`), and the blur that Escape triggers must read the restored draft, not stale state (`fields/properties/AGENTS.md`, Editing).

### Decision (proposed in this PR)

The display API is a **new part, `EditableField`**, not a root prop.

- A root prop would leave `EditablePreview`, `EditableTrigger` and `EditableToolbar` mounted but meaningless; a part composes instead of configuring, and the standard compound stays untouched.
- `EditableField` replaces `EditableArea` + `EditablePreview` + `EditableInput` in one root; mixing them is unsupported. `triggerMode` does not apply: the field always starts on focus.

Responsibility split:

| Behavior from the issue | Lives in | How |
| --- | --- | --- |
| Always rendered, transparent, starts on focus | `EditableField` | focus calls `beginEditing`; a change outside a session starts one |
| `multiline` → `textarea` with `field-sizing-content`; Enter commits only single line | `EditableField` | `multiline` prop |
| `type="email"` | `EditableField` | native input prop, passed through |
| Commit on blur or Enter only when dirty since focus | root + `EditableField` | `isDirty()` reads refs; a clean blur restores and leaves without `onSubmit` |
| Escape reverts and blurs only when dirty, then stops propagation | `EditableField` | clean Escape does nothing and bubbles |
| `emptyValue` cleared on focus, not counted as a change | root + `EditableField` | `beginEditing(initialDraft)`: the snapshot for `isDirty` is the cleared draft; cancel and clean exit restore the value from before the session |
| `readOnly` renders a `span` with `placeholder` fallback | `EditableField` | `value \|\| placeholder`, the rule `EditablePreview` already uses |
| Trim, empty string → `null`, `revertWhenEmpty`, no commit when equal to confirmed | `EditableText` | adapter between `string \| null` + `onCommit` and the root's `string` + `onSubmit` |
| A new `value` replaces the draft only while not editing | `EditableText` | controls `value` and `editing`; adjusts the draft during render, replacing the `useEffect` (`REACT-PAT-01`) |
| `size` scale, `EditableTextSize`, `data-slot="editable-text"`, muted class | `EditableText` | unchanged; `data-slot` overrides the field's `editable-field` |

Root changes are internal to `store/` and `editable.tsx` (not public): a latest-value ref and an editing ref written in `setValue`/`setEditing`, the session snapshot and the restore value, `isDirty()` and `exitEditing()` on the context. Standard-mode behavior and its seven tests do not change: without an initial draft the restore value equals the snapshot, so cancel still restores `['Draft', 'Alpha']`.

### Order

- T1 → T2: T2 is the proof of T1's API (`editable-text.test.tsx` unchanged).
- T3 after T2 and after gap (a).

### Tasks

- [x] **T1 · `EditableField` and the session rules in `Editable` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** none
  - **Scope:**
    - `fields/editable/store/editable-store.ts`: context gains `isDirty`, `exitEditing`, and `beginEditing(initialDraft?)`.
    - `fields/editable/composition/editable/editable.tsx`: refs and session in the root; new `EditableField` and `EditableFieldProps`; barrels, `types/` and `core.ts` re-export them.
    - Tests in `fields/editable/composition/editable/editable.test.tsx`, one per row assigned to `EditableField` or root above.
    - `fields/editable/AGENTS.md`: Map, Dependents (now imported by `properties`), Invariants (display session), Styling (`data-slot="editable-field"`, `data-editing`, `data-empty`; caret as focus indicator, the precedent of `EditableText`).
    - `bun scripts/verify-public-api.ts --record` (adds `EditableField`, `EditableFieldProps`).
  - **Acceptance:**
    - The seven existing `Editable` tests pass unchanged.
    - New tests cover: focus starts and blur ends the session; dirty blur submits once; clean blur submits nothing; Enter (single line) submits once; Enter in `multiline` submits nothing; dirty Escape restores, blurs and does not reach a `document` listener; clean Escape reaches it; `emptyValue` cleared on focus and restored on a clean blur, with Escape still bubbling; `readOnly` renders a `span` with the placeholder.
    - `aria-labelledby` is omitted when the consumer passes `aria-label`, so no reference points to a missing label.

- [x] **T2 · `EditableText` on `Editable` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T1
  - **Scope:**
    - `fields/properties/display/editable-text/editable-text.tsx` composes `Editable` + `EditableField`; the root renders as `span` with `contents`, so no box enters `TextProperty`, `EmailProperty` or `checklist`.
    - `fields/properties/AGENTS.md`: Map and import direction (`display/editable-text/` → `fields/editable`), Invariants › Editing (the ref note moves to `editable`).
  - **Acceptance:**
    - `editable-text.test.tsx` passes with no diff.
    - `text-property.test.tsx`, `email-property.test.tsx` and the `checklist` tests pass.
    - `Properties/Display` stories `editable-text`, `text-property`, `email-property` and the `checklist` stories pass `storybook:test` (axe included).

- [x] **T3 · Checklist import, registry and decision record [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T2, gap (a)
  - **Scope:**
    - `checklist/components/checklist-item-card.tsx:5` and `checklist/lib/variants.ts:2` per gap (a).
    - `checklist/AGENTS.md` (outgoing imports) and `fields/properties/AGENTS.md:21` (Dependents).
    - `docs/architecture/tc96-parttens.md`: the `EditableField` decision, dated 2026-10-11, in Portuguese.
  - **Acceptance:**
    - `dist/registry/properties.json` lists `parttens/src/fields/editable/**` files (the build follows every import, `packages/registry/src/build-registry.ts:71-86`).
    - `bun run build`, `bun run verify:public-api`, `bun run test` and the three check scripts pass.

### Progress (2026-10-11)

T1, T2 and T3 are implemented on `feat/editable-display-field`, rebased on `origin/main` (`e489a36`). T3 keeps the `checklist` imports by path (gap (a), option 2) and records the decision in `docs/architecture/tc96-parttens.md` and both `AGENTS.md` files. Readings: `fields/editable` 16 pass (7 existing unchanged, 1 trigger regression, 8 display); `fields/properties` + `checklist` 239 pass with no diff in `editable-text.test.tsx`; Storybook `editable-text`, `text-property`, `email-property`, `checklist` and `campaign-brief` 30 pass with axe; typecheck, Biome and the three check scripts pass; public API baseline gains only `EditableField` and `EditableFieldProps`; registry `properties` 76 → 80 files and `checklist` 31 → 35 (the four `editable` files). `bun run test` exits 1 on `records/dialog` › `ignores a second submit while pending`, which fails the same way on `main` without these changes and imports nothing from `fields/`; it is outside this plan. Found in passing and fixed in T1: `EditableTrigger` handed its click event to `beginEditing`, which would have become the initial draft.

### Open gaps

- **(a) Checklist through the `properties` barrel** — closed in the PR with option (2), pending the owner's confirmation in review. The issue asks for the barrel, but the registry ships every file a pattern reaches, so one barrel import makes the `checklist` item ship all of `properties` (~80 files instead of 12, plus `@daypicker/react`, `react-phone-number-input`, `zod` and eight more COSS components). `checklist` also imports `DateProperty` and `PersonProperty` by path, so switching only `EditableText` does not remove the path coupling. Options: (1) barrel for all three, accept the larger item; (2) keep file paths, update the AGENTS files only.
- **(b) Accepted behavior deltas** — `fecha-em: implementação`, recorded in the PR: `readOnly` with `value: ''` shows the placeholder (`||`, as `EditablePreview`), where today it shows an empty `span`; after a session ends, a confirmed value that changed during it replaces a rejected draft, where today the rejected draft stays.

### Evidence

| Command | Expected reading |
| --- | --- |
| `bun test --isolate packages/parttens/src/fields/editable` | all pass, new display tests included |
| `bun test --isolate packages/parttens/src/fields/properties packages/parttens/src/checklist` | all pass |
| `git diff main -- packages/parttens/src/fields/properties/display/editable-text/editable-text.test.tsx` | empty |
| `bun run typecheck && bun run check:coss && bun run boundaries:check && bun run overrides:check` | pass |
| `bun run verify:public-api` | pass after `--record`; diff shows only `EditableField`, `EditableFieldProps` |
| `bun run storybook:test` (focused on the four stories) | pass, axe included |
| `bun run build` | `properties.json` contains `fields/editable` files |
