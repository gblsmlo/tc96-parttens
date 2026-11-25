import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar9 } from '@tc96/ui/blocks/application/navbar/navbar-9'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { branches, path } from '../fixtures/navbar-9.ts'

const RepositoryPage = () => {
  const [branch, setBranch] = useState('main')
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('Nenhuma execução nesta branch.')
  const current = branches.find((item) => item.id === branch)

  return (
    <div className="min-h-64">
      <Navbar9
        branch={branch}
        branches={branches}
        name="Código Vivo"
        onBranchChange={(id) => {
          setBranch(id)
          setMessage('Nenhuma execução nesta branch.')
        }}
        onRun={() => {
          setRunning(true)
          setMessage(`Executando ${current?.label}…`)
        }}
        onShare={() => setMessage('Link do repositório copiado.')}
        path={path}
        running={running}
      />
      <main className="p-6 text-muted-foreground text-sm">{message}</main>
    </div>
  )
}

const meta = {
  component: RepositoryPage,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar9/Usages',
} satisfies Meta<typeof RepositoryPage>

export default meta

type Story = StoryObj<typeof meta>

export const SwitchingBranchAndRunning: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Trocar de branch, atual: main' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: /v1\.4\.0/ }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      canvas.getByRole('button', { name: 'Trocar de branch, atual: v1.4.0' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Executar' }))
    await expect(canvas.getByText('Executando v1.4.0…')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Executando…' }),
    ).toBeDisabled()
  },
}

export const SharingTheRepository: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Compartilhar' }))
    await expect(canvas.getByText('Link do repositório copiado.')).toBeVisible()
  },
}
