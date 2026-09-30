import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  docs: {
    autodocs: true,
    defaultName: 'Doc',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
