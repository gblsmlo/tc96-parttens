import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { TooltipFrame } from './tooltip-frame.tsx'

const meta = {
  args: { defaultOpen: true },
  component: Tooltip,
  decorators: [TooltipFrame],
  parameters: {
    docs: { story: { iframeHeight: '200px', inline: false } },
  },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger className="rounded-md p-1">
        <Slot name="TooltipTrigger" />
      </TooltipTrigger>
      <TooltipPopup>
        <Slot name="TooltipPopup" />
      </TooltipPopup>
    </Tooltip>
  ),
  tags: ['!autodocs', '!dev'],
  title: 'UI/Tooltip/API Reference',
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}

export const AnatomySlots: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'TooltipTrigger',
    })
    await expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger')
    const slot = await screen.findByText('TooltipPopup')
    const popup = slot.closest<HTMLElement>('[data-slot="tooltip-popup"]')
    await waitFor(() => expect(popup).toBeVisible())
    await expect(
      slot.closest('[data-slot="tooltip-viewport"]')?.parentElement,
    ).toBe(popup)
    await expect(
      popup?.closest('[data-slot="tooltip-positioner"]'),
    ).not.toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toBeNull(),
    )
  },
}
