import type { Decorator } from '@storybook/react-vite'

export const IconLabelCanvas: Decorator = (Story) => (
  <div className="p-4">
    <Story />
  </div>
)
