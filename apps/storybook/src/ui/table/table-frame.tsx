import type { Decorator } from '@storybook/react-vite'

export const TableCanvas: Decorator = (Story) => (
  <div className="w-xl max-w-full">
    <Story />
  </div>
)
