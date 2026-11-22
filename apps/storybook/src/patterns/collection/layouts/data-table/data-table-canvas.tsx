import type { Decorator } from '@storybook/react-vite'

export const DataTableCanvas: Decorator = (Story) => (
  <div className="w-[calc(100vw-2rem)] max-w-[1280px] p-4">
    <Story />
  </div>
)
