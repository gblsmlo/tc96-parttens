import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AgendaWidget,
  ProjectCardWidget,
  TaskProgressWidget,
  UpcomingEventWidget,
  WorldClockWidget,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ProductivityCanvas } from './productivity-canvas.tsx'

interface ProductivityBehaviorArgs {
  onCopy: (href: string) => void
  onPeriodChange: (period: string) => void
  onSelect: (date: Date) => void
  onSubtaskToggle: (id: string, done: boolean) => void
}

const meta = {
  args: {
    onCopy: fn(),
    onPeriodChange: fn(),
    onSelect: fn(),
    onSubtaskToggle: fn(),
  },
  argTypes: {
    onCopy: { control: false },
    onPeriodChange: { control: false },
    onSelect: { control: false },
    onSubtaskToggle: { control: false },
  },
  decorators: [ProductivityCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Productivity/Behavior',
} satisfies Meta<ProductivityBehaviorArgs>

export default meta

type Story = StoryObj<ProductivityBehaviorArgs>

const taskProgressData = [
  { label: 'Jan', value: 48 },
  { label: 'Feb', value: 92 },
  { label: 'Mar', value: 61 },
]

const taskProgressStats = [
  { id: 'progress', label: 'In progress', value: 152 },
  { id: 'todo', label: 'To do', value: 294 },
  { id: 'backlog', label: 'Backlog', value: 187 },
]

const monthOrQuarter = [
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
] as const

const meetingStart = new Date('2026-10-02T13:30:00Z')
const meetingEnd = new Date('2026-10-02T15:00:00Z')

const subtasks = [
  { done: true, id: 'interview', label: 'Interview with users' },
  { done: true, id: 'brainstorm', label: 'Brainstorm' },
  { done: false, id: 'wireframe', label: 'Wireframe design' },
  { done: false, id: 'visual', label: 'Visual design' },
]

const people = [
  { id: 'ana', label: 'Ana Martins' },
  { id: 'gabriel', label: 'Gabriel Melo' },
  { id: 'marina', label: 'Marina Souza' },
  { id: 'joao', label: 'João Lima' },
]

const agendaEvents = [
  {
    date: '2023-04-19',
    endLabel: '6:30 PM',
    id: 'yoga',
    startLabel: '5:30 PM',
    title: 'Yoga Class',
  },
  {
    date: '2023-04-20',
    id: 'gym',
    startLabel: '9:30 AM',
    title: 'Gym',
  },
]

const region = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

export const TaskProgressNamesItsChartAndCounters: Story = {
  render: () => (
    <TaskProgressWidget
      change={0.12}
      changeLabel="vs. last quarter"
      chartLabel="Tasks completed per month"
      data={taskProgressData}
      stats={taskProgressStats}
      title="Task progress"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('img', { name: 'Tasks completed per month' }),
    ).toBeVisible()
    await expect(canvas.getByText('294').tagName).toBe('DD')
  },
}

export const TaskProgressEmitsThePeriod: Story = {
  render: ({ onPeriodChange }) => (
    <TaskProgressWidget
      chartLabel="Tasks completed per month"
      data={taskProgressData}
      onPeriodChange={onPeriodChange}
      period="quarter"
      periods={monthOrQuarter}
      title="Task progress"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Month' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledOnce()
    await expect(args.onPeriodChange).toHaveBeenLastCalledWith('month')
  },
}

export const TaskProgressMovesTheTrendWithThePeriods: Story = {
  render: () => (
    <div className="grid gap-4">
      <TaskProgressWidget
        change={0.12}
        changeLabel="vs. last quarter"
        data={taskProgressData}
        period="quarter"
        periods={monthOrQuarter}
        title="With periods"
      />
      <TaskProgressWidget
        change={0.12}
        changeLabel="vs. last quarter"
        data={taskProgressData}
        title="Without periods"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const header = (name: string) =>
      region(canvasElement, name).querySelector('[data-slot="card-header"]')
    await expect(region(canvasElement, 'With periods').textContent).toContain(
      'Alta de 12.00%',
    )
    await expect(header('With periods')?.textContent).not.toContain(
      'Alta de 12.00%',
    )
    await expect(header('Without periods')?.textContent).toContain(
      'Alta de 12.00%',
    )
  },
}

export const InvertedTaskProgressScopesDarkTheme: Story = {
  render: () => (
    <TaskProgressWidget
      data={taskProgressData}
      stats={taskProgressStats}
      title="Task progress"
      tone="inverted"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="task-progress-widget-scope"]'),
    ).toHaveClass('dark')
    await expect(region(canvasElement, 'Task progress')).toHaveAttribute(
      'data-tone',
      'inverted',
    )
  },
}

export const UpcomingEventPlacesTheSlotInItsWindow: Story = {
  render: () => (
    <UpcomingEventWidget
      end={meetingEnd}
      eyebrow="In 30 minutes"
      start={meetingStart}
      timeZone="UTC"
      title="Meeting with Product team"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      region(canvasElement, 'Meeting with Product team'),
    ).toBeVisible()
    const timeline = canvas.getByRole('img', { name: '1:30 PM – 3:00 PM' })
    const slot = timeline.querySelector<HTMLElement>(
      '[data-slot="upcoming-event-slot"]',
    )
    await expect(slot?.style.left).toBe('20%')
    await expect(slot?.style.width).toBe('60%')
    await expect(timeline.textContent).toContain('1:00 PM')
    await expect(timeline.textContent).toContain('3:30 PM')
  },
}

export const UpcomingEventLinksToTheMeeting: Story = {
  render: () => (
    <UpcomingEventWidget
      end={meetingEnd}
      joinHref="https://meet.google.com/nax-wqkf-stu"
      joinLabel="Join on Google Meet"
      start={meetingStart}
      timeZone="UTC"
      title="Meeting with Product team"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Join on Google Meet' }),
    ).toHaveAttribute('href', 'https://meet.google.com/nax-wqkf-stu')
  },
}

export const UpcomingEventCopiesTheLink: Story = {
  render: ({ onCopy }) => (
    <UpcomingEventWidget
      end={meetingEnd}
      joinHref="https://meet.google.com/nax-wqkf-stu"
      joinLabel="Join on Google Meet"
      joinText="meet.google.com/nax-wqkf-stu"
      onCopy={onCopy}
      start={meetingStart}
      timeZone="UTC"
      title="Meeting with Product team"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Copiar link' }),
    )
    await expect(args.onCopy).toHaveBeenCalledOnce()
    await expect(args.onCopy).toHaveBeenLastCalledWith(
      'https://meet.google.com/nax-wqkf-stu',
    )
  },
}

export const UpcomingEventMarksALiveEvent: Story = {
  render: () => (
    <UpcomingEventWidget
      end={meetingEnd}
      eyebrow="In 30 minutes"
      live
      start={meetingStart}
      timeZone="UTC"
      title="Meeting with Product team"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="upcoming-event-live"]'),
    ).not.toBeNull()
  },
}

export const ProjectCardDerivesProgressFromSubtasks: Story = {
  render: () => (
    <ProjectCardWidget subtasks={subtasks} title="Design Website" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const meter = canvas.getByRole('meter', { name: 'Progresso' })
    await expect(meter).toHaveAttribute('aria-valuenow', '50')
    await expect(
      canvas.getByRole('region', { name: 'Design Website' }),
    ).toHaveTextContent('Progresso50%')
    await expect(
      canvas.getByRole('list', { name: 'Subtarefas' }).querySelectorAll('li'),
    ).toHaveLength(4)
  },
}

export const ProjectCardProgressPropWinsOverSubtasks: Story = {
  render: () => (
    <ProjectCardWidget
      progress={0.8}
      subtasks={subtasks}
      title="Design Website"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('meter', { name: 'Progresso' }),
    ).toHaveAttribute('aria-valuenow', '80')
  },
}

export const ProjectCardReportsASubtaskToggle: Story = {
  render: ({ onSubtaskToggle }) => (
    <ProjectCardWidget
      onSubtaskToggle={onSubtaskToggle}
      subtasks={subtasks}
      title="Design Website"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('checkbox', { name: 'Wireframe design' }),
    )
    await expect(args.onSubtaskToggle).toHaveBeenCalledOnce()
    await expect(args.onSubtaskToggle).toHaveBeenLastCalledWith(
      'wireframe',
      true,
    )
  },
}

export const ProjectCardStacksPeople: Story = {
  render: () => (
    <ProjectCardWidget
      people={people}
      subtasks={subtasks}
      title="Design Website"
    />
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Pessoas' })
    await expect(list.textContent).toContain('+1')
    await expect(list.textContent).toContain('João Lima')
  },
}

export const AgendaListsEventsOfTheSelectedDay: Story = {
  render: () => (
    <AgendaWidget
      defaultSelected={new Date(2023, 3, 19)}
      events={agendaEvents}
      title="April, 2023"
    />
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Eventos do dia',
    })
    await expect(list.textContent).toContain('Yoga Class')
    await expect(list.textContent).toContain('5:30 PM – 6:30 PM')
    await expect(list.textContent).not.toContain('Gym')
  },
}

export const AgendaEmitsTheSelectedDate: Story = {
  render: ({ onSelect }) => (
    <AgendaWidget
      defaultSelected={new Date(2023, 3, 19)}
      events={agendaEvents}
      onSelect={onSelect}
      title="April, 2023"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Thursday, April 20th, 2023' }),
    )
    await expect(args.onSelect).toHaveBeenCalledOnce()
    const [selected] = (
      args.onSelect as unknown as { mock: { calls: Date[][] } }
    ).mock.calls[0] ?? [new Date(0)]
    await expect(selected?.toDateString()).toBe(
      new Date(2023, 3, 20).toDateString(),
    )
    await expect(
      canvas.getByRole('list', { name: 'Eventos do dia' }).textContent,
    ).toContain('Gym')
  },
}

export const AgendaShowsTheEmptyLabel: Story = {
  render: () => (
    <AgendaWidget
      defaultSelected={new Date(2023, 3, 19)}
      events={agendaEvents}
      title="April, 2023"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Friday, April 21st, 2023' }),
    )
    await expect(canvas.getByText('Sem eventos')).toBeVisible()
  },
}

export const WorldClockRendersZonesFromOneInstant: Story = {
  render: () => (
    <WorldClockWidget
      clocks={[
        { id: 'paris', label: 'Paris', meta: '22°C', timeZone: 'Europe/Paris' },
        {
          id: 'london',
          label: 'London',
          meta: '20°C',
          timeZone: 'Europe/London',
        },
      ]}
      now={new Date('2026-10-02T20:11:20Z')}
    />
  ),
  play: async ({ canvasElement }) => {
    const widget = region(canvasElement, 'Relógios')
    const times = [...widget.querySelectorAll('time')]
    await expect(times.map((time) => time.textContent)).toEqual([
      '10:11:20 PM',
      '9:11:20 PM',
    ])
    await expect(times[0]).toHaveAttribute(
      'dateTime',
      '2026-10-02T20:11:20.000Z',
    )
    await expect(widget.textContent).toContain('Paris')
    await expect(widget.textContent).toContain('22°C')
  },
}
