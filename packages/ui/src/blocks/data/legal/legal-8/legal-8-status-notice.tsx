import { CheckCircleIcon, WarningIcon } from '@phosphor-icons/react'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import type { Legal8Labels } from './types'

export interface Legal8StatusNoticeProps {
  labels: Legal8Labels
  locale: string
  nextSweepAt?: string | null
  onRun?: () => void
  pending?: boolean
  runError?: boolean
  running?: boolean
  stoppedSince?: string | null
  timeZone: string
}

const formatInstant = (
  value: string | null | undefined,
  format: Intl.DateTimeFormat,
) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : format.format(date)
}

const noticeState = (pending: boolean, stopped: boolean) => {
  if (pending) return 'loading'
  return stopped ? 'stopped' : 'up-to-date'
}

export function Legal8StatusNotice({
  labels,
  locale,
  nextSweepAt,
  onRun,
  pending = false,
  runError = false,
  running = false,
  stoppedSince,
  timeZone,
}: Readonly<Legal8StatusNoticeProps>) {
  const stoppedDay = formatInstant(
    stoppedSince,
    new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeZone }),
  )
  const nextSweep = formatInstant(
    nextSweepAt,
    new Intl.DateTimeFormat(locale, {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone,
    }),
  )
  const stopped = stoppedDay !== null

  return (
    <div className="grid gap-1" data-slot="legal-8-status">
      <Alert
        data-state={noticeState(pending, stopped)}
        role={stopped ? 'alert' : 'status'}
        variant={stopped ? 'error' : 'default'}
      >
        {stopped ? (
          <WarningIcon aria-hidden="true" />
        ) : (
          <CheckCircleIcon aria-hidden="true" />
        )}
        {pending ? null : (
          <AlertTitle>
            {stoppedDay === null ? labels.upToDate : labels.stopped(stoppedDay)}
          </AlertTitle>
        )}
        {nextSweep === null ? null : (
          <AlertDescription>{labels.nextSweep(nextSweep)}</AlertDescription>
        )}
        {onRun ? (
          <AlertAction>
            <Button
              disabled={running || pending}
              onClick={onRun}
              size="sm"
              type="button"
              variant="outline"
            >
              {stopped ? labels.retryNow : labels.runNow}
            </Button>
          </AlertAction>
        ) : null}
      </Alert>
      {runError ? (
        <p
          className="text-destructive-foreground text-sm"
          data-slot="legal-8-run-error"
          role="alert"
        >
          {labels.runFailed}
        </p>
      ) : null}
    </div>
  )
}
