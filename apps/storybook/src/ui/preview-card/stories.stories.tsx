import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type PreviewCardControls,
  previewCardControlArgs,
  previewCardControlArgTypes,
} from './preview-card-controls.ts'
import { ComposedPreviewCard } from './preview-card-layouts.tsx'

const meta = {
  args: previewCardControlArgs,
  argTypes: previewCardControlArgTypes,
  parameters: {
    controls: { exclude: ['element', 'open'] },
    layout: 'centered',
  },
  render: (args) => <ComposedPreviewCard {...args} />,
  tags: ['!autodocs'],
  title: 'UI/PreviewCard/Stories',
} satisfies Meta<PreviewCardControls>

export default meta

type Story = StoryObj<PreviewCardControls>

export const Default: Story = {}
