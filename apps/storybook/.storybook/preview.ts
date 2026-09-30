import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light'
      const root = document.documentElement

      root.classList.toggle('dark', theme === 'dark')
      root.style.colorScheme = theme

      return Story()
    },
  ],
  globalTypes: {
    theme: {
      description: 'Global color theme',
      toolbar: {
        dynamicTitle: true,
        icon: 'circlehollow',
        items: [
          { icon: 'sun', title: 'Light', value: 'light' },
          { icon: 'moon', title: 'Dark', value: 'dark' },
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    a11y: {
      test: 'todo',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs', 'test'],
}

export default preview
