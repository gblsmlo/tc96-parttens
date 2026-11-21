import type { ArgTypes } from '@storybook/react-vite'

export interface FrameControls {
  content: string
  description: string
  footer: string
  secondPanel: boolean
  title: string
}

export const frameControlArgs: FrameControls = {
  content: 'The panel holds the main content of the frame.',
  description: 'A sentence about what the panels below hold.',
  footer: 'A note or the actions that apply to the panels.',
  secondPanel: false,
  title: 'Frame title',
}

export const frameControlArgTypes: Partial<ArgTypes<FrameControls>> = {
  content: {
    control: 'text',
    description:
      'Text of the first `FramePanel`; empty leaves the panel empty.',
  },
  description: {
    control: 'text',
    description:
      'Text of `FrameDescription`; empty removes the part, and `FrameHeader` goes when the title is empty too.',
  },
  footer: {
    control: 'text',
    description: 'Text of `FrameFooter`; empty removes the part.',
  },
  secondPanel: {
    control: 'boolean',
    description: 'Adds a second `FramePanel` right after the first.',
  },
  title: {
    control: 'text',
    description:
      'Text of `FrameTitle`; empty removes the part, and `FrameHeader` goes when the description is empty too.',
  },
}
