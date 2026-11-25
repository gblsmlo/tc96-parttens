import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar8 } from '@tc96/ui/blocks/application/navbar/navbar-8'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  agents,
  categories,
  notifications as initialNotifications,
  user,
} from '../fixtures/navbar-8.ts'
import { BrandMark, UserMenuItems } from './navbar-8-layouts.tsx'

const Marketplace = () => {
  const [category, setCategory] = useState('all')
  const [notifications, setNotifications] = useState(
    initialNotifications.map((item, index) => ({
      ...item,
      read: index >= 2,
    })),
  )
  const [message, setMessage] = useState('Escolha um agente para implantar.')
  const visible = agents.filter(
    (agent) => category === 'all' || agent.category === category,
  )

  return (
    <div className="min-h-80">
      <Navbar8
        categories={categories}
        category={category}
        logo={<BrandMark />}
        menu={<UserMenuItems onSelect={(id) => setMessage(`Ação: ${id}.`)} />}
        name="Orbit Agentes"
        notifications={notifications}
        onCategoryChange={setCategory}
        onDeploy={() => setMessage('Implantação iniciada.')}
        onNotificationSelect={(id) =>
          setNotifications((current) =>
            current.map((item) =>
              item.id === id ? { ...item, read: true } : item,
            ),
          )
        }
        user={user}
      />
      <main className="flex flex-col gap-4 p-6">
        <p className="text-muted-foreground text-sm">{message}</p>
        <ul aria-label="Agentes" className="flex flex-col gap-2 text-sm">
          {visible.map((agent) => (
            <li key={agent.id}>{agent.name}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}

const meta = {
  component: Marketplace,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar8/Usages',
} satisfies Meta<typeof Marketplace>

export default meta

type Story = StoryObj<typeof meta>

export const FilteringTheCatalog: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5)
    await userEvent.click(canvas.getByRole('radio', { name: 'Dados' }))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
    await expect(canvas.getByText('Analista de dados')).toBeVisible()
    await expect(canvas.queryByText('Revisor de PRs')).toBeNull()
  },
}

export const DeployingAnAgent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Implantar' }))
    await expect(canvas.getByText('Implantação iniciada.')).toBeVisible()
  },
}

export const ReadingNotifications: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Notificações, 2 não lidas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: /Implantação concluída/ }),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Notificações, 1 não lida' }),
      ).toBeVisible(),
    )
  },
}
