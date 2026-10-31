import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupLink } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const open = fn()

const slotOf = (canvasElement: HTMLElement, name: 'meta' | 'name') =>
  canvasElement.querySelector(`[data-slot="record-group-link-${name}"]`)

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Link',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const NamedByContentAndMeta: Story = {
  render: () => (
    <RecordGroupLink
      href="/parcelas/1"
      leading={<svg aria-hidden="true" />}
      meta="Paga"
    >
      Parcela 1
    </RecordGroupLink>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Parcela 1 Paga',
    })

    await expect(link.tagName).toBe('A')
    await expect(link).toHaveAttribute('href', '/parcelas/1')
    await expect(link).toHaveAttribute('data-slot', 'record-group-link')
    await expect(slotOf(canvasElement, 'name')?.textContent).toBe('Parcela 1')
    await expect(slotOf(canvasElement, 'meta')?.textContent).toBe('Paga')
    await expect(link.querySelector('svg')).not.toBeNull()
  },
}

export const LeadingAndMetaOnlyWhenPassed: Story = {
  render: () => <RecordGroupLink href="/parcelas/1">Parcela 1</RecordGroupLink>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Parcela 1' })

    await expect(link.children).toHaveLength(1)
    await expect(slotOf(canvasElement, 'meta')).toBeNull()
  },
}

export const RendersThroughConsumerElement: Story = {
  render: () => (
    <RecordGroupLink
      className="extra"
      onClick={() => open()}
      render={<button type="button" />}
    >
      contrato-assinado.pdf
    </RecordGroupLink>
  ),
  play: async ({ canvasElement }) => {
    open.mockClear()
    const button = within(canvasElement).getByRole('button', {
      name: 'contrato-assinado.pdf',
    })

    await userEvent.click(button)

    await expect(open).toHaveBeenCalledTimes(1)
    await expect(button).toHaveAttribute('data-slot', 'record-group-link')
    await expect(button.className).toContain('extra')
    await expect(button.className).toContain(
      'min-h-[var(--record-group-row-height,calc(var(--spacing)*8))]',
    )
    await expect(button.className).toContain(
      '-mx-[var(--record-group-hover-offset,0px)]',
    )
    await expect(button.className).toContain(
      'px-[calc(var(--record-group-row-padding,0px)+var(--record-group-hover-offset,0px))]',
    )
    await expect(button.className).toContain('text-start')
  },
}
