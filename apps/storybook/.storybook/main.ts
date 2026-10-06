import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
  ],
  features: {
    componentsManifest: true,
  },
  // O autodocs vem da tag `autodocs` no preview.ts; aqui só o nome da página.
  docs: {
    defaultName: 'Doc',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
