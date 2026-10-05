import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { DeleteCardDialogDemo, delay } from './card-record-dialog'

const meta = {
  args: {
    onConfirm: fn(async () => {
      await delay(150)
      return true
    }),
    onOpenChange: fn(),
    title: 'Delete project',
    titleAncestor: 'Lemind',
  },
  component: DeleteCardDialogDemo,
  parameters: {
    // COSS destructive button is white on red-500 (3.8:1); COSS is not changed here.
    a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
    docs: {
      description: {
        component:
          'Confirmation dialog on the COSS alert dialog: outside press never closes it. `destructive` switches the confirm button to the destructive variant.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/SurfaceStates',
} satisfies Meta<typeof DeleteCardDialogDemo>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Destructive: Story = {}

export const DestructiveInteraction: Story = {
  ...Destructive,
  tags: ['!dev', '!autodocs'],
  play: async ({ args }) => {
    const dialog = await screen().findByRole('alertdialog', {
      name: 'Delete project',
    })

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete' }),
    )

    await waitFor(() => expect(args.onConfirm).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen().queryByRole('alertdialog')).toBeNull())
  },
}

export const Failure: Story = {
  args: {
    onConfirm: fn(async () => false),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The handler returns false: the dialog stays open and the consumer error is announced as an alert.',
      },
    },
  },
}

export const FailureInteraction: Story = {
  ...Failure,
  tags: ['!dev', '!autodocs'],
  play: async () => {
    const dialog = await screen().findByRole('alertdialog', {
      name: 'Delete project',
    })

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete' }),
    )

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Could not delete the card.',
    )
    expect(screen().getByRole('alertdialog')).toBeVisible()
  },
}
