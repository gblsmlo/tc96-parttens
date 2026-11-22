import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardContent, CardPanel } from '@tc96/ui/card'
import { expect, userEvent, within } from 'storybook/test'
import { CardCanvas } from './card-canvas.tsx'
import { cardControlArgs } from './card-controls.ts'
import {
  ComposedCard,
  FooterActionsCard,
  StackedFrameCards,
  TeamMembersFrame,
} from './card-layouts.tsx'

const meta = {
  decorators: [CardCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Card/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const slotIn = (root: HTMLElement, slot: string) => {
  const part = root.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  if (!part) throw new Error(`No element with data-slot="${slot}"`)
  return part
}

const resolveRadius = (root: HTMLElement, value: string) => {
  const probe = document.createElement('div')
  probe.style.borderTopLeftRadius = value
  root.append(probe)
  const radius = getComputedStyle(probe).borderTopLeftRadius
  probe.remove()
  return radius
}

const padding = (root: HTMLElement, slot: string) => {
  const style = getComputedStyle(slotIn(root, slot))
  return { bottom: style.paddingBottom, top: style.paddingTop }
}

export const PartElements: Story = {
  render: () => <ComposedCard {...cardControlArgs} action />,
  play: async ({ canvasElement }) => {
    const slots = [
      'card',
      'card-header',
      'card-title',
      'card-description',
      'card-action',
      'card-panel',
      'card-footer',
    ]
    for (const slot of slots) {
      await expect(slotIn(canvasElement, slot).tagName).toBe('DIV')
    }
    const canvas = within(canvasElement)
    await expect(canvas.getByText(cardControlArgs.title)).toHaveAttribute(
      'data-slot',
      'card-title',
    )
    await expect(canvas.getByText(cardControlArgs.description)).toBe(
      slotIn(canvasElement, 'card-description'),
    )
    await expect(slotIn(canvasElement, 'card-description')).toHaveTextContent(
      cardControlArgs.description,
    )
  },
}

export const FramePartElements: Story = {
  render: () => <ComposedCard {...cardControlArgs} frame />,
  play: async ({ canvasElement }) => {
    const slots = [
      'card-frame',
      'card-frame-header',
      'card-frame-title',
      'card-frame-description',
      'card-frame-action',
      'card-frame-footer',
    ]
    for (const slot of slots) {
      await expect(slotIn(canvasElement, slot).tagName).toBe('DIV')
    }
    const frame = slotIn(canvasElement, 'card-frame')
    await expect(slotIn(canvasElement, 'card').parentElement).toBe(frame)
    await expect(slotIn(canvasElement, 'card-frame-header').parentElement).toBe(
      frame,
    )
    await expect(slotIn(canvasElement, 'card-frame-footer').parentElement).toBe(
      frame,
    )
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Frame title')).toBe(
      slotIn(canvasElement, 'card-frame-title'),
    )
    await expect(canvas.getByText('A sentence about the cards below.')).toBe(
      slotIn(canvasElement, 'card-frame-description'),
    )
  },
}

export const ContentIsPanel: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>Rendered through CardContent.</CardContent>
      </Card>
      <Card>
        <CardPanel>Rendered through CardPanel.</CardPanel>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const content = canvas.getByText('Rendered through CardContent.')
    const panel = canvas.getByText('Rendered through CardPanel.')
    await expect(content).toHaveAttribute('data-slot', 'card-panel')
    await expect(content.tagName).toBe(panel.tagName)
    await expect(content.className).toBe(panel.className)
  },
}

export const TitleIsNotHeading: Story = {
  render: () => <ComposedCard {...cardControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(cardControlArgs.title)).toBeVisible()
    await expect(canvas.queryByRole('heading')).toBeNull()
  },
}

export const RenderSwapsElement: Story = {
  render: () => <ComposedCard {...cardControlArgs} element="section" />,
  play: async ({ canvasElement }) => {
    const card = slotIn(canvasElement, 'card')
    await expect(card.tagName).toBe('SECTION')
    await expect(card).toHaveClass('flex', 'flex-col', 'border')
    await expect(getComputedStyle(card).flexDirection).toBe('column')
    await expect(getComputedStyle(card).borderTopWidth).toBe('1px')
  },
}

export const ActionBesideHeader: Story = {
  render: () => <ComposedCard {...cardControlArgs} action />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas
      .getByText(cardControlArgs.title)
      .getBoundingClientRect()
    const description = canvas
      .getByText(cardControlArgs.description)
      .getBoundingClientRect()
    const action = slotIn(canvasElement, 'card-action').getBoundingClientRect()
    await expect(
      canvas
        .getByRole('button', { name: 'Edit' })
        .closest('[data-slot="card-action"]'),
    ).toBe(slotIn(canvasElement, 'card-action'))
    await expect(action.top).toBe(title.top)
    await expect(action.left).toBeGreaterThan(title.right)
    await expect(action.left).toBeGreaterThan(description.right)
    await expect(description.left).toBe(title.left)
    await expect(description.top).toBeGreaterThan(title.bottom)
  },
}

export const PanelSharesPadding: Story = {
  render: () => <ComposedCard {...cardControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(padding(canvasElement, 'card-header')).toEqual({
      bottom: '16px',
      top: '24px',
    })
    await expect(padding(canvasElement, 'card-panel')).toEqual({
      bottom: '0px',
      top: '0px',
    })
    await expect(padding(canvasElement, 'card-footer')).toEqual({
      bottom: '24px',
      top: '16px',
    })
  },
}

export const SeparatorsKeepPanelPadding: Story = {
  render: () => <ComposedCard {...cardControlArgs} separators />,
  play: async ({ canvasElement }) => {
    await expect(padding(canvasElement, 'card-panel')).toEqual({
      bottom: '24px',
      top: '24px',
    })
    await expect(padding(canvasElement, 'card-header').bottom).toBe('16px')
    await expect(padding(canvasElement, 'card-footer').top).toBe('16px')
  },
}

export const FullPaddingWithoutPanel: Story = {
  render: () => <ComposedCard {...cardControlArgs} content="" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="card-panel"]'),
    ).toBeNull()
    await expect(padding(canvasElement, 'card-header').bottom).toBe('24px')
    await expect(padding(canvasElement, 'card-footer').top).toBe('24px')
  },
}

export const FrameFlattensCards: Story = {
  render: () => <StackedFrameCards />,
  play: async ({ canvasElement }) => {
    const frame = slotIn(canvasElement, 'card-frame')
    await expect(getComputedStyle(frame).borderTopLeftRadius).toBe(
      resolveRadius(canvasElement, 'var(--radius-2xl)'),
    )
    const cards = frame.querySelectorAll<HTMLElement>('[data-slot="card"]')
    await expect(cards).toHaveLength(2)
    const innerRadius = resolveRadius(canvasElement, 'var(--radius-xl)')
    for (const card of cards) {
      const style = getComputedStyle(card)
      await expect(style.borderTopLeftRadius).toBe(innerRadius)
      await expect(style.borderBottomLeftRadius).toBe(innerRadius)
      await expect(style.marginTop).toBe('-1px')
      await expect(style.marginLeft).toBe('-1px')
      await expect(style.boxShadow).not.toContain('0px 1px 2px')
      await expect(style.backgroundClip).toBe('padding-box')
      await expect(getComputedStyle(card, '::before').display).toBe('none')
    }
    const [first, second] = cards
    await expect(
      Math.round(
        first.getBoundingClientRect().bottom -
          second.getBoundingClientRect().top,
      ),
    ).toBe(2)
  },
}

export const FrameActionBesideHeader: Story = {
  render: () => <ComposedCard {...cardControlArgs} frame />,
  play: async ({ canvasElement }) => {
    const title = slotIn(
      canvasElement,
      'card-frame-title',
    ).getBoundingClientRect()
    const description = slotIn(
      canvasElement,
      'card-frame-description',
    ).getBoundingClientRect()
    const action = slotIn(
      canvasElement,
      'card-frame-action',
    ).getBoundingClientRect()
    await expect(action.left).toBeGreaterThan(title.right)
    await expect(description.left).toBe(title.left)
    const headerMiddle = (title.top + description.bottom) / 2
    const actionMiddle = (action.top + action.bottom) / 2
    await expect(Math.abs(headerMiddle - actionMiddle)).toBeLessThanOrEqual(1)
  },
}

export const ActionsInTabOrder: Story = {
  render: () => <FooterActionsCard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const edit = canvas.getByRole('button', { name: 'Edit' })
    const cancel = canvas.getByRole('button', { name: 'Cancel' })
    const save = canvas.getByRole('button', { name: 'Save' })
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    await userEvent.tab()
    await expect(edit).toHaveFocus()
    await userEvent.tab()
    await expect(cancel).toHaveFocus()
    await userEvent.tab()
    await expect(save).toHaveFocus()
  },
}

export const ClassNameWins: Story = {
  render: () => <TeamMembersFrame />,
  play: async ({ canvasElement }) => {
    const panel = getComputedStyle(slotIn(canvasElement, 'card-panel'))
    await expect(panel.paddingTop).toBe('0px')
    await expect(panel.paddingInlineStart).toBe('0px')
    await expect(panel.flexGrow).toBe('1')
  },
}
