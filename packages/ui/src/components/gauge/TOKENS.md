# Gauge tokens

The blueprint of the gauge and its single source of truth. `gauge.tsx` builds every class from the strings below: `gaugeVariants` (the root per variant), the track, the ring size, the fill and the stroke per tone, and a few fixed strings. The rows of a table, joined, hold exactly the classes of one string. `cn()` joins them in source order, then the consumer's `className`, so a later string wins a conflict. A change to how the gauge looks starts here and is then copied into `gauge.tsx`.

`Name` says what a row does:

| Name | Meaning |
| --- | --- |
| `layout` | display, flow, shrinking, position |
| `size` | width, height or thickness |
| `shape` | radius |
| `color` | theme colors at rest |
| `motion` | transitions and their reduced-motion fallback |

## Theme

Tokens read: `--muted`, `--input`, and per tone `--primary`, `--foreground`, `--success`, `--warning`, `--destructive`, `--info`. `GaugeStack` reads `--chart-1` to `--chart-5` for a part without `color`; `color` is applied inline and wins.

No rule in the consumer's stylesheet targets the gauge.

## Parts

`Gauge` (`gauge`) is the Base UI `Meter` root, a `div` with `role="meter"`, carrying `data-variant`, `data-size`, `data-tone` and `data-empty` when empty. `bar` and `segmented` render a track (`gauge-track`); `bar` fills it with one indicator (`gauge-indicator`), `segmented` with `segments` spans (`gauge-segment`, `data-filled="true"` or `"false"`). `ring` renders an SVG track circle and an indicator circle (`gauge-indicator`), and centers its `children` above them. `GaugeRing` (`gauge-ring`) is an `aria-hidden` `div` with the ring root classes and the same drawing, without a meter. `GaugeStack` (`gauge-stack`) is a `ul` of parts (`gauge-stack-part`), each an `li` whose width follows its share and whose text is `sr-only`.

### Root `bar`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `block` | |
| `size` | `w-full` | the width of its container |

### Root `segmented`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `block` | |
| `size` | `w-full` | |

### Root `ring`

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `relative inline-flex shrink-0` | the anchor of the centered children |

### Ring size `sm`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-10` | 40px |

### Ring size `default`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-14` | 56px |

### Ring size `lg`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `size-20` | 80px; a `size-*` class from the consumer wins |

### Track

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `block overflow-hidden` | clips the indicator |
| `size` | `w-full` | |
| `shape` | `rounded-full` | |

### Track size `sm`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `h-1` | 4px |

### Track size `default`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `h-2` | 8px |

### Track size `lg`

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `h-3` | 12px |

### Track rest

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-muted` | the empty part of a bar and an unfilled segment |

### Segmented track

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `flex gap-0.5` | segments side by side with a 2px gap |
| `shape` | `rounded-none` | each segment is rounded instead |

### Segment

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `flex-1` | equal segments |
| `shape` | `rounded-full` | |

### Bar indicator

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `block` | |
| `size` | `h-full` | |
| `shape` | `rounded-full` | |
| `motion` | `transition-[width] duration-500 motion-reduce:transition-none` | |

### Ring track

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-muted` | |

### Ring track empty

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-input` | dashed `6 10`, so no value reads apart from zero |

### Ring indicator

| Name | Selectors | Description |
| --- | --- | --- |
| `motion` | `transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none` | |

### Ring svg

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `-rotate-90` | starts the arc at the top |
| `size` | `size-full` | |

### Ring children

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `absolute inset-0 flex flex-col items-center justify-center` | centered over the ring |

### Fill `primary`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-primary` | the default |

### Fill `foreground`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-foreground` | |

### Fill `success`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-success` | |

### Fill `warning`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-warning` | |

### Fill `destructive`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-destructive` | |

### Fill `info`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `bg-info` | |

### Stroke `primary`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-primary` | the default |

### Stroke `foreground`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-foreground` | |

### Stroke `success`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-success` | |

### Stroke `warning`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-warning` | |

### Stroke `destructive`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-destructive` | |

### Stroke `info`

| Name | Selectors | Description |
| --- | --- | --- |
| `color` | `stroke-info` | |

### Stack

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `flex gap-0.5` | on top of the track and its size |

### Stack part

| Name | Selectors | Description |
| --- | --- | --- |
| `size` | `h-full min-w-0.5` | a tiny share stays visible |
| `shape` | `rounded-full` | |

### Stack part text

| Name | Selectors | Description |
| --- | --- | --- |
| `layout` | `sr-only` | the part's label, read by screen readers only |
