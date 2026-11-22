import type { Decorator } from '@storybook/react-vite'

export const DateRangeCanvas: Decorator = (Story) => (
  <div className="flex min-h-136 items-start p-4">
    <Story />
  </div>
)
