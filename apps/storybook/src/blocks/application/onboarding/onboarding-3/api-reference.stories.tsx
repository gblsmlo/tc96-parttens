import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { StatefulOnboarding3 } from '../fixtures/onboarding-3.tsx'

const meta = {
  args: { onComplete: fn(), onFinish: fn(), onSkip: fn(), onStepChange: fn() },
  component: StatefulOnboarding3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Onboarding/Onboarding3/API Reference',
} satisfies Meta<typeof StatefulOnboarding3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
