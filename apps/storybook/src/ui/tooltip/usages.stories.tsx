import {
  CloudCheckIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { Kbd } from '@tc96/ui/kbd'
import { Toggle } from '@tc96/ui/toggle'
import { Toolbar, ToolbarButton } from '@tc96/ui/toolbar'
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from '@tc96/ui/tooltip'
import { expect, screen, within } from 'storybook/test'
import { TooltipFrame } from './tooltip-frame.tsx'

const meta = {
  decorators: [TooltipFrame],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Tooltip/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const formattingActions = [
  { icon: TextBIcon, label: 'Bold', shortcut: '⌘B' },
  { icon: TextItalicIcon, label: 'Italic', shortcut: '⌘I' },
  { icon: TextUnderlineIcon, label: 'Underline', shortcut: '⌘U' },
] as const

export const FormattingToolbar: Story = {
  render: () => (
    <TooltipProvider>
      <Toolbar aria-label="Text formatting">
        {formattingActions.map(({ icon: Icon, label, shortcut }, index) => (
          <Tooltip defaultOpen={index === 0} key={label}>
            <TooltipTrigger
              render={<ToolbarButton render={<Toggle aria-label={label} />} />}
            >
              <Icon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipPopup>
              <span className="flex items-center gap-2">
                {label}
                <Kbd>{shortcut}</Kbd>
              </span>
            </TooltipPopup>
          </Tooltip>
        ))}
      </Toolbar>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Text formatting',
    })
    await expect(
      within(toolbar).getByRole('button', { name: 'Bold' }),
    ).toBeVisible()
    await expect(await screen.findByText('⌘B')).toBeVisible()
  },
}

const members = [
  { initials: 'ML', name: 'Maya Lopes, project lead' },
  { initials: 'RC', name: 'Rui Costa, designer' },
  { initials: 'AS', name: 'Ana Silva, engineer' },
] as const

export const ProjectMembers: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      {members.map(({ initials, name }, index) => (
        <Tooltip defaultOpen={index === 0} key={initials}>
          <TooltipTrigger aria-label={name} className="rounded-full">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipPopup>{name}</TooltipPopup>
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Maya Lopes, project lead',
      }),
    ).toBeVisible()
    await expect(
      await screen.findByText('Maya Lopes, project lead'),
    ).toBeVisible()
  },
}

export const SaveStatus: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Q3 budget review</span>
      <Tooltip defaultOpen>
        <TooltipTrigger
          render={<Button aria-label="Saved" size="icon-sm" variant="ghost" />}
        >
          <CloudCheckIcon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipPopup side="bottom">
          Saved 2 minutes ago by Maya Lopes
        </TooltipPopup>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Saved' }),
    ).toBeVisible()
    await expect(
      await screen.findByText('Saved 2 minutes ago by Maya Lopes'),
    ).toBeVisible()
  },
}
