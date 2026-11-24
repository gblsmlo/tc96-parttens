import type { ArgTypes } from '@storybook/react-vite'
import { defaultMaxListDepth } from '@tc96/ui/patterns'

export const richTextLabelPresets = ['default', 'english'] as const

export type RichTextLabelPreset = (typeof richTextLabelPresets)[number]

export interface RichTextEditorControls {
  content: boolean
  draggableBlocks: boolean
  imagePicker: boolean
  labels: RichTextLabelPreset
  maxListDepth: number
  mentions: boolean
  placeholder: string
  title: boolean
  titleCounter: boolean
}

export const richTextEditorControlArgs: RichTextEditorControls = {
  content: false,
  draggableBlocks: false,
  imagePicker: false,
  labels: 'default',
  maxListDepth: defaultMaxListDepth,
  mentions: false,
  placeholder: 'Escreva sua nota, ou digite / para escolher um bloco',
  title: true,
  titleCounter: false,
}

export const richTextEditorControlArgTypes: Partial<
  ArgTypes<RichTextEditorControls>
> = {
  content: {
    control: 'boolean',
    description:
      'Seeds the title and the body through `defaultValue`: a note with every block and mark. The editor reads `defaultValue` once, so the composition remounts when this changes.',
  },
  draggableBlocks: {
    control: 'boolean',
    description:
      'The `draggableBlocks` of `RichTextEditor`: a drag handle per top-level block, shown on hover and on focus. The composition adds the room the handles need to the left.',
  },
  imagePicker: {
    control: 'boolean',
    description:
      'Passes `onPickImage`, which resolves to a one-pixel image, so the `/` menu gains Image.',
  },
  labels: {
    control: 'inline-radio',
    description:
      'Sets the label props of `RichTextEditor` (toolbar, marks, blocks, extra blocks, `/` menu) and the names of the editor and the title to the Portuguese defaults or to English.',
    options: richTextLabelPresets,
  },
  maxListDepth: {
    control: { max: 6, min: 1, step: 1, type: 'number' },
    description:
      'The `maxListDepth` of `RichTextEditor`: Tab nests a list item only while the depth stays within it. It must be an integer of at least 1.',
  },
  mentions: {
    control: 'boolean',
    description:
      'Passes three people as `mentions`, so typing `@` opens the people menu.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `RichTextEditor`, shown while the document is empty.',
  },
  title: {
    control: 'boolean',
    description:
      'Adds an `EditorTitle` above the body, wired so Enter and ArrowDown at its end focus the body and ArrowUp on the first line of the body focuses the title.',
  },
  titleCounter: {
    control: 'boolean',
    description:
      'Sets `max` to 80 and `counterFrom` to 60 on `EditorTitle` and starts it with a 75 character title, so the counter shows. Acts only with `title`.',
  },
}
