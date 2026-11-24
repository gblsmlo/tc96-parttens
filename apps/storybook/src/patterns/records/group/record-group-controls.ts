import type { ArgTypes } from '@storybook/react-vite'
import type {
  RecordGroupActionsAlign,
  RecordGroupVariant,
} from '@tc96/ui/patterns'

export const recordGroupVariants: readonly RecordGroupVariant[] = [
  'plain',
  'card',
  'inset',
]

export const recordGroupActionsAligns: readonly RecordGroupActionsAlign[] = [
  'between',
  'start',
]

export const recordGroupChevrons = ['start', 'end'] as const

export interface RecordGroupControls {
  actions: boolean
  actionsAlign: RecordGroupActionsAlign
  chevron: (typeof recordGroupChevrons)[number]
  collapsible: boolean
  defaultOpen: boolean
  empty: boolean
  footer: boolean
  leading: boolean
  title: string
  variant: RecordGroupVariant
}

export const recordGroupControlArgs: RecordGroupControls = {
  actions: true,
  actionsAlign: 'between',
  chevron: 'start',
  collapsible: true,
  defaultOpen: true,
  empty: false,
  footer: true,
  leading: true,
  title: 'Details',
  variant: 'plain',
}

export const recordGroupControlArgTypes: Partial<
  ArgTypes<RecordGroupControls>
> = {
  actions: {
    control: 'boolean',
    description:
      'Passes a `RecordGroupAction` ("Add property") in `actions`, outside the trigger.',
  },
  actionsAlign: {
    control: 'inline-radio',
    description: 'The `actionsAlign` of `RecordGroup`.',
    options: recordGroupActionsAligns,
  },
  chevron: {
    control: 'inline-radio',
    description: 'The `chevron` of `RecordGroup`.',
    options: recordGroupChevrons,
  },
  collapsible: {
    control: 'boolean',
    description: 'The `collapsible` of `RecordGroup`.',
  },
  defaultOpen: {
    control: 'boolean',
    description:
      'The `defaultOpen` of `RecordGroup`; the group remounts when it changes.',
  },
  empty: {
    control: 'boolean',
    description:
      'Sets `empty` and replaces the rows with a short text; the group starts closed.',
  },
  footer: {
    control: 'boolean',
    description: 'Passes a ghost `Button` ("View history") in `footer`.',
  },
  leading: {
    control: 'boolean',
    description: 'Gives every `RecordGroupRow` an icon in `leading`.',
  },
  title: {
    control: 'text',
    description: 'Text of `title`, the `h2` that names the region.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `RecordGroup`.',
    options: recordGroupVariants,
  },
}
