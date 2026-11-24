import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Navbar5,
  type Navbar5Status,
} from '@tc96/blocks/application/navbar/navbar-5'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { actions, breadcrumb, people } from '../fixtures/navbar-5.ts'

const PageEditor = () => {
  const [status, setStatus] = useState<Navbar5Status>('changed')
  const [message, setMessage] = useState(
    'Revise as alterações antes de publicar.',
  )

  return (
    <div className="min-h-64">
      <Navbar5
        actions={actions}
        breadcrumb={breadcrumb}
        onPublish={() => {
          setStatus('published')
          setMessage('Página publicada.')
        }}
        onPublishAction={(id) => {
          if (id === 'unpublish') {
            setStatus('draft')
            setMessage('Página despublicada.')
          }
        }}
        people={people}
        status={status}
      />
      <main className="p-6 text-muted-foreground text-sm">{message}</main>
    </div>
  )
}

const meta = {
  component: PageEditor,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar5/Usages',
} satisfies Meta<typeof PageEditor>

export default meta

type Story = StoryObj<typeof meta>

export const PublishingAPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Alterações não publicadas')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Publicar' }))
    await expect(canvas.getByText('Publicado')).toBeVisible()
    await expect(canvas.getByText('Página publicada.')).toBeVisible()
  },
}

export const UnpublishingFromTheMenu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mais opções de publicação' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Despublicar' }),
    )
    await expect(canvas.getByText('Rascunho')).toBeVisible()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
