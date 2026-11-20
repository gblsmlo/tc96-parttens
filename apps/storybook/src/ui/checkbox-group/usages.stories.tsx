import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@tc96/ui/checkbox'
import { CheckboxGroup } from '@tc96/ui/checkbox-group'
import { Field, FieldDescription, FieldItem, FieldLabel } from '@tc96/ui/field'
import { Label } from '@tc96/ui/label'
import { expect, within } from 'storybook/test'
import { NestedPermissions } from './checkbox-group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/CheckboxGroup/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const notifications = [
  { label: 'Someone mentions me', value: 'mentions' },
  { label: 'A task is assigned to me', value: 'assignments' },
  { label: 'A weekly summary is ready', value: 'weekly-summary' },
]

export const NotificationPreferences: Story = {
  render: () => (
    <Field name="email-notifications">
      <FieldLabel>Email me when</FieldLabel>
      <CheckboxGroup defaultValue={['mentions', 'assignments']}>
        {notifications.map(({ label, value }) => (
          <FieldItem key={value}>
            <FieldLabel>
              <Checkbox value={value} />
              {label}
            </FieldLabel>
          </FieldItem>
        ))}
      </CheckboxGroup>
      <FieldDescription>
        Security alerts are always sent, whatever you pick here.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Email me when',
    })
    await expect(
      within(group).getByRole('checkbox', { name: 'Someone mentions me' }),
    ).toBeChecked()
    await expect(
      within(group).getByRole('checkbox', {
        name: 'A weekly summary is ready',
      }),
    ).not.toBeChecked()
  },
}

const columns = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Role', value: 'role' },
  { label: 'Last active', value: 'last-active' },
]

export const VisibleColumns: Story = {
  render: () => (
    <div className="w-56 rounded-lg border p-3">
      <CheckboxGroup
        allValues={columns.map(({ value }) => value)}
        aria-labelledby="visible-columns-caption"
        defaultValue={['name', 'email', 'role']}
      >
        <Label id="visible-columns-caption">
          <Checkbox parent />
          All columns
        </Label>
        {columns.map(({ label, value }) => (
          <Label className="ms-4" key={value}>
            <Checkbox disabled={value === 'name'} value={value} />
            {label}
          </Label>
        ))}
      </CheckboxGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('checkbox', { name: 'All columns' }),
    ).toHaveAttribute('aria-checked', 'mixed')
    await expect(canvas.getByRole('checkbox', { name: 'Name' })).toBeChecked()
    await expect(
      canvas.getByRole('checkbox', { name: 'Last active' }),
    ).not.toBeChecked()
  },
}

export const EditorPermissions: Story = {
  render: () => <NestedPermissions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Editor permissions' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Manage users' }),
    ).toBeVisible()
  },
}
