'use client'

import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import {
  Menu,
  MenuCheckboxItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { type ReactElement, useState } from 'react'
import type {
  DataGridCondition,
  DataGridConditionField,
} from '../lib/data-grid-conditions'

export interface DataGridConditionValueLabels {
  editValue: (field: string) => string
  noValue: string
  rangeFrom: string
  rangeSeparator: string
  rangeTo: string
  valuePlaceholder: string
}

export interface DataGridConditionValueProps {
  condition: DataGridCondition
  field: DataGridConditionField
  formatValue?: (field: DataGridConditionField, value: string) => string
  labels: DataGridConditionValueLabels
  onValueChange: (value: readonly string[]) => void
}

const INPUT_TYPES = { date: 'date', number: 'number', text: 'text' } as const

function labelOf(
  field: DataGridConditionField,
  value: string,
  formatValue: DataGridConditionValueProps['formatValue'],
) {
  if (formatValue) return formatValue(field, value)
  return field.options?.find((option) => option.value === value)?.label ?? value
}

function ValueSummary({
  condition,
  field,
  formatValue,
  labels,
}: Omit<DataGridConditionValueProps, 'onValueChange'>) {
  const entries = condition.value.filter((entry) => entry.trim() !== '')
  if (entries.length === 0) {
    return <span className="text-muted-foreground">{labels.noValue}</span>
  }
  const texts = entries.map((entry) => labelOf(field, entry, formatValue))
  if (condition.operator === 'between' && texts.length === 2) {
    return (
      <>
        <span>{texts[0]}</span>
        <span className="text-muted-foreground">{labels.rangeSeparator}</span>
        <span>{texts[1]}</span>
      </>
    )
  }
  if (condition.operator === 'is-any-of') {
    return (
      <>
        {texts.map((text) => (
          <Badge key={text} variant="secondary">
            {text}
          </Badge>
        ))}
      </>
    )
  }
  return <span className="truncate">{texts[0]}</span>
}

function OptionValue(props: DataGridConditionValueProps) {
  const { condition, field, labels, onValueChange } = props
  const options = field.options ?? []
  const multiple = condition.operator === 'is-any-of'

  return (
    <Menu>
      <MenuTrigger render={<Button size="sm" variant="outline" />}>
        <ValueSummary {...props} />
      </MenuTrigger>
      <MenuPopup align="start" aria-label={labels.editValue(field.label)}>
        {multiple ? (
          options.map((option) => (
            <MenuCheckboxItem
              checked={condition.value.includes(option.value)}
              key={option.value}
              onCheckedChange={(checked) =>
                onValueChange(
                  checked
                    ? [...condition.value, option.value]
                    : condition.value.filter((entry) => entry !== option.value),
                )
              }
            >
              {option.label}
            </MenuCheckboxItem>
          ))
        ) : (
          <MenuRadioGroup
            onValueChange={(next) => onValueChange([String(next)])}
            value={condition.value[0] ?? ''}
          >
            {options.map((option) => (
              <MenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        )}
      </MenuPopup>
    </Menu>
  )
}

function InputValue(props: DataGridConditionValueProps) {
  const { condition, field, labels, onValueChange } = props
  const [open, setOpen] = useState(false)
  const type = INPUT_TYPES[field.kind === 'option' ? 'text' : field.kind]
  const between = condition.operator === 'between'
  const [first = '', second = ''] = condition.value

  const closeOnEnter = (key: string) => {
    if (key === 'Enter') setOpen(false)
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger render={<Button size="sm" variant="outline" />}>
        <ValueSummary {...props} />
      </PopoverTrigger>
      <PopoverPopup align="start" aria-label={labels.editValue(field.label)}>
        <div className="flex w-56 flex-col gap-2">
          {between ? (
            <>
              <Input
                aria-label={labels.rangeFrom}
                onChange={(event) =>
                  onValueChange([event.target.value, second])
                }
                onKeyDown={(event) => closeOnEnter(event.key)}
                size="sm"
                type={type}
                value={first}
              />
              <Input
                aria-label={labels.rangeTo}
                onChange={(event) => onValueChange([first, event.target.value])}
                onKeyDown={(event) => closeOnEnter(event.key)}
                size="sm"
                type={type}
                value={second}
              />
            </>
          ) : (
            <Input
              aria-label={labels.editValue(field.label)}
              onChange={(event) =>
                onValueChange(event.target.value ? [event.target.value] : [])
              }
              onKeyDown={(event) => closeOnEnter(event.key)}
              placeholder={labels.valuePlaceholder}
              size="sm"
              type={type}
              value={first}
            />
          )}
        </div>
      </PopoverPopup>
    </Popover>
  )
}

export function DataGridConditionValue(
  props: DataGridConditionValueProps,
): ReactElement {
  return props.field.kind === 'option' ? (
    <OptionValue {...props} />
  ) : (
    <InputValue {...props} />
  )
}
