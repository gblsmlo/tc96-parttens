'use client'

import { Button } from '@tc96/ui/button'
import { Separator } from '@tc96/ui/separator'
import { ChevronLeftIcon } from 'lucide-react'
import {
  type ScheduleEditorProps,
  type ScheduleSection,
  scheduleSectionLabel,
} from './schedule-section'
import { ScheduleSectionEditor } from './schedule-section-editor'

export function ScheduleDetailView({
  onBack,
  section,
  ...props
}: Readonly<
  ScheduleEditorProps & {
    onBack: () => void
    section: ScheduleSection
  }
>) {
  return (
    <div className="flex flex-col" data-slot="schedule-detail">
      <div className="flex items-center justify-between gap-2 p-1">
        <Button
          autoFocus
          className="-ms-1"
          onClick={onBack}
          size="sm"
          type="button"
          variant="ghost"
        >
          <ChevronLeftIcon aria-hidden />
          {props.labels.back}
        </Button>
        <span className="pe-2 font-medium text-sm">
          {scheduleSectionLabel(props.labels, section)}
        </span>
      </div>
      <Separator className="my-1" />
      <ScheduleSectionEditor {...props} section={section} />
    </div>
  )
}
