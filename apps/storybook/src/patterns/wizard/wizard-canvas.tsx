import type { Decorator } from '@storybook/react-vite'

export const WizardCanvas: Decorator = (Story) => (
  <div className="mx-auto w-full max-w-4xl p-8">
    <Story />
  </div>
)
