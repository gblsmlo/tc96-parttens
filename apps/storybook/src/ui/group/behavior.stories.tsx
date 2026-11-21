import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Group, GroupSeparator } from '@tc96/ui/group'
import { expect, fn, userEvent, within } from 'storybook/test'
import { groupControlArgs } from './group-controls.ts'
import {
  AddItemInput,
  ComposedGroup,
  NestedGroups,
  PriceInput,
} from './group-layouts.tsx'

interface BehaviorArgs {
  onAdd: () => void
}

const meta = {
  args: { onAdd: fn() },
  argTypes: {
    onAdd: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Group/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const buttonNamed = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('button', { name })

const ringColor = (canvasElement: HTMLElement) => {
  const probe = document.createElement('span')
  probe.style.backgroundColor = 'var(--color-ring)'
  canvasElement.append(probe)
  const color = getComputedStyle(probe).backgroundColor
  probe.remove()
  return color
}

export const NamedGroup: Story = {
  render: () => <ComposedGroup {...groupControlArgs} />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Insert' })
    await expect(group).toHaveAttribute('data-slot', 'group')
    await expect(within(group).getAllByRole('button')).toHaveLength(3)
  },
}

export const OrientationAttributeOnlyWhenSet: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Group aria-label="Without orientation">
        <Button variant="outline">One</Button>
      </Group>
      <Group aria-label="Horizontal" orientation="horizontal">
        <Button variant="outline">Two</Button>
      </Group>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Without orientation' }),
    ).not.toHaveAttribute('data-orientation')
    await expect(
      canvas.getByRole('group', { name: 'Horizontal' }),
    ).toHaveAttribute('data-orientation', 'horizontal')
  },
}

export const ControlsJoin: Story = {
  render: () => <ComposedGroup {...groupControlArgs} />,
  play: async ({ canvasElement }) => {
    const image = buttonNamed(canvasElement, 'Image')
    const video = buttonNamed(canvasElement, 'Video')
    const link = buttonNamed(canvasElement, 'Link')
    const [separator] = within(canvasElement).getAllByRole('separator')

    const imageStyle = getComputedStyle(image)
    await expect(imageStyle.borderRightWidth).toBe('0px')
    await expect(imageStyle.borderTopRightRadius).toBe('0px')
    await expect(imageStyle.borderTopLeftRadius).not.toBe('0px')
    const videoStyle = getComputedStyle(video)
    await expect(videoStyle.borderLeftWidth).toBe('0px')
    await expect(videoStyle.borderRightWidth).toBe('0px')
    await expect(videoStyle.borderTopLeftRadius).toBe('0px')
    await expect(videoStyle.borderTopRightRadius).toBe('0px')
    const linkStyle = getComputedStyle(link)
    await expect(linkStyle.borderLeftWidth).toBe('0px')
    await expect(linkStyle.borderTopLeftRadius).toBe('0px')
    await expect(linkStyle.borderTopRightRadius).not.toBe('0px')

    const imageBox = image.getBoundingClientRect()
    const separatorBox = (separator as HTMLElement).getBoundingClientRect()
    const videoBox = video.getBoundingClientRect()
    await expect(separatorBox.left).toBeCloseTo(imageBox.right, 1)
    await expect(videoBox.left).toBeCloseTo(separatorBox.right, 1)
    await expect(separatorBox.width).toBeCloseTo(1, 1)
    await expect(separatorBox.height).toBeCloseTo(imageBox.height, 1)
  },
}

export const VerticalStacks: Story = {
  render: () => <ComposedGroup {...groupControlArgs} orientation="vertical" />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('group')).toHaveAttribute(
      'data-orientation',
      'vertical',
    )
    const image = buttonNamed(canvasElement, 'Image')
    const video = buttonNamed(canvasElement, 'Video')
    const [separator] = within(canvasElement).getAllByRole('separator')

    const imageStyle = getComputedStyle(image)
    await expect(imageStyle.borderBottomWidth).toBe('0px')
    await expect(imageStyle.borderBottomLeftRadius).toBe('0px')
    await expect(imageStyle.borderTopLeftRadius).not.toBe('0px')
    const videoStyle = getComputedStyle(video)
    await expect(videoStyle.borderTopWidth).toBe('0px')
    await expect(videoStyle.borderTopLeftRadius).toBe('0px')

    const imageBox = image.getBoundingClientRect()
    const separatorBox = (separator as HTMLElement).getBoundingClientRect()
    const videoBox = video.getBoundingClientRect()
    await expect(separatorBox.top).toBeCloseTo(imageBox.bottom, 1)
    await expect(videoBox.top).toBeCloseTo(separatorBox.bottom, 1)
    await expect(videoBox.left).toBeCloseTo(imageBox.left, 1)
    await expect(videoBox.width).toBeCloseTo(imageBox.width, 1)
  },
}

export const OnlySlottedChildrenJoin: Story = {
  render: () => (
    <Group aria-label="Mixed children">
      <Button variant="outline">Slotted</Button>
      <span className="inline-flex items-center rounded-lg border px-3 text-sm">
        Plain
      </span>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const slotted = getComputedStyle(buttonNamed(canvasElement, 'Slotted'))
    await expect(slotted.borderRightWidth).toBe('1px')
    await expect(slotted.borderTopRightRadius).not.toBe('0px')
    await expect(slotted.borderBottomRightRadius).not.toBe('0px')
    const plain = getComputedStyle(within(canvasElement).getByText('Plain'))
    await expect(plain.borderLeftWidth).toBe('1px')
    await expect(plain.borderTopLeftRadius).not.toBe('0px')
  },
}

export const SeparatorVerticalByDefault: Story = {
  render: () => (
    <Group aria-label="Default separator">
      <Button variant="outline">First</Button>
      <GroupSeparator />
      <Button variant="outline">Second</Button>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole('separator')
    await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    await expect(separator).toHaveAttribute('data-orientation', 'vertical')
  },
}

export const EachControlIsATabStop: Story = {
  render: () => <ComposedGroup {...groupControlArgs} />,
  play: async ({ canvasElement }) => {
    for (const separator of within(canvasElement).getAllByRole('separator')) {
      await expect(separator).not.toHaveAttribute('tabindex')
    }
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Image')).toHaveFocus()
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Video')).toHaveFocus()
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Link')).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect(buttonNamed(canvasElement, 'Video')).toHaveFocus()
  },
}

export const NoArrowKeyNavigation: Story = {
  render: () => <ComposedGroup {...groupControlArgs} />,
  play: async ({ canvasElement }) => {
    const image = buttonNamed(canvasElement, 'Image')
    await userEvent.tab()
    await expect(image).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}{ArrowDown}{End}')
    await expect(image).toHaveFocus()
  },
}

export const FocusedControlOnTop: Story = {
  render: () => <ComposedGroup {...groupControlArgs} />,
  play: async ({ canvasElement }) => {
    const image = buttonNamed(canvasElement, 'Image')
    const video = buttonNamed(canvasElement, 'Video')
    await userEvent.tab()
    await expect(getComputedStyle(image).zIndex).toBe('1')
    await expect(getComputedStyle(video).zIndex).toBe('auto')
    await userEvent.tab()
    await expect(getComputedStyle(video).zIndex).toBe('1')
    await expect(getComputedStyle(image).zIndex).toBe('auto')
  },
}

export const InputStaysEditable: Story = {
  render: () => <PriceInput />,
  play: async ({ canvasElement }) => {
    const amount = within(canvasElement).getByRole('textbox', {
      name: 'Enter the amount',
    })
    await userEvent.clear(amount)
    await userEvent.type(amount, '149.90')
    await expect(amount).toHaveValue('149.90')
  },
}

export const TextRendersAsLabel: Story = {
  render: () => <PriceInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText('USD')
    await expect(text.tagName).toBe('LABEL')
    await expect(text).toHaveAttribute('data-slot', 'group-text')
    await expect(text).toHaveAccessibleName('Currency')
    await userEvent.click(text)
    await expect(
      canvas.getByRole('textbox', { name: 'Enter the amount' }),
    ).toHaveFocus()
  },
}

export const ButtonAndInputStayUsable: Story = {
  render: ({ onAdd }) => <AddItemInput onAdd={onAdd} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Item name' })
    await userEvent.type(input, 'New project')
    await expect(input).toHaveValue('New project')
    const add = canvas.getByRole('button', { name: 'Add' })
    await expect(add).toBeEnabled()
    await userEvent.click(add)
    await expect(args.onAdd).toHaveBeenCalledOnce()
  },
}

export const SeparatorTakesRingNextToFocusedInput: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <AddItemInput />
      <PriceInput />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ring = ringColor(canvasElement)
    const [before, after] = canvas.getAllByRole('separator')
    const background = (element: HTMLElement | undefined) =>
      element ? getComputedStyle(element).backgroundColor : ''
    await expect(background(before)).not.toBe(ring)
    await expect(background(after)).not.toBe(ring)

    await userEvent.click(canvas.getByRole('textbox', { name: 'Item name' }))
    await expect(background(before)).toBe(ring)
    await expect(background(after)).not.toBe(ring)

    await userEvent.click(
      canvas.getByRole('textbox', { name: 'Enter the amount' }),
    )
    await expect(background(after)).toBe(ring)
    await expect(background(before)).not.toBe(ring)
  },
}

export const NestedGroupsGap: Story = {
  render: () => <NestedGroups />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas
      .getByRole('group', { name: 'First group' })
      .getBoundingClientRect()
    const second = canvas
      .getByRole('group', { name: 'Second group' })
      .getBoundingClientRect()
    await expect(second.left - first.right).toBeCloseTo(8, 1)
  },
}
