import type { ArgTypes } from '@storybook/react-vite'

export interface RichTextEditor5Controls {
  authorId: 'ana' | 'julia'
  stepDelay: number
}

export const richTextEditor5ControlArgs: RichTextEditor5Controls = {
  authorId: 'ana',
  stepDelay: 0,
}

export const richTextEditor5ControlArgTypes: Partial<
  ArgTypes<RichTextEditor5Controls>
> = {
  authorId: {
    control: 'inline-radio',
    description:
      'The `author` prop: who your own typing is stamped with. The assistant is always a separate author.',
    options: ['ana', 'julia'],
  },
  stepDelay: {
    control: { max: 1500, min: 0, step: 50, type: 'number' },
    description:
      'The `stepDelay` prop, in milliseconds between steps and edits. Use 0 to run at once, around 450 to watch the trace.',
  },
}
