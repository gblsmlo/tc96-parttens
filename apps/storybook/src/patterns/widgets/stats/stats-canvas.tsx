import type { Decorator } from '@storybook/react-vite'

export const StatsCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-sm p-6">
    <Story />
  </div>
)
