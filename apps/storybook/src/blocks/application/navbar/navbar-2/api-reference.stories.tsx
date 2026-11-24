import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar2 } from '@tc96/ui/blocks/application/navbar/navbar-2'
import { environments, organizations, projects } from '../fixtures/navbar-2.ts'

const meta = {
  args: {
    environmentId: 'staging',
    environments,
    onEnvironmentChange: () => {},
    onOrgChange: () => {},
    onProjectChange: () => {},
    organizationId: 'acme',
    organizations,
    projectId: 'checkout',
    projects,
  },
  component: Navbar2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar2/API Reference',
} satisfies Meta<typeof Navbar2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
