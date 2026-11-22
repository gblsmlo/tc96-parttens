import type { ArgTypes } from '@storybook/react-vite'
import {
  type IconFrameShape,
  type IconFrameSize,
  type IconFrameVariant,
  iconFrameShapes,
  iconFrameSizes,
  iconFrameVariantNames,
} from '@tc96/ui/icon-frame'
import {
  type IconFrameElementName,
  iconFrameElementNames,
} from './icon-frame-variants.ts'

export interface IconFrameControls {
  color: string
  element: IconFrameElementName
  shape: IconFrameShape
  size: IconFrameSize
  variant: IconFrameVariant
}

export const iconFrameControlArgs: IconFrameControls = {
  color: '#f7931a',
  element: 'span',
  shape: 'circle',
  size: 'default',
  variant: 'color',
}

export const iconFrameControlArgTypes: Partial<ArgTypes<IconFrameControls>> = {
  color: {
    control: 'color',
    description:
      'The `color` of `IconFrame`: the icon color and, with `variant="color"`, a 6% tint of the background. Empty uses `muted` and `foreground`.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The element the frame renders: a `span`, or a `div` through `render`.',
    options: iconFrameElementNames,
  },
  shape: {
    control: 'inline-radio',
    description: 'The `shape` of `IconFrame`.',
    options: iconFrameShapes,
  },
  size: {
    control: 'select',
    description: 'The `size` of `IconFrame`.',
    options: iconFrameSizes,
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `IconFrame`.',
    options: iconFrameVariantNames,
  },
}
