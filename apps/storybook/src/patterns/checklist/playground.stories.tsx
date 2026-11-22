import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChecklistCanvas } from './checklist-canvas.tsx'
import {
  type ChecklistControls,
  checklistControlArgs,
  checklistControlArgTypes,
} from './checklist-controls.ts'
import { ComposedChecklist } from './checklist-layouts.tsx'

const meta = {
  args: checklistControlArgs,
  argTypes: checklistControlArgTypes,
  decorators: [ChecklistCanvas],
  render: (args) => <ComposedChecklist {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Checklist/Playground',
} satisfies Meta<ChecklistControls>

export default meta

type Story = StoryObj<ChecklistControls>

export const Playground: Story = {}
