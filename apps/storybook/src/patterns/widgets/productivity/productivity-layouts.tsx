import {
  ChatIcon,
  DotsThreeIcon,
  PaperclipIcon,
  PlusIcon,
  VideoCameraIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  AgendaWidget,
  ProjectCardWidget,
  TaskProgressWidget,
  UpcomingEventWidget,
  WorldClockWidget,
} from '@tc96/ui/patterns'
import { type ReactElement, useState } from 'react'
import type {
  ProductivityControls,
  ProductivityTone,
} from './productivity-controls.ts'
import {
  agendaEvents,
  clockInstant,
  clocks,
  initialSubtasks,
  meetingEnd,
  meetingStart,
  type ProgressPeriod,
  progressChange,
  progressPeriods,
  progressSeries,
  projectPeople,
  projectTags,
  taskStats,
} from './productivity-data.ts'

export function TaskProgress({
  periods = true,
  title = 'Task progress',
  tone = 'default',
}: Readonly<{
  periods?: boolean | undefined
  title?: string | undefined
  tone?: ProductivityTone | undefined
}>): ReactElement {
  const [period, setPeriod] = useState<ProgressPeriod>('quarter')

  return (
    <TaskProgressWidget
      change={progressChange[period]}
      changeLabel="vs. previous period"
      chartLabel="Tasks completed per period"
      data={progressSeries[period]}
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Progress period"
      periods={periods ? progressPeriods : []}
      stats={taskStats}
      title={title}
      tone={tone}
    />
  )
}

export function ProductMeeting({
  live = false,
  title = 'Meeting with Product team',
}: Readonly<{
  live?: boolean | undefined
  title?: string | undefined
}>): ReactElement {
  const [copied, setCopied] = useState(false)

  return (
    <UpcomingEventWidget
      end={meetingEnd}
      eyebrow={copied ? 'Link copied' : 'In 30 minutes'}
      joinHref="https://meet.google.com/nax-wqkf-stu"
      joinLabel="Join on Google Meet"
      joinText="meet.google.com/nax-wqkf-stu"
      live={live}
      onCopy={() => setCopied(true)}
      provider={<VideoCameraIcon aria-hidden="true" />}
      start={meetingStart}
      timeZone="UTC"
      title={title}
    />
  )
}

export function DesignWebsite({
  action = true,
  title = 'Design Website',
}: Readonly<{
  action?: boolean | undefined
  title?: string | undefined
}>): ReactElement {
  const [subtasks, setSubtasks] = useState(initialSubtasks)

  return (
    <ProjectCardWidget
      action={
        action ? (
          <Button aria-label="More options" size="icon-sm" variant="ghost">
            <DotsThreeIcon aria-hidden="true" />
          </Button>
        ) : undefined
      }
      description="Design an attractive women's clothing store website in a responsive manner that users will enjoy and have no problems using."
      endLabel="25 May"
      footer={
        <Button className="w-full" variant="outline">
          <PlusIcon aria-hidden="true" />
          Add task
        </Button>
      }
      meta={
        <>
          <span className="inline-flex items-center gap-1">
            <ChatIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">Comments:</span>2
          </span>
          <span className="inline-flex items-center gap-1">
            <PaperclipIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">Attachments:</span>10
          </span>
        </>
      }
      onSubtaskToggle={(id, done) =>
        setSubtasks((current) =>
          current.map((subtask) =>
            subtask.id === id ? { ...subtask, done } : subtask,
          ),
        )
      }
      people={projectPeople}
      startLabel="10 May"
      subtasks={subtasks}
      tags={projectTags}
      title={title}
    />
  )
}

export function Agenda({
  action = false,
  empty = false,
  title = 'Agenda',
}: Readonly<{
  action?: boolean | undefined
  empty?: boolean | undefined
  title?: string | undefined
}>): ReactElement {
  return (
    <AgendaWidget
      action={
        action ? (
          <Button size="sm" variant="ghost">
            Add event
          </Button>
        ) : undefined
      }
      defaultSelected={new Date(2023, 3, 19)}
      events={empty ? [] : agendaEvents}
      title={title}
    />
  )
}

export function Clocks({
  title = 'World clock',
}: Readonly<{ title?: string | undefined }>): ReactElement {
  return <WorldClockWidget clocks={clocks} label={title} now={clockInstant} />
}

export function ComposedProductivity({
  action,
  empty,
  live,
  periods,
  title,
  tone,
  widget,
}: Readonly<ProductivityControls>): ReactElement {
  const label = title || undefined

  if (widget === 'upcoming-event')
    return <ProductMeeting live={live} title={label} />
  if (widget === 'project-card')
    return <DesignWebsite action={action} title={label} />
  if (widget === 'agenda')
    return <Agenda action={action} empty={empty} title={label} />
  if (widget === 'world-clock') return <Clocks title={label} />
  return <TaskProgress periods={periods} title={label} tone={tone} />
}

export function SubtasksOnlyProject(): ReactElement {
  return <ProjectCardWidget subtasks={initialSubtasks} title="Design Website" />
}

export function MeetingWithoutLink(): ReactElement {
  return (
    <UpcomingEventWidget
      end={meetingEnd}
      eyebrow="In 30 minutes"
      start={meetingStart}
      timeZone="UTC"
      title="Meeting with Product team"
    />
  )
}

export function ClocksWithoutSeconds(): ReactElement {
  return (
    <WorldClockWidget
      clocks={clocks}
      label="World clock"
      now={clockInstant}
      showSeconds={false}
    />
  )
}
