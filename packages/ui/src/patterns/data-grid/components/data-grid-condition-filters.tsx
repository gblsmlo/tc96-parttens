'use client'

import { DotsThreeVerticalIcon, FunnelSimpleIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@tc96/ui/command'
import { Group, GroupText } from '@tc96/ui/group'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  changeConditionOperator,
  createCondition,
  type DataGridCondition,
  type DataGridConditionField,
  type DataGridConditionOperator,
  getConditionOperators,
} from '../lib/data-grid-conditions'
import {
  DataGridConditionValue,
  type DataGridConditionValueLabels,
} from './data-grid-condition-value'

export interface DataGridConditionFilterField extends DataGridConditionField {
  icon?: ReactNode
}

export interface DataGridConditionFilterLabels
  extends DataGridConditionValueLabels {
  addFilter: string
  clearFilters: string
  condition: (field: string) => string
  conditionActions: (field: string) => string
  noFields: string
  removeCondition: string
  searchFields: string
}

export interface DataGridConditionFiltersProps
  extends Omit<ComponentProps<'div'>, 'children' | 'onChange'> {
  conditions: readonly DataGridCondition[]
  fields: readonly DataGridConditionFilterField[]
  formatValue?: (field: DataGridConditionField, value: string) => string
  labels: DataGridConditionFilterLabels
  onConditionsChange: (conditions: DataGridCondition[]) => void
  operatorLabels: Record<DataGridConditionOperator, string>
}

interface FieldItem {
  label: string
  value: string
}

interface ConditionChipProps {
  condition: DataGridCondition
  field: DataGridConditionFilterField
  formatValue: DataGridConditionFiltersProps['formatValue']
  labels: DataGridConditionFilterLabels
  onChange: (condition: DataGridCondition) => void
  onRemove: () => void
  operatorLabels: DataGridConditionFiltersProps['operatorLabels']
}

function ConditionChip({
  condition,
  field,
  formatValue,
  labels,
  onChange,
  onRemove,
  operatorLabels,
}: ConditionChipProps) {
  return (
    <Group
      aria-label={labels.condition(field.label)}
      data-slot="data-grid-condition"
    >
      <GroupText>
        {field.icon}
        {field.label}
      </GroupText>
      <Menu>
        <MenuTrigger render={<Button size="sm" variant="outline" />}>
          {operatorLabels[condition.operator]}
        </MenuTrigger>
        <MenuPopup align="start">
          <MenuRadioGroup
            onValueChange={(next) =>
              onChange(
                changeConditionOperator(
                  condition,
                  next as DataGridConditionOperator,
                ),
              )
            }
            value={condition.operator}
          >
            {getConditionOperators(field.kind).map((operator) => (
              <MenuRadioItem key={operator} value={operator}>
                {operatorLabels[operator]}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuPopup>
      </Menu>
      <DataGridConditionValue
        condition={condition}
        field={field}
        formatValue={formatValue}
        labels={labels}
        onValueChange={(value) => onChange({ ...condition, value })}
      />
      <Menu>
        <MenuTrigger
          render={
            <Button
              aria-label={labels.conditionActions(field.label)}
              size="icon-sm"
              variant="outline"
            />
          }
        >
          <DotsThreeVerticalIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end">
          <MenuItem onClick={onRemove}>{labels.removeCondition}</MenuItem>
        </MenuPopup>
      </Menu>
    </Group>
  )
}

export function DataGridConditionFilters({
  className,
  conditions,
  fields,
  formatValue,
  labels,
  onConditionsChange,
  operatorLabels,
  ...props
}: DataGridConditionFiltersProps): ReactElement {
  const [open, setOpen] = useState(false)
  const idPrefix = useId()
  const counter = useRef(0)
  const items = useMemo<FieldItem[]>(
    () =>
      fields.map((field) => ({ label: field.label, value: field.columnId })),
    [fields],
  )
  const fieldByColumn = useMemo(
    () => new Map(fields.map((field) => [field.columnId, field])),
    [fields],
  )

  const addCondition = (columnId: string) => {
    const field = fieldByColumn.get(columnId)
    if (!field) return
    counter.current += 1
    setOpen(false)
    onConditionsChange([
      ...conditions,
      createCondition(field, `${idPrefix}-${counter.current}`),
    ])
  }

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      data-slot="data-grid-condition-filters"
      {...props}
    >
      {conditions.map((condition) => {
        const field = fieldByColumn.get(condition.columnId)
        if (!field) return null
        return (
          <ConditionChip
            condition={condition}
            field={field}
            formatValue={formatValue}
            key={condition.id}
            labels={labels}
            onChange={(next) =>
              onConditionsChange(
                conditions.map((entry) =>
                  entry.id === next.id ? next : entry,
                ),
              )
            }
            onRemove={() =>
              onConditionsChange(
                conditions.filter((entry) => entry.id !== condition.id),
              )
            }
            operatorLabels={operatorLabels}
          />
        )
      })}
      {fields.length > 0 ? (
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger render={<Button size="sm" variant="outline" />}>
            <FunnelSimpleIcon aria-hidden="true" />
            {labels.addFilter}
          </PopoverTrigger>
          <PopoverPopup
            align="start"
            aria-label={labels.addFilter}
            className="w-64 **:data-[slot=popover-viewport]:p-1"
          >
            <Command items={items}>
              <CommandInput
                aria-label={labels.searchFields}
                placeholder={labels.searchFields}
              />
              <CommandEmpty>{labels.noFields}</CommandEmpty>
              <CommandList>
                {(item: FieldItem) => (
                  <CommandItem
                    key={item.value}
                    onClick={() => addCondition(item.value)}
                    value={item}
                  >
                    {fieldByColumn.get(item.value)?.icon}
                    {item.label}
                  </CommandItem>
                )}
              </CommandList>
            </Command>
          </PopoverPopup>
        </Popover>
      ) : null}
      {conditions.length > 0 ? (
        <Button
          onClick={() => onConditionsChange([])}
          size="sm"
          variant="ghost"
        >
          {labels.clearFilters}
        </Button>
      ) : null}
    </div>
  )
}
