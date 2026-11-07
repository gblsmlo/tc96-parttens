import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'
import { storySourcePlugin } from './story-source-plugin.ts'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
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
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), storySourcePlugin()],
  }),
}

export default config
