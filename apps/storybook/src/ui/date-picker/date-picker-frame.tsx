import type { Decorator } from '@storybook/react-vite'

export const DatePickerCanvas: Decorator = (Story) => (
  <div className="w-72 max-w-full">
    <Story />
  </div>
)

export const calendarContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector:
            '*:not([data-slot="calendar"] th):not([data-slot="calendar"] [data-outside] *)',
        },
      ],
    },
  },
}
