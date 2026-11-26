# AGENTS.md

Guide for AI coding agents working in this repository. For product context read `README.md`; for boundaries and decisions read `docs/architecture/tc96-ui.md` (written in Portuguese).

## What this repo is

`tc96-ui` is the tc96 UI: COSS components, React patterns (collection layouts, properties, detail sheet, editable, checklist, widgets, rich text editor) and blocks that the `@tc96/cli` CLI (`tc96 init`, `tc96 add`) copies as source into the `@tc96/ui` package of a consumer. The default consumer is a monorepo with the tc96-mono layout: every layer in `packages/ui/src/<layer>` and `cn` in `packages/utils`; `components.json` moves a layer elsewhere. Patterns carry no business rules, no CSS, no tokens and no theme: only layout classes on top of the consumer's COSS components.

Stack: Bun workspaces, React 19, TypeScript, Tailwind CSS v4, Base UI, Storybook 10, Biome.

## Layout

```text
packages/
  ui/          @tc96/ui, the same package and layout the consumer receives; ui.manifest.json lists the components
    src/components/  COSS-origin and own components (Text, IconFrame) owned by this repo, imported as @tc96/ui/<component>
                     a component may be a folder with index.ts, AGENTS.md, TOKENS.md and ACCESSIBILITY.md (menu/, badge/, alert/, text/, icon-frame/, gauge/); read its AGENTS.md before changing it
    src/hooks/ src/lib/  hooks and modules of the components (@tc96/ui/hooks/*, @tc96/ui/lib/*)
    src/helpers/     React-free functions (amount formatting, dates, rich text), @tc96/ui/helpers/*
    src/patterns/    pattern source, grouped in families (see Pattern families), @tc96/ui/patterns
    src/blocks/      installable blocks by category (<category>/<group>/<block>), above patterns, @tc96/ui/blocks/*; see packages/ui/src/blocks/AGENTS.md
  utils/       @tc96/utils, shared helpers (cn)
  themes/      @tc96/themes, theme presets as data, their CSS, fonts and the installable items; see packages/themes/AGENTS.md
  registry/    registry build and the CLI published as @tc96/cli (command tc96)
apps/
  storybook/   stories and interaction tests
  example/     example consumer; owns the stylesheet (apps/example/packages/ui/src/styles.css), which imports the presets generated into themes/presets.css
  docs/        documentation site
docs/architecture/  boundaries and decisions
scripts/            boundary, COSS, override and public API checks
```

## Pattern families

Patterns live under `packages/ui/src/patterns/`, at the top level or inside a family folder. A family exists when at least two patterns share a domain; a pattern with no sibling stays at the top level. `chat/` is the exception, chosen by the owner on 2026-10-19: it holds only `chats-panel` so far. Since 2026-10-21 the COSS chat stories live in `UI/Chat`; `Patterns/Chat` holds one six-page node per pattern, `Patterns/Chat/Assistant` and `Patterns/Chat/Chats Panel`, and each pattern's usages are on its own `Usages` page (Inbox and Lead Qualification under `Chats Panel`, Workflow under `Assistant`).

```text
packages/ui/src/patterns/
  records/      dialog/ preview/ group/
  surfaces/     state/ settings/
  chat/         chats-panel/
  checklist/ collection/ editable/ properties/ rich-text-editor/ stats/ widgets/ wizard/
  calendar/ data-grid/ data-table/ gallery/ kanban/ list-view/   the collection layouts, each usable alone; collection/ mounts them
  action-bar/ collection-pagination/ kanban-card/ toolbar/ view-settings-menu/ view-switcher/   not patterns: one folder per component with its own Patterns page
```

The registry item name is not the folder: `patternSources` in `packages/registry/src/manifest.ts` maps each item (`record-dialog`) to its folder (`records/dialog`), and the folder is also the path the consumer receives under its patterns alias. Stories mirror the folders in `apps/storybook/src/patterns/` and in the sidebar (`Patterns/Records/Group`). The exception is `records/dialog`, whose node the owner named `Patterns/Records/RecordDialog` on 2026-11-23.

## Pattern structure

`collection`, `records/dialog` and `editable` set the internal layout of a pattern. Code is grouped by responsibility, and a layer exists only when it has code to hold:

```text
packages/ui/src/patterns/[<family>/]<pattern>/
  index.ts       public barrel; re-exports the layer barrels. The registry and the public API baseline read this file
  core.ts        React-free surface: the pattern's types and pure functions, for use without rendering
  composition/   the compound the consumer mounts, one folder per compound with its own index.ts and tests
                 (editable/composition/editable/, collection/composition/, kanban/composition/kanban-view/)
  components/    building blocks of one compound, never public (records/dialog/components/dialog-shell.tsx)
  shared/        components and helpers used by more than one layout or display (collection/shared/components/, shared/lib/)
  display/       independently usable renderers of one pattern (properties)
  hooks/         React hooks (records/dialog/hooks/use-settled-action.ts, kanban/hooks/)
  lib/           pure functions and class variants (collection/shared/lib/project-collection.ts, kanban/lib/drag-and-drop.ts)
  store/         context, provider and shared state (editable/store/, collection/store/)
  types/         contracts shared across the pattern, with types/index.ts as the barrel; a type used by one file stays next to it
  test/dom.ts    the JSDOM setup of a bun test that cannot run in a browser (collection, wizard); each pattern owns its copy
```

Files are kebab-case and named after what they export (`checklist-row.tsx` exports `ChecklistRow`); tests sit next to the file they cover. `vite-env.d.ts` in the older patterns dates from isolated development: nothing imports it and the registry does not ship it, so a new or restructured pattern does not add it. The `styles/global.css` files of `collection`, `properties` and `editable` were removed on 2026-10-03 for the same reason (patterns carry no CSS). `checklist` follows this layout with `composition/checklist/`, `components/`, `lib/`, `types/`, `test/` and `core.ts`; a flat pattern such as `rich-text-editor` adopts it when it is next split.

## Rules that are enforced by scripts

- **Layering:** imports only go down: `blocks` → `patterns` → `ui` (`components/`, `hooks/`, `lib/`) → `utils` (`helpers` is React-free). A pattern never imports a block, and a block imports only its own folder, its group's `shared/` and its category's `shared/` (`blocks/data/shared/`), never another block. Checked by `bun run boundaries:check`. Whether new code is a `ui` component, a pattern or a block, and which block category it takes, is decided with `docs/architecture/layer-decision-map.md`.
- **`packages/ui/src/components` is repo-owned source** (2026-11-01). Its files start as COSS copies and may be edited, for example to drop unused variants and sizes. `bun run check:coss` only checks that every file is listed in `packages/ui/ui.manifest.json` and every listed item exists. `bun run sync:coss <item>` adds new COSS items, records them in the manifest and refuses to overwrite a file. Themes and tokens belong to the consumer, not to `packages/ui`. A COSS component, menu items included, is changed in `packages/ui`; a pattern never recreates or wraps one to change how it looks (decided 2026-11-19).
- **Overriding COSS styles needs a registered exception.** Any `className` that overrides a COSS component's border, radius, etc. must be listed with a reason in `scripts/override-exceptions.json`, or `bun run overrides:check` fails. Update the entry whenever the class changes.
- **Public API baseline:** adding or removing exports changes `docs/architecture/public-api-exports.json`. Regenerate with `bun scripts/verify-public-api.ts --record` and mention it in the summary, since the diff may include unrelated pending exports.
- Pattern `shared/` code is internal; export through the pattern's `index.ts` only when it is meant to be public.
- Every pattern carries its own `AGENTS.md` at `packages/ui/src/patterns/[<family>/]<pattern>/AGENTS.md`; a view with its own invariants may add one (`data-grid/AGENTS.md`). Read it before changing that pattern. `action-bar/AGENTS.md` and `toolbar/AGENTS.md` cover the components the root barrel exports outside a pattern, and a new pattern ships with its own file. The sections, in order: an opening paragraph, `Map`, `Dependents`, `Invariants`, `Styling`, `Verify`, `Pointers`; `properties/AGENTS.md` is the reference.
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
bun run test                 # helpers, boundaries, patterns, blocks, registry
bun run storybook:test       # vitest browser + axe (a11y violations fail)
bun run story:source <id>    # one story as a ready-to-use component; needs the dev server
bun run check                # full gate; run before a release or PR
bun run themes:build         # regenerate the example presets CSS from packages/themes; themes:check fails when it is stale
```

Run a single pattern's bun tests from the repo root, for example `bun test packages/ui/src/patterns/properties`, and its plays with `cd apps/storybook && bunx vitest run --project=storybook src/patterns/properties`. `bun run test:patterns` (`scripts/test-patterns.ts`) is the full bun run.

Before reporting a change as done, run Biome on the files you touched, `typecheck`, the relevant tests and the three check scripts above.

## Code conventions

- Biome formatting: 2 spaces, single quotes, no semicolons. Do not hand-format against it.
- **No comments in pattern or component code** (no JSDoc, no inline notes). The component name, its types and `docs/architecture/tc96-ui.md` carry the explanation. Exception: exported functions in `packages/ui/src/helpers` get JSDoc in English, with `@param` when a parameter is not obvious and `@returns` when it helps.
- Use `cn` from `@tc96/utils` for class merging and import COSS components, `Text` and `IconFrame` through `@tc96/ui/<component>`.
- Components are controlled: the consumer passes prepared data and handles events. No fetching, filtering, sorting or persistence inside a pattern.
- **Interface tests live in Storybook.** Behavior a user sees (clicks, menus, visibility, callbacks) is tested with a story `play` from `storybook/test`, not with `bun test` and JSDOM. `bun test` keeps code that renders nothing (`core.ts`, `lib/`, pure functions). A component test stays in `bun test` only when it cannot run as a `play`: a server render or a render that must throw.
- Widgets render through `WidgetShell` (`packages/ui/src/patterns/widgets/shared/widget-shell.tsx`), which is the COSS `Card` with a transparent border. Card radius is the consumer's: the example theme sets it on `[data-slot="card"]` (`apps/example/packages/ui/src/styles.css`), so a pattern never restates radius, border or shadow on a card.
- Prefer composition and the existing shared widgets (`IconFrame`, metric, stat list, avatar stack, progress ring, metric pill) over new one-off markup.
- The rich text editor is Plate (Slate) configured in `packages/ui/src/patterns/rich-text-editor/plugins.tsx`; its vocabulary is `RICH_TEXT_ELEMENTS` and `RICH_TEXT_MARKS`, and the document never carries node ids or the `/` menu input.
- Docs and architecture decisions are in Portuguese; code, stories, README and this file are in English.

## Visual work (widgets, stories, theme)

- The sidebar follows the layers, from the base to whole screens: `Get Started`, `Theme` (the foundations: `Overview`, then one page of token shapes per area, `Colors`, `Radius`, `Shadows`, `Typography`, whose plays run first when a theme or token changes), `UI` (COSS and own components, alias `ui`), `Patterns`, `Blocks` (installable blocks as `Blocks/<Category>/<Group>/<Name>`, with `Blocks/Doc`, alias `blocks`) and `Templates` (the Storybook-only screens, never installed). The order is fixed in `storySort` (`.storybook/preview.ts`), which Storybook evaluates as plain JavaScript, so it takes no type annotations; a new root goes into its list. A story sits under the layer of what it renders: one that imports only `@tc96/ui` is `UI/...` even when it composes several COSS parts, `Patterns/...` needs a pattern, and a component with its own folder outside a pattern sits at the root of `Patterns` (`Patterns/ActionBar`, `Patterns/CollectionToolbar`, `Patterns/CollectionPagination`, `Patterns/KanbanCard`, `Patterns/ViewSwitcher` and `Patterns/ViewSettingsMenu`; the kanban card left `Patterns/Kanban` on 2026-11-25; the view switcher and the view settings render inside the toolbar but have their own nodes, decided 2026-11-24, and the toolbar's pages show only its slots); the decision of 2026-10-31 gives each such page its own folder in `packages/ui/src/patterns/` instead of `shared/`. `CollectionPagination` folded into the collection on 2026-11-21 and moved back out on 2026-11-24: it lives in `collection-pagination/` and has its own node, `Patterns/CollectionPagination`. Story files mirror the title (`apps/storybook/src/ui/chat/`, `patterns/widgets/crm/`, `blocks/application/shell/`).
- Pattern stories live in `apps/storybook/src/patterns/`. The Storybook theme is the example app's `styles.css`, imported by `.storybook/preview.ts`; do not add a separate theme file or CSS rule in Storybook.
- Network data in stories goes through MSW handlers in `apps/storybook/src/mocks/` and TanStack Query, only in `Usages` and `Templates`, and only in story files whose meta has the `msw` tag (the preview starts the worker for those alone); components, patterns and blocks still take prepared data through props. The rules are in `Get Started/Component Docs` (`Mocked data`).
- Accessibility and usability live in `docs/accessibility.md`, the single source of truth: the validation layers, the contrast rules (WCAG thresholds, fixes that never change token values), the story rules, the axe exceptions and every measured ratio. Read it before visual work and record new ratios and decisions there; scale decisions stay in the architecture doc.
- The example theme is the `Twincan` preset, the tc96 theme. Every preset is a data file in `packages/themes/src/presets/`, with colors, typography and other; `bun run themes:build` writes them into `apps/example/packages/ui/src/themes/presets.css`, never edited by hand, selected by `data-theme-preset` on `html` and by the paintbrush (`themePreset` global) in the Storybook toolbar. A consumer installs one preset with `tc96 add --theme <name>`. Visual checks, axe and recorded ratios use the `Twincan`; a new or changed preset records its contrast in `docs/accessibility.md` (`Temas do exemplo`).
- Component docs are moving to six pages under the component node, in this order: `API Reference` (an MDX page attached to a hidden `api-reference.stories.tsx`), `Playground` (one story whose controls change texts, props, look values and optional parts), `Variants` (one story per prop value with the same structure: default, size, mode, loading, empty, hover, compact, a tone), `Layouts` (optional, one story per structure, differing only by `render`), `Behavior` (one `play` per guarantee; each non-default look value has its own story that proves it) and `Usages` (real content). A prop value is a Playground control and a `Variants` story; a prop that defines the structure (groups on or off, a fixed column layout) is a `Layouts` story (decided 2026-11-25, replacing the rule of 2026-11-23 and the old `Stories` page). `Anatomy` belongs to the hidden API Reference stories. The structure, its trade-offs, the MDX template and the writing rules are in `Get Started/Component Docs` (`apps/storybook/src/get-started/component-docs.mdx`); `UI/Alert` is the reference, and the order is fixed by `sections` in `storySort`. A component on this structure sets `tags: ['!autodocs']` on every story file and has no generated `Doc`; the others keep the `Doc` page below until they move (decided 2026-11-20).
- A `Doc` page exists only at the component root (`UI/Chat` has `Doc`; `UI/Chat/Status Bar` does not). Every nested story file sets `tags: ['!autodocs']` in its meta.
- Every `Doc` page uses `DocsPage` (`apps/storybook/.storybook/docs-page.tsx`) inside `ThemedDocsContainer` (`docs-container.tsx`), which follows the `dark` class the theme toolbar sets on `html`, so the blocks, the stories and the portals they open share one theme. A dashed anatomy placeholder comes from `apps/storybook/src/test-utils/anatomy-slot.tsx`.
- The `Doc` page layout: the default blocks plus a `Usage` section after the controls and an `API Reference` section at the end. Each renders only when the root meta sets `parameters.docs.usage` (the import and anatomy, as a string) or `parameters.docs.api` (`{ name, description }` per part, description in Markdown), typed by `UsageDocsParameters`; `UI/Chat` is the reference (`Patterns/Records/Group` and `Patterns/Wizard` moved to the six pages on 2026-11-22). An MDX page can place them with `<Usage of={Stories} />` and `<ApiReference of={Stories} />`.
- The Storybook MCP is for props, API and docs only. Its story snippets keep only the `render` body and drop local helpers, data and icon imports, so never copy UI from them. To copy a story or variant, take the story ID from `docs-list` (`withStoryIds: true`) and run `bun run story:source <id>`: it prints the story as `export default function <Story>()` with args inlined as props and the helpers, data and imports it uses, without decorators or Storybook APIs; `--story` prints the story module instead. The Code panel and the docs page show the same output. Relative imports are inlined when the code they pull in fits in `inlineLimit` lines (`scripts/story-component.ts`) without a name clash; larger fixtures (`../fixtures/...`) stay as imports, so read those files too. A story or its meta raises the limit for itself with `parameters.docs.source.inlineLimit`, as `Note` of `Patterns/Records/RecordDialog/Usages` (`apps/storybook/src/patterns/records/dialog/usages.stories.tsx`) does to inline its note fixtures.

## Git

- Work on a feature branch; `main` is the base for PRs.
- Commit messages follow `feat: ...` style seen in `git log`.
- A PR closes the issues it resolves with `Closes #N` in its body, one keyword per issue (`Closes #1, #2` closes only #1). Issues opened while working on it go under References. After `gh pr create`, confirm with `gh pr view <n> --json closingIssuesReferences`.
- Do not commit, push or publish unless asked. Before any npm publish, stop and ask the user to run `npm login`.


## Credits

- [tweakcn](https://github.com/jnsahaj/tweakcn) (Apache-2.0): reference for the theme token groups, the registry, fonts and apply-theme structure of `packages/themes`, and the origin of the 42 presets marked `source: 'tweakcn'`, kept as project data since 2026-11-26.

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
