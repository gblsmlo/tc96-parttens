import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImpactMap } from '@tc96/ui/blocks/ai-agents/flow/impact-map'
import { fn } from 'storybook/test'
import { links, nodes } from '../fixtures/impact-map.ts'

const meta = {
  args: {
    links,
    nodes,
    onNodeSelect: fn(),
    onRetry: fn(),
    selectedId: 'onboarding',
  },
  component: ImpactMap,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/AI & Agents/Flow/ImpactMap/API Reference',
} satisfies Meta<typeof ImpactMap>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
