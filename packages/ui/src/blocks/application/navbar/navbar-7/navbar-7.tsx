'use client'

import {
  ArrowsClockwiseIcon,
  DotsThreeIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { renderAnchor } from '@tc96/ui/render-anchor'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Toggle } from '@tc96/ui/toggle'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { NavbarBreadcrumb } from '../shared/navbar-breadcrumb'
import { defaultNavbar7Labels } from './labels'
import { Navbar7DateRange } from './navbar-7-date-range'
import { Navbar7Search } from './navbar-7-search'
import type { Navbar7Props } from './types'

export function Navbar7({
  breadcrumb,
  calendarLocale,
  className,
  compare = false,
  labels,
  locale = 'pt-BR',
  menu,
  onCompareChange,
  onRangeChange,
  onRefresh,
  onRefreshIntervalChange,
  onSearchSelect,
  onShare,
  range = {},
  refreshInterval,
  refreshOptions = [],
  renderLink = renderAnchor,
  searchItems,
}: Readonly<Navbar7Props>): ReactElement {
  const texts = { ...defaultNavbar7Labels, ...labels }
  const showInterval = refreshOptions.length > 0 && onRefreshIntervalChange
  const showSearch = searchItems && onSearchSelect
  const showSecondRow = onRangeChange || onCompareChange || showSearch
  const selectItems = refreshOptions.map((option) => ({
    label: option.label,
    value: option.id,
  }))

  return (
    <header
      className={cn('w-full border-b bg-background', className)}
      data-slot="navbar-7"
    >
      <div className="flex min-h-12 items-center gap-3 px-4 py-2">
        <NavbarBreadcrumb
          items={breadcrumb}
          label={texts.breadcrumb}
          renderLink={renderLink}
        />
        <div className="ms-auto flex items-center gap-2">
          {onRefresh ? (
            <Button
              aria-label={texts.refresh}
              onClick={onRefresh}
              size="icon-sm"
              variant="ghost"
            >
              <ArrowsClockwiseIcon aria-hidden="true" />
            </Button>
          ) : null}
          {showInterval ? (
            <Select
              items={selectItems}
              onValueChange={(next) => {
                if (next) onRefreshIntervalChange(next)
              }}
              value={refreshInterval ?? refreshOptions[0]?.id}
            >
              <SelectTrigger
                aria-label={texts.refreshInterval}
                className="w-32"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {selectItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          ) : null}
          {onShare ? (
            <Button onClick={onShare} size="sm" variant="outline">
              <ShareNetworkIcon aria-hidden="true" />
              {texts.share}
            </Button>
          ) : null}
          {menu ? (
            <Menu>
              <MenuTrigger
                render={
                  <Button
                    aria-label={texts.menu}
                    size="icon-sm"
                    variant="ghost"
                  />
                }
              >
                <DotsThreeIcon aria-hidden="true" />
              </MenuTrigger>
              <MenuPopup align="end" className="min-w-48">
                {menu}
              </MenuPopup>
            </Menu>
          ) : null}
        </div>
      </div>
      {showSecondRow ? (
        <div className="flex min-h-12 flex-wrap items-center gap-2 border-t px-4 py-2">
          {onRangeChange ? (
            <Navbar7DateRange
              calendarLocale={calendarLocale}
              label={texts.dateRange}
              locale={locale}
              onRangeChange={onRangeChange}
              placeholder={texts.dateRangePlaceholder}
              range={range}
            />
          ) : null}
          {onCompareChange ? (
            <Toggle
              onPressedChange={onCompareChange}
              pressed={compare}
              size="sm"
              variant="outline"
            >
              {texts.compare}
            </Toggle>
          ) : null}
          {showSearch ? (
            <Navbar7Search
              items={searchItems}
              labels={texts}
              onSelect={onSearchSelect}
            />
          ) : null}
        </div>
      ) : null}
    </header>
  )
}
