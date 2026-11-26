import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Action } from '@tc96/ui/patterns/collection/shared/components/collection-action'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import { Text } from '@tc96/ui/text'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { agenda1Periods } from './agenda-1-options'
import type { Agenda1Labels, Agenda1Period } from './types'

export interface Agenda1ToolbarProps {
  labels: Agenda1Labels
  onCreate?: () => void
  onNext: () => void
  onPeriodChange: (period: Agenda1Period) => void
  onPrevious: () => void
  onToday: () => void
  period: Agenda1Period
  periodTitle: string
}

const isPeriod = (value: string): value is Agenda1Period =>
  agenda1Periods.some((item) => item === value)

export function Agenda1Toolbar({
  labels,
  onCreate,
  onNext,
  onPeriodChange,
  onPrevious,
  onToday,
  period,
  periodTitle,
}: Readonly<Agenda1ToolbarProps>) {
  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      center={
        <ToggleGroup
          aria-label={labels.period}
          onValueChange={(next) => {
            const [value] = next as string[]
            if (value && isPeriod(value)) onPeriodChange(value)
          }}
          value={[period]}
        >
          {agenda1Periods.map((item) => (
            <ToggleGroupItem
              key={item}
              render={
                <Button
                  size="sm"
                  variant={item === period ? 'secondary' : 'ghost'}
                />
              }
              value={item}
            >
              {labels.periods[item]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      left={
        <div className="flex min-w-0 items-center gap-2">
          <ToolbarButton
            onClick={onToday}
            render={<Button type="button" variant="secondary" />}
          >
            {labels.today}
          </ToolbarButton>
          <ToolbarButton
            aria-label={labels.previous}
            onClick={onPrevious}
            render={<Button size="icon-sm" type="button" variant="ghost" />}
          >
            <CaretLeftIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton
            aria-label={labels.next}
            onClick={onNext}
            render={<Button size="icon-sm" type="button" variant="ghost" />}
          >
            <CaretRightIcon aria-hidden="true" />
          </ToolbarButton>
          <Text
            aria-live="polite"
            className="min-w-0 first-letter:uppercase"
            render={<p />}
            size="sm"
            truncate
            weight="medium"
          >
            {periodTitle}
          </Text>
        </div>
      }
      right={
        onCreate ? <Action label={labels.create} onClick={onCreate} /> : null
      }
    />
  )
}
