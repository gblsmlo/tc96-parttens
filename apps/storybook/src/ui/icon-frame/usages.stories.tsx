import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Text } from '@tc96/ui/text'
import {
  BuildingIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  InboxIcon,
  LandmarkIcon,
  PiggyBankIcon,
  WalletIcon,
} from 'lucide-react'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/IconFrame/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const accounts = [
  {
    balance: '$ 12,480.00',
    color: '#2563eb',
    icon: LandmarkIcon,
    name: 'Checking account',
  },
  {
    balance: '$ 48,200.00',
    color: '#16a34a',
    icon: PiggyBankIcon,
    name: 'Reserve fund',
  },
  {
    balance: '$ 1,930.55',
    color: '#9333ea',
    icon: CreditCardIcon,
    name: 'Company card',
  },
  {
    balance: '$ 320.00',
    color: '#f97316',
    icon: WalletIcon,
    name: 'Petty cash',
  },
] as const

export const AccountList: Story = {
  render: () => (
    <ul className="flex w-80 flex-col divide-y rounded-lg border">
      {accounts.map(({ balance, color, icon: Icon, name }) => (
        <li className="flex items-center gap-3 px-3 py-2.5" key={name}>
          <IconFrame color={color} size="sm">
            <Icon />
          </IconFrame>
          <Text className="flex-1" size="sm" weight="medium">
            {name}
          </Text>
          <Text family="mono" foreground="muted" size="xs">
            {balance}
          </Text>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('listitem')
    await expect(rows).toHaveLength(accounts.length)
    await expect(
      within(rows[0] as HTMLElement).getByText('Checking account'),
    ).toBeVisible()
    for (const row of rows) {
      await expect(
        row.querySelector('[data-slot="icon-frame"]'),
      ).toHaveAttribute('aria-hidden', 'true')
    }
  },
}

export const WorkspaceSwitcher: Story = {
  render: () => (
    <button
      aria-label="Switch workspace, current: Northwind, Business plan"
      className="flex w-72 items-center gap-3 rounded-lg border bg-background px-3 py-2 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring"
      type="button"
    >
      <IconFrame shape="rounded" size="lg">
        <BuildingIcon />
      </IconFrame>
      <span aria-hidden="true" className="flex flex-1 flex-col">
        <Text size="sm" weight="medium">
          Northwind
        </Text>
        <Text foreground="muted" size="xs">
          24 members
        </Text>
      </span>
      <Badge aria-hidden="true" variant="outline">
        Business
      </Badge>
      <ChevronsUpDownIcon
        aria-hidden="true"
        className="size-4 text-muted-foreground"
      />
    </button>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Switch workspace, current: Northwind, Business plan',
    })
    await expect(
      button.querySelector('[data-slot="icon-frame"]'),
    ).toHaveAttribute('data-shape', 'rounded')
  },
}

export const EmptyInbox: Story = {
  render: () => (
    <Empty className="w-96">
      <EmptyHeader>
        <EmptyMedia>
          <IconFrame shape="rounded" size="xl">
            <InboxIcon />
          </IconFrame>
        </EmptyMedia>
        <EmptyTitle>Your inbox is empty</EmptyTitle>
        <EmptyDescription>
          New requests from your team land here. Invite someone to start the
          conversation.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Invite a teammate</Button>
      </EmptyContent>
    </Empty>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Your inbox is empty')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Invite a teammate' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="icon-frame"]'),
    ).toHaveAttribute('data-size', 'xl')
  },
}
