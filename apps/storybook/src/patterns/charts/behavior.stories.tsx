import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { AccountHealth } from './account-health'
import { accounts } from './fixtures/accounts'

const meta = {
  args: { onFocusChange: fn() },
  component: AccountHealth,
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Charts/Behavior',
} satisfies Meta<typeof AccountHealth>

export default meta

type Story = StoryObj<typeof meta>

export const NamedByAriaLabel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Account retention by monthly revenue'),
    ).toBeInTheDocument()
  },
}

export const FocusReturnsTheAccountRow: Story = {
  play: async ({ args, canvasElement }) => {
    const chart = within(canvasElement).getByLabelText(
      'Account retention by monthly revenue',
    )
    await userEvent.tab()
    await expect(chart).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(args.onFocusChange).toHaveBeenCalled())
    const [focused] =
      (args.onFocusChange as ReturnType<typeof fn>).mock.lastCall ?? []
    await expect(accounts).toContain(focused)
  },
}
