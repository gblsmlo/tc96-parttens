import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'
import { recordDialog4ControlArgs } from './record-dialog-4-controls.ts'
import { ComposedRecordDialog4 } from './record-dialog-4-layouts.tsx'

const meta = {
  args: {
    ...recordDialog4ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Contacts/RecordDialog4/States',
} satisfies Meta<typeof ComposedRecordDialog4>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo contato' }),
    )

    await expect(dialog.getByRole('textbox', { name: 'Nome' })).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Mais propriedades' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /Criar contato/ }),
    ).toBeDisabled()
  },
}

export const Closed: Story = {
  args: { open: false },
  render: (args) => <ComposedRecordDialog4 {...args} open={false} />,
}
