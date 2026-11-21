import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { expect, within } from 'storybook/test'
import { radioGroupControlArgs } from './radio-group-controls.ts'
import {
  CardRadioGroup,
  ComposedRadioGroup,
  FieldRadioGroup,
} from './radio-group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/RadioGroup/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const plans = [
  {
    description: 'Up to 3 projects and 1 GB of storage.',
    label: 'Free',
    value: 'free',
  },
  {
    description: '$12 per month. Unlimited projects and priority support.',
    label: 'Pro',
    value: 'pro',
  },
  {
    description:
      '$29 per seat per month. Shared workspaces and single sign-on.',
    label: 'Team',
    value: 'team',
  },
]

export const SubscriptionPlan: Story = {
  render: () => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      defaultValue="pro"
      description
      label="Plan"
      options={plans}
    />
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', {
      name: 'Plan',
    })
    await expect(
      within(group).getByRole('radio', { name: 'Pro' }),
    ).toBeChecked()
    await expect(
      within(group).getByText(
        '$29 per seat per month. Shared workspaces and single sign-on.',
      ),
    ).toBeVisible()
  },
}

const codeMethods = [
  {
    description: 'To the address on your account.',
    label: 'Email',
    value: 'email',
  },
  {
    description: 'To the phone number ending in 4821.',
    label: 'Text message',
    value: 'sms',
  },
  {
    description: 'From the authenticator app you paired in settings.',
    label: 'Authenticator app',
    value: 'app',
  },
]

export const SignInCodeMethod: Story = {
  render: () => (
    <CardRadioGroup
      defaultValue="app"
      label="Send sign-in codes by"
      options={codeMethods}
    />
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', {
      name: 'Send sign-in codes by',
    })
    await expect(
      within(group).getByRole('radio', { name: /Authenticator app/ }),
    ).toBeChecked()
    await expect(within(group).getAllByRole('radio')).toHaveLength(3)
  },
}

const formats = [
  { label: 'CSV', value: 'csv' },
  { label: 'JSON', value: 'json' },
  { label: 'Excel workbook', value: 'xlsx' },
]

export const ExportFormat: Story = {
  render: () => (
    <Form
      className="flex w-72 flex-col items-start gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <FieldRadioGroup
        defaultValue="csv"
        description="The file holds every contact in the current view."
        legend="Export format"
        name="format"
        options={formats}
      />
      <Button type="submit">Export contacts</Button>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', {
      name: 'Export format',
    })
    await expect(
      within(group).getByRole('radio', { name: 'CSV' }),
    ).toBeChecked()
    await expect(
      within(group).getByRole('radio', { name: 'Excel workbook' }),
    ).not.toBeChecked()
  },
}
