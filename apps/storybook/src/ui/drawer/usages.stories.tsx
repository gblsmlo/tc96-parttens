import {
  FolderIcon,
  GearIcon,
  HouseIcon,
  ListIcon,
  ReceiptIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@tc96/ui/drawer'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { type FormEvent, useState } from 'react'
import { expect, screen, waitFor, within } from 'storybook/test'
import { SongActionsDrawer } from './drawer-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Drawer/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function ProfileDrawer() {
  const [open, setOpen] = useState(true)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpen(false)
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Edit profile
      </DrawerTrigger>
      <DrawerPopup showBar>
        <form className="contents" onSubmit={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Your name and username show on your posts and comments.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerPanel className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input defaultValue="Rafael Lima" name="name" />
            </Field>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input defaultValue="rafael.lima" name="username" />
            </Field>
          </DrawerPanel>
          <DrawerFooter>
            <DrawerClose render={<Button variant="ghost" />}>
              Cancel
            </DrawerClose>
            <Button type="submit">Save changes</Button>
          </DrawerFooter>
        </form>
      </DrawerPopup>
    </Drawer>
  )
}

export const EditProfile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => <ProfileDrawer />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: 'Edit profile' })
    await expect(within(drawer).getByLabelText('Name')).toHaveValue(
      'Rafael Lima',
    )
    await expect(within(drawer).getByLabelText('Username')).toHaveValue(
      'rafael.lima',
    )
    await expect(
      within(drawer).getByRole('button', { name: 'Save changes' }),
    ).toHaveAttribute('type', 'submit')
  },
}

const navigation = [
  { href: '#dashboard', icon: HouseIcon, label: 'Dashboard' },
  { href: '#projects', icon: FolderIcon, label: 'Projects' },
  { href: '#team', icon: UsersIcon, label: 'Team' },
  { href: '#billing', icon: ReceiptIcon, label: 'Billing' },
  { href: '#settings', icon: GearIcon, label: 'Settings' },
]

function NavigationDrawer() {
  const [open, setOpen] = useState(true)

  return (
    <Drawer onOpenChange={setOpen} open={open} position="left">
      <DrawerTrigger
        aria-label="Open navigation"
        render={<Button size="icon" variant="outline" />}
      >
        <ListIcon aria-hidden="true" />
      </DrawerTrigger>
      <DrawerPopup showCloseButton variant="straight">
        <DrawerHeader>
          <DrawerTitle>Northwind</DrawerTitle>
          <DrawerDescription>
            Signed in as rafael@northwind.dev
          </DrawerDescription>
        </DrawerHeader>
        <DrawerPanel>
          <nav aria-label="Main">
            <ul className="flex flex-col gap-1">
              {navigation.map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <a
                    aria-current={href === '#projects' ? 'page' : undefined}
                    className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm hover:bg-accent aria-[current=page]:bg-accent"
                    href={href}
                    onClick={() => setOpen(false)}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}

export const NavigationMenu: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => <NavigationDrawer />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: 'Northwind' })
    const nav = within(drawer).getByRole('navigation', { name: 'Main' })
    await expect(within(nav).getAllByRole('link')).toHaveLength(
      navigation.length,
    )
    await expect(
      within(nav).getByRole('link', { name: 'Projects' }),
    ).toHaveAttribute('aria-current', 'page')
  },
}

export const SongOptions: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => <SongActionsDrawer />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', {
      name: 'Options for Harbor Lights',
    })
    await expect(
      within(drawer).getByRole('checkbox', { name: 'Autoplay similar songs' }),
    ).toBeChecked()
    await expect(
      within(drawer).getByRole('radio', { name: 'High, 160 kbps' }),
    ).toBeChecked()
    await expect(
      within(drawer).getByRole('button', { name: 'Remove from library' }),
    ).toBeVisible()
  },
}

export const OrderSummary: Story = {
  render: () => (
    <Drawer defaultOpen position="right">
      <DrawerTrigger render={<Button variant="outline" />}>
        View cart
      </DrawerTrigger>
      <DrawerPopup showCloseButton variant="inset">
        <DrawerHeader>
          <DrawerTitle>Your cart</DrawerTitle>
          <DrawerDescription>
            3 items, ready to ship from Portland on Monday.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerPanel className="flex flex-col gap-6 text-sm">
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between gap-4">
              <span>Linen shirt, sand, M × 2</span>
              <span className="tabular-nums">$118.00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Canvas tote bag × 1</span>
              <span className="tabular-nums">$34.00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Wool socks, 3 pairs × 1</span>
              <span className="tabular-nums">$27.00</span>
            </li>
          </ul>
          <div className="flex justify-between gap-4 border-t pt-4 font-medium">
            <span>Subtotal</span>
            <span className="tabular-nums">$179.00</span>
          </div>
        </DrawerPanel>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost" />}>
            Keep shopping
          </DrawerClose>
          <Button>Check out</Button>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  ),
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: 'Your cart' })
    await expect(within(drawer).getByText('$179.00')).toBeInTheDocument()
    await expect(
      within(drawer).getByRole('button', { name: 'Check out' }),
    ).toBeVisible()
  },
}

const deliverySteps = [
  { label: 'Order placed', time: 'Mar 2, 9:12 AM' },
  { label: 'Payment confirmed', time: 'Mar 2, 9:13 AM' },
  { label: 'Sent to the Reno fulfillment center', time: 'Mar 2, 11:30 AM' },
  { label: 'Picked and packed', time: 'Mar 2, 4:48 PM' },
  { label: 'Label created, 1 package', time: 'Mar 2, 5:02 PM' },
  { label: 'Left the Reno fulfillment center', time: 'Mar 2, 9:40 PM' },
  { label: 'Arrived at the Sacramento hub', time: 'Mar 3, 2:15 AM' },
  { label: 'Left the Sacramento hub', time: 'Mar 3, 6:50 AM' },
  { label: 'Arrived at the Medford hub', time: 'Mar 3, 3:20 PM' },
  { label: 'Left the Medford hub', time: 'Mar 3, 8:05 PM' },
  { label: 'Arrived at the Portland station', time: 'Mar 4, 4:30 AM' },
  { label: 'Sorted for local delivery', time: 'Mar 4, 7:10 AM' },
  { label: 'Loaded on the delivery van', time: 'Mar 4, 9:45 AM' },
  { label: 'Picked up by Marcos', time: 'Mar 4, 10:02 AM' },
  { label: 'Delivered 8 packages on the route', time: 'Mar 4, 1:40 PM' },
  { label: 'On the way, 3 stops before yours', time: 'Mar 4, 2:20 PM' },
  { label: 'Delivery window narrowed to 3:00–3:30 PM', time: 'Mar 4, 2:22 PM' },
  { label: 'Courier is 10 minutes away', time: 'Mar 4, 2:55 PM' },
]

export const DeliveryTracking: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => (
    <Drawer defaultOpen snapPoints={['220px', 1]}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Track order
      </DrawerTrigger>
      <DrawerPopup showBar>
        <DrawerHeader>
          <DrawerTitle>Arriving by 3:30 PM</DrawerTitle>
          <DrawerDescription>
            Order #10482 is with Marcos, 3 stops away. Swipe up for every
            update.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerPanel>
          <ol className="flex flex-col gap-3 text-sm">
            {deliverySteps.map(({ label, time }) => (
              <li className="flex justify-between gap-4" key={time}>
                <span>{label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {time}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-muted-foreground text-sm">
            Delivery to 1200 Harbor Street, Apt 4B. Leave at the door if no one
            answers.
          </p>
        </DrawerPanel>
        <DrawerFooter>
          <Button variant="outline">Message courier</Button>
          <Button>Share live location</Button>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  ),
  play: async () => {
    const drawer = await screen.findByRole('dialog', {
      name: 'Arriving by 3:30 PM',
    })
    await expect(within(drawer).getAllByRole('listitem')).toHaveLength(
      deliverySteps.length,
    )
    await expect(
      within(drawer).getByRole('button', { name: 'Share live location' }),
    ).toBeInTheDocument()
    const viewport = drawer.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement
    await waitFor(() => expect(viewport).toHaveAttribute('tabindex', '0'), {
      timeout: 5000,
    })
  },
}
