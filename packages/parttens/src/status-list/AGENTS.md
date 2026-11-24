# Record status list pattern

A controlled list of background work on a record surface: `RecordStatusList` (a named `ul` with one polite live region) and `RecordStatusItem` (a status icon, a title, a detail and an optional action). It lists the sources a create dialog queries, the rows of a batch import and the pending steps on a new record page. The consumer passes the status, every text and the actions; the pattern never times, retries, polls or ships CSS; its only state is the last announcement and, per item, the last status it saw.

## Map

| Folder | Holds |
| --- | --- |
| `composition/record-status-list/` | `RecordStatusList`: the `ul`, the announcer and the context provider |
| `composition/record-status-item/` | `RecordStatusItem`: the `li`, the icon and the status-change effect |
| `store/` | `status-list-context.ts`: the `announce` function items read; reading it outside a list throws |
| `lib/` | `variants.ts`: the list and lead classes, the item and icon `cva` by status, and the detail `Text` foreground by status |
| `core.ts` | React-free surface: `recordStatuses` and the prop types |

Import direction: `composition/` → `store/`, `lib/`, `core.ts`. No import into another pattern; the ui imports are the COSS `@tc96/ui/spinner` and the own `@tc96/ui/text`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `status-list/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `status-list` for the registry item `record-status-list`.

## Invariants

- One announcer per list, a `p` with `aria-live="polite"` after the `ul`, rendered from the start so the first change is read. An item calls `announce(announcement)` when its `status` differs from the one it last rendered; the first render and any change of `detail` or `title` are silent, so a ticking elapsed time in `detail` never reaches the screen reader. An item without `announcement` changes silently.
- The status icon is decorative: a `span` with `aria-hidden` holds the lucide icon or, for `running`, the COSS `Spinner`. The span carries the color by status, because a color class on the `Spinner` itself is a COSS override (`overrides:check`). The meaning of a status is the consumer's `detail`.
- `action` renders at the end of the row, after the title and detail; the pattern does not hide it per status, so the consumer passes it only when it applies.
- Every row is at least 40px (`min-h-10` with `py-1`), the height of a row holding a `sm` button, so rows with and without an action share one rhythm. The icon sits on the first line of the text (a 20px box, the `sm` line height), so a detail that wraps keeps the icon next to the title.

## Styling

- `failed` tints the row with `bg-destructive/8` (`/16` in dark, the pairs measured in `docs/accessibility.md`) and the icon and detail with `destructive-foreground`; `done` colors the icon with `success-foreground`; the other statuses stay muted. The list has a border and dividers on `border`, and rounded `lg` corners, the frame of a sources list inside a dialog body.
- Title and detail are `Text` (`size="sm"`; the title `weight="medium"`, the detail `foreground` `muted` or `destructive`), never loose type classes.
- `data-slot`: `record-status-list`, `record-status-item`, `record-status-item-icon`, `record-status-item-title`, `record-status-item-detail`, `record-status-item-action`, `record-status-list-announcer`. `data-status` on the item carries the status.
- No override exceptions.

## Verify

```bash
bun run typecheck && bun run storybook:typecheck
bun run check:coss && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/status-list
```

The stories are in `apps/storybook/src/patterns/status-list/`, on `Patterns/StatusList`: API Reference, Playground, Behavior (the announcement rule, the named list with hidden icons, each status on its row, the action) and Usages (`NextSteps`, `ImportProgress`). The pattern has no bun tests.

## Pointers

- `Blocks/Records/LookupCreate1/Usages, Lawsuits`: the sources of a create dialog.
- `docs/accessibility.md`: the contrast rules for the `failed` row.
