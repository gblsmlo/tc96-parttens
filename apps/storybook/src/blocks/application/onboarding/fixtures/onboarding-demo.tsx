import { type AnyFieldApi, useForm } from '@tanstack/react-form'
import type { OnboardingStep } from '@tc96/ui/blocks/application/onboarding/onboarding-1'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'

export const stepIds = ['profile', 'workspace', 'invite'] as const

export const simpleSteps: OnboardingStep[] = [
  {
    content: <p className="text-sm">Nome, cargo e foto do seu perfil.</p>,
    description: 'Conte quem você é para personalizar a experiência.',
    id: 'profile',
    title: 'Seu perfil',
  },
  {
    content: <p className="text-sm">Nome e endereço do espaço de trabalho.</p>,
    description: 'É onde seu time vai organizar projetos e tarefas.',
    id: 'workspace',
    title: 'Seu espaço de trabalho',
  },
  {
    content: <p className="text-sm">Convide pessoas por e-mail.</p>,
    description: 'Você pode convidar mais pessoas depois.',
    id: 'invite',
    title: 'Convide seu time',
  },
]

const required = (message: string) => (props: { value: string }) =>
  props.value.trim() ? undefined : message

const validEmail = (props: { value: string }) =>
  !props.value.trim() || /^\S+@\S+\.\S+$/.test(props.value.trim())
    ? undefined
    : 'Informe um e-mail válido.'

const rules: Record<string, (props: { value: string }) => string | undefined> =
  {
    invite: validEmail,
    name: required('Informe seu nome.'),
    role: required('Informe seu cargo.'),
    workspace: required('Informe o nome do espaço.'),
  }

const fieldsByStep: Record<string, string[]> = {
  invite: ['invite'],
  profile: ['name', 'role'],
  workspace: ['workspace'],
}

interface FormInputProps {
  field: AnyFieldApi
  label: string
  placeholder?: string
  type?: string
}

function FormInput({
  field,
  label,
  placeholder,
  type = 'text',
}: Readonly<FormInputProps>) {
  const invalid = field.state.meta.errors.length > 0

  return (
    <Field invalid={invalid} name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.currentTarget.value)}
        placeholder={placeholder}
        type={type}
        value={field.state.value}
      />
      <FieldError match={invalid}>
        {field.state.meta.errors.join(' ')}
      </FieldError>
    </Field>
  )
}

export function useOnboardingForm() {
  const form = useForm({
    defaultValues: { invite: '', name: '', role: '', workspace: '' },
  })

  const steps: OnboardingStep[] = [
    {
      content: (
        <div className="grid gap-4">
          <form.Field
            name="name"
            validators={{
              onChange: required('Informe seu nome.'),
              onSubmit: required('Informe seu nome.'),
            }}
          >
            {(field) => (
              <FormInput field={field} label="Nome" placeholder="Ana Souza" />
            )}
          </form.Field>
          <form.Field
            name="role"
            validators={{
              onChange: required('Informe seu cargo.'),
              onSubmit: required('Informe seu cargo.'),
            }}
          >
            {(field) => (
              <FormInput
                field={field}
                label="Cargo"
                placeholder="Gerente de produto"
              />
            )}
          </form.Field>
        </div>
      ),
      description: 'Conte quem você é para personalizar a experiência.',
      id: 'profile',
      title: 'Seu perfil',
    },
    {
      content: (
        <form.Field
          name="workspace"
          validators={{
            onChange: required('Informe o nome do espaço.'),
            onSubmit: required('Informe o nome do espaço.'),
          }}
        >
          {(field) => (
            <FormInput
              field={field}
              label="Nome do espaço de trabalho"
              placeholder="Acme Studio"
            />
          )}
        </form.Field>
      ),
      description: 'É onde seu time vai organizar projetos e tarefas.',
      id: 'workspace',
      title: 'Seu espaço de trabalho',
    },
    {
      content: (
        <form.Field
          name="invite"
          validators={{ onChange: validEmail, onSubmit: validEmail }}
        >
          {(field) => (
            <FormInput
              field={field}
              label="E-mail de um colega"
              placeholder="colega@empresa.com"
              type="email"
            />
          )}
        </form.Field>
      ),
      description: 'Você pode convidar mais pessoas depois.',
      id: 'invite',
      title: 'Convide seu time',
    },
  ]

  const onContinue = (stepId: string) => {
    const invalid = (fieldsByStep[stepId] ?? []).some((name) =>
      Boolean(rules[name]?.({ value: form.getFieldValue(name as 'name') })),
    )
    if (!invalid) return undefined
    form.validateAllFields('change')
    return false
  }

  return { form, onContinue, steps }
}
