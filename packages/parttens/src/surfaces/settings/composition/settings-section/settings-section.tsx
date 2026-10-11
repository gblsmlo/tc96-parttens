import { Card } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import { type ReactElement, useId } from 'react'
import type { SettingsSectionProps } from '../../core'
import { SettingsSectionTitleIdContext } from './settings-section-context'

export function SettingsSection({
  children,
  className,
  header,
}: Readonly<SettingsSectionProps>): ReactElement {
  const titleId = `settings-section-title-${useId()}`
  const card = (
    <Card>
      <div className="divide-y px-6" data-slot="settings-section-rows">
        {children}
      </div>
    </Card>
  )

  if (!header) {
    return (
      <div className={className} data-slot="settings-section">
        {card}
      </div>
    )
  }

  return (
    <section
      aria-labelledby={titleId}
      className={cn('flex flex-col gap-2', className)}
      data-slot="settings-section"
    >
      <SettingsSectionTitleIdContext.Provider value={titleId}>
        {header}
      </SettingsSectionTitleIdContext.Provider>
      {card}
    </section>
  )
}
