import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings9,
  type Settings9Rule,
} from '@tc96/blocks/application/settings/settings-9'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings9Handlers } from '../../../../mocks/settings-9.ts'

const WorkspaceRules = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings9Rule[]>('/settings/rules'),
    queryKey: ['settings', 'rules'],
  })

  if (isPending) return <Spinner aria-label="Carregando regras" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as regras</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <Settings9 onCreate={fn()} onRuleAction={fn()} rules={data} />
}

const meta = {
  component: WorkspaceRules,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings9/Usages',
} satisfies Meta<typeof WorkspaceRules>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings9Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Proposta')).toBeVisible()
    await expect(
      canvas.getByText('Adicionar SLA de 2 dias úteis'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings9Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma regra ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings9Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as regras',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings9Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando regras'),
    ).toBeVisible()
  },
}
