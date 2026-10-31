import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ListItem,
  ListItemBody,
  ListItemDescription,
  ListItemField,
  ListItemLeading,
  ListItemSkeleton,
  ListItemTitle,
  ListItemTitleTrigger,
  ListItemTrailing,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const onOpen = fn()

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/List/Item',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const LoadingSkeleton: Story = {
  play: async ({ canvasElement }) => {
    const skeleton = within(canvasElement).getByRole('status', {
      name: 'Carregando tarefa',
    })
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListItemSkeleton label="Carregando tarefa" />
    </div>
  ),
}

export const LeadingBodyTrailing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const description = canvas.getByText('Validar os documentos recebidos')
    await expect(
      canvas.getByRole('heading', { name: 'Revisar contrato' }),
    ).toBeVisible()
    await expect(canvas.getByText('Selecionar')).toBeVisible()
    await expect(canvas.getByText('Status e ações')).toBeVisible()
    await expect(getComputedStyle(description).textOverflow).toBe('ellipsis')

    const row = canvas.getByRole('article').getBoundingClientRect()
    const trailing = canvas.getByText('Status e ações').getBoundingClientRect()
    await expect(trailing.right).toBeGreaterThanOrEqual(row.right - 12)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListItem>
        <ListItemLeading>Selecionar</ListItemLeading>
        <ListItemBody>
          <ListItemTitle>Revisar contrato</ListItemTitle>
          <ListItemDescription>
            Validar os documentos recebidos
          </ListItemDescription>
        </ListItemBody>
        <ListItemTrailing>Status e ações</ListItemTrailing>
      </ListItem>
    </div>
  ),
}

export const CompactDensityTightens: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const comfortable = canvas.getByText('Confortável')
    const compact = canvas.getByText('Compacta')
    await expect(
      Number.parseFloat(getComputedStyle(comfortable).paddingTop),
    ).toBeGreaterThan(Number.parseFloat(getComputedStyle(compact).paddingTop))
  },
  render: () => (
    <div className="flex min-w-0 flex-col gap-2 p-4">
      <ListItem>Confortável</ListItem>
      <ListItem density="compact">Compacta</ListItem>
    </div>
  ),
}

export const FieldHiddenOnNarrowViewport: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const wide = window.matchMedia('(min-width: 64rem)').matches
    await expect(getComputedStyle(canvas.getByText('Alta')).display).toBe(
      wide ? 'flex' : 'none',
    )
    await expect(getComputedStyle(canvas.getByText('Abrir')).display).toBe(
      'flex',
    )
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListItem>
        <ListItemTrailing>
          <ListItemField>Alta</ListItemField>
          <ListItemField always>Abrir</ListItemField>
        </ListItemTrailing>
      </ListItem>
    </div>
  ),
}

export const TitleTriggerKeepsHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Revisar contrato' }),
    ).toBeVisible()
    onOpen.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Revisar contrato' }),
    )
    await expect(onOpen).toHaveBeenCalledTimes(1)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListItem>
        <ListItemBody>
          <ListItemTitle>
            <ListItemTitleTrigger onClick={onOpen}>
              Revisar contrato
            </ListItemTitleTrigger>
          </ListItemTitle>
        </ListItemBody>
      </ListItem>
    </div>
  ),
}
