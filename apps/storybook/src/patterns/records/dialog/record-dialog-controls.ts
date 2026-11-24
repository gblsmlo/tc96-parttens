import type { ArgTypes } from '@storybook/react-vite'
import type { RecordDialogBodyWidth, RecordDialogSize } from '@tc96/parttens'

export const recordDialogSizes: readonly RecordDialogSize[] = [
  'small',
  'default',
  'large',
]

export const recordDialogBodyWidths: readonly RecordDialogBodyWidth[] = [
  'fill',
  'readable',
]

export interface RecordDialogControls {
  actions: boolean
  bodyWidth: RecordDialogBodyWidth
  cancelLabel: string
  createMore: boolean
  description: string
  errorMessage: string
  headline: boolean
  headlineDescription: boolean
  properties: boolean
  size: RecordDialogSize
  stretchBody: boolean
  submitDisabled: boolean
  submitLabel: string
  submitOnModEnter: boolean
  submittingLabel: string
  title: string
  titleAncestor: string
  trigger: string
}

export const recordDialogControlArgs: RecordDialogControls = {
  actions: false,
  bodyWidth: 'fill',
  cancelLabel: 'Cancel',
  createMore: false,
  description: '',
  errorMessage: '',
  headline: true,
  headlineDescription: true,
  properties: false,
  size: 'default',
  stretchBody: false,
  submitDisabled: false,
  submitLabel: 'Create project',
  submitOnModEnter: false,
  submittingLabel: 'Creating',
  title: 'New project',
  titleAncestor: 'Projects',
  trigger: 'New project',
}

export const recordDialogControlArgTypes: Partial<
  ArgTypes<RecordDialogControls>
> = {
  actions: {
    control: 'boolean',
    description:
      'Passes an "Open as page" icon button in `actions`, at the top end of the header.',
  },
  bodyWidth: {
    control: 'inline-radio',
    description:
      'The `bodyWidth` of `RecordDialog`: `readable` holds the form in a centered 672px column, which shows at `large` size.',
    options: recordDialogBodyWidths,
  },
  cancelLabel: {
    control: 'text',
    description:
      'The `cancelLabel` of `RecordDialog`; empty removes the button.',
  },
  createMore: {
    control: 'boolean',
    description:
      'Passes `RecordDialogCreateMore` in `footerStart`; its switch sets `keepOpenOnSuccess`.',
  },
  description: {
    control: 'text',
    description:
      'The `description` of `RecordDialog`, under the title; empty removes it.',
  },
  errorMessage: {
    control: 'text',
    description:
      'The `errorMessage` of `RecordDialog`, the alert above the footer; empty removes it.',
  },
  headline: {
    control: 'boolean',
    description:
      'Passes `RecordDialogHeadline` as `children`; off leaves the dialog without a panel.',
  },
  headlineDescription: {
    control: 'boolean',
    description:
      'Passes `descriptionLabel` to `RecordDialogHeadline`, which adds the description field.',
  },
  properties: {
    control: 'boolean',
    description:
      'Passes Status, Priority and Lead as `plain` chips in `properties`, under the description, or under the title without one.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `RecordDialog`.',
    options: recordDialogSizes,
  },
  stretchBody: {
    control: 'boolean',
    description: 'The `stretchBody` of `RecordDialog`.',
  },
  submitDisabled: {
    control: 'boolean',
    description: 'The `submitDisabled` of `RecordDialog`.',
  },
  submitLabel: {
    control: 'text',
    description: 'The `submitLabel` of `RecordDialog`.',
  },
  submitOnModEnter: {
    control: 'boolean',
    description:
      'The `submitOnModEnter` of `RecordDialog`: the key hint on the submit button and Mod+Enter.',
  },
  submittingLabel: {
    control: 'text',
    description:
      'The `submittingLabel` of `RecordDialog`; the save here settles after one second, so the label shows meanwhile.',
  },
  title: {
    control: 'text',
    description: 'The `title` of `RecordDialog`, which names the dialog.',
  },
  titleAncestor: {
    control: 'text',
    description:
      'The `titleAncestor` of `RecordDialog`, before a chevron; empty removes the trail.',
  },
  trigger: {
    control: 'text',
    description: 'Text of the button that opens the dialog again.',
  },
}
