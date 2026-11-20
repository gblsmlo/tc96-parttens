import type { Decorator } from '@storybook/react-vite'

export const calendarA11y = {
  config: { rules: [{ enabled: false, id: 'color-contrast' }] },
}

export const PickerCanvas: Decorator = (Story) => (
  <div className="w-72">
    <Story />
  </div>
)
