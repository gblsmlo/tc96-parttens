import type { Decorator } from '@storybook/react-vite'

export const PhoneInputCanvas: Decorator = (Story) => (
  <div className="flex min-h-96 w-full max-w-sm items-start p-4">
    <Story />
  </div>
)
