import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Toolbar, ToolbarButton } from '@tc96/ui/toolbar'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { toolbarControlArgs } from './toolbar-controls.ts'
import { ComposedToolbar } from './toolbar-layouts.tsx'

interface BehaviorArgs {
  onAction: () => void
}

const meta = {
  args: { onAction: fn() },
  argTypes: { onAction: { control: false } },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Toolbar/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const buttonNamed = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('button', { name })

const press = async (key: string, expected: HTMLElement) => {
  await userEvent.keyboard(`{${key}}`)
  await waitFor(() => expect(expected).toHaveFocus())
}

const WithNextControl = () => (
  <div className="flex flex-col items-start gap-4">
    <ComposedToolbar {...toolbarControlArgs} />
    <Button variant="outline">Publish</Button>
  </div>
)

export const ToolbarRole: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} />,
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Editor',
    })
    await expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(toolbar).toHaveAttribute('data-orientation', 'horizontal')
  },
}

export const GroupRole: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} />,
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar')
    const groups = within(toolbar).getAllByRole('group')
    await expect(groups).toHaveLength(2)
    await expect(
      within(groups[0] as HTMLElement).getByRole('button', { name: 'Undo' }),
    ).toBeVisible()
  },
}

export const SeparatorsCrossTheToolbar: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <ComposedToolbar {...toolbarControlArgs} />
      <ComposedToolbar {...toolbarControlArgs} orientation="vertical" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [horizontal, vertical] = within(canvasElement).getAllByRole(
      'toolbar',
    ) as [HTMLElement, HTMLElement]
    const itemHeight = within(horizontal)
      .getByRole('button', { name: 'Undo' })
      .getBoundingClientRect().height
    for (const separator of within(horizontal).getAllByRole('separator')) {
      const line = separator.getBoundingClientRect()
      await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
      await expect(line.width).toBe(1)
      await expect(line.height).toBeCloseTo(itemHeight - 12, 0)
    }
    const innerWidth = vertical.clientWidth - 8
    for (const separator of within(vertical).getAllByRole('separator')) {
      const line = separator.getBoundingClientRect()
      await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
      await expect(line.height).toBe(1)
      await expect(line.width).toBeCloseTo(innerWidth, 0)
    }
  },
}

export const VerticalArrowKeys: Story = {
  render: () => (
    <ComposedToolbar {...toolbarControlArgs} orientation="vertical" />
  ),
  play: async ({ canvasElement }) => {
    const undo = buttonNamed(canvasElement, 'Undo')
    const redo = buttonNamed(canvasElement, 'Redo')
    await userEvent.tab()
    await expect(undo).toHaveFocus()
    await press('ArrowDown', redo)
    await userEvent.keyboard('{ArrowRight}')
    await expect(redo).toHaveFocus()
    await press('ArrowUp', undo)
  },
}

export const SingleTabStop: Story = {
  render: () => <WithNextControl />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Undo')).toHaveFocus()
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Publish')).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect(buttonNamed(canvasElement, 'Undo')).toHaveFocus()
  },
}

export const TabReturnsToLastItem: Story = {
  render: () => <WithNextControl />,
  play: async ({ canvasElement }) => {
    const bold = buttonNamed(canvasElement, 'Bold')
    await userEvent.tab()
    await press('ArrowRight', buttonNamed(canvasElement, 'Redo'))
    await press('ArrowRight', bold)
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Publish')).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect(bold).toHaveFocus()
  },
}

export const ArrowKeysCrossGroups: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} />,
  play: async ({ canvasElement }) => {
    const order = ['Undo', 'Redo', 'Bold', 'Italic', 'Underline', 'Save']
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Undo')).toHaveFocus()
    for (const name of order.slice(1)) {
      await press('ArrowRight', buttonNamed(canvasElement, name))
    }
    for (const name of order.slice(0, -1).reverse()) {
      await press('ArrowLeft', buttonNamed(canvasElement, name))
    }
  },
}

export const OtherKeysKeepFocus: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} />,
  play: async ({ canvasElement }) => {
    const bold = buttonNamed(canvasElement, 'Bold')
    await userEvent.tab()
    await press('ArrowRight', buttonNamed(canvasElement, 'Redo'))
    await press('ArrowRight', bold)
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
      await userEvent.keyboard(`{${key}}`)
      await expect(bold).toHaveFocus()
    }
  },
}

export const ClassesMergeWithRenderedComponent: Story = {
  render: () => (
    <Toolbar aria-label="Publishing">
      <ToolbarButton className="w-40" render={<Button variant="outline" />}>
        Publish
      </ToolbarButton>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const publish = buttonNamed(canvasElement, 'Publish')
    await expect(publish.getBoundingClientRect().width).toBe(160)
    await expect(publish).toHaveClass('w-40', 'border-input')
  },
}

export const LoopsFocusAtTheEnds: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} />,
  play: async ({ canvasElement }) => {
    const undo = buttonNamed(canvasElement, 'Undo')
    const save = buttonNamed(canvasElement, 'Save')
    await userEvent.tab()
    await press('ArrowLeft', save)
    await press('ArrowRight', undo)
  },
}

export const StopsAtTheEndsWithoutLoop: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} loopFocus={false} />,
  play: async ({ canvasElement }) => {
    const undo = buttonNamed(canvasElement, 'Undo')
    const save = buttonNamed(canvasElement, 'Save')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(undo).toHaveFocus()
    for (const name of ['Redo', 'Bold', 'Italic', 'Underline', 'Save']) {
      await press('ArrowRight', buttonNamed(canvasElement, name))
    }
    await userEvent.keyboard('{ArrowRight}')
    await expect(save).toHaveFocus()
  },
}

export const DisabledToolbarDisablesItems: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} disabled input />,
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar')
    const input = within(toolbar).getByRole('textbox', { name: 'Search' })
    await expect(toolbar).toHaveAttribute('data-disabled')
    for (const item of [...within(toolbar).getAllByRole('button'), input]) {
      await expect(item).toHaveAttribute('aria-disabled', 'true')
      await expect(item).toHaveAttribute('data-disabled')
      await expect(item).not.toBeDisabled()
    }
  },
}

export const DisabledItemsStayInArrowOrder: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Undo')).toHaveFocus()
    await press('ArrowRight', buttonNamed(canvasElement, 'Redo'))
    await press('ArrowRight', buttonNamed(canvasElement, 'Bold'))
    await press('ArrowLeft', buttonNamed(canvasElement, 'Redo'))
  },
}

export const DisabledItemsIgnoreClicks: Story = {
  render: ({ onAction }) => (
    <ComposedToolbar {...toolbarControlArgs} disabled onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const bold = buttonNamed(canvasElement, 'Bold')
    await userEvent.click(buttonNamed(canvasElement, 'Save'))
    await expect(args.onAction).not.toHaveBeenCalled()
    await userEvent.click(bold)
    await expect(bold).toHaveAttribute('aria-pressed', 'false')
  },
}

export const DisabledInputIgnoresTyping: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} disabled input />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Search' })
    await userEvent.tab()
    await press('ArrowLeft', buttonNamed(canvasElement, 'Save'))
    await press('ArrowLeft', input)
    await userEvent.keyboard('q3')
    await expect(input).toHaveValue('')
  },
}

export const DisabledGroupOnly: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} disabledGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('toolbar')).not.toHaveAttribute(
      'data-disabled',
    )
    const [history, formatting] = canvas.getAllByRole('group') as [
      HTMLElement,
      HTMLElement,
    ]
    await expect(formatting).toHaveAttribute('data-disabled')
    await expect(history).not.toHaveAttribute('data-disabled')
    for (const name of ['Bold', 'Italic', 'Underline']) {
      await expect(buttonNamed(canvasElement, name)).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    }
    for (const name of ['Undo', 'Redo', 'Save']) {
      await expect(buttonNamed(canvasElement, name)).toHaveAttribute(
        'aria-disabled',
        'false',
      )
    }
  },
}

const NotFocusableRedo = () => (
  <Toolbar aria-label="History">
    <ToolbarButton render={<Button variant="ghost" />}>Undo</ToolbarButton>
    <ToolbarButton
      disabled
      focusableWhenDisabled={false}
      render={<Button variant="ghost" />}
    >
      Redo
    </ToolbarButton>
    <ToolbarButton render={<Button variant="ghost" />}>History</ToolbarButton>
  </Toolbar>
)

export const NativeDisabledWhenNotFocusable: Story = {
  render: () => <NotFocusableRedo />,
  play: async ({ canvasElement }) => {
    const redo = buttonNamed(canvasElement, 'Redo')
    await expect(redo).toBeDisabled()
    await expect(redo).toHaveAttribute('data-disabled')
    await expect(redo).not.toHaveAttribute('aria-disabled')
    await expect(redo).not.toHaveAttribute('data-focusable')
  },
}

export const SkipsItemsNotFocusableWhenDisabled: Story = {
  render: () => <NotFocusableRedo />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(buttonNamed(canvasElement, 'Undo')).toHaveFocus()
    await press('ArrowRight', buttonNamed(canvasElement, 'History'))
    await press('ArrowLeft', buttonNamed(canvasElement, 'Undo'))
  },
}

export const DimsOnlyWhenNotFocusable: Story = {
  render: () => (
    <Toolbar aria-label="Publishing">
      <ToolbarButton disabled render={<Button variant="outline" />}>
        Preview
      </ToolbarButton>
      <ToolbarButton
        disabled
        focusableWhenDisabled={false}
        render={<Button variant="outline" />}
      >
        Publish
      </ToolbarButton>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const preview = buttonNamed(canvasElement, 'Preview')
    const publish = buttonNamed(canvasElement, 'Publish')
    await expect(getComputedStyle(preview).opacity).toBe('1')
    await expect(getComputedStyle(publish).opacity).toBe('0.64')
  },
}

export const InputKeepsArrowKeysWhileEditing: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} input />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Search' })
    await userEvent.click(input)
    await userEvent.type(input, 'q3')
    await userEvent.keyboard('{ArrowLeft}')
    await expect(input).toHaveFocus()
    await expect(input).toHaveProperty('selectionStart', 1)
    await userEvent.keyboard('{ArrowRight}')
    await expect(input).toHaveFocus()
    await expect(input).toHaveProperty('selectionStart', 2)
    await press('ArrowRight', buttonNamed(canvasElement, 'Save'))
  },
}

export const InputSelectsTextOnFocus: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} input />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Search' })
    await userEvent.click(input)
    await userEvent.type(input, 'q3')
    await press('ArrowRight', buttonNamed(canvasElement, 'Save'))
    await press('ArrowLeft', input)
    await expect(input).toHaveProperty('selectionStart', 0)
    await expect(input).toHaveProperty('selectionEnd', 2)
  },
}

export const LinkJoinsArrowNavigation: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} link="All files" />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'All files' })
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await press('ArrowRight', buttonNamed(canvasElement, 'Undo'))
    await press('ArrowLeft', link)
  },
}

export const DisabledToolbarKeepsLinks: Story = {
  render: () => (
    <ComposedToolbar {...toolbarControlArgs} disabled link="All files" />
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'All files' })
    await expect(buttonNamed(canvasElement, 'Undo')).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await expect(link).not.toHaveAttribute('aria-disabled')
    await expect(link).not.toHaveAttribute('data-disabled')
  },
}

export const RenderedItemsKeepTheirBehavior: Story = {
  render: ({ onAction }) => (
    <ComposedToolbar {...toolbarControlArgs} onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const bold = buttonNamed(canvasElement, 'Bold')
    await userEvent.click(bold)
    await expect(bold).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(buttonNamed(canvasElement, 'Save'))
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

export const ItemSlotsReplaceRenderedSlots: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} input />,
  play: async ({ canvasElement }) => {
    await expect(buttonNamed(canvasElement, 'Save')).toHaveAttribute(
      'data-slot',
      'toolbar-button',
    )
    await expect(buttonNamed(canvasElement, 'Bold')).toHaveAttribute(
      'data-slot',
      'toolbar-button',
    )
    const input = within(canvasElement).getByRole('textbox', { name: 'Search' })
    await expect(input).toHaveAttribute('data-slot', 'toolbar-input')
    await expect(input.parentElement).toHaveAttribute(
      'data-slot',
      'input-control',
    )
  },
}
