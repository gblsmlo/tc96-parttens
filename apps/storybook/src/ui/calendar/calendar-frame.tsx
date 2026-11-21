import type { Decorator } from '@storybook/react-vite'

export const PickerCanvas: Decorator = (Story) => (
  <div className="w-72">
    <Story />
  </div>
)
