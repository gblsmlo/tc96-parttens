import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  type BulkImport1Controls,
  bulkImport1ControlArgs,
} from './bulk-import-1-controls.ts'
import { ComposedBulkImport1 } from './bulk-import-1-layouts.tsx'

type BehaviorArgs = BulkImport1Controls & {
  onImport: () => boolean
  onSearchAgain: () => void
  onSelectedChange: (selected: readonly string[]) => void
  onStepChange: (step: string) => void
}

const meta = {
  args: {
    ...bulkImport1ControlArgs,
    onImport: fn(() => true),
    onSearchAgain: fn(),
    onSelectedChange: fn(),
    onStepChange: fn(),
  },
  render: (args) => <ComposedBulkImport1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Records/BulkImport1/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const findDialog = async () =>
  within(await screen.findByRole('dialog', { name: 'Importar contatos' }))

export const SelectionCountDescribesContinuar: Story = {
  play: async ({ args }) => {
    const dialog = await findDialog()
    const submit = dialog.getByRole('button', { name: 'Continuar' })
    await expect(submit).toHaveAccessibleDescription(
      '2 selecionados · até 50 por lote',
    )
    await userEvent.click(
      dialog.getByRole('checkbox', { name: 'Selecionar Ana Souza' }),
    )
    await expect(args.onSelectedChange).toHaveBeenLastCalledWith(['bruno'])
    await userEvent.click(submit)
    await expect(args.onStepChange).toHaveBeenCalledWith('link')
  },
}

export const DisabledRowCannotBeSelected: Story = {
  play: async () => {
    const dialog = await findDialog()
    const checkbox = dialog.getByRole('checkbox', {
      name: 'Selecionar Carla Mendes',
    })
    await expect(checkbox).toHaveAttribute('aria-disabled', 'true')
    await expect(dialog.getByText('Já cadastrado')).toBeVisible()
  },
}

export const SearchingShowsSkeletonRows: Story = {
  args: { searching: true },
  play: async ({ args }) => {
    const dialog = await findDialog()
    await expect(dialog.queryAllByRole('checkbox')).toHaveLength(0)
    await expect(
      dialog.getByRole('button', { name: 'Continuar' }),
    ).toBeDisabled()
    await expect(
      dialog.getByRole('button', { name: 'Buscar de novo' }),
    ).toBeDisabled()
    await expect(args.onSearchAgain).not.toHaveBeenCalled()
  },
}

export const LinkStepImportsTheSelection: Story = {
  args: { step: 'link' },
  play: async ({ args }) => {
    const dialog = await findDialog()
    await userEvent.click(
      dialog.getByRole('button', { name: 'Importar 2 registros' }),
    )
    await expect(args.onImport).toHaveBeenCalledOnce()
    await expect(await findDialog()).toBeTruthy()
  },
}

export const ImportingLocksTheLinkStep: Story = {
  args: { importing: true, progress: true, step: 'link' },
  play: async () => {
    const dialog = await findDialog()
    await expect(dialog.getByRole('button', { name: 'Voltar' })).toBeDisabled()
    const submit = dialog.getByRole('button', { name: 'Importando…' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAccessibleDescription(
      'Pode fechar. A lista de registros mostra o andamento.',
    )
    await expect(
      within(
        dialog.getByRole('list', { name: 'Andamento da importação' }),
      ).getAllByRole('listitem'),
    ).toHaveLength(2)
  },
}
