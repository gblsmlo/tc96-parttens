import type { Decorator } from '@storybook/react-vite'

export const TextCanvas: Decorator = (Story) => (
  <div className="max-w-md p-4">
    <Story />
  </div>
)
