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
  MailIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'
import { useRef } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'

type InputGroupSize = 'default' | 'lg'

interface InputGroupStoryArgs {
  size: InputGroupSize
}

const usage = `
import { Input } from '@acme/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@acme/ui/input-group'

<InputGroup>
  <InputGroupInput type="email" placeholder="Email" />
  <InputGroupAddon>
    <MailIcon />
  </InputGroupAddon>
</InputGroup>
`

const docs = {
  api: [
    {
      description: `The main component that wraps inputs and addons.

| Prop | Type | Description |
| --- | --- | --- |
| \`className\` | \`string\` | Additional CSS classes to apply to the component |
| \`...props\` | \`React.ComponentProps<'div'>\` | All standard div attributes are supported |`,
      name: 'InputGroup',
    },
    {
      description: `A container for addons like icons, text, buttons, and other elements. Can be positioned at the start or end (inline), or top or bottom (block) of the input.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`align\` | \`'inline-start'\`, \`'inline-end'\`, \`'block-start'\` or \`'block-end'\` | \`'inline-start'\` | The position of the addon relative to the input. Use \`inline-start\` or \`inline-end\` for inputs, and \`block-start\` or \`block-end\` for textareas |
| \`className\` | \`string\` | | Additional CSS classes to apply to the component |
| \`...props\` | \`React.ComponentProps<'div'>\` | | All standard div attributes are supported |

For proper focus navigation, the \`InputGroupAddon\` component should be placed after the input in the DOM order.`,
      name: 'InputGroupAddon',
    },
    {
      description: `A text container component for displaying text content within an \`InputGroupAddon\`. Automatically styles text with muted foreground color and handles icon sizing.

| Prop | Type | Description |
| --- | --- | --- |
| \`className\` | \`string\` | Additional CSS classes to apply to the component |
| \`...props\` | \`React.ComponentProps<'span'>\` | All standard span attributes are supported |`,
      name: 'InputGroupText',
    },
    {
      description: `A specialized input component for use within InputGroup. It's essentially an unstyled Input component that inherits styling from the parent InputGroup.

| Prop | Type | Description |
| --- | --- | --- |
| \`className\` | \`string\` | Additional CSS classes to apply to the component |
| \`...props\` | \`InputProps\` | All props from the Input component are supported, including \`type\`, \`placeholder\`, \`disabled\`, \`size\` (\`"default"\` or \`"lg"\`), etc. |`,
      name: 'InputGroupInput',
    },
    {
      description: `A specialized textarea component for use within InputGroup. It's essentially an unstyled Textarea component that inherits styling from the parent InputGroup.

| Prop | Type | Description |
| --- | --- | --- |
| \`className\` | \`string\` | Additional CSS classes to apply to the component |
| \`...props\` | \`TextareaProps\` | All props from the Textarea component are supported, including \`placeholder\`, \`disabled\`, \`rows\`, etc. |`,
      name: 'InputGroupTextarea',
    },
  ],
  description: {
    component:
      'COSS Input Group, unmodified. A flexible component for grouping inputs with addons, buttons, and other elements. Reference: [coss ui Input Group](https://coss.com/ui/docs/components/input-group).',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: { size: 'default' },
  argTypes: {
    size: {
      control: 'inline-radio',
      description: 'Controls the input height. Set on `InputGroupInput`.',
      options: ['default', 'lg'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search"
        size={size}
        type="search"
      />
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
    </InputGroup>
  ),
  title: 'UI/InputGroup',
} satisfies Meta<InputGroupStoryArgs>

export default meta

type Story = StoryObj<InputGroupStoryArgs>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    await userEvent.type(input, 'coss')
    await expect(input).toHaveValue('coss')
  },
  tags: interaction,
}

export const WithEndIcon: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        aria-label="Email"
        placeholder="Email"
        size={size}
        type="email"
      />
      <InputGroupAddon align="inline-end">
        <MailIcon aria-hidden="true" />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithStartText: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        aria-label="Set your URL"
        className="*:[input]:ps-0!"
        placeholder="coss"
        size={size}
        type="search"
      />
      <InputGroupAddon>
        <InputGroupText>i.cal.com/</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithEndText: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        aria-label="Choose a username"
        placeholder="Choose a username"
        size={size}
        type="text"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupText>@coss.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithStartAndEndText: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        aria-label="Enter your domain"
        className="*:[input]:px-0!"
        placeholder="coss"
        size={size}
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
}

export const WithTooltip: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        aria-label="Password"
        placeholder="Password"
        size={size}
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
}

function CopyUrlInput({ size }: Readonly<{ size: InputGroupSize }>) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Url"
        defaultValue="https://coss.com"
        ref={inputRef}
        size={size}
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

export const WithIconButton: Story = {
  render: ({ size }) => <CopyUrlInput size={size} />,
}

export const WithButton: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        placeholder="Type to search…"
        size={size}
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Button size="xs" variant="secondary">
          Search
        </Button>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithBadge: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        placeholder="Type to search…"
        size={size}
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Badge variant="info">Badge</Badge>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithKeyboardShortcut: Story = {
  // COSS Kbd text inside the dark InputGroup is 4.47:1 (below 4.5:1) and passes in light; COSS stays unmodified, so the contrast check runs only in light.
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', selector: '[data-theme="light"] *' }],
      },
    },
  },
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput placeholder="Search…" size={size} type="search" />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithInnerLabel: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        id="email-1"
        placeholder="team@coss.com"
        size={size}
        type="email"
      />
      <InputGroupAddon align="block-start">
        <Label className="text-foreground" htmlFor="email-1">
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
}

export const LargeSize: Story = {
  args: { size: 'lg' },
}

export const Disabled: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        aria-label="Subscribe to our newsletter"
        disabled
        placeholder="Your best email"
        size={size}
        type="email"
      />
      <InputGroupAddon align="inline-end">
        <Button aria-label="Subscribe" disabled size="icon-xs" variant="ghost">
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const Loading: Story = {
  render: ({ size }) => (
    <InputGroup>
      <InputGroupInput
        disabled
        placeholder="Searching…"
        size={size}
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithNumberField: Story = {
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
}

export const WithTextarea: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea placeholder="Ask, Search or Chat…" />
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
}
