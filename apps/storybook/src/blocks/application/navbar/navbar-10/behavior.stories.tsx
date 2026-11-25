import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar10 } from '@tc96/ui/blocks/application/navbar/navbar-10'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { menuActions, services, user } from '../fixtures/navbar-10.ts'
import {
  type Navbar10Controls,
  navbar10ControlArgs,
} from './navbar-10-controls.ts'
import { ComposedNavbar10, navbar10Handlers } from './navbar-10-layouts.tsx'

const meta = {
  args: navbar10ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar10Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar10/Behavior',
} satisfies Meta<Navbar10Controls>

export default meta

type Story = StoryObj<typeof meta>

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header).toHaveClass('border-b', 'w-full')
  },
}

export const BrandShowsTheName: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Portal Dev')).toBeVisible()
  },
}

export const RequestFormHasAnAccessibleName: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('form', { name: 'Requisição' }),
    ).toBeVisible()
  },
}

export const PathInputShowsThePathInMonospace: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Caminho da requisição',
    })
    await expect(input).toHaveValue('/modelos/{id}')
    await expect(input.closest('[data-slot="input-control"]')).toHaveClass(
      'font-mono',
    )
  },
}

export const EmptyPathShowsThePlaceholder: Story = {
  args: { path: '' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByPlaceholderText('/modelos/{id}'),
    ).toBeVisible()
  },
}

export const TypingCallsOnPathChange: Story = {
  args: { path: '' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Caminho da requisição',
    })
    await userEvent.type(input, '/pedidos')
    await expect(navbar10Handlers.onPathChange).toHaveBeenLastCalledWith(
      '/pedidos',
    )
    await expect(input).toHaveValue('/pedidos')
  },
}

export const EnterInThePathCallsOnSend: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Caminho da requisição',
    })
    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')
    await expect(navbar10Handlers.onSend).toHaveBeenCalledTimes(1)
    await expect(navbar10Handlers.onSend).toHaveBeenCalledWith({
      method: 'GET',
      path: '/modelos/{id}',
    })
  },
}

export const EnviarCallsOnSendWithMethodAndPath: Story = {
  args: { method: 'PATCH', path: '/pedidos/42' },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Enviar' }),
    )
    await expect(navbar10Handlers.onSend).toHaveBeenCalledWith({
      method: 'PATCH',
      path: '/pedidos/42',
    })
  },
}

export const MethodSelectListsTheFiveMethods: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Método HTTP' }),
    ).toHaveTextContent('GET')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Método HTTP' }))
    const options = await screen.findAllByRole('option')
    await expect(options.map((option) => option.textContent)).toEqual([
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const PickingAMethodCallsOnMethodChangeAndSendsIt: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Método HTTP' }))
    await userEvent.click(await screen.findByRole('option', { name: 'POST' }))
    await waitFor(() =>
      expect(navbar10Handlers.onMethodChange).toHaveBeenCalledWith('POST'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar' }))
    await expect(navbar10Handlers.onSend).toHaveBeenCalledWith({
      method: 'POST',
      path: '/modelos/{id}',
    })
  },
}

export const SendingDisablesEnviarAndBlocksEnter: Story = {
  args: { sending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Enviar' })).toBeDisabled()
    await userEvent.click(
      canvas.getByRole('textbox', { name: 'Caminho da requisição' }),
    )
    await userEvent.keyboard('{Enter}')
    await expect(navbar10Handlers.onSend).not.toHaveBeenCalled()
  },
}

export const ServiceSwitcherShowsTheActiveService: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Serviço: Modelos',
    })
    await expect(trigger).toHaveTextContent('Modelos')
  },
}

export const ServiceMenuMarksTheActiveRadio: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Serviço: Modelos' }),
    )
    await expect(await screen.findAllByRole('menuitemradio')).toHaveLength(
      services.length,
    )
    await expect(
      screen.getByRole('menuitemradio', { name: 'Modelos' }),
    ).toBeChecked()
    await expect(
      screen.getByRole('menuitemradio', { name: 'Pagamentos' }),
    ).not.toBeChecked()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const PickingAServiceCallsOnServiceChange: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Serviço: Modelos' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Webhooks' }),
    )
    await expect(navbar10Handlers.onServiceChange).toHaveBeenCalledWith(
      'webhooks',
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      canvas.getByRole('button', { name: 'Serviço: Webhooks' }),
    ).toBeVisible()
  },
}

export const WithoutServicesNoSwitcherRenders: Story = {
  args: { showServices: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: /^Serviço/ })).toBeNull()
    await expect(canvas.queryByRole('separator')).toBeNull()
  },
}

export const WithoutOnSendNoRequestFormRenders: Story = {
  args: { showRequest: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('form')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Enviar' })).toBeNull()
    await expect(canvas.queryByRole('textbox')).toBeNull()
  },
}

export const WithoutUserNoAccountMenuRenders: Story = {
  args: { showUser: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Menu da conta' }),
    ).toBeNull()
  },
}

export const AccountMenuShowsTheUserAndItsItems: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Menu da conta' }),
    )
    await expect(await screen.findByText('Gabriel Melo')).toBeVisible()
    await expect(screen.getByText('gabriel@acme.com.br')).toBeVisible()
    await expect(await screen.findAllByRole('menuitem')).toHaveLength(
      menuActions.length,
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const AccountMenuItemCallsItsHandler: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Menu da conta' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Chaves de API' }),
    )
    await expect(navbar10Handlers.onMenuAction).toHaveBeenCalledWith('keys')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutMenuTheAccountListsOnlyTheUser: Story = {
  args: { showMenu: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Menu da conta' }),
    )
    await expect(await screen.findByText('Gabriel Melo')).toBeVisible()
    await expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const UserInitialsFillTheAvatar: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Menu da conta' }),
    ).toHaveTextContent('GM')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar10
      labels={{
        account: 'Minha conta',
        method: 'Verbo',
        path: 'Rota',
        pathPlaceholder: '/rota',
        request: 'Chamada',
        send: 'Executar',
        serviceTrigger: (name) => `API: ${name}`,
      }}
      method="GET"
      name="Portal Dev"
      onMethodChange={() => undefined}
      onPathChange={() => undefined}
      onSend={() => undefined}
      onServiceChange={() => undefined}
      path=""
      service="models"
      services={services}
      user={user}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('form', { name: 'Chamada' })).toBeVisible()
    await expect(canvas.getByRole('combobox', { name: 'Verbo' })).toBeVisible()
    await expect(canvas.getByRole('textbox', { name: 'Rota' })).toHaveAttribute(
      'placeholder',
      '/rota',
    )
    await expect(canvas.getByRole('button', { name: 'Executar' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'API: Modelos' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Minha conta' }),
    ).toBeVisible()
  },
}
