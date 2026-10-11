import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Input } from '@tc96/ui/input'
import { expect, fn, userEvent, within } from 'storybook/test'

const onWorkspaceNameCommit = fn()

const meta = {
  args: {
    description: 'Saved automatically when you leave the field',
    title: 'Workspace name',
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
  title: 'Patterns/Surfaces/Settings/Input',
} satisfies Meta<typeof SettingsRow>

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
      <SettingsRow
        {...args}
        endSlot={
          <Input
            aria-label="Workspace name"
            className="w-56"
            defaultValue="Acme Legal"
            onBlur={(event) => onWorkspaceNameCommit(event.currentTarget.value)}
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
    const input = canvas.getByRole('textbox', { name: 'Workspace name' })

    expect(input).toHaveValue('Acme Legal')
    await userEvent.clear(input)
    await userEvent.type(input, 'Acme Partners')
    expect(onWorkspaceNameCommit).not.toHaveBeenCalled()
    await userEvent.tab()
    expect(onWorkspaceNameCommit).toHaveBeenCalledWith('Acme Partners')
  },
  tags: interaction,
}
