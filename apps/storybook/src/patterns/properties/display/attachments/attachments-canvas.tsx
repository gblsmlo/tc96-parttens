import type { Decorator } from '@storybook/react-vite'

export const AttachmentsCanvas: Decorator = (Story) => (
  <div className="flex w-full max-w-xl items-start p-4">
    <Story />
  </div>
)
