import { afterEach, describe, expect, mock, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const {
  Editable,
  EditableArea,
  EditableCancel,
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
})
