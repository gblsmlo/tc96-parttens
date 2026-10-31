import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AgendaWidget,
  ProjectCardWidget,
  TaskProgressWidget,
  UpcomingEventWidget,
  WorldClockWidget,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const onPeriodChange = fn()
const onCopy = fn()
const onSubtaskToggle = fn()
const onSelect = fn()

const calendarContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector: '*:not([data-slot="calendar"] *)',
        },
      ],
    },
  },
}

const meta = {
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Productivity/Behavior',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TaskProgressNamesChartAndListsCounters: Story = {
  play: async ({ canvasElement }) => {
    onPeriodChange.mockClear()
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Task progress' })
    await expect(
      canvas.getByRole('img', { name: 'Tasks completed per month' }),
    ).toBeVisible()
    await expect(region.textContent).toContain('Alta de 12.00%')
    await expect(canvas.getByText('294').tagName).toBe('DD')
    await expect(
      canvasElement.querySelector('[data-slot="task-progress-widget-scope"]'),
    ).toHaveClass('dark')
    await userEvent.click(canvas.getByRole('button', { name: 'Month' }))
    await expect(onPeriodChange).toHaveBeenCalledTimes(1)
    await expect(onPeriodChange).toHaveBeenCalledWith('month')
  },
  render: () => (
    <TaskProgressWidget
      change={0.12}
      changeLabel="vs. last quarter"
      chartLabel="Tasks completed per month"
      data={[
        { label: 'Jan', value: 48 },
        { label: 'Feb', value: 92 },
        { label: 'Mar', value: 61 },
      ]}
      onPeriodChange={onPeriodChange}
      period="quarter"
      periods={[
        { label: 'Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
      ]}
      stats={[
        { id: 'progress', label: 'In progress', value: 152 },
        { id: 'todo', label: 'To do', value: 294 },
        { id: 'backlog', label: 'Backlog', value: 187 },
      ]}
      title="Task progress"
      tone="inverted"
    />
  ),
}

export const UpcomingEventPlacesSlotAndCopiesLink: Story = {
  play: async ({ canvasElement }) => {
    onCopy.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Meeting with Product team' }),
    ).toBeVisible()
    const timeline = canvas.getByRole('img', { name: '1:30 PM – 3:00 PM' })
    const slot = timeline.querySelector<HTMLElement>(
      '[data-slot="upcoming-event-slot"]',
    )
    await expect(slot?.style.left).toBe('20%')
    await expect(slot?.style.width).toBe('60%')
    await expect(timeline.textContent).toContain('1:00 PM')
    await expect(timeline.textContent).toContain('3:30 PM')
    await expect(
      canvas.getByRole('link', { name: 'Join on Google Meet' }),
    ).toHaveAttribute('href', 'https://meet.google.com/nax-wqkf-stu')
    await userEvent.click(canvas.getByRole('button', { name: 'Copiar link' }))
    await expect(onCopy).toHaveBeenCalledTimes(1)
    await expect(onCopy).toHaveBeenCalledWith(
      'https://meet.google.com/nax-wqkf-stu',
    )
    await expect(
      canvasElement.querySelector('[data-slot="upcoming-event-live"]'),
    ).not.toBeNull()
  },
  render: () => (
    <UpcomingEventWidget
      end={new Date('2026-10-02T15:00:00Z')}
      eyebrow="In 30 minutes"
      joinHref="https://meet.google.com/nax-wqkf-stu"
      joinLabel="Join on Google Meet"
      joinText="meet.google.com/nax-wqkf-stu"
      live
      onCopy={onCopy}
      start={new Date('2026-10-02T13:30:00Z')}
      timeZone="UTC"
      title="Meeting with Product team"
    />
  ),
}

export const ProjectCardDerivesProgressFromSubtasks: Story = {
  play: async ({ canvasElement }) => {
    onSubtaskToggle.mockClear()
    const canvas = within(canvasElement)
    const meter = canvas.getByRole('meter', { name: 'Progresso' })
    await expect(meter).toHaveAttribute('aria-valuenow', '50')
    await expect(meter.textContent).toContain('50%')
    const subtasks = canvas.getByRole('list', { name: 'Subtarefas' })
    await expect(subtasks.querySelectorAll('li')).toHaveLength(4)
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Wireframe design' }),
    )
    await expect(onSubtaskToggle).toHaveBeenCalledTimes(1)
    await expect(onSubtaskToggle).toHaveBeenCalledWith('wireframe', true)
    const people = canvas.getByRole('list', { name: 'Pessoas' })
    await expect(people.textContent).toContain('+1')
    await expect(people.textContent).toContain('João Lima')
  },
  render: () => (
    <ProjectCardWidget
      endLabel="25 May"
      onSubtaskToggle={onSubtaskToggle}
      people={[
        { id: 'ana', label: 'Ana Martins' },
        { id: 'gabriel', label: 'Gabriel Melo' },
        { id: 'marina', label: 'Marina Souza' },
        { id: 'joao', label: 'João Lima' },
      ]}
      startLabel="10 May"
      subtasks={[
        { done: true, id: 'interview', label: 'Interview with users' },
        { done: true, id: 'brainstorm', label: 'Brainstorm' },
        { done: false, id: 'wireframe', label: 'Wireframe design' },
        { done: false, id: 'visual', label: 'Visual design' },
      ]}
      tags={[
        { id: 'design', label: 'Design' },
        { id: 'web', label: 'Website' },
      ]}
      title="Design Website"
    />
  ),
}

export const AgendaListsEventsOfSelectedDay: Story = {
  parameters: calendarContrast,
  play: async ({ canvasElement }) => {
    onSelect.mockClear()
    const canvas = within(canvasElement)
    const list = canvas.getByRole('list', { name: 'Eventos do dia' })
    await expect(list.textContent).toContain('Yoga Class')
    await expect(list.textContent).toContain('5:30 PM – 6:30 PM')
    await expect(list.textContent).not.toContain('Gym')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Thursday, April 20th, 2023' }),
    )
    await expect(onSelect).toHaveBeenCalledTimes(1)
    await expect((onSelect.mock.calls[0]?.[0] as Date).toDateString()).toBe(
      new Date(2023, 3, 20).toDateString(),
    )
    await expect(
      canvas.getByRole('list', { name: 'Eventos do dia' }).textContent,
    ).toContain('Gym')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Friday, April 21st, 2023' }),
    )
    await expect(canvas.getByText('Sem eventos')).toBeVisible()
  },
  render: () => (
    <AgendaWidget
      defaultSelected={new Date(2023, 3, 19)}
      events={[
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
      ]}
      onSelect={onSelect}
      title="April, 2023"
    />
  ),
}

export const WorldClockRendersZonesFromOneInstant: Story = {
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Relógios',
    })
    const times = [...region.querySelectorAll('time')]
    await expect(times.map((time) => time.textContent)).toEqual([
      '10:11:20 PM',
      '9:11:20 PM',
    ])
    await expect(times[0]).toHaveAttribute(
      'dateTime',
      '2026-10-02T20:11:20.000Z',
    )
    await expect(region.textContent).toContain('Paris')
    await expect(region.textContent).toContain('22°C')
  },
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
}
