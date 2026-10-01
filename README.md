# tc96-parttens

React patterns without business rules, built on your project's own [COSS](https://coss.com/ui) components. You install the source, own it, and change it as you like.

```sh
npx tc96-parttens add collection-views properties
```

```tsx
import { CollectionViewOutlet, TextProperty } from '@acme/patterns'
```

> **Status:** 0.1.0, the first release. The API can change before 1.0.

## How it works

tc96 is not a runtime dependency. It works like shadcn and COSS: the CLI copies the pattern source into your workspace.

- **Your COSS components:** patterns import `Button`, `Menu`, `Popover` and the rest from your project's UI alias. If a COSS component is missing, it is installed through shadcn. If you already have it, yours is reused, customizations included.
- **Your theme:** tc96 ships no CSS, tokens or theme. Patterns use COSS components without changes and only add layout classes.
- **Your aliases:** imports are rewritten to the aliases in your root `components.json`.
- **Your files:** existing files are kept. shadcn asks before overwriting anything.

## Consumer structure

tc96 expects a layered design system, in the spirit of atomic design, configured by one `components.json` at the monorepo root:

```text
components.json        aliases: ui, utils, elements, patterns
packages/
  ui/                  atoms: COSS components
  elements/            components COSS does not have, such as Text
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
    "patterns": "@acme/patterns"
  }
}
```

Imports only go down a layer: `patterns` can import `elements`, `ui` and `utils`, and `elements` can import `ui` and `utils`. Each alias also needs exact and wildcard entries in the root `tsconfig` `paths`.

## Requirements

- React 19, TypeScript and Tailwind CSS 4
- COSS set up with shadcn, with `components.json` at the monorepo root
- Node and npm to run the CLI. Bun is not required.

## Patterns

| Pattern | Contents |
| --- | --- |
| `collection-views` | List, Kanban, Data Grid and Calendar views, toolbar, pagination, selection |
| `properties` | Text, Date, Select, Person and other property displays, plus property groups |
| `detail-sheet` | Detail sheet with groups, rows and actions |
| `editable` | Inline editing compound |

Your app provides prepared data and handles events. Filtering, sorting, pagination, grouping, persistence, permissions and API calls stay in your app.

Filter Builder and responsive layouts are out of scope for the first version.

## Updating

There is no package to update. To compare your installed files with the current version, run:

```sh
npx tc96-parttens add collection-views --diff
```

Then apply the changes you want by hand.

## Repository

| Package | Role |
| --- | --- |
| `packages/parttens` | Pattern source |
| `packages/elements` | tc96 components that COSS does not have, such as `Text` |
| `packages/ui` | Unmodified COSS components, locked to an upstream snapshot and used for development and tests |
| `packages/utils` | Shared helpers (`cn`) |
| `packages/registry` | Registry build and the `tc96-parttens` CLI |
| `apps/storybook`, `apps/docs` | Stories and documentation |

The [architecture document](docs/architecture/tc96-parttens.md) records the boundaries and decisions. It is written in Portuguese.
