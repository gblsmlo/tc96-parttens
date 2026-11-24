import { ChatIcon, GitForkIcon, StarIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from '@tc96/ui/preview-card'
import { expect, screen, within } from 'storybook/test'
import { previewCardLinkClassName } from './preview-card-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/PreviewCard/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const MemberMention: Story = {
  render: () => (
    <p className="max-w-sm text-sm">
      Thanks{' '}
      <PreviewCard defaultOpen>
        <PreviewCardTrigger
          className={previewCardLinkClassName}
          href="#members/maya-lopes"
        >
          @Maya Lopes
        </PreviewCardTrigger>
        <PreviewCardPopup align="start">
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-medium">Maya Lopes</p>
              <p className="text-muted-foreground">
                Data engineer on the Platform team
              </p>
              <p className="text-muted-foreground text-xs">
                Lisbon · Member since March 2024
              </p>
            </div>
          </div>
        </PreviewCardPopup>
      </PreviewCard>
      , the nightly export now finishes before the morning reports run.
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: '@Maya Lopes' }),
    ).toBeVisible()
    await expect(
      await screen.findByText('Data engineer on the Platform team'),
    ).toBeVisible()
  },
}

export const RepositoryLink: Story = {
  render: () => (
    <p className="max-w-sm text-sm">
      The colors come from{' '}
      <PreviewCard defaultOpen>
        <PreviewCardTrigger
          className={previewCardLinkClassName}
          href="#repositories/acme/design-tokens"
        >
          acme/design-tokens
        </PreviewCardTrigger>
        <PreviewCardPopup className="w-72">
          <div className="flex flex-col gap-2">
            <p className="font-medium">acme/design-tokens</p>
            <p className="text-muted-foreground">
              Color, spacing and type tokens for every Acme product, exported to
              CSS variables and JSON.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground text-xs">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-info"
                />
                TypeScript
              </span>
              <span className="flex items-center gap-1">
                <StarIcon aria-hidden="true" className="size-3.5" />
                1.2k stars
              </span>
              <span className="flex items-center gap-1">
                <GitForkIcon aria-hidden="true" className="size-3.5" />
                86 forks
              </span>
            </div>
          </div>
        </PreviewCardPopup>
      </PreviewCard>
      , so update them there first.
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'acme/design-tokens' }),
    ).toBeVisible()
    await expect(await screen.findByText('1.2k stars')).toBeVisible()
  },
}

export const IssueReference: Story = {
  render: () => (
    <p className="max-w-sm text-sm">
      This release fixes{' '}
      <PreviewCard defaultOpen>
        <PreviewCardTrigger
          className={previewCardLinkClassName}
          href="#issues/482"
        >
          #482
        </PreviewCardTrigger>
        <PreviewCardPopup align="start" className="w-80">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="success">Open</Badge>
              <span className="text-muted-foreground text-xs">#482</span>
            </div>
            <p className="font-medium">
              Checkout fails on Safari 17 when the address has an apartment
              number
            </p>
            <p className="flex items-center gap-1 text-muted-foreground text-xs">
              Opened by Rui Costa 3 days ago ·
              <ChatIcon aria-hidden="true" className="size-3.5" />4 comments
            </p>
          </div>
        </PreviewCardPopup>
      </PreviewCard>{' '}
      and two smaller layout issues on the order page.
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: '#482' }),
    ).toBeVisible()
    await expect(
      await screen.findByText(/Checkout fails on Safari 17/),
    ).toBeVisible()
  },
}
