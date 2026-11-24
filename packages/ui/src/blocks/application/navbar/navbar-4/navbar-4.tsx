import { ClockCounterClockwiseIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { defaultNavbar4Labels } from './labels'
import type { Navbar4Props } from './types'

export function Navbar4({
  active,
  className,
  labels: labelsProp,
  onActiveChange,
  onClose,
  onHistory,
  onSubmit,
  onTest,
  pending = false,
  savedText,
  title,
}: Readonly<Navbar4Props>) {
  const labels = { ...defaultNavbar4Labels, ...labelsProp }
  const activeLabelId = useId()

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center gap-3 border-b bg-background px-4 text-foreground',
        className,
      )}
      data-slot="navbar-4"
    >
      {onClose ? (
        <Button
          aria-label={labels.close}
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <XIcon aria-hidden="true" />
        </Button>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate font-medium text-sm" data-slot="navbar-title">
          {title}
        </h1>
        {savedText ? (
          <p
            className="truncate text-muted-foreground text-xs"
            data-slot="navbar-saved"
          >
            {savedText}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onActiveChange ? (
          <div className="flex items-center gap-2">
            <span className="text-sm" id={activeLabelId}>
              {labels.active}
            </span>
            <Switch
              aria-labelledby={activeLabelId}
              checked={Boolean(active)}
              onCheckedChange={onActiveChange}
            />
          </div>
        ) : null}
        {onTest ? (
          <Button
            disabled={pending}
            onClick={onTest}
            size="sm"
            variant="outline"
          >
            {labels.test}
          </Button>
        ) : null}
        {onHistory ? (
          <Button
            aria-label={labels.history}
            onClick={onHistory}
            size="icon-sm"
            variant="ghost"
          >
            <ClockCounterClockwiseIcon aria-hidden="true" />
          </Button>
        ) : null}
        {onSubmit ? (
          <Button
            aria-busy={pending}
            disabled={pending}
            onClick={onSubmit}
            size="sm"
          >
            {labels.submit}
          </Button>
        ) : null}
      </div>
    </header>
  )
}
