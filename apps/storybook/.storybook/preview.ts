import type { Preview } from '@storybook/react-vite'
import '../../example/packages/ui/src/styles.css'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light'
      const root = document.documentElement

      root.classList.toggle('dark', theme === 'dark')
      root.style.colorScheme = theme
      document.body.dataset.theme = theme

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
    // Uma violação do axe reprova o storybook:test. Exceções ficam na story,
    // com o motivo; hoje só contraste de componentes e exemplos do COSS.
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        includeNames: true,
        method: 'alphabetical',
      },
    },
  },
  tags: ['autodocs', 'test'],
}

export default preview
