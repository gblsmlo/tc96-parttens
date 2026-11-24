import { DownloadSimpleIcon } from '@phosphor-icons/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Button } from '@tc96/ui/button'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Fragment } from 'react'
import type { DashboardHeaderLabels, DashboardHeaderProps } from './types'

export interface DashboardHeaderComponentProps extends DashboardHeaderProps {
  labels: DashboardHeaderLabels
  showExport?: boolean
}

export function DashboardHeader({
  breadcrumbs,
  labels,
  onExport,
  onPeriodChange,
  period,
  periodOptions,
  renderLink,
  showExport = true,
}: Readonly<DashboardHeaderComponentProps>) {
  const hasPeriod =
    onPeriodChange !== undefined &&
    period !== undefined &&
    periodOptions !== undefined &&
    periodOptions.length > 0

  return (
    <header
      className="flex flex-wrap items-end justify-between gap-4"
      data-slot="dashboard-header"
    >
      <div className="grid min-w-0 gap-1.5">
        {breadcrumbs?.length ? (
          <Breadcrumb aria-label={labels.breadcrumb}>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const current = index === breadcrumbs.length - 1
                return (
                  <Fragment key={`${index}-${item.label}`}>
                    <BreadcrumbItem>
                      {current ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : item.href && renderLink ? (
                        <BreadcrumbLink render={renderLink(item.href)}>
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        item.label
                      )}
                    </BreadcrumbItem>
                    {current ? null : <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}
        <h2 className="font-semibold text-lg">{labels.title}</h2>
        {labels.description ? (
          <p className="text-muted-foreground text-sm">{labels.description}</p>
        ) : null}
      </div>
      {hasPeriod || (onExport && showExport) ? (
        <div className="flex flex-wrap items-center gap-2">
          {hasPeriod ? (
            <Select
              items={periodOptions}
              onValueChange={(next) => {
                if (next) onPeriodChange(next)
              }}
              value={period}
            >
              <SelectTrigger aria-label={labels.period} className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          ) : null}
          {onExport && showExport ? (
            <Button onClick={onExport} size="sm" variant="outline">
              <DownloadSimpleIcon aria-hidden="true" />
              {labels.export}
            </Button>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}
