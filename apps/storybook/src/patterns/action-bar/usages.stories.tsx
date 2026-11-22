import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionBar } from '@tc96/parttens'
import {
  ArchiveIcon,
  FileTextIcon,
  MailIcon,
  MailOpenIcon,
  PrinterIcon,
  ShieldIcon,
  Trash2Icon,
  UserMinusIcon,
  XCircleIcon,
} from 'lucide-react'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/ActionBar/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const clearSelection = () => {}

const selectedMembers = [
  { email: 'ana.souza@vendas.com.br', id: 'usr-31' },
  { email: 'bruno.lima@vendas.com.br', id: 'usr-44' },
]

const selectedMessages = [
  { id: 'msg-2041', subject: 'Proposta comercial revisada' },
  { id: 'msg-2043', subject: 'Nota fiscal de outubro' },
  { id: 'msg-2050', subject: 'Agenda da reunião de quinta' },
]

const selectedOrders = [
  { id: 'PED-8812', status: 'pago' },
  { id: 'PED-8815', status: 'pago' },
  { id: 'PED-8819', status: 'aguardando pagamento' },
  { id: 'PED-8820', status: 'pago' },
  { id: 'PED-8823', status: 'pago' },
]

export const TeamMembers: Story = {
  render: () => (
    <ActionBar
      actions={[
        {
          items: [
            {
              icon: <MailIcon />,
              label: 'Reenviar convite',
              variant: 'primary',
            },
            {
              icon: <ShieldIcon />,
              label: 'Alterar papel',
              submenu: [
                {
                  items: [
                    { label: 'Administrador' },
                    { label: 'Editor' },
                    { label: 'Leitor' },
                  ],
                  label: 'Papel no workspace',
                },
              ],
            },
          ],
        },
        {
          items: [
            {
              icon: <UserMinusIcon />,
              label: 'Remover do time',
              variant: 'destructive',
            },
          ],
        },
      ]}
      onClearSelection={clearSelection}
      selectedCount={selectedMembers.length}
      selectedRows={selectedMembers}
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar')
    await expect(within(toolbar).getByText('2 selecionados')).toBeVisible()
    await expect(
      within(toolbar).getByRole('button', { name: 'Alterar papel' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
  },
}

export const InboxMessages: Story = {
  render: () => (
    <ActionBar
      actions={[
        {
          items: [
            {
              icon: <MailOpenIcon />,
              label: 'Marcar como lida',
              shortcut: 'I',
            },
            { icon: <ArchiveIcon />, label: 'Arquivar', shortcut: 'E' },
          ],
        },
        {
          items: [
            {
              label: 'Mover para…',
              submenu: [
                {
                  items: [
                    { label: 'Clientes' },
                    { label: 'Financeiro' },
                    { label: 'Fornecedores' },
                  ],
                  label: 'Pastas',
                },
              ],
            },
            {
              icon: <Trash2Icon />,
              label: 'Excluir',
              shortcut: '#',
              variant: 'destructive',
            },
          ],
        },
      ]}
      onClearSelection={clearSelection}
      selectedCount={selectedMessages.length}
      selectedRows={selectedMessages}
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar')
    await expect(within(toolbar).getByText('3 selecionados')).toBeVisible()
    await expect(
      within(toolbar).getByRole('button', { name: 'Excluir' }),
    ).toBeVisible()
  },
}

export const OrdersAwaitingPayment: Story = {
  render: () => (
    <ActionBar
      actions={[
        {
          items: [
            {
              disabled: selectedOrders.some((order) => order.status !== 'pago'),
              icon: <FileTextIcon />,
              label: 'Emitir notas fiscais',
              variant: 'primary',
            },
            { icon: <PrinterIcon />, label: 'Imprimir etiquetas' },
          ],
        },
        {
          items: [
            {
              icon: <XCircleIcon />,
              label: 'Cancelar pedidos',
              variant: 'destructive',
            },
          ],
        },
      ]}
      onClearSelection={clearSelection}
      selectedCount={selectedOrders.length}
      selectedRows={selectedOrders}
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar')
    await expect(within(toolbar).getByText('5 selecionados')).toBeVisible()
    await expect(
      within(toolbar).getByRole('button', { name: 'Emitir notas fiscais' }),
    ).toBeDisabled()
  },
}
