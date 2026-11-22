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
  parameters: {
    controls: {
      exclude: ['collapsed', 'disabled', 'empty', 'loading', 'run'],
    },
    layout: 'padded',
  },
  render: (args) => <ComposedStepLibrary {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Stories',
} satisfies Meta<StepLibraryControls>

export default meta

type Story = StoryObj<StepLibraryControls>

export const Default: Story = {}

export const Collapsed: Story = {
  args: { collapsed: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}

export const RunSucceeded: Story = {
  args: { run: 'success' },
}

export const RunNotRun: Story = {
  args: { run: 'not-run' },
}
