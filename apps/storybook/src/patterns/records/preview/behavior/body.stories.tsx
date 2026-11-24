import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordPreviewBody } from '@tc96/ui/patterns'
import { expect } from 'storybook/test'

const bodyOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector(
    '[data-slot="record-preview-body"]',
  ) as HTMLElement

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const BodyStacksChildrenInAColumn: Story = {
  render: () => (
    <RecordPreviewBody>
      <p>First</p>
      <p>Second</p>
    </RecordPreviewBody>
  ),
  play: async ({ canvasElement }) => {
    const body = bodyOf(canvasElement)
    const style = getComputedStyle(body)

    await expect(style.display).toBe('flex')
    await expect(style.flexDirection).toBe('column')
    await expect(style.rowGap).toBe('16px')
    await expect([...body.children].map((child) => child.textContent)).toEqual([
      'First',
      'Second',
    ])
  },
}

export const BodyMergesClassName: Story = {
  render: () => <RecordPreviewBody className="extra">Body</RecordPreviewBody>,
  play: async ({ canvasElement }) => {
    const body = bodyOf(canvasElement)

    await expect(body.classList.contains('extra')).toBe(true)
    await expect(getComputedStyle(body).display).toBe('flex')
  },
}
