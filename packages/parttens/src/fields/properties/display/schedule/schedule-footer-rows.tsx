'use client'

import { cn } from '@tc96/utils'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { useId } from 'react'
import {
  type ScheduleFooterProps,
  type ScheduleSection,
  scheduleSectionIcons,
  scheduleSectionLabel,
  scheduleSections,
} from './schedule-section'
import { ScheduleSectionEditor } from './schedule-section-editor'
import { scheduleSectionSummary } from './schedule-summaries'

function SectionRow({
  expanded,
  panelId,
  props,
  rowRef,
  section,
}: Readonly<{
  props: ScheduleFooterProps
  section: ScheduleSection
  expanded?: boolean
  panelId?: string
  rowRef?: (element: HTMLButtonElement | null) => void
}>) {
  const labelId = useId()
  const valueId = useId()
  const Icon = scheduleSectionIcons[section]
  const Chevron = expanded === undefined ? ChevronRightIcon : ChevronDownIcon
  const summary = scheduleSectionSummary(section, props)

  return (
    <button
      aria-controls={panelId}
      aria-describedby={valueId}
      aria-expanded={expanded}
      aria-labelledby={labelId}
      className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      data-slot="schedule-section-row"
      disabled={!props.enabled[section]}
      onClick={() => props.onSelect(section)}
      ref={rowRef}
      type="button"
    >
      <Icon aria-hidden className="size-4 shrink-0 opacity-80" />
      <span className="shrink-0 text-start" id={labelId}>
        {scheduleSectionLabel(props.labels, section)}
      </span>
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-end text-xs',
          summary.filled ? 'text-foreground' : 'text-muted-foreground',
          expanded && 'invisible',
        )}
        id={valueId}
      >
        {summary.text}
      </span>
      <Chevron
        aria-hidden
        className={cn(
          'size-4 shrink-0 opacity-60 transition-transform',
          expanded && 'rotate-180',
        )}
      />
    </button>
  )
}

export function ScheduleFooterRows(props: Readonly<ScheduleFooterProps>) {
  const panelId = useId()

  return (
    <ul className="flex flex-col p-1" data-slot="schedule-sections">
      {scheduleSections.map((section) => {
        const expanded = props.active === section && props.enabled[section]

        return (
          <li key={section}>
            <SectionRow
              expanded={expanded}
              panelId={`${panelId}-${section}`}
              props={props}
              section={section}
            />
            {expanded ? (
              <fieldset
                aria-label={scheduleSectionLabel(props.labels, section)}
                className="mx-1 mb-1 min-w-0 rounded-md bg-muted/40"
                id={`${panelId}-${section}`}
              >
                <ScheduleSectionEditor {...props} section={section} />
              </fieldset>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

export function ScheduleFooterDrillIn({
  rowRef,
  ...props
}: Readonly<
  ScheduleFooterProps & {
    rowRef: (
      section: ScheduleSection,
    ) => (element: HTMLButtonElement | null) => void
  }
>) {
  return (
    <ul className="flex flex-col p-1" data-slot="schedule-sections">
      {scheduleSections.map((section) => (
        <li key={section}>
          <SectionRow
            props={props}
            rowRef={rowRef(section)}
            section={section}
          />
        </li>
      ))}
    </ul>
  )
}
