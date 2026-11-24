import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Onboarding2Controls,
  onboarding2ControlArgs,
  onboarding2ControlArgTypes,
} from './onboarding-2-controls.ts'
import { ComposedOnboarding2 } from './onboarding-2-layouts.tsx'

const meta = {
  args: {
    ...onboarding2ControlArgs,
    onComplete: fn(),
    onFinish: fn(),
    onSkip: fn(),
    onStepChange: fn(),
  },
  argTypes: onboarding2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedOnboarding2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding2/Playground',
} satisfies Meta<
  Onboarding2Controls & {
    onComplete: () => void
    onFinish: () => void
    onSkip: (stepId: string) => void
    onStepChange: (id: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
