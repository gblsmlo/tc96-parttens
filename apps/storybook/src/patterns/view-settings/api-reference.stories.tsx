import type { Meta, StoryObj } from '@storybook/react-vite'
import { ViewSettings } from '@tc96/ui/patterns'
import { Slot } from '../../test-utils/anatomy-slot'
import { ViewSettingsCanvas } from './view-settings-canvas.tsx'

const meta = {
  args: { children: null },
  component: ViewSettings,
  decorators: [ViewSettingsCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/ViewSettings/API Reference',
} satisfies Meta<typeof ViewSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <ViewSettings onClearFilters={() => undefined}>
      <Slot name="children" />
    </ViewSettings>
  ),
}
