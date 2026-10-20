import { ptBR } from '@daypicker/react/locale'
import {
  calendarDateFromDate,
  calendarDateKey,
  calendarDateToDate,
  parseCalendarDateKey,
} from '@tc96/helpers/calendar-date'
import { formatLongDate, formatMediumDate } from '@tc96/helpers/date'
import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@tc96/ui/input-group'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { CalendarIcon } from 'lucide-react'
import { type ReactNode, type Ref, useId, useState } from 'react'

export interface SelectOption {
  label: string
  value: string
}

export function SelectField({
  className,
  description,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: Readonly<{
  className?: string
  description?: ReactNode
  label: string
  onValueChange: (value: string | null) => void
  options: SelectOption[]
  placeholder: string
  value: string | null
}>) {
  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <Select items={options} onValueChange={onValueChange} value={value}>
        <SelectTrigger size="lg">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

export function CurrencyField({
  error,
  inputRef,
  label,
  onValueChange,
  value,
}: Readonly<{
  error?: string
  inputRef?: Ref<HTMLInputElement>
  label: string
  onValueChange: (value: string) => void
  value: string
}>) {
  return (
    <Field invalid={Boolean(error)}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          inputMode="decimal"
          onValueChange={onValueChange}
          ref={inputRef}
          size="lg"
          value={value}
        />
      </InputGroup>
      {error ? <FieldError match>{error}</FieldError> : null}
    </Field>
  )
}

const roundedDayButtons = { day_button: 'rounded-full' }

function dateFromKey(key: string | undefined) {
  const date = key ? parseCalendarDateKey(key) : null
  return date ? calendarDateToDate(date) : undefined
}

function keyFromDate(date: Date | undefined) {
  return date ? calendarDateKey(calendarDateFromDate(date)) : ''
}

export function DateField({
  label,
  min,
  onValueChange,
  placeholder = 'Selecione a data',
  value,
}: Readonly<{
  label: string
  min?: string
  onValueChange: (value: string) => void
  placeholder?: string
  value: string
}>) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const selected = dateFromKey(value)
  const earliest = dateFromKey(min)

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          id={id}
          render={
            <Button
              className="w-full justify-start"
              size="lg"
              variant="outline"
            />
          }
        >
          <CalendarIcon aria-hidden="true" />
          {selected ? (
            formatLongDate(selected, 'pt-BR')
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </PopoverTrigger>
        <PopoverPopup>
          <Calendar
            classNames={roundedDayButtons}
            defaultMonth={selected ?? earliest}
            disabled={earliest ? { before: earliest } : undefined}
            locale={ptBR}
            mode="single"
            onSelect={(date) => {
              onValueChange(keyFromDate(date))
              setOpen(false)
            }}
            selected={selected}
          />
        </PopoverPopup>
      </Popover>
    </Field>
  )
}

export interface DateRangeValue {
  from: string
  to: string
}

export function DateRangeField({
  className,
  label,
  onValueChange,
  placeholder = 'Selecione o período',
  value,
}: Readonly<{
  className?: string
  label: string
  onValueChange: (value: DateRangeValue) => void
  placeholder?: string
  value: DateRangeValue
}>) {
  const id = useId()
  const from = dateFromKey(value.from)
  const to = dateFromKey(value.to)

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger
          id={id}
          render={
            <Button
              className="w-full justify-start"
              size="lg"
              variant="outline"
            />
          }
        >
          <CalendarIcon aria-hidden="true" />
          {from ? (
            to ? (
              `${formatMediumDate(from, 'pt-BR')} – ${formatMediumDate(to, 'pt-BR')}`
            ) : (
              formatMediumDate(from, 'pt-BR')
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </PopoverTrigger>
        <PopoverPopup>
          <Calendar
            classNames={roundedDayButtons}
            defaultMonth={from}
            locale={ptBR}
            mode="range"
            onSelect={(range) =>
              onValueChange({
                from: keyFromDate(range?.from),
                to: keyFromDate(range?.to),
              })
            }
            selected={from ? { from, to } : undefined}
          />
        </PopoverPopup>
      </Popover>
    </Field>
  )
}
