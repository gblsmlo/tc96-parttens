import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar11 } from '@tc96/ui/blocks/application/navbar/navbar-11'
import { fn } from 'storybook/test'
import {
  brandName,
  sections,
  sources,
  user,
  version,
} from '../fixtures/navbar-11.ts'
import { brandMark, renderUserMenu } from './navbar-11-layouts.tsx'

const meta = {
  args: {
    logo: brandMark,
    menu: renderUserMenu(fn()),
    name: brandName,
    onSectionChange: fn(),
    onSourceChange: fn(),
    section: 'tokens',
    sections,
    source: 'shadcn',
    sources,
    user,
    version,
  },
  component: Navbar11,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar11/API Reference',
} satisfies Meta<typeof Navbar11>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
