import type { Decorator } from '@storybook/react-vite'

export const TooltipFrame: Decorator = (Story) => (
  <div className="flex justify-center p-16">
    <Story />
  </div>
)
