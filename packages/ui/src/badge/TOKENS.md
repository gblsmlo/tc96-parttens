# Badge tokens

The blueprint of the badge and its single source of truth. `badgeVariants` (`badge.tsx`) is a `cva` with a base string, a `variant` and a `size`; every class it sets is here, once. The rows of a table, joined, hold exactly the classes of that string. `cn()` joins base, variant, size and the consumer's `className` in that order, so a later string wins a conflict. A change to how the badge looks starts here and is then copied into `badge.tsx`.

`Name` says what a row does:

| Name | Meaning |
| --- | --- |
| `layout` | display, alignment, gaps |
| `size` | height, minimum width, padding and type size with no condition |
| `size:coarse` | the hit area with a coarse pointer |
| `type` | weight |
| `shape` | radius and border |
| `color` | theme colors at rest |
| `dark` | colors in dark mode |
| `hover` | hover color, only when rendered as a `button` or an `a` |
| `interactive` | rules that apply only to a `button` or an `a` |
| `disabled` | the `disabled` attribute |
| `focus` | outline and ring |
| `icon` | an `svg` child |
| `motion` | transitions |

## Theme

Tokens read: `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--destructive`, `--destructive-foreground`, `--info`, `--info-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--input`, `--background`, `--foreground`, `--accent`, `--ring`, `--radius-sm`. The ui manifest ships the status pairs: `--info`, `--success`, `--warning` as `blue-500`, `emerald-500`, `amber-500`; their `-foreground` as the `700` shade in light and the `400` shade in dark; `--destructive-foreground` as `red-700` and `red-400`.

No rule in the consumer's stylesheet targets the badge.

## Parts

The variant COSS calls `default` is `primary` here, and the size COSS calls `lg` is `large` (decisions of 2026-11-20); `primary` and `default` are the defaults. A badge has two heights and no breakpoint variation: `default` is 20px and `large` 24px at every width, with their text and icon fixed as well; COSS changed height, text and icon at `sm`.

COSS ships a third size, `sm` (16px tall and 10px text from `sm`); this workspace removed it (decision of 2026-11-20), so a badge is at least 18px tall with 12px text.


One part: `Badge` (`badge`), a `span` through Base UI `useRender`, or the element passed in `render`. It carries `data-slot="badge"` and no other `data-*`.

### Base

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap` | icon and text on one line, never wrapped |
| `shape` | `rounded-sm border border-transparent` | the border keeps every variant the same size as `outline` |
| `type` | `font-medium` | |
| `focus` | `outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background` | ring when rendered as a focusable element |
| `motion` | `transition-shadow` | |
| `disabled` | `disabled:pointer-events-none disabled:opacity-64` | |
| `icon` | `[&_svg:not([class*='size-'])]:size-3 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg]:pointer-events-none [&_svg]:shrink-0` | 12px, at 80%; `large` raises it to 14px |
| `interactive` | `[button&,a&]:cursor-pointer` | |
| `size:coarse` | `[button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11` | a 44px hit area around a `button` or `a`, without changing its look |

### Size `default`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `h-5 min-w-5 px-1 text-xs` | 20px tall, 12px text, 4px between the label and the edge |

### Size `large`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `h-6 min-w-6 px-1.5 text-sm` | 24px tall, 14px text, 6px between the label and the edge |
| `icon` | `[&_svg:not([class*='size-'])]:size-3.5` | 14px icon, wins over the base 12px in `cn()` |

### Variant `primary`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-primary text-primary-foreground` | |
| `hover` | `[button&,a&]:hover:bg-primary/90` | |

### Variant `secondary`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-secondary text-secondary-foreground` | |
| `hover` | `[button&,a&]:hover:bg-secondary/90` | |

### Variant `outline`

| Name | Selectors | Description |
| --- | --- | --- |
| `shape` | `border-input` | |
| `color` | `bg-background text-foreground` | |
| `dark` | `dark:bg-input/32` | |
| `hover` | `[button&,a&]:hover:bg-accent/50 dark:[button&,a&]:hover:bg-input/48` | |

### Variant `destructive`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-destructive text-white` | |
| `hover` | `[button&,a&]:hover:bg-destructive/90` | |

### Variant `error`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-destructive/8 text-destructive-foreground` | tinted background, strong text |
| `dark` | `dark:bg-destructive/16` | |

### Variant `info`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-info/8 text-info-foreground` | |
| `dark` | `dark:bg-info/16` | |

### Variant `success`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-success/8 text-success-foreground` | |
| `dark` | `dark:bg-success/16` | |

### Variant `warning`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-warning/8 text-warning-foreground` | |
| `dark` | `dark:bg-warning/16` | |
