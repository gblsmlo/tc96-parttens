import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordPreviewBody } from '@tc96/parttens'
import { expect } from 'storybook/test'

const bodyOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector(
    '[data-slot="record-preview-body"]',
  ) as HTMLElement

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Composition/Body',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const StacksChildrenInAColumn: Story = {
  render: () => (
    <RecordPreviewBody>
      <p>First</p>
      <p>Second</p>
    </RecordPreviewBody>
  ),
  play: async ({ canvasElement }) => {
    const body = bodyOf(canvasElement)

    await expect(body.className.split(' ')).toEqual([
      'flex',
      'flex-col',
      'gap-4',
    ])
    await expect([...body.children].map((child) => child.textContent)).toEqual([
      'First',
      'Second',
    ])
  },
}

export const MergesClassName: Story = {
  render: () => <RecordPreviewBody className="extra">Body</RecordPreviewBody>,
  play: async ({ canvasElement }) => {
    const classes = bodyOf(canvasElement).className.split(' ')

    await expect(classes).toContain('extra')
    await expect(classes).toContain('gap-4')
  },
}
