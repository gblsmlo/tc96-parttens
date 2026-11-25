import type { Meta, StoryObj } from '@storybook/react-vite'
import { ViewSettingsCanvas } from './view-settings-menu-canvas.tsx'
import {
  type ViewSettingsControls,
  viewSettingsControlArgs,
  viewSettingsControlArgTypes,
} from './view-settings-menu-controls.ts'
import { ComposedViewSettings } from './view-settings-menu-layouts.tsx'

const meta = {
  args: viewSettingsControlArgs,
  argTypes: viewSettingsControlArgTypes,
  decorators: [ViewSettingsCanvas],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedViewSettings {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/ViewSettingsMenu/Playground',
} satisfies Meta<ViewSettingsControls>

export default meta

type Story = StoryObj<ViewSettingsControls>

export const Playground: Story = {}
