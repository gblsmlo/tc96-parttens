import type { ArgTypes } from '@storybook/react-vite'

export interface CollapsibleControls {
  chevron: boolean
  content: string
  defaultOpen: boolean
  disabled: boolean
  trigger: string
}

export const collapsibleControlArgs: CollapsibleControls = {
  chevron: true,
  content: 'Describe what the panel reveals here.',
  defaultOpen: false,
  disabled: false,
  trigger: 'Show details',
}

export const collapsibleControlArgTypes: Partial<
  ArgTypes<CollapsibleControls>
> = {
  chevron: {
    control: 'boolean',
    description:
      'Adds a chevron after the trigger text that turns while the panel is open.',
  },
  content: {
    control: 'text',
    description: 'Text inside `CollapsiblePanel`.',
  },
  defaultOpen: {
    control: 'boolean',
    description: 'The `defaultOpen` of `Collapsible`; changing it remounts it.',
  },
  disabled: {
    control: 'boolean',
    description:
      'The `disabled` of `Collapsible`: the trigger ignores presses and keys. It changes no look of its own.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `CollapsibleTrigger`, which names the button.',
  },
}
