import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import {
  Button,
  Group,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Kbd,
  Spinner,
} from 'tc96/ui'

const meta = {
  title: 'UI/Input/Patterns',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const maxLength = 14

function PatternFrame({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return <div className="w-80">{children}</div>
}

function CharacterCounterPattern(): React.ReactElement {
  const [value, setValue] = useState('')

  return (
    <PatternFrame>
      <InputGroup>
        <InputGroupInput
          aria-label="Username"
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter username"
          type="text"
          value={value}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText aria-live="polite" className="text-xs tabular-nums" role="status">
            {value.length}/{maxLength}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </PatternFrame>
  )
}

function CharactersRemainingPattern(): React.ReactElement {
  const [value, setValue] = useState('')

  return (
    <PatternFrame>
      <div className="flex flex-col gap-1.5">
        <Input
          aria-describedby="code-description"
          aria-label="Code"
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter code"
          type="text"
          value={value}
        />
        <p className="text-muted-foreground text-sm" id="code-description">
          <span className="tabular-nums">{maxLength - value.length}</span> characters left
        </p>
      </div>
    </PatternFrame>
  )
}

function PasswordVisibilityPattern(): React.ReactElement {
  const [visible, setVisible] = useState(false)

  return (
    <PatternFrame>
      <InputGroup>
        <InputGroupInput
          aria-label="Password with toggle visibility"
          placeholder="Enter your password"
          type={visible ? 'text' : 'password'}
        />
        <InputGroupAddon align="inline-end">
          <Button
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((current) => !current)}
            size="sm"
            title={visible ? 'Hide password' : 'Show password'}
            type="button"
            variant="ghost"
          >
            {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </PatternFrame>
  )
}

function ClearButtonPattern(): React.ReactElement {
  const [value, setValue] = useState('Clear me')

  return (
    <PatternFrame>
      <InputGroup>
        <InputGroupInput
          aria-label="Text input with clear button"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter text"
          type="text"
          value={value}
        />
        {value ? (
          <InputGroupAddon align="inline-end">
            <Button
              aria-label="Clear input"
              onClick={() => setValue('')}
              size="sm"
              type="button"
              variant="ghost"
            >
              <XIcon aria-hidden />
            </Button>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </PatternFrame>
  )
}

const passwordRequirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
] as const

function getStrengthLabel(score: number): string {
  if (score === 0) return 'Enter a password'
  if (score <= 2) return 'Weak password'
  if (score === 3) return 'Medium password'
  return 'Strong password'
}

function getStrengthColor(score: number): string {
  if (score === 0) return 'bg-border'
  if (score <= 1) return 'bg-red-500'
  if (score <= 2) return 'bg-orange-500'
  if (score === 3) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function PasswordStrengthPattern(): React.ReactElement {
  const id = useId()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const requirements = passwordRequirements.map((requirement) => ({
    ...requirement,
    met: requirement.regex.test(password),
  }))
  const score = requirements.filter((requirement) => requirement.met).length

  return (
    <PatternFrame>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm" htmlFor={id}>
            Password
          </label>
          <InputGroup>
            <InputGroupInput
              aria-describedby={`${id}-description`}
              id={id}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type={visible ? 'text' : 'password'}
              value={password}
            />
            <InputGroupAddon align="inline-end">
              <Button
                aria-label={visible ? 'Hide password' : 'Show password'}
                onClick={() => setVisible((current) => !current)}
                size="sm"
                type="button"
                variant="ghost"
              >
                {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div
          aria-label="Password strength"
          aria-valuemax={4}
          aria-valuemin={0}
          aria-valuenow={score}
          className="h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          tabIndex={-1}
        >
          <div
            className={`h-full ${getStrengthColor(score)} transition-all duration-500 ease-out`}
            style={{ width: `${(score / 4) * 100}%` }}
          />
        </div>

        <p className="font-medium text-foreground text-sm" id={`${id}-description`}>
          {getStrengthLabel(score)}. Must contain:
        </p>

        <ul aria-label="Password requirements" className="flex flex-col gap-1.5">
          {requirements.map((requirement) => (
            <li className="flex items-center gap-2" key={requirement.text}>
              {requirement.met ? (
                <CheckIcon aria-hidden className="size-4 text-emerald-500" />
              ) : (
                <XIcon aria-hidden className="size-4 text-muted-foreground/80" />
              )}
              <span
                className={`text-xs ${
                  requirement.met ? 'text-emerald-600' : 'text-muted-foreground'
                }`}
              >
                {requirement.text}
                <span className="sr-only">
                  {requirement.met ? ' - Requirement met' : ' - Requirement not met'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PatternFrame>
  )
}

export const KeyboardShortcut: Story = {
  render: () => (
    <PatternFrame>
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search…" type="search" />
        <InputGroupAddon align="inline-end">
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </PatternFrame>
  ),
}

export const EndLoadingSpinner: Story = {
  render: () => (
    <PatternFrame>
      <InputGroup>
        <InputGroupInput aria-label="Processing" disabled placeholder="Processing…" type="search" />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </PatternFrame>
  ),
}

export const CharacterCounter: Story = {
  render: () => <CharacterCounterPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Username' }), 'tc96')
    await expect(canvas.getByRole('status')).toHaveTextContent('4/14')
  },
}

export const WithButtonUsingGroup: Story = {
  render: () => (
    <PatternFrame>
      <Group aria-label="Email subscription" className="w-full gap-2">
        <Input aria-label="Email" className="flex-1" placeholder="you@example.com" type="email" />
        <div>
          <Button size="md" type="button" variant="outline">
            Send
          </Button>
        </div>
      </Group>
    </PatternFrame>
  ),
}

export const CharactersRemainingCounter: Story = {
  render: () => <CharactersRemainingPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Code' }), 'tc96')
    await expect(canvas.getByText('10')).toBeInTheDocument()
  },
}

export const PasswordToggleVisibility: Story = {
  render: () => <PasswordVisibilityPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Password with toggle visibility')
    await expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }))
    await expect(input).toHaveAttribute('type', 'text')
  },
}

export const ClearButton: Story = {
  render: () => <ClearButtonPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Text input with clear button' })
    await userEvent.click(canvas.getByRole('button', { name: 'Clear input' }))
    await expect(input).toHaveValue('')
  },
}

export const PasswordStrengthIndicator: Story = {
  render: () => <PasswordStrengthPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Password'), 'Tc96pass')
    await expect(canvas.getByRole('progressbar', { name: 'Password strength' })).toHaveAttribute(
      'aria-valuenow',
      '4',
    )
    await expect(canvas.getByText(/Strong password/)).toBeInTheDocument()
  },
}
