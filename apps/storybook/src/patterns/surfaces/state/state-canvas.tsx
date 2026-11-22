import type { Decorator } from '@storybook/react-vite'

export const StateCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-2xl p-6">
    <Story />
  </div>
)
