import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  args: {
    description: 'The address of your workspace; every page lives under it',
    title: 'URL',
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
  subcomponents: {
    SettingsSection,
    SettingsSectionDescription,
    SettingsSectionHeader,
    SettingsSectionTitle,
  },
  title: 'Patterns/Surfaces/Settings',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Untitled: Story = {
  render: (args) => (
    <SettingsSection>
      <SettingsRow
        {...args}
        endSlot={
          <span className="text-muted-foreground text-sm">/acme-legal</span>
        }
      />
    </SettingsSection>
  ),
}

export const UntitledInteraction: Story = {
  ...Untitled,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvas.queryByRole('region')).toBeNull()
    expect(canvas.queryByRole('heading')).toBeNull()
    expect(canvasElement.querySelector('[data-slot="card"]')).not.toBeNull()
  },
  tags: interaction,
}
