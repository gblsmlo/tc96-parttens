# Alert tokens

The blueprint of the alert and its single source of truth. Every class `alert.tsx` sets is here, once, on the part that carries it. `alertVariants` is a `cva` with a base string and a `variant`; `AlertTitle`, `AlertDescription` and `AlertAction` pass one string each to `cn()`. The rows of a table, joined, hold exactly the classes of that string (the order inside a string does not change the result). `cn()` joins the `cva` output and the consumer's `className` in that order, so the consumer's class wins a conflict. A change to how the alert looks starts here and is then copied into `alert.tsx`.

`Name` says what a row does:

| Name | Meaning |
| --- | --- |
| `layout` | display, grid placement, alignment, gaps |
| `layout:max-sm` | the same, below the `sm` breakpoint |
| `layout:sm` | the same, from the `sm` breakpoint |
| `columns` | the grid columns, chosen by which children are present |
| `size` | width, padding and type size with no condition |
| `type` | weight |
| `shape` | radius and border |
| `color` | theme colors at rest |
| `dark` | colors in dark mode |
| `icon` | the leading `svg` child |

## Theme

Tokens read: `--card-foreground`, `--muted-foreground`, `--border` (through the base `border-border` rule of the consumer's stylesheet), `--input`, `--destructive`, `--info`, `--success`, `--warning`, `--radius-xl`. The ui manifest ships `--info`, `--success`, `--warning` as `blue-500`, `emerald-500`, `amber-500`, with their `-foreground` pairs as the `700` shade in light and the `400` shade in dark.

Rules in the consumer's stylesheet (`apps/example/packages/ui/src/styles.css`), outside `alert.tsx`:

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `[data-slot="alert"] { --success: var(--success-foreground); --warning: var(--warning-foreground) }` | the `success` and `warning` icons and tints read the darker shade; the same rule covers `[data-slot="toast-icon"]` |

Why the rule exists, with its contrast: `ACCESSIBILITY.md`.

## Parts

The variants keep the COSS names. Every variant keeps the plain `border` (`--border`), as the `Card` does: the COSS tinted border (`border-<status>/32`) is removed (decision of 2026-11-02), so the status shows only in the icon and the tinted background.

### Alert (`alert`)

A `div` with `role="alert"`. It is a grid: an `svg` as a direct child opens a 16px first column, an `AlertAction` opens a last column, and the title and description take the column between them.

#### Base

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `relative grid items-start gap-x-2 gap-y-0.5` | 8px between columns, 2px between the title and the description |
| `columns` | `has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-[>svg]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] has-[>svg]:gap-x-2` | icon, text and action columns; `has-[>svg]:gap-x-2` repeats the base gap, as COSS ships it |
| `size` | `w-full px-3.5 py-3 text-sm` | 14px inline, 12px block, 14px text |
| `shape` | `rounded-xl border` | `--radius-xl`, 1px `--border` |
| `color` | `text-card-foreground` | the title color; the description sets its own |
| `icon` | `[&>svg]:h-lh [&>svg]:w-4` | 16px wide and one line tall, so it sits on the title's first line |

#### Variant `default`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-transparent` | |
| `dark` | `dark:bg-input/32` | |
| `icon` | `[&>svg]:text-muted-foreground` | |

#### Variant `error`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-destructive/4` | |
| `icon` | `[&>svg]:text-destructive` | |

#### Variant `info`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-info/4` | |
| `icon` | `[&>svg]:text-info` | |

#### Variant `success`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-success/4` | `--success` is `--success-foreground` inside the alert (theme rule) |
| `icon` | `[&>svg]:text-success` | |

#### Variant `warning`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-warning/4` | `--warning` is `--warning-foreground` inside the alert (theme rule) |
| `icon` | `[&>svg]:text-warning` | |

### AlertTitle (`alert-title`)

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `[svg~&]:col-start-2` | after an icon, the text column |
| `type` | `font-medium` | |

### AlertDescription (`alert-description`)

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `flex flex-col gap-2.5 [svg~&]:col-start-2` | stacks paragraphs 10px apart; after an icon, the text column |
| `color` | `text-muted-foreground` | |

### AlertAction (`alert-action`)

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `flex gap-1` | buttons 4px apart |
| `layout:max-sm` | `max-sm:col-start-2 max-sm:mt-2` | below 640px, a row under the text, 8px down |
| `layout:sm` | `sm:row-start-1 sm:row-end-3 sm:self-center sm:[[data-slot=alert-title]~&]:col-start-2 sm:[[data-slot=alert-description]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-slot=alert-title]~&]:col-start-3 sm:[svg~[data-slot=alert-description]~&]:col-start-3` | from 640px, the last column, centered across the title and description rows |
