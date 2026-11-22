import type { Meta, StoryObj } from '@storybook/react-vite'
import { formatAmount } from '@tc96/helpers/format'
import {
  FlagProperty,
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
  StateSurface,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  EllipsisIcon,
  LandmarkIcon,
  type LucideIcon,
  StarIcon,
  WalletIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { expect, fn, within } from 'storybook/test'

type AccountType = 'Bank' | 'Cash'

interface Account {
  name: string
  openingBalance: number
  openingOn: string
  type: AccountType
}

const accountIcons: Record<AccountType, LucideIcon> = {
  Bank: LandmarkIcon,
  Cash: WalletIcon,
}

const accounts: Account[] = [
  {
    name: 'Main account',
    openingBalance: 12500,
    openingOn: '2026-09-03',
    type: 'Bank',
  },
  {
    name: 'Payroll account',
    openingBalance: 0,
    openingOn: '2026-09-03',
    type: 'Bank',
  },
  {
    name: 'Petty cash',
    openingBalance: 350,
    openingOn: '2026-09-10',
    type: 'Cash',
  },
]

const archivedAccounts: Account[] = [
  {
    name: 'Old savings',
    openingBalance: 4200,
    openingOn: '2025-01-02',
    type: 'Bank',
  },
]

const onMakeDefault = fn()

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

function describeAccount({ openingBalance, openingOn, type }: Account) {
  const date = dateFormat.format(new Date(`${openingOn}T00:00:00Z`))
  return `${type} · Opens at ${formatAmount(openingBalance)} on ${date}`
}

function AccountRow({
  account,
  archived,
  isDefault,
  onMakeDefault,
}: {
  account: Account
  archived?: boolean
  isDefault?: boolean
  onMakeDefault?: () => void
}) {
  const { name, type } = account
  const Icon = accountIcons[type]

  return (
    <SettingsRow
      description={describeAccount(account)}
      endSlot={
        <div className="flex items-center gap-3">
          <FlagProperty
            active={Boolean(isDefault)}
            activeIcon={StarIcon}
            label="Default"
          />
          <Menu>
            <MenuTrigger
              aria-label={`Actions for ${name}`}
              render={<Button size="icon-xs" variant="ghost" />}
            >
              <EllipsisIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              {archived ? (
                <MenuItem>Restore</MenuItem>
              ) : (
                <>
                  <MenuItem>Edit</MenuItem>
                  {isDefault ? null : (
                    <>
                      <MenuItem onClick={onMakeDefault}>Make default</MenuItem>
                      <MenuItem variant="destructive">Archive</MenuItem>
                    </>
                  )}
                </>
              )}
            </MenuPopup>
          </Menu>
        </div>
      }
      startSlot={
        <IconFrame shape="rounded">
          <Icon aria-hidden="true" className="size-4" />
        </IconFrame>
      }
      title={name}
    />
  )
}

function AccountsSection({ children }: { children: ReactNode }) {
  return (
    <SettingsSection
      className="mx-auto w-full max-w-2xl"
      header={
        <SettingsSectionHeader actions={<Button size="sm">New account</Button>}>
          <SettingsSectionTitle>Accounts</SettingsSectionTitle>
          <SettingsSectionDescription>
            Banks and cash where entries settle. New entries start on the
            default account.
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {children}
    </SettingsSection>
  )
}

function AccountsDemo() {
  const [defaultName, setDefaultName] = useState(accounts[0]?.name)

  return (
    <AccountsSection>
      {accounts.map((account) => (
        <AccountRow
          account={account}
          isDefault={account.name === defaultName}
          key={account.name}
          onMakeDefault={() => {
            onMakeDefault(account.name)
            setDefaultName(account.name)
          }}
        />
      ))}
      <div>
        <SettingsCollapsed defaultOpen={false} title="Archived">
          {archivedAccounts.map((account) => (
            <AccountRow account={account} archived key={account.name} />
          ))}
        </SettingsCollapsed>
      </div>
    </AccountsSection>
  )
}

const meta = {
  component: SettingsSection,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Accounts: Story = {
  name: 'Accounts',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Accounts' }),
    ).toBeVisible()
    await expect(canvas.getByText('Main account')).toBeVisible()
    await expect(
      canvas.getByText('Bank · Opens at $12,500.00 on Sep 3, 2026'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New account' }),
    ).toBeVisible()
  },
  render: () => <AccountsDemo />,
}

export const AccountsEmpty: Story = {
  name: 'Accounts empty',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-kind',
      'empty',
    )
    await expect(canvas.getByText('No accounts yet')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New account' }),
    ).toBeEnabled()
  },
  render: () => (
    <AccountsSection>
      <StateSurface
        description="Create an account to start recording entries."
        kind="empty"
        title="No accounts yet"
      />
    </AccountsSection>
  ),
}
