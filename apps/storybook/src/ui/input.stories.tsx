import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Group } from '@tc96/ui/group'
import { Input, type InputProps } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import { type FormEvent, useId } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'

const onEmailSubmit = fn()

const usage = `
import { Input } from '@acme/ui/input'

<Input />
`

const docs = {
  api: [
    {
      description: `Styled wrapper for \`Input\` from Base UI with custom size options.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`size\` | \`"default"\`, \`"lg"\` or \`number\` | \`"default"\` | Controls the input height. Number values are passed to the native \`size\` attribute |
| \`unstyled\` | \`boolean\` | \`false\` | When true, removes the wrapper styling (border, shadow, etc.) |`,
      name: 'Input',
    },
  ],
  description: {
    component:
      'COSS Input, unmodified. A native input element. For accessible labelling and validation, prefer wrapping it in the `Field` component, or use `FieldControl`. Reference: [coss ui Input](https://coss.com/ui/docs/components/input).',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  title: 'UI/Input',
  component: Input,
  args: {
    'aria-label': 'Enter text',
    placeholder: 'Enter text',
    size: 'default',
    type: 'text',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      description:
        'Controls the input height. Number values are passed to the native `size` attribute.',
      options: ['default', 'lg'],
      table: { defaultValue: { summary: 'default' } },
    },
    unstyled: {
      control: 'boolean',
      description:
        'When true, removes the wrapper styling (border, shadow, etc.).',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {}

export const Editable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Enter text' })
    await userEvent.type(input, 'Lemind')
    await expect(input).toHaveValue('Lemind')
  },
}

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Invalid value',
  },
}

export const LargeSize: Story = {
  args: { size: 'lg' },
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled',
    disabled: true,
    placeholder: 'Disabled',
  },
}

export const File: Story = {
  args: {
    'aria-label': 'File',
    placeholder: undefined,
    type: 'file',
  },
}

function EmailWithLabel({ size }: Readonly<Pick<InputProps, 'size'>>) {
  const id = useId()
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id}>Email</Label>
      <Input
        aria-label="Email"
        id={id}
        placeholder="you@example.com"
        size={size}
        type="email"
      />
    </div>
  )
}

export const WithLabel: Story = {
  render: ({ size }) => <EmailWithLabel size={size} />,
}

export const WithButton: Story = {
  render: ({ size }) => (
    <Group aria-label="Email subscription" className="gap-2">
      <Input
        aria-label="Email"
        className="flex-1"
        placeholder="you@example.com"
        size={size}
        type="email"
      />
      <div>
        <Button variant="outline">Send</Button>
      </div>
    </Group>
  ),
}

function onEmailFormSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  onEmailSubmit(new FormData(event.currentTarget).get('email'))
}

export const FormIntegration: Story = {
  render: ({ size }) => (
    <Form className="flex w-full flex-col gap-4" onSubmit={onEmailFormSubmit}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input
          placeholder="you@example.com"
          required
          size={size}
          type="email"
        />
        <FieldError>Please enter a valid email.</FieldError>
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  ),
}

export const FormIntegrationInteraction: Story = {
  ...FormIntegration,
  play: async ({ canvasElement }) => {
    onEmailSubmit.mockClear()
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    const submit = canvas.getByRole('button', { name: 'Submit' })

    await userEvent.type(input, 'team')
    await userEvent.click(submit)
    await expect(
      await canvas.findByText('Please enter a valid email.'),
    ).toBeVisible()
    await expect(onEmailSubmit).not.toHaveBeenCalled()

    await userEvent.type(input, '@coss.com')
    await userEvent.click(submit)
    await waitFor(() =>
      expect(onEmailSubmit).toHaveBeenCalledWith('team@coss.com'),
    )
  },
  tags: interaction,
}
