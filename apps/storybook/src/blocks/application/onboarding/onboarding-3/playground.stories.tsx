import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Onboarding3Controls,
  onboarding3ControlArgs,
  onboarding3ControlArgTypes,
} from './onboarding-3-controls.ts'
import { ComposedOnboarding3 } from './onboarding-3-layouts.tsx'

const meta = {
  args: {
    ...onboarding3ControlArgs,
    onComplete: fn(),
    onFinish: fn(),
    onSkip: fn(),
    onStepChange: fn(),
  },
  argTypes: onboarding3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedOnboarding3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding3/Playground',
} satisfies Meta<
  Onboarding3Controls & {
    onComplete: () => void
    onFinish: () => void
    onSkip: (stepId: string) => void
    onStepChange: (id: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
