import { Checkbox } from '@tc96/ui/checkbox'
import { CheckboxGroup } from '@tc96/ui/checkbox-group'
import { Field, FieldDescription, FieldItem, FieldLabel } from '@tc96/ui/field'
import { Label } from '@tc96/ui/label'
import { useId, useState } from 'react'
import type { CheckboxGroupControls } from './checkbox-group-controls.ts'
import {
  disabledFramework,
  frameworks,
  frameworkValues,
} from './checkbox-group-variants.ts'

interface ValueChangeProps {
  onValueChange?: (value: string[]) => void
}

export const captionClassName =
  'font-medium text-base/4.5 text-foreground sm:text-sm/4'

export const ComposedCheckboxGroup = ({
  defaultValue,
  disabled,
  disabledItem,
  label,
  onValueChange,
  parent,
}: Readonly<CheckboxGroupControls & ValueChangeProps>) => {
  const labelId = useId()
  const group = (
    <CheckboxGroup
      allValues={parent ? frameworkValues : undefined}
      aria-labelledby={label ? labelId : undefined}
      defaultValue={defaultValue}
      disabled={disabled}
      key={defaultValue.join()}
      onValueChange={onValueChange}
    >
      {parent ? (
        <Label id={labelId}>
          <Checkbox parent />
          {label}
        </Label>
      ) : null}
      {frameworks.map(({ label: text, value }) => (
        <Label className={parent ? 'ms-4' : undefined} key={value}>
          <Checkbox
            disabled={disabledItem && value === disabledFramework}
            value={value}
          />
          {text}
        </Label>
      ))}
    </CheckboxGroup>
  )

  if (parent || !label) return group

  return (
    <div className="flex flex-col gap-3">
      <div className={captionClassName} id={labelId}>
        {label}
      </div>
      {group}
    </div>
  )
}

export const FieldCheckboxGroup = ({
  onValueChange,
}: Readonly<ValueChangeProps>) => (
  <Field name="frameworks">
    <FieldLabel>Frameworks</FieldLabel>
    <CheckboxGroup defaultValue={['next']} onValueChange={onValueChange}>
      {frameworks.map(({ label, value }) => (
        <FieldItem key={value}>
          <FieldLabel>
            <Checkbox value={value} />
            {label}
          </FieldLabel>
        </FieldItem>
      ))}
    </CheckboxGroup>
    <FieldDescription>
      Pick every framework your team ships with.
    </FieldDescription>
  </Field>
)

const mainPermissions = ['view-dashboard', 'access-reports', 'manage-users']

const userPermissions = [
  { label: 'Create users', value: 'create-users' },
  { label: 'Edit users', value: 'edit-users' },
  { label: 'Delete users', value: 'delete-users' },
  { label: 'Assign roles', value: 'assign-roles' },
]

const userPermissionValues = userPermissions.map(({ value }) => value)

export const NestedPermissions = () => {
  const captionId = useId()
  const usersCaptionId = useId()
  const [mainValue, setMainValue] = useState<string[]>(['view-dashboard'])
  const [usersValue, setUsersValue] = useState<string[]>([])

  const changeMain = (value: string[]) => {
    if (value.includes('manage-users')) {
      setUsersValue(userPermissionValues)
    } else if (usersValue.length === userPermissionValues.length) {
      setUsersValue([])
    }
    setMainValue(value)
  }

  const changeUsers = (value: string[]) => {
    setMainValue((current) =>
      value.length === userPermissionValues.length
        ? [...new Set([...current, 'manage-users'])]
        : current.filter((item) => item !== 'manage-users'),
    )
    setUsersValue(value)
  }

  return (
    <CheckboxGroup
      allValues={mainPermissions}
      aria-labelledby={captionId}
      onValueChange={changeMain}
      value={mainValue}
    >
      <Label id={captionId}>
        <Checkbox parent />
        Editor permissions
      </Label>
      <Label className="ms-4">
        <Checkbox value="view-dashboard" />
        View dashboard
      </Label>
      <Label className="ms-4">
        <Checkbox value="access-reports" />
        Access reports
      </Label>
      <CheckboxGroup
        allValues={userPermissionValues}
        aria-labelledby={usersCaptionId}
        className="ms-4"
        onValueChange={changeUsers}
        value={usersValue}
      >
        <Label id={usersCaptionId}>
          <Checkbox parent />
          Manage users
        </Label>
        {userPermissions.map(({ label, value }) => (
          <Label className="ms-4" key={value}>
            <Checkbox value={value} />
            {label}
          </Label>
        ))}
      </CheckboxGroup>
    </CheckboxGroup>
  )
}
