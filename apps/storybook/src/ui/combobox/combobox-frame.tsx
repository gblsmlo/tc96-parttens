import type { Decorator } from '@storybook/react-vite'

export const ComboboxCanvas: Decorator = (Story) => (
  <div className="w-64 max-w-full">
    <Story />
  </div>
)
