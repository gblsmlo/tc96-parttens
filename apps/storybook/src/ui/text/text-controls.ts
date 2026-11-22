import type { ArgTypes } from '@storybook/react-vite'
import { type TextSize, textSizes } from '@tc96/ui/text'
import {
  type TextAlignName,
  type TextElementName,
  type TextFamilyName,
  type TextForegroundName,
  type TextLeadingName,
  type TextTrackingName,
  type TextWeightName,
  textAlignNames,
  textElementNames,
  textFamilyNames,
  textForegroundNames,
  textLeadingNames,
  textTrackingNames,
  textWeightNames,
} from './text-variants.ts'

export interface TextControls {
  align: TextAlignName | undefined
  element: TextElementName
  family: TextFamilyName
  foreground: TextForegroundName
  label: string
  leading: TextLeadingName | undefined
  size: TextSize
  tracking: TextTrackingName | undefined
  truncate: boolean
  weight: TextWeightName
}

export const textControlArgs: TextControls = {
  align: undefined,
  element: 'span',
  family: 'sans',
  foreground: 'base',
  label: 'Quarterly revenue report',
  leading: undefined,
  size: 'base',
  tracking: undefined,
  truncate: false,
  weight: 'normal',
}

export const textControlArgTypes: Partial<ArgTypes<TextControls>> = {
  align: {
    control: 'select',
    description:
      'The `align` of `Text`; it acts on a block element, so pair it with `p` or `h2`.',
    options: textAlignNames,
  },
  element: {
    control: 'inline-radio',
    description:
      'The element the text renders: a `span`, or a `p` or an `h2` through `render`.',
    options: textElementNames,
  },
  family: {
    control: 'inline-radio',
    description: 'The `family` of `Text`.',
    options: textFamilyNames,
  },
  foreground: {
    control: 'inline-radio',
    description: 'The `foreground` of `Text`.',
    options: textForegroundNames,
  },
  label: {
    control: 'text',
    description: 'Text content.',
  },
  leading: {
    control: 'select',
    description: 'The `leading` of `Text`.',
    options: textLeadingNames,
  },
  size: {
    control: 'select',
    description: 'The `size` of `Text`.',
    options: textSizes,
  },
  tracking: {
    control: 'select',
    description: 'The `tracking` of `Text`.',
    options: textTrackingNames,
  },
  truncate: {
    control: 'boolean',
    description:
      'The `truncate` of `Text`; it cuts a block element, so pair it with `p`, in a column narrower than the text.',
  },
  weight: {
    control: 'select',
    description: 'The `weight` of `Text`.',
    options: textWeightNames,
  },
}
