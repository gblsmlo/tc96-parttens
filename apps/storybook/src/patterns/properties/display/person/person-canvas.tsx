import type { Decorator } from '@storybook/react-vite'

export const PersonCanvas: Decorator = (Story) => (
  <div className="min-h-64 p-4">
    <Story />
  </div>
)
