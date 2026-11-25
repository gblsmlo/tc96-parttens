import type { Meta, StoryObj } from '@storybook/react-vite'
import { ViewSettingsCanvas } from './view-settings-canvas.tsx'
import {
  type ViewSettingsControls,
  viewSettingsControlArgs,
  viewSettingsControlArgTypes,
} from './view-settings-controls.ts'
import { ComposedViewSettings } from './view-settings-layouts.tsx'

const meta = {
  args: viewSettingsControlArgs,
  argTypes: viewSettingsControlArgTypes,
  decorators: [ViewSettingsCanvas],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedViewSettings {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/ViewSettings/Playground',
} satisfies Meta<ViewSettingsControls>

export default meta

type Story = StoryObj<ViewSettingsControls>

export const Playground: Story = {}
