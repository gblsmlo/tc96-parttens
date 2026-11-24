# IconFrame tokens

The blueprint of the icon frame and its single source of truth. `iconFrameVariants` (`icon-frame.tsx`) is a `cva` with a base string, a `shape`, a `size` and a `variant`; every class it sets is here, once. The rows of a table, joined, hold exactly the classes of that string. `cn()` joins base, shape, size, variant and the consumer's `className` in that order, so a later string wins a conflict. A change to how the frame looks starts here and is then copied into `icon-frame.tsx`.

`Name` says what a row does:

| Name | Meaning |
| --- | --- |
| `layout` | display, alignment, shrinking |
| `size` | width and height |
| `shape` | radius |
| `color` | theme colors at rest |
| `icon` | an `svg` child |

## Theme

Tokens read: `--muted`, `--foreground`. The `color` prop is not a token: `iconFrameStyle` turns it into inline `color` and, in the `color` variant, a `background-color` of `color-mix(in srgb, <color> 6%, transparent)`, which win over the variant classes.

No rule in the consumer's stylesheet targets the icon frame.

## Parts

One part: `IconFrame` (`icon-frame`), a `span` through Base UI `useRender`, or the element passed in `render`. It carries `data-slot="icon-frame"`, `data-shape`, `data-size` and `data-variant`, and `aria-hidden="true"` unless a prop overrides it.

### Base

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `inline-flex shrink-0 items-center justify-center` | the icon centered in a box that never shrinks |
| `icon` | `[&_svg]:shrink-0` | |

### Shape `circle`

| Name | Selectors | Description |
| --- | --- | --- |
| `shape` | `rounded-full` | the default |

### Shape `rounded`

| Name | Selectors | Description |
| --- | --- | --- |
| `shape` | `rounded-lg` | the consumer's `--radius-lg` |

### Size `xs`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-6` | 24px |
| `icon` | `[&_svg:not([class*=size-])]:size-4` | 16px; a `size-*` class on the icon wins |

### Size `sm`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-8` | 32px |
| `icon` | `[&_svg:not([class*=size-])]:size-4` | 16px |

### Size `default`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-9` | 36px |
| `icon` | `[&_svg:not([class*=size-])]:size-4.5` | 18px |

### Size `lg`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-11` | 44px |
| `icon` | `[&_svg:not([class*=size-])]:size-5` | 20px |

### Size `xl`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-14` | 56px |
| `icon` | `[&_svg:not([class*=size-])]:size-6` | 24px |

### Variant `color`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-muted text-foreground` | the default; `color` replaces both with the tint and the color |

### Variant `plain`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-transparent text-foreground` | no background; `color` paints only the icon |
