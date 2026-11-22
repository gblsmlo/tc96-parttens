import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagProperty } from '@tc96/parttens'
import {
  BanIcon,
  CircleSlashIcon,
  ClockAlertIcon,
  ScanEyeIcon,
  StarIcon,
} from 'lucide-react'
import { expect, within } from 'storybook/test'
import { FlagCanvas } from './flag-canvas.tsx'

const meta = {
  decorators: [FlagCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Flag/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const accounts = [
  { isDefault: true, name: 'Conta corrente Itaú' },
  { isDefault: false, name: 'Nubank PJ' },
]

export const DefaultAccount: Story = {
  render: () => (
    <ul className="grid w-80 divide-y rounded-lg border text-sm">
      {accounts.map((account) => (
        <li
          className="flex items-center justify-between gap-3 px-3 py-2"
          key={account.name}
        >
          {account.name}
          <FlagProperty
            active={account.isDefault}
            activeIcon={StarIcon}
            label="Padrão"
          />
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByText('Padrão')).toHaveLength(1)
  },
}

export const CampaignPixel: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <FlagProperty
        active
        activeIcon={ScanEyeIcon}
        ariaLabel="Meta Pixel"
        inactiveIcon={CircleSlashIcon}
        inactiveLabel="Sem pixel"
        label="Pixel ativo"
        showInactive
        variant="plain"
      />
      <FlagProperty
        active={false}
        activeIcon={ScanEyeIcon}
        ariaLabel="Meta Pixel"
        inactiveIcon={CircleSlashIcon}
        inactiveLabel="Sem pixel"
        label="Pixel ativo"
        showInactive
        variant="plain"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: 'Meta Pixel: Sem pixel' }),
    ).toBeVisible()
  },
}

export const TaskStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <FlagProperty active activeIcon={ClockAlertIcon} label="Atrasada" />
      <FlagProperty active activeIcon={BanIcon} label="Bloqueada" />
      <FlagProperty active={false} label="Arquivada" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Bloqueada')).toBeVisible()
    await expect(canvas.queryByText('Arquivada')).toBeNull()
  },
}
