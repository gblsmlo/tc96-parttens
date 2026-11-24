import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings4 } from '@tc96/blocks/application/settings/settings-4'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings4Handlers } from '../../../../mocks/settings-4.ts'
import type { Settings4Data } from '../fixtures/settings-4.ts'

const AppearanceSettings = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings4Data>('/settings/appearance'),
    queryKey: ['settings', 'appearance'],
  })

  if (isPending) return <Spinner aria-label="Carregando aparência" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar a aparência</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Settings4
      colorTheme={data.colorTheme}
      mode={data.mode}
      modeOptions={data.modeOptions}
      onColorThemeChange={fn()}
      onModeChange={fn()}
      themeGroups={data.themeGroups}
    />
  )
}

const meta = {
  component: AppearanceSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings4/Usages',
} satisfies Meta<typeof AppearanceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Aparência')).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Tema' }),
    ).toHaveTextContent('Default')
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar a aparência',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando aparência'),
    ).toBeVisible()
  },
}
