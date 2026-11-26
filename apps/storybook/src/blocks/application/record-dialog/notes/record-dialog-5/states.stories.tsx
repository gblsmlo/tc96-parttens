import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'
import { recordDialog5ControlArgs } from './record-dialog-5-controls.ts'
import { ComposedRecordDialog5 } from './record-dialog-5-layouts.tsx'

const meta = {
  args: {
    ...recordDialog5ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Notes/RecordDialog5/States',
} satisfies Meta<typeof ComposedRecordDialog5>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args }) => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Nova nota' }),
    )

    await expect(dialog.getByText(args.recordName)).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Status/ }),
    ).toHaveTextContent('Planejada')
    await expect(
      dialog.getByRole('button', { name: /Criar nota/ }),
    ).toBeDisabled()
  },
}

export const Closed: Story = {
  args: { open: false },
  render: (args) => <ComposedRecordDialog5 {...args} open={false} />,
}
