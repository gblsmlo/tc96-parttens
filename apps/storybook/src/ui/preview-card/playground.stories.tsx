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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedPreviewCard {...args} />,
  tags: ['!autodocs'],
  title: 'UI/PreviewCard/Playground',
} satisfies Meta<PreviewCardControls>

export default meta

type Story = StoryObj<PreviewCardControls>

export const Playground: Story = {}
