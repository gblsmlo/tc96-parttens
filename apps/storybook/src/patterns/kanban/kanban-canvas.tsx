import type { Decorator } from '@storybook/react-vite'

export const KanbanCanvas: Decorator = (Story) => (
  <div className="h-[44rem] w-6xl max-w-full p-4">
    <Story />
  </div>
)
