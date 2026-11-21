import type { Decorator } from '@storybook/react-vite'

export const TabsCanvas: Decorator = (Story) => (
  <div className="w-md max-w-full">
    <Story />
  </div>
)
