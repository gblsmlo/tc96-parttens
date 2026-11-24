import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card4 } from '@tc96/blocks/application/card/card-4'
import { expect, fn, userEvent, within } from 'storybook/test'
import { meetings } from '../fixtures/card-4.ts'
import { type Card4Controls, card4ControlArgs } from './card-4-controls.ts'
import { ComposedCard4 } from './card-4-layouts.tsx'

const meta = {
  args: { ...card4ControlArgs, onJoin: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card4/Behavior',
} satisfies Meta<Card4Controls & { onJoin: (meetingId: string) => void }>

export default meta

type Story = StoryObj<typeof meta>

export const MeetingsShowTimeAndDuration: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(
      meetings.length,
    )
    await expect(canvas.getByText('Planejamento da sprint')).toBeVisible()
    await expect(canvas.getByText('09:00 - 09:45')).toBeVisible()
    await expect(canvas.getByText('45 min')).toBeVisible()
  },
}

export const AttendeesCollapseIntoCounter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const stack = canvas.getByRole('list', {
      name: 'Participantes de Planejamento da sprint',
    })
    await expect(within(stack).getAllByRole('listitem')).toHaveLength(5)
    await expect(within(stack).getByText('+2')).toBeVisible()
  },
}

export const JoinCallsOnJoinWithTheMeetingId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Entrar na reunião Revisão de design',
      }),
    )
    await expect(args.onJoin).toHaveBeenCalledTimes(1)
    await expect(args.onJoin).toHaveBeenCalledWith('review')
  },
}

export const JoinIsHiddenWithoutOnJoin: Story = {
  args: { withJoin: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Entrar/ }),
    ).toBeNull()
  },
}

export const EmptyMeetingsShowTheEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma reunião hoje')).toBeVisible()
    await expect(canvas.queryByRole('listitem')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Card4
      labels={{
        join: 'Participar',
        joinMeeting: (title) => `Participar de ${title}`,
        title: 'Hoje',
      }}
      meetings={meetings}
      onJoin={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Hoje' })).toBeVisible()
    await expect(
      canvas.getAllByRole('button', { name: /Participar de/ }),
    ).toHaveLength(meetings.length)
    await expect(canvas.queryByRole('button', { name: /Entrar/ })).toBeNull()
  },
}
