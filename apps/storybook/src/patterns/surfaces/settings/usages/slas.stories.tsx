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
  parameters: {
    docs: {
      description: {
        component:
          'A consumer composition of SettingsSection and SettingsRow. The switch state lives in this story, not in the pattern.',
      },
    },
    layout: 'padded',
  },
  title: 'Patterns/Surfaces/Settings/Usages/SLAs',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SlasDemo />,
}

export const Interaction: Story = {
  ...Default,
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
