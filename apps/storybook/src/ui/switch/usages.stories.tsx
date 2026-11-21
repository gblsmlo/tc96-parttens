import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Label } from '@tc96/ui/label'
import { Switch } from '@tc96/ui/switch'
import { useId } from 'react'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Switch/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const pushSettings = [
  {
    description: 'When someone comments on a task assigned to you.',
    id: 'comments',
    label: 'Comments',
    on: true,
  },
  {
    description: 'When a teammate mentions you in a task or a document.',
    id: 'mentions',
    label: 'Mentions',
    on: true,
  },
  {
    description: 'One hour before a task you own is due.',
    id: 'reminders',
    label: 'Due date reminders',
    on: false,
  },
] as const

const integrations = [
  { id: 'slack', name: 'Slack', on: true, summary: 'Post new deals to #sales' },
  {
    id: 'calendar',
    name: 'Google Calendar',
    on: true,
    summary: 'Sync meetings with contacts',
  },
  {
    id: 'github',
    name: 'GitHub',
    on: false,
    summary: 'Link issues to support tickets',
  },
  {
    id: 'salesforce',
    locked: true,
    name: 'Salesforce',
    on: false,
    summary: 'Available on the Business plan',
  },
] as const

const PushNotifications = () => {
  const id = useId()
  return (
    <fieldset className="flex w-96 flex-col gap-4">
      <legend className="mb-3 font-semibold text-sm">Push notifications</legend>
      {pushSettings.map((item) => (
        <div className="flex items-start justify-between gap-6" key={item.id}>
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
            name={item.id}
          />
        </div>
      ))}
    </fieldset>
  )
}

const TwoFactorCard = () => (
  <Label className="flex w-96 items-start justify-between gap-6 rounded-lg border p-4 has-data-checked:bg-accent/50">
    <span className="flex flex-col gap-1">
      Two-factor authentication
      <span className="font-normal text-muted-foreground text-xs">
        Ask for a code from your authenticator app every time you sign in on a
        new device.
      </span>
    </span>
    <Switch name="two-factor" />
  </Label>
)

const MarketingEmailsForm = () => (
  <Form
    className="flex w-96 flex-col items-start gap-4"
    onSubmit={(event) => event.preventDefault()}
  >
    <Field name="marketing">
      <FieldLabel>
        <Switch defaultChecked />
        Product news and offers
      </FieldLabel>
      <FieldDescription>
        About two emails a month. You can unsubscribe from any of them.
      </FieldDescription>
    </Field>
    <Button type="submit">Save preferences</Button>
  </Form>
)

const IntegrationList = () => {
  const id = useId()
  return (
    <ul className="flex w-96 flex-col rounded-lg border">
      {integrations.map((item) => (
        <li
          className="flex items-center justify-between gap-6 border-b px-4 py-3 last:border-b-0"
          key={item.id}
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm" id={`${id}-${item.id}`}>
              {item.name}
            </span>
            <span
              className="text-muted-foreground text-xs"
              id={`${id}-${item.id}-summary`}
            >
              {item.summary}
            </span>
          </div>
          <Switch
            aria-describedby={`${id}-${item.id}-summary`}
            aria-labelledby={`${id}-${item.id}`}
            defaultChecked={item.on}
            disabled={'locked' in item}
          />
        </li>
      ))}
    </ul>
  )
}

export const PushNotificationSettings: Story = {
  render: () => <PushNotifications />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Push notifications' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Mentions' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      canvas.getByRole('switch', { name: 'Due date reminders' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const TwoFactorAuthentication: Story = {
  render: () => <TwoFactorCard />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('switch', {
        name: /^Two-factor authentication/,
      }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const MarketingEmails: Story = {
  render: () => <MarketingEmailsForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('switch', { name: 'Product news and offers' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      canvas.getByRole('button', { name: 'Save preferences' }),
    ).toBeVisible()
  },
}

export const Integrations: Story = {
  render: () => <IntegrationList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('switch')).toHaveLength(
      integrations.length,
    )
    await expect(
      canvas.getByRole('switch', { name: 'Salesforce' }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
}
