import type { ArgTypes } from '@storybook/react-vite'
import {
  type SkeletonShapeName,
  skeletonShapeNames,
} from './skeleton-variants.ts'

export interface SkeletonControls {
  shape: SkeletonShapeName
}

export const skeletonControlArgs: SkeletonControls = {
  shape: 'line',
}

export const skeletonControlArgTypes: Partial<ArgTypes<SkeletonControls>> = {
  shape: {
    control: 'inline-radio',
    description:
      'Maps to the classes passed to `className`, the only way to shape a skeleton: a text line (`h-4 w-48`), an avatar circle (`size-10 rounded-full`) or a media block (`h-24 w-48`).',
    options: skeletonShapeNames,
  },
}
