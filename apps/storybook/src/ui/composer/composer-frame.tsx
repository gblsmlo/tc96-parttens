import type { Decorator } from '@storybook/react-vite'

export const ComposerCanvas: Decorator = (Story) => (
  <div className="w-96 max-w-full">
    <Story />
  </div>
)

export const SuggestionsCanvas: Decorator = (Story) => (
  <div className="pt-48">
    <Story />
  </div>
)
