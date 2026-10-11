import { Text } from '@tc96/elements/text'
import { cn } from '@tc96/utils'
import { type ReactElement, useId } from 'react'
import type { SettingsSectionProps } from '../../core'

export function SettingsSection({
  children,
  className,
  title,
}: Readonly<SettingsSectionProps>): ReactElement {
  const titleId = `settings-section-title-${useId()}`
  const card = (
    <div
      className="divide-y rounded-lg border bg-card px-4"
      data-slot="settings-section-card"
    >
      {children}
    </div>
  )

  if (!title) {
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
      <Text
        render={
          <h2 data-slot="settings-section-title" id={titleId}>
            {title}
          </h2>
        }
        size="base"
        weight="medium"
      />
      {card}
    </section>
  )
}
