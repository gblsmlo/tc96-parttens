import type { Decorator } from '@storybook/react-vite'

export const FieldsetCanvas: Decorator = (Story) => (
  <div className="w-80 max-w-full">
    <Story />
  </div>
)
