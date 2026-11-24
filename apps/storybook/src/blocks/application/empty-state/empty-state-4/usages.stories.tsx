import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState4 } from '@tc96/blocks/application/empty-state/empty-state-4'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

const InviteFirstTeammate = () => {
  const [copied, setCopied] = useState(false)
  const [invited, setInvited] = useState(false)

  return (
    <div className="grid gap-3">
      <EmptyState4
        copied={copied}
        labels={{
          description:
            'Convide quem trabalha com você no Projeto Aurora para dividir tarefas e prazos.',
          title: 'Projeto Aurora ainda não tem equipe',
        }}
        onCopyLink={() => setCopied(true)}
        onInvite={() => setInvited(true)}
      />
      {invited ? (
        <output className="block text-center text-muted-foreground text-sm">
          Abrindo o convite
        </output>
      ) : null}
    </div>
  )
}

const meta = {
  component: InviteFirstTeammate,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState4/Usages',
} satisfies Meta<typeof InviteFirstTeammate>

export default meta

type Story = StoryObj<typeof meta>

export const InviteFirstMember: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copiar link' }))
    await expect(
      canvas.getByRole('button', { name: 'Link copiado' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Convidar' }))
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Abrindo o convite',
    )
  },
}
