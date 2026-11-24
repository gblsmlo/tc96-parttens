import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { StatefulOnboarding1 } from '../fixtures/onboarding-1.tsx'

const meta = {
  args: { onComplete: fn(), onFinish: fn(), onSkip: fn(), onStepChange: fn() },
  component: StatefulOnboarding1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Onboarding/Onboarding1/API Reference',
} satisfies Meta<typeof StatefulOnboarding1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
