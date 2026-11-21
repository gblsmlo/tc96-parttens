import type { Meta, StoryObj } from '@storybook/react-vite'
import type { AccordionPrimitive } from '@tc96/ui/accordion'
import {
  expect,
  fn,
  isInaccessible,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { accordionControlArgs } from './accordion-controls.ts'
import { AccordionCanvas } from './accordion-frame.tsx'
import { ComposedAccordion } from './accordion-layouts.tsx'
import { accordionItems } from './accordion-variants.ts'

interface BehaviorArgs {
  onItemOpenChange: AccordionPrimitive.Item.Props['onOpenChange']
  onValueChange: AccordionPrimitive.Root.Props['onValueChange']
}

const { firstTrigger, secondTrigger, thirdTrigger } = accordionControlArgs
const [first, second, third] = accordionItems

const slotOf = (canvasElement: HTMLElement, slot: string) =>
  canvasElement.querySelector(`[data-slot="${slot}"]`) as HTMLElement | null

const slotsOf = (canvasElement: HTMLElement, slot: string) => [
  ...canvasElement.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`),
]

const triggerPress = expect.objectContaining({ reason: 'trigger-press' })

const meta = {
  args: { onItemOpenChange: fn(), onValueChange: fn() },
  argTypes: {
    onItemOpenChange: { control: false },
    onValueChange: { control: false },
  },
  decorators: [AccordionCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Accordion/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const TogglesOnPress: Story = {
  render: ({ onValueChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: firstTrigger })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(first.content)).toBeNull()
    await userEvent.click(button)
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['first'],
      triggerPress,
    )
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(canvas.getByText(first.content)).toBeVisible())
    await userEvent.click(button)
    await expect(args.onValueChange).toHaveBeenLastCalledWith([], triggerPress)
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(canvas.queryByText(first.content)).toBeNull())
  },
}

export const OneOpenAtATime: Story = {
  render: ({ onValueChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const firstButton = canvas.getByRole('button', { name: firstTrigger })
    const secondButton = canvas.getByRole('button', { name: secondTrigger })
    await userEvent.click(firstButton)
    await waitFor(() => expect(canvas.getByText(first.content)).toBeVisible())
    await userEvent.click(secondButton)
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['second'],
      triggerPress,
    )
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    await expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(canvas.queryByText(first.content)).toBeNull())
    await waitFor(() => expect(canvas.getByText(second.content)).toBeVisible())
  },
}

export const MultipleKeepsOthersOpen: Story = {
  render: ({ onValueChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      multiple
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const firstButton = canvas.getByRole('button', { name: firstTrigger })
    const secondButton = canvas.getByRole('button', { name: secondTrigger })
    await userEvent.click(firstButton)
    await userEvent.click(secondButton)
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['first', 'second'],
      triggerPress,
    )
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    await expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(canvas.getByText(first.content)).toBeVisible())
    await waitFor(() => expect(canvas.getByText(second.content)).toBeVisible())
    await userEvent.click(firstButton)
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['second'],
      triggerPress,
    )
    await expect(secondButton).toHaveAttribute('aria-expanded', 'true')
  },
}

export const KeyboardToggle: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const firstButton = canvas.getByRole('button', { name: firstTrigger })
    await userEvent.tab()
    await expect(firstButton).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(canvas.getByText(first.content)).toBeVisible())
    await userEvent.keyboard(' ')
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(canvas.queryByText(first.content)).toBeNull())
  },
}

export const ArrowKeysKeepFocus: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const firstButton = canvas.getByRole('button', { name: firstTrigger })
    await userEvent.tab()
    await expect(firstButton).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(firstButton).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(firstButton).toHaveFocus()
  },
}

export const FocusRingOnKeyboard: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: firstTrigger,
    })
    await expect(getComputedStyle(button).boxShadow).toBe('none')
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await expect(button.matches(':focus-visible')).toBe(true)
    await waitFor(() =>
      expect(getComputedStyle(button).boxShadow).not.toBe('none'),
    )
  },
}

export const TriggerInHeading: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const headings = canvas.getAllByRole('heading', { level: 3 })
    await expect(headings).toHaveLength(accordionItems.length)
    await expect(
      within(headings[0] as HTMLElement).getByRole('button', {
        name: firstTrigger,
      }),
    ).toBeInTheDocument()
  },
}

export const PanelNamedByTrigger: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: firstTrigger })
    await expect(button).not.toHaveAttribute('aria-controls')
    await userEvent.click(button)
    const region = await canvas.findByRole('region', { name: firstTrigger })
    await expect(button).toHaveAttribute('aria-controls', region.id)
    await expect(region).toHaveTextContent(first.content)
  },
}

export const DecorativeChevron: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: firstTrigger,
    })
    const indicator = slotOf(canvasElement, 'accordion-indicator') as Element
    await expect(button).toContainElement(indicator as HTMLElement)
    await expect(isInaccessible(indicator)).toBe(true)
    await expect(isInaccessible(button)).toBe(false)
  },
}

export const ChevronTurnsWhenOpen: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: firstTrigger,
    })
    const indicator = button.querySelector(
      '[data-slot="accordion-indicator"]',
    ) as Element
    await expect(getComputedStyle(indicator).rotate).toBe('none')
    await userEvent.click(button)
    await waitFor(() =>
      expect(getComputedStyle(indicator).rotate).toBe('180deg'),
    )
    await userEvent.click(button)
    await waitFor(() => expect(getComputedStyle(indicator).rotate).toBe('none'))
  },
}

export const StateAttributes: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const [item, nextItem] = slotsOf(canvasElement, 'accordion-item')
    const button = slotOf(canvasElement, 'accordion-trigger') as HTMLElement
    await expect(item).toHaveAttribute('data-closed')
    await expect(item).toHaveAttribute('data-index', '0')
    await expect(nextItem).toHaveAttribute('data-index', '1')
    await expect(button).not.toHaveAttribute('data-panel-open')
    await userEvent.click(button)
    await expect(item).toHaveAttribute('data-open')
    await expect(item).not.toHaveAttribute('data-closed')
    await expect(button).toHaveAttribute('data-panel-open')
    await expect(nextItem).toHaveAttribute('data-closed')
    await waitFor(() =>
      expect(slotOf(canvasElement, 'accordion-panel')).toHaveAttribute(
        'data-open',
      ),
    )
    for (const slot of [
      'accordion',
      'accordion-item',
      'accordion-trigger',
      'accordion-panel',
    ])
      await expect(slotOf(canvasElement, slot)).toHaveAttribute(
        'data-orientation',
        'vertical',
      )
  },
}

export const OrientationOnlyMarks: Story = {
  render: () => (
    <ComposedAccordion
      {...accordionControlArgs}
      defaultValue="first"
      orientation="horizontal"
    />
  ),
  play: async ({ canvasElement }) => {
    for (const slot of [
      'accordion',
      'accordion-item',
      'accordion-trigger',
      'accordion-panel',
    ])
      await expect(slotOf(canvasElement, slot)).toHaveAttribute(
        'data-orientation',
        'horizontal',
      )
    const firstButton = within(canvasElement).getByRole('button', {
      name: firstTrigger,
    })
    await userEvent.tab()
    await expect(firstButton).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(firstButton).toHaveFocus()
  },
}

export const ClosedPanelAttributes: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} keepMounted />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = slotOf(canvasElement, 'accordion-item') as HTMLElement
    const panel = slotOf(canvasElement, 'accordion-panel') as HTMLElement
    await expect(item).toHaveAttribute('data-hidden')
    await expect(panel).toHaveAttribute('data-closed')
    const button = canvas.getByRole('button', { name: firstTrigger })
    await userEvent.click(button)
    await expect(item).not.toHaveAttribute('data-hidden')
    await waitFor(() => expect(panel).toHaveAttribute('data-open'))
    await userEvent.click(button)
    await waitFor(() => expect(panel).toHaveAttribute('data-closed'))
    await waitFor(() => expect(item).toHaveAttribute('data-hidden'))
  },
}

export const OpenOnFirstRender: Story = {
  render: () => (
    <ComposedAccordion {...accordionControlArgs} defaultValue="second" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: secondTrigger }),
    ).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText(second.content)).toBeVisible()
    await expect(canvas.queryByText(first.content)).toBeNull()
  },
}

export const ControlledValue: Story = {
  render: ({ onValueChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      onValueChange={onValueChange}
      value={[]}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: firstTrigger })
    await userEvent.click(button)
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['first'],
      triggerPress,
    )
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(first.content)).toBeNull()
  },
}

export const ItemOpenChange: Story = {
  render: ({ onItemOpenChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      onItemOpenChange={onItemOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: firstTrigger,
    })
    await userEvent.click(button)
    await expect(args.onItemOpenChange).toHaveBeenCalledOnce()
    await expect(args.onItemOpenChange).toHaveBeenLastCalledWith(
      true,
      triggerPress,
    )
    await userEvent.click(button)
    await expect(args.onItemOpenChange).toHaveBeenLastCalledWith(
      false,
      triggerPress,
    )
  },
}

export const DisabledIgnoresPress: Story = {
  render: ({ onValueChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      disabled
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: firstTrigger })
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await userEvent.click(button)
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toHaveAttribute('aria-disabled', 'true')
    await expect(canvas.queryByText(first.content)).toBeNull()
  },
}

export const DisabledMarksEveryPart: Story = {
  render: () => (
    <ComposedAccordion
      {...accordionControlArgs}
      defaultValue="first"
      disabled
      disabledItem={false}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(slotOf(canvasElement, 'accordion')).toHaveAttribute(
      'data-disabled',
    )
    for (const item of slotsOf(canvasElement, 'accordion-item'))
      await expect(item).toHaveAttribute('data-disabled')
    for (const trigger of slotsOf(canvasElement, 'accordion-trigger'))
      await expect(trigger).toHaveAttribute('data-disabled')
    await expect(slotOf(canvasElement, 'accordion-panel')).toHaveAttribute(
      'data-disabled',
    )
  },
}

export const DisabledItemIgnoresPress: Story = {
  render: ({ onValueChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      disabledItem
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const disabledButton = canvas.getByRole('button', { name: thirdTrigger })
    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true')
    await expect(disabledButton).toHaveAttribute('data-disabled')
    await expect(slotOf(canvasElement, 'accordion')).not.toHaveAttribute(
      'data-disabled',
    )
    await userEvent.click(disabledButton)
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(canvas.queryByText(third.content)).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: firstTrigger }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['first'],
      triggerPress,
    )
    await waitFor(() => expect(canvas.getByText(first.content)).toBeVisible())
  },
}

export const HeightFollowsContent: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: firstTrigger }))
    const panel = slotOf(canvasElement, 'accordion-panel') as HTMLElement
    await waitFor(() =>
      expect(panel.getBoundingClientRect().height).toBeCloseTo(
        panel.scrollHeight,
        0,
      ),
    )
    await waitFor(() =>
      expect(panel.style.getPropertyValue('--accordion-panel-height')).toBe(
        'auto',
      ),
    )
  },
}

export const ClassNameOnContentWrapper: Story = {
  render: () => (
    <ComposedAccordion
      {...accordionControlArgs}
      defaultValue="first"
      panelClassName="pb-6"
    />
  ),
  play: async ({ canvasElement }) => {
    const panel = slotOf(canvasElement, 'accordion-panel') as HTMLElement
    const wrapper = panel.firstElementChild as HTMLElement
    await expect(panel).not.toHaveClass('pb-6')
    await expect(wrapper).toHaveClass('pb-6')
    await expect(wrapper).not.toHaveClass('pb-4')
    await expect(wrapper).toHaveTextContent(first.content)
  },
}

export const KeepMounted: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} keepMounted />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const panels = slotsOf(canvasElement, 'accordion-panel')
    await expect(panels).toHaveLength(accordionItems.length)
    const [panel] = panels as [HTMLElement]
    await expect(panel).toHaveAttribute('hidden')
    await expect(canvas.getByText(first.content)).not.toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: firstTrigger }))
    await waitFor(() => expect(canvas.getByText(first.content)).toBeVisible())
    await expect(slotOf(canvasElement, 'accordion-panel')).toBe(panel)
  },
}

export const FoundByPageSearch: Story = {
  render: ({ onValueChange }) => (
    <ComposedAccordion
      {...accordionControlArgs}
      hiddenUntilFound
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const [, panel] = slotsOf(canvasElement, 'accordion-panel') as [
      HTMLElement,
      HTMLElement,
    ]
    await expect(panel).toHaveAttribute('hidden', 'until-found')
    panel.dispatchEvent(new Event('beforematch', { bubbles: true }))
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenCalledWith(
        ['second'],
        expect.anything(),
      ),
    )
    await waitFor(() => expect(canvas.getByText(second.content)).toBeVisible())
    await expect(
      canvas.getByRole('button', { name: secondTrigger }),
    ).toHaveAttribute('aria-expanded', 'true')
  },
}
