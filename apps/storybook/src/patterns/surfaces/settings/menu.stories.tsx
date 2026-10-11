import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { EllipsisIcon } from 'lucide-react'
import { expect, screen, userEvent, within } from 'storybook/test'

const meta = {
  args: {
    description: 'Optional details about this setting',
    title: 'Setting label',
  },
  component: SettingsRow,
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  title: 'Patterns/Surfaces/Settings/Menu',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  render: (args) => (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Settings</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        {...args}
        endSlot={
          <Menu>
            <MenuTrigger
              aria-label="Actions for setting"
              render={<Button size="icon-xs" variant="ghost" />}
            >
              <EllipsisIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem>Edit</MenuItem>
              <MenuItem variant="destructive">Remove</MenuItem>
            </MenuPopup>
          </Menu>
        }
      />
    </SettingsSection>
  ),
}

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('region', { name: 'Settings' })).toBeVisible()
    expect(canvas.getByText('Setting label')).toBeVisible()
    expect(
      canvas.getByText('Optional details about this setting'),
    ).toBeVisible()
    expect(
      canvasElement.querySelectorAll('[data-slot="settings-row"]'),
    ).toHaveLength(1)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for setting' }),
    )
    expect(await screen.findByRole('menuitem', { name: 'Edit' })).toBeVisible()
  },
  tags: interaction,
}
