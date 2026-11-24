import type { Decorator } from '@storybook/react-vite'

export const NextSteps1Canvas: Decorator = (Story) => (
  <div className="w-[34rem] max-w-full">
    <Story />
  </div>
)
