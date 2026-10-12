import { afterEach, describe, expect, mock, test } from 'bun:test'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const {
  Editable,
  EditableArea,
  EditableCancel,
  EditableField,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
} = await import('./editable')

afterEach(cleanup)

function renderEditable(
  props: Partial<React.ComponentProps<typeof Editable>> = {},
) {
  return render(
    <Editable defaultValue="Alpha" {...props}>
      <EditableLabel>Title</EditableLabel>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableTrigger>Edit</EditableTrigger>
      <EditableToolbar>
        <EditableSubmit>Save</EditableSubmit>
        <EditableCancel>Cancel</EditableCancel>
      </EditableToolbar>
    </Editable>,
  )
}

describe('Editable', () => {
  test('edits and submits a value with Enter', () => {
    const onSubmit = mock()
    renderEditable({ onSubmit })

    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }))
    const input = screen.getByRole('textbox', { name: 'Title' })
    fireEvent.change(input, { target: { value: 'Beta' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSubmit).toHaveBeenCalledWith('Beta')
    expect(screen.getByRole('button', { name: 'Beta' })).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  test('paints the required marker with the destructive foreground token', () => {
    renderEditable({ required: true })
    const label = screen.getByText('Title')
    expect(label.hasAttribute('data-required')).toBe(true)
    expect(label.className).toContain(
      'data-required:after:text-destructive-foreground',
    )
    expect(label.className).not.toMatch(/after:text-destructive(?!-)/)
  })

  test('cancels with Escape and restores the previous value', () => {
    const onCancel = mock()
    const changes: string[] = []
    renderEditable({
      onCancel,
      onValueChange: (value) => changes.push(value),
    })

    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }))
    const input = screen.getByRole('textbox', { name: 'Title' })
    fireEvent.change(input, { target: { value: 'Draft' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(changes).toEqual(['Draft', 'Alpha'])
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeTruthy()
  })

  test('submits on blur outside editable actions', () => {
    const onSubmit = mock()
    renderEditable({ onSubmit })

    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }))
    const input = screen.getByRole('textbox', { name: 'Title' })
    fireEvent.change(input, { target: { value: 'Blurred' } })
    fireEvent.blur(input)

    expect(onSubmit).toHaveBeenCalledWith('Blurred')
    expect(screen.getByRole('button', { name: 'Blurred' })).toBeTruthy()
  })

  test('supports double-click mode and ignores a single click', () => {
    const onEdit = mock()
    renderEditable({ onEdit, triggerMode: 'dblclick' })

    const preview = screen.getByRole('button', { name: 'Alpha' })
    fireEvent.click(preview)
    expect(onEdit).not.toHaveBeenCalled()

    fireEvent.doubleClick(preview)
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('textbox', { name: 'Title' })).toBeTruthy()
  })

  test('prevents editing when disabled', () => {
    const onEdit = mock()
    renderEditable({ disabled: true, onEdit })

    const preview = screen.getByRole('button', { name: 'Alpha' })
    fireEvent.click(preview)

    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(preview.getAttribute('data-disabled')).toBe('')
  })

  test('exposes the value to native forms', () => {
    render(
      <form>
        <Editable defaultValue="Form value" name="title">
          <EditableLabel>Title</EditableLabel>
          <EditableArea>
            <EditablePreview />
            <EditableInput />
          </EditableArea>
        </Editable>
      </form>,
    )

    const field = document.querySelector<HTMLInputElement>(
      'input[type="hidden"][name="title"]',
    )
    expect(field?.value).toBe('Form value')
  })

  test('starts editing from the trigger with the current value', () => {
    renderEditable()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Title',
    })
    expect(input.value).toBe('Alpha')
  })
})

function renderField(
  props: Partial<React.ComponentProps<typeof Editable>> = {},
  fieldProps: Partial<React.ComponentProps<typeof EditableField>> = {},
) {
  return render(
    <Editable defaultValue="Alpha" {...props}>
      <EditableLabel>Title</EditableLabel>
      <EditableField {...fieldProps} />
    </Editable>,
  )
}

const field = () =>
  screen.getByRole<HTMLInputElement>('textbox', { name: 'Title' })

function listenOnDocument() {
  const onDocumentKeyDown = mock()
  document.addEventListener('keydown', onDocumentKeyDown)
  return {
    onDocumentKeyDown,
    [Symbol.dispose]: () =>
      document.removeEventListener('keydown', onDocumentKeyDown),
  }
}

describe('EditableField', () => {
  test('stays mounted and edits while focused', () => {
    const editing: boolean[] = []
    renderField({ onEditingChange: (next) => editing.push(next) })

    expect(field().value).toBe('Alpha')
    expect(screen.queryByRole('button')).toBeNull()

    act(() => field().focus())
    expect(field().hasAttribute('data-editing')).toBe(true)

    act(() => field().blur())
    expect(field().hasAttribute('data-editing')).toBe(false)
    expect(editing).toEqual([true, false])
  })

  test('submits on blur only when the value changed since focus', () => {
    const onSubmit = mock()
    renderField({ onSubmit })

    act(() => field().focus())
    act(() => field().blur())
    expect(onSubmit).not.toHaveBeenCalled()

    act(() => field().focus())
    fireEvent.change(field(), { target: { value: 'Beta' } })
    act(() => field().blur())
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('Beta')
  })

  test('submits a single-line field once on Enter', () => {
    const onSubmit = mock()
    renderField({ onSubmit })

    act(() => field().focus())
    fireEvent.change(field(), { target: { value: 'Beta' } })
    fireEvent.keyDown(field(), { key: 'Enter' })

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('Beta')
    expect(document.activeElement).not.toBe(field())
  })

  test('leaves Enter to a multiline field', () => {
    const onSubmit = mock()
    renderField({ onSubmit }, { multiline: true })

    expect(field().tagName).toBe('TEXTAREA')

    act(() => field().focus())
    fireEvent.change(field(), { target: { value: 'Beta' } })
    fireEvent.keyDown(field(), { key: 'Enter' })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(field().hasAttribute('data-editing')).toBe(true)
  })

  test('Escape restores a changed value and keeps the event from the page', () => {
    using page = listenOnDocument()
    const onCancel = mock()
    const onSubmit = mock()
    renderField({ onCancel, onSubmit })

    act(() => field().focus())
    fireEvent.change(field(), { target: { value: 'Draft' } })
    fireEvent.keyDown(field(), { key: 'Escape' })

    expect(field().value).toBe('Alpha')
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(page.onDocumentKeyDown).not.toHaveBeenCalled()

    fireEvent.keyDown(field(), { key: 'Escape' })

    expect(page.onDocumentKeyDown).toHaveBeenCalledTimes(1)
  })

  test('clears the empty value on focus without counting it as a change', () => {
    using page = listenOnDocument()
    const onSubmit = mock()
    renderField(
      { defaultValue: 'Untitled', onSubmit },
      { emptyValue: 'Untitled' },
    )

    act(() => field().focus())
    expect(field().value).toBe('')

    fireEvent.keyDown(field(), { key: 'Escape' })
    expect(page.onDocumentKeyDown).toHaveBeenCalledTimes(1)

    act(() => field().blur())
    expect(field().value).toBe('Untitled')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('renders the value as text when read only', () => {
    renderField(
      { defaultValue: '', placeholder: 'No title', readOnly: true },
      { 'aria-label': 'Title', className: 'text-sm' },
    )

    expect(screen.queryByRole('textbox')).toBeNull()
    const text = screen.getByText('No title')
    expect(text.tagName).toBe('SPAN')
    expect(text.getAttribute('data-slot')).toBe('editable-field')
    expect(text.className).toBe('text-sm')
  })

  test('takes its name from aria-label without pointing at a missing label', () => {
    render(
      <Editable defaultValue="Alpha">
        <EditableField aria-label="Name" />
      </Editable>,
    )

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input.hasAttribute('aria-labelledby')).toBe(false)
  })
})
