import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { formatAmount } from '@tc96/helpers/format'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Card } from '@tc96/ui/card'
import { Meter, MeterIndicator, MeterLabel, MeterTrack } from '@tc96/ui/meter'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { defaultSettings23Labels } from './labels'
import type { Settings23InvoiceStatus, Settings23Props } from './types'

const statusVariant = {
  failed: 'error',
  paid: 'success',
  pending: 'warning',
} as const satisfies Record<Settings23InvoiceStatus, string>

export function Settings23({
  className,
  currency = 'BRL',
  invoices,
  labels: labelsProp,
  locale = 'pt-BR',
  onChangePlan,
  onDownload,
  plan,
  usage,
}: Readonly<Settings23Props>) {
  const labels = { ...defaultSettings23Labels, ...labelsProp }
  const planId = `settings-23-plan-${useId()}`

  return (
    <div
      className={cn('mx-auto flex w-full max-w-3xl flex-col gap-8', className)}
    >
      <section aria-labelledby={planId} className="flex flex-col gap-3">
        <SettingsSectionHeader>
          <Text
            render={<h2 id={planId}>{labels.title}</h2>}
            size="base"
            weight="medium"
          />
        </SettingsSectionHeader>
        <Card>
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Text
                  foreground="muted"
                  render={<p>{labels.planTitle}</p>}
                  size="sm"
                />
                <Text render={<p>{plan.name}</p>} size="lg" weight="medium" />
                <Text
                  foreground="muted"
                  render={
                    <p>
                      {formatAmount(plan.price, { currency, locale })}{' '}
                      {labels.perMonth} · {labels.renewsOn(plan.renewsOn)}
                    </p>
                  }
                  size="sm"
                />
              </div>
              {onChangePlan ? (
                <Button onClick={onChangePlan} size="sm" variant="outline">
                  {labels.changePlan}
                </Button>
              ) : null}
            </div>
            <ul className="flex flex-col gap-4" aria-label={labels.usageTitle}>
              {usage.map((metric) => (
                <li key={metric.id}>
                  <Meter
                    getAriaValueText={() =>
                      labels.usage(metric.used, metric.limit, metric.unit)
                    }
                    max={metric.limit}
                    value={metric.used}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <MeterLabel>{metric.label}</MeterLabel>
                      <Text
                        foreground="muted"
                        render={
                          <span>
                            {labels.usage(
                              metric.used,
                              metric.limit,
                              metric.unit,
                            )}
                          </span>
                        }
                        size="sm"
                      />
                    </div>
                    <MeterTrack>
                      <MeterIndicator />
                    </MeterTrack>
                  </Meter>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>{labels.invoicesTitle}</SettingsSectionTitle>
            <SettingsSectionDescription>
              {labels.invoicesDescription}
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        {invoices.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.columnDate}</TableHead>
                <TableHead>{labels.columnAmount}</TableHead>
                <TableHead>{labels.columnStatus}</TableHead>
                <TableHead>
                  <span className="sr-only">{labels.columnActions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    {formatAmount(invoice.amount, { currency, locale })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[invoice.status]}>
                      {labels.statuses[invoice.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    {onDownload ? (
                      <Button
                        aria-label={labels.download(invoice.date)}
                        onClick={() => onDownload(invoice.id)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <DownloadSimpleIcon aria-hidden="true" />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SettingsSection>
    </div>
  )
}
