import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type StepLibraryControls,
  stepLibraryControlArgs,
  stepLibraryControlArgTypes,
} from './step-library-controls.ts'
import { EditorFrame } from './step-library-frame.tsx'
import { ComposedStepLibrary } from './step-library-layouts.tsx'

const meta = {
  args: stepLibraryControlArgs,
  argTypes: stepLibraryControlArgTypes,
  decorators: [EditorFrame],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStepLibrary {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Playground',
} satisfies Meta<StepLibraryControls>

export default meta

type Story = StoryObj<StepLibraryControls>

export const Playground: Story = {}
