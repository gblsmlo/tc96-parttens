import type { Preview } from '@storybook/react-vite'
import '../../example/packages/ui/src/styles.css'

type ThemeMode = 'system' | 'light' | 'dark'

const systemQuery = '(prefers-color-scheme: dark)'

let mode: ThemeMode = 'dark'
let listeningToSystem = false

const toThemeMode = (value: unknown): ThemeMode =>
  value === 'system' || value === 'light' ? value : 'dark'

const resolveTheme = (): 'light' | 'dark' => {
  if (mode !== 'system') return mode
  return window.matchMedia(systemQuery).matches ? 'dark' : 'light'
}

const applyTheme = () => {
  const theme = resolveTheme()
  const root = document.documentElement

  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  document.body.dataset.theme = theme
}

const listenToSystem = () => {
  if (listeningToSystem) return
  listeningToSystem = true
  window.matchMedia(systemQuery).addEventListener('change', () => {
    if (mode === 'system') applyTheme()
  })
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      mode = toThemeMode(context.globals.theme)
      listenToSystem()
      applyTheme()

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
          { icon: 'browser', title: 'System', value: 'system' },
          { icon: 'sun', title: 'Light', value: 'light' },
          { icon: 'moon', title: 'Dark', value: 'dark' },
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  parameters: {
    // Uma violação do axe reprova o storybook:test. Exceções ficam na story,
    // com o motivo; hoje só contraste de componentes e exemplos do COSS.
    a11y: {
      test: 'error',
    },
    docs: {
      codePanel: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    options: {
      storySort: (a, b) => {
        if (a.title === 'Get Started') return b.title === 'Get Started' ? 0 : -1
        if (b.title === 'Get Started') return 1
        const byFolder = (a.title.split('/')[0] ?? '').localeCompare(
          b.title.split('/')[0] ?? '',
        )
        if (byFolder !== 0) return byFolder
        if (b.title.startsWith(`${a.title}/`)) return -1
        if (a.title.startsWith(`${b.title}/`)) return 1
        return 0
      },
    },
  },
  tags: ['autodocs', 'test'],
}

export default preview
