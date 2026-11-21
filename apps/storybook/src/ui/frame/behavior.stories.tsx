import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { frameControlArgs } from './frame-controls.ts'
import { FrameCanvas } from './frame-frame.tsx'
import { ComposedFrame, TeamMembersFrame } from './frame-layouts.tsx'

const meta = {
  decorators: [FrameCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Frame/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const closestSlot = (element: HTMLElement, slot: string) => {
  const part = element.closest<HTMLElement>(`[data-slot="${slot}"]`)
  if (!part) throw new Error(`No ancestor with data-slot="${slot}"`)
  return part
}

const slotIn = (root: HTMLElement, slot: string) => {
  const part = root.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  if (!part) throw new Error(`No element with data-slot="${slot}"`)
  return part
}

export const PartElements: Story = {
  render: () => <ComposedFrame {...frameControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByText(frameControlArgs.title)
    const description = canvas.getByText(frameControlArgs.description)

    await expect(closestSlot(title, 'frame').tagName).toBe('DIV')
    await expect(closestSlot(title, 'frame-panel-header').tagName).toBe(
      'HEADER',
    )
    await expect(title).toHaveAttribute('data-slot', 'frame-panel-title')
    await expect(title.tagName).toBe('DIV')
    await expect(description).toHaveAttribute(
      'data-slot',
      'frame-panel-description',
    )
    await expect(description.tagName).toBe('DIV')
    await expect(
      closestSlot(canvas.getByText(frameControlArgs.content), 'frame-panel')
        .tagName,
    ).toBe('DIV')
    await expect(
      closestSlot(
        canvas.getByText(frameControlArgs.footer),
        'frame-panel-footer',
      ).tagName,
    ).toBe('FOOTER')
  },
}

export const TitleIsNotHeading: Story = {
  render: () => <ComposedFrame {...frameControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(frameControlArgs.title)).toHaveAttribute(
      'data-slot',
      'frame-panel-title',
    )
    await expect(canvas.queryByRole('heading')).toBeNull()
  },
}

export const HeaderAndFooterLandmarks: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ComposedFrame {...frameControlArgs} />
      <TeamMembersFrame />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frames = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="frame"]',
    )
    await expect(frames).toHaveLength(2)
    const [bare] = frames

    await expect(within(bare).getByRole('banner')).toBe(
      slotIn(bare, 'frame-panel-header'),
    )
    await expect(within(bare).getByRole('contentinfo')).toBe(
      slotIn(bare, 'frame-panel-footer'),
    )

    const section = canvas.getByRole('region', { name: 'Team members' })
    await expect(slotIn(section, 'frame-panel-header').tagName).toBe('HEADER')
    await expect(slotIn(section, 'frame-panel-footer').tagName).toBe('FOOTER')

    for (const frame of frames) await expect(frame).not.toHaveAttribute('role')
    const regions = canvas.getAllByRole('region')
    await expect(regions).toHaveLength(1)
    await expect(regions[0].tagName).toBe('SECTION')
  },
}

export const SeparatesAdjacentPanels: Story = {
  render: () => <ComposedFrame {...frameControlArgs} secondPanel />,
  play: async ({ canvasElement }) => {
    const panels = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="frame-panel"]',
    )
    await expect(panels).toHaveLength(2)
    const [first, second] = panels
    await expect(first.previousElementSibling).toBe(
      slotIn(canvasElement, 'frame-panel-header'),
    )
    await expect(getComputedStyle(first).marginTop).toBe('0px')
    await expect(second.previousElementSibling).toBe(first)
    await expect(getComputedStyle(second).marginTop).toBe('4px')
    const footer = slotIn(canvasElement, 'frame-panel-footer')
    await expect(footer.previousElementSibling).toBe(second)
    await expect(getComputedStyle(footer).marginTop).toBe('0px')
  },
}

export const ClassNameWins: Story = {
  render: () => <TeamMembersFrame />,
  play: async ({ canvasElement }) => {
    const panel = getComputedStyle(slotIn(canvasElement, 'frame-panel'))
    await expect(panel.paddingTop).toBe('0px')
    await expect(panel.paddingInlineStart).toBe('0px')
    await expect(panel.borderTopWidth).toBe('1px')
    await expect(panel.borderTopLeftRadius).not.toBe('0px')
  },
}
