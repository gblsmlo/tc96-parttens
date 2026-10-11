import { afterEach, describe, expect, mock, test } from 'bun:test'

await import('../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { Popover } = await import('@tc96/ui/popover')
const { PropertyEntryForm } = await import('./property-entry-form')

afterEach(cleanup)

const renderForm = (
  props: Partial<Parameters<typeof PropertyEntryForm>[0]> = {},
) => {
  const handlers = {
    onAdd: mock(),
    onChange: mock(),
    onRemove: mock(),
    onSave: mock(),
  }
  render(
    <Popover open>
      <PropertyEntryForm
        addLabel="Adicionar e-mail"
        canAddAnother
        drafts={['ana@example.com']}
        entryLabels={['Principal', 'Secundário']}
        errors={[]}
        removeLabel={(label) => `Remover ${label} e-mail`}
        renderField={(field) => (
          <input
            aria-invalid={field.invalid || undefined}
            aria-label={field.ariaLabel}
            onChange={(event) => field.onChange(event.target.value)}
            onKeyDown={field.onKeyDown}
            value={field.draft}
          />
        )}
        {...handlers}
        {...props}
      />
    </Popover>,
  )
  return handlers
}

describe('PropertyEntryForm', () => {
  test('labels each entry and names the field after it', async () => {
    renderForm()

    expect(await screen.findByText('Principal')).toBeTruthy()
    expect(screen.getByRole('textbox', { name: 'Principal' })).toBeTruthy()
  })

  test('hides the entry label when there is a single draft and a single label', async () => {
    renderForm({ entryLabels: ['Principal'] })

    await screen.findByRole('textbox', { name: 'Principal' })
    expect(screen.queryByText('Principal')).toBeNull()
  })

  test('falls back to the add label, and to the position, past the labels', async () => {
    renderForm({
      drafts: ['a', 'b', 'c'],
      entryLabels: ['Principal', 'Secundário'],
    })

    expect(await screen.findByText('3')).toBeTruthy()
    expect(screen.getAllByRole('textbox')).toHaveLength(3)
    expect(screen.getAllByRole('textbox')[2]?.getAttribute('aria-label')).toBe(
      'Adicionar e-mail',
    )
  })

  test('shows the remove button only with more than one draft', async () => {
    renderForm()
    await screen.findByRole('textbox', { name: 'Principal' })
    expect(screen.queryByRole('button', { name: /Remover/ })).toBeNull()

    cleanup()
    const { onRemove } = renderForm({ drafts: ['a', 'b'] })
    fireEvent.click(
      await screen.findByRole('button', { name: 'Remover Secundário e-mail' }),
    )

    expect(onRemove).toHaveBeenCalledWith(1)
  })

  test('forwards typing with the field index', async () => {
    const { onChange } = renderForm({ drafts: ['a', 'b'] })

    fireEvent.change(
      await screen.findByRole('textbox', { name: 'Secundário' }),
      {
        target: { value: 'novo' },
      },
    )

    expect(onChange).toHaveBeenCalledWith(1, 'novo')
  })

  test('saves on Enter without letting the event reach the popup', async () => {
    const { onSave } = renderForm()
    const outer = mock()
    document.addEventListener('keydown', outer)

    fireEvent.keyDown(
      await screen.findByRole('textbox', { name: 'Principal' }),
      {
        key: 'Enter',
      },
    )
    document.removeEventListener('keydown', outer)

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(outer).not.toHaveBeenCalled()
  })

  test('ignores other keys', async () => {
    const { onSave } = renderForm()

    fireEvent.keyDown(
      await screen.findByRole('textbox', { name: 'Principal' }),
      {
        key: 'a',
      },
    )

    expect(onSave).not.toHaveBeenCalled()
  })

  test('saves through the submit button and turns off native validation', async () => {
    const { onSave } = renderForm()

    fireEvent.click(await screen.findByRole('button', { name: 'Salvar' }))

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(document.querySelector('form')?.noValidate).toBe(true)
  })

  test('adds another entry only while allowed', async () => {
    const { onAdd } = renderForm({ canAddAnother: false })
    const add = await screen.findByRole('button', { name: 'Adicionar outro' })
    expect((add as HTMLButtonElement).disabled).toBe(true)

    cleanup()
    const enabled = renderForm({ canAddAnother: true })
    fireEvent.click(
      await screen.findByRole('button', { name: 'Adicionar outro' }),
    )

    expect(onAdd).not.toHaveBeenCalled()
    expect(enabled.onAdd).toHaveBeenCalledTimes(1)
  })

  test('announces field errors and the consumer refusal', async () => {
    renderForm({
      errorMessage: 'Já existe no workspace.',
      errors: ['Informe um e-mail válido.'],
    })

    const alerts = await screen.findAllByRole('alert')
    expect(alerts.map((alert) => alert.textContent)).toEqual([
      'Informe um e-mail válido.',
      'Já existe no workspace.',
    ])
    expect(
      screen
        .getByRole('textbox', { name: 'Principal' })
        .getAttribute('aria-invalid'),
    ).toBe('true')
  })
})
