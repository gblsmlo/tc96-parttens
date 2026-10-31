import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListRow } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const onOpen = fn()

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/List/Row',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Slots: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Nubank' })).toBeVisible()
    await expect(canvas.getByText('Conta corrente')).toBeVisible()
    await expect(canvas.getByText('NB')).toBeVisible()
    await expect(canvas.getByText('R$ 1.856,20')).toBeVisible()
    await expect(canvas.getByText('Ativa')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Mais' })).toBeVisible()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow
        actions={<button type="button">Mais</button>}
        description="Conta corrente"
        icon="NB"
        properties={<span>Ativa</span>}
        title="Nubank"
        value="R$ 1.856,20"
      />
    </div>
  ),
}

export const DescriptionSegmentsJoinWithDots: Story = {
  play: async ({ canvasElement }) => {
    const description = canvasElement.querySelector(
      '[data-slot="list-item-description"]',
    )
    await expect(description?.textContent).toBe('Conta corrente·Nubank')
    await expect(
      description?.querySelectorAll('[aria-hidden="true"]'),
    ).toHaveLength(1)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow
        description={['Conta corrente', <b key="bank">Nubank</b>, null]}
        title="Nubank"
      />
    </div>
  ),
}

export const RepeatedDescriptionSegmentsKept: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="list-item-description"]')
        ?.textContent,
    ).toBe('Pendente·Pendente')
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow description={['Pendente', 'Pendente']} title="Carteira" />
    </div>
  ),
}

export const EmptySlotsOmitted: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="list-item-leading"]'),
    ).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="list-item-description"]'),
    ).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="list-item-trailing"]'),
    ).toBeNull()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow description={[]} title="Carteira" />
    </div>
  ),
}

export const OnClickTurnsTitleIntoTrigger: Story = {
  play: async ({ canvasElement }) => {
    onOpen.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Carteira' }),
    )
    await expect(onOpen).toHaveBeenCalledTimes(1)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow onClick={onOpen} title="Carteira" />
    </div>
  ),
}

export const OpenLabelNamesTrigger: Story = {
  play: async ({ canvasElement }) => {
    onOpen.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Abrir contato: Carteira',
      }),
    )
    await expect(onOpen).toHaveBeenCalledTimes(1)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow
        onClick={onOpen}
        openLabel="Abrir contato: Carteira"
        title="Carteira"
      />
    </div>
  ),
}

export const OpenDisabledBlocksTrigger: Story = {
  play: async ({ canvasElement }) => {
    onOpen.mockClear()
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Carteira',
    })
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    await expect(onOpen).not.toHaveBeenCalled()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow onClick={onOpen} openDisabled title="Carteira" />
    </div>
  ),
}

export const WithoutOnClickHasNoButton: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow title="Carteira" />
    </div>
  ),
}
