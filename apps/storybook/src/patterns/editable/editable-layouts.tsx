import {
  Editable,
  EditableArea,
  EditableCancel,
  EditableField,
  type EditableFieldProps,
  EditableInput,
  EditableLabel,
  EditablePreview,
  type EditableProps,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import type { EditableControls } from './editable-controls.ts'

type RootProps = Omit<
  EditableProps,
  | keyof EditableControls
  | 'children'
  | 'defaultEditing'
  | 'defaultValue'
  | 'value'
>

export interface ComposedEditableProps extends EditableControls, RootProps {
  fieldProps?: EditableFieldProps
}

const hiddenLabelText = 'Title'

export const ComposedEditable = ({
  autosize,
  disabled,
  editing,
  field,
  fieldProps,
  label,
  multiline,
  orientation,
  placeholder,
  readOnly,
  required,
  toolbar,
  trigger,
  value,
  ...rootProps
}: Readonly<ComposedEditableProps>) => (
  <Editable
    {...rootProps}
    autosize={autosize}
    defaultEditing={editing && !field}
    defaultValue={value}
    disabled={disabled}
    key={[value, editing, field].join()}
    placeholder={placeholder}
    readOnly={readOnly}
    required={required}
  >
    <EditableLabel className={label ? undefined : 'sr-only'}>
      {label || hiddenLabelText}
    </EditableLabel>
    {field ? (
      <EditableField multiline={multiline} {...fieldProps} />
    ) : (
      <>
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
        {trigger ? <EditableTrigger>Edit</EditableTrigger> : null}
        {toolbar ? (
          <EditableToolbar orientation={orientation}>
            <EditableSubmit>Save</EditableSubmit>
            <EditableCancel>Cancel</EditableCancel>
          </EditableToolbar>
        ) : null}
      </>
    )}
  </Editable>
)

interface StatefulEditableProps
  extends Omit<EditableProps, 'defaultValue' | 'onValueChange' | 'value'> {
  initialValue: string
}

export const StatefulEditable = ({
  initialValue,
  ...props
}: Readonly<StatefulEditableProps>) => {
  const [value, setValue] = useState(initialValue)

  return <Editable {...props} onValueChange={setValue} value={value} />
}
