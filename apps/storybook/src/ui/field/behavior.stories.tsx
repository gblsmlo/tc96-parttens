import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { fieldControlArgs } from './field-controls.ts'
import { FieldCanvas } from './field-frame.tsx'
import {
  ComposedField,
  CreateAccountForm,
  EmailConstraintsForm,
  SubscribeForm,
  ValidityField,
} from './field-layouts.tsx'

const meta = {
  decorators: [FieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Field/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LabelNamesControl: Story = {
  render: () => <ComposedField {...fieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await expect(input).toHaveAccessibleName('Name')
  },
}

export const DescriptionDescribesControl: Story = {
  render: () => <ComposedField {...fieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await expect(input).toHaveAccessibleDescription('Visible on your profile.')
  },
}

export const RequiredIndicator: Story = {
  render: () => (
    <ComposedField
      {...fieldControlArgs}
      label="Password"
      placeholder="Enter password"
      required
    />
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByPlaceholderText('Enter password')
    await expect(input).toBeRequired()
    await expect(input).toHaveAccessibleName('Password')
  },
}

export const DisablesControl: Story = {
  render: () => <ComposedField {...fieldControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toBeDisabled()
    await expect(
      canvasElement.querySelector('[data-slot="field"]'),
    ).toHaveAttribute('data-disabled')
    await expect(canvas.getByText('Name')).toHaveAttribute('data-disabled')
  },
}

export const InvalidFromOutside: Story = {
  render: () => <ComposedField {...fieldControlArgs} invalid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Name' })
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Please enter your name.')).toBeVisible()
    await expect(input).toHaveAccessibleDescription(
      'Visible on your profile. Please enter your name.',
    )
  },
}

const subscribeError = 'Please enter a valid email.'

export const ErrorWaitsForSubmit: Story = {
  render: () => <SubscribeForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await expect(canvas.queryByText(subscribeError)).toBeNull()
    await expect(input).not.toHaveAttribute('aria-invalid')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
    await expect(await canvas.findByText(subscribeError)).toBeVisible()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  },
}

export const FocusesInvalidControl: Story = {
  render: () => <SubscribeForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
    await waitFor(() => expect(input).toHaveFocus())
  },
}

export const BlocksSubmitWhileInvalid: Story = {
  render: () => <SubscribeForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
    await canvas.findByText(subscribeError)
    await expect(canvas.queryByRole('status')).toBeNull()
  },
}

export const ErrorClearsAfterChange: Story = {
  render: () => <SubscribeForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
    await canvas.findByText(subscribeError)
    await userEvent.type(input, 'team@tc96.dev')
    await waitFor(() => expect(canvas.queryByText(subscribeError)).toBeNull())
    await expect(input).not.toHaveAttribute('aria-invalid')
  },
}

export const SubmitsValidValue: Story = {
  render: () => <SubscribeForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Email' }),
      'team@tc96.dev',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Subscribed team@tc96.dev.',
    )
  },
}

export const ErrorMatchesItsConstraint: Story = {
  render: () => <EmailConstraintsForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(await canvas.findByText('Enter an email.')).toBeVisible()
    await expect(canvas.queryByText('Enter a valid email address.')).toBeNull()
    await userEvent.type(input, 'not-an-email')
    await expect(
      await canvas.findByText('Enter a valid email address.'),
    ).toBeVisible()
    await expect(canvas.queryByText('Enter an email.')).toBeNull()
  },
}

export const SubmitsUnderFieldName: Story = {
  render: () => <CreateAccountForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Full name' }),
      'Ada Lovelace',
    )
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Email' }),
      'ada@example.com',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create account' }),
    )
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Account ready for Ada Lovelace.',
    )
  },
}

export const ValidityReachesChildren: Story = {
  render: () => <ValidityField />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await expect(canvas.getByText('Not checked yet.')).toBeVisible()
    await userEvent.type(input, 'ada')
    await expect(
      await canvas.findByText('Not a valid email yet.'),
    ).toBeVisible()
    await userEvent.type(input, '@example.com')
    await expect(await canvas.findByText('Looks good.')).toBeVisible()
  },
}
