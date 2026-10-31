import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupRow } from '@tc96/parttens'
import { expect } from 'storybook/test'
import { part, rowsOf } from '../fixtures/group-dom'

const firstRow = (canvasElement: HTMLElement) =>
  rowsOf(canvasElement)[0] as HTMLElement

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Row',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const StartAlignmentByDefault: Story = {
  render: () => <RecordGroupRow label="Status">Open</RecordGroupRow>,
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement)

    await expect(row).toHaveAttribute('data-align', 'start')
    await expect(part(row, 'label').textContent).toBe('Status')
    await expect(part(row, 'value').textContent).toBe('Open')
  },
}

export const BetweenSetsDataAlign: Story = {
  render: () => (
    <RecordGroupRow align="between" label="Status">
      Open
    </RecordGroupRow>
  ),
  play: async ({ canvasElement }) => {
    await expect(firstRow(canvasElement)).toHaveAttribute(
      'data-align',
      'between',
    )
  },
}

export const LeadingOnlyWhenPassed: Story = {
  render: () => (
    <div className="flex flex-col">
      <RecordGroupRow label="Status">Open</RecordGroupRow>
      <RecordGroupRow label="Status" leading={<svg aria-hidden="true" />}>
        Open
      </RecordGroupRow>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [plain, withLeading] = rowsOf(canvasElement) as [
      HTMLElement,
      HTMLElement,
    ]

    await expect(part(plain, 'label').querySelector('svg')).toBeNull()
    await expect(part(plain, 'label').children).toHaveLength(1)
    await expect(part(withLeading, 'label').querySelector('svg')).not.toBeNull()
  },
}

export const HidesValueIconsOnlyWithLeading: Story = {
  render: () => (
    <div className="flex flex-col">
      <RecordGroupRow label="Status">
        <svg aria-hidden="true" data-slot="property-icon" />
      </RecordGroupRow>
      <RecordGroupRow label="Status" leading={<svg aria-hidden="true" />}>
        <svg aria-hidden="true" data-slot="property-icon" />
      </RecordGroupRow>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [plain, withLeading] = rowsOf(canvasElement) as [
      HTMLElement,
      HTMLElement,
    ]

    await expect(part(plain, 'value').className).not.toContain('property-icon')
    await expect(part(withLeading, 'value').className).toContain(
      '[&_[data-slot=property-icon]]:hidden',
    )
  },
}

export const DescriptionListOfTermAndValue: Story = {
  render: () => <RecordGroupRow label="Owner">Mariana Souza</RecordGroupRow>,
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement)
    const term = part(row, 'label')
    const description = part(row, 'value')

    await expect(row.tagName).toBe('DL')
    await expect(row.children).toHaveLength(2)
    await expect(term.tagName).toBe('DT')
    await expect(description.tagName).toBe('DD')
    await expect(term.parentElement).toBe(row)
    await expect(description.parentElement).toBe(row)
    await expect(term.nextElementSibling).toBe(description)
  },
}
