import type { Decorator } from '@storybook/react-vite'

export const DatePickerCanvas: Decorator = (Story) => (
  <div className="w-72 max-w-full">
    <Story />
  </div>
)
