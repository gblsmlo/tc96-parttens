import type { Decorator } from '@storybook/react-vite'

export const PopoverRoom: Decorator = (Story) => (
  <div className="flex min-h-96 items-center justify-center p-16">
    <Story />
  </div>
)
