import { afterEach, describe, expect, mock, test } from 'bun:test'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { EmailProperty } = await import('./email-property')

afterEach(cleanup)

const EMAIL = 'ana@example.com'
const OTHER = 'bruno@example.com'

const openAddPopover = async (name: string) => {
  await act(async () => fireEvent.click(screen.getByRole('button', { name })))
}

const fillEntry = async (label: string, email: string) => {
  const field = await screen.findByRole('textbox', { name: label })
  await act(async () => fireEvent.change(field, { target: { value: email } }))
  return field
}

const addAnother = async () => {
  await act(async () =>
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar outro' })),
  )
}

const save = async () => {
  await act(async () =>
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' })),
  )
}

describe('EmailProperty', () => {
  test('vazia, a fileira lê como propriedade ausente e o gatilho se nomeia', () => {
    render(<EmailProperty action={() => undefined} value={[]} />)

    const trigger = screen.getByRole('button', { name: 'Adicionar e-mail' })
    expect(trigger.textContent).toContain('Sem e-mail')
    expect(trigger.getAttribute('data-empty')).toBe('true')
  })

  test('com e-mail, o gatilho colapsa no sinal de adicionar', () => {
    render(<EmailProperty action={() => undefined} value={[EMAIL]} />)

    const trigger = screen.getByRole('button', { name: 'Adicionar e-mail' })
    expect(trigger.textContent).toBe('')
    expect(trigger.querySelector('svg')).toBeTruthy()
  })

  test('o popup abre com o que já existe e acrescenta o segundo endereço', async () => {
    const action = mock(() => undefined)
    render(<EmailProperty action={action} value={[EMAIL]} />)

    await openAddPopover('Adicionar e-mail')
    expect(
      (screen.getByRole('textbox', { name: 'Principal' }) as HTMLInputElement)
        .value,
    ).toBe(EMAIL)

    await addAnother()
    await fillEntry('Secundário', OTHER)
    await save()

    expect(action).toHaveBeenCalledWith([EMAIL, OTHER], {
      added: OTHER,
      previousValue: [EMAIL],
      removed: null,
    })
  })

  test('acrescentar o segundo só libera com o primeiro válido', async () => {
    render(<EmailProperty action={() => undefined} value={[]} />)

    await openAddPopover('Adicionar e-mail')
    const another = screen.getByRole('button', { name: 'Adicionar outro' })
    // Em branco não há o que acrescentar…
    expect(another.hasAttribute('disabled')).toBe(true)

    await fillEntry('Principal', 'ana@')
    // …e incompleto ainda vai mudar.
    expect(
      screen
        .getByRole('button', { name: 'Adicionar outro' })
        .hasAttribute('disabled'),
    ).toBe(true)

    await fillEntry('Principal', EMAIL)
    expect(
      screen
        .getByRole('button', { name: 'Adicionar outro' })
        .hasAttribute('disabled'),
    ).toBe(false)
  })

  test('com as entradas declaradas preenchidas, não há outra a acrescentar', async () => {
    render(<EmailProperty action={() => undefined} value={[EMAIL, OTHER]} />)

    await openAddPopover('Adicionar e-mail')

    expect(
      screen
        .getByRole('button', { name: 'Adicionar outro' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })

  test('Enter no campo salva, sem o popup fechar por baixo', async () => {
    const action = mock(() => undefined)
    render(<EmailProperty action={action} value={[]} />)

    await openAddPopover('Adicionar e-mail')
    const field = await fillEntry('Principal', OTHER)
    await act(async () => fireEvent.keyDown(field, { key: 'Enter' }))

    expect(action).toHaveBeenCalledWith([OTHER], {
      added: OTHER,
      previousValue: [],
      removed: null,
    })
  })

  test('formato inválido é recusado no próprio campo', async () => {
    const action = mock(() => undefined)
    render(<EmailProperty action={action} value={[]} />)

    await openAddPopover('Adicionar e-mail')
    await fillEntry('Principal', 'ana@')
    await save()

    expect(action).toHaveBeenCalledTimes(0)
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Informe um e-mail válido.',
    )
  })

  test('endereço repetido não vira chip duplicado', async () => {
    const action = mock(() => undefined)
    render(<EmailProperty action={action} value={[EMAIL]} />)

    await openAddPopover('Adicionar e-mail')
    await addAnother()
    await fillEntry('Secundário', EMAIL)
    await save()

    expect(action).toHaveBeenCalledTimes(0)
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Este e-mail já está na lista.',
    )
  })

  test('remover devolve a lista sem o endereço, nomeando qual saiu', async () => {
    const action = mock(() => undefined)
    render(<EmailProperty action={action} value={[EMAIL, OTHER]} />)

    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: `Remover e-mail ${EMAIL}` }),
      ),
    )

    expect(action).toHaveBeenCalledWith([OTHER], {
      added: null,
      previousValue: [EMAIL, OTHER],
      removed: EMAIL,
    })
  })

  test('no modo inline o gatilho vira campo no lugar, sem popup', async () => {
    const action = mock(() => undefined)
    render(<EmailProperty action={action} editing="inline" value={[]} />)

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar e-mail' })),
    )

    const field = screen.getByRole('textbox', { name: 'Adicionar e-mail' })
    expect(field.getAttribute('data-slot')).toBe('editable-text')
    expect(screen.queryByRole('dialog')).toBeNull()

    await act(async () => {
      fireEvent.focus(field)
      fireEvent.change(field, { target: { value: OTHER } })
      fireEvent.blur(field)
    })

    expect(action).toHaveBeenCalledWith([OTHER], {
      added: OTHER,
      previousValue: [],
      removed: null,
    })
  })

  test('no inline, formato recusado mantém o campo aberto com a mensagem', async () => {
    const action = mock(() => undefined)
    render(<EmailProperty action={action} editing="inline" value={[]} />)

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar e-mail' })),
    )
    const field = screen.getByRole('textbox', { name: 'Adicionar e-mail' })
    await act(async () => {
      fireEvent.focus(field)
      fireEvent.change(field, { target: { value: 'ana@' } })
      fireEvent.blur(field)
    })

    expect(action).toHaveBeenCalledTimes(0)
    expect(screen.getByRole('alert').textContent).toBe(
      'Informe um e-mail válido.',
    )
    // O rascunho continua no campo: corrigir não pode exigir digitar de novo.
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Adicionar e-mail',
        }) as HTMLInputElement
      ).value,
    ).toBe('ana@')
  })

  test('no arranjo `trigger`, o gatilho segue nomeando a propriedade preenchida', async () => {
    render(
      <EmailProperty
        action={() => undefined}
        display="trigger"
        value={[EMAIL, OTHER]}
      />,
    )

    // Lado a lado com outra fileira, dois `+` iguais não dizem a qual pertencem:
    // aqui o gatilho continua mostrando o valor, e o `+1` conta o resto.
    const trigger = screen.getByRole('button', { name: /E-mails: / })
    expect(trigger.textContent).toContain('+1')
    expect(
      screen.queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()

    await act(async () => fireEvent.click(trigger))
    expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toBeTruthy()
  })

  test('o gatilho de adicionar anuncia o popup que abre', async () => {
    render(<EmailProperty action={() => undefined} value={[]} />)

    const trigger = screen.getByRole('button', { name: 'Adicionar e-mail' })
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await act(async () => fireEvent.click(trigger))

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  test('somente leitura mostra os endereços sem caminho de edição', () => {
    render(<EmailProperty readOnly value={[EMAIL]} />)

    expect(
      screen.queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()
    expect(screen.getByText(EMAIL)).toBeTruthy()
  })
})
