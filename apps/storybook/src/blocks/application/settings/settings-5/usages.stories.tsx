import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings5 } from '@tc96/blocks/application/settings/settings-5'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings5Handlers } from '../../../../mocks/settings-5.ts'
import { type Settings5Workspace, timeZones } from '../fixtures/settings-5.ts'

const WorkspaceSettings = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings5Workspace>('/settings/workspace'),
    queryKey: ['settings', 'workspace'],
  })

  if (isPending) return <Spinner aria-label="Carregando workspace" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar o workspace</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Settings5
      initials={data.initials}
      name={data.name}
      onDeleteWorkspace={fn()}
      onNameCommit={fn()}
      onSlugCommit={fn()}
      onTimeZoneChange={fn()}
      onUploadLogo={fn()}
      slug={data.slug}
      timeZone={data.timeZone}
      timeZones={timeZones}
    />
  )
}

const meta = {
  component: WorkspaceSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings5/Usages',
} satisfies Meta<typeof WorkspaceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings5Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('textbox', { name: 'Nome do workspace' }),
    ).toHaveValue('Acme Labs')
    await expect(
      canvas.getByRole('textbox', { name: 'URL do workspace' }),
    ).toHaveValue('acme-labs')
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings5Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar o workspace',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings5Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando workspace'),
    ).toBeVisible()
  },
}
