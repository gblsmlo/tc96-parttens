import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { IconFrame } from '@tc96/ui/icon-frame'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { cloneElement, type ReactElement } from 'react'
import { defaultCard5Labels } from './labels'
import type { Card5Props, Card5Shortcut } from './types'

const tileClassName =
  'flex flex-1 flex-col items-start gap-3 rounded-[inherit] p-5 text-left outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring'

export function Card5({
  className,
  labels: labelsProp,
  onSelect,
  renderLink = renderAnchor,
  shortcuts,
}: Readonly<Card5Props>) {
  const labels = { ...defaultCard5Labels, ...labelsProp }

  if (shortcuts.length === 0) {
    return (
      <StateSurface
        className={className}
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )
  }

  const renderTile = (shortcut: Card5Shortcut) => {
    const ShortcutIcon = shortcut.icon
    const content = (
      <>
        <IconFrame shape="rounded">
          <ShortcutIcon />
        </IconFrame>
        <span className="grid gap-1">
          <span className="font-medium">{shortcut.title}</span>
          <span className="text-muted-foreground text-sm">
            {shortcut.description}
          </span>
        </span>
      </>
    )

    if (shortcut.href) {
      return cloneElement(
        renderLink(shortcut.href) as ReactElement<{ className: string }>,
        { className: tileClassName },
        content,
      )
    }

    return (
      <button
        className={tileClassName}
        onClick={() => onSelect?.(shortcut.id)}
        type="button"
      >
        {content}
      </button>
    )
  }

  return (
    <section aria-label={labels.title} className={className}>
      <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <li className="min-w-0" key={shortcut.id}>
            <WidgetShell
              className="h-full"
              data-shortcut={shortcut.id}
              render={<div />}
            >
              {renderTile(shortcut)}
            </WidgetShell>
          </li>
        ))}
      </ul>
    </section>
  )
}
