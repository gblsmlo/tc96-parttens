import { TrayIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@tc96/ui/empty'
import { expect, isInaccessible, userEvent, within } from 'storybook/test'
import { emptyControlArgs } from './empty-controls.ts'
import { EmptyCanvas } from './empty-frame.tsx'
import { ComposedEmpty, LinkInDescriptionEmpty } from './empty-layouts.tsx'

const slot = (container: HTMLElement, name: string) => {
  const element = container.querySelector(`[data-slot="${name}"]`)
  if (!(element instanceof HTMLElement))
    throw new Error(`The ${name} part did not render.`)
  return element
}

const layersOf = (media: HTMLElement) =>
  [...media.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  )

const meta = {
  decorators: [EmptyCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Empty/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const PartElements: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} />,
  play: async ({ canvasElement }) => {
    for (const name of [
      'empty',
      'empty-header',
      'empty-media',
      'empty-title',
      'empty-description',
      'empty-content',
    ])
      await expect(slot(canvasElement, name).tagName).toBe('DIV')
  },
}

export const TitleAndDescriptionAsText: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(emptyControlArgs.title)).toBe(
      slot(canvasElement, 'empty-title'),
    )
    await expect(canvas.getByText(emptyControlArgs.description)).toBe(
      slot(canvasElement, 'empty-description'),
    )
    await expect(canvas.queryByRole('heading')).toBeNull()
  },
}

export const NoRole: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} />,
  play: async ({ canvasElement }) => {
    const empty = slot(canvasElement, 'empty')
    await expect(empty).not.toHaveAttribute('role')
    const canvas = within(canvasElement)
    for (const role of ['status', 'alert', 'region', 'group'])
      await expect(canvas.queryByRole(role)).toBeNull()
  },
}

export const ActionReachable: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} />,
  play: async ({ canvasElement }) => {
    const button = within(slot(canvasElement, 'empty-content')).getByRole(
      'button',
      { name: 'Add item' },
    )
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur()
    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

export const IconBackCards: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} mediaVariant="icon" />,
  play: async ({ canvasElement }) => {
    const media = slot(canvasElement, 'empty-media')
    await expect(media).toHaveAttribute('data-variant', 'icon')
    const layers = layersOf(media)
    await expect(layers).toHaveLength(3)
    const [left, right, front] = layers as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ]
    for (const card of [left, right]) {
      await expect(card).toHaveAttribute('aria-hidden', 'true')
      await expect(isInaccessible(card)).toBe(true)
      await expect(card).toBeEmptyDOMElement()
    }
    await expect(front.querySelector('svg')).not.toBeNull()
    await expect(front.offsetWidth).toBe(36)
    await expect(front.offsetHeight).toBe(36)
  },
}

export const UnframedDefaultMedia: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} />,
  play: async ({ canvasElement }) => {
    const media = slot(canvasElement, 'empty-media')
    await expect(media).toHaveAttribute('data-variant', 'default')
    const layers = layersOf(media)
    await expect(layers).toHaveLength(1)
    const style = getComputedStyle(layers[0] as HTMLElement)
    await expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(style.borderTopWidth).toBe('0px')
  },
}

export const MediaClassNameOnEveryLayer: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia className="size-12" variant="icon">
          <TrayIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No items yet</EmptyTitle>
      </EmptyHeader>
    </Empty>
  ),
  play: async ({ canvasElement }) => {
    const media = slot(canvasElement, 'empty-media')
    const layers = layersOf(media)
    await expect(layers).toHaveLength(3)
    for (const layer of layers) await expect(layer.offsetWidth).toBe(48)
  },
}

export const PartSpacing: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} mediaVariant="icon" />,
  play: async ({ canvasElement }) => {
    const rect = (name: string) =>
      slot(canvasElement, name).getBoundingClientRect()
    const media = rect('empty-media')
    const title = rect('empty-title')
    const description = rect('empty-description')
    const header = rect('empty-header')
    const content = rect('empty-content')
    await expect(Math.round(title.top - media.bottom)).toBe(24)
    await expect(Math.round(description.top - title.bottom)).toBe(4)
    await expect(Math.round(content.top - header.bottom)).toBe(24)
  },
}

export const DescriptionGapOnlyAfterTitle: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} media={false} title="" />,
  play: async ({ canvasElement }) => {
    const description = slot(canvasElement, 'empty-description')
    await expect(canvasElement.querySelector('[data-slot="empty-title"]')).toBe(
      null,
    )
    await expect(getComputedStyle(description).marginTop).toBe('0px')
  },
}

export const CenteredColumn: Story = {
  render: () => (
    <ComposedEmpty
      {...emptyControlArgs}
      description="Items you add show up here, sorted by the date they were added, with the newest first and the archived ones left out."
    />
  ),
  play: async ({ canvasElement }) => {
    const empty = slot(canvasElement, 'empty').getBoundingClientRect()
    const center = empty.left + empty.width / 2
    for (const name of ['empty-header', 'empty-content']) {
      const part = slot(canvasElement, name)
      const box = part.getBoundingClientRect()
      await expect(box.width).toBe(384)
      await expect(Math.round(box.left + box.width / 2)).toBe(
        Math.round(center),
      )
      await expect(getComputedStyle(part).textAlign).toBe('center')
    }
  },
}

export const FillsFlexParent: Story = {
  render: () => (
    <div className="flex h-64 w-full" data-testid="panel">
      <ComposedEmpty {...emptyControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('[data-testid="panel"]')
    if (!(panel instanceof HTMLElement))
      throw new Error('The panel did not render.')
    const empty = slot(canvasElement, 'empty')
    await expect(empty.offsetWidth).toBe(panel.offsetWidth)
  },
}

export const DescriptionLink: Story = {
  render: () => <LinkInDescriptionEmpty />,
  play: async ({ canvasElement }) => {
    const description = slot(canvasElement, 'empty-description')
    const link = description.querySelector('a')
    if (!link) throw new Error('The description link did not render.')
    const style = getComputedStyle(link)
    await expect(style.textDecorationLine).toBe('underline')
    await expect(style.textUnderlineOffset).toBe('4px')
  },
}
