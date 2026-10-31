import type { Preview } from '@storybook/react-vite'
import '../../example/packages/ui/src/styles.css'
import '@xyflow/react/dist/base.css'
import { themePresets } from '../../example/packages/ui/src/themes/presets.ts'
import { DocsPage } from './docs-page.tsx'

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

const presetFontsId = 'theme-preset-fonts'

const applyPreset = (value: unknown) => {
  const preset = themePresets.find((item) => item.value === value)
  const root = document.documentElement
  if (!preset || preset.value === 'default') {
    delete root.dataset.themePreset
  } else {
    root.dataset.themePreset = preset.value
  }

  const current = document.getElementById(presetFontsId)
  if (current?.getAttribute('href') === preset?.fontsHref) return
  current?.remove()
  if (!preset?.fontsHref) return
  const link = document.createElement('link')
  link.id = presetFontsId
  link.rel = 'stylesheet'
  link.href = preset.fontsHref
  document.head.append(link)
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
      applyPreset(context.globals.themePreset)

      return Story()
    },
  ],
  globalTypes: {
    themePreset: {
      description: 'Theme preset from the example theme',
      toolbar: {
        dynamicTitle: true,
        icon: 'paintbrush',
        items: themePresets.map(({ value, title, source }) => ({
          value,
          title,
          right: source,
        })),
      },
    },
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
    themePreset: 'default',
  },
  parameters: {
    // Uma violação do axe reprova o storybook:test. Exceções ficam na story,
    // com o motivo; hoje só contraste de componentes e exemplos do COSS.
    a11y: {
      test: 'error',
    },
    docs: {
      codePanel: true,
      page: DocsPage,
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
        const roots = [
          'Get Started',
          'UI',
          'Elements',
          'Patterns',
          'Application',
          'Templates',
        ]
        const rootA = a.title.split('/')[0] ?? ''
        const rootB = b.title.split('/')[0] ?? ''
        const rankA = roots.includes(rootA)
          ? roots.indexOf(rootA)
          : roots.length
        const rankB = roots.includes(rootB)
          ? roots.indexOf(rootB)
          : roots.length
        if (rankA !== rankB) return rankA - rankB
        const byFolder = rootA.localeCompare(rootB)
        if (byFolder !== 0) return byFolder
        const aDoc = /^[^/]+\/Doc$/.test(a.title)
        if (aDoc !== /^[^/]+\/Doc$/.test(b.title)) return aDoc ? -1 : 1
        if (rootA !== 'Get Started') {
          const folderA = a.title.split('/')[1] ?? ''
          const folderB = b.title.split('/')[1] ?? ''
          const bySubfolder = folderA.localeCompare(folderB)
          if (bySubfolder !== 0) return bySubfolder
        }
        if (b.title.startsWith(`${a.title}/`)) return -1
        if (a.title.startsWith(`${b.title}/`)) return 1
        return 0
      },
    },
  },
  tags: ['autodocs', 'test'],
}

export default preview
