import type { Decorator } from '@storybook/react-vite'

export const EditableCanvas: Decorator = (Story) => (
  <div className="w-sm max-w-full">
    <Story />
  </div>
)
