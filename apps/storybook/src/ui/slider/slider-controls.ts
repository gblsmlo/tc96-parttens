import type { ArgTypes } from '@storybook/react-vite'
import {
  type SliderOrientation,
  type SliderThumbAlignment,
  sliderOrientations,
  sliderThumbAlignments,
} from './slider-variants.ts'

export interface SliderControls {
  disabled: boolean
  label: string
  orientation: SliderOrientation
  range: boolean
  showValue: boolean
  thumbAlignment: SliderThumbAlignment
}

export const sliderControlArgs: SliderControls = {
  disabled: false,
  label: 'Opacity',
  orientation: 'horizontal',
  range: false,
  showValue: true,
  thumbAlignment: 'edge',
}

export const sliderControlArgTypes: Partial<ArgTypes<SliderControls>> = {
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Slider`.',
  },
  label: {
    control: 'text',
    description:
      'Text of the `FieldLabel` above the track; empty removes it, and `getAriaLabel` names the thumb instead.',
  },
  orientation: {
    control: 'inline-radio',
    description: 'The `orientation` of `Slider`.',
    options: sliderOrientations,
  },
  range: {
    control: 'boolean',
    description:
      'Starts with two thumbs (`defaultValue={[25, 75]}`) instead of one (`defaultValue={50}`).',
  },
  showValue: {
    control: 'boolean',
    description: 'Adds a `SliderValue` that shows the current value.',
  },
  thumbAlignment: {
    control: 'inline-radio',
    description:
      'The `thumbAlignment` of `Slider`; drag a thumb to either end to see it.',
    options: sliderThumbAlignments,
  },
}
