import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from '@tc96/ui/sheet'
import { Switch } from '@tc96/ui/switch'
import {
  FolderIcon,
  HomeIcon,
  MenuIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { expect, screen, within } from 'storybook/test'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Sheet/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function ProfileSheet() {
  const [open, setOpen] = useState(true)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpen(false)
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger render={<Button variant="outline" />}>
        Edit profile
      </SheetTrigger>
      <SheetPopup>
        <form className="contents" onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Your name and username show on your posts and comments.
            </SheetDescription>
          </SheetHeader>
          <SheetPanel className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input defaultValue="Rafael Lima" name="name" />
            </Field>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input defaultValue="rafael.lima" name="username" />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                defaultValue="rafael@northwind.dev"
                name="email"
                type="email"
              />
            </Field>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  )
}

export const EditProfile: Story = {
  render: () => <ProfileSheet />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: 'Edit profile' })
    await expect(within(sheet).getByLabelText('Name')).toHaveValue(
      'Rafael Lima',
    )
    await expect(within(sheet).getByLabelText('Email')).toHaveValue(
      'rafael@northwind.dev',
    )
    await expect(
      within(sheet).getByRole('button', { name: 'Save changes' }),
    ).toHaveAttribute('type', 'submit')
  },
}

const navigation = [
  { href: '#dashboard', icon: HomeIcon, label: 'Dashboard' },
  { href: '#projects', icon: FolderIcon, label: 'Projects' },
  { href: '#team', icon: UsersIcon, label: 'Team' },
  { href: '#billing', icon: ReceiptIcon, label: 'Billing' },
  { href: '#settings', icon: SettingsIcon, label: 'Settings' },
]

export const NavigationMenu: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger
        aria-label="Open navigation"
        render={<Button size="icon" variant="outline" />}
      >
        <MenuIcon aria-hidden="true" />
      </SheetTrigger>
      <SheetPopup side="left">
        <SheetHeader>
          <SheetTitle>Northwind</SheetTitle>
          <SheetDescription>Signed in as rafael@northwind.dev</SheetDescription>
        </SheetHeader>
        <SheetPanel>
          <nav aria-label="Main">
            <ul className="flex flex-col gap-1">
              {navigation.map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <a
                    aria-current={href === '#projects' ? 'page' : undefined}
                    className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm hover:bg-accent aria-[current=page]:bg-accent"
                    href={href}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </SheetPanel>
      </SheetPopup>
    </Sheet>
  ),
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: 'Northwind' })
    const nav = within(sheet).getByRole('navigation', { name: 'Main' })
    await expect(within(nav).getAllByRole('link')).toHaveLength(
      navigation.length,
    )
    await expect(
      within(nav).getByRole('link', { name: 'Projects' }),
    ).toHaveAttribute('aria-current', 'page')
  },
}

const items = [
  { name: 'Linen shirt, sand, M', quantity: 2, total: '$118.00' },
  { name: 'Canvas tote bag', quantity: 1, total: '$34.00' },
  { name: 'Wool socks, 3 pairs', quantity: 1, total: '$27.00' },
]

const totals = [
  { label: 'Subtotal', value: '$179.00' },
  { label: 'Shipping', value: '$8.00' },
  { label: 'Tax', value: '$14.96' },
]

export const OrderDetails: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>
        View order
      </SheetTrigger>
      <SheetPopup variant="inset">
        <SheetHeader>
          <SheetTitle>Order #10482</SheetTitle>
          <SheetDescription>
            Placed by Júlia Martins on March 4, 2026. Paid by card ending in
            4242.
          </SheetDescription>
        </SheetHeader>
        <SheetPanel className="flex flex-col gap-6 text-sm">
          <section className="flex flex-col gap-3">
            <h3 className="font-medium">Items</h3>
            <ul className="flex flex-col gap-2">
              {items.map(({ name, quantity, total }) => (
                <li className="flex justify-between gap-4" key={name}>
                  <span>
                    {name}
                    <span className="text-muted-foreground"> × {quantity}</span>
                  </span>
                  <span className="tabular-nums">{total}</span>
                </li>
              ))}
            </ul>
          </section>
          <dl className="flex flex-col gap-2 border-t pt-4">
            {totals.map(({ label, value }) => (
              <div className="flex justify-between gap-4" key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="tabular-nums">{value}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">$201.96</dd>
            </div>
          </dl>
          <section className="flex flex-col gap-1">
            <h3 className="font-medium">Ship to</h3>
            <p className="text-muted-foreground">
              Júlia Martins, 1200 Harbor Street, Apt 4B, Portland, OR 97209
            </p>
          </section>
        </SheetPanel>
        <SheetFooter>
          <Button variant="outline">Issue refund</Button>
          <Button>Mark as shipped</Button>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  ),
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: 'Order #10482' })
    await expect(within(sheet).getByText('$201.96')).toBeInTheDocument()
    await expect(
      within(sheet).getByRole('button', { name: 'Mark as shipped' }),
    ).toBeVisible()
  },
}

const cookies = [
  {
    checked: true,
    description: 'Keep you signed in and remember what is in your cart.',
    disabled: true,
    id: 'necessary',
    label: 'Strictly necessary',
  },
  {
    checked: true,
    description: 'Count visits and show us which pages people use most.',
    disabled: false,
    id: 'analytics',
    label: 'Analytics',
  },
  {
    checked: false,
    description: 'Show you offers from us on other websites.',
    disabled: false,
    id: 'marketing',
    label: 'Marketing',
  },
]

const initialChoices = Object.fromEntries(
  cookies.map(({ checked, id }) => [id, checked]),
)

function CookieSheet() {
  const [open, setOpen] = useState(true)
  const [choices, setChoices] = useState(initialChoices)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpen(false)
  }

  const rejectAll = () => {
    setChoices(
      Object.fromEntries(
        cookies.map(({ disabled, id }) => [id, disabled && choices[id]]),
      ),
    )
    setOpen(false)
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger render={<Button variant="outline" />}>
        Cookie settings
      </SheetTrigger>
      <SheetPopup side="bottom">
        <form className="contents" onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Cookie preferences</SheetTitle>
            <SheetDescription>
              Choose which cookies this site may store. You can change this
              later from the footer of any page.
            </SheetDescription>
          </SheetHeader>
          <SheetPanel>
            <ul className="flex flex-col gap-4 text-sm">
              {cookies.map(({ description, disabled, id, label }) => (
                <li className="flex items-start justify-between gap-4" key={id}>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium" id={`cookie-${id}-label`}>
                      {label}
                    </span>
                    <span
                      className="text-muted-foreground"
                      id={`cookie-${id}-description`}
                    >
                      {description}
                    </span>
                  </div>
                  <Switch
                    aria-describedby={`cookie-${id}-description`}
                    aria-labelledby={`cookie-${id}-label`}
                    checked={choices[id]}
                    disabled={disabled}
                    name={id}
                    onCheckedChange={(checked) =>
                      setChoices((current) => ({ ...current, [id]: checked }))
                    }
                  />
                </li>
              ))}
            </ul>
          </SheetPanel>
          <SheetFooter>
            <Button onClick={rejectAll} variant="ghost">
              Reject all
            </Button>
            <Button type="submit">Save preferences</Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  )
}

export const CookiePreferences: Story = {
  render: () => <CookieSheet />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', {
      name: 'Cookie preferences',
    })
    await expect(
      within(sheet).getByRole('switch', { name: 'Strictly necessary' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await expect(
      within(sheet).getByRole('switch', { name: 'Marketing' }),
    ).not.toBeChecked()
  },
}
