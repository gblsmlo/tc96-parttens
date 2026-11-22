import type { Decorator } from '@storybook/react-vite'

export const ChecklistCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-2xl p-8">
    <Story />
  </div>
)
