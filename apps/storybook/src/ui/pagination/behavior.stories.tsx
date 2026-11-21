import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@tc96/ui/pagination'
import { expect, fn, isInaccessible, userEvent, within } from 'storybook/test'
import { paginationControlArgs } from './pagination-controls.ts'
import { ComposedPagination } from './pagination-layouts.tsx'

interface BehaviorArgs {
  onPageChange: (page: number) => void
}

const meta = {
  args: { onPageChange: fn() },
  argTypes: { onPageChange: { control: false } },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Pagination/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const NavigationLandmark: Story = {
  render: () => <ComposedPagination {...paginationControlArgs} />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'pagination',
    })
    await expect(nav).toHaveAttribute('data-slot', 'pagination')
    const list = within(nav).getByRole('list')
    await expect(list).toHaveAttribute('data-slot', 'pagination-content')
    await expect(within(list).getAllByRole('listitem')).toHaveLength(6)
  },
}

export const NamedLandmark: Story = {
  render: () => (
    <Pagination aria-label="Search results pages">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#page-1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Search results pages' }),
    ).toHaveAttribute('data-slot', 'pagination')
    await expect(
      canvas.queryByRole('navigation', { name: 'pagination' }),
    ).toBeNull()
  },
}

export const MarksCurrentPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#page-1" isActive={false}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-3">3</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, current, third] = ['1', '2', '3'].map((name) =>
      canvas.getByRole('link', { name }),
    )
    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(current).toHaveAttribute('data-active', 'true')
    await expect(first).not.toHaveAttribute('aria-current')
    await expect(first).toHaveAttribute('data-active', 'false')
    await expect(third).not.toHaveAttribute('aria-current')
    await expect(third).not.toHaveAttribute('data-active')
  },
}

export const OutlinesCurrentPage: Story = {
  render: () => <ComposedPagination {...paginationControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const transparent = 'rgba(0, 0, 0, 0)'
    const current = canvas.getByRole('link', { name: '2' })
    const other = canvas.getByRole('link', { name: '1' })
    await expect(getComputedStyle(other).borderTopColor).toBe(transparent)
    await expect(getComputedStyle(current).borderTopColor).not.toBe(transparent)
  },
}

export const PreviousAndNextNames: Story = {
  render: () => <ComposedPagination {...paginationControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Go to previous page' }),
    ).toHaveAttribute('data-slot', 'pagination-link')
    await expect(
      canvas.getByRole('link', { name: 'Go to next page' }),
    ).toHaveAttribute('data-slot', 'pagination-link')
    await expect(canvas.queryByRole('link', { name: 'Previous' })).toBeNull()
    await expect(canvas.queryByRole('link', { name: 'Next' })).toBeNull()
  },
}

export const TextFromSm: Story = {
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  render: () => <ComposedPagination {...paginationControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const [name, text] of [
      ['Go to previous page', 'Previous'],
      ['Go to next page', 'Next'],
    ] as const) {
      const link = canvas.getByRole('link', { name })
      await expect(within(link).getByText(text)).toBeVisible()
      const box = link.getBoundingClientRect()
      await expect(box.width).toBeGreaterThan(box.height)
    }
  },
}

export const IconOnlyBelowSm: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => <ComposedPagination {...paginationControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const [name, text] of [
      ['Go to previous page', 'Previous'],
      ['Go to next page', 'Next'],
    ] as const) {
      const link = canvas.getByRole('link', { name })
      await expect(within(link).getByText(text)).not.toBeVisible()
      const box = link.getBoundingClientRect()
      await expect(box.width).toBe(box.height)
    }
  },
}

export const EllipsisHiddenFromAssistiveTech: Story = {
  render: () => <ComposedPagination {...paginationControlArgs} />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'pagination',
    })
    const ellipsis = nav.querySelector('[data-slot="pagination-ellipsis"]')
    if (!(ellipsis instanceof HTMLElement)) throw new Error('No ellipsis.')
    await expect(isInaccessible(ellipsis)).toBe(true)
    await expect(isInaccessible(within(nav).getByText('More pages'))).toBe(true)
    await expect(
      within(nav).queryAllByRole('img', { name: /more pages/i }),
    ).toEqual([])
    await expect(within(nav).getAllByRole('link')).toHaveLength(5)
  },
}

export const RendersAsButtons: Story = {
  render: ({ onPageChange }) => (
    <ComposedPagination
      {...paginationControlArgs}
      element="button"
      onPageChange={onPageChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    const current = canvas.getByRole('button', { name: '2' })
    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(current).toHaveAttribute('data-slot', 'pagination-link')
    await expect(current).toHaveAttribute('type', 'button')
    await userEvent.click(canvas.getByRole('button', { name: '3' }))
    await expect(args.onPageChange).toHaveBeenLastCalledWith(3)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Go to previous page' }),
    )
    await expect(args.onPageChange).toHaveBeenLastCalledWith(1)
    await expect(args.onPageChange).toHaveBeenCalledTimes(2)
  },
}
