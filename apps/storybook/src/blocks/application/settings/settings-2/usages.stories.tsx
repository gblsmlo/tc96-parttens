import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings2,
  type Settings2Options,
  type Settings2Values,
} from '@tc96/blocks/application/settings/settings-2'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings2Handlers } from '../../../../mocks/settings-2.ts'

interface Settings2Preferences {
  options: Settings2Options
  values: Settings2Values
}

const PreferencesSettings = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings2Preferences>('/settings/preferences'),
    queryKey: ['settings', 'preferences'],
  })

  if (isPending) return <Spinner aria-label="Carregando preferências" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as preferências</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Settings2
      onValueChange={fn()}
      options={data.options}
      values={data.values}
    />
  )
}

const meta = {
  component: PreferencesSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings2/Usages',
} satisfies Meta<typeof PreferencesSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Interface e tema')).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Tema da interface' }),
    ).toHaveTextContent('Claro')
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as preferências',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando preferências'),
    ).toBeVisible()
  },
}
