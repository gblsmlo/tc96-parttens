
<div align="center">

# tc96 ui
COSS components, React patterns and blocks without business rules, installed as source into the `@tc96/ui` package of your monorepo

[![npm version](https://img.shields.io/npm/v/@tc96/cli?style=flat&colorA=18181B&colorB=0EA5E9)](https://www.npmjs.com/package/@tc96/cli)
[![npm downloads](https://img.shields.io/npm/dm/@tc96/cli?style=flat&colorA=18181B&colorB=0EA5E9)](https://www.npmjs.com/package/@tc96/cli)
[![License](https://img.shields.io/github/license/gblsmlo/tc96-parttens?style=flat&colorA=18181B&colorB=0EA5E9)](https://github.com/gblsmlo/tc96-parttens/blob/main/LICENSE)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white&labelColor=18181B)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white&labelColor=18181B)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white&labelColor=18181B)
![shadcn](https://img.shields.io/badge/shadcn-registry-FFFFFF?style=flat&logo=shadcnui&logoColor=white&labelColor=18181B)
![Storybook](https://img.shields.io/badge/Storybook-stories-FF4785?style=flat&logo=storybook&logoColor=white&labelColor=18181B)
![Bun](https://img.shields.io/badge/Bun-tests-FBF0DF?style=flat&logo=bun&logoColor=white&labelColor=18181B)
</div>

<img width="1337" height="754" alt="Screenshot 2026-10-12 at 14 18 51" src="https://github.com/user-attachments/assets/7f2e0024-8ffe-46e1-a0a6-145c56a8ee96" />

## Overview

- **Source, not a dependency**: the CLI copies the pattern source into your workspace. You own it and change it as you like
- **Built on COSS**: patterns import `Button`, `Menu`, `Popover` and the rest from your project's own UI alias
- **Themeable**: tc96 ships no CSS, tokens or theme, only layout classes on top of your components
- **No business rules**: your app provides prepared data and handles events. Filtering, sorting, persistence and API calls stay with you
- **Layered**: imports only go down a layer (`blocks` → `patterns` → `ui` → `utils`), checked by a boundaries script
- **Tested**: Storybook stories, bun tests, consumer install checks and a view benchmark

## Get Started

In a monorepo with the tc96-mono layout (`packages/ui` as `@tc96/ui`, `packages/utils` as `@tc96/utils`), prepare it once at the root:

```bash
npx @tc96/cli init
```

`init` writes `components.json` with every layer in `packages/ui/src` and adds the layer exports `packages/ui/package.json` lacks. Edit the aliases in `components.json` to install a layer elsewhere; `init` keeps an existing `components.json`.

Install one or more patterns by name:

```bash
npx @tc96/cli add collection properties
```

The Record family has three items: `record-dialog`, `record-preview` and `record-group`.

```bash
npx @tc96/cli add record-dialog record-preview record-group
```

Preview what would change before writing anything, or compare installed files with the current version:

```bash
npx @tc96/cli add record-dialog --dry-run
npx @tc96/cli add record-dialog --diff
```

If the repo blocks `npx`, use `bunx @tc96/cli add ...` or `pnpm dlx @tc96/cli add ...`.

Before copying anything, the CLI type-checks the patterns against your own `ui` components. If they do not type-check, it stops with exit code 1, in a `--dry-run` too. Fix the diagnostics it prints, or pass `--force` to install anyway.

**Quick Start:**

```tsx
import { CollectionLayoutOutlet, TextProperty } from '@tc96/ui/patterns'
```

### Blocks

A block is a numbered variation of a page, a page frame or a page section that you install and then edit, such as an application shell. Blocks consume patterns; a pattern never imports a block. They live in categories: Application, Auth, Data, Charts, Solutions, AI & Agents, eCommerce and Marketing. The first ones are application shells, `app-shell-1` to `app-shell-4`, followed by the auth pages and the flow editors:

```bash
npx @tc96/cli add app-shell-1
```

The CLI writes a block where the `blocks` alias resolves (`packages/ui/src/blocks` in the default layout), and you import it from its folder:

```tsx
import { AppShell1 } from '@tc96/ui/blocks/application/shell/app-shell-1'
```

The `blocks` alias needs to resolve only when you install a block; a consumer that still uses `aliases.templates` or the `templates` entry keeps working with a warning. The Blocks page in Storybook lists every block and its options.

#### Auth pages

`login-1`, `login-2`, `otp-1`, `signup-1`, `signup-2`, `reset-password-1`, `reset-password-2`, `forgot-password-1` and `forgot-password-2` are the pages of the sign in flow. Each one is a whole page (the `main`, the centered card and your `logo` above it), so you only mount it on the route:

```bash
npx @tc96/cli add login-1
npx @tc96/cli add forgot-password-1
```

```tsx
import { Login1 } from '@tc96/ui/blocks/application/auth/login-1'
```

The pages are controlled: you pass `pending`, `error` and `fieldErrors` and receive `onSubmit(values)`, after the native constraints pass. They never fetch, keep a session or import an auth provider; links go through `renderLink` and only appear when you pass their `href`, every text is in `labels` (pt-BR by default), and the resend and link validity countdowns are numbers you count down and pass in. `login-2`, `signup-2` and `forgot-password-2` are the minimal `login-1`, `signup-1` and `forgot-password-1`, with only the fields and the submit button (no logo, links or providers). `reset-password-2` is `reset-password-1` with a validity timer for the reset link, and `forgot-password-1` and `forgot-password-2` swap their form for a confirmation when you pass `sent`.

#### AI & Agents: flow editors

`workflow-editor` and `agent-builder` are two editor pages with the same anatomy: a page header (name, shortcuts, ask the AI, add step, run, actions menu), a step library on the left, a canvas on React Flow in the middle, an inspector with Build, Status and Logs on the right and an AI assistant card over the canvas. `workflow-editor` lays the steps out horizontally, with undo, redo, lock and a minimap; `agent-builder` lays them out as a vertical tree, with edge controls and an "Organizar árvore" button.

```bash
npx @tc96/cli add workflow-editor
npx @tc96/cli add agent-builder
```

Both bring `@xyflow/react` and `d3-hierarchy`, the `tabs`, `context-menu`, `progress` and `alert` COSS components and the `flow-canvas`, `flow-step-library`, `flow-inspector` and `chat-assistant` pattern files they import. Import the React Flow stylesheet once in your global CSS; without it the canvas does not place nodes or edges:

```css
@import '@xyflow/react/dist/base.css';
```

The block is controlled: you pass the steps, the connections, the selection, the run state and the logs, and receive `onStepAdd`, `onStepChange`, `onStepsChange`, `onConnect`, `onRun` and the other callbacks. It never fetches, saves, keeps a history or calls a model; every text is in `labels`, in pt-BR by default.

### How it works

- **Your COSS components:** if a `ui` component is missing, the CLI installs it from its own package. If you already have it, yours is reused, customizations included
- **Your aliases:** imports are rewritten to the aliases in your root `components.json`; each alias resolves through the exports of the workspace package that owns it, or through the root `tsconfig` `paths`
- **Your files:** existing files are kept. shadcn asks before overwriting anything

### Requirements

- React 19, TypeScript and Tailwind CSS 4
- A Bun monorepo with the tc96-mono layout, or any workspace with a `components.json` at its root
- Node and npm to run the CLI. Bun is not required

### Consumer structure

The default is the tc96-mono layout: one `@tc96/ui` workspace package holds every layer, and `@tc96/utils` holds `cn`. Packages resolve through their `exports`, with no `tsconfig` `paths`:

```text
components.json        written by tc96 init
packages/
  ui/                  @tc96/ui
    package.json       exports ./*, ./hooks/*, ./lib/*, ./helpers/*, ./patterns, ./patterns/*, ./blocks/*
    src/
      components/      COSS components and the ones COSS does not have, such as Text and IconFrame (@tc96/ui/<component>)
      hooks/ lib/      hooks and modules of the components (@tc96/ui/hooks/*, @tc96/ui/lib/*)
      helpers/         React-free functions, such as amount formatting and rich text helpers (@tc96/ui/helpers/*)
      patterns/        tc96 patterns (@tc96/ui/patterns)
      blocks/          tc96 blocks (@tc96/ui/blocks/<category>/<group>/<block>)
  utils/               @tc96/utils, exports cn
apps/
  web/                 routes and pages
```

```json
{
  "aliases": {
    "components": "@tc96/ui",
    "ui": "@tc96/ui",
    "utils": "@tc96/utils",
    "lib": "@tc96/ui/lib",
    "hooks": "@tc96/ui/hooks",
    "helpers": "@tc96/ui/helpers",
    "patterns": "@tc96/ui/patterns",
    "blocks": "@tc96/ui/blocks"
  }
}
```

To install elsewhere, change these aliases. Each one must resolve through the exports of the workspace package that owns it (`"./patterns/*": "./src/patterns/*.tsx"`) or through the root `tsconfig` `paths` (`"@acme/ui/patterns/*": ["./packages/ui/src/patterns/*"]`). Without `hooks` and `lib`, hooks and lib files go under the `ui` directory; without `helpers`, `patterns` or `blocks`, the alias replaces the last segment of `ui`. Imports only go down a layer: `patterns` can import `ui` and `utils`. `Text` and `IconFrame` are ui components: the CLI installs them with the COSS ones when a pattern needs them, and adds their folder export to the ui package. The CLI adds the npm dependencies to the workspace package that holds the `patterns` path, `packages/ui/package.json` here.

### Install with an AI agent

Paste this into your coding agent, replacing the pattern names:

````text
Install the tc96 patterns `collection` and `properties` in this project.

1. Find the root `components.json`. If it is missing and the repo has `packages/ui` (`@tc96/ui`) and `packages/utils` (`@tc96/utils`), run `npx @tc96/cli init` and show me what it wrote. Otherwise stop and ask me; do not run `shadcn init --force`, which rewrites it.
2. Check that each alias in `components.json` resolves, through the exports of the workspace package that owns it or through the root `tsconfig.json` `paths`. If something is missing, show me the change and wait for my approval before editing.
3. Preview first, from any directory inside the repo (the CLI searches upward for `components.json`; use `--cwd` to override):
   npx @tc96/cli add collection properties --dry-run
   Read the output. If it lists files that already exist or a destination I did not expect, such as a legacy folder with the same name, stop and ask me. If it stops with "do not type-check against your components", report the diagnostics and wait; do not add `--force`.
4. Install:
   npx @tc96/cli add collection properties
   Answer no to any shadcn prompt that would overwrite a file I own. If the repo blocks npx, use `bunx` or `pnpm dlx`.
5. Do not edit the installed files or the COSS components in `ui`. Import from the `patterns` alias (`import { CollectionLayoutOutlet } from '@tc96/ui/patterns'`).
6. Run the typecheck and lint scripts of the workspace that received the files, and report what was installed, where, and any errors.
````

## Patterns

| Pattern | Contents |
| --- | --- |
| `collection` | List, Kanban, Data Grid and Calendar layouts, toolbar, pagination, selection |
| `properties` | Text, Date, Select, Person and other property displays, plus property groups |
| `editable` | Inline editing compound |
| `checklist` | Controlled item creation, completion, renaming, ordering, deletion and progress |
| `record-dialog` | `RecordDialog` for create and edit; the handler returns `boolean \| Promise<boolean>` and the pattern settles the dialog. `RecordDialogHeadline` (borderless title and description) and `RecordDialogCreateMore` (the switch for `footerStart` + `keepOpenOnSuccess`) are optional parts of the same item |
| `record-preview` | `RecordPreview`, a right-side sheet that previews a record with header actions, a close button and an optional footer, and `RecordPreviewAction`, its icon action; open state and content belong to the consumer |
| `record-group` | `RecordGroup`, a collapsible group of label and value rows with optional header actions and footer, `RecordGroupRow`, its row, and `RecordGroupAction`, an icon action for the header; collapse state is optional and rows belong to the consumer |
| `widgets` | Dashboard widgets in four groups: finance (market share, asset stats, risk score, balance, budget, cash flow, transactions, invoices), productivity (task progress, upcoming event, project card, agenda, world clock), CRM (pipeline, deals, activity feed, contact card) and gamification (level, streak, achievements, quests, progress HUD and footer), plus shared metric, stat list, avatar stack, progress ring, metric pill and the IconFrame element |
| `rich-text-editor` | Notion-style block editor on headless Plate: paragraphs, headings, quote, nested lists, five marks, floating toolbar, `/` menu and a separate editable title |
| `state-surface` | `StateSurface` for empty, no-result, error, permission and not-found, and `StateGuard`, which mounts its children only when the state is `data` |
| `settings` | `SettingsSection`, a divided card of settings with an optional title, and `SettingsRow`, a row with title, description, an optional `startSlot` and the control in `endSlot`; values and controls belong to the consumer |
| `chats-panel` | `ChatsPanel`, a titled list of conversations for an inbox in a `plain`, `card` or `inset` shell, `ChatsPanelItem`, a row with avatar, unread count, channel mark (an `@thesvg/icons` icon, a peer dependency), time and preview, `ChatsPanelList`, its list, and `ChatsPanelSkeleton`, a loading list in the shape of the rows; sorting, filtering and selection belong to the consumer |
| `wizard` | `Wizard`, a multi-step flow in a card with the steps in a side nav (an `IconFrame` with the icon, a check or the number, title and description) and the current step in a panel, `WizardFooter`, its row of actions, and `WizardPrevious` and `WizardNext`, which move to the adjacent step and let the consumer cancel the move to validate; the step, its data and the submission belong to the consumer |
| `list` | `List`, a row with an `IconFrame` holding the icon, a title, an optional description clamped to two lines and an optional `actions` slot at the end, `outline` or `plain`; through `render` it is a static row with actions, a whole-row link or button, or the `label` of a `Radio` or `Checkbox` in a list of choices; texts, handlers and the group state belong to the consumer |

Filter Builder and responsive layouts are out of scope for the first version.

## Updating

There is no package to update. To compare your installed files with the current version, run:

```bash
npx @tc96/cli add collection --diff
```

Then apply the changes you want by hand.

## Development

```bash
# Install dependencies
bun install

# Start Storybook dev server
bun run storybook

# Run tests
bun run test
bun run storybook:test

# Type checking
bun run typecheck

# Lint
bun run lint:ci

# Build the registry
bun run build

# Full verification (run before a release)
bun run check
bun run release:check
```

## Project Structure

```text
packages/
├── ui/                # @tc96/ui, the same layout the consumer receives
│   └── src/
│       ├── components/  # COSS-origin and own components (Text, IconFrame), listed in ui.manifest.json
│       ├── hooks/ lib/  # Hooks and modules of the components
│       ├── helpers/     # React-free helpers shared by patterns, such as amount formatting
│       ├── patterns/    # Pattern source
│       └── blocks/      # Installable blocks
├── utils/             # @tc96/utils, shared helpers (cn)
└── registry/          # Registry build and the CLI, published as @tc96/cli
apps/
├── storybook/         # Stories and interaction tests
└── docs/              # Documentation site
docs/architecture/     # Boundaries and decisions (in Portuguese)
scripts/               # Boundary, COSS sync and release checks
```

The [architecture document](docs/architecture/tc96-ui.md) records the boundaries and decisions. It is written in Portuguese.

## Contributing

Contributions are welcome! Please:

1. Check existing [issues](https://github.com/gblsmlo/tc96-parttens/issues) or create a new one
2. Fork the repository and create a feature branch
3. Run `bun run check` before submitting
4. Submit a Pull Request with a clear description

## License

MIT License - see [LICENSE](./LICENSE) for details.
