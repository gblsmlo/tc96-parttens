'use client'

import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { CalendarDaysIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'

export type DatePropertyDropdownPlacement = Pick<
  React.ComponentProps<typeof PopoverPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>

export interface DatePropertyActionContext {
  date: Date | null
  previousValue: string | null
}

export interface DatePropertyProps {
  value: string | null
  action?: (value: string | null, context: DatePropertyActionContext) => void
  allowClear?: boolean
  ariaLabel?: string
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    'defaultMonth' | 'mode' | 'onSelect' | 'selected'
  >
  className?: string
  clearLabel?: string
  fallback?: string
  disabled?: boolean
  displayLabel?: string
  dropdownPlacement?: DatePropertyDropdownPlacement
  isOverdue?: boolean
  locale?: string
  readOnly?: boolean
  serializeDate?: (date: Date) => string
  timeZone?: string
  variant?: PropertyVariant
  onValueChange?: (value: string | null) => void
}

export function DateProperty({
  action,
  allowClear = true,
  ariaLabel,
  calendarProps,
  className,
  clearLabel = 'Limpar data',
  disabled = false,
  displayLabel,
  dropdownPlacement,
  fallback = 'Sem data',
  isOverdue = false,
  locale = 'en-US',
  onValueChange,
  readOnly = false,
  serializeDate = serializeDatePropertyValue,
  timeZone = 'UTC',
  value,
  variant = 'badge',
}: Readonly<DatePropertyProps>) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseDatePropertyValue(value)
  const accessibleLabel = ariaLabel ?? 'Date'
  const canUpdate = Boolean(action ?? onValueChange)

  const handleChange = (nextValue: string | null, date: Date | null) => {
    if (nextValue === value) {
      setOpen(false)
      return
    }

    if (action) {
      action(nextValue, {
        date,
        previousValue: value,
      })
    } else {
      onValueChange?.(nextValue)
    }
    setOpen(false)
  }

  if (readOnly || !canUpdate) {
    return (
      <DatePropertyBadge
        className={className}
        displayLabel={displayLabel}
        fallback={fallback}
        isOverdue={isOverdue}
        locale={locale}
        timeZone={timeZone}
        value={value}
        variant={variant}
      />
    )
  }

  const label =
    displayLabel ?? formatDateProperty(value, fallback, locale, timeZone)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        aria-label={`${accessibleLabel}: ${label}`}
        disabled={disabled}
        render={
          <PropertySurface
            className={cn(
              'max-w-full',
              isOverdue ? 'font-medium' : undefined,
              className,
            )}
            muted={!value}
            render={<button type="button" />}
            variant={variant}
          />
        }
      >
        <DatePropertyContent label={label} />
      </PopoverTrigger>
      <PopoverPopup
        align="start"
        aria-label={accessibleLabel}
        className="w-auto"
        side="bottom"
        {...dropdownPlacement}
      >
        <Calendar
          defaultMonth={selectedDate ?? undefined}
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={(date) => {
            if (!date) return
            handleChange(serializeDate(date), date)
          }}
          {...calendarProps}
        />
        {allowClear ? (
          <div className="border-t p-2">
            <Button
              className="w-full justify-start"
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => handleChange(null, null)}
            >
              {clearLabel}
            </Button>
          </div>
        ) : null}
      </PopoverPopup>
    </Popover>
  )
}

export function DatePropertyBadge({
  className,
  displayLabel,
  fallback = 'Sem data',
  isOverdue = false,
  locale = 'en-US',
  timeZone = 'UTC',
  value,
  variant = 'badge',
}: Readonly<
  Pick<
    DatePropertyProps,
    | 'className'
    | 'displayLabel'
    | 'fallback'
    | 'isOverdue'
    | 'locale'
    | 'timeZone'
    | 'value'
    | 'variant'
  >
>) {
  const label =
    displayLabel ?? formatDateProperty(value, fallback, locale, timeZone)

  return (
    <PropertySurface
      className={cn(
        'max-w-full',
        isOverdue ? 'font-medium' : undefined,
        className,
      )}
      muted={!value}
      variant={variant}
    >
      <DatePropertyContent label={label} />
    </PropertySurface>
  )
}

function DatePropertyContent({ label }: Readonly<{ label: string }>) {
  return (
    <>
      <CalendarDaysIcon aria-hidden className="size-3" />
      <span className="truncate">{label}</span>
    </>
  )
}

export function formatDateProperty(
  value: string | null,
  fallback: string,
  locale: string,
  timeZone: string,
): string {
  const date = parseDatePropertyValue(value)
  if (!date) return fallback
  // Sem ano: numa propriedade a data é referência curta, e o ano ocupa metade da
  // pílula para dizer o que quase sempre já se sabe.
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone,
  }).format(date)
}

export function parseDatePropertyValue(value: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function serializeDatePropertyValue(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12),
  ).toISOString()
}
