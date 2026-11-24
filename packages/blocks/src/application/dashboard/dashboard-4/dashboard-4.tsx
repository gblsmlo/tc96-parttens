import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileTextIcon,
  PlusIcon,
  StarIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import type { AmountFormatOptions } from '@tc96/helpers/format'
import { resolveInitials } from '@tc96/helpers/initials'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { AreaMetricWidget } from '@tc96/parttens/widgets/analytics/area-metric-widget'
import { AvatarStack } from '@tc96/parttens/widgets/shared/avatar-stack'
import {
  clampRatio,
  ProgressRing,
} from '@tc96/parttens/widgets/shared/progress-ring'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { Toggle } from '@tc96/ui/toggle'
import { cn } from '@tc96/utils'
import { Fragment } from 'react'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardFilter } from '../shared/dashboard-filter'
import { DashboardPagination } from '../shared/dashboard-pagination'
import { DashboardPanel } from '../shared/dashboard-panel'
import { DashboardRowActions } from '../shared/dashboard-row-actions'
import { DashboardSearch } from '../shared/dashboard-search'
import {
  createDashboardFormatter,
  defaultDashboardCurrency,
  defaultDashboardLocale,
} from '../shared/format'
import type { DashboardValueFormat } from '../shared/types'
import { Dashboard4Skeleton } from './dashboard-4-skeleton'
import { defaultDashboard4Labels } from './labels'
import type { Dashboard4Props, Dashboard4SortKey } from './types'

const metricFormat = (
  format: DashboardValueFormat,
  locale: string,
  currency: string,
): AmountFormatOptions =>
  format === 'currency'
    ? {
        currency,
        locale,
        maximumFractionDigits: 1,
        notation: 'compact',
        style: 'currency',
      }
    : format === 'percent'
      ? { locale, maximumFractionDigits: 1, style: 'percent' }
      : { locale, maximumFractionDigits: 0, style: 'decimal' }

export function Dashboard4({
  breadcrumbs,
  className,
  currency = defaultDashboardCurrency,
  error = false,
  filter,
  filterOptions,
  labels: labelsProp,
  locale = defaultDashboardLocale,
  metrics,
  modules,
  onAddModule,
  onFavoriteChange,
  onFilterChange,
  onInvite,
  onOpen,
  onPageChange,
  onRetry,
  onRowAction,
  onSearchChange,
  onSortChange,
  pagination,
  pending = false,
  renderLink,
  rowActions,
  search = '',
  sort,
  team,
}: Readonly<Dashboard4Props>) {
  const labels = { ...defaultDashboard4Labels, ...labelsProp }

  if (pending) {
    return (
      <Dashboard4Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const formatter = createDashboardFormatter({ currency, locale })
  const isEmpty = metrics.length === 0 && modules.length === 0
  const hasRowMenu = Boolean(onRowAction && rowActions?.length)
  const hasActions = Boolean(onOpen || onFavoriteChange || hasRowMenu)
  const columnCount = hasActions ? 5 : 4
  const hasFilter =
    onFilterChange !== undefined &&
    filter !== undefined &&
    filterOptions !== undefined &&
    filterOptions.length > 0
  const ariaSort = (key: Dashboard4SortKey) =>
    sort.key === key
      ? sort.direction === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none'
  const sortHead = (key: Dashboard4SortKey, label: string) => (
    <TableHead aria-sort={ariaSort(key)}>
      <SortButton
        active={sort.key === key}
        direction={sort.direction}
        label={labels.sortBy(label)}
        onClick={() =>
          onSortChange({
            direction:
              sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc',
            key,
          })
        }
      >
        {label}
      </SortButton>
    </TableHead>
  )

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-4"
    >
      <header
        className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b bg-background py-3"
        data-slot="dashboard-navbar"
      >
        <h2 className="sr-only">{labels.title}</h2>
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
        ) : (
          <span />
        )}
        {team?.length || onInvite ? (
          <div className="flex items-center gap-3">
            {team?.length ? (
              <AvatarStack aria-label={labels.team} people={team} size="sm" />
            ) : null}
            {onInvite ? (
              <Button onClick={onInvite} size="sm" variant="outline">
                <UserPlusIcon aria-hidden="true" />
                {labels.invite}
              </Button>
            ) : null}
          </div>
        ) : null}
      </header>
      {error ? (
        <DashboardError
          description={labels.errorDescription}
          onRetry={onRetry}
          retry={labels.retry}
          title={labels.errorTitle}
        />
      ) : isEmpty ? (
        <StateSurface
          actions={
            onAddModule ? (
              <Button onClick={onAddModule} size="sm">
                <PlusIcon aria-hidden="true" />
                {labels.addModule}
              </Button>
            ) : undefined
          }
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <>
          {metrics.length ? (
            <ul
              aria-label={labels.indicators}
              className="m-0 grid list-none gap-4 p-0 md:grid-cols-3"
            >
              {metrics.map((metric, index) => (
                <li className="min-w-0" key={metric.id}>
                  <AreaMetricWidget
                    caption={metric.caption}
                    color={`var(--chart-${(index % 5) + 1})`}
                    data-kpi={metric.id}
                    format={metricFormat(
                      metric.format ?? 'number',
                      locale,
                      currency,
                    )}
                    label={metric.label}
                    points={metric.points}
                    value={metric.value}
                  />
                </li>
              ))}
            </ul>
          ) : null}
          <DashboardPanel
            action={
              onSearchChange || onAddModule ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {onSearchChange ? (
                    <DashboardSearch
                      label={labels.search}
                      onValueChange={onSearchChange}
                      value={search}
                    />
                  ) : null}
                  {onAddModule ? (
                    <Button onClick={onAddModule} size="sm">
                      <PlusIcon aria-hidden="true" />
                      {labels.addModule}
                    </Button>
                  ) : null}
                </div>
              ) : undefined
            }
            title={labels.modulesTitle}
          >
            {hasFilter ? (
              <DashboardFilter
                label={labels.filter}
                onValueChange={onFilterChange}
                options={filterOptions}
                value={filter}
              />
            ) : null}
            <Table aria-label={labels.modulesTitle}>
              <TableHeader>
                <TableRow>
                  {sortHead('progress', labels.columnProgress)}
                  {sortHead('name', labels.columnModule)}
                  {sortHead('window', labels.columnWindow)}
                  {sortHead('status', labels.columnStatus)}
                  {hasActions ? (
                    <TableHead className="text-right">
                      {labels.columnActions}
                    </TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center" colSpan={columnCount}>
                      <span className="text-muted-foreground">
                        {labels.noModules}
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  modules.map((module) => {
                    const ratio = clampRatio(
                      module.tasksDone,
                      module.tasksTotal,
                    )
                    const percent = formatter.value(
                      Math.round(ratio * 100) / 100,
                      'percent',
                    )

                    return (
                      <TableRow data-module={module.id} key={module.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ProgressRing
                              className="size-10"
                              ratio={ratio}
                              strokeWidth={8}
                            >
                              <span className="font-medium text-[0.625rem] tabular-nums">
                                {percent}
                              </span>
                            </ProgressRing>
                            <div className="grid">
                              <span className="font-medium text-sm tabular-nums">
                                {labels.ready(percent)}
                              </span>
                              <span className="text-muted-foreground text-xs tabular-nums">
                                {labels.tasks(
                                  module.tasksDone,
                                  module.tasksTotal,
                                )}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="grid gap-0.5">
                            <span className="font-medium">{module.name}</span>
                            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              {module.kind}
                              <span aria-hidden="true">·</span>
                              <Avatar className="[--avatar-size:--spacing(4)] text-[0.625rem]">
                                {module.owner.imageUrl ? (
                                  <AvatarImage
                                    alt=""
                                    src={module.owner.imageUrl}
                                  />
                                ) : null}
                                <AvatarFallback>
                                  {resolveInitials(module.owner)}
                                </AvatarFallback>
                              </Avatar>
                              {module.owner.label}
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{module.domain}</span>
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="grid gap-0.5">
                            <span className="font-medium text-sm">
                              {module.window}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {labels.windowDays(module.windowDays)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={module.status.tone ?? 'secondary'}>
                            {module.status.label}
                          </Badge>
                        </TableCell>
                        {hasActions ? (
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              {onOpen ? (
                                <Button
                                  aria-label={labels.open(module.name)}
                                  onClick={() => onOpen(module.id)}
                                  size="icon-sm"
                                  variant="ghost"
                                >
                                  <FileTextIcon aria-hidden="true" />
                                </Button>
                              ) : null}
                              {onFavoriteChange ? (
                                <Toggle
                                  aria-label={labels.favorite(module.name)}
                                  onPressedChange={(next) =>
                                    onFavoriteChange(module.id, next)
                                  }
                                  pressed={module.favorite ?? false}
                                  size="sm"
                                >
                                  <StarIcon
                                    aria-hidden="true"
                                    className={
                                      module.favorite
                                        ? 'text-warning-foreground'
                                        : undefined
                                    }
                                    weight={
                                      module.favorite ? 'fill' : 'regular'
                                    }
                                  />
                                </Toggle>
                              ) : null}
                              {hasRowMenu && rowActions && onRowAction ? (
                                <DashboardRowActions
                                  actions={rowActions}
                                  label={labels.rowActionsFor(module.name)}
                                  onAction={(actionId) =>
                                    onRowAction(actionId, module.id)
                                  }
                                />
                              ) : null}
                            </div>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
            {pagination && onPageChange ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground text-sm tabular-nums">
                  {labels.rangeOf(
                    pagination.from,
                    pagination.to,
                    pagination.total,
                  )}
                </p>
                <div>
                  <DashboardPagination
                    label={labels.pagination}
                    nextLabel={labels.nextPage}
                    onPageChange={onPageChange}
                    page={pagination.page}
                    pageCount={pagination.pageCount}
                    pageOf={labels.pageOf}
                    previousLabel={labels.previousPage}
                  />
                </div>
              </div>
            ) : null}
          </DashboardPanel>
        </>
      )}
    </section>
  )
}

function SortButton({
  active,
  children,
  direction,
  label,
  onClick,
}: Readonly<{
  active: boolean
  children: string
  direction: 'asc' | 'desc'
  label: string
  onClick: () => void
}>) {
  const Icon = direction === 'asc' ? ArrowUpIcon : ArrowDownIcon

  return (
    <Button
      aria-label={label}
      className="-ms-2.5"
      onClick={onClick}
      size="sm"
      variant="ghost"
    >
      {children}
      {active ? <Icon aria-hidden="true" /> : null}
    </Button>
  )
}
