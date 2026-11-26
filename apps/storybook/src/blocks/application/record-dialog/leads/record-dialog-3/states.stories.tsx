import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'
import { recordDialog3ControlArgs } from './record-dialog-3-controls.ts'
import { ComposedRecordDialog3 } from './record-dialog-3-layouts.tsx'

const meta = {
  args: {
    ...recordDialog3ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Leads/RecordDialog3/States',
} satisfies Meta<typeof ComposedRecordDialog3>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo lead' }),
    )

    await expect(dialog.getByRole('textbox', { name: 'Título' })).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Novo')
    await expect(
      dialog.getByRole('button', { name: /Criar lead/ }),
    ).toBeDisabled()
  },
}

export const Closed: Story = {
  args: { open: false },
  render: (args) => <ComposedRecordDialog3 {...args} open={false} />,
}
