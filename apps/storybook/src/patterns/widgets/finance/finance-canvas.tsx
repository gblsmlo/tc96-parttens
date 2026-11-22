import type { Decorator } from '@storybook/react-vite'

export const FinanceCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-md p-6">
    <Story />
  </div>
)

export const FinanceDashboardCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-5xl p-6">
    <Story />
  </div>
)
