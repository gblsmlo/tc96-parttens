import type { Decorator } from '@storybook/react-vite'

export const ReferenceCanvas: Decorator = (Story) => (
  <div className="flex items-start p-4">
    <Story />
  </div>
)
