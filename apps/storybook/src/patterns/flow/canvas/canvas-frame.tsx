import type { Decorator } from '@storybook/react-vite'

export const CanvasFrame: Decorator = (Story) => (
  <div className="h-136 w-full overflow-hidden rounded-xl border">
    <Story />
  </div>
)
