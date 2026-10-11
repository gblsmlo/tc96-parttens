import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { PlusIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  args: {
    title: 'Access',
  },
  component: SettingsCollapsed,
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  title: 'Patterns/Surfaces/Settings/Collapsed',
} satisfies Meta<typeof SettingsCollapsed>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  render: (args) => (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Workspace</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsCollapsed
        {...args}
        actions={
          <Button aria-label="Add access rule" size="icon-xs" variant="ghost">
            <PlusIcon aria-hidden="true" />
          </Button>
        }
      >
        <SettingsRow
          description="Anyone with an invitation"
          endSlot={
            <span className="text-muted-foreground text-sm">Invite only</span>
          }
          title="Member access"
        />
      </SettingsCollapsed>
    </SettingsSection>
  ),
}

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Access' })
    const trigger = within(region).getByRole('button', { name: 'Access' })
    const action = within(region).getByRole('button', {
      name: 'Add access rule',
    })

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(within(region).getByText('Member access')).toBeVisible()
    await userEvent.click(action)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() =>
      expect(within(region).queryByText('Member access')).toBeNull(),
    )
    await userEvent.click(trigger)
    expect(within(region).getByText('Member access')).toBeVisible()
  },
  tags: interaction,
}
