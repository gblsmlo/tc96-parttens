import type { Decorator } from '@storybook/react-vite'

export const EditorFrame: Decorator = (Story) => (
  <div className="flex h-128 w-full max-w-3xl overflow-hidden rounded-xl border">
    <Story />
  </div>
)

export const PartFrame: Decorator = (Story) => (
  <div className="w-72 max-w-full">
    <Story />
  </div>
)
