import {
  ClockCountdownIcon,
  ProhibitIcon,
  ScanIcon,
  StarIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagProperty } from '@tc96/ui/patterns'
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
  parameters: {
    docs: {
      description: {
        story:
          'The default account in a list of bank accounts, on the [Default](?path=/story/patterns-properties-display-flag-layouts--default) layout: only the account that is the default shows the flag.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Whether a campaign has its pixel installed, on the [Default](?path=/story/patterns-properties-display-flag-layouts--default) layout with `plain` surfaces and `showInactive`, so both states have a word of their own.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <FlagProperty
        active
        activeIcon={ScanIcon}
        ariaLabel="Meta Pixel"
        inactiveIcon={ProhibitIcon}
        inactiveLabel="Sem pixel"
        label="Pixel ativo"
        showInactive
        variant="plain"
      />
      <FlagProperty
        active={false}
        activeIcon={ScanIcon}
        ariaLabel="Meta Pixel"
        inactiveIcon={ProhibitIcon}
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
  parameters: {
    docs: {
      description: {
        story:
          'The states of a task, on the [Default](?path=/story/patterns-properties-display-flag-layouts--default) layout: an inactive flag without `showInactive` renders nothing, so Arquivada does not show.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <FlagProperty active activeIcon={ClockCountdownIcon} label="Atrasada" />
      <FlagProperty active activeIcon={ProhibitIcon} label="Bloqueada" />
      <FlagProperty active={false} label="Arquivada" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Bloqueada')).toBeVisible()
    await expect(canvas.queryByText('Arquivada')).toBeNull()
  },
}
