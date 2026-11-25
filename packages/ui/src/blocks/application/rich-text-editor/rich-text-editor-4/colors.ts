import type { RichTextEditor4Color } from './types'

export const richTextEditor4Colors = {
  'chart-1': {
    bar: 'bg-chart-1',
    dot: 'bg-chart-1',
    fill: 'bg-chart-1/20',
    ring: 'ring-chart-1',
  },
  'chart-2': {
    bar: 'bg-chart-2',
    dot: 'bg-chart-2',
    fill: 'bg-chart-2/20',
    ring: 'ring-chart-2',
  },
  'chart-3': {
    bar: 'bg-chart-3',
    dot: 'bg-chart-3',
    fill: 'bg-chart-3/20',
    ring: 'ring-chart-3',
  },
  'chart-4': {
    bar: 'bg-chart-4',
    dot: 'bg-chart-4',
    fill: 'bg-chart-4/20',
    ring: 'ring-chart-4',
  },
  'chart-5': {
    bar: 'bg-chart-5',
    dot: 'bg-chart-5',
    fill: 'bg-chart-5/20',
    ring: 'ring-chart-5',
  },
  primary: {
    bar: 'bg-primary',
    dot: 'bg-primary',
    fill: 'bg-primary/20',
    ring: 'ring-primary',
  },
} as const satisfies Record<
  RichTextEditor4Color,
  { bar: string; dot: string; fill: string; ring: string }
>
