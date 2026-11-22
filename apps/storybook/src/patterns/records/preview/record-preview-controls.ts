import type { ArgTypes } from '@storybook/react-vite'

export interface RecordPreviewControls {
  actionLabel: string
  actions: boolean
  body: boolean
  closeLabel: string
  description: string
  footer: boolean
  longContent: boolean
  title: string
  trigger: string
}

export const recordPreviewControlArgs: RecordPreviewControls = {
  actionLabel: 'Open as page',
  actions: true,
  body: false,
  closeLabel: 'Close preview',
  description: 'Sprint 12',
  footer: false,
  longContent: false,
  title: 'Implement onboarding',
  trigger: 'Open preview',
}

export const recordPreviewControlArgTypes: Partial<
  ArgTypes<RecordPreviewControls>
> = {
  actionLabel: {
    control: 'text',
    description:
      'The `label` of `RecordPreviewAction`, which names the button and fills its tooltip.',
  },
  actions: {
    control: 'boolean',
    description:
      'Passes a `RecordPreviewAction` in `actions`, before the close button.',
  },
  body: {
    control: 'boolean',
    description:
      'Wraps the content in `RecordPreviewBody`, which stacks it in a column with a 16px gap.',
  },
  closeLabel: {
    control: 'text',
    description:
      'The `closeLabel` of `RecordPreview`, which names the close button.',
  },
  description: {
    control: 'text',
    description:
      'The `description` of `RecordPreview`, under the title; empty removes it.',
  },
  footer: {
    control: 'boolean',
    description:
      'Passes a Cancel and a Restore button in `footer`, below the scrolling panel.',
  },
  longContent: {
    control: 'boolean',
    description:
      'Passes 24 paragraphs as `children` instead of 3, so the panel scrolls.',
  },
  title: {
    control: 'text',
    description: 'The `title` of `RecordPreview`, which names the dialog.',
  },
  trigger: {
    control: 'text',
    description: 'Text of the button that opens the preview again.',
  },
}
