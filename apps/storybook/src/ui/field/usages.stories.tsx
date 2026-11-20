import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Textarea } from '@tc96/ui/textarea'
import { expect, within } from 'storybook/test'
import { FieldCanvas } from './field-frame.tsx'
import { CreateAccountForm, SubscribeForm } from './field-layouts.tsx'

const meta = {
  decorators: [FieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Field/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CreateAccount: Story = {
  render: () => <CreateAccountForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('textbox')).toHaveLength(3)
    await expect(
      canvas.getByRole('button', { name: 'Create account' }),
    ).toBeVisible()
  },
}

export const NewsletterSignup: Story = {
  render: () => <SubscribeForm />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Product updates, once a month.'),
    ).toBeVisible()
  },
}

export const ProfileBio: Story = {
  render: () => (
    <Field name="bio">
      <FieldLabel>Bio</FieldLabel>
      <Textarea
        maxLength={500}
        placeholder="Mathematician, writer of the first published program."
      />
      <FieldDescription>Up to 500 characters.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Bio' }),
    ).toHaveAttribute('maxlength', '500')
  },
}

export const LockedWorkspaceUrl: Story = {
  render: () => (
    <Field disabled name="workspaceUrl">
      <FieldLabel>Workspace URL</FieldLabel>
      <Input defaultValue="acme.tc96.dev" type="text" />
      <FieldDescription>Only an owner can change the address.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Workspace URL' }),
    ).toHaveValue('acme.tc96.dev')
  },
}

export const UsernameTaken: Story = {
  render: () => (
    <Field invalid name="username">
      <FieldLabel>Username</FieldLabel>
      <Input defaultValue="ada" type="text" />
      <FieldError match>This username is already taken.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('This username is already taken.'),
    ).toBeVisible()
  },
}
