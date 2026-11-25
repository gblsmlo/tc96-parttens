import type { Decorator } from '@storybook/react-vite'

export const CollectionPaginationCanvas: Decorator = (Story) => (
  <div className="w-full max-w-4xl p-6">
    <Story />
  </div>
)
