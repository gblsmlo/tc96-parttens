import type { Decorator } from '@storybook/react-vite'

export const FrameCanvas: Decorator = (Story) => (
  <div className="w-lg max-w-full">
    <Story />
  </div>
)
