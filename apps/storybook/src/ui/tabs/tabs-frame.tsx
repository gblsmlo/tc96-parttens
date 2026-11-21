import type { Decorator } from '@storybook/react-vite'

export const TabsCanvas: Decorator = (Story) => (
  <div className="w-md max-w-full">
    <Story />
  </div>
)

export const inactiveTabContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector:
            '*:not([data-slot="tabs-list"].bg-muted > [data-slot="tabs-tab"]:not([data-active]))',
        },
      ],
    },
  },
}
