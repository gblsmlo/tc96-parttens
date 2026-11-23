'use client'

import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { ListFilterIcon } from 'lucide-react'
import { Fragment, type ReactElement } from 'react'
import type {
  RecordGroupFilterProps,
  RecordGroupFilterSection,
} from '../../core'

function FilterSection({
  label,
  onChange,
  options,
  value,
}: Readonly<RecordGroupFilterSection>): ReactElement {
  return (
    <MenuGroup data-slot="record-group-filter-options">
      <MenuGroupLabel>{label}</MenuGroupLabel>
      {options.map((option) => (
        <MenuCheckboxItem
          checked={value.includes(option.value)}
          key={option.value}
          onCheckedChange={(checked) =>
            onChange(
              options
                .map((item) => item.value)
                .filter((item) =>
                  item === option.value ? checked : value.includes(item),
                ),
            )
          }
        >
          {option.label}
        </MenuCheckboxItem>
      ))}
    </MenuGroup>
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
    <Menu>
      <MenuTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <ListFilterIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup
        align="end"
        aria-label={label}
        className="w-56"
        data-slot="record-group-filter"
      >
        {filterSections.map((section, index) => (
          <Fragment key={section.options.map((option) => option.value).join()}>
            {index > 0 ? <MenuSeparator /> : null}
            <FilterSection {...section} />
          </Fragment>
        ))}
        {sortOptions ? (
          <>
            {filterSections.length > 0 ? <MenuSeparator /> : null}
            <MenuGroup data-slot="record-group-filter-sort">
              <MenuGroupLabel>{sortLabel}</MenuGroupLabel>
              <MenuRadioGroup
                onValueChange={(value) => onSortChange?.(String(value))}
                value={sortValue}
              >
                {sortOptions.map((option) => (
                  <MenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
            </MenuGroup>
          </>
        ) : null}
      </MenuPopup>
    </Menu>
  )
}
