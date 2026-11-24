import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { EmailCanvas } from './email-canvas.tsx'
import { StatefulEmail } from './email-layouts.tsx'

const meta = {
  decorators: [EmailCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Email/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ContactEmails: Story = {
  render: () => (
    <dl className="grid w-full grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Nome</dt>
      <dd>Ana Souza</dd>
      <dt className="text-muted-foreground">E-mails</dt>
      <dd>
        <StatefulEmail
          ariaLabel="E-mails de Ana Souza"
          entryLabels={['Trabalho', 'Pessoal', 'Outro']}
          initialValue={['ana.souza@acme.com.br', 'ana.souza@gmail.com']}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', {
        name: 'E-mails de Ana Souza',
      }),
    ).toBeVisible()
  },
}

export const LeadInlineEmail: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">E-mail do lead</span>
      <StatefulEmail
        ariaLabel="E-mail do lead"
        editing="inline"
        initialValue={[]}
        placeholder="Sem e-mail"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeVisible()
  },
}

export const BillingSummary: Story = {
  render: () => (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
      <span className="font-medium">Acme Ltda.</span>
      <StatefulEmail
        ariaLabel="E-mails de cobrança"
        display="trigger"
        initialValue={['financeiro@acme.com.br', 'contas@acme.com.br']}
        variant="plain"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'E-mails de cobrança: financeiro@acme.com.br +1',
      }),
    ).toBeVisible()
  },
}

export const ArchivedContact: Story = {
  render: () => (
    <EmailProperty
      ariaLabel="E-mails"
      readOnly
      value={['bruno.lima@example.com', 'bruno@lima.dev']}
      variant="badge"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('bruno@lima.dev'),
    ).toBeVisible()
  },
}
