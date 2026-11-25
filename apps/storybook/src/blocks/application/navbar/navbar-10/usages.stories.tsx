import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Navbar10,
  type Navbar10Method,
} from '@tc96/ui/blocks/application/navbar/navbar-10'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { services, user } from '../fixtures/navbar-10.ts'
import { AccountMenu, Logo } from './navbar-10-layouts.tsx'

const endpoints: Record<string, string> = {
  models: '/modelos/{id}',
  payments: '/pagamentos',
  webhooks: '/webhooks/entregas',
}

const ApiPortal = () => {
  const [service, setService] = useState('models')
  const [method, setMethod] = useState<Navbar10Method>('GET')
  const [path, setPath] = useState(endpoints.models)
  const [log, setLog] = useState('Nenhuma requisição enviada.')

  return (
    <div className="min-h-64">
      <Navbar10
        logo={<Logo />}
        menu={
          <AccountMenu onAction={(id) => setLog(`Ação da conta: ${id}.`)} />
        }
        method={method}
        name="Portal Dev"
        onMethodChange={setMethod}
        onPathChange={setPath}
        onSend={(request) =>
          setLog(`Enviada: ${request.method} ${request.path}`)
        }
        onServiceChange={(id) => {
          setService(id)
          setPath(endpoints[id])
          setLog('Nenhuma requisição enviada.')
        }}
        path={path}
        service={service}
        services={services}
        user={user}
      />
      <main className="p-6 font-mono text-muted-foreground text-sm">
        <output>{log}</output>
      </main>
    </div>
  )
}

const meta = {
  component: ApiPortal,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar10/Usages',
} satisfies Meta<typeof ApiPortal>

export default meta

type Story = StoryObj<typeof meta>

export const SendingARequestFromThePortal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Método HTTP' }))
    await userEvent.click(await screen.findByRole('option', { name: 'DELETE' }))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    const input = canvas.getByRole('textbox', { name: 'Caminho da requisição' })
    await userEvent.clear(input)
    await userEvent.type(input, '/modelos/7{Enter}')
    await expect(canvas.getByText('Enviada: DELETE /modelos/7')).toBeVisible()
  },
}

export const SwitchingTheServiceChangesTheEndpoint: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Serviço: Modelos' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Pagamentos' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      canvas.getByRole('textbox', { name: 'Caminho da requisição' }),
    ).toHaveValue('/pagamentos')
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar' }))
    await expect(canvas.getByText('Enviada: GET /pagamentos')).toBeVisible()
  },
}
