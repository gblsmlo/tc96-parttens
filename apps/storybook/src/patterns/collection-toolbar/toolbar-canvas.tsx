import type { Decorator } from '@storybook/react-vite'

export const ToolbarCanvas: Decorator = (Story) => (
  <div className="w-full max-w-6xl p-6">
    <Story />
  </div>
)
