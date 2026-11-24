import {
  ArrowLeftIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  CurrencyDollarIcon,
  CursorIcon,
  DotsThreeIcon,
  HandIcon,
  PencilSimpleIcon,
  PercentIcon,
  SquareIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextTIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, buttonVariants } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Toggle } from '@tc96/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from '@tc96/ui/toolbar'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Toolbar/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const fonts = [
  { label: 'Helvetica', value: 'helvetica' },
  { label: 'Arial', value: 'arial' },
  { label: 'Times New Roman', value: 'times-new-roman' },
]

const alignments = [
  { icon: TextAlignLeftIcon, label: 'Align left', value: 'left' },
  { icon: TextAlignCenterIcon, label: 'Align center', value: 'center' },
  { icon: TextAlignRightIcon, label: 'Align right', value: 'right' },
]

const filters = ['Unread', 'Starred', 'Attachments']

const tools = [
  { icon: CursorIcon, label: 'Select', value: 'select' },
  { icon: HandIcon, label: 'Hand', value: 'hand' },
  { icon: PencilSimpleIcon, label: 'Pen', value: 'pen' },
  { icon: SquareIcon, label: 'Rectangle', value: 'rectangle' },
  { icon: TextTIcon, label: 'Text', value: 'text' },
]

export const SpreadsheetFormatting: Story = {
  render: () => (
    <Toolbar aria-label="Cell formatting">
      <ToggleGroup defaultValue={['left']}>
        {alignments.map(({ icon: Icon, label, value }) => (
          <ToolbarButton
            aria-label={label}
            key={value}
            render={<ToggleGroupItem value={value} />}
          >
            <Icon aria-hidden="true" />
          </ToolbarButton>
        ))}
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Number format">
        <ToolbarButton
          aria-label="Format as currency"
          render={<Button size="icon" variant="ghost" />}
        >
          <CurrencyDollarIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Format as percent"
          render={<Button size="icon" variant="ghost" />}
        >
          <PercentIcon aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <Select defaultValue="helvetica" items={fonts}>
        <ToolbarButton
          render={
            <SelectTrigger aria-label="Font" className="w-40">
              <SelectValue />
            </SelectTrigger>
          }
        />
        <SelectPopup>
          {fonts.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <ToolbarSeparator />
      <ToolbarButton render={<Button />}>Save</ToolbarButton>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Cell formatting',
    })
    await expect(
      within(toolbar).getByRole('button', { name: 'Align left' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      within(toolbar).getByRole('combobox', { name: 'Font' }),
    ).toHaveTextContent('Helvetica')
  },
}

export const DocumentHeader: Story = {
  render: () => (
    <Toolbar aria-label="Document" className="items-center">
      <ToolbarLink
        className={buttonVariants({ variant: 'ghost' })}
        href="#documents"
      >
        <ArrowLeftIcon aria-hidden="true" />
        All documents
      </ToolbarLink>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="History">
        <ToolbarButton
          aria-label="Undo"
          render={<Button size="icon" variant="ghost" />}
        >
          <ArrowUUpLeftIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Redo"
          disabled
          focusableWhenDisabled={false}
          render={<Button size="icon" variant="ghost" />}
        >
          <ArrowUUpRightIcon aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton render={<Button variant="outline" />}>Share</ToolbarButton>
      <Menu>
        <ToolbarButton
          aria-label="More actions"
          render={
            <MenuTrigger render={<Button size="icon" variant="ghost" />} />
          }
        >
          <DotsThreeIcon aria-hidden="true" />
        </ToolbarButton>
        <MenuPopup align="end">
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Move to trash</MenuItem>
        </MenuPopup>
      </Menu>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Document',
    })
    await expect(
      within(toolbar).getByRole('link', { name: 'All documents' }),
    ).toHaveAttribute('href', '#documents')
    await expect(
      within(toolbar).getByRole('button', { name: 'More actions' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
    await expect(
      within(toolbar).getByRole('button', { name: 'Redo' }),
    ).toBeDisabled()
  },
}

export const InboxFilters: Story = {
  render: () => (
    <Toolbar aria-label="Inbox" className="items-center">
      <ToolbarInput
        aria-label="Search messages"
        placeholder="Search messages"
        render={<Input className="w-56" type="search" />}
      />
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Filters">
        {filters.map((filter) => (
          <ToolbarButton
            key={filter}
            render={
              <Toggle
                defaultPressed={filter === 'Unread'}
                size="sm"
                variant="outline"
              />
            }
          >
            {filter}
          </ToolbarButton>
        ))}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton render={<Button size="sm" variant="ghost" />}>
        Mark all as read
      </ToolbarButton>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Inbox',
    })
    await expect(
      within(toolbar).getByRole('searchbox', { name: 'Search messages' }),
    ).toBeVisible()
    await expect(
      within(toolbar).getByRole('button', { name: 'Unread' }),
    ).toHaveAttribute('aria-pressed', 'true')
  },
}

export const DrawingTools: Story = {
  render: () => (
    <Toolbar
      aria-label="Drawing tools"
      className="flex-col"
      orientation="vertical"
    >
      <ToggleGroup
        className="flex-col"
        defaultValue={['select']}
        orientation="vertical"
      >
        {tools.map(({ icon: Icon, label, value }) => (
          <ToolbarButton
            aria-label={label}
            key={value}
            render={<ToggleGroupItem value={value} />}
          >
            <Icon aria-hidden="true" />
          </ToolbarButton>
        ))}
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="History" className="flex-col">
        <ToolbarButton
          aria-label="Undo"
          render={<Button size="icon" variant="ghost" />}
        >
          <ArrowUUpLeftIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Redo"
          render={<Button size="icon" variant="ghost" />}
        >
          <ArrowUUpRightIcon aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Drawing tools',
    })
    await expect(toolbar).toHaveAttribute('aria-orientation', 'vertical')
    await expect(
      within(toolbar).getByRole('button', { name: 'Select' }),
    ).toHaveAttribute('aria-pressed', 'true')
  },
}
