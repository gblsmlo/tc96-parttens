import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card6, type Card6Props } from '@tc96/blocks/application/card/card-6'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { jobs } from '../fixtures/card-6.ts'
import { type Card6Controls, card6ControlArgs } from './card-6-controls.ts'
import { ComposedCard6 } from './card-6-layouts.tsx'

const loaded: Card6Props = {
  jobs,
  saved: ['data'],
}

const retry = fn()

const meta = {
  args: { ...card6ControlArgs, onApply: fn(), onSaveChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card6/Behavior',
} satisfies Meta<
  Card6Controls & {
    onApply: (jobId: string) => void
    onSaveChange: (jobId: string, saved: boolean) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const JobsShowCompanyLocationAndWorkMode: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(jobs.length)
    await expect(canvas.getByText('Engenheira de front-end')).toBeVisible()
    await expect(canvas.getByText('Atlas Tecnologia')).toBeVisible()
    await expect(canvas.getByText('São Paulo, SP')).toBeVisible()
    await expect(canvas.getByText('Híbrido')).toBeVisible()
    await expect(canvas.getByText('AT')).toBeVisible()
  },
}

export const SalaryRangeIsFormattedAsCurrency: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/^R\$\s9\.000 a R\$\s14\.000$/)).toBeVisible()
    await expect(canvas.getAllByText(/ a R\$/)).toHaveLength(2)
  },
}

export const ApplyCallsOnApplyWithTheJobId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Candidatar-se a Analista de dados sênior em Rio Dados',
      }),
    )
    await expect(args.onApply).toHaveBeenCalledTimes(1)
    await expect(args.onApply).toHaveBeenCalledWith('data')
  },
}

export const ApplyIsHiddenWithoutOnApply: Story = {
  args: { withApply: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Candidatar-se/ }),
    ).toBeNull()
  },
}

export const SaveToggleFollowsTheSavedList: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const saved = canvas.getByRole('button', {
      name: 'Remover Analista de dados sênior das vagas salvas',
    })
    await expect(saved).toHaveAttribute('aria-pressed', 'true')
    const unsaved = canvas.getByRole('button', {
      name: 'Salvar vaga Gerente de produto',
    })
    await expect(unsaved).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(unsaved)
    await waitFor(() =>
      expect(args.onSaveChange).toHaveBeenCalledWith('product', true),
    )
    await expect(
      canvas.getByRole('button', {
        name: 'Remover Gerente de produto das vagas salvas',
      }),
    ).toHaveAttribute('aria-pressed', 'true')
  },
}

export const SavedIsControlled: Story = {
  render: (args) => (
    <Card6 jobs={jobs} onSaveChange={args.onSaveChange} saved={[]} />
  ),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', {
      name: 'Salvar vaga Gerente de produto',
    })
    await userEvent.click(toggle)
    await waitFor(() =>
      expect(args.onSaveChange).toHaveBeenCalledWith('product', true),
    )
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}

export const SaveIsHiddenWithoutOnSaveChange: Story = {
  args: { withSave: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /vaga|salvas/ }),
    ).toBeNull()
  },
}

export const EmptyJobsShowTheEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma vaga recomendada')).toBeVisible()
    await expect(canvas.queryByRole('listitem')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Card6
      jobs={jobs}
      labels={{
        apply: 'Enviar currículo',
        title: 'Para você',
        workModes: {
          hybrid: 'Misto',
          onsite: 'No local',
          remote: 'À distância',
        },
      }}
      onApply={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Para você' }),
    ).toBeVisible()
    await expect(canvas.getByText('Misto')).toBeVisible()
    await expect(canvas.getAllByText('Enviar currículo')).toHaveLength(
      jobs.length,
    )
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Card6 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando vagas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Card6 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as vagas'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Card6 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Card6 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando vagas')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as vagas'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Card6 {...loaded} jobs={[]} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as vagas'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhuma vaga recomendada')).toBeNull()
  },
}
