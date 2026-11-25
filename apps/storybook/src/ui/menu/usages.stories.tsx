import {
  BellIcon,
  BrainIcon,
  BuildingsIcon,
  CaretDownIcon,
  CaretUpDownIcon,
  ChatTextIcon,
  CopyIcon,
  CreditCardIcon,
  DotsThreeIcon,
  EnvelopeIcon,
  FileCsvIcon,
  FilePdfIcon,
  FileTextIcon,
  FolderOpenIcon,
  GearIcon,
  ImageIcon,
  LifebuoyIcon,
  LightningIcon,
  LinkIcon,
  MonitorIcon,
  MoonIcon,
  PencilSimpleIcon,
  PlusIcon,
  PrinterIcon,
  ScalesIcon,
  ShareNetworkIcon,
  ShoppingCartIcon,
  SignOutIcon,
  SunIcon,
  TrashSimpleIcon,
  UploadSimpleIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@tc96/ui/menu'
import { useState } from 'react'
import { expect, screen, within } from 'storybook/test'
import { DialogFromMenu } from './menu-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Menu/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

export const Playback: Story = {
  parameters: describe(
    `The playback menu of a music app, on the [Labelled Groups](?path=/story/ui-menu-layouts--labelled-groups) layout: the player actions with their shortcuts, the play mode as checkboxes, the sort order as radios, a switch, a submenu and Delete last.`,
  ),
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>Playback</MenuTrigger>
      <MenuPopup align="start">
        <MenuGroup>
          <MenuGroupLabel>Playback</MenuGroupLabel>
          <MenuItem aria-keyshortcuts="Meta+P">
            Play
            <MenuShortcut>⌘P</MenuShortcut>
          </MenuItem>
          <MenuItem disabled>
            Pause
            <span className="ms-auto text-muted-foreground text-xs">
              Nothing playing
            </span>
          </MenuItem>
          <MenuItem aria-keyshortcuts="Meta+N">
            Next
            <MenuShortcut>⌘N</MenuShortcut>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked>Shuffle</MenuCheckboxItem>
        <MenuCheckboxItem>Repeat</MenuCheckboxItem>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Sort by</MenuGroupLabel>
          <MenuRadioGroup defaultValue="artist">
            <MenuRadioItem value="artist">Artist</MenuRadioItem>
            <MenuRadioItem value="album">Album</MenuRadioItem>
            <MenuRadioItem value="title">Title</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked variant="switch">
          Auto save
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Add to playlist</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Jazz</MenuItem>
            <MenuItem>Rock</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem variant="destructive">Delete</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    const menu = await screen.findByRole('menu')
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Artist' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitem', { name: 'Pause Nothing playing' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await expect(menu).toBeVisible()
  },
}

export const AccountMenu: Story = {
  parameters: describe(
    `The account menu of the app shell, on the [Header Over Groups](?path=/story/ui-menu-layouts--header-over-groups) layout: the person's name and email over the account actions, help as a link and Log out last.`,
  ),
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="ghost" />}>
        <Avatar aria-hidden="true" className="[--avatar-size:--spacing(5)]">
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        Ana Lima
        <CaretDownIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end" className="w-56">
        <MenuGroup>
          <MenuGroupLabel>
            <span className="flex items-center gap-2">
              <Avatar aria-hidden="true" className="text-foreground">
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <span className="grid">
                <span className="text-foreground text-sm">Ana Lima</span>
                <span className="font-normal">ana.lima@acme.com</span>
              </span>
            </span>
          </MenuGroupLabel>
          <MenuItem>
            <UserIcon aria-hidden="true" />
            Profile
          </MenuItem>
          <MenuItem>
            <CreditCardIcon aria-hidden="true" />
            Billing
          </MenuItem>
          <MenuItem aria-keyshortcuts="Meta+,">
            <GearIcon aria-hidden="true" />
            Settings
            <MenuShortcut>⌘,</MenuShortcut>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuLinkItem href="#help-center">
          <LifebuoyIcon aria-hidden="true" />
          Help center
        </MenuLinkItem>
        <MenuSeparator />
        <MenuItem variant="destructive">
          <SignOutIcon aria-hidden="true" />
          Log out
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    const account = await screen.findByRole('group', {
      name: 'Ana Lima ana.lima@acme.com',
    })
    await expect(account).toBeVisible()
    await expect(
      screen.getByRole('menuitem', { name: 'Help center' }),
    ).toHaveAttribute('href', '#help-center')
  },
}

export const RowActions: Story = {
  parameters: describe(
    `The "more" button of a document row, on the [Icon Trigger](?path=/story/ui-menu-layouts--icon-trigger) layout: rename, duplicate, a submenu to move it and Delete document last.`,
  ),
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger
        aria-label="More actions for Q3 roadmap"
        render={<Button size="icon" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem aria-keyshortcuts="Meta+E">
          <PencilSimpleIcon aria-hidden="true" />
          Rename
          <MenuShortcut>⌘E</MenuShortcut>
        </MenuItem>
        <MenuItem aria-keyshortcuts="Meta+D">
          <CopyIcon aria-hidden="true" />
          Duplicate
          <MenuShortcut>⌘D</MenuShortcut>
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <FolderOpenIcon aria-hidden="true" />
            Move to
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Backlog</MenuItem>
            <MenuItem>In progress</MenuItem>
            <MenuItem>Done</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem variant="destructive">
          <TrashSimpleIcon aria-hidden="true" />
          Delete document
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Delete document' }),
    ).toHaveAttribute('data-variant', 'destructive')
    await expect(
      screen.getByRole('menuitem', { name: 'Move to' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
  },
}

export const ShareAndExport: Story = {
  parameters: describe(
    `The share button of a report, on the [Labelled Groups](?path=/story/ui-menu-layouts--labelled-groups) layout: where to send it, which file to export, and Print on its own.`,
  ),
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>
        <ShareNetworkIcon aria-hidden="true" />
        Share
      </MenuTrigger>
      <MenuPopup align="start" className="w-48">
        <MenuGroup>
          <MenuGroupLabel>Share via</MenuGroupLabel>
          <MenuItem>
            <EnvelopeIcon aria-hidden="true" />
            Email
          </MenuItem>
          <MenuItem>
            <ChatTextIcon aria-hidden="true" />
            Message
          </MenuItem>
          <MenuItem>
            <LinkIcon aria-hidden="true" />
            Copy link
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Export as</MenuGroupLabel>
          <MenuItem>
            <FilePdfIcon aria-hidden="true" />
            PDF
          </MenuItem>
          <MenuItem>
            <FileCsvIcon aria-hidden="true" />
            CSV
          </MenuItem>
          <MenuItem>
            <ImageIcon aria-hidden="true" />
            PNG
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>
          <PrinterIcon aria-hidden="true" />
          Print
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('group', { name: 'Export as' }),
    ).toBeVisible()
    await expect(screen.getByRole('menuitem', { name: 'Print' })).toBeVisible()
  },
}

export const NewRecord: Story = {
  parameters: describe(
    `The create button of a sales app, on the [Labelled Groups](?path=/story/ui-menu-layouts--labelled-groups) layout: the records it creates, then importing them from a file.`,
  ),
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button size="sm" />}>
        <PlusIcon aria-hidden="true" />
        New
      </MenuTrigger>
      <MenuPopup align="end" className="w-44">
        <MenuGroup>
          <MenuGroupLabel>Create</MenuGroupLabel>
          <MenuItem>
            <UserPlusIcon aria-hidden="true" />
            Customer
          </MenuItem>
          <MenuItem>
            <ShoppingCartIcon aria-hidden="true" />
            Order
          </MenuItem>
          <MenuItem>
            <FileTextIcon aria-hidden="true" />
            Invoice
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>
          <UploadSimpleIcon aria-hidden="true" />
          Import data
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('group', { name: 'Create' }),
    ).toBeVisible()
  },
}

const workspaces = [
  { initials: 'AC', name: 'Acme', plan: 'Enterprise' },
  { initials: 'NS', name: 'Northstar', plan: 'Pro' },
  { initials: 'AL', name: 'Ana Lima', plan: 'Personal' },
]

export const WorkspaceSwitcher: Story = {
  parameters: describe(
    `The workspace switcher of the app shell, on the [Two Line Radio Items](?path=/story/ui-menu-layouts--two-line-radio-items) layout: each workspace with its plan, the current one checked, then creating and managing workspaces.`,
  ),
  render: function WorkspaceSwitcher() {
    const [current, setCurrent] = useState('Northstar')
    const active = workspaces.find(({ name }) => name === current)

    return (
      <Menu defaultOpen modal={false}>
        <MenuTrigger
          render={<Button className="w-52 justify-start" variant="outline" />}
        >
          <Avatar aria-hidden="true" className="[--avatar-size:--spacing(5)]">
            <AvatarFallback>{active?.initials}</AvatarFallback>
          </Avatar>
          {current}
          <CaretUpDownIcon aria-hidden="true" className="ms-auto" />
        </MenuTrigger>
        <MenuPopup align="start" className="w-56">
          <MenuGroup>
            <MenuGroupLabel>Workspaces</MenuGroupLabel>
            <MenuRadioGroup
              onValueChange={(value) => setCurrent(String(value))}
              value={current}
            >
              {workspaces.map(({ initials, name, plan }) => (
                <MenuRadioItem key={name} value={name}>
                  <Avatar
                    aria-hidden="true"
                    className="[--avatar-size:--spacing(6)]"
                  >
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="grid">
                    <span>{name}</span>
                    <span className="text-muted-foreground text-xs">
                      {plan}
                    </span>
                  </span>
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem>
            <PlusIcon aria-hidden="true" />
            Create workspace
          </MenuItem>
          <MenuItem>
            <GearIcon aria-hidden="true" />
            Manage workspaces
          </MenuItem>
        </MenuPopup>
      </Menu>
    )
  },
  play: async () => {
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Northstar Pro' }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

const models = [
  { description: 'Answers in seconds', icon: LightningIcon, label: 'Fast' },
  { description: 'For most tasks', icon: ScalesIcon, label: 'Balanced' },
  { description: 'Thinks before it answers', icon: BrainIcon, label: 'Deep' },
]

export const ModelPicker: Story = {
  parameters: describe(
    `The model picker of a chat composer, on the [Two Line Radio Items](?path=/story/ui-menu-layouts--two-line-radio-items) layout: each model with what it is good for, the chosen one checked and named on the button.`,
  ),
  render: function ModelPicker() {
    const [model, setModel] = useState('Balanced')

    return (
      <Menu defaultOpen modal={false}>
        <MenuTrigger
          render={<Button className="w-36" size="sm" variant="outline" />}
        >
          {model}
          <CaretDownIcon aria-hidden="true" className="ms-auto" />
        </MenuTrigger>
        <MenuPopup align="start" className="w-56">
          <MenuGroup>
            <MenuGroupLabel>Model</MenuGroupLabel>
            <MenuRadioGroup
              onValueChange={(value) => setModel(String(value))}
              value={model}
            >
              {models.map(({ description, icon: Icon, label }) => (
                <MenuRadioItem key={label} value={label}>
                  <Icon aria-hidden="true" />
                  <span className="grid">
                    <span>{label}</span>
                    <span className="text-muted-foreground text-xs">
                      {description}
                    </span>
                  </span>
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    )
  },
  play: async () => {
    await expect(
      await screen.findByRole('menuitemradio', {
        name: 'Balanced For most tasks',
      }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

const notifications = [
  {
    initials: 'SC',
    text: 'Sara Costa commented on Design system',
    time: '2 min ago',
  },
  { initials: 'JW', text: 'James Wilson shared Q4 report', time: '1 hour ago' },
  {
    initials: 'ED',
    text: 'Emily Davis invited you to Project Alpha',
    time: '3 hours ago',
  },
]

export const Notifications: Story = {
  parameters: describe(
    `The notifications button of the app shell, on the [Two Line Items](?path=/story/ui-menu-layouts--two-line-items) layout: who did what over when, and a last item that opens the full list.`,
  ),
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger
        aria-label="Notifications, 3 new"
        render={<Button className="relative" size="icon" variant="outline" />}
      >
        <BellIcon aria-hidden="true" />
        <Badge
          aria-hidden="true"
          className="-end-2 -top-1.5 absolute rounded-full px-1"
          variant="destructive"
        >
          3
        </Badge>
      </MenuTrigger>
      <MenuPopup align="end" className="w-80">
        <MenuGroup>
          <MenuGroupLabel>Notifications</MenuGroupLabel>
          {notifications.map(({ initials, text, time }) => (
            <MenuItem key={text}>
              <Avatar
                aria-hidden="true"
                className="[--avatar-size:--spacing(6)]"
              >
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="grid">
                <span>{text}</span>
                <span className="text-muted-foreground text-xs">{time}</span>
              </span>
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuSeparator />
        <MenuItem className="justify-center">View all notifications</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    const group = await screen.findByRole('group', { name: 'Notifications' })
    await expect(within(group).getAllByRole('menuitem')).toHaveLength(
      notifications.length,
    )
  },
}

const presences = [
  { color: 'bg-success', label: 'Available' },
  { color: 'bg-warning', label: 'Away' },
  { color: 'bg-destructive', label: 'Busy' },
  { color: 'bg-muted-foreground', label: 'Offline' },
]

export const StatusAndTheme: Story = {
  parameters: describe(
    `The profile menu of a support desk, on the [Radio Group In Submenu](?path=/story/ui-menu-layouts--radio-group-in-submenu) layout: the agent's status and the theme each open a submenu of values, between the queues and Log out.`,
  ),
  render: function StatusAndTheme() {
    const [presence, setPresence] = useState('Available')
    const [theme, setTheme] = useState('System')
    const dot = presences.find(({ label }) => label === presence)?.color

    return (
      <Menu defaultOpen modal={false}>
        <MenuTrigger render={<Button variant="outline" />}>
          <Avatar aria-hidden="true" className="[--avatar-size:--spacing(5)]">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          Ana Lima
          <CaretUpDownIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="start" className="w-60">
          <MenuItem>
            <BuildingsIcon aria-hidden="true" />
            Your companies
            <Badge className="ms-auto" variant="secondary">
              12
            </Badge>
          </MenuItem>
          <MenuItem>
            <UsersIcon aria-hidden="true" />
            Your queues
            <Badge className="ms-auto" variant="secondary">
              2
            </Badge>
          </MenuItem>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${dot}`}
              />
              Status
              <span className="ms-auto text-muted-foreground text-xs">
                {presence}
              </span>
            </MenuSubTrigger>
            <MenuSubPopup className="w-40">
              <MenuRadioGroup
                onValueChange={(value) => setPresence(String(value))}
                value={presence}
              >
                {presences.map(({ color, label }) => (
                  <MenuRadioItem key={label} value={label}>
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${color}`}
                    />
                    {label}
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
            </MenuSubPopup>
          </MenuSub>
          <MenuSub>
            <MenuSubTrigger>
              <SunIcon aria-hidden="true" />
              Theme
              <span className="ms-auto text-muted-foreground text-xs">
                {theme}
              </span>
            </MenuSubTrigger>
            <MenuSubPopup>
              <MenuRadioGroup
                onValueChange={(value) => setTheme(String(value))}
                value={theme}
              >
                <MenuRadioItem value="Light">
                  <SunIcon aria-hidden="true" />
                  Light
                </MenuRadioItem>
                <MenuRadioItem value="Dark">
                  <MoonIcon aria-hidden="true" />
                  Dark
                </MenuRadioItem>
                <MenuRadioItem value="System">
                  <MonitorIcon aria-hidden="true" />
                  System
                </MenuRadioItem>
              </MenuRadioGroup>
            </MenuSubPopup>
          </MenuSub>
          <MenuSeparator />
          <MenuItem variant="destructive">
            <SignOutIcon aria-hidden="true" />
            Log out
          </MenuItem>
        </MenuPopup>
      </Menu>
    )
  },
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Status Available' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
  },
}

export const ViewSettings: Story = {
  parameters: describe(
    `The view button of a task list, on the [Labelled Groups](?path=/story/ui-menu-layouts--labelled-groups) layout: the grouping as radios, the visible columns as checkboxes and a switch for empty groups.`,
  ),
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>View</MenuTrigger>
      <MenuPopup align="start" className="w-56">
        <MenuGroup>
          <MenuGroupLabel>Group by</MenuGroupLabel>
          <MenuRadioGroup defaultValue="status">
            <MenuRadioItem value="status">Status</MenuRadioItem>
            <MenuRadioItem value="owner">Owner</MenuRadioItem>
            <MenuRadioItem value="none">No grouping</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Columns</MenuGroupLabel>
          <MenuCheckboxItem defaultChecked>Title</MenuCheckboxItem>
          <MenuCheckboxItem defaultChecked>Owner</MenuCheckboxItem>
          <MenuCheckboxItem>Due date</MenuCheckboxItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem variant="switch">Show empty groups</MenuCheckboxItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Status' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemcheckbox', { name: 'Due date' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const OpenADialog: Story = {
  parameters: describe(
    `A project menu whose item opens a dialog, on the [Default](?path=/story/ui-menu-layouts--default) layout: the menu closes and the dialog takes focus.`,
  ),
  render: () => <DialogFromMenu />,
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Settings…' }),
    ).toBeVisible()
  },
}
