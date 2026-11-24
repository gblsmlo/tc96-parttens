import { CaretRightIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { expect, fn, isInaccessible, userEvent, within } from 'storybook/test'
import { isIcon } from '../../test-utils/is-icon'
import { breadcrumbControlArgs } from './breadcrumb-controls.ts'
import { ComposedBreadcrumb } from './breadcrumb-layouts.tsx'

interface BehaviorArgs {
  onNavigate: (href: string) => void
}

const meta = {
  args: { onNavigate: fn() },
  argTypes: { onNavigate: { control: false } },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Breadcrumb/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const getSlots = (root: HTMLElement, slot: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`))

const colorOf = (root: HTMLElement, className: string) => {
  const probe = document.createElement('span')
  probe.className = className
  root.append(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

export const NavigationLandmark: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'breadcrumb',
    })
    await expect(nav).toHaveAttribute('data-slot', 'breadcrumb')
    const list = within(nav).getByRole('list')
    await expect(list.tagName).toBe('OL')
    await expect(list).toHaveAttribute('data-slot', 'breadcrumb-list')
    const items = within(list).getAllByRole('listitem')
    await expect(items).toHaveLength(5)
    for (const item of items) {
      await expect(item).toHaveAttribute('data-slot', 'breadcrumb-item')
    }
  },
}

export const NamedLandmark: Story = {
  render: () => (
    <Breadcrumb aria-label="Folder path">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Reports</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Folder path' }),
    ).toHaveAttribute('data-slot', 'breadcrumb')
    await expect(
      canvas.queryByRole('navigation', { name: 'breadcrumb' }),
    ).toBeNull()
  },
}

export const MarksCurrentPage: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = canvas.getByText('Annual report')
    await expect(page).toHaveAttribute('data-slot', 'breadcrumb-page')
    await expect(page).toHaveAttribute('aria-current', 'page')
    await expect(page.tagName).toBe('SPAN')
    await expect(
      canvas.queryByRole('link', { name: 'Annual report' }),
    ).toBeNull()
    const links = canvas.getAllByRole('link')
    await expect(links).toHaveLength(4)
    for (const link of links) {
      await expect(link).toHaveAttribute('data-slot', 'breadcrumb-link')
      await expect(link).not.toHaveAttribute('aria-current')
    }
  },
}

export const CurrentPageStandsOut: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const muted = colorOf(canvasElement, 'text-muted-foreground')
    const foreground = colorOf(canvasElement, 'text-foreground')
    await expect(muted).not.toBe(foreground)
    await expect(getComputedStyle(canvas.getByRole('list')).color).toBe(muted)
    await expect(
      getComputedStyle(canvas.getByRole('link', { name: 'Reports' })).color,
    ).toBe(muted)
    await expect(
      getComputedStyle(canvas.getByText('Annual report')).color,
    ).toBe(foreground)
  },
}

export const SeparatorsHiddenFromAssistiveTech: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} />,
  play: async ({ canvasElement }) => {
    const separators = getSlots(canvasElement, 'breadcrumb-separator')
    await expect(separators).toHaveLength(4)
    for (const separator of separators) {
      await expect(separator.tagName).toBe('LI')
      await expect(separator.parentElement).toHaveAttribute(
        'data-slot',
        'breadcrumb-list',
      )
      await expect(isInaccessible(separator)).toBe(true)
    }
  },
}

export const ChevronByDefault: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} />,
  play: async ({ canvasElement }) => {
    for (const separator of getSlots(canvasElement, 'breadcrumb-separator')) {
      const icon = separator.querySelector(':scope > svg')
      if (!(icon instanceof SVGElement)) throw new Error('No chevron.')
      await expect(isIcon(icon, CaretRightIcon)).toBe(true)
      const box = icon.getBoundingClientRect()
      await expect([box.width, box.height]).toEqual([16, 16])
    }
  },
}

export const ChildrenReplaceChevron: Story = {
  render: () => (
    <ComposedBreadcrumb {...breadcrumbControlArgs} separator="slash" />
  ),
  play: async ({ canvasElement }) => {
    const separators = getSlots(canvasElement, 'breadcrumb-separator')
    await expect(separators).toHaveLength(4)
    for (const separator of separators) {
      await expect(separator).toHaveTextContent('/')
      await expect(separator.querySelector('svg')).toBeNull()
    }
  },
}

export const EllipsisHiddenFromAssistiveTech: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} bareEllipsis />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'breadcrumb',
    })
    const [ellipsis] = getSlots(nav, 'breadcrumb-ellipsis')
    if (!ellipsis) throw new Error('No ellipsis.')
    await expect(isInaccessible(ellipsis)).toBe(true)
    await expect(within(nav).getAllByRole('link')).toHaveLength(2)
  },
}

export const KeyboardReachesLinksInOrder: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'breadcrumb' })
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    for (const name of ['Home', 'Documents', 'Finance', 'Reports']) {
      await userEvent.tab()
      await expect(canvas.getByRole('link', { name })).toHaveFocus()
    }
    await userEvent.tab()
    await expect(nav.contains(document.activeElement)).toBe(false)
  },
}

export const RendersAsButtons: Story = {
  render: ({ onNavigate }) => (
    <ComposedBreadcrumb
      {...breadcrumbControlArgs}
      element="button"
      onNavigate={onNavigate}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    const reports = canvas.getByRole('button', { name: 'Reports' })
    await expect(reports).toHaveAttribute('data-slot', 'breadcrumb-link')
    await expect(reports).toHaveClass('hover:text-foreground')
    await userEvent.click(reports)
    await expect(args.onNavigate).toHaveBeenLastCalledWith(
      '#/documents/finance/reports',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Home' }))
    await expect(args.onNavigate).toHaveBeenLastCalledWith('#/')
    await expect(args.onNavigate).toHaveBeenCalledTimes(2)
  },
}

export const WrapsInNarrowSpace: Story = {
  render: () => (
    <div className="w-48">
      <ComposedBreadcrumb {...breadcrumbControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list')
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth)
    const [first] = within(list).getAllByRole('listitem')
    if (!first) throw new Error('No item.')
    await expect(list.getBoundingClientRect().height).toBeGreaterThan(
      first.getBoundingClientRect().height * 2,
    )
  },
}
