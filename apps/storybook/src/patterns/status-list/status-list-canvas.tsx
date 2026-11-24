import type { Decorator } from '@storybook/react-vite'

export const RecordStatusListCanvas: Decorator = (Story) => (
  <div className="w-[28rem] max-w-full">
    <Story />
  </div>
)
