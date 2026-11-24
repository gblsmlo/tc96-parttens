import type { ArgTypes } from '@storybook/react-vite'
import {
  type GaugeSize,
  type GaugeTone,
  type GaugeVariant,
  gaugeSizes,
  gaugeTones,
  gaugeVariantNames,
} from '@tc96/ui/gauge'

export interface GaugeControls {
  content: string
  empty: boolean
  label: string
  max: number
  segments: number
  size: GaugeSize
  tone: GaugeTone
  value: number
  variant: GaugeVariant
}

export const gaugeControlArgs: GaugeControls = {
  content: '64%',
  empty: false,
  label: 'Storage used',
  max: 100,
  segments: 10,
  size: 'default',
  tone: 'primary',
  value: 64,
  variant: 'bar',
}

export const gaugeControlArgTypes: Partial<ArgTypes<GaugeControls>> = {
  content: {
    control: 'text',
    description:
      'The `children` of `Gauge`, centered over the ring. Read only by `ring`; empty removes it.',
  },
  empty: {
    control: 'boolean',
    description:
      'The `empty` of `Gauge`: no value yet, which is not the same as zero.',
  },
  label: {
    control: 'text',
    description: 'The `aria-label` that names the meter.',
  },
  max: { control: 'number', description: 'The `max` of `Gauge`.' },
  segments: {
    control: { min: 1, step: 1, type: 'number' },
    description: 'The `segments` of `Gauge`, read only by `segmented`.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `Gauge`.',
    options: gaugeSizes,
  },
  tone: {
    control: 'select',
    description: 'The `tone` of `Gauge`.',
    options: gaugeTones,
  },
  value: { control: 'number', description: 'The `value` of `Gauge`.' },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `Gauge`.',
    options: gaugeVariantNames,
  },
}
