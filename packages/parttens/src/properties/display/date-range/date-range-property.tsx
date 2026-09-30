'use client'

import { Button } from '@tc96/ui/compat/collection-views/button'
import { Calendar } from '@tc96/ui/calendar'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { CalendarRangeIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import type { DatePropertyDropdownPlacement } from '../date/date-property'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'

export type { DateRange }

export interface DateRangePropertyProps {
  /** A faixa no tipo do próprio calendário; `undefined` é ausência de escolha. */
  value: DateRange | undefined
  allowClear?: boolean
  ariaLabel?: string
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    'defaultMonth' | 'mode' | 'onSelect' | 'selected'
  >
  className?: string
  clearLabel?: string
  disabled?: boolean
  dropdownPlacement?: DatePropertyDropdownPlacement
  /** Rótulo quando nenhuma das duas pontas foi escolhida. */
  fallback?: string
  locale?: string
  /** Meses lado a lado; dois é o que deixa uma faixa curta caber sem navegar. */
  numberOfMonths?: number
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: DateRange | undefined) => void
}

/**
 * Uma faixa é uma propriedade só, não duas datas lado a lado: início sem fim e
 * fim sem início são estados da mesma coisa, e separá-los faz a fileira mostrar
 * duas pílulas vazias onde não há período nenhum.
 *
 * O valor é o `DateRange` do próprio calendário — quem persiste string converte
 * na borda, como o resto do domínio já faz com data.
 */
export function DateRangeProperty({
  allowClear = true,
  ariaLabel,
  calendarProps,
  className,
  clearLabel = 'Limpar período',
  disabled = false,
  dropdownPlacement,
  fallback = 'Sem período',
  locale = 'en-US',
  numberOfMonths = 2,
  onValueChange,
  readOnly = false,
  value,
  variant = 'badge',
}: Readonly<DateRangePropertyProps>) {
  const [open, setOpen] = useState(false)
  const label = formatDateRangeProperty(value, fallback, locale)
  const isEmpty = label === fallback

  if (readOnly || !onValueChange) {
    return (
      <PropertySurface
        className={cn('max-w-full', className)}
        muted={isEmpty}
        variant={variant}
      >
        <DateRangePropertyContent label={label} />
      </PropertySurface>
    )
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        aria-label={`${ariaLabel ?? 'Period'}: ${label}`}
        disabled={disabled}
        render={
          <PropertySurface
            className={cn('max-w-full', className)}
            muted={isEmpty}
            render={<button type="button" />}
            variant={variant}
          />
        }
      >
        <DateRangePropertyContent label={label} />
      </PopoverTrigger>
      <PopoverPopup
        align="start"
        className="w-auto"
        side="bottom"
        {...dropdownPlacement}
      >
        <Calendar
          defaultMonth={value?.from}
          mode="range"
          numberOfMonths={numberOfMonths}
          selected={value}
          // Não fecha sozinho: o primeiro clique já devolve `from` e `to` no mesmo
          // dia, e fechar aí deixaria escolher só um dia — o segundo clique é que
          // abre a faixa.
          onSelect={onValueChange}
          {...calendarProps}
        />
        {allowClear ? (
          <div className="border-t p-2">
            <Button
              className="w-full justify-start"
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => {
                onValueChange(undefined)
                setOpen(false)
              }}
            >
              {clearLabel}
            </Button>
          </div>
        ) : null}
      </PopoverPopup>
    </Popover>
  )
}

function DateRangePropertyContent({ label }: Readonly<{ label: string }>) {
  return (
    <>
      <CalendarRangeIcon aria-hidden className="size-3" />
      <span className="truncate">{label}</span>
    </>
  )
}

export function formatDateRangeProperty(
  value: DateRange | undefined,
  fallback: string,
  locale: string,
): string {
  const from = formatEnd(value?.from, locale)
  const to = formatEnd(value?.to, locale)

  if (from && to) return `${from} – ${to}`
  if (from) return `A partir de ${from}`
  if (to) return `Até ${to}`
  return fallback
}

/**
 * Sem `timeZone`: o `DateRange` do calendário guarda marcador de dia local, e
 * formatá-lo em UTC mostraria a véspera em fuso a leste. Sem ano, porque numa
 * propriedade a data é referência curta.
 */
function formatEnd(date: Date | undefined, locale: string): string | null {
  if (!date || Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(date)
}
