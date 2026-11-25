import type { ArgTypes } from '@storybook/react-vite'

export interface RichTextEditor3Controls {
  authorId: 'ana' | 'julia'
  existingChanges: number
  title: string
}

export const richTextEditor3ControlArgs: RichTextEditor3Controls = {
  authorId: 'ana',
  existingChanges: 3,
  title: 'Contrato de prestação de serviços',
}

export const richTextEditor3ControlArgTypes: Partial<
  ArgTypes<RichTextEditor3Controls>
> = {
  authorId: {
    control: 'inline-radio',
    description: 'The `author` prop: who the new changes are stamped with.',
    options: ['ana', 'julia'],
  },
  existingChanges: {
    control: { max: 3, min: 0, type: 'number' },
    description:
      'How many changes the `defaultValue` already carries from other people; it only applies when the story reloads.',
  },
  title: {
    control: 'text',
    description: 'The `title` prop, shown in the sticky header.',
  },
}
