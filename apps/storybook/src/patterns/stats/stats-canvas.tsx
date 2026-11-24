import type { Decorator } from '@storybook/react-vite'

export const StatsCanvas: Decorator = (Story, { parameters }) => (
  <div
    className={
      parameters.statsCanvas === 'wide'
        ? 'mx-auto w-full max-w-xl p-6'
        : 'mx-auto w-full max-w-sm p-6'
    }
  >
    <Story />
  </div>
)
