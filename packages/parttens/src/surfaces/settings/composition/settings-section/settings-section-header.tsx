import { Text } from '@tc96/elements/text'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type {
  SettingsSectionDescriptionProps,
  SettingsSectionHeaderProps,
  SettingsSectionTitleProps,
} from '../../core'
import { useSettingsSectionTitleId } from './settings-section-context'

export function SettingsSectionHeader({
  actions,
  children,
  className,
}: Readonly<SettingsSectionHeaderProps>): ReactElement {
  return (
    <div
      className={cn('flex items-end justify-between gap-3', className)}
      data-slot="settings-section-header"
    >
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
      {actions ? (
        <div className="shrink-0" data-slot="settings-section-actions">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

export function SettingsSectionTitle({
  children,
  className,
}: Readonly<SettingsSectionTitleProps>): ReactElement {
  const id = useSettingsSectionTitleId()

  return (
    <Text
      className={className}
      render={
        <h2 data-slot="settings-section-title" id={id}>
          {children}
        </h2>
      }
      size="base"
      weight="medium"
    />
  )
}

export function SettingsSectionDescription({
  children,
  className,
}: Readonly<SettingsSectionDescriptionProps>): ReactElement {
  return (
    <Text
      className={className}
      foreground="muted"
      render={<p data-slot="settings-section-description">{children}</p>}
      size="sm"
    />
  )
}
