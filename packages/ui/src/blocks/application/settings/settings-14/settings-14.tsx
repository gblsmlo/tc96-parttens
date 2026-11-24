import { BankIcon, StarIcon, WalletIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { formatMediumDate } from '@tc96/ui/helpers/date'
import { formatAmount } from '@tc96/ui/helpers/format'
import { IconFrame } from '@tc96/ui/icon-frame'
import { FlagProperty } from '@tc96/ui/patterns/properties/display/flag/flag-property'
import { SettingsCollapsed } from '@tc96/ui/patterns/surfaces/settings/composition/settings-collapsed/settings-collapsed'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../shared/settings-load-state'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { defaultSettings14Labels } from './labels'
import { Settings14Skeleton } from './settings-14-skeleton'
import type {
  Settings14Account,
  Settings14AccountType,
  Settings14Action,
  Settings14Labels,
  Settings14Props,
} from './types'

const accountIcons = {
  bank: BankIcon,
  cash: WalletIcon,
} satisfies Record<Settings14AccountType, typeof BankIcon>

interface AccountRowProps {
  account: Settings14Account
  archived?: boolean
  currency: string
  isDefault?: boolean
  labels: Settings14Labels
  locale: string
  onAccountAction?: Settings14Props['onAccountAction']
}

function AccountRow({
  account,
  archived,
  currency,
  isDefault,
  labels,
  locale,
  onAccountAction,
}: Readonly<AccountRowProps>) {
  const AccountIcon = accountIcons[account.type]
  const actions = archived
    ? [{ id: 'restore', label: labels.restore }]
    : [
        { id: 'edit', label: labels.edit },
        ...(isDefault
          ? []
          : [
              { id: 'make-default', label: labels.makeDefault },
              { destructive: true, id: 'archive', label: labels.archive },
            ]),
      ]

  return (
    <SettingsRow
      description={labels.opening(
        labels.accountType(account.type),
        formatAmount(account.openingBalance, { currency, locale }),
        formatMediumDate(
          new Date(`${account.openingOn}T00:00:00Z`),
          locale,
          'UTC',
        ),
      )}
      endSlot={
        <div className="flex items-center gap-3">
          <FlagProperty
            active={Boolean(isDefault)}
            activeIcon={StarIcon}
            label={labels.default}
          />
          {onAccountAction ? (
            <SettingsRowActions
              actions={actions}
              label={labels.actions(account.name)}
              onAction={(action) =>
                onAccountAction(account.id, action as Settings14Action)
              }
            />
          ) : null}
        </div>
      }
      startSlot={
        <IconFrame shape="rounded">
          <AccountIcon aria-hidden="true" className="size-4" />
        </IconFrame>
      }
      title={account.name}
    />
  )
}

export function Settings14({
  error,
  onRetry,
  pending,
  accounts,
  archivedAccounts = [],
  className,
  currency = 'BRL',
  defaultAccountId,
  labels: labelsProp,
  locale = 'pt-BR',
  onAccountAction,
  onCreate,
}: Readonly<Settings14Props>) {
  const labels = { ...defaultSettings14Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings14Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onCreate ? (
              <Button onClick={onCreate} size="sm">
                {labels.newAccount}
              </Button>
            ) : undefined
          }
        >
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {loadState ?? (
        <>
          {accounts.length === 0 ? (
            <StateSurface
              description={labels.emptyDescription}
              kind="empty"
              title={labels.emptyTitle}
            />
          ) : (
            accounts.map((account) => (
              <AccountRow
                account={account}
                currency={currency}
                isDefault={account.id === defaultAccountId}
                key={account.id}
                labels={labels}
                locale={locale}
                onAccountAction={onAccountAction}
              />
            ))
          )}
          {archivedAccounts.length > 0 ? (
            <div>
              <SettingsCollapsed defaultOpen={false} title={labels.archived}>
                {archivedAccounts.map((account) => (
                  <AccountRow
                    account={account}
                    archived
                    currency={currency}
                    key={account.id}
                    labels={labels}
                    locale={locale}
                    onAccountAction={onAccountAction}
                  />
                ))}
              </SettingsCollapsed>
            </div>
          ) : null}
        </>
      )}
    </SettingsSection>
  )
}
