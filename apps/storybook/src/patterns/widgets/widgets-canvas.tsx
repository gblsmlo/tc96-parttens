import type { Decorator } from '@storybook/react-vite'

export const WidgetsCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-md p-6">
    <Story />
  </div>
)
