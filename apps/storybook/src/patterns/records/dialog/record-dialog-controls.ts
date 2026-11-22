import type { ArgTypes } from '@storybook/react-vite'
import type { RecordConfirmDialogTone, RecordDialogSize } from '@tc96/parttens'

export const recordDialogSizes: readonly RecordDialogSize[] = [
  'small',
  'default',
  'large',
]

export const recordConfirmDialogTones: readonly RecordConfirmDialogTone[] = [
  'destructive',
  'default',
]

export interface RecordDialogControls {
  actions: boolean
  cancelLabel: string
  createMore: boolean
  description: string
  errorMessage: string
  headline: boolean
  headlineDescription: boolean
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
  cancelLabel: 'Cancel',
  createMore: false,
  description: '',
  errorMessage: '',
  headline: true,
  headlineDescription: true,
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
  size: {
    control: 'inline-radio',
    description: 'The `size` of `RecordDialog`.',
    options: recordDialogSizes,
  },
  stretchBody: {
    control: 'boolean',
    description:
      'The `stretchBody` of `RecordDialog`, also passed as `stretch` to the headline.',
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

export interface RecordConfirmDialogControls {
  body: boolean
  cancelLabel: string
  confirmDisabled: boolean
  confirmLabel: string
  confirmingLabel: string
  description: string
  errorMessage: string
  title: string
  tone: RecordConfirmDialogTone
  trigger: string
}

export const recordConfirmDialogControlArgs: RecordConfirmDialogControls = {
  body: false,
  cancelLabel: 'Cancel',
  confirmDisabled: false,
  confirmLabel: 'Delete project',
  confirmingLabel: 'Deleting',
  description:
    'Aurora and its 12 issues will be removed. This cannot be undone.',
  errorMessage: '',
  title: 'Delete project?',
  tone: 'destructive',
  trigger: 'Delete project',
}

export const recordConfirmDialogControlArgTypes: Partial<
  ArgTypes<RecordConfirmDialogControls>
> = {
  body: {
    control: 'boolean',
    description:
      'Passes a short choice as `children`, which renders the body between the header and the footer.',
  },
  cancelLabel: {
    control: 'text',
    description: 'The `cancelLabel` of `RecordConfirmDialog`.',
  },
  confirmDisabled: {
    control: 'boolean',
    description: 'The `confirmDisabled` of `RecordConfirmDialog`.',
  },
  confirmLabel: {
    control: 'text',
    description: 'The `confirmLabel` of `RecordConfirmDialog`.',
  },
  confirmingLabel: {
    control: 'text',
    description:
      'The `confirmingLabel` of `RecordConfirmDialog`; the confirm here settles after one second, so the label shows meanwhile.',
  },
  description: {
    control: 'text',
    description:
      'The `description` of `RecordConfirmDialog`; empty removes it.',
  },
  errorMessage: {
    control: 'text',
    description:
      'The `errorMessage` of `RecordConfirmDialog`, the alert above the footer; empty removes it.',
  },
  title: {
    control: 'text',
    description:
      'The `title` of `RecordConfirmDialog`, which names the dialog.',
  },
  tone: {
    control: 'inline-radio',
    description: 'The `tone` of `RecordConfirmDialog`.',
    options: recordConfirmDialogTones,
  },
  trigger: {
    control: 'text',
    description: 'Text of the button that opens the dialog again.',
  },
}
