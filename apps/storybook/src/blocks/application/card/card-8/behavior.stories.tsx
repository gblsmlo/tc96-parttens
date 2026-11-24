import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card8 } from '@tc96/ui/blocks/application/card/card-8'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { meetings } from '../fixtures/card-8.tsx'
import { type Card8Controls, card8ControlArgs } from './card-8-controls.ts'
import { ComposedCard8 } from './card-8-layouts.tsx'

const meta = {
  args: { ...card8ControlArgs, onActionSelect: fn(), onJoin: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card8/Behavior',
} satisfies Meta<
  Card8Controls & {
    onActionSelect: (meetingId: string, actionId: string) => void
    onJoin: (meetingId: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const MeetingShowsTimeDurationAndTag: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Apollo CRM - Planejamento da sprint',
    })
    await expect(within(card).getByText('09:00')).toBeVisible()
    await expect(within(card).getByText('30 min')).toBeVisible()
    await expect(within(card).getByText('Cliente')).toBeVisible()
    await expect(
      within(card).getByRole('list', { name: 'Participantes' }),
    ).toBeVisible()
  },
}

export const JoinCallsOnJoinWithTheMeetingId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Entrar na reunião Delta Finanças - Alinhamento de orçamento',
      }),
    )
    await expect(args.onJoin).toHaveBeenCalledWith('budget')
  },
}

export const MenuCallsOnActionSelect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Mais ações de Apollo CRM - Planejamento da sprint',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remarcar' }),
    )
    await expect(args.onActionSelect).toHaveBeenCalledWith(
      'sprint',
      'reschedule',
    )
  },
}

export const ActionsAreHiddenWithoutCallbacks: Story = {
  args: { withActions: false, withJoin: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const EmptyMeetingsShowTheEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma reunião agendada'),
    ).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Card8 meetings={meetings} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando reuniões'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Card8 error meetings={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar as reuniões'),
    ).toBeVisible()
  },
}
