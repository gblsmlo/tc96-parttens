import type { ArgTypes } from '@storybook/react-vite'

export interface RichTextEditor1Controls {
  readOnly: boolean
  saveDelay: number
  showDescription: boolean
  showStatus: boolean
  withContent: boolean
  withSave: boolean
}

export const richTextEditor1ControlArgs: RichTextEditor1Controls = {
  readOnly: false,
  saveDelay: 800,
  showDescription: true,
  showStatus: true,
  withContent: true,
  withSave: true,
}

export const richTextEditor1ControlArgTypes: Partial<
  ArgTypes<RichTextEditor1Controls>
> = {
  readOnly: {
    control: 'boolean',
    description:
      'The controlled `readOnly` prop; the toolbar goes away and the text cannot be edited.',
  },
  saveDelay: {
    control: { min: 0, step: 100, type: 'number' },
    description: 'The `saveDelay` prop, in milliseconds after the last change.',
  },
  showDescription: {
    control: 'boolean',
    description: 'Passes `description`, the line under the title.',
  },
  showStatus: {
    control: 'boolean',
    description: 'Passes `status`, the badge beside the title.',
  },
  withContent: {
    control: 'boolean',
    description: 'Passes `defaultValue`; without it the document starts empty.',
  },
  withSave: {
    control: 'boolean',
    description: 'Passes `onSave`; without it the footer shows no save state.',
  },
}
