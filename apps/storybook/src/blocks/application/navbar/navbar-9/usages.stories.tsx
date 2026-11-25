import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar9 } from '@tc96/ui/blocks/application/navbar/navbar-9'
import { useState } from 'react'
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

export const SwitchingBranchAndRunning: Story = {}

export const SharingTheRepository: Story = {}
