import { DotsThreeIcon, TextTIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import {
  RecordGroup,
  RecordGroupItem,
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns'
import { Switch } from '@tc96/ui/switch'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { SettingsCanvas } from './settings-canvas.tsx'
import { switchContrasts } from './settings-contrast.ts'
import {
  fontSizeOptions,
  RowActions,
  SettingSelect,
} from './settings-layouts.tsx'

interface BehaviorArgs {
  onCheckedChange: (checked: boolean) => void
  onCommit: (value: string) => void
  onOpenChange: (open: boolean) => void
  onValueChange: (value: string) => void
}

const meta = {
  args: {
    onCheckedChange: fn(),
    onCommit: fn(),
    onOpenChange: fn(),
    onValueChange: fn(),
  },
  argTypes: {
    onCheckedChange: { control: false },
    onCommit: { control: false },
    onOpenChange: { control: false },
    onValueChange: { control: false },
  },
  decorators: [SettingsCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const rowSlot = (root: Element, name: string) =>
  root.querySelector(`[data-slot="settings-row-${name}"]`)

const sectionSlot = (root: Element, name: string) =>
  root.querySelector(`[data-slot="settings-section-${name}"]`)

const cardOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="card"]') as HTMLElement

const header = (title: string) => (
  <SettingsSectionHeader>
    <SettingsSectionTitle>{title}</SettingsSectionTitle>
  </SettingsSectionHeader>
)

function ControlledCollapsed({
  onOpenChange,
}: Readonly<Pick<BehaviorArgs, 'onOpenChange'>>) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline">
        Open items
      </Button>
      <SettingsCollapsed
        onOpenChange={(next) => onOpenChange(next)}
        open={open}
        title="Items"
      >
        <p>Nested row</p>
      </SettingsCollapsed>
    </div>
  )
}

export const TitleDescriptionAndEndSlot: Story = {
  render: () => (
    <SettingsRow
      description="How people's names appear across the interface"
      endSlot={<button type="button">Full name</button>}
      title="Display names"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(rowSlot(canvasElement, 'title')?.textContent).toBe(
      'Display names',
    )
    await expect(rowSlot(canvasElement, 'description')?.textContent).toBe(
      "How people's names appear across the interface",
    )
    await expect(rowSlot(canvasElement, 'end')?.textContent).toBe('Full name')
    await expect(rowSlot(canvasElement, 'heading')?.nextElementSibling).toBe(
      rowSlot(canvasElement, 'end'),
    )
  },
}

export const StartSlotOnlyWhenPassed: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div data-testid="without-start">
        <SettingsRow title="Font size" />
      </div>
      <div data-testid="with-start">
        <SettingsRow startSlot={<svg aria-hidden="true" />} title="Font size" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const without = canvas.getByTestId('without-start')
    const withStart = canvas.getByTestId('with-start')

    await expect(rowSlot(without, 'start')).toBeNull()
    await expect(
      rowSlot(withStart, 'start')?.querySelector('svg'),
    ).not.toBeNull()
    await expect(rowSlot(withStart, 'start')?.nextElementSibling).toBe(
      rowSlot(withStart, 'heading'),
    )
  },
}

export const TitleOnlyRow: Story = {
  render: () => <SettingsRow title="Email" />,
  play: async ({ canvasElement }) => {
    await expect(rowSlot(canvasElement, 'description')).toBeNull()
    await expect(rowSlot(canvasElement, 'end')).toBeNull()
    await expect(rowSlot(canvasElement, 'heading')?.children).toHaveLength(1)
  },
}

export const StartSlotSizesItsIcon: Story = {
  render: () => (
    <SettingsSection>
      <SettingsRow
        description="Adjusts the text size across the whole app"
        startSlot={<TextTIcon aria-hidden="true" />}
        title="Font size"
      />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const start = rowSlot(canvasElement, 'start') as HTMLElement
    const icon = (
      start.querySelector('svg') as SVGElement
    ).getBoundingClientRect()
    const heading = (
      rowSlot(canvasElement, 'heading') as HTMLElement
    ).getBoundingClientRect()

    await expect(icon.width).toBe(16)
    await expect(icon.right).toBeLessThanOrEqual(heading.left)
  },
}

export const EndSlotSitsAtTheContentEdge: Story = {
  render: () => (
    <SettingsSection>
      <SettingsRow
        endSlot={<Switch aria-label="Underline links" />}
        title="Underline links"
      />
      <SettingsRow
        endSlot={<span className="text-muted-foreground text-sm">English</span>}
        title="Language"
      />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="settings-row"]'),
    )

    await expect(rows).toHaveLength(2)
    for (const row of rows) {
      const wrapper = row.parentElement as HTMLElement
      const style = getComputedStyle(wrapper)
      const contentRight =
        wrapper.getBoundingClientRect().right -
        Number.parseFloat(style.borderRightWidth) -
        Number.parseFloat(style.paddingRight)
      const end = (rowSlot(row, 'end') as HTMLElement).getBoundingClientRect()
      const heading = (
        rowSlot(row, 'heading') as HTMLElement
      ).getBoundingClientRect()

      await expect(Math.abs(end.right - contentRight)).toBeLessThan(1)
      await expect(end.left).toBeGreaterThan(heading.left)
    }
  },
}

export const EndSlotKeepsSeveralControlsInOrder: Story = {
  render: () => (
    <SettingsSection>
      <SettingsRow
        endSlot={
          <>
            <Switch aria-label="Required: Log the first call" />
            <Button
              aria-label="Actions for Log the first call"
              size="icon-xs"
              variant="ghost"
            >
              <DotsThreeIcon aria-hidden="true" />
            </Button>
          </>
        }
        title="Log the first call"
      />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', {
      name: 'Required: Log the first call',
    })
    const actions = canvas.getByRole('button', {
      name: 'Actions for Log the first call',
    })
    const end = toggle.closest('[data-slot="settings-row-end"]') as HTMLElement

    await expect(end).toContainElement(actions)
    await expect(toggle.getBoundingClientRect().right).toBeLessThanOrEqual(
      actions.getBoundingClientRect().left,
    )
  },
}

export const SwitchEventsReachTheConsumer: Story = {
  render: ({ onCheckedChange }) => (
    <SettingsSection header={header('Interface and theme')}>
      <SettingsRow
        description="Always underlines list titles"
        endSlot={
          <Switch
            aria-label="Underline links"
            onCheckedChange={(checked) => onCheckedChange(checked)}
          />
        }
        title="Underline links"
      />
    </SettingsSection>
  ),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', {
      name: 'Underline links',
    })

    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await waitFor(() => expect(toggle).toBeChecked())
    await expect(args.onCheckedChange).toHaveBeenCalledOnce()
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
  },
}

export const SelectEventsReachTheConsumer: Story = {
  render: ({ onValueChange }) => (
    <SettingsSection header={header('Interface and theme')}>
      <SettingsRow
        description="Adjusts the text size across the whole app"
        endSlot={
          <SettingSelect
            ariaLabel="Font size"
            defaultValue="default"
            items={fontSizeOptions}
            onValueChange={onValueChange}
          />
        }
        title="Font size"
      />
    </SettingsSection>
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: /^Font size/,
    })

    await expect(trigger).toHaveTextContent('Default')
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Large' }))
    await waitFor(() => expect(trigger).toHaveTextContent('Large'))
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('large')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const InputEventsReachTheConsumer: Story = {
  render: ({ onCommit }) => (
    <SettingsSection header={header('Workspace')}>
      <SettingsRow
        description="Saved automatically when you leave the field"
        endSlot={
          <Input
            aria-label="Workspace name"
            className="w-56"
            defaultValue="Acme Legal"
            onBlur={(event) => onCommit(event.currentTarget.value)}
          />
        }
        title="Workspace name"
      />
    </SettingsSection>
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Workspace name',
    })

    await expect(input).toHaveValue('Acme Legal')
    await userEvent.clear(input)
    await userEvent.type(input, 'Acme Partners')
    await expect(args.onCommit).not.toHaveBeenCalled()
    await userEvent.tab()
    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith('Acme Partners')
  },
}

export const MenuOpensOutsideTheCard: Story = {
  render: () => (
    <SettingsSection header={header('Settings')}>
      <SettingsRow
        description="Optional details about this setting"
        endSlot={<RowActions name="Setting label" />}
        title="Setting label"
      />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Setting label' }),
    )
    const edit = await screen.findByRole('menuitem', { name: 'Edit' })

    await expect(edit).toBeVisible()
    await expect(cardOf(canvasElement)).not.toContainElement(edit)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const SwitchTrackContrastsWithTheCard: Story = {
  render: () => (
    <SettingsSection header={header('Interface and theme')}>
      <SettingsRow
        description="Always underlines list titles"
        endSlot={<Switch aria-label="Underline links" />}
        title="Underline links"
      />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', {
      name: 'Underline links',
    })
    const { thumbOverTrack, trackOverCard } = switchContrasts(
      toggle,
      cardOf(canvasElement),
    )

    await expect(toggle).not.toBeChecked()
    await expect(trackOverCard).toBeGreaterThanOrEqual(3)
    await expect(thumbOverTrack).toBeGreaterThanOrEqual(3)
  },
}

export const HeaderNamesTheRegion: Story = {
  render: () => (
    <SettingsSection header={header('General')}>
      <SettingsRow title="Display names" />
      <SettingsRow title="Theme" />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'General' })
    const heading = canvas.getByRole('heading', { level: 2, name: 'General' })

    await expect(region).toHaveAttribute('data-slot', 'settings-section')
    await expect(region).toHaveAttribute('aria-labelledby', heading.id)
    await expect(
      sectionSlot(canvasElement, 'header')?.nextElementSibling?.getAttribute(
        'data-slot',
      ),
    ).toBe('card')
    await expect(
      canvasElement.querySelectorAll(
        '[data-slot="card"] > [data-slot="settings-section-rows"] > [data-slot="settings-row"]',
      ),
    ).toHaveLength(2)
  },
}

export const HeaderDescriptionAndActionsOnlyWhenPassed: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div data-testid="title-only">
        <SettingsSection header={header('General')} />
      </div>
      <div data-testid="full-header">
        <SettingsSection
          header={
            <SettingsSectionHeader
              actions={<Button size="sm">New label</Button>}
            >
              <SettingsSectionTitle>Labels</SettingsSectionTitle>
              <SettingsSectionDescription>
                Organize leads and tasks
              </SettingsSectionDescription>
            </SettingsSectionHeader>
          }
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const titleOnly = canvas.getByTestId('title-only')
    const fullHeader = canvas.getByTestId('full-header')

    await expect(sectionSlot(titleOnly, 'description')).toBeNull()
    await expect(sectionSlot(titleOnly, 'actions')).toBeNull()

    await expect(sectionSlot(fullHeader, 'description')?.textContent).toBe(
      'Organize leads and tasks',
    )
    await expect(
      sectionSlot(fullHeader, 'description')?.previousElementSibling,
    ).toBe(sectionSlot(fullHeader, 'title'))
    await expect(sectionSlot(fullHeader, 'actions')?.textContent).toBe(
      'New label',
    )
  },
}

export const WithoutHeaderOnlyTheCard: Story = {
  render: () => (
    <SettingsSection>
      <SettingsRow
        description="The address of your workspace; every page lives under it"
        endSlot={
          <span className="text-muted-foreground text-sm">/acme-legal</span>
        }
        title="URL"
      />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('region')).toBeNull()
    await expect(canvas.queryByRole('heading')).toBeNull()
    await expect(
      canvasElement.querySelector(
        '[data-slot="settings-section"] > [data-slot="card"]',
      ),
    ).not.toBeNull()
  },
}

export const DistinctHeadingIds: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SettingsSection header={header('General')} />
      <SettingsSection header={header('Interface and theme')} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, second] = canvas.getAllByRole('heading', { level: 2 })

    await expect(first?.id).not.toBe(second?.id)
    await expect(
      canvas.getByRole('region', { name: 'Interface and theme' }),
    ).toBeVisible()
  },
}

export const ActionsSitOutsideTheCard: Story = {
  render: () => (
    <SettingsSection
      header={
        <SettingsSectionHeader
          actions={<Button size="sm">New access rule</Button>}
        >
          <SettingsSectionTitle>Workspace</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow title="Member access" />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const action = within(canvasElement).getByRole('button', {
      name: 'New access rule',
    })

    await expect(sectionSlot(canvasElement, 'actions')).toContainElement(action)
    await expect(action.closest('[data-slot="card"]')).toBeNull()
    await expect(sectionSlot(canvasElement, 'header')?.nextElementSibling).toBe(
      cardOf(canvasElement),
    )
  },
}

export const HeaderAlignsWithTheCard: Story = {
  render: () => (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Project statuses</SettingsSectionTitle>
          <SettingsSectionDescription>
            Project statuses define the workflow that projects go through from
            start to completion
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow title="Backlog" />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('heading', {
      level: 2,
      name: 'Project statuses',
    })
    const description = canvas.getByText(
      'Project statuses define the workflow that projects go through from start to completion',
    )
    const card = cardOf(canvasElement).getBoundingClientRect()

    await expect(
      Math.abs(title.getBoundingClientRect().left - card.left),
    ).toBeLessThan(1)
    await expect(
      card.top - description.getBoundingClientRect().bottom,
    ).toBeLessThanOrEqual(16)
  },
}

export const CollapsedGroupsKeepEvenInsets: Story = {
  render: () => (
    <SettingsSection header={header('Project statuses')}>
      <div>
        {['Backlog', 'Planned', 'Completed'].map((title) => (
          <SettingsCollapsed key={title} title={title}>
            <SettingsRow description="1 project" title={`${title} status`} />
          </SettingsCollapsed>
        ))}
      </div>
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const card = cardOf(canvasElement).getBoundingClientRect()
    const groups = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="settings-collapsed"]',
      ),
    )
    const firstHeader = (
      groups[0]?.querySelector('header') as HTMLElement
    ).getBoundingClientRect()
    const lastItem = (
      groups.at(-1)?.querySelector('[data-slot="settings-row"]') as HTMLElement
    ).getBoundingClientRect()
    const inset = firstHeader.top - card.top

    await expect(groups).toHaveLength(3)
    await expect(inset).toBeGreaterThanOrEqual(8)
    await expect(card.bottom - lastItem.bottom).toBeGreaterThanOrEqual(8)
    await expect(firstHeader.left - card.left).toBeCloseTo(inset, 0)
    await expect(card.right - firstHeader.right).toBeCloseTo(inset, 0)
  },
}

export const RecordGroupsKeepEvenInsets: Story = {
  render: () => (
    <SettingsSection header={header('Pipeline stages')}>
      <div className="flex flex-col gap-3 py-4">
        {['Open', 'Lost'].map((phase) => (
          <RecordGroup key={phase} title={phase}>
            <RecordGroupItem title={`${phase} stage`} />
          </RecordGroup>
        ))}
      </div>
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = cardOf(canvasElement).getBoundingClientRect()
    const open = canvas.getByRole('region', { name: 'Open' })
    const lost = canvas.getByRole('region', { name: 'Lost' })
    const first = open.getBoundingClientRect()
    const last = lost.getBoundingClientRect()
    const inset = first.top - card.top

    await expect(cardOf(canvasElement)).toContainElement(open)
    await expect(inset).toBeGreaterThanOrEqual(8)
    await expect(first.left - card.left).toBeCloseTo(inset, 0)
    await expect(card.right - first.right).toBeCloseTo(inset, 0)
    await expect(card.bottom - last.bottom).toBeCloseTo(inset, 0)
  },
}

export const GroupsAddNoSeparatorsOrRowInset: Story = {
  render: () => (
    <SettingsSection header={header('Project statuses')}>
      <div>
        {['Backlog', 'Planned'].map((title) => (
          <SettingsCollapsed key={title} title={title}>
            <SettingsRow title={`${title} status`} />
          </SettingsCollapsed>
        ))}
      </div>
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const card = cardOf(canvasElement)

    for (const group of card.querySelectorAll<HTMLElement>(
      '[data-slot="settings-collapsed"]',
    )) {
      await expect(getComputedStyle(group).borderBottomWidth).toBe('0px')
    }
    for (const row of card.querySelectorAll<HTMLElement>(
      '[data-slot="settings-row"]',
    )) {
      await expect(getComputedStyle(row).paddingInlineStart).toBe('0px')
      await expect(getComputedStyle(row).paddingInlineEnd).toBe('0px')
    }
  },
}

export const CollapsedActionsStayVisibleWhileClosed: Story = {
  render: () => (
    <SettingsCollapsed
      actions={<Button variant="ghost">Rename</Button>}
      defaultOpen={false}
      title="Items"
    >
      <p>Nested row</p>
    </SettingsCollapsed>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Items' })
    const heading = canvas.getByRole('heading', { level: 2, name: 'Items' })
    const trigger = within(heading).getByRole('button', { name: 'Items' })
    const action = canvas.getByRole('button', { name: 'Rename' })

    await expect(region).toHaveAttribute('data-slot', 'settings-collapsed')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText('Nested row')).toBeNull()
    await expect(region.contains(action)).toBe(true)
    await expect(trigger.contains(action)).toBe(false)

    await userEvent.click(action)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.getByText('Nested row')).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const CollapsedStartsOpenAndReportsClosing: Story = {
  render: ({ onOpenChange }) => (
    <SettingsCollapsed
      onOpenChange={(open) => onOpenChange(open)}
      title="Items"
    >
      <p>Nested row</p>
    </SettingsCollapsed>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Items' })

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Nested row')).toBeVisible()

    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.queryByText('Nested row')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

export const CollapsedFollowsTheControlledOpenValue: Story = {
  render: ({ onOpenChange }) => (
    <ControlledCollapsed onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Items' })

    await userEvent.click(trigger)
    await expect(args.onOpenChange).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(canvas.getByRole('button', { name: 'Open items' }))
    await waitFor(() => expect(canvas.getByText('Nested row')).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const CollapsedGroupsToggleIndependently: Story = {
  render: () => (
    <SettingsSection header={header('Stages')}>
      <div>
        {['Planned', 'Completed'].map((title) => (
          <SettingsCollapsed key={title} title={title}>
            <SettingsRow title={`${title} status`} />
          </SettingsCollapsed>
        ))}
      </div>
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const planned = canvas.getByRole('region', { name: 'Planned' })
    const completed = canvas.getByRole('region', { name: 'Completed' })
    const plannedTrigger = within(planned).getByRole('button', {
      name: 'Planned',
    })
    const completedTrigger = within(completed).getByRole('button', {
      name: 'Completed',
    })

    await userEvent.click(plannedTrigger)
    await expect(plannedTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(completedTrigger).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() =>
      expect(within(planned).queryByText('Planned status')).toBeNull(),
    )
    await expect(within(completed).getByText('Completed status')).toBeVisible()
  },
}
