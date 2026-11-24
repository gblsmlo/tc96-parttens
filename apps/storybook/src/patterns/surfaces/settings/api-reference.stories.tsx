import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { Slot } from '../../../test-utils/anatomy-slot'
import { SettingsCanvas } from './settings-canvas.tsx'

const meta = {
  component: SettingsSection,
  decorators: [SettingsCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Surfaces/Settings/API Reference',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const expectSlots = async (canvasElement: HTMLElement, slots: string[]) => {
  for (const slot of slots) {
    await expect(
      canvasElement.querySelector(`[data-slot="${slot}"]`),
    ).not.toBeNull()
  }
}

export const Anatomy: Story = {
  render: (args) => (
    <SettingsSection
      {...args}
      header={
        <SettingsSectionHeader actions={<Slot name="actions" />}>
          <SettingsSectionTitle>
            <Slot name="SettingsSectionTitle" />
          </SettingsSectionTitle>
          <SettingsSectionDescription>
            <Slot name="SettingsSectionDescription" />
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        description={<Slot name="description" />}
        endSlot={<Slot name="endSlot" />}
        startSlot={<Slot name="startSlot" />}
        title={<Slot name="title" />}
      />
    </SettingsSection>
  ),
  play: async ({ canvasElement }) => {
    await expectSlots(canvasElement, [
      'settings-section',
      'settings-section-header',
      'settings-section-actions',
      'settings-section-title',
      'settings-section-description',
      'card',
      'settings-section-rows',
      'settings-row',
      'settings-row-start',
      'settings-row-heading',
      'settings-row-title',
      'settings-row-description',
      'settings-row-end',
    ])
  },
}

export const CollapsedAnatomy: Story = {
  render: () => (
    <SettingsCollapsed actions={<Slot name="actions" />} title="title">
      <SettingsRow title="SettingsRow" />
    </SettingsCollapsed>
  ),
  play: async ({ canvasElement }) => {
    await expectSlots(canvasElement, [
      'settings-collapsed',
      'settings-collapsed-title',
      'settings-collapsed-actions',
      'settings-collapsed-items',
      'settings-row',
    ])
  },
}
