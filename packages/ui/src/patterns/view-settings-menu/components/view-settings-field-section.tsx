'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { MenuCheckboxItem } from '@tc96/ui/menu'
import type { ReactElement, ReactNode } from 'react'
import { ViewSettingsSection } from './view-settings-menu'

export interface ViewSettingsField {
  icon?: PhosphorIcon
  id: string
  label: string
  typeLabel?: string
  visible: boolean
}

export interface ViewSettingsFieldSectionProps {
  fields: readonly ViewSettingsField[]
  label: ReactNode
  onVisibleChange: (id: string, visible: boolean) => void
}

export function ViewSettingsFieldSection({
  fields,
  label,
  onVisibleChange,
}: Readonly<ViewSettingsFieldSectionProps>): ReactElement | null {
  if (fields.length === 0) return null

  return (
    <ViewSettingsSection
      label={
        <span className="flex justify-between gap-2">
          {label}{' '}
          <span data-slot="view-settings-field-count">{fields.length}</span>
        </span>
      }
    >
      {fields.map(
        ({ icon: Icon, id, label: fieldLabel, typeLabel, visible }) => (
          <MenuCheckboxItem
            checked={visible}
            closeOnClick={false}
            data-field={id}
            key={id}
            onCheckedChange={(checked) => onVisibleChange(id, checked)}
            variant="switch"
          >
            <span className="flex min-w-0 items-center gap-2">
              {Icon ? <Icon aria-hidden="true" /> : null}
              <span className="truncate">{fieldLabel}</span>
              {typeLabel ? (
                <span className="ms-auto shrink-0 text-muted-foreground text-xs">
                  {typeLabel}
                </span>
              ) : null}
            </span>
          </MenuCheckboxItem>
        ),
      )}
    </ViewSettingsSection>
  )
}
