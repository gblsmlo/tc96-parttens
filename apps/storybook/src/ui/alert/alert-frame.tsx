import type { Decorator } from '@storybook/react-vite'

export const AlertCanvas: Decorator = (Story) => (
  <div className="w-lg max-w-full">
    <Story />
  </div>
)
