import { Text } from '@tc96/elements/text'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { SettingsRowProps } from '../../core'

export function SettingsRow({
  className,
  description,
  endSlot,
  startSlot,
  title,
}: Readonly<SettingsRowProps>): ReactElement {
  return (
    <div
      className={cn('flex items-center gap-3 py-3', className)}
      data-slot="settings-row"
    >
      {startSlot ? (
        <div
          className="flex shrink-0 items-center [&>svg]:size-4"
          data-slot="settings-row-start"
        >
          {startSlot}
        </div>
      ) : null}
      <div className="min-w-0 flex-1" data-slot="settings-row-heading">
        <Text
          render={<p data-slot="settings-row-title">{title}</p>}
          size="sm"
          weight="semibold"
        />
        {description ? (
          <Text
            foreground="muted"
            render={<p data-slot="settings-row-description">{description}</p>}
            size="sm"
          />
        ) : null}
      </div>
      {endSlot ? (
        <div
          className="ms-3 flex shrink-0 items-center gap-2"
          data-slot="settings-row-end"
        >
          {endSlot}
        </div>
      ) : null}
    </div>
  )
}
