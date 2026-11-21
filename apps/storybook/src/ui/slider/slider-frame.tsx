import type { Decorator } from '@storybook/react-vite'

export const SliderCanvas: Decorator = (Story) => (
  <div className="w-64 max-w-full">
    <Story />
  </div>
)
