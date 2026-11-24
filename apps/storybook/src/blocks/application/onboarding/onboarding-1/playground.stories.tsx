import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Onboarding1Controls,
  onboarding1ControlArgs,
  onboarding1ControlArgTypes,
} from './onboarding-1-controls.ts'
import { ComposedOnboarding1 } from './onboarding-1-layouts.tsx'

const meta = {
  args: {
    ...onboarding1ControlArgs,
    onComplete: fn(),
    onFinish: fn(),
    onSkip: fn(),
    onStepChange: fn(),
  },
  argTypes: onboarding1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedOnboarding1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding1/Playground',
} satisfies Meta<
  Onboarding1Controls & {
    onComplete: () => void
    onFinish: () => void
    onSkip: (stepId: string) => void
    onStepChange: (id: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
