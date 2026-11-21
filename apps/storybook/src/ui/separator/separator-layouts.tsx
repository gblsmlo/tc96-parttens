import { Separator } from '@tc96/ui/separator'
import type { ReactNode } from 'react'
import type { SeparatorControls } from './separator-controls.ts'

type ComposedSeparatorProps = Omit<SeparatorControls, 'end' | 'start'> & {
  end: ReactNode
  start: ReactNode
}

export const ComposedSeparator = ({
  end,
  orientation,
  start,
}: Readonly<ComposedSeparatorProps>) => (
  <div
    className={
      orientation === 'vertical'
        ? 'flex items-center gap-4 text-sm'
        : 'flex flex-col gap-4 text-sm'
    }
  >
    {start ? <div>{start}</div> : null}
    <Separator orientation={orientation} />
    {end ? <div>{end}</div> : null}
  </div>
)

const SectionHeading = () => (
  <div className="flex flex-col gap-1">
    <span className="font-medium">Section title</span>
    <span className="text-muted-foreground">Section description</span>
  </div>
)

export const SectionAboveRow = () => (
  <ComposedSeparator
    end={
      <ComposedSeparator
        end="Second group"
        orientation="vertical"
        start="First group"
      />
    }
    orientation="horizontal"
    start={<SectionHeading />}
  />
)
