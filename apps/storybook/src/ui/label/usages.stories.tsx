import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { Switch } from '@tc96/ui/switch'
import { useId } from 'react'
import { expect, within } from 'storybook/test'
import { LabelCanvas } from './label-frame.tsx'
import { RequiredMarker } from './label-layouts.tsx'

const meta = {
  decorators: [LabelCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Label/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const notifications = [
  {
    description: 'Alerts on this device when a teammate mentions you.',
    id: 'push',
    label: 'Push notifications',
    on: true,
  },
  {
    description: 'A summary of your projects, every Monday morning.',
    id: 'digest',
    label: 'Weekly digest',
    on: true,
  },
  {
    description: 'Release notes and tips, about once a month.',
    id: 'product',
    label: 'Product updates',
    on: false,
  },
] as const

const shippingOptions = [
  { label: 'Standard, 5 to 7 business days', value: 'standard' },
  { label: 'Express, 2 business days', value: 'express' },
  { label: 'Overnight, next business day', value: 'overnight' },
] as const

const SignInForm = () => {
  const id = useId()
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input
          autoComplete="email"
          id={`${id}-email`}
          placeholder="you@example.com"
          type="email"
        />
      </div>
      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          autoComplete="current-password"
          id={`${id}-password`}
          type="password"
        />
      </div>
      <Button type="submit">Sign in</Button>
    </form>
  )
}

const NotificationSettings = () => {
  const id = useId()
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 font-semibold text-sm">Notifications</legend>
      {notifications.map((item) => (
        <div className="flex items-start justify-between gap-4" key={item.id}>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${id}-${item.id}`}>{item.label}</Label>
            <p
              className="text-muted-foreground text-xs"
              id={`${id}-${item.id}-description`}
            >
              {item.description}
            </p>
          </div>
          <Switch
            aria-describedby={`${id}-${item.id}-description`}
            defaultChecked={item.on}
            id={`${id}-${item.id}`}
          />
        </div>
      ))}
    </fieldset>
  )
}

const ShippingSpeed = () => {
  const id = useId()
  return (
    <div className="flex flex-col gap-3">
      <Label id={id} render={<span />}>
        Shipping speed
      </Label>
      <RadioGroup aria-labelledby={id} defaultValue="standard">
        {shippingOptions.map((option) => (
          <Label className="font-normal" key={option.value}>
            <Radio value={option.value} />
            {option.label}
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}

const CreateWorkspaceForm = () => {
  const id = useId()
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={`${id}-name`}>
          Workspace name
          <RequiredMarker />
        </Label>
        <Input id={`${id}-name`} placeholder="Acme Inc." required />
      </div>
      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={`${id}-slug`}>
          Workspace URL
          <RequiredMarker />
        </Label>
        <Input id={`${id}-slug`} placeholder="acme" required />
      </div>
      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={`${id}-team-size`}>Team size</Label>
        <Input id={`${id}-team-size`} min={1} placeholder="12" type="number" />
      </div>
      <Button type="submit">Create workspace</Button>
    </form>
  )
}

export const SignIn: Story = {
  render: () => <SignInForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toBeVisible()
    await expect(canvas.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  },
}

export const Notifications: Story = {
  render: () => <NotificationSettings />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('switch', { name: 'Weekly digest' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      canvas.getByRole('switch', { name: 'Product updates' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const ShippingOptions: Story = {
  render: () => <ShippingSpeed />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', {
      name: 'Shipping speed',
    })
    await expect(
      within(group).getByRole('radio', {
        name: 'Standard, 5 to 7 business days',
      }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

export const CreateWorkspace: Story = {
  render: () => <CreateWorkspaceForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Workspace name' }),
    ).toBeRequired()
    await expect(
      canvas.getByRole('spinbutton', { name: 'Team size' }),
    ).not.toBeRequired()
  },
}
