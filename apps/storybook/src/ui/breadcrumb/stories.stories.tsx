import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type BreadcrumbControls,
  breadcrumbControlArgs,
  breadcrumbControlArgTypes,
} from './breadcrumb-controls.ts'
import { ComposedBreadcrumb } from './breadcrumb-layouts.tsx'

const meta = {
  args: breadcrumbControlArgs,
  argTypes: breadcrumbControlArgTypes,
  parameters: {
    controls: { exclude: ['element', 'separator'] },
    layout: 'centered',
  },
  render: (args) => <ComposedBreadcrumb {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Breadcrumb/Stories',
} satisfies Meta<BreadcrumbControls>

export default meta

type Story = StoryObj<BreadcrumbControls>

export const Default: Story = {}
