# Chats panel pattern

A controlled list of conversations for an inbox: `ChatsPanel` (a titled `section` with an `actions` slot and a scrolling body, in a `plain`, `card` or `inset` shell), `ChatsPanelList` (the `ul`), `ChatsPanelItem` (one conversation: avatar with unread count and channel mark, name, time and preview) and `ChatsPanelSkeleton` with `ChatsPanelItemSkeleton` (the loading list, in the shape of the rows). The consumer passes the conversations already sorted and filtered, the avatars, the brand marks as `@thesvg/icons` modules, the selection and every label, and mounts the `ViewSettingsMenu` that drives the sort and filters in `actions`. The pattern never sorts, filters, selects, fetches or ships CSS, and has no state.

## Map

| Folder | Holds |
| --- | --- |
| `composition/chats-panel/` | `ChatsPanel` on the COSS `Card` and `ScrollArea`, its test and barrel |
| `composition/chats-panel-list/` | `ChatsPanelList`, its barrel |
| `composition/chats-panel-item/` | `ChatsPanelItem` on Base UI `useRender` and the COSS `Badge`, its test and barrel |
| `composition/chats-panel-skeleton/` | `ChatsPanelSkeleton` and `ChatsPanelItemSkeleton` on the COSS `Skeleton`, their test and barrel |
| `lib/` | `variants.ts`: the root, shell, header and body classes, the row box shared by the item and the skeleton, the preview `cva` and the skeleton width sizes |
| `store/` | `chats-panel-context.ts`: the title id that names the list |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: the prop types and `chatsPanelSkeletonWidths`; `channel` is typed from the `IconModule` of `@thesvg/icons` |

Import direction: `composition/` → `lib/`, `store/`, `core.ts`; `ChatsPanelList` reads the context that `ChatsPanel` provides. `ChatsPanelItem` imports `@base-ui/react/use-render` and `merge-props` directly, as `RecordGroupLink` does. `core.ts` imports the `IconModule` type from `@thesvg/icons`, the pattern's only reference to it; nothing imports an icon. No import into another pattern or into `packages/parttens/src/shared`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `chat/chats-panel/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `chat/chats-panel` for the registry item `chats-panel`; `packages/registry/src/manifest.test.ts` asserts the built item ships only files under `parttens/src/chat/` and depends on `@coss/badge`, `@coss/card`, `@coss/scroll-area` and `@coss/skeleton`. Renaming the folder breaks the registry and the pattern test run.
- `@thesvg/icons` is a `peerDependency` of `packages/parttens/package.json` (3.4.1, exact, like the other peers), a root `devDependency` for the workspace and a dependency of `apps/storybook`, which plays the consumer. The registry build reads the type import, so the `chats-panel` item lists `@thesvg/icons@3.4.1` in `dependencies` and the CLI installs it when the consumer lacks it; `manifest.test.ts` asserts it.
- The `--avatar-size` the root sets is read by the COSS `Avatar` (`packages/ui/src/avatar.tsx`, synced on 2026-10-19), not by `@tc96/elements/avatar`, which keeps a fixed size per variant (issue #212). It is a string in a class, so renaming it breaks the avatar size without a type error.

## Invariants

Root and list:

- The root is a `section` with `aria-labelledby` pointing at the `h2` title, so the region is named by the title. `ChatsPanelList` takes the same id from the context and is named by the title too; outside a `ChatsPanel` it has no name unless the consumer passes `aria-label`, and a consumer `aria-labelledby` wins over the context.
- `actions` renders only when passed, after the title and never inside the `h2`. A `ViewSettingsMenu` there needs a `CollectionToolbar` around it, because its trigger is a Base UI `ToolbarButton`.
- The body is always a `ScrollArea`; the root takes its height from the consumer (`className`), and the body takes what the header leaves.

Items:

- An item is a `li` with the interactive element inside, so a list stays valid whatever `render` returns. The element is a `button` with `type="button"` by default; with `render` (a router link) the pattern sets no `type`.
- The avatar slot (avatar, unread `Badge`, channel mark) is `aria-hidden`. The count and the channel reach screen readers as one `sr-only` text after the name, the channel (`channelLabel`, or the icon `title` when it is not passed) and `unreadLabel` joined by `, `, so the name reads first: `Marina Costa Messenger, 2 não lidas 00:29 Consegue…`.
- `channel` takes an `@thesvg/icons` module (only `svg` and `title` are read) and draws `svg` as an `img` with `alt=""` and a `data:image/svg+xml` URI. An `img` needs no `dangerouslySetInnerHTML`, and it keeps the gradient ids of the Messenger and Instagram marks (`id="a"`) from colliding across rows, which inline SVG would not. A consumer CSP without `data:` in `img-src` blocks the mark.
- `unreadCount` above zero shows the badge, sets `data-unread` on the `li`, inks the preview in `foreground` and lets `unreadLabel` be spoken; at zero the label is dropped even when passed. The count is shown as given, with no `99+` cap.
- `selected` sets `aria-current="true"`; a consumer `aria-current` (`page` on a router link) wins.
- No default copy: `label` and `unreadLabel` are props, and the consumer pluralizes the unread label. The channel name defaults to the brand `title` of the icon, a proper name, not copy.

Loading:

- `ChatsPanelSkeleton` is an `output` (implicit `status`) with `aria-busy` and the `label` as its name; the rows are `aria-hidden`. `count` defaults to 6 and a negative count renders no rows.
- `ChatsPanelItemSkeleton` uses `chatsPanelRowClassName`, the same box as the item: the avatar placeholder is `size-(--avatar-size)` and the two text lines are `h-5`, as the `text-sm` lines of the item, so swapping the skeleton for the list does not move the rows. The rows cycle the four width pairs of `chatsPanelSkeletonRows`, so the bars differ from row to row.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="chats-panel"`, `data-variant="plain\|card\|inset"` | the `section`, always |
| `data-slot="card"` | the COSS `Card`: in `card` the only child of the `section`, wrapping header and body; in `inset` the wrapper of the body only; none in `plain` |
| `data-slot="chats-panel-header"`, `chats-panel-actions`, `chats-panel-body` | the header, the actions wrapper and the `ScrollArea` root |
| `data-slot="chats-panel-list"` | the `ul` |
| `data-slot="chats-panel-item"`, `data-unread="true"` | the `li`; `data-unread` only with unread messages |
| `data-slot="chats-panel-item-trigger"`, `chats-panel-item-avatar`, `chats-panel-item-channel`, `chats-panel-item-name`, `chats-panel-item-time`, `chats-panel-item-preview` | the interactive element and its parts |
| `data-slot="chats-panel-skeleton"`, `chats-panel-item-skeleton`, `data-width` | the `output`, each row and each width-sized bar |

- The shell copies the `RecordGroup` one: `Card` with `bg-muted/72 shadow-none before:hidden` (`chatsPanelShellClassName`), plus `min-h-0 flex-1 overflow-hidden` so the body scrolls inside it. The border and radius stay the `Card`'s. `scripts/override-exceptions.json` has one entry here, `Card` with `bg-muted/72` in `chats-panel.tsx`, counted once per `Card` use.
- The header is `ps-4 pe-2` in every variant, so the title lines up with the avatars (list gutter `px-2` plus row `px-2`). The body is `px-2 pb-2` in `plain` and `card` and `p-2` in `inset`, where the body starts at the top edge of the panel.
- The selected and hovered row is `bg-accent`. On it, the time and the read preview switch from `muted-foreground` to `accent-foreground/72` (`chatsPanelMutedTextClassName`, through `group/chats-panel-item`), because `muted-foreground` on the accent over the muted panel measured 4.46:1 in dark. The ratios are in `docs/architecture/tc96-parttens.md`.
- The unread `Badge` (`-end-1 -top-1`) and the channel mark (`-end-1 -bottom-1`, a `size-4` round `img` with `object-contain` on `bg-background`) carry `outline-2 outline-background`, which reads as a cut-out on the page; on the muted panel the ring is about 3% lighter than the surface.
- Width sizes are a `cva` axis (`chatsPanelSkeletonWidthVariants`): `xs` `w-8`, `sm` `w-16`, `md` `w-24`, `lg` `w-32`, `xl` `w-44`. The time bar is always `xs`.

## Verify

```bash
bun test --isolate packages/parttens/src/chat/chats-panel
bunx biome check packages/parttens/src/chat
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/chat/chats-panel
```

The stories are in `apps/storybook/src/patterns/chat/chats-panel/`. `chats-panel.stories.tsx` (`Patterns/Chat/Chats Panel`) is the root with the `Doc` page and its `usage` and `api` docs parameters: `Plain`, `Card`, `Inset`, `Loading` and `Empty`, each with a `!dev` `<Story>Interaction` twin, passing the rows as JSX in `args.children`; the controls come from `chatsPanelArgTypes` in `apps/storybook/src/test-utils/story-arg-types.ts`. `usages/inbox.stories.tsx` (`Patterns/Chat/Chats Panel/Usages/Inbox`) owns the sort, filters and selection as a consumer would, with the `ViewSettingsMenu` in `actions`, and covers selection, sorting, filtering, no results, empty and loading. Both read `fixtures/chats.tsx` (conversations, the `instagram`, `messenger` and `whatsapp` modules of `@thesvg/icons` and the avatar). Both theme projects run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `chats-panel` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (`chat/chats-panel/`), and the Avatar note of 2026-10-19.
