import {
  CloudArrowDownIcon,
  PencilLineIcon,
  XIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { IconLabelCanvas } from './icon-label-canvas.tsx'

const meta = {
  decorators: [IconLabelCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Icon Label/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const RecordDates: Story = {
  render: () => (
    <dl className="grid w-72 grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 text-sm">
      <dt className="text-muted-foreground">Criado em</dt>
      <dd>
        <IconLabelProperty label="27/09/2026 às 14:05" variant="plain" />
      </dd>
      <dt className="text-muted-foreground">Atualizado em</dt>
      <dd>
        <IconLabelProperty label="03/10/2026 às 09:12" variant="plain" />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('27/09/2026 às 14:05'),
    ).toBeVisible()
  },
}

export const RecordOrigin: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <IconLabelProperty
        ariaLabel="Origem"
        icon={PencilLineIcon}
        label="Manual"
      />
      <IconLabelProperty
        ariaLabel="Origem"
        icon={CloudArrowDownIcon}
        label="Importado do CRM"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Origem: Importado do CRM',
      }),
    ).toBeVisible()
  },
}

export const CategoryDirection: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <IconLabelProperty
        label="Receita"
        leading={
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
        }
      />
      <IconLabelProperty
        label="Despesa"
        leading={
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-destructive"
          />
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Despesa')).toBeVisible()
  },
}

export const RemovableFilter: Story = {
  render: () => (
    <IconLabelProperty
      ariaLabel="Filtro"
      label="Responsável: Ana Souza"
      trailing={
        <button
          aria-label="Remover filtro Responsável: Ana Souza"
          className="flex size-5 items-center justify-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
        >
          <XIcon aria-hidden="true" className="size-3" />
        </button>
      }
      trailingVisibility="hover"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', {
        name: 'Filtro: Responsável: Ana Souza',
      }),
    ).toBeInTheDocument()
  },
}
