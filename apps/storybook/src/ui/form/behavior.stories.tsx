import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form, type FormPrimitive } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { useRef } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { formControlArgs } from './form-controls.ts'
import { FormCanvas } from './form-frame.tsx'
import {
  ComposedForm,
  NewProjectForm,
  SeveralFieldsForm,
} from './form-layouts.tsx'

interface BehaviorArgs {
  onFormSubmit: (
    values: Record<string, unknown>,
    details: FormPrimitive.SubmitEventDetails,
  ) => void
  onSubmit: (values: Record<string, FormDataEntryValue>) => void
}

const ValidateActionForm = ({
  onFormSubmit,
}: Readonly<Pick<BehaviorArgs, 'onFormSubmit'>>) => {
  const actionsRef = useRef<FormPrimitive.Actions>(null)

  return (
    <div className="flex flex-col gap-4">
      <Form
        actionsRef={actionsRef}
        className="flex flex-col gap-4"
        onFormSubmit={onFormSubmit}
      >
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <Input required type="email" />
          <FieldError>Enter a valid email address.</FieldError>
        </Field>
      </Form>
      <Button
        onClick={() => actionsRef.current?.validate('email')}
        variant="outline"
      >
        Check email
      </Button>
    </div>
  )
}

const meta = {
  args: { onFormSubmit: fn(), onSubmit: fn() },
  argTypes: {
    onFormSubmit: { control: false },
    onSubmit: { control: false },
  },
  decorators: [FormCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Form/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const NoLayoutOfItsOwn: Story = {
  render: () => (
    <Form aria-label="Contact">
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" />
      </Field>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', { name: 'Contact' })
    await expect(form.tagName).toBe('FORM')
    await expect(form).not.toHaveAttribute('class')
    await expect(getComputedStyle(form).display).toBe('block')
  },
}

export const BlocksInvalidSubmit: Story = {
  render: ({ onFormSubmit }) => (
    <ComposedForm {...formControlArgs} onFormSubmit={onFormSubmit} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvasElement.querySelector('form')
    await expect(form).toHaveAttribute('novalidate')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(args.onFormSubmit).not.toHaveBeenCalled()
    await expect(
      canvas.getByRole('textbox', { name: 'Email' }),
    ).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
  },
}

export const FocusesFirstInvalidField: Story = {
  render: ({ onFormSubmit }) => (
    <SeveralFieldsForm onFormSubmit={onFormSubmit} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const name = canvas.getByRole('textbox', { name: 'Name' })
    const email = canvas.getByRole('textbox', { name: 'Email' })
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(args.onFormSubmit).not.toHaveBeenCalled()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveFocus()
  },
}

export const SubmitsValuesByName: Story = {
  render: ({ onFormSubmit }) => (
    <SeveralFieldsForm onFormSubmit={onFormSubmit} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Name' }),
      'Ada Lovelace',
    )
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Email' }),
      'ada@example.com',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(args.onFormSubmit).toHaveBeenCalledOnce()
    await expect(args.onFormSubmit).toHaveBeenCalledWith(
      { email: 'ada@example.com', name: 'Ada Lovelace' },
      expect.objectContaining({ reason: 'none' }),
    )
  },
}

export const CallsOnSubmitWhenValid: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(Object.fromEntries(new FormData(event.currentTarget)))
      }}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input required type="email" />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Submit' })
    await userEvent.click(submit)
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Email' }),
      'ada@example.com',
    )
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'ada@example.com',
    })
  },
}

export const ShowsErrorsUntilChanged: Story = {
  render: () => (
    <ComposedForm
      {...formControlArgs}
      errors="This email is already registered."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await expect(
      canvas.getByText('This email is already registered.'),
    ).toBeVisible()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await userEvent.type(input, 'ada@example.com')
    await waitFor(() =>
      expect(
        canvas.queryByText('This email is already registered.'),
      ).toBeNull(),
    )
    await expect(input).not.toHaveAttribute('aria-invalid')
  },
}

export const ErrorChildrenReplaceErrors: Story = {
  render: () => (
    <Form
      className="flex flex-col gap-4"
      errors={{ email: 'This email is already registered.' }}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input required type="email" />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
    await expect(
      canvas.queryByText('This email is already registered.'),
    ).toBeNull()
  },
}

export const FocusesFieldWithReturnedError: Story = {
  render: ({ onFormSubmit }) => <NewProjectForm onFormSubmit={onFormSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Project name' }),
      'Website redesign',
    )
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Budget (USD)' }),
      '0',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create project' }),
    )
    await expect(
      await canvas.findByText('Enter a budget above zero.'),
    ).toBeVisible()
    await waitFor(() =>
      expect(
        canvas.getByRole('textbox', { name: 'Budget (USD)' }),
      ).toHaveFocus(),
    )
    await expect(args.onFormSubmit).not.toHaveBeenCalled()
  },
}

export const ValidatesOnSubmitByDefault: Story = {
  render: () => <ComposedForm {...formControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await userEvent.type(input, 'ada')
    await userEvent.tab()
    await expect(canvas.queryByText('Enter a valid email address.')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
    await userEvent.type(input, '@example.com')
    await waitFor(() =>
      expect(canvas.queryByText('Enter a valid email address.')).toBeNull(),
    )
  },
}

export const ValidatesOnBlur: Story = {
  render: ({ onFormSubmit }) => (
    <ComposedForm
      {...formControlArgs}
      onFormSubmit={onFormSubmit}
      validationMode="onBlur"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'ada')
    await expect(canvas.queryByText('Enter a valid email address.')).toBeNull()
    await userEvent.tab()
    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
    await expect(args.onFormSubmit).not.toHaveBeenCalled()
  },
}

export const ValidatesOnChange: Story = {
  render: () => <ComposedForm {...formControlArgs} validationMode="onChange" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await userEvent.type(input, 'ada')
    await expect(input).toHaveFocus()
    await expect(
      await canvas.findByText('Enter a valid email address.'),
    ).toBeVisible()
    await userEvent.type(input, '@example.com')
    await waitFor(() =>
      expect(canvas.queryByText('Enter a valid email address.')).toBeNull(),
    )
  },
}

export const ValidatesThroughActionsRef: Story = {
  render: ({ onFormSubmit }) => (
    <ValidateActionForm onFormSubmit={onFormSubmit} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Enter a valid email address.')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Check email' }))
    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
    await expect(args.onFormSubmit).not.toHaveBeenCalled()
  },
}
