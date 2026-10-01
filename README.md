# tc96-parttens

React patterns without business rules, built on your project's own [COSS](https://coss.com/ui) components. You install the source, own it, and change it as you like.

```sh
npx tc96-parttens add collection-views properties
```

```tsx
import { CollectionViewOutlet, TextProperty } from '@acme/patterns'
```

> **Status:** the source-only model described here was decided on 2026-10-01, and the migration is in progress. The npm name of the CLI is not confirmed yet.

## How it works

tc96 is not a runtime dependency. It works like shadcn and COSS: the CLI copies the pattern source into your workspace.

- **Your COSS components:** patterns import `Button`, `Menu`, `Popover` and the rest from your project's UI alias. If a COSS component is missing, it is installed through shadcn. If you already have it, yours is reused, customizations included.
- **Your theme:** tc96 ships no CSS, tokens or theme. Patterns use COSS components without changes and only add layout classes.
- **Your aliases:** imports are rewritten to the aliases in your `components.json`. The patterns destination is `packages/patterns` by default and can be changed in `tc96.json`.
- **Your files:** existing files are kept. shadcn asks before overwriting anything.

## Requirements

- React 19, TypeScript and Tailwind CSS 4
- COSS set up with shadcn (`components.json` in the consumer workspace)
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
