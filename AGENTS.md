# AGENTS.md

Guide for AI coding agents working in this repository. For product context read `README.md`; for boundaries and decisions read `docs/architecture/tc96-parttens.md` (written in Portuguese).

## What this repo is

`@tc96/parttens` is a set of React patterns (collection layouts, properties, detail sheet, editable, checklist, widgets, rich text editor) that a CLI copies as source into a consumer's workspace. Patterns carry no business rules, no CSS, no tokens and no theme: only layout classes on top of the consumer's COSS components.

Stack: Bun workspaces, React 19, TypeScript, Tailwind CSS v4, Base UI, Storybook 10, Biome.

## Layout

```text
packages/
  parttens/    pattern source, grouped in families (see Pattern families)
  elements/    components COSS does not have (Text, IconFrame)
  helpers/     React-free functions (amount formatting, dates, rich text)
  templates/   installable templates (application shells), above parttens; see packages/templates/AGENTS.md
  ui/          COSS-origin components owned by this repo, listed in ui.manifest.json
  utils/       shared helpers (cn)
  registry/    registry build and the CLI published as @tc96/parttens
apps/
  storybook/   stories and interaction tests
  example/     example consumer; owns the theme (apps/example/packages/ui/src/styles.css) and its presets (themes/)
  docs/        documentation site
docs/architecture/  boundaries and decisions
scripts/            boundary, COSS, override and public API checks
```

## Pattern families

Patterns live under `packages/parttens/src/`, at the top level or inside a family folder. A family exists when at least two patterns share a domain; a pattern with no sibling stays at the top level. `chat/` is the exception, chosen by the owner on 2026-10-19: it holds only `chats-panel` so far. Since 2026-10-21 the COSS chat stories live in `UI/Chat`, and `Patterns/Chat` holds the `chats-panel` stories and the usages that use patterns.

```text
packages/parttens/src/
  records/      dialog/ preview/ group/
  surfaces/     state/ settings/
  chat/         chats-panel/
  checklist/ collection/ editable/ properties/ rich-text-editor/ widgets/ wizard/
  action-bar/ pagination/ toolbar/   not patterns: one folder per component with its own Patterns page
  shared/       not a pattern: the menu options the root barrel exports (place pending)
```

The registry item name is not the folder: `patternSources` in `packages/registry/src/manifest.ts` maps each item (`record-dialog`) to its folder (`records/dialog`), and the folder is also the path the consumer receives under its patterns alias. Stories mirror the folders in `apps/storybook/src/patterns/` and in the sidebar (`Patterns/Records/Dialog`).

## Pattern structure

`collection`, `records/dialog` and `editable` set the internal layout of a pattern. Code is grouped by responsibility, and a layer exists only when it has code to hold:

```text
packages/parttens/src/[<family>/]<pattern>/
  index.ts       public barrel; re-exports the layer barrels. The registry and the public API baseline read this file
  core.ts        React-free surface: the pattern's types and pure functions, for use without rendering
  composition/   the compound the consumer mounts, one folder per compound with its own index.ts and tests
                 (editable/composition/editable/, collection/composition/)
  components/    building blocks of one compound, never public (records/dialog/components/dialog-shell.tsx)
  shared/        components and helpers used by more than one layout or display (collection/shared/components/, shared/lib/)
  layouts/       independently usable renderers, each with components/, hooks/, lib/, types.ts and index.ts (collection);
                 properties uses display/ for the same role
  hooks/         React hooks (records/dialog/hooks/use-settled-action.ts, layouts/<layout>/hooks/)
  lib/           pure functions and class variants (shared/lib/project-collection.ts, layouts/kanban/lib/drag-and-drop.ts)
  store/         context, provider and shared state (editable/store/, collection/store/)
  types/         contracts shared across the pattern, with types/index.ts as the barrel; a type used by one file stays next to it
  test/dom.ts    the JSDOM setup of a bun test that cannot run in a browser (collection, wizard); each pattern owns its copy
```

Files are kebab-case and named after what they export (`checklist-row.tsx` exports `ChecklistRow`); tests sit next to the file they cover. `vite-env.d.ts` in the older patterns dates from isolated development: nothing imports it and the registry does not ship it, so a new or restructured pattern does not add it. The `styles/global.css` files of `collection`, `properties` and `editable` were removed on 2026-10-03 for the same reason (patterns carry no CSS). `checklist` follows this layout with `composition/checklist/`, `components/`, `lib/`, `types/`, `test/` and `core.ts`; a flat pattern such as `rich-text-editor` adopts it when it is next split.

## Rules that are enforced by scripts

- **Layering:** imports only go down: `templates` → `parttens` → `elements` → `ui` → `utils` (`helpers` is React-free). Checked by `bun run boundaries:check`.
- **`packages/ui` is repo-owned source** (ADR 0008, 2026-11-01). Its files start as COSS copies and may be edited, for example to drop unused variants and sizes. `bun run check:coss` only checks that every file is listed in `packages/ui/ui.manifest.json` and every listed item exists. `bun run sync:coss <item>` adds new COSS items, records them in the manifest and refuses to overwrite a file. Themes and tokens belong to the consumer, not to `packages/ui`.
- **Overriding COSS styles needs a registered exception.** Any `className` that overrides a COSS component's border, radius, etc. must be listed with a reason in `scripts/override-exceptions.json`, or `bun run overrides:check` fails. Update the entry whenever the class changes.
- **Public API baseline:** adding or removing exports changes `docs/architecture/public-api-exports.json`. Regenerate with `bun scripts/verify-public-api.ts --record` and mention it in the summary, since the diff may include unrelated pending exports.
- Pattern `shared/` code is internal; export through the pattern's `index.ts` only when it is meant to be public.
- Every pattern carries its own `AGENTS.md` at `packages/parttens/src/[<family>/]<pattern>/AGENTS.md`; a view with its own invariants may add one (`collection/layouts/data-grid/AGENTS.md`). Read it before changing that pattern. `packages/parttens/src/shared/AGENTS.md`, `action-bar/AGENTS.md`, `pagination/AGENTS.md` and `toolbar/AGENTS.md` cover the components the root barrel exports outside a pattern, and a new pattern ships with its own file. The sections, in order: an opening paragraph, `Map`, `Dependents`, `Invariants`, `Styling`, `Verify`, `Pointers`; `properties/AGENTS.md` is the reference.
- A pattern `AGENTS.md` holds only what `ls`, `grep` or `tsc` do not reveal: folders and import direction, code outside the pattern that imports it by file path, intentional behavior with its reason, the `data-*` contract and override exceptions, and the commands. It does not copy file lists, props, types, defaults, story lists or rules from this file; the public API is the pattern's `index.ts` and its entry in `docs/architecture/public-api-exports.json`. Update it when a folder, an external import by path, an invariant, a `data-*` attribute or a command changes.

## Commands

```bash
bun install
bun run storybook            # dev server
bun run typecheck            # tsc --noEmit
bun run storybook:typecheck
bun run lint:ci              # biome on scripts and registry
bun run storybook:lint
bun run check:coss && bun run boundaries:check && bun run overrides:check
bun run verify:public-api
bun run test                 # ui/utils, helpers, boundaries, patterns, registry
bun run storybook:test       # vitest browser + axe (a11y violations fail)
bun run story:source <id>    # one story as a ready-to-use component; needs the dev server
bun run check                # full gate; run before a release or PR
bun run sync:themes          # regenerate the tweakcn theme presets from the tweakcn registry
```

Run a single pattern's bun tests from the repo root, for example `bun test packages/parttens/src/properties`, and its plays with `cd apps/storybook && bunx vitest run --project=storybook src/patterns/properties`. `bun run test:patterns` (`scripts/test-patterns.ts`) is the full bun run.

Before reporting a change as done, run Biome on the files you touched, `typecheck`, the relevant tests and the three check scripts above.

## Code conventions

- Biome formatting: 2 spaces, single quotes, no semicolons. Do not hand-format against it.
- **No comments in pattern or component code** (no JSDoc, no inline notes). The component name, its types and `docs/architecture/tc96-parttens.md` carry the explanation. Exception: exported functions in `packages/helpers` get JSDoc in English, with `@param` when a parameter is not obvious and `@returns` when it helps.
- Use `cn` from `@tc96/utils` for class merging and import COSS components through `@tc96/ui/<component>`.
- Components are controlled: the consumer passes prepared data and handles events. No fetching, filtering, sorting or persistence inside a pattern.
- **Interface tests live in Storybook.** Behavior a user sees (clicks, menus, visibility, callbacks) is tested with a story `play` from `storybook/test`, not with `bun test` and JSDOM. `bun test` keeps code that renders nothing (`core.ts`, `lib/`, pure functions). A component test stays in `bun test` only when it cannot run as a `play`: a server render or a render that must throw.
- Widgets render through `WidgetShell` (`packages/parttens/src/widgets/shared/widget-shell.tsx`), which is the COSS `Card` with a transparent border. Card radius is the consumer's: the example theme sets it on `[data-slot="card"]` (`apps/example/packages/ui/src/styles.css`), so a pattern never restates radius, border or shadow on a card.
- Prefer composition and the existing shared widgets (`IconFrame`, metric, stat list, avatar stack, progress ring, metric pill) over new one-off markup.
- The rich text editor is Plate (Slate) configured in `packages/parttens/src/rich-text-editor/plugins.tsx`; its vocabulary is `RICH_TEXT_ELEMENTS` and `RICH_TEXT_MARKS`, and the document never carries node ids or the `/` menu input.
- Docs and architecture decisions are in Portuguese; code, stories, README and this file are in English.

## Visual work (widgets, stories, theme)

- The sidebar follows the layers, from the base to whole screens: `Get Started`, `UI` (COSS, alias `ui`), `Elements`, `Patterns`, `Application` (installable templates, alias `templates`) and `Templates` (`Templates/Doc` and the Storybook-only screens). The order is fixed in `storySort` (`.storybook/preview.ts`), which Storybook evaluates as plain JavaScript, so it takes no type annotations; a new root goes into its list. A story sits under the layer of what it renders: one that imports only `@tc96/ui` is `UI/...` even when it composes several COSS parts, `Patterns/...` needs a pattern, and a component with its own folder outside a pattern sits at the root of `Patterns` (`Patterns/ActionBar`, `Patterns/Pagination`, `Patterns/Toolbar`, with `Patterns/Toolbar/View Switcher` nested under the toolbar it renders in); the decision of 2026-10-31 gives each such page its own folder in `packages/parttens/src/` instead of `shared/`. Story files mirror the title (`apps/storybook/src/ui/chat/`, `patterns/widgets/stats/`, `application/shell/`).
- Pattern stories live in `apps/storybook/src/patterns/`. The Storybook theme is the example app's `styles.css`, imported by `.storybook/preview.ts`; do not add a separate theme file or CSS rule in Storybook.
- Do not give story wrappers a background, so the page inherits `bg-background` and card contrast stays visible.
- When refining a visual pattern, also audit contrast (WCAG 4.5:1 for text, 3:1 for graphics, with the numeric ratios), spacing and composition, check a light and dark screenshot of the story, and record scale decisions in the architecture doc.
- Contrast fixes never change token values. The values in the theme's `:root` and `.dark` stay as they are, and `packages/ui` is never edited. A failing pair means an element sits on a surface its tokens were not made for, so fix it where the element meets the surface:
  - In one place, give the element the foreground of the surface it sits on, with an opacity modifier when it needs a tint: the `RecordDialog` submit hint on the primary button uses `bg-primary-foreground/16 text-primary-foreground`. On a COSS component this is an override, so register it in `scripts/override-exceptions.json`.
  - When a COSS component fails wherever it renders, the fix is global: a rule in the example app's `styles.css` scoped to the component's `data-slot`, such as `[data-slot="switch"] { --input: var(--switch-track); }`. Record it in the architecture doc as a note for the consumer.
  - Either way, record the ratios before and after, in light and dark.
- The example theme is the `Default` preset. Other presets are rule sets in `apps/example/packages/ui/src/themes/`, selected by `data-theme-preset` on `html` and by the paintbrush (`themePreset` global) in the Storybook toolbar. `base-colors.css` (stone, neutral, slate, zinc) is hand-written on the COSS recipe; `tweakcn.css` and `presets.ts` are generated by `bun run sync:themes`, so never edit them by hand. Visual checks, axe and recorded ratios use the `Default`; a new preset records its contrast in the architecture doc (`Temas do exemplo`).
- Stories must pass axe: `a11y.test` is set to `error`.
- A `Doc` page exists only at the component root (`UI/Button` has `Doc`; `UI/Button/Sizes` does not). Every nested story file sets `tags: ['!autodocs']` in its meta.
- Every `Doc` page uses `DocsPage` (`apps/storybook/.storybook/docs-page.tsx`): the default blocks plus a `Usage` section after the controls and an `API Reference` section at the end. Each renders only when the root meta sets `parameters.docs.usage` (the import and anatomy, as a string) or `parameters.docs.api` (`{ name, description }` per part, description in Markdown), typed by `UsageDocsParameters`; `Patterns/Records/Group` is the reference. An MDX page can place them with `<Usage of={Stories} />` and `<ApiReference of={Stories} />`.
- The Storybook MCP is for props, API and docs only. Its story snippets keep only the `render` body and drop local helpers, data and icon imports, so never copy UI from them. To copy a story or variant, take the story ID from `docs-list` (`withStoryIds: true`) and run `bun run story:source <id>`: it prints the story as `export default function <Story>()` with args inlined as props and the helpers, data and imports it uses, without decorators or Storybook APIs; `--story` prints the story module instead. The Code panel and the docs page show the same output. Relative imports are inlined when the code they pull in fits in `inlineLimit` lines (`scripts/story-component.ts`) without a name clash; larger fixtures (`../fixtures/...`) stay as imports, so read those files too. A story or its meta raises the limit for itself with `parameters.docs.source.inlineLimit`, as `Create/Row Properties` and `Usages/Calendar` of `Patterns/Records/Dialog` do to inline their event fixtures.

## Git

- Work on a feature branch; `main` is the base for PRs.
- Commit messages follow `feat: ...` style seen in `git log`.
- A PR closes the issues it resolves with `Closes #N` in its body, one keyword per issue (`Closes #1, #2` closes only #1). Issues opened while working on it go under References. After `gh pr create`, confirm with `gh pr view <n> --json closingIssuesReferences`.
- Do not commit, push or publish unless asked. Before any npm publish, stop and ask the user to run `npm login`.

## Specs

Spec files live in `.specs/`, written as `Draft` and approved by the owner in the conversation (`WF-SPEC-06`). Decided on 2026-10-11.

| Document | Keep | File |
| --- | --- | --- |
| PRD | on | `.specs/<capability>/requirements.md` |
| Design doc or RFC | on | `.specs/<capability>/design.md` |
| ADR | on | `.specs/adr/NNNN-<slug>.md` |
| User experience | on | `.specs/<capability>/user-experience.md` |
| Plan | on | `.specs/<capability>/tasks/NNNN-<slug>.md` |
| Board items | off | none |
