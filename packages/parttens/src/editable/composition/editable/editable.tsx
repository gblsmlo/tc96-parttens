'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@tc96/utils'
import * as React from 'react'
import {
  EditableContext,
  type EditableContextValue,
  useEditableContext,
} from '../../store/editable-store'

type Direction = 'ltr' | 'rtl'
type TriggerMode = 'click' | 'dblclick' | 'focus'

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  if (ref) {
    ref.current = value
  }
}

function dataAttributes(
  attributes: Record<`data-${string}`, string | undefined>,
): Record<string, string | undefined> {
  return attributes
}

function useComposedRefs<T>(
  firstRef: React.Ref<T> | undefined,
  secondRef: React.Ref<T> | undefined,
) {
  return React.useCallback(
    (value: T | null) => {
      assignRef(firstRef, value)
      assignRef(secondRef, value)
    },
    [firstRef, secondRef],
  )
}

export interface EditableProps
  extends Omit<
    React.ComponentProps<'div'> & useRender.ComponentProps<'div'>,
    'defaultValue' | 'onSubmit'
  > {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  defaultEditing?: boolean
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  onCancel?: () => void
  onEdit?: () => void
  onSubmit?: (value: string) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onEnterKeyDown?: (event: KeyboardEvent) => void
  dir?: Direction
  maxLength?: number
  name?: string
  placeholder?: string
  triggerMode?: TriggerMode
  autosize?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
}

export function Editable(props: EditableProps) {
  const {
    value: controlledValue,
    defaultValue = '',
    defaultEditing = false,
    editing: controlledEditing,
    onValueChange,
    onEditingChange,
    onCancel,
    onEdit,
    onSubmit,
    onEscapeKeyDown,
    onEnterKeyDown,
    dir,
    maxLength,
    name,
    placeholder,
    triggerMode = 'click',
    autosize = false,
    disabled = false,
    required = false,
    readOnly = false,
    invalid = false,
    className,
    id,
    render,
    ref,
    ...rootProps
  } = props

  const generatedRootId = React.useId()
  const rootId = id ?? generatedRootId
  const inputId = React.useId()
  const labelId = React.useId()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [uncontrolledEditing, setUncontrolledEditing] =
    React.useState(defaultEditing)
  const previousValueRef = React.useRef(defaultValue)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref, rootRef)

  const value = controlledValue ?? uncontrolledValue
  const editing = controlledEditing ?? uncontrolledEditing

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [controlledValue, onValueChange],
  )

  const setEditing = React.useCallback(
    (nextEditing: boolean) => {
      if (controlledEditing === undefined) {
        setUncontrolledEditing(nextEditing)
      }
      onEditingChange?.(nextEditing)
    },
    [controlledEditing, onEditingChange],
  )

  const beginEditing = React.useCallback(() => {
    if (disabled || readOnly) return
    previousValueRef.current = value
    setEditing(true)
    onEdit?.()
  }, [disabled, onEdit, readOnly, setEditing, value])

  const cancelEditing = React.useCallback(() => {
    if (disabled || readOnly) return
    setValue(previousValueRef.current)
    setEditing(false)
    onCancel?.()
  }, [disabled, onCancel, readOnly, setEditing, setValue])

  const submitValue = React.useCallback(() => {
    if (disabled || readOnly) return
    setEditing(false)
    onSubmit?.(value)
  }, [disabled, onSubmit, readOnly, setEditing, value])

  const context = React.useMemo<EditableContextValue>(
    () => ({
      rootId,
      inputId,
      labelId,
      value,
      editing,
      dir,
      maxLength,
      placeholder,
      triggerMode,
      autosize,
      disabled,
      readOnly,
      required,
      invalid,
      beginEditing,
      cancelEditing,
      submitValue,
      setValue,
      onEnterKeyDown,
      onEscapeKeyDown,
    }),
    [
      rootId,
      inputId,
      labelId,
      value,
      editing,
      dir,
      maxLength,
      placeholder,
      triggerMode,
      autosize,
      disabled,
      readOnly,
      required,
      invalid,
      beginEditing,
      cancelEditing,
      submitValue,
      setValue,
      onEnterKeyDown,
      onEscapeKeyDown,
    ],
  )

  const element = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        id: rootId,
        ref: composedRef,
        ...dataAttributes({
          'data-disabled': disabled ? '' : undefined,
          'data-editing': editing ? '' : undefined,
          'data-invalid': invalid ? '' : undefined,
          'data-slot': 'editable',
        }),
        className: cn('flex min-w-0 flex-col gap-2', className),
      },
      rootProps,
    ),
    render,
    state: {
      slot: 'editable',
      ...(editing && { editing: '' }),
      ...(disabled && { disabled: '' }),
      ...(invalid && { invalid: '' }),
    },
  })

  return (
    <EditableContext.Provider value={context}>
      {element}
      {name && (
        <input
          disabled={disabled}
          name={name}
          readOnly={readOnly}
          type="hidden"
          value={value}
        />
      )}
    </EditableContext.Provider>
  )
}

export interface EditableLabelProps
  extends React.ComponentProps<'label'>,
    useRender.ComponentProps<'label'> {}

export function EditableLabel(props: EditableLabelProps) {
  const { className, render, ref, ...labelProps } = props
  const context = useEditableContext('EditableLabel')

  return useRender({
    defaultTagName: 'label',
    props: mergeProps<'label'>(
      {
        ref,
        id: context.labelId,
        htmlFor: context.inputId,
        ...dataAttributes({
          'data-disabled': context.disabled ? '' : undefined,
          'data-invalid': context.invalid ? '' : undefined,
          'data-required': context.required ? '' : undefined,
          'data-slot': 'editable-label',
        }),
        className: cn(
          "font-medium text-sm leading-none data-required:after:ml-0.5 data-required:after:text-destructive-foreground data-required:after:content-['*'] data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className,
        ),
      },
      labelProps,
    ),
    render,
    state: {
      slot: 'editable-label',
      ...(context.disabled && { disabled: '' }),
      ...(context.invalid && { invalid: '' }),
      ...(context.required && { required: '' }),
    },
  })
}

export interface EditableAreaProps
  extends React.ComponentProps<'div'>,
    useRender.ComponentProps<'div'> {}

export function EditableArea(props: EditableAreaProps) {
  const { className, render, ref, ...areaProps } = props
  const context = useEditableContext('EditableArea')

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        role: 'group',
        dir: context.dir,
        ref,
        ...dataAttributes({
          'data-disabled': context.disabled ? '' : undefined,
          'data-editing': context.editing ? '' : undefined,
          'data-slot': 'editable-area',
        }),
        className: cn(
          'relative inline-flex min-w-0 items-center gap-2 data-disabled:cursor-not-allowed data-disabled:opacity-50',
          className,
        ),
      },
      areaProps,
    ),
    render,
    state: {
      slot: 'editable-area',
      ...(context.disabled && { disabled: '' }),
      ...(context.editing && { editing: '' }),
    },
  })
}

export interface EditablePreviewProps
  extends React.ComponentProps<'div'>,
    useRender.ComponentProps<'div'> {}

export function EditablePreview(props: EditablePreviewProps) {
  const {
    onClick,
    onDoubleClick,
    onFocus,
    onKeyDown,
    className,
    render,
    ref,
    ...previewProps
  } = props
  const context = useEditableContext('EditablePreview')

  const trigger = React.useCallback(() => {
    context.beginEditing()
  }, [context.beginEditing])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || event.key !== 'Enter') return

      const nativeEvent = event.nativeEvent
      context.onEnterKeyDown?.(nativeEvent)
      if (!nativeEvent.defaultPrevented) {
        trigger()
      }
    },
    [context.onEnterKeyDown, onKeyDown, trigger],
  )

  const element = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        role: 'button',
        tabIndex: context.disabled ? undefined : 0,
        ref,
        ...dataAttributes({
          'data-disabled': context.disabled ? '' : undefined,
          'data-empty': !context.value ? '' : undefined,
          'data-slot': 'editable-preview',
        }),
        onClick: (event: React.MouseEvent<HTMLDivElement>) => {
          onClick?.(event)
          if (!event.defaultPrevented && context.triggerMode === 'click')
            trigger()
        },
        onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => {
          onDoubleClick?.(event)
          if (!event.defaultPrevented && context.triggerMode === 'dblclick')
            trigger()
        },
        onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
          onFocus?.(event)
          if (!event.defaultPrevented && context.triggerMode === 'focus')
            trigger()
        },
        onKeyDown: handleKeyDown,
        className: cn(
          'min-w-0 cursor-text truncate rounded-md border border-transparent px-2 py-1.5 text-sm outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-empty:text-muted-foreground',
          className,
        ),
        children: context.value || context.placeholder,
      },
      previewProps,
    ),
    render,
    state: {
      slot: 'editable-preview',
      ...(context.disabled && { disabled: '' }),
      ...(!context.value && { empty: '' }),
    },
  })

  if (context.editing || context.readOnly) return null

  return element
}

export interface EditableInputProps
  extends React.ComponentProps<'input'>,
    useRender.ComponentProps<'input'> {}

export function EditableInput(props: EditableInputProps) {
  const {
    onBlur,
    onChange,
    onKeyDown,
    className,
    disabled,
    readOnly,
    required,
    maxLength,
    render,
    ref,
    ...inputProps
  } = props
  const context = useEditableContext('EditableInput')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const composedRef = useComposedRefs(ref, inputRef)
  const isDisabled = disabled || context.disabled
  const isReadOnly = readOnly || context.readOnly
  const isRequired = required || context.required

  const autosize = React.useCallback(
    (target: HTMLInputElement) => {
      if (!context.autosize) return
      target.style.width = '0'
      target.style.width = `${target.scrollWidth + 4}px`
    },
    [context.autosize],
  )

  React.useEffect(() => {
    if (!context.editing || isDisabled || isReadOnly || !inputRef.current)
      return

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
      if (inputRef.current) autosize(inputRef.current)
    })
    return () => cancelAnimationFrame(frame)
  }, [autosize, context.editing, isDisabled, isReadOnly])

  const element = useRender({
    defaultTagName: 'input',
    props: mergeProps<'input'>(
      {
        id: context.inputId,
        'aria-labelledby': context.labelId,
        'aria-required': isRequired || undefined,
        'aria-invalid': context.invalid || undefined,
        dir: context.dir,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
        ref: composedRef,
        ...dataAttributes({ 'data-slot': 'editable-input' }),
        maxLength: maxLength ?? context.maxLength,
        placeholder: context.placeholder,
        value: context.value,
        onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
          onBlur?.(event)
          if (event.defaultPrevented || isDisabled || isReadOnly) return

          const relatedTarget = event.relatedTarget
          const isEditableAction =
            relatedTarget instanceof HTMLElement &&
            Boolean(
              relatedTarget.closest(
                '[data-slot="editable-trigger"], [data-slot="editable-cancel"], [data-slot="editable-submit"]',
              ),
            )
          if (!isEditableAction) {
            context.submitValue()
          }
        },
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(event)
          if (event.defaultPrevented || isDisabled || isReadOnly) return
          context.setValue(event.target.value)
          autosize(event.target)
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || isDisabled || isReadOnly) return

          if (event.key === 'Escape') {
            const nativeEvent = event.nativeEvent
            context.onEscapeKeyDown?.(nativeEvent)
            if (!nativeEvent.defaultPrevented) {
              context.cancelEditing()
            }
          } else if (event.key === 'Enter') {
            const nativeEvent = event.nativeEvent
            context.onEnterKeyDown?.(nativeEvent)
            if (!nativeEvent.defaultPrevented) {
              context.submitValue()
            }
          }
        },
        className: cn(
          'flex h-9 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
          context.autosize ? 'w-auto min-w-8' : 'w-full',
          className,
        ),
      },
      inputProps,
    ),
    render,
    state: {
      slot: 'editable-input',
    },
  })

  if (!context.editing && !isReadOnly) return null

  return element
}

export interface EditableTriggerProps
  extends React.ComponentProps<'button'>,
    useRender.ComponentProps<'button'> {
  forceMount?: boolean
}

export function EditableTrigger(props: EditableTriggerProps) {
  const { forceMount = false, className, render, ref, ...triggerProps } = props
  const context = useEditableContext('EditableTrigger')

  const element = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        type: 'button',
        'aria-controls': context.rootId,
        'aria-disabled': context.disabled || context.readOnly || undefined,
        ref,
        ...dataAttributes({
          'data-disabled': context.disabled ? '' : undefined,
          'data-readonly': context.readOnly ? '' : undefined,
          'data-slot': 'editable-trigger',
        }),
        onClick:
          context.triggerMode === 'click' ? context.beginEditing : undefined,
        onDoubleClick:
          context.triggerMode === 'dblclick' ? context.beginEditing : undefined,
        className: cn(
          'inline-flex h-8 w-fit items-center justify-center rounded-md border border-input bg-background px-3 font-medium text-sm shadow-xs outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50',
          className,
        ),
      },
      triggerProps,
    ),
    render,
    state: {
      slot: 'editable-trigger',
      ...(context.disabled && { disabled: '' }),
      ...(context.readOnly && { readonly: '' }),
    },
  })

  if (!forceMount && (context.editing || context.readOnly)) return null

  return element
}

export interface EditableToolbarProps
  extends React.ComponentProps<'div'>,
    useRender.ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical'
}

export function EditableToolbar(props: EditableToolbarProps) {
  const {
    className,
    orientation = 'horizontal',
    render,
    ref,
    ...toolbarProps
  } = props
  const context = useEditableContext('EditableToolbar')

  const element = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        role: 'toolbar',
        'aria-orientation': orientation,
        ref,
        ...dataAttributes({
          'data-orientation': orientation,
          'data-slot': 'editable-toolbar',
        }),
        className: cn(
          'flex gap-2',
          orientation === 'vertical'
            ? 'flex-col items-stretch'
            : 'flex-row items-center',
          className,
        ),
      },
      toolbarProps,
    ),
    render,
    state: {
      slot: 'editable-toolbar',
      orientation,
    },
  })

  if (!context.editing) return null

  return element
}

export interface EditableCancelProps
  extends React.ComponentProps<'button'>,
    useRender.ComponentProps<'button'> {}

export function EditableCancel(props: EditableCancelProps) {
  const { className, render, ref, ...cancelProps } = props
  const context = useEditableContext('EditableCancel')

  const element = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        type: 'button',
        'aria-controls': context.rootId,
        ref,
        ...dataAttributes({ 'data-slot': 'editable-cancel' }),
        onClick: context.cancelEditing,
        className: cn(
          'inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 font-medium text-sm shadow-xs outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/30',
          className,
        ),
      },
      cancelProps,
    ),
    render,
    state: {
      slot: 'editable-cancel',
    },
  })

  if (!context.editing) return null

  return element
}

export interface EditableSubmitProps
  extends React.ComponentProps<'button'>,
    useRender.ComponentProps<'button'> {}

export function EditableSubmit(props: EditableSubmitProps) {
  const { className, render, ref, ...submitProps } = props
  const context = useEditableContext('EditableSubmit')

  const element = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        type: 'button',
        'aria-controls': context.rootId,
        ref,
        ...dataAttributes({ 'data-slot': 'editable-submit' }),
        onClick: context.submitValue,
        className: cn(
          'inline-flex h-8 items-center justify-center rounded-md border border-primary bg-primary px-3 font-medium text-primary-foreground text-sm shadow-xs outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/30',
          className,
        ),
      },
      submitProps,
    ),
    render,
    state: {
      slot: 'editable-submit',
    },
  })

  if (!context.editing) return null

  return element
}
