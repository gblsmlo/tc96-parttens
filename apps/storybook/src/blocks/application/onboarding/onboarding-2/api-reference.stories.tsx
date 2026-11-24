import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { StatefulOnboarding2 } from '../fixtures/onboarding-2.tsx'

const meta = {
  args: { onComplete: fn(), onFinish: fn(), onSkip: fn(), onStepChange: fn() },
  component: StatefulOnboarding2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Onboarding/Onboarding2/API Reference',
} satisfies Meta<typeof StatefulOnboarding2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
