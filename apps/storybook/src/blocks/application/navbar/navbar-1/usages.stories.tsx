import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar1 } from '@tc96/blocks/application/navbar/navbar-1'
import { Text } from '@tc96/ui/text'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { breadcrumbs, collaborators, tabs } from '../fixtures/navbar-1.ts'

const sections: Record<string, string> = {
  activity: 'Maria Souza moveu "Revisar textos da loja" para Concluído.',
  files:
    '12 arquivos, entre briefings, wireframes e a versão final do logotipo.',
  overview:
    'A entrega está prevista para 12 de dezembro, com 18 de 24 tarefas concluídas.',
  tasks: '6 tarefas abertas, 2 delas com prazo para esta semana.',
}

const ProjectWorkspace = () => {
  const [tab, setTab] = useState('overview')

  return (
    <div className="flex min-h-96 flex-col">
      <Navbar1
        breadcrumbs={breadcrumbs}
        collaborators={collaborators}
        onShare={() => {}}
        onTabChange={setTab}
        tab={tab}
        tabs={tabs}
      />
      <main className="p-6">
        <Text>{sections[tab]}</Text>
      </main>
    </div>
  )
}

const meta = {
  component: ProjectWorkspace,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar1/Usages',
} satisfies Meta<typeof ProjectWorkspace>

export default meta

type Story = StoryObj<typeof meta>

export const SwitchingSectionsOfAProject: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/18 de 24 tarefas/)).toBeVisible()
    await userEvent.click(canvas.getByRole('tab', { name: 'Tarefas' }))
    await expect(canvas.getByText(/6 tarefas abertas/)).toBeVisible()
  },
}
