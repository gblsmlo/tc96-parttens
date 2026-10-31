import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordPreviewAction } from '@tc96/parttens'
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

const open = fn()

const meta = {
  args: {
    children: <svg aria-hidden="true" />,
    label: 'Open as page',
    onClick: open,
  },
  component: RecordPreviewAction,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Composition/Action',
} satisfies Meta<typeof RecordPreviewAction>

export default meta
type Story = StoryObj<typeof meta>

export const NamedByLabelAndClicks: Story = {
  play: async ({ canvasElement }) => {
    open.mockClear()
    const button = within(canvasElement).getByRole('button', {
      name: 'Open as page',
    })

    await userEvent.click(button)

    await expect(button).toHaveAttribute('aria-label', 'Open as page')
    await expect(open).toHaveBeenCalledTimes(1)
  },
}

export const LabelIsTheTooltipText: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(
      within(canvasElement).getByRole('button', { name: 'Open as page' }),
    ).toHaveFocus()

    await waitFor(() =>
      expect(
        canvasElement.ownerDocument.querySelector('[data-slot="tooltip-popup"]')
          ?.textContent,
      ).toBe('Open as page'),
    )
  },
}

export const DisabledDoesNotClick: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    open.mockClear()

    fireEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open as page' }),
    )

    await expect(open).not.toHaveBeenCalled()
  },
}
