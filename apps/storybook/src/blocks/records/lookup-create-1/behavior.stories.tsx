import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  type LookupCreate1Controls,
  lookupCreate1ControlArgs,
} from './lookup-create-1-controls.ts'
import { ComposedLookupCreate1 } from './lookup-create-1-layouts.tsx'

type BehaviorArgs = LookupCreate1Controls & {
  onAlternative: (id: string) => void
  onOpenChange: (open: boolean) => void
  onRetry: () => void
  onStepChange: (step: string) => void
}

const meta = {
  args: {
    ...lookupCreate1ControlArgs,
    onAlternative: fn(),
    onOpenChange: fn(),
    onRetry: fn(),
    onStepChange: fn(),
  },
  render: (args) => <ComposedLookupCreate1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Records/LookupCreate1/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const findDialog = async () =>
  within(await screen.findByRole('dialog', { name: 'Nova empresa' }))

export const IncompleteIdentifierExplainsContinuar: Story = {
  play: async () => {
    const dialog = await findDialog()
    const submit = dialog.getByRole('button', { name: 'Continuar' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAccessibleDescription(
      'Digite o número completo.',
    )
  },
}

export const AvailableIdentifierMovesToDetails: Story = {
  args: { identifierState: 'available' },
  play: async ({ args }) => {
    const dialog = await findDialog()
    await userEvent.click(dialog.getByRole('button', { name: 'Continuar' }))
    await expect(args.onStepChange).toHaveBeenCalledWith('details')
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const TakenIdentifierLinksTheExistingRecord: Story = {
  args: { identifierState: 'taken' },
  play: async () => {
    const dialog = await findDialog()
    await expect(
      dialog.getByRole('link', { name: 'Abrir empresa' }),
    ).toHaveAttribute('href', '#/empresas/aurora')
    await expect(
      dialog.getByRole('button', { name: 'Continuar' }),
    ).toHaveAccessibleDescription('Este número já está cadastrado.')
  },
}

export const AlternativeCallsOnAlternative: Story = {
  play: async ({ args }) => {
    const dialog = await findDialog()
    await userEvent.click(
      dialog.getByRole('button', { name: /Preencher à mão/ }),
    )
    await expect(args.onAlternative).toHaveBeenCalledWith('manual')
  },
}

export const NoAlternativesWithoutThem: Story = {
  args: { alternatives: false },
  play: async () => {
    const dialog = await findDialog()
    await expect(dialog.queryByRole('group')).toBeNull()
  },
}

export const DetailsListsTheSources: Story = {
  args: { recordTitle: 'Aurora Comércio Ltda', step: 'details' },
  play: async () => {
    const dialog = await findDialog()
    const list = dialog.getByRole('list', { name: 'Fontes consultadas' })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    await expect(
      dialog.getByRole('button', { name: /Criar empresa/ }),
    ).toHaveAccessibleDescription(
      'Pode criar agora. O que ainda estiver em busca aparece na página do registro.',
    )
  },
}

export const MissingTitleDisablesCreate: Story = {
  args: { sources: 'answered', step: 'details' },
  play: async () => {
    const dialog = await findDialog()
    const submit = dialog.getByRole('button', { name: /Criar empresa/ })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAccessibleDescription('Dê um título para criar.')
  },
}

export const FailedSourceOffersRetry: Story = {
  args: {
    recordTitle: 'Aurora Comércio Ltda',
    sources: 'failed',
    step: 'details',
  },
  play: async ({ args }) => {
    const dialog = await findDialog()
    await userEvent.click(
      dialog.getByRole('button', { name: 'Buscar de novo' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

export const NoSourcesListWithoutSources: Story = {
  args: {
    recordTitle: 'Aurora Comércio Ltda',
    sources: 'none',
    step: 'details',
  },
  play: async () => {
    const dialog = await findDialog()
    await expect(
      dialog.queryByRole('list', { name: 'Fontes consultadas' }),
    ).toBeNull()
  },
}

export const BackReturnsToOrigin: Story = {
  args: { recordTitle: 'Aurora Comércio Ltda', step: 'details' },
  play: async ({ args }) => {
    const dialog = await findDialog()
    await userEvent.click(dialog.getByRole('button', { name: 'Voltar' }))
    await expect(args.onStepChange).toHaveBeenCalledWith('origin')
  },
}
