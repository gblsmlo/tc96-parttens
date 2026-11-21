import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Group } from '@tc96/ui/group'
import { Input } from '@tc96/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { Kbd } from '@tc96/ui/kbd'
import { Spinner } from '@tc96/ui/spinner'
import { expect, within } from 'storybook/test'
import { InputCanvas } from './input-frame.tsx'
import {
  CharacterCounterInput,
  CharactersRemainingInput,
  ClearButtonInput,
  EmailForm,
  PasswordStrengthInput,
  PasswordVisibilityInput,
} from './input-layouts.tsx'

const meta = {
  decorators: [InputCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Input/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EmailSignUp: Story = {
  render: () => <EmailForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toBeRequired()
    await expect(canvas.getByRole('button', { name: 'Submit' })).toBeVisible()
  },
}

export const Newsletter: Story = {
  render: () => (
    <Group aria-label="Email subscription" className="w-full gap-2">
      <Input
        aria-label="Email"
        className="flex-1"
        placeholder="you@example.com"
        type="email"
      />
      <div>
        <Button type="button" variant="outline">
          Send
        </Button>
      </div>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Email subscription',
    })
    await expect(
      within(group).getByRole('textbox', { name: 'Email' }),
    ).toBeVisible()
    await expect(
      within(group).getByRole('button', { name: 'Send' }),
    ).toBeVisible()
  },
}

export const KeyboardShortcut: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search…"
        type="search"
      />
      <InputGroupAddon align="inline-end">
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('searchbox', { name: 'Search' }),
    ).toBeVisible()
    await expect(canvas.getByText('/')).toBeVisible()
  },
}

export const LoadingSpinner: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Search orders"
        defaultValue="Invoice 2041"
        disabled
        placeholder="Search orders…"
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

export const CharacterCounter: Story = {
  render: () => <CharacterCounterInput />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      '0/14',
    )
  },
}

export const CharactersRemaining: Story = {
  render: () => <CharactersRemainingInput />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Code' }),
    ).toHaveAccessibleDescription('14 characters left')
  },
}

export const PasswordVisibility: Story = {
  render: () => <PasswordVisibilityInput />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Show password' }),
    ).toBeVisible()
  },
}

export const ClearButton: Story = {
  render: () => <ClearButtonInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'City' })).toHaveValue(
      'Lisbon',
    )
    await expect(
      canvas.getByRole('button', { name: 'Clear city' }),
    ).toBeVisible()
  },
}

export const PasswordStrength: Story = {
  render: () => <PasswordStrengthInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('progressbar', { name: 'Password strength' }),
    ).toHaveAttribute('aria-valuenow', '0')
    await expect(
      within(
        canvas.getByRole('list', { name: 'Password requirements' }),
      ).getAllByRole('listitem'),
    ).toHaveLength(4)
  },
}
