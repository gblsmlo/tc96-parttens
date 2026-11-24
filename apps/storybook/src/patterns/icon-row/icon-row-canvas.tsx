import type { Decorator } from '@storybook/react-vite'

export const IconRowCanvas: Decorator = (Story) => (
  <div className="w-96 max-w-full">
    <Story />
  </div>
)
