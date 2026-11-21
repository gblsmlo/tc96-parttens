import type { Decorator } from '@storybook/react-vite'

export const InputGroupCanvas: Decorator = (Story) => (
  <div className="w-80 max-w-full">
    <Story />
  </div>
)

export const InputGroupAnatomyCanvas: Decorator = (Story) => (
  <div className="w-lg max-w-full">
    <Story />
  </div>
)
