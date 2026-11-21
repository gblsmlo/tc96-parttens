import type { Decorator } from '@storybook/react-vite'

export const SelectCanvas: Decorator = (Story) => (
  <div className="w-64 max-w-full">
    <Story />
  </div>
)
