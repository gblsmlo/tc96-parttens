<div align="center">

# @tc96/parttens
React patterns without business rules, installed as source on top of your COSS components

[![npm version](https://img.shields.io/npm/v/@tc96/parttens?style=flat&colorA=18181B&colorB=0EA5E9)](https://www.npmjs.com/package/@tc96/parttens)
[![npm downloads](https://img.shields.io/npm/dm/@tc96/parttens?style=flat&colorA=18181B&colorB=0EA5E9)](https://www.npmjs.com/package/@tc96/parttens)
[![License](https://img.shields.io/github/license/gblsmlo/tc96-parttens?style=flat&colorA=18181B&colorB=0EA5E9)](https://github.com/gblsmlo/tc96-parttens/blob/main/LICENSE)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white&labelColor=18181B)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white&labelColor=18181B)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white&labelColor=18181B)
![shadcn](https://img.shields.io/badge/shadcn-registry-FFFFFF?style=flat&logo=shadcnui&logoColor=white&labelColor=18181B)
![Storybook](https://img.shields.io/badge/Storybook-stories-FF4785?style=flat&logo=storybook&logoColor=white&labelColor=18181B)
![Bun](https://img.shields.io/badge/Bun-tests-FBF0DF?style=flat&logo=bun&logoColor=white&labelColor=18181B)
</div>

<img width="1096" height="570" alt="screenshot" src="https://github.com/user-attachments/assets/fd6faf76-1075-416d-a720-ea9ce41d2d36" />

## Overview

- **Source, not a dependency**: the CLI copies the pattern source into your workspace. You own it and change it as you like
- **Built on COSS**: patterns import `Button`, `Menu`, `Popover` and the rest from your project's own UI alias
- **Themeable**: tc96 ships no CSS, tokens or theme, only layout classes on top of your components
- **No business rules**: your app provides prepared data and handles events. Filtering, sorting, persistence and API calls stay with you
- **Layered**: imports only go down a layer (`patterns` → `elements` → `ui` → `utils`), checked by a boundaries script
- **Tested**: Storybook stories, bun tests, consumer install checks and a view benchmark

## Installation

```bash
npx @tc96/parttens add collection-views properties
```

**Quick Start:**

```tsx
import { CollectionViewOutlet, TextProperty } from '@acme/patterns'
```

### How it works

- **Your COSS components:** if a COSS component is missing, it is installed through shadcn. If you already have it, yours is reused, customizations included
- **Your aliases:** imports are rewritten to the aliases in your root `components.json`
- **Your files:** existing files are kept. shadcn asks before overwriting anything

### Requirements

- React 19, TypeScript and Tailwind CSS 4
- COSS set up with shadcn, with `components.json` at the monorepo root
- Node and npm to run the CLI. Bun is not required

### Consumer structure

tc96 expects a layered design system, in the spirit of atomic design, configured by one `components.json` at the monorepo root:

```text
components.json        aliases: ui, utils, elements, helpers, patterns
packages/
  ui/                  atoms: COSS components
  elements/            components COSS does not have, such as Text
  helpers/             React-free functions, such as amount formatting
  patterns/            organisms: tc96 patterns
apps/
  web/                 templates and pages
```

```json
{
  "aliases": {
    "components": "@acme/ui",
    "ui": "@acme/ui",
    "utils": "@acme/ui/lib/utils",
    "elements": "@acme/elements",
    "helpers": "@acme/helpers",
    "patterns": "@acme/patterns"
  }
}
```

Imports only go down a layer: `patterns` can import `elements`, `ui` and `utils`, and `elements` can import `ui` and `utils`. Each alias also needs exact and wildcard entries in the root `tsconfig` `paths`.

## Patterns

| Pattern | Contents |
| --- | --- |
| `collection-views` | List, Kanban, Data Grid and Calendar views, toolbar, pagination, selection |
| `properties` | Text, Date, Select, Person and other property displays, plus property groups |
| `detail-sheet` | Detail sheet with groups, rows and actions |
| `editable` | Inline editing compound |
| `checklist` | Controlled item creation, completion, renaming, ordering, deletion and progress |
| `widgets` | Dashboard widgets; the first set targets finance: market share, asset stats, risk score and balance chart |

Filter Builder and responsive layouts are out of scope for the first version.

## Updating

There is no package to update. To compare your installed files with the current version, run:

```bash
npx @tc96/parttens add collection-views --diff
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
├── parttens/          # Pattern source
├── elements/          # tc96 components COSS does not have, such as Text
├── helpers/           # React-free helpers shared by patterns, such as amount formatting
├── ui/                # Unmodified COSS components, locked to an upstream snapshot
├── utils/             # Shared helpers (cn)
└── registry/          # Registry build and the CLI, published as @tc96/parttens
apps/
├── storybook/         # Stories and interaction tests
└── docs/              # Documentation site
docs/architecture/     # Boundaries and decisions (in Portuguese)
scripts/               # Boundary, COSS sync and release checks
```

The [architecture document](docs/architecture/tc96-parttens.md) records the boundaries and decisions. It is written in Portuguese.

## Contributing

Contributions are welcome! Please:

1. Check existing [issues](https://github.com/gblsmlo/tc96-parttens/issues) or create a new one
2. Fork the repository and create a feature branch
3. Run `bun run check` before submitting
4. Submit a Pull Request with a clear description

## License

MIT License - see [LICENSE](./LICENSE) for details.
