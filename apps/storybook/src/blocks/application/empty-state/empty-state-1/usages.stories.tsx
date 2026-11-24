import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState1 } from '@tc96/ui/blocks/application/empty-state/empty-state-1'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { guides } from '../fixtures/empty-state-1.ts'

const CustomersImport = () => {
  const [started, setStarted] = useState<'import' | 'create' | null>(null)

  if (started)
    return (
      <output className="text-sm">
        {started === 'import'
          ? 'Escolha a planilha de clientes para importar.'
          : 'Preencha os dados do primeiro cliente.'}
      </output>
    )

  return (
    <EmptyState1
      guides={guides}
      labels={{
        description:
          'Importe sua carteira de uma planilha ou cadastre o primeiro cliente à mão.',
        title: 'Você ainda não tem clientes',
      }}
      onCreate={() => setStarted('create')}
      onImport={() => setStarted('import')}
    />
  )
}

const meta = {
  component: CustomersImport,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState1/Usages',
} satisfies Meta<typeof CustomersImport>

export default meta

type Story = StoryObj<typeof meta>

export const Customers: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Você ainda não tem clientes')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Importar' }))
    await expect(
      await canvas.findByText('Escolha a planilha de clientes para importar.'),
    ).toBeVisible()
  },
}

export const CustomersWithoutGuides: Story = {
  render: () => (
    <EmptyState1
      labels={{
        description: 'Cadastre o primeiro cliente para começar.',
        title: 'Você ainda não tem clientes',
      }}
      onCreate={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Criar manualmente' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('navigation')).toBeNull()
  },
}
