import type { ArgTypes } from '@storybook/react-vite'
import type { SegmentedControlSize } from '@tc96/ui/segmented-control'
import {
  type RangeSelection,
  rangeSelectionLabels,
  rangeSelections,
  type SegmentedControlElementName,
  segmentedControlElementNames,
  segmentedControlSizeNames,
} from './segmented-control-variants.ts'

export interface SegmentedControlControls {
  dayLabel: string
  disabledItem: boolean
  element: SegmentedControlElementName
  icon: boolean
  monthLabel: string
  size: SegmentedControlSize
  value: RangeSelection
  weekLabel: string
}

export const segmentedControlControlArgs: SegmentedControlControls = {
  dayLabel: 'Day',
  disabledItem: false,
  element: 'radio',
  icon: false,
  monthLabel: 'Month',
  size: 'default',
  value: 'week',
  weekLabel: 'Week',
}

export const segmentedControlControlArgTypes: Partial<
  ArgTypes<SegmentedControlControls>
> = {
  dayLabel: {
    control: 'text',
    description:
      'Text of the first item; empty leaves the icon alone, named by `aria-label`.',
  },
  disabledItem: {
    control: 'boolean',
    description:
      'Disables the `Month` item; a link has no disabled state, so it does nothing with `element: "link"`.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The elements passed to `render`: a Base UI radio group, a `nav` of links, or a Base UI toggle group.',
    options: segmentedControlElementNames,
  },
  icon: {
    control: 'boolean',
    description: 'Adds a decorative icon before the text of every item.',
  },
  monthLabel: {
    control: 'text',
    description:
      'Text of the third item; empty leaves the icon alone, named by `aria-label`.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `SegmentedControl`.',
    options: segmentedControlSizeNames,
  },
  value: {
    control: { labels: rangeSelectionLabels, type: 'inline-radio' },
    description:
      'The active item on mount: the checked radio, the link with `aria-current="page"` or the pressed toggle; `none` leaves every item inactive.',
    options: rangeSelections,
  },
  weekLabel: {
    control: 'text',
    description:
      'Text of the second item; empty leaves the icon alone, named by `aria-label`.',
  },
}
