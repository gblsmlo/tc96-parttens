import type { Decorator } from '@storybook/react-vite'

export const GamificationCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-md p-6">
    <Story />
  </div>
)

export const GamificationDashboardCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-4xl p-6">
    <Story />
  </div>
)
