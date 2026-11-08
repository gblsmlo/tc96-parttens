import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Switch } from '@tc96/ui/switch'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const onUnderlineLinksChange = fn()

const meta = {
  args: {
    description: 'Always underlines list titles',
    title: 'Underline links',
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
  title: 'Patterns/Surfaces/Settings/Switch',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  render: (args) => (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Interface and theme</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        {...args}
        endSlot={
          <Switch
            aria-label="Underline links"
            onCheckedChange={onUnderlineLinksChange}
          />
        }
      />
    </SettingsSection>
  ),
}

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', { name: 'Underline links' })
    expect(toggle).not.toBeChecked()

    await userEvent.click(toggle)
    await waitFor(() => expect(toggle).toBeChecked())
    expect(onUnderlineLinksChange).toHaveBeenCalledTimes(1)
    expect(onUnderlineLinksChange.mock.calls[0]?.[0]).toBe(true)
  },
  tags: interaction,
}
