import type { Decorator } from '@storybook/react-vite'

export const EmptyCanvas: Decorator = (Story) => (
  <div className="w-2xl max-w-full">
    <Story />
  </div>
)
