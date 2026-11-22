import type { Decorator } from '@storybook/react-vite'

export const FlagCanvas: Decorator = (Story) => (
  <div className="p-4">
    <Story />
  </div>
)
