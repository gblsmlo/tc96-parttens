import type { Decorator } from '@storybook/react-vite'

export const RecordGroupCanvas: Decorator = (Story) => (
  <div className="w-96 max-w-full">
    <Story />
  </div>
)
