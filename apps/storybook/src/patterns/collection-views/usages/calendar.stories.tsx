import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarUsage } from '../fixtures/calendar-usage'

const meta = {
  component: CalendarUsage,
  parameters: {
    docs: {
      description: {
        component: [
          'The sales calendar of the Pipeline usage as a `CalendarView` alone: calls, meetings, demos and proposals tied to each deal, plus the expected close date of every open deal as an all-day item.',
          'The toolbar moves the period and switches Dia/Semana/Mês, and the `ViewSettingsMenu` filters by owner, activity type and deal stage. Dragging an activity or its top and bottom edges writes the new window through `onItemReschedule`. Interaction coverage lives in `Views/Calendar/Interactions`.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Usages/Calendar',
} satisfies Meta<typeof CalendarUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
