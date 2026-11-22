import type { Decorator } from '@storybook/react-vite'

export const DateCanvas: Decorator = (Story) => (
  <div className="flex min-h-96 items-start p-4">
    <Story />
  </div>
)
