import type { Decorator } from '@storybook/react-vite'

export const SelectCanvas: Decorator = (Story) => (
  <div className="min-h-72 p-4">
    <Story />
  </div>
)
