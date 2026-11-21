import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Textarea } from '@tc96/ui/textarea'
import { expect, within } from 'storybook/test'
import { TextareaCanvas } from './textarea-frame.tsx'
import { ReleaseNotesTextarea, SupportForm } from './textarea-layouts.tsx'

const meta = {
  decorators: [TextareaCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Textarea/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SupportRequest: Story = {
  render: () => <SupportForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Message' }),
    ).toBeRequired()
    await expect(
      canvas.getByRole('button', { name: 'Send message' }),
    ).toBeVisible()
  },
}

export const ProfileBio: Story = {
  render: () => (
    <Field name="bio">
      <FieldLabel>Bio</FieldLabel>
      <Textarea defaultValue="Product designer in Lisbon. I work on onboarding and billing, and I answer design reviews on Tuesdays." />
      <FieldDescription>Shown on your public profile.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', {
      name: 'Bio',
    })
    await expect(textarea).toHaveValue(
      'Product designer in Lisbon. I work on onboarding and billing, and I answer design reviews on Tuesdays.',
    )
    await expect(textarea).toHaveAccessibleDescription(
      'Shown on your public profile.',
    )
  },
}

export const CommentReply: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Textarea
        aria-label="Reply to Marta Silva"
        placeholder="Write a reply…"
        size="sm"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost">
          Cancel
        </Button>
        <Button type="button">Reply</Button>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Reply to Marta Silva' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Reply' })).toBeVisible()
  },
}

export const ReleaseNotes: Story = {
  render: () => <ReleaseNotesTextarea />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Release notes' }),
    ).toHaveAccessibleDescription('0/200 characters')
  },
}

export const LockedOrderNotes: Story = {
  render: () => (
    <Field disabled name="order-notes">
      <FieldLabel>Delivery notes</FieldLabel>
      <Textarea defaultValue="Leave the parcel at the front desk of building B. The concierge signs for deliveries until 7 pm." />
      <FieldDescription>Notes lock once the order ships.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Delivery notes' }),
    ).toBeDisabled()
  },
}
