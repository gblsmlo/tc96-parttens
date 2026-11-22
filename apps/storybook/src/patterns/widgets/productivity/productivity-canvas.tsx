import type { Decorator } from '@storybook/react-vite'

export const ProductivityCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-md p-6">
    <Story />
  </div>
)

export const ProductivityDashboardCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-5xl p-6">
    <Story />
  </div>
)
