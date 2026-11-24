import { PlusIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Group, GroupSeparator, GroupText } from '@tc96/ui/group'
import { Input } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import { Fragment, useId } from 'react'
import type { GroupControls } from './group-controls.ts'
import { insertActions } from './group-variants.ts'

interface AddItemInputProps {
  onAdd?: () => void
}

export const ComposedGroup = ({
  label,
  orientation,
  text,
}: Readonly<GroupControls>) => {
  const separatorOrientation =
    orientation === 'vertical' ? 'horizontal' : 'vertical'
  return (
    <Group aria-label={label || undefined} orientation={orientation}>
      {text ? (
        <>
          <GroupText>{text}</GroupText>
          <GroupSeparator orientation={separatorOrientation} />
        </>
      ) : null}
      {insertActions.map((action, index) => (
        <Fragment key={action}>
          {index > 0 ? (
            <GroupSeparator orientation={separatorOrientation} />
          ) : null}
          <Button variant="outline">{action}</Button>
        </Fragment>
      ))}
    </Group>
  )
}

export const InputWithButtonGroup = () => (
  <Group aria-label="Value with action">
    <Input aria-label="Value" placeholder="Value" type="text" />
    <GroupSeparator />
    <Button variant="outline">Apply</Button>
  </Group>
)

export const TextAsLabelGroup = () => {
  const id = useId()
  return (
    <Group aria-label="Value with unit">
      <Input id={id} placeholder="Value" type="text" />
      <GroupSeparator />
      <GroupText render={<Label htmlFor={id} />}>Unit</GroupText>
    </Group>
  )
}

export const NestedGroups = () => (
  <Group aria-label="Outer group">
    <Group aria-label="First group">
      <Button variant="outline">One</Button>
      <GroupSeparator />
      <Button variant="outline">Two</Button>
    </Group>
    <Group aria-label="Second group">
      <Button variant="outline">Three</Button>
      <GroupSeparator />
      <Button variant="outline">Four</Button>
    </Group>
  </Group>
)

export const PriceInput = () => {
  const id = useId()
  return (
    <Group aria-label="Price input">
      <Input
        aria-label="Enter the amount"
        className="text-right"
        defaultValue="100"
        id={id}
        inputMode="decimal"
        type="text"
      />
      <GroupSeparator />
      <GroupText render={<label aria-label="Currency" htmlFor={id} />}>
        USD
      </GroupText>
    </Group>
  )
}

export const AddItemInput = ({ onAdd }: Readonly<AddItemInputProps>) => (
  <Group aria-label="Add item">
    <Button aria-label="Add" onClick={onAdd} size="icon" variant="outline">
      <PlusIcon aria-hidden />
    </Button>
    <GroupSeparator />
    <Input aria-label="Item name" placeholder="Enter item name" type="text" />
  </Group>
)
