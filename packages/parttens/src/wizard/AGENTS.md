# Wizard pattern

A controlled multi-step flow after the Multi Step 2 block of shadcn studio: `Wizard` (two layers of COSS `Card`: the steps in a `nav` on a recessed outer card, and the current step in a `section` on the default card raised over it), `WizardFooter` (the row of actions) and `WizardPrevious` and `WizardNext` (COSS `Button`s that move to the adjacent step). The consumer passes the steps, the current `value` and every label, renders the content of the current step, and owns the step data, the validation, the submission and which steps the nav can reach (`disabled`). The pattern never validates, submits, persists or ships CSS; its only state is the step it should focus after a move.

## Map

| Folder | Holds |
| --- | --- |
| `composition/wizard/` | `Wizard` on two COSS `Card`s, its test and barrel |
| `composition/wizard-footer/` | `WizardFooter`, `WizardPrevious` and `WizardNext` on the COSS `Button`, their test and barrel |
| `components/` | `wizard-step-item.tsx`: one step of the nav, its `IconFrame` indicator, title and description |
| `lib/` | `variants.ts`: the root, shell, nav, panel card, step, indicator `cva`, panel and footer classes |
| `store/` | `wizard-context.ts`: the adjacent steps and `move`, which `WizardPrevious` and `WizardNext` read |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: the prop types, `wizardStepStatuses`, `wizardStepStatus` and `adjacentWizardStep`, with `core.test.ts` |

Import direction: `composition/` → `components/`, `lib/`, `store/`, `core.ts`; `components/` → `lib/`, `core.ts` and `@tc96/elements/icon-frame`. The step helpers live in `core.ts`, not `lib/`, because `lib/steps.ts` importing the types from `core.ts` while `core.ts` re-exported it was a cycle for `boundaries:check`. No import into another pattern or into `packages/parttens/src/shared`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `wizard/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `wizard` for the registry item `wizard`; `packages/registry/src/manifest.test.ts` asserts the built item ships the folder plus `elements/src/icon-frame.tsx` and depends on `@coss/button` and `@coss/card`. Renaming the folder breaks the registry and the pattern test run.

## Invariants

Steps:

- The status of a step comes from its position against `value`: before it `complete`, at it `current`, after it `upcoming`. A `value` that is not a step makes every step `upcoming`, leaves the panel unnamed and disables both moves.
- The indicator shows the step `icon`; without one, a check once `complete` and the step number otherwise. It is the `IconFrame` element, `aria-hidden`, so a step button is named by its title and description. The current step button has `aria-current="step"`.
- A click on another step calls `onValueChange`; a click on the current step does not. A `disabled` step is a disabled button, so the nav cannot reach it, but `WizardPrevious` and `WizardNext` still move onto it: `disabled` limits jumps, not the order. Usage `Deal` disables the steps after the furthest one reached.

Moves:

- `WizardPrevious` and `WizardNext` call `onValueChange` with the step before or after `value` and are disabled when there is none; a consumer `disabled` adds to that, never removes it. On the last step the consumer usually renders its own submit button in place of `WizardNext`.
- The consumer `onClick` runs first, and `event.preventDefault()` there cancels the move. That is how a step validates without the pattern knowing the data.
- After a move, and only once the new `value` renders, the panel (`section` with `tabIndex={-1}`, named by the current step title) takes focus, because the button that moved may unmount or become disabled. A `value` change from the consumer (an edit button on a review, a reset) focuses the panel only when focus fell to `body`, which is what happens when the element that triggered it unmounted. A click in the nav keeps focus on the nav, the first render never takes focus, and a move the consumer ignores leaves focus where it was.
- No default copy: `label` names the `nav`, and the button labels and arrow icons are children.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="wizard"` | the root `div`, an `@container/wizard` |
| `data-slot="card"` | the outer COSS `Card` (the shell, only child of the root, holding the `nav`) and the inner one (holding the `section`) |
| `data-slot="wizard-nav"`, `wizard-panel`, `wizard-footer` | the `nav`, the `section` and the footer `div` |
| `data-slot="wizard-step"`, `data-status="complete\|current\|upcoming"` | each `li` of the nav |
| `data-slot="wizard-step-trigger"`, `wizard-step-indicator`, `wizard-step-title`, `wizard-step-description` | the step button and its parts; the indicator keeps the `data-shape`, `data-size` and `data-variant` of `IconFrame` |
| `data-slot="wizard-previous"`, `wizard-next` | the COSS `Button`s, in place of `button` |

- Two planes give the contrast, not borders: the outer `Card` is the background, `bg-muted shadow-none before:hidden` with `p-1` and `gap-1` (`dark:bg-sidebar`), and the `nav` sits on it with no fill or border; the inner `Card` keeps the COSS default (`bg-card`, border, shadow) and holds the panel, so it reads in front. In dark, `bg-muted` (white at 4%) is lighter than `bg-card` and the inner card looked sunk, so the shell takes the theme `sidebar` token there. Both classes are registered in `scripts/override-exceptions.json`. The owner asked for the `bg-muted` side on 2026-10-20 and for the layered look the same day, after removing the border between the nav and the panel.
- The inner radius is concentric: the shell copies its radius to `--wizard-shell-radius` (from the theme's `--card-surface-radius`, `--radius-2xl` without it) and the inner `Card` sets `--card-radius` to that minus `--spacing`, the `p-1` gap. The theme rule on `[data-slot="card"]` reads `--card-radius`, so the inner card is 6px under the 10px of the example theme; a theme without that rule leaves both at the COSS `rounded-2xl`. Renaming either variable breaks the radius without a type error.
- The layout follows the container, not the viewport: from `@2xl/wizard` (42rem) the shell is a grid of a 16rem nav and the inner card; below it the nav stacks above the card.
- The indicator is the `IconFrame` default (`size-9`, `bg-muted`) when `upcoming`; `complete` adds `bg-primary text-primary-foreground` and `current` also `ring-4 ring-primary/16`. `IconFrame` is an element, not a COSS component, so these classes are not overrides.
- `WizardPrevious` defaults to the `secondary` variant and `WizardNext` to the `Button` default; both take any `Button` prop.

## Verify

```bash
bun test --isolate packages/parttens/src/wizard
bunx biome check packages/parttens/src/wizard
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/wizard
```

The stories are in `apps/storybook/src/patterns/wizard/`. `wizard.stories.tsx` (`Patterns/Wizard`) is the root with the `Doc` page and its `usage` and `api` docs parameters: `Default`, `Numbered` (no icons) and `LockedSteps`, each with a `!dev` `<Story>Interaction` twin, holding `value` in a wrapper keyed by the `value` arg. `usages/deal.stories.tsx` (`Patterns/Wizard/Usages/Deal`) rebuilds the four-step deal flow (type radio cards, details, usage, review and submit) on the COSS `RadioGroup`, `Field`, `Select`, `InputGroup`, `Checkbox` and `Switch`, with a required title and the furthest step reached; it covers the full walk, the cancelled move and going back. `usages/campaign.stories.tsx` (`Patterns/Wizard/Usages/Campaign`) follows the same structure for a campaign: the initial info (title, owner and planned period), the campaign data, the Meta ad campaign, an optional daily budget (`ToggleGroup`, `Diário` first) and a review with one inset `RecordGroup` per step, whose pencil action returns to it; the fields go one per row and the objective is a `Select` with object values; it saves the draft in `localStorage` under `parttens:wizard:campaign-draft`, resumes it at the saved step without a notice, discards it after an `AlertDialog`, and creates on ⌘/Ctrl + Enter through a `form` around the `Wizard`, as `RecordDialog` does. Its stories reset or seed the key in `beforeEach`; `Default` resets only under Vitest, so a reload in the dev server resumes. The usages read `fixtures/deal.tsx`, `fixtures/campaign.tsx` and the shared `SelectField` and `CurrencyField` of `fixtures/fields.tsx`. Both theme projects run axe with `test: 'error'`. `apps/storybook/vite.config.ts` pre-bundles the Base UI `alert-dialog`, `radio`, `radio-group`, `toggle` and `toggle-group` modules these usages pull, because finding them mid-run reloaded the Vitest page and failed the files.

## Pointers

- Public API: `index.ts` and the `wizard` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (`wizard/`).
