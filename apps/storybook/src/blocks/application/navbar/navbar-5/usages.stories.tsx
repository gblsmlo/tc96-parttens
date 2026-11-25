import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Navbar5,
  type Navbar5Status,
} from '@tc96/ui/blocks/application/navbar/navbar-5'
import { useState } from 'react'
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

export const PublishingAPage: Story = {}

export const UnpublishingFromTheMenu: Story = {}
