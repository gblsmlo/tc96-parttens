import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TabsPrimitive } from '@tc96/ui/tabs'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { tabsControlArgs } from './tabs-controls.ts'
import { inactiveTabContrast, TabsCanvas } from './tabs-frame.tsx'
import { ComposedTabs } from './tabs-layouts.tsx'
import { tabPanelCopy } from './tabs-variants.ts'

interface BehaviorArgs {
  onValueChange: NonNullable<TabsPrimitive.Root.Props['onValueChange']>
}

const { firstTab, secondTab, thirdTab } = tabsControlArgs

const slotOf = (canvasElement: HTMLElement, slot: string) =>
  canvasElement.querySelector(`[data-slot="${slot}"]`) as HTMLElement

const meta = {
  args: { onValueChange: fn() },
  argTypes: { onValueChange: { control: false } },
  decorators: [TabsCanvas],
  parameters: { ...inactiveTabContrast, layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Tabs/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const SelectsOnPress: Story = {
  render: ({ onValueChange }) => (
    <ComposedTabs {...tabsControlArgs} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('tab', { name: firstTab })
    const second = canvas.getByRole('tab', { name: secondTab })
    await expect(first).toHaveAttribute('aria-selected', 'true')
    await expect(second).toHaveAttribute('aria-selected', 'false')
    await userEvent.click(second)
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'activity',
      expect.objectContaining({ reason: 'none' }),
    )
    await expect(second).toHaveAttribute('aria-selected', 'true')
    await expect(second).toHaveAttribute('data-active')
    await expect(first).toHaveAttribute('aria-selected', 'false')
    await expect(first).not.toHaveAttribute('data-active')
    await expect(canvas.getByText(tabPanelCopy.activity)).toBeVisible()
  },
}

export const OnlyActivePanelMounted: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('tabpanel')).toHaveLength(1)
    await expect(canvas.queryByText(tabPanelCopy.activity)).toBeNull()
    await userEvent.click(canvas.getByRole('tab', { name: secondTab }))
    await waitFor(() =>
      expect(canvas.queryByText(tabPanelCopy.overview)).toBeNull(),
    )
    await expect(canvas.getAllByRole('tabpanel')).toHaveLength(1)
  },
}

export const TabControlsItsPanel: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tab = canvas.getByRole('tab', { name: firstTab })
    const panel = canvas.getByRole('tabpanel', { name: firstTab })
    await expect(tab).toHaveAttribute('aria-controls', panel.id)
    await expect(panel).toHaveAttribute('aria-labelledby', tab.id)
  },
}

export const PanelInTabOrder: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('tabpanel')).toHaveFocus()
  },
}

export const ArrowKeysMoveFocus: Story = {
  render: ({ onValueChange }) => (
    <ComposedTabs {...tabsControlArgs} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const second = canvas.getByRole('tab', { name: secondTab })
    await userEvent.tab()
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(second).toHaveFocus()
    await expect(second).toHaveAttribute('aria-selected', 'false')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const HomeAndEndKeys: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('tab', { name: thirdTab })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveFocus()
  },
}

export const EnterOrSpaceSelects: Story = {
  render: ({ onValueChange }) => (
    <ComposedTabs {...tabsControlArgs} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByRole('tab', { name: secondTab })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'activity',
      expect.anything(),
    )
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard(' ')
    await expect(canvas.getByRole('tab', { name: thirdTab })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'settings',
      expect.anything(),
    )
    await expect(args.onValueChange).toHaveBeenCalledTimes(2)
  },
}

export const SelectsOnFocus: Story = {
  render: ({ onValueChange }) => (
    <ComposedTabs
      {...tabsControlArgs}
      activateOnFocus
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    const second = canvas.getByRole('tab', { name: secondTab })
    await expect(second).toHaveFocus()
    await expect(second).toHaveAttribute('aria-selected', 'true')
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'activity',
      expect.anything(),
    )
    await expect(canvas.getByText(tabPanelCopy.activity)).toBeVisible()
  },
}

export const FocusLoops: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(canvas.getByRole('tab', { name: thirdTab })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveFocus()
  },
}

export const FocusStopsAtEnds: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} loopFocus={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveFocus()
    await userEvent.keyboard('{End}')
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: thirdTab })).toHaveFocus()
  },
}

export const VerticalArrowKeys: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} orientation="vertical" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    )
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('tab', { name: secondTab })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: secondTab })).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveFocus()
  },
}

export const VerticalListBesidePanels: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} orientation="vertical" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(slotOf(canvasElement, 'tabs')).toHaveAttribute(
      'data-orientation',
      'vertical',
    )
    const list = canvas.getByRole('tablist').getBoundingClientRect()
    const panel = canvas.getByRole('tabpanel').getBoundingClientRect()
    await expect(panel.left).toBeGreaterThanOrEqual(list.right)
    await expect(panel.top).toBeCloseTo(list.top, 0)
  },
}

export const FocusableWhenDisabled: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} disabledTab />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const third = canvas.getByRole('tab', { name: thirdTab })
    await expect(third).toHaveAttribute('aria-disabled', 'true')
    await expect(third).toHaveAttribute('data-disabled')
    await expect(third).not.toHaveAttribute('disabled')
    await userEvent.tab()
    await userEvent.keyboard('{End}')
    await expect(third).toHaveFocus()
  },
}

export const DisabledTabIgnoresPress: Story = {
  render: ({ onValueChange }) => (
    <ComposedTabs
      {...tabsControlArgs}
      disabledTab
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const third = within(canvasElement).getByRole('tab', { name: thirdTab })
    await expect(getComputedStyle(third).pointerEvents).toBe('none')
    third.click()
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(third).toHaveAttribute('aria-selected', 'false')
  },
}

export const DisabledTabIgnoresKeys: Story = {
  render: ({ onValueChange }) => (
    <ComposedTabs
      {...tabsControlArgs}
      disabledTab
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const third = canvas.getByRole('tab', { name: thirdTab })
    await userEvent.tab()
    await userEvent.keyboard('{End}')
    await expect(third).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(third).toHaveAttribute('aria-selected', 'false')
    await expect(canvas.getByText(tabPanelCopy.overview)).toBeVisible()
  },
}

export const FirstEnabledTabByDefault: Story = {
  render: ({ onValueChange }) => (
    <Tabs onValueChange={onValueChange}>
      <TabsList>
        <TabsTab disabled value="overview">
          {firstTab}
        </TabsTab>
        <TabsTab value="activity">{secondTab}</TabsTab>
      </TabsList>
      <TabsPanel value="overview">{tabPanelCopy.overview}</TabsPanel>
      <TabsPanel value="activity">{tabPanelCopy.activity}</TabsPanel>
    </Tabs>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() =>
      expect(canvas.getByRole('tab', { name: secondTab })).toHaveAttribute(
        'aria-selected',
        'true',
      ),
    )
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'activity',
      expect.objectContaining({ reason: 'initial' }),
    )
    await expect(canvas.getByText(tabPanelCopy.activity)).toBeVisible()
  },
}

export const ControlledValue: Story = {
  render: ({ onValueChange }) => (
    <ComposedTabs
      {...tabsControlArgs}
      onValueChange={onValueChange}
      value="overview"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: secondTab }))
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'activity',
      expect.anything(),
    )
    await expect(canvas.getByRole('tab', { name: firstTab })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByText(tabPanelCopy.overview)).toBeVisible()
    await expect(canvas.queryByText(tabPanelCopy.activity)).toBeNull()
  },
}

export const KeepMounted: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} keepMounted />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hidden = canvas.getByText(tabPanelCopy.activity)
    await expect(hidden).not.toBeVisible()
    await expect(hidden.parentElement).toHaveAttribute('hidden')
    await expect(hidden.parentElement).toHaveAttribute('data-hidden')
    await userEvent.click(canvas.getByRole('tab', { name: secondTab }))
    await waitFor(() => expect(hidden).toBeVisible())
    await waitFor(() =>
      expect(canvas.getByText(tabPanelCopy.overview)).not.toBeVisible(),
    )
  },
}

export const IndicatorFollowsActiveTab: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const indicator = slotOf(canvasElement, 'tab-indicator')
    const second = canvas.getByRole('tab', { name: secondTab })
    await userEvent.click(second)
    await waitFor(() => {
      const bar = indicator.getBoundingClientRect()
      const tab = second.getBoundingClientRect()
      expect(bar.left).toBeCloseTo(tab.left, 0)
      expect(bar.width).toBeCloseTo(tab.width, 0)
      expect(bar.height).toBeCloseTo(tab.height, 0)
    })
  },
}

export const UnderlineBar: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} variant="underline" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('tablist')
    const indicator = slotOf(canvasElement, 'tab-indicator')
    const second = canvas.getByRole('tab', { name: secondTab })
    await userEvent.click(second)
    await waitFor(() => {
      const bar = indicator.getBoundingClientRect()
      const tab = second.getBoundingClientRect()
      expect(bar.height).toBe(2)
      expect(bar.left).toBeCloseTo(tab.left, 0)
      expect(bar.width).toBeCloseTo(tab.width, 0)
      expect(bar.bottom).toBeCloseTo(list.getBoundingClientRect().bottom + 1, 0)
    })
  },
}

export const TabSizeFollowsList: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList size="sm">
        <TabsTab value="overview">{firstTab}</TabsTab>
        <TabsTab size="lg" value="activity">
          {secondTab}
        </TabsTab>
      </TabsList>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tablist')).toHaveAttribute('data-size', 'sm')
    const first = canvas.getByRole('tab', { name: firstTab })
    const second = canvas.getByRole('tab', { name: secondTab })
    await expect(first).toHaveAttribute('data-size', 'sm')
    await expect(second).toHaveAttribute('data-size', 'lg')
    await expect(second.getBoundingClientRect().height).toBeGreaterThan(
      first.getBoundingClientRect().height,
    )
  },
}

export const FocusRing: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} />,
  play: async ({ canvasElement }) => {
    const tab = within(canvasElement).getByRole('tab', { name: firstTab })
    await expect(getComputedStyle(tab).boxShadow).toBe('none')
    await userEvent.tab()
    await expect(tab).toHaveFocus()
    await expect(tab.matches(':focus-visible')).toBe(true)
    await waitFor(() =>
      expect(getComputedStyle(tab).boxShadow).not.toBe('none'),
    )
  },
}
