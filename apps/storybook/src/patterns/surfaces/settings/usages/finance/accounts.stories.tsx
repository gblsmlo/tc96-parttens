import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
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
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  EllipsisIcon,
  LandmarkIcon,
  type LucideIcon,
  StarIcon,
  WalletIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

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
  title: 'Patterns/Surfaces/Settings/Usages/Finance/Accounts',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Accounts: Story = {
  name: 'Accounts',
  render: () => <AccountsDemo />,
}

export const Empty: Story = {
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

export const Interaction: Story = {
  ...Accounts,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Accounts' }),
    ).toBeVisible()
    const newAccount = canvas.getByRole('button', { name: 'New account' })
    expect(newAccount).toBeEnabled()
    expect(newAccount.closest('[data-slot="card"]')).toBeNull()

    for (const account of accounts) {
      expect(canvas.getByText(account.name)).toBeVisible()
      expect(canvas.getByText(describeAccount(account))).toBeVisible()
    }
    expect(
      canvas.getByText('Bank · Opens at $12,500.00 on Sep 3, 2026'),
    ).toBeVisible()

    const rowOf = (name: string) =>
      canvas
        .getByText(name)
        .closest('[data-slot="settings-row"]') as HTMLElement
    expect(within(rowOf('Main account')).getByText('Default')).toBeVisible()
    expect(canvas.getAllByText('Default')).toHaveLength(1)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Main account' }),
    )
    expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeVisible()
    expect(body.queryByRole('menuitem', { name: 'Make default' })).toBeNull()
    expect(body.queryByRole('menuitem', { name: 'Archive' })).toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Petty cash' }),
    )
    const makeDefault = await body.findByRole('menuitem', {
      name: 'Make default',
    })
    expect(body.getByRole('menuitem', { name: 'Archive' })).toBeVisible()
    await userEvent.click(makeDefault)
    expect(onMakeDefault).toHaveBeenCalledWith('Petty cash')
    await waitFor(() =>
      expect(within(rowOf('Petty cash')).getByText('Default')).toBeVisible(),
    )
    expect(canvas.getAllByText('Default')).toHaveLength(1)

    const archived = canvas.getByRole('region', { name: 'Archived' })
    const trigger = within(archived).getByRole('button', { name: 'Archived' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(within(archived).getByText('Old savings')).toBeVisible(),
    )
    await userEvent.click(
      within(archived).getByRole('button', {
        name: 'Actions for Old savings',
      }),
    )
    expect(await body.findByRole('menuitem', { name: 'Restore' })).toBeVisible()
    expect(body.queryByRole('menuitem', { name: 'Make default' })).toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())
  },
  tags: interaction,
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('status')).toHaveAttribute('data-kind', 'empty')
    expect(within(canvas.getByRole('status')).queryByRole('button')).toBeNull()
    expect(canvas.getByText('No accounts yet')).toBeVisible()
    expect(canvas.getByRole('button', { name: 'New account' })).toBeEnabled()
    expect(canvas.queryByRole('button', { name: /^Actions for / })).toBeNull()
  },
  tags: interaction,
}
