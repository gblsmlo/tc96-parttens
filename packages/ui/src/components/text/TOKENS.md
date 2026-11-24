# Text tokens

The blueprint of the text element and its single source of truth. `textVariants` (`text.tsx`) is a `cva` with an empty base and eight variants, `align`, `family`, `foreground`, `leading`, `size`, `tracking`, `truncate` and `weight`; every class it sets is here, once, one block per value. The rows of a block, joined, hold exactly the classes of that value's string. `cn()` joins the variants and the consumer's `className` in that order, so a class in `className` wins a conflict. A change to how the text looks starts here and is then copied into `text.tsx`.

`Name` says what a row does:

| Name | Meaning |
| --- | --- |
| `layout` | alignment and overflow |
| `size` | font size and its line height from the theme scale |
| `type` | family, weight, line height and letter spacing |
| `color` | theme colors |

## Theme

Tokens read: `--foreground`, `--muted-foreground`, `--destructive-foreground`, the `--font-sans`, `--font-heading` and `--font-mono` families, and the Tailwind `--text-*`, `--leading-*`, `--tracking-*` and `--font-weight-*` scales. `--font-heading` is the consumer's; a theme without it falls back to the inherited family.

No rule in the consumer's stylesheet targets the text element.

## Parts

One part: `Text` (`text`), a `span` through Base UI `useRender`, or the element passed in `render` (a heading, a `p`, a `label`). It carries `data-slot="text"` and no other `data-*`. With no prop it is `text-base`, `text-foreground`, `font-sans` and `font-normal`; `align`, `leading`, `tracking` and `truncate` have no default and set nothing until passed.

### Align `center`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `text-center` |  |

### Align `end`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `text-end` |  |

### Align `justify`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `text-justify` |  |

### Align `left`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `text-left` |  |

### Align `right`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `text-right` |  |

### Align `start`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `text-start` |  |

### Family `heading`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-heading` |  |

### Family `mono`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-mono` |  |

### Family `sans` (default)

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-sans` |  |

### Foreground `base` (default)

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `text-foreground` |  |

### Foreground `destructive`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `text-destructive-foreground` | the status pair the ui manifest ships with `alert` and `badge` |

### Foreground `inherit`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `text-inherit` | the color of the parent, for text inside a colored part |

### Foreground `muted`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `text-muted-foreground` |  |

### Leading `loose`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `leading-loose` |  |

### Leading `none`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `leading-none` |  |

### Leading `normal`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `leading-normal` |  |

### Leading `relaxed`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `leading-relaxed` |  |

### Leading `snug`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `leading-snug` |  |

### Leading `tight`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `leading-tight` |  |

### Size `xs`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-xs` |  |

### Size `sm`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-sm` |  |

### Size `base` (default)

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-base` |  |

### Size `lg`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-lg` |  |

### Size `xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-xl` |  |

### Size `2xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-2xl` |  |

### Size `3xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-3xl` |  |

### Size `4xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-4xl` |  |

### Size `5xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-5xl` |  |

### Size `6xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-6xl` |  |

### Size `7xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-7xl` |  |

### Size `8xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `text-8xl` |  |

### Tracking `normal`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `tracking-normal` |  |

### Tracking `tight`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `tracking-tight` |  |

### Tracking `tighter`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `tracking-tighter` |  |

### Tracking `wide`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `tracking-wide` |  |

### Tracking `wider`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `tracking-wider` |  |

### Tracking `widest`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `tracking-widest` |  |

### Truncate `true`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `truncate` | one line, cut with an ellipsis; needs a width from the parent |

### Weight `thin`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-thin` |  |

### Weight `extralight`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-extralight` |  |

### Weight `light`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-light` |  |

### Weight `normal` (default)

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-normal` |  |

### Weight `medium`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-medium` |  |

### Weight `semibold`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-semibold` |  |

### Weight `bold`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-bold` |  |

### Weight `extrabold`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-extrabold` |  |

### Weight `black`

| Name | Selectors | Description |
| --- | --- | --- |
| `type` | `font-black` |  |
