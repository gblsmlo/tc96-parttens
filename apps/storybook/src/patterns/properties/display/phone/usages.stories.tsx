import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { PhoneCanvas } from './phone-canvas.tsx'
import { PrimaryNumberPhone, StatefulPhone } from './phone-layouts.tsx'

const meta = {
  decorators: [PhoneCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ContactPhones: Story = {
  render: () => (
    <dl className="grid w-full grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Nome</dt>
      <dd>Ana Souza</dd>
      <dt className="text-muted-foreground">Telefones</dt>
      <dd>
        <StatefulPhone
          ariaLabel="Telefones de Ana Souza"
          entryLabels={['Celular', 'Trabalho']}
          initialValue={['+5511987654321', '+551133224455']}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', {
        name: 'Telefones de Ana Souza',
      }),
    ).toBeVisible()
  },
}

export const ContactsTable: Story = {
  render: () => (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-start text-muted-foreground">
          <th className="py-2 pe-4 text-start font-normal">Contato</th>
          <th className="py-2 text-start font-normal">Telefones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 pe-4">Bruno Lima</td>
          <td className="py-2">
            <StatefulPhone
              ariaLabel="Telefones de Bruno Lima"
              display="trigger"
              initialValue={['+5521998765432', '+5521912345678']}
              variant="badge"
            />
          </td>
        </tr>
        <tr>
          <td className="py-2 pe-4">Carla Mendes</td>
          <td className="py-2">
            <StatefulPhone
              ariaLabel="Telefones de Carla Mendes"
              display="trigger"
              initialValue={[]}
              variant="badge"
            />
          </td>
        </tr>
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Telefones de Bruno Lima: +55 21 99876 5432 +1',
      }),
    ).toBeVisible()
  },
}

export const SinglePrimaryNumber: Story = {
  render: () => <PrimaryNumberPhone initialValue={['+5511987654321']} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Adicionar telefone principal' }),
    ).toBeNull()
    await expect(
      canvas.getByRole('button', {
        name: 'Remover telefone +55 11 98765 4321',
      }),
    ).toBeVisible()
  },
}

export const CompanyPhones: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm">
      <span className="font-medium">Padaria Bom Dia</span>
      <PhoneProperty
        ariaLabel="Telefones da empresa"
        value={['+551132104455', '+5511940028922']}
        variant="badge"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', {
        name: 'Telefones da empresa',
      }),
    ).toBeVisible()
  },
}
