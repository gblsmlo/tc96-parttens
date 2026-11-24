import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns'
import { Switch } from '@tc96/ui/switch'
import { expect, fn, within } from 'storybook/test'

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
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Slas: Story = {
  name: 'SLAs',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'SLAs' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Enable SLAs' }),
    ).toBeVisible()
  },
  render: () => <SlasDemo />,
}
