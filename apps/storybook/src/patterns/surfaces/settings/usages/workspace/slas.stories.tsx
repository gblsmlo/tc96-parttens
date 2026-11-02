import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Switch } from '@tc96/ui/switch'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const onSlasChange = fn()

function SlasDemo() {
  return (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>SLAs</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        description="Apply deadlines to issues that match automation rules"
        endSlot={
          <Switch aria-label="Enable SLAs" onCheckedChange={onSlasChange} />
        }
        title="Enable SLAs"
      />
    </SettingsSection>
  )
}

const meta = {
  component: SettingsSection,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages/Workspace/SLAs',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Slas: Story = {
  name: 'SLAs',
  render: () => <SlasDemo />,
}

export const Interaction: Story = {
  ...Slas,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'SLAs' }),
    ).toBeVisible()
    expect(canvas.queryByRole('link', { name: 'Docs' })).toBeNull()

    const toggle = canvas.getByRole('switch', { name: 'Enable SLAs' })
    expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await waitFor(() => expect(toggle).toBeChecked())
    expect(onSlasChange).toHaveBeenCalledTimes(1)
    expect(onSlasChange.mock.calls[0]?.[0]).toBe(true)
  },
  tags: ['!dev', '!autodocs'],
}
