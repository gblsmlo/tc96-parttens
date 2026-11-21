import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { useCopyToClipboard } from '@tc96/ui/hooks/use-copy-to-clipboard'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@tc96/ui/input-group'
import { Kbd } from '@tc96/ui/kbd'
import { Label } from '@tc96/ui/label'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { NumberField, NumberFieldInput } from '@tc96/ui/number-field'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { Spinner } from '@tc96/ui/spinner'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CopyIcon,
  InfoIcon,
  PlusIcon,
} from 'lucide-react'
import { useRef } from 'react'
import { expect, within } from 'storybook/test'
import { InputGroupCanvas } from './input-group-frame.tsx'

const meta = {
  decorators: [InputGroupCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/InputGroup/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ProfileUrl: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Profile URL"
        className="*:[input]:ps-0!"
        defaultValue="ada-lovelace"
        type="text"
      />
      <InputGroupAddon>
        <InputGroupText>cal.com/</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('cal.com/')).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: 'Profile URL' }),
    ).toHaveValue('ada-lovelace')
  },
}

export const Username: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Choose a username"
        placeholder="Choose a username"
        type="text"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupText>@acme.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('@acme.com')).toBeVisible()
  },
}

export const CustomDomain: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Enter your domain"
        className="*:[input]:px-0!"
        placeholder="acme"
        type="text"
      />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('https://')).toBeVisible()
    await expect(canvas.getByText('.com')).toBeVisible()
  },
}

export const PasswordRequirements: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Password"
        placeholder="Password"
        type="password"
      />
      <InputGroupAddon align="inline-end">
        <Popover>
          <PopoverTrigger
            openOnHover
            render={
              <Button
                aria-label="Password requirements"
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <InfoIcon />
          </PopoverTrigger>
          <PopoverPopup side="top" tooltipStyle>
            <p>Min. 8 characters</p>
          </PopoverPopup>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Password requirements',
      }),
    ).toBeVisible()
  },
}

const CopyLinkInputGroup = () => {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Invite link"
        defaultValue="https://acme.com/invite/7Hk2"
        readOnly
        ref={inputRef}
        type="text"
      />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Copy"
                onClick={() => {
                  if (inputRef.current) {
                    copyToClipboard(inputRef.current.value)
                  }
                }}
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </TooltipTrigger>
          <TooltipPopup>
            <p>Copy to clipboard</p>
          </TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  )
}

export const CopyLink: Story = {
  render: () => <CopyLinkInputGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Invite link' }),
    ).toHaveValue('https://acme.com/invite/7Hk2')
    await expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible()
  },
}

export const SiteSearch: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Search the help center"
        placeholder="Search the help center…"
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Button size="xs" variant="secondary">
          Search
        </Button>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Search' }),
    ).toBeVisible()
  },
}

export const SearchScope: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Search the docs"
        placeholder="Search the docs…"
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Badge variant="info">v2.4</Badge>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('v2.4')).toBeVisible()
  },
}

export const CommandShortcut: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector:
              '*:not([data-theme="dark"] [data-slot="input-group-addon"] kbd)',
          },
        ],
      },
    },
  },
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Search commands"
        placeholder="Search commands…"
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('⌘K')).toBeVisible()
  },
}

export const NotificationEmail: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        id="input-group-notification-email"
        placeholder="team@acme.com"
        type="email"
      />
      <InputGroupAddon align="block-start">
        <Label
          className="text-foreground"
          htmlFor="input-group-notification-email"
        >
          Email
        </Label>
        <Popover>
          <PopoverTrigger
            className="ml-auto"
            openOnHover
            render={
              <Button
                aria-label="Email usage"
                className="-m-1"
                size="icon-xs"
                variant="ghost"
              />
            }
          >
            <InfoIcon />
          </PopoverTrigger>
          <PopoverPopup side="top" tooltipStyle>
            <p>We&apos;ll use this to send you notifications</p>
          </PopoverPopup>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Email' }),
    ).toBeVisible()
  },
}

export const NewsletterClosed: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Subscribe to our newsletter"
        disabled
        placeholder="Your best email"
        type="email"
      />
      <InputGroupAddon align="inline-end">
        <Button aria-label="Subscribe" disabled size="icon-xs" variant="ghost">
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Subscribe' }),
    ).toBeDisabled()
  },
}

export const Searching: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Search orders"
        defaultValue="Invoice 2041"
        disabled
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('searchbox', { name: 'Search orders' }),
    ).toBeDisabled()
  },
}

export const Amount: Story = {
  render: () => (
    <InputGroup>
      <NumberField defaultValue={10}>
        <NumberFieldInput aria-label="Enter the amount" className="text-left" />
      </NumberField>
      <InputGroupAddon>
        <InputGroupText>€</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>EUR</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Enter the amount' }),
    ).toHaveValue('10')
    await expect(canvas.getByText('EUR')).toBeVisible()
  },
}

export const ChatComposer: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea
        aria-label="Message"
        placeholder="Ask, Search or Chat…"
      />
      <InputGroupAddon align="block-end">
        <Menu>
          <Tooltip>
            <TooltipTrigger
              render={
                <MenuTrigger
                  render={
                    <Button
                      aria-label="Add files"
                      className="rounded-full"
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                >
                  <PlusIcon />
                </MenuTrigger>
              }
            />
            <TooltipPopup>Add files and more</TooltipPopup>
          </Tooltip>
          <MenuPopup align="start">
            <MenuItem>Add photos &amp; files</MenuItem>
            <MenuItem>Create image</MenuItem>
            <MenuItem>Thinking</MenuItem>
            <MenuItem>Deep research</MenuItem>
          </MenuPopup>
        </Menu>
        <InputGroupText className="ml-auto">78% used</InputGroupText>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Send"
                className="rounded-full"
                size="icon-sm"
                variant="default"
              >
                <ArrowUpIcon />
              </Button>
            }
          />
          <TooltipPopup>Send</TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Message' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeVisible()
  },
}
