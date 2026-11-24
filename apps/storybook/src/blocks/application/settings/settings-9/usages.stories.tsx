import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings9,
  type Settings9Rule,
} from '@tc96/ui/blocks/application/settings/settings-9'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings9Handlers } from '../../../../mocks/settings-9.ts'
import { settings9ControlArgs } from './settings-9-controls.ts'
import { ComposedSettings9 } from './settings-9-layouts.tsx'

const WorkspaceRules = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings9Rule[]>('/settings/rules'),
    queryKey: ['settings', 'rules'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings9
        {...settings9ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <Settings9 onCreate={fn()} onRuleAction={fn()} rules={data} />
}

const meta = {
  component: WorkspaceRules,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
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
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as regras'),
    ).toBeVisible()
    const retry = canvas.getByRole('button', { name: 'Tentar novamente' })
    await expect(retry).toBeEnabled()
    await userEvent.click(retry)
    await expect(await canvas.findByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings9Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando regras')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
