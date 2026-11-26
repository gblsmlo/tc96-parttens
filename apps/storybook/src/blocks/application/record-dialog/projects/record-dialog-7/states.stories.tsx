import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'
import { recordDialog7ControlArgs } from './record-dialog-7-controls.ts'
import { ComposedRecordDialog7 } from './record-dialog-7-layouts.tsx'

const meta = {
  args: {
    ...recordDialog7ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Projects/RecordDialog7/States',
} satisfies Meta<typeof ComposedRecordDialog7>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo projeto' }),
    )

    await expect(
      dialog.getByRole('textbox', { name: 'Título do projeto' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Status/ }),
    ).toHaveTextContent('Planejado')
    await expect(
      dialog.getByRole('button', { name: /Criar projeto/ }),
    ).toBeDisabled()
  },
}

export const Closed: Story = {
  args: { open: false },
  render: (args) => <ComposedRecordDialog7 {...args} open={false} />,
}
