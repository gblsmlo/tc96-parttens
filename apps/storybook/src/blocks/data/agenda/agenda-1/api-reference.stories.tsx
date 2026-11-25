import type { Meta, StoryObj } from '@storybook/react-vite'
import { Agenda1 } from '@tc96/ui/blocks/data/agenda/agenda-1'
import { fn } from 'storybook/test'
import {
  agendaAnchor,
  agendaNow,
  agendaTimeZone,
  entries,
  owners,
} from '../fixtures/agenda-1.ts'

const meta = {
  args: {
    anchor: agendaAnchor,
    entries,
    now: agendaNow,
    onAnchorChange: fn(),
    onCancel: fn(),
    onCreate: fn(),
    onKindFilterChange: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onPeriodChange: fn(),
    onReschedule: fn(() => true),
    owners,
    period: 'week',
    timeZone: agendaTimeZone,
  },
  component: Agenda1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Agenda/Agenda1/API Reference',
} satisfies Meta<typeof Agenda1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
