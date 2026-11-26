import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import {
  configDefaults,
  defineConfig,
  mergeConfig,
  type TestProjectInlineConfiguration,
} from 'vitest/config'
import viteConfig from './vite.config.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const storybookProject = (
  name: string,
  initialGlobals: Record<string, unknown>,
): TestProjectInlineConfiguration => ({
  extends: true,
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
      storybookScript: 'bun run dev',
      initialGlobals,
    }),
  ],
  test: {
    name,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: process.env.TC96_CHROMIUM_EXECUTABLE
          ? { executablePath: process.env.TC96_CHROMIUM_EXECUTABLE }
          : {},
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
})

const workspaceSources = ['packages/ui/src', 'packages/utils/src'].map(
  (folder) => path.resolve(dirname, '../..', folder),
)

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      {
        name: 'tc96-watch-workspace-sources',
        configureServer(server) {
          server.watcher.add(workspaceSources)
        },
      },
    ],
    test: {
      maxWorkers: 2,
      forceRerunTriggers: process.env.TC96_CHANGED_SOURCES_ONLY
        ? []
        : [
            ...configDefaults.forceRerunTriggers,
            ...workspaceSources.map((folder) => `${folder}/**`),
          ],
      projects: [
        storybookProject('storybook', { theme: 'light' }),
        storybookProject('storybook-dark', { theme: 'dark' }),
      ],
    },
  }),
)
