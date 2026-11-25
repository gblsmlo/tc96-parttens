import type { ArgTypes } from '@storybook/react-vite'

export interface RichTextEditor2Controls {
  fullWidth: boolean
  locked: boolean
  saveDelay: number
  smallText: boolean
  withPeople: boolean
  withPlaybook: boolean
}

export const richTextEditor2ControlArgs: RichTextEditor2Controls = {
  fullWidth: false,
  locked: false,
  saveDelay: 800,
  smallText: false,
  withPeople: true,
  withPlaybook: true,
}

export const richTextEditor2ControlArgTypes: Partial<
  ArgTypes<RichTextEditor2Controls>
> = {
  fullWidth: {
    control: 'boolean',
    description: 'The `fullWidth` key of `defaultSettings`.',
  },
  locked: {
    control: 'boolean',
    description:
      'The `locked` key of `defaultSettings`; the page is read only.',
  },
  saveDelay: {
    control: { min: 0, step: 100, type: 'number' },
    description: 'Milliseconds of quiet before `onSave` runs.',
  },
  smallText: {
    control: 'boolean',
    description: 'The `smallText` key of `defaultSettings`.',
  },
  withPeople: {
    control: 'boolean',
    description: 'Passes `people`; without them `@` opens nothing.',
  },
  withPlaybook: {
    control: 'boolean',
    description: 'Seeds `defaultValue` with the playbook; off starts empty.',
  },
}
