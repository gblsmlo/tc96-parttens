import type { Decorator } from '@storybook/react-vite'

export const PeopleCanvas: Decorator = (Story) => (
  <div className="min-h-72 max-w-sm p-4">
    <Story />
  </div>
)
