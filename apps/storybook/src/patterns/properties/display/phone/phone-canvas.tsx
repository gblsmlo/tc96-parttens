import type { Decorator } from '@storybook/react-vite'

export const PhoneCanvas: Decorator = (Story) => (
  <div className="flex min-h-72 max-w-md items-start p-4">
    <Story />
  </div>
)
