# Menu tokens

The blueprint of the menu and its single source of truth. Every class `menu.tsx` sets is here, once, on the element that carries it; the rows of an element's table, joined, hold exactly the classes of the string passed to `cn()` (the order inside a string does not change the result). Where `cn()` takes two strings, as the item and variant tables of `MenuCheckboxItem`, the later one wins a conflict (`gap-4` over `gap-2`). A change to how the menu looks starts here and is then copied into `menu.tsx`.

`Name` says what a row does:

| Name | Meaning |
| --- | --- |
| `layout` | display, alignment, gaps, cursor |
| `size` | dimensions, padding and type size with no condition |
| `size:sm` | the same, from the `sm` breakpoint |
| `size:coarse` | the same, with a coarse pointer |
| `type` | weight, family, tracking |
| `shape` | radius, border, shadow |
| `color` | theme colors at rest |
| `inset` | the `inset` prop (`data-inset`) |
| `highlighted`, `open`, `checked`, `unchecked`, `pressed`, `disabled` | a Base UI state attribute |
| `destructive` | `variant="destructive"` (`data-variant`) |
| `focus` | outline and ring |
| `icon` | an `svg` child |
| `anchor` | sizing against the trigger (`--anchor-width`) |
| `motion` | transform origin and transitions |
| `rtl` | right-to-left overrides |
| `highlight` | the 1px inner light of the popup |

## Theme

Tokens read: `--popover`, `--border`, `--foreground`, `--accent`, `--accent-foreground`, `--destructive-foreground`, `--muted-foreground`, `--primary`, `--input`, `--background`, `--ring`, `--radius-lg`. The ui manifest ships `--destructive-foreground` as `red-700` (light) and `red-400` (dark).

Rules in the consumer's stylesheet (`apps/example/packages/ui/src/styles.css`), outside `menu.tsx`:

| Name | Selectors | Description |
| --- | --- | --- |
| `focus` | `[role^="menuitem"][data-slot^="menu-"]:focus-visible { outline: 2px solid var(--ring); outline-offset: -2px }` | keyboard focus on every item |
| `color` | `[data-slot="menu-shortcut"] { color: var(--muted-foreground) }` | drops the `/72` of `MenuShortcut` |

Why each rule exists, with its contrast: `ACCESSIBILITY.md`.

## Parts

`Menu`, `MenuPortal`, `MenuCreateHandle`, `MenuGroup` (`menu-group`), `MenuRadioGroup` (`menu-radio-group`), `MenuSub` (`menu-sub`) and `MenuTrigger` (`menu-trigger`) set no class; `MenuTrigger` takes its look from what it renders.

### MenuPopup

`Menu.Portal` › `Menu.Positioner` › `Menu.Popup` › list `div`. Positioner defaults: `side="bottom"`, `align="center"`, `sideOffset={4}`.

#### Positioner (`menu-positioner`)

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `z-50` | stacking |

#### Popup (`menu-popup`)

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `relative flex` | |
| `size` | `min-w-40` | at least 160px, also when a `w-*` class is passed |
| `motion` | `origin-(--transform-origin)` | opens from the trigger |
| `shape` | `rounded-lg border shadow-lg/5` | `--radius-lg`, 1px `--border` |
| `color` | `bg-popover not-dark:bg-clip-padding` | |
| `focus` | `outline-none focus:outline-none` | the popup itself shows no outline |
| `highlight` | `before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]` | fixed alpha, not a token |

#### List

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `w-full overflow-y-auto` | scrolls when taller than the space |
| `size` | `max-h-(--available-height) p-2` | 8px around the items |

### MenuSubPopup (`menu-sub-content`)

A `MenuPopup` with `side="inline-end"`, `align="start"`, `sideOffset={0}` and `alignOffset={-5}` when `align` is not `center`. No class of its own.

### MenuItem (`menu-item`)

`Menu.Item`, with `data-inset` and `data-variant` (`default`, `destructive`).

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `flex items-center gap-2 cursor-default select-none` | icon, label, shortcut in a row |
| `size` | `min-h-8 px-2 py-1 text-base` | 32px, 16px text |
| `size:sm` | `sm:min-h-7 sm:text-sm` | 28px, 14px text |
| `size:coarse` | `pointer-coarse:min-h-11` | 44px |
| `inset` | `data-inset:ps-7.5 sm:data-inset:ps-7` | label start after an icon |
| `shape` | `rounded-sm` | |
| `color` | `text-foreground` | |
| `highlighted` | `data-highlighted:bg-accent data-highlighted:text-accent-foreground` | |
| `destructive` | `data-[variant=destructive]:text-destructive-foreground` | |
| `disabled` | `data-disabled:pointer-events-none data-disabled:opacity-64` | |
| `focus` | `outline-none` | keyboard focus comes from the theme rule |
| `icon` | `[&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0` | 18px, 16px from `sm`, at 80% |

### MenuLinkItem (`menu-link-item`)

`Menu.LinkItem`, `closeOnClick` defaults to `true`. Same table as `MenuItem`, row for row.

### MenuCheckboxItem (`menu-checkbox-item`)

`Menu.CheckboxItem`. The item string is the item table plus one variant table.

#### Item

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `grid items-center gap-2 cursor-default` | |
| `size` | `min-h-8 py-1 ps-2 text-base` | |
| `size:sm` | `sm:min-h-7 sm:text-sm` | |
| `size:coarse` | `pointer-coarse:min-h-11` | |
| `anchor` | `in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]` | as wide as the trigger when the popup covers it |
| `shape` | `rounded-sm` | |
| `color` | `text-foreground` | |
| `highlighted` | `data-highlighted:bg-accent data-highlighted:text-accent-foreground` | |
| `disabled` | `data-disabled:pointer-events-none data-disabled:opacity-64` | |
| `focus` | `outline-none` | |
| `icon` | `[&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0` | any nested `svg` |

#### Variant `default`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `grid-cols-[minmax(0,1fr)_.75rem] gap-4` | label, then a 12px check column |
| `size` | `pe-2.5` | |

#### Variant `switch`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `grid-cols-[1fr_auto] gap-4` | label, then the switch |
| `size` | `pe-1.5` | |

#### Label, `default`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `col-start-1 row-start-1 flex min-w-0 items-center gap-2` | an icon may precede the text |

#### Check, `default`

`Menu.CheckboxItemIndicator` holding a 24×24 `svg` (`stroke="currentColor"`, `strokeWidth="2"`, `aria-hidden`).

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `col-start-2 row-start-1 -me-0.5` | trailing column |

#### Label, `switch`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `col-start-1` | |

#### Track, `switch`

`Menu.CheckboxItemIndicator` with `keepMounted`.

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `inline-flex shrink-0 items-center p-px` | |
| `size` | `h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] [--thumb-size:--spacing(4)]` | 16px thumb |
| `size:sm` | `sm:[--thumb-size:--spacing(3)]` | 12px thumb |
| `shape` | `rounded-full inset-shadow-[0_1px_--theme(--color-black/4%)]` | |
| `checked` | `data-checked:bg-primary` | |
| `unchecked` | `data-unchecked:bg-input` | |
| `disabled` | `data-disabled:opacity-64` | |
| `focus` | `outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background` | |
| `motion` | `transition-[background-color,box-shadow] duration-200` | |

#### Thumb, `switch`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `pointer-events-none block aspect-square h-full` | |
| `shape` | `rounded-(--thumb-size) shadow-sm/5` | |
| `color` | `bg-background` | |
| `checked` | `in-[[data-slot=menu-checkbox-item][data-checked]]:origin-[var(--thumb-size)_50%] in-[[data-slot=menu-checkbox-item][data-checked]]:translate-x-[calc(var(--thumb-size)-4px)]` | slides to the end |
| `pressed` | `in-[[data-slot=menu-checkbox-item]:active]:not-data-disabled:scale-x-110 in-[[data-slot=menu-checkbox-item]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.10)]` | stretches while pressed |
| `motion` | `origin-left will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s]` | |
| `rtl` | `rtl:origin-right rtl:in-[[data-slot=menu-checkbox-item][data-checked]]:origin-left rtl:in-[[data-slot=menu-checkbox-item][data-checked]]:-translate-x-[calc(var(--thumb-size)-4px)]` | |

### MenuRadioItem (`menu-radio-item`)

`Menu.RadioItem`.

#### Item

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `grid grid-cols-[minmax(0,1fr)_.75rem] items-center gap-4 cursor-default` | label, then a 12px check column |
| `size` | `min-h-8 py-1 ps-2 pe-2.5 text-base` | |
| `size:sm` | `sm:min-h-7 sm:text-sm` | |
| `size:coarse` | `pointer-coarse:min-h-11` | |
| `anchor` | `in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]` | |
| `shape` | `rounded-sm` | |
| `color` | `text-foreground` | |
| `highlighted` | `data-highlighted:bg-accent data-highlighted:text-accent-foreground` | |
| `disabled` | `data-disabled:pointer-events-none data-disabled:opacity-64` | |
| `focus` | `outline-none` | |
| `icon` | `[&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0` | |

#### Label

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `col-start-1 row-start-1 flex min-w-0 items-center gap-2` | |

#### Check

`Menu.RadioItemIndicator` holding the same `svg` as `MenuCheckboxItem`.

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `col-start-2 row-start-1 -me-0.5` | |

### MenuGroupLabel (`menu-label`)

`Menu.GroupLabel`, with `data-inset`.

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `px-2 py-1.5 text-xs` | |
| `type` | `font-medium` | |
| `color` | `text-muted-foreground` | |
| `inset` | `data-inset:ps-7.5 sm:data-inset:ps-7` | |

### MenuSeparator (`menu-separator`)

`Menu.Separator`.

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `mx-2 my-1 h-px` | |
| `color` | `bg-border` | |

### MenuShortcut (`menu-shortcut`)

A `kbd` with `aria-hidden="true"`.

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `ms-auto` | pushed to the end of the item |
| `type` | `font-medium font-sans text-xs tracking-widest` | |
| `color` | `text-muted-foreground/72` | the theme rule resets it to the full token |

### MenuSubTrigger (`menu-sub-trigger`)

`Menu.SubmenuTrigger`, with `data-inset`, followed by a chevron.

#### Trigger

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `flex items-center gap-2` | |
| `size` | `min-h-8 px-2 py-1 text-base` | |
| `size:sm` | `sm:min-h-7 sm:text-sm` | |
| `size:coarse` | `pointer-coarse:min-h-11` | |
| `inset` | `data-inset:ps-7.5 sm:data-inset:ps-7` | |
| `shape` | `rounded-sm` | |
| `color` | `text-foreground` | |
| `highlighted` | `data-highlighted:bg-accent data-highlighted:text-accent-foreground` | |
| `open` | `data-popup-open:bg-accent data-popup-open:text-accent-foreground` | stays lit while the submenu is open |
| `disabled` | `data-disabled:pointer-events-none data-disabled:opacity-64` | |
| `focus` | `outline-none` | |
| `icon` | `[&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&>svg:not(:last-child)]:-mx-0.5` | |

#### Chevron

`ChevronRightIcon` from `lucide-react`.

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `ms-auto -me-0.5` | |
| `color` | `opacity-80` | |

## Base UI variables

| Name | Selectors | Description |
| --- | --- | --- |
| `--available-height` | List | max height before scrolling |
| `--transform-origin` | Popup | open and close origin |
| `--anchor-width` | `MenuCheckboxItem`, `MenuRadioItem` | width of the trigger |
