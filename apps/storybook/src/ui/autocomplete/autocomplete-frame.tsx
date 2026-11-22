import type { Decorator } from '@storybook/react-vite'

export const AutocompleteCanvas: Decorator = (Story) => (
  <div className="w-64 max-w-full">
    <Story />
  </div>
)
