import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordPreviewAction,
  type RecordPreviewActionProps,
} from '@tc96/ui/patterns'
import {
  expect,
  fireEvent,
  fn,
  mocked,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

const tooltipPopup = (canvasElement: HTMLElement) =>
  canvasElement.ownerDocument.querySelector('[data-slot="tooltip-popup"]')

const clicks = (args: RecordPreviewActionProps) =>
  mocked(args.onClick as () => void)

const meta = {
  args: {
    children: <svg aria-hidden="true" />,
    label: 'Open as page',
    onClick: fn(),
  },
  render: (args) => <RecordPreviewAction {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Behavior',
} satisfies Meta<typeof RecordPreviewAction>

export default meta

type Story = StoryObj<typeof meta>

export const ActionNamedByTheLabel: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Open as page',
    })

    await expect(button).toHaveAttribute('aria-label', 'Open as page')
    await expect(button.textContent).toBe('')
  },
}

export const ActionClickCallsOnClick: Story = {
  play: async ({ args, canvasElement }) => {
    clicks(args).mockClear()

    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open as page' }),
    )

    await expect(clicks(args)).toHaveBeenCalledOnce()
  },
}

export const ActionLabelIsTheTooltipText: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(
      within(canvasElement).getByRole('button', { name: 'Open as page' }),
    ).toHaveFocus()

    await waitFor(
      () =>
        expect(tooltipPopup(canvasElement)?.textContent).toBe('Open as page'),
      { timeout: 5000 },
    )

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(tooltipPopup(canvasElement)).toBeNull(), {
      timeout: 5000,
    })
  },
}

export const ActionDisabledDoesNotClick: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    clicks(args).mockClear()
    const button = within(canvasElement).getByRole('button', {
      name: 'Open as page',
    })

    fireEvent.click(button)

    await expect(button).toBeDisabled()
    await expect(clicks(args)).not.toHaveBeenCalled()
  },
}
