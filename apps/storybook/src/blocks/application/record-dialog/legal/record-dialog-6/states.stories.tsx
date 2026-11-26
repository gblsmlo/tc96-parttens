import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { recordDialog6ControlArgs } from './record-dialog-6-controls.ts'
import { ComposedRecordDialog6 } from './record-dialog-6-layouts.tsx'

const meta = {
  args: {
    ...recordDialog6ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Legal/RecordDialog6/States',
} satisfies Meta<typeof ComposedRecordDialog6>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args }) => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Processo manual' }),
    )

    await expect(
      dialog.getByRole('button', { name: /^Processo/ }),
    ).toHaveAttribute('aria-expanded', 'true')
    await expect(
      dialog.getByRole('combobox', { name: /^Instância/ }),
    ).toHaveTextContent('1º grau')
    await expect(
      dialog.getByRole('button', { name: /^Configurações/ }),
    ).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(
      dialog.getByRole('button', { name: /Criar processo/ }),
    )
    await expect(args.onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        instance: 'first',
        monitor: true,
        owner: 'admin',
        phase: 'initial',
      }),
    )
  },
}

export const Closed: Story = {
  args: { open: false },
  render: (args) => <ComposedRecordDialog6 {...args} open={false} />,
}
