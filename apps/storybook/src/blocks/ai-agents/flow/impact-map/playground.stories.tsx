import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type ImpactMapControls,
  impactMapControlArgs,
  impactMapControlArgTypes,
} from './impact-map-controls.ts'
import { ComposedImpactMap } from './impact-map-layouts.tsx'

const meta = {
  args: impactMapControlArgs,
  argTypes: impactMapControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedImpactMap {...args} onNodeSelect={fn()} onRetry={fn()} />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/Flow/ImpactMap/Playground',
} satisfies Meta<ImpactMapControls>

export default meta

type Story = StoryObj<ImpactMapControls>

export const Playground: Story = {}
