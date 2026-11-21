import type { Decorator } from '@storybook/react-vite'

export const ProgressCanvas: Decorator = (Story) => (
  <div className="w-80 max-w-full">
    <Story />
  </div>
)
