import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty, ListRow } from '@tc96/parttens'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

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

const receivedAt = (
  <DateProperty
    displayLabel="há 53 minutos"
    locale="pt-BR"
    readOnly
    timeZone="America/Sao_Paulo"
    tooltip
    value="2026-11-13T17:07:00.000Z"
    variant="plain"
  />
)

const tooltipText = (canvasElement: HTMLElement) =>
  canvasElement.ownerDocument.querySelector('[data-slot="tooltip-popup"]')
    ?.textContent

const receivedAtSurface = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getByText('há 53 minutos')
    .closest<HTMLElement>('[data-slot="property-surface"]') as HTMLElement

export const PropertyTooltipOnHoverClickOpensRow: Story = {
  play: async ({ canvasElement }) => {
    onOpen.mockClear()
    const date = receivedAtSurface(canvasElement)
    const { height, left, top, width } = date.getBoundingClientRect()

    await expect(
      date.contains(
        canvasElement.ownerDocument.elementFromPoint(
          left + width / 2,
          top + height / 2,
        ),
      ),
    ).toBe(true)

    await userEvent.hover(date)
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toBe(
        '13 de novembro de 2026 às 14:07',
      ),
    )

    await userEvent.click(date)
    await expect(onOpen).toHaveBeenCalledTimes(1)
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow
        description="contato@lemind.app"
        onClick={onOpen}
        properties={receivedAt}
        title="Nova mensagem"
      />
    </div>
  ),
}

export const PropertyTooltipByKeyboard: Story = {
  play: async ({ canvasElement }) => {
    onOpen.mockClear()
    const canvas = within(canvasElement)

    await userEvent.tab()
    await expect(
      canvas.getByRole('button', { name: 'Nova mensagem' }),
    ).toHaveFocus()

    await userEvent.tab()
    await expect(receivedAtSurface(canvasElement)).toHaveFocus()
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toBe(
        '13 de novembro de 2026 às 14:07',
      ),
    )
    await expect(receivedAtSurface(canvasElement)).toHaveAccessibleDescription(
      '13 de novembro de 2026 às 14:07',
    )
    await expect(onOpen).not.toHaveBeenCalled()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow onClick={onOpen} properties={receivedAt} title="Nova mensagem" />
    </div>
  ),
}

export const PropertyControlKeepsItsClick: Story = {
  play: async ({ canvasElement }) => {
    onOpen.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Arquivar' }),
    )
    await expect(onOpen).not.toHaveBeenCalled()
  },
  render: () => (
    <div className="min-w-0 p-4">
      <ListRow
        onClick={onOpen}
        properties={<button type="button">Arquivar</button>}
        title="Nova mensagem"
      />
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
