import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScheduleCanvas } from './schedule-canvas.tsx'
import { scheduleControlArgs } from './schedule-controls.ts'
import { ComposedSchedule } from './schedule-layouts.tsx'

const meta = {
  decorators: [ScheduleCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedSchedule {...scheduleControlArgs} openOnMount />,
}

export const DateOnlyPopup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The presets and the calendar, with no Hora, Repetir and Lembretes footer under them. For a value that is only a day, such as a deadline.',
      },
    },
  },
  render: () => (
    <ComposedSchedule
      {...scheduleControlArgs}
      dateOnly
      openOnMount
      value="allDay"
    />
  ),
}

export const DrillIn: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The presets, the calendar and the footer rows, where a row replaces the whole popup with its editor and a Voltar button. For a narrow popup or a short window, where an editor opened under its row would not fit.',
      },
    },
  },
  render: () => (
    <ComposedSchedule
      {...scheduleControlArgs}
      footerLayout="drill-in"
      openOnMount
    />
  ),
}
