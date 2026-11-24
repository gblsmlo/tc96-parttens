import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings19 } from '@tc96/ui/blocks/application/settings/settings-19'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { endpoints } from '../fixtures/settings-19.ts'
import {
  type Settings19Controls,
  settings19ControlArgs,
} from './settings-19-controls.ts'
import { ComposedSettings19 } from './settings-19-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings19ControlArgs,
    onCreate: fn(),
    onEnabledChange: fn(),
    onEndpointAction: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings19 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings19/Behavior',
} satisfies Meta<
  Settings19Controls & {
    onCreate: () => void
    onEnabledChange: (endpointId: string, enabled: boolean) => void
    onEndpointAction: (endpointId: string, action: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const FailingEndpointShowsHealthAlert: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent('Entregas com falha')
    await expect(alert).toHaveTextContent(
      'Um endpoint não está recebendo as entregas.',
    )
    await expect(canvas.getByText('Falhando')).toBeVisible()
  },
}

export const HealthyEndpointsShowNoAlert: Story = {
  args: { failing: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await expect(canvas.queryByText('Falhando')).toBeNull()
  },
}

export const RowShowsEventsAndLastDelivery: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('12 eventos · Última entrega há 3 minutos'),
    ).toBeVisible()
    await expect(
      canvas.getByText('1 evento · Última entrega há 9 dias'),
    ).toBeVisible()
  },
}

export const EnableSwitchCallsOnEnabledChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', {
      name: 'Ativar https://staging.acme.com/hooks',
    })
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(args.onEnabledChange).toHaveBeenCalledWith('ep-staging', true)
    await expect(toggle).toBeChecked()
  },
}

export const NewEndpointButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Novo endpoint' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const ActionsNeedTheirCallbacks: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Novo endpoint' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const RowMenuCallsOnEndpointAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de https://billing.acme.com/webhooks',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Enviar teste',
      'Excluir',
    ])
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Enviar teste' }),
    )
    await waitFor(() =>
      expect(args.onEndpointAction).toHaveBeenCalledWith(
        'ep-billing',
        'send-test',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhum endpoint ainda')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Settings19
      endpoints={endpoints}
      labels={{
        failingTitle: 'Falha nas entregas',
        newEndpoint: 'Adicionar URL',
        title: 'Integrações',
      }}
      onCreate={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Integrações')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Adicionar URL' }),
    ).toBeVisible()
    await expect(canvas.getByText('Falha nas entregas')).toBeVisible()
    await expect(canvas.queryByText('Webhooks')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings19 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando webhooks'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings19 {...args} error onRetry={retryHandler} />
  ),
  play: async ({ canvasElement }) => {
    retryHandler.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retryHandler).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: (args) => <ComposedSettings19 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings19 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando webhooks')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettings19 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
