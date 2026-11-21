import type { Decorator } from '@storybook/react-vite'

export const NumberFieldCanvas: Decorator = (Story) => (
  <div className="w-56 max-w-full">
    <Story />
  </div>
)
