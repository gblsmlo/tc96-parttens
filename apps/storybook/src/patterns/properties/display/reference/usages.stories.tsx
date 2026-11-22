import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReferenceProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { ReferenceCanvas } from './reference-canvas.tsx'

const meta = {
  decorators: [ReferenceCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Reference/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DealRelations: Story = {
  render: () => (
    <dl className="grid grid-cols-[8rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Conta</dt>
      <dd>
        <ReferenceProperty ariaLabel="Conta" kind="account" label="Acme Corp" />
      </dd>
      <dt className="text-muted-foreground">Produto</dt>
      <dd>
        <ReferenceProperty
          ariaLabel="Produto"
          kind="product"
          label="Plano Pro anual"
        />
      </dd>
      <dt className="text-muted-foreground">Origem</dt>
      <dd>
        <ReferenceProperty
          ariaLabel="Origem"
          kind="record"
          label="Lead autorizado"
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: 'Conta: Acme Corp' }),
    ).toBeVisible()
  },
}

export const TicketHeader: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <h2 className="font-medium text-base">Falha ao emitir nota fiscal</h2>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <ReferenceProperty
          ariaLabel="Cliente"
          kind="account"
          label="Padaria Bom Dia"
          variant="plain"
        />
        <ReferenceProperty
          ariaLabel="Produto"
          kind="product"
          label="Emissor NF-e"
          variant="plain"
        />
        <ReferenceProperty
          ariaLabel="Chamado relacionado"
          kind="record"
          label="#4821"
          variant="plain"
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Chamado relacionado: #4821',
      }),
    ).toBeVisible()
  },
}
