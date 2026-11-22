import type { Decorator } from '@storybook/react-vite'

export const RichTextEditorCanvas: Decorator = (Story) => (
  <div className="w-2xl max-w-full">
    <Story />
  </div>
)
