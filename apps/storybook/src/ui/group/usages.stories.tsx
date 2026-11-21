import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Group, GroupSeparator, GroupText } from '@tc96/ui/group'
import { Input } from '@tc96/ui/input'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  EllipsisIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react'
import { Fragment } from 'react'
import { expect, within } from 'storybook/test'
import { AddItemInput, PriceInput } from './group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Group/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const pages = [1, 2, 3, 4, 5]

export const FileActions: Story = {
  render: () => (
    <Group aria-label="File actions">
      <Button variant="outline">Files</Button>
      <GroupSeparator />
      <Button variant="outline">Media</Button>
      <GroupSeparator />
      <Menu>
        <MenuTrigger
          render={
            <Button aria-label="More actions" size="icon" variant="outline" />
          }
        >
          <EllipsisIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Archive</MenuItem>
          <MenuItem>Share</MenuItem>
          <MenuItem variant="destructive">Delete</MenuItem>
        </MenuPopup>
      </Menu>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'File actions',
    })
    await expect(within(group).getAllByRole('button')).toHaveLength(3)
    await expect(
      within(group).getByRole('button', { name: 'More actions' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
  },
}

export const Price: Story = {
  render: () => <PriceInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Enter the amount' }),
    ).toHaveValue('100')
    await expect(canvas.getByText('USD')).toBeVisible()
  },
}

export const AddItem: Story = {
  render: () => <AddItemInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Add' })).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: 'Item name' }),
    ).toHaveAttribute('placeholder', 'Enter item name')
  },
}

export const WebsiteAddress: Story = {
  render: () => (
    <Group aria-label="Website address">
      <GroupText>https://</GroupText>
      <GroupSeparator />
      <Input aria-label="Domain" defaultValue="acme" type="text" />
      <GroupSeparator />
      <GroupText>.com</GroupText>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Domain' })).toHaveValue(
      'acme',
    )
    await expect(canvas.getByText('https://')).toBeVisible()
    await expect(canvas.getByText('.com')).toBeVisible()
  },
}

export const InviteLink: Story = {
  render: () => (
    <Group aria-label="Invite link">
      <Input
        aria-label="Invite link"
        readOnly
        type="text"
        value="https://acme.com/invite/8f3k2"
      />
      <GroupSeparator />
      <Button aria-label="Copy link" size="icon" variant="outline">
        <CopyIcon aria-hidden="true" />
      </Button>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Invite link' }),
    ).toHaveAttribute('readonly')
    await expect(
      canvas.getByRole('button', { name: 'Copy link' }),
    ).toBeVisible()
  },
}

export const Pagination: Story = {
  render: () => (
    <Group aria-label="Pagination">
      <Group aria-label="Page numbers">
        {pages.map((page, index) => (
          <Fragment key={page}>
            {index > 0 ? <GroupSeparator /> : null}
            <Button
              aria-current={page === 2 ? 'page' : undefined}
              size="icon"
              variant="outline"
            >
              {page}
            </Button>
          </Fragment>
        ))}
      </Group>
      <Group aria-label="Navigation">
        <Button aria-label="Previous page" size="icon" variant="outline">
          <ChevronLeftIcon aria-hidden="true" />
        </Button>
        <GroupSeparator />
        <Button aria-label="Next page" size="icon" variant="outline">
          <ChevronRightIcon aria-hidden="true" />
        </Button>
      </Group>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const numbers = canvas.getByRole('group', { name: 'Page numbers' })
    await expect(within(numbers).getAllByRole('button')).toHaveLength(5)
    await expect(
      within(numbers).getByRole('button', { name: '2' }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(
      canvas.getByRole('group', { name: 'Navigation' }),
    ).toBeVisible()
  },
}

export const ZoomControls: Story = {
  render: () => (
    <Group aria-label="Zoom" orientation="vertical">
      <Button aria-label="Zoom in" size="icon" variant="outline">
        <ZoomInIcon aria-hidden="true" />
      </Button>
      <GroupSeparator orientation="horizontal" />
      <Button aria-label="Zoom out" size="icon" variant="outline">
        <ZoomOutIcon aria-hidden="true" />
      </Button>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Zoom' })
    await expect(group).toHaveAttribute('data-orientation', 'vertical')
    await expect(
      within(group).getByRole('button', { name: 'Zoom in' }),
    ).toBeVisible()
  },
}
