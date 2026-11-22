import type { Decorator } from '@storybook/react-vite'

export const ScheduleCanvas: Decorator = (Story) => (
  <div className="flex min-h-176 items-start p-4">
    <Story />
  </div>
)
