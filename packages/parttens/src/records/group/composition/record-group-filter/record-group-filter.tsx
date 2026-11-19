'use client'

import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Label } from '@tc96/ui/label'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { ListFilterIcon } from 'lucide-react'
import { type ReactElement, useId } from 'react'
import type {
  RecordGroupFilterProps,
  RecordGroupFilterSection,
} from '../../core'

const optionClassName = 'flex items-center gap-2 text-sm'

function FilterSection({
  label,
  onChange,
  options,
  value,
}: Readonly<RecordGroupFilterSection>): ReactElement {
  return (
    <fieldset
      className="flex flex-col gap-2"
      data-slot="record-group-filter-options"
    >
      <legend className="mb-2 font-medium text-sm">{label}</legend>
      {options.map((option) => (
        <Label className={optionClassName} key={option.value}>
          <Checkbox
            checked={value.includes(option.value)}
            onCheckedChange={(checked) =>
              onChange(
                options
                  .map((item) => item.value)
                  .filter((item) =>
                    item === option.value ? checked : value.includes(item),
                  ),
              )
            }
          />
          {option.label}
        </Label>
      ))}
    </fieldset>
  )
}

export function RecordGroupFilter({
  filterLabel,
  filterOptions,
  filterValue = [],
  label,
  onFilterChange,
  onSortChange,
  sections = [],
  sortLabel,
  sortOptions,
  sortValue,
}: Readonly<RecordGroupFilterProps>): ReactElement {
  const sortLabelId = useId()
  const filterSections: readonly RecordGroupFilterSection[] = filterOptions
    ? [
        {
          label: filterLabel,
          onChange: (value) => onFilterChange?.(value),
          options: filterOptions,
          value: filterValue,
        },
        ...sections,
      ]
    : sections

  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <ListFilterIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup align="end" aria-label={label} className="w-56">
        <div className="flex flex-col gap-4" data-slot="record-group-filter">
          {filterSections.map((section) => (
            <FilterSection
              key={section.options.map((option) => option.value).join()}
              {...section}
            />
          ))}
          {sortOptions ? (
            <div
              className="flex flex-col gap-2"
              data-slot="record-group-filter-sort"
            >
              <p className="font-medium text-sm" id={sortLabelId}>
                {sortLabel}
              </p>
              <RadioGroup
                aria-labelledby={sortLabelId}
                className="flex flex-col gap-2"
                onValueChange={(value) => onSortChange?.(String(value))}
                value={sortValue}
              >
                {sortOptions.map((option) => (
                  <Label className={optionClassName} key={option.value}>
                    <Radio value={option.value} />
                    {option.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          ) : null}
        </div>
      </PopoverPopup>
    </Popover>
  )
}
