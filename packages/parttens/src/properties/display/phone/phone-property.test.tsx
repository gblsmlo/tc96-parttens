import { afterEach, describe, expect, mock, test } from 'bun:test'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { PhoneProperty } = await import('./phone-property')

afterEach(cleanup)

const PHONE = '+5511987654321'
const OTHER = '+5511912345678'
const PHONE_LABEL = '(11) 98765-4321'

const openAddPopover = async (name: string) => {
  await act(async () => fireEvent.click(screen.getByRole('button', { name })))
}

const fillEntry = async (label: string, phone: string) => {
  const field = await screen.findByRole('textbox', { name: label })
  await act(async () => fireEvent.change(field, { target: { value: phone } }))
  return field
}

const save = async () => {
  await act(async () =>
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' })),
  )
}

describe('PhoneProperty', () => {
  test('vazia, a fileira lê como propriedade ausente e o gatilho se nomeia', () => {
    render(<PhoneProperty action={() => undefined} value={[]} />)

    // O texto é o estado — "Sem telefone", como as demais propriedades vazias —
    // e o que o gatilho faz vive no nome acessível.
    const trigger = screen.getByRole('button', { name: 'Adicionar telefone' })
    expect(trigger.textContent).toContain('Sem telefone')
    expect(trigger.getAttribute('data-empty')).toBe('true')
  })

  test('o gatilho de adicionar anuncia o popup que abre', async () => {
    render(<PhoneProperty action={() => undefined} value={[]} />)

    const trigger = screen.getByRole('button', { name: 'Adicionar telefone' })
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await act(async () => fireEvent.click(trigger))

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  test('com telefone, o gatilho colapsa no sinal de adicionar', () => {
    render(<PhoneProperty action={() => undefined} value={[PHONE]} />)

    const trigger = screen.getByRole('button', { name: 'Adicionar telefone' })
    // O rótulo sai do texto e vira nome acessível: o contexto já está dado pelos
    // chips ao lado, e repetir a palavra por número seria ruído.
    expect(trigger.textContent).toBe('')
    expect(trigger.querySelector('svg')).toBeTruthy()
  })

  test('o popup abre com o que já existe e acrescenta o segundo número', async () => {
    const action = mock(() => undefined)
    render(<PhoneProperty action={action} value={[PHONE]} />)

    await openAddPopover('Adicionar telefone')
    // O principal já vem preenchido: o popup edita a lista, não um número solto.
    expect(
      (screen.getByRole('textbox', { name: 'Principal' }) as HTMLInputElement)
        .value,
    ).toContain('98765-4321')

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar outro' })),
    )
    await fillEntry('Secundário', OTHER)
    await save()

    expect(action).toHaveBeenCalledWith([PHONE, OTHER], {
      added: OTHER,
      previousValue: [PHONE],
      removed: null,
    })
  })

  test('acrescentar o segundo só libera com o primeiro válido', async () => {
    render(<PhoneProperty action={() => undefined} value={[]} />)

    await openAddPopover('Adicionar telefone')
    const another = screen.getByRole('button', { name: 'Adicionar outro' })
    // Em branco não há o que acrescentar…
    expect(another.hasAttribute('disabled')).toBe(true)

    await fillEntry('Principal', '+55119876')
    // …e incompleto ainda vai mudar.
    expect(
      screen
        .getByRole('button', { name: 'Adicionar outro' })
        .hasAttribute('disabled'),
    ).toBe(true)

    await fillEntry('Principal', PHONE)
    expect(
      screen
        .getByRole('button', { name: 'Adicionar outro' })
        .hasAttribute('disabled'),
    ).toBe(false)
  })

  test('com as entradas declaradas preenchidas, não há outra a acrescentar', async () => {
    render(<PhoneProperty action={() => undefined} value={[PHONE, OTHER]} />)

    await openAddPopover('Adicionar telefone')

    expect(
      screen
        .getByRole('button', { name: 'Adicionar outro' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })

  test('número repetido não vira chip duplicado', async () => {
    const action = mock(() => undefined)
    render(<PhoneProperty action={action} value={[PHONE]} />)

    await openAddPopover('Adicionar telefone')
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar outro' })),
    )
    await fillEntry('Secundário', PHONE)
    await save()

    expect(action).toHaveBeenCalledTimes(0)
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Este telefone já está na lista.',
    )
  })

  test('remover devolve a lista sem o número, nomeando qual saiu', async () => {
    const action = mock(() => undefined)
    render(<PhoneProperty action={action} value={[PHONE, OTHER]} />)

    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: `Remover telefone ${PHONE_LABEL}` }),
      ),
    )

    expect(action).toHaveBeenCalledWith([OTHER], {
      added: null,
      previousValue: [PHONE, OTHER],
      removed: PHONE,
    })
  })

  test('a recusa do consumidor aparece no formulário', async () => {
    render(
      <PhoneProperty
        action={() => undefined}
        errorMessage="Já existe outro contato com este telefone."
        value={[]}
      />,
    )

    await openAddPopover('Adicionar telefone')
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Já existe outro contato com este telefone.',
    )
  })

  test('número incompleto é recusado no campo, sem chegar ao consumidor', async () => {
    const action = mock(() => undefined)
    render(<PhoneProperty action={action} value={[]} />)

    await openAddPopover('Adicionar telefone')
    const field = await fillEntry('Principal', '+55119876')
    await save()

    // A biblioteca que formata sabe que o número está incompleto; mandar ao
    // servidor o que já se sabe inválido seria ida e volta desnecessária.
    expect(action).toHaveBeenCalledTimes(0)
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Informe um telefone válido.',
    )
    expect(field.getAttribute('aria-invalid')).toBe('true')
  })

  test('número em formato nacional sai em E.164', async () => {
    const action = mock(() => undefined)
    render(<PhoneProperty action={action} value={[]} />)

    await openAddPopover('Adicionar telefone')
    // Digitado como se lê no Brasil; o valor que sai é o que o contrato guarda.
    await fillEntry('Principal', '(11) 98765-4321')
    await save()

    expect(action).toHaveBeenCalledWith(['+5511987654321'], {
      added: '+5511987654321',
      previousValue: [],
      removed: null,
    })
  })

  test('no arranjo `trigger`, o gatilho segue nomeando a propriedade preenchida', async () => {
    render(
      <PhoneProperty
        action={() => undefined}
        display="trigger"
        value={[PHONE, OTHER]}
      />,
    )

    // Lado a lado com outra fileira, dois `+` iguais não dizem a qual pertencem:
    // aqui o gatilho continua mostrando o valor, e o `+1` conta o resto.
    const trigger = screen.getByRole('button', {
      name: `Telefones: ${PHONE_LABEL} +1`,
    })
    expect(trigger.textContent).toBe(`${PHONE_LABEL} +1`)
    expect(
      screen.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBeNull()

    await act(async () => fireEvent.click(trigger))
    expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toBeTruthy()
  })

  test('sem ação, a fileira é leitura — nem adicionar, nem remover', () => {
    render(<PhoneProperty value={[PHONE]} />)

    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText(PHONE_LABEL)).toBeTruthy()
    expect(screen.queryByText(PHONE)).toBeNull()
  })

  test('no arranjo `trigger`, o gatilho segue nomeando a propriedade preenchida', async () => {
    render(
      <PhoneProperty
        action={() => undefined}
        display="trigger"
        value={[PHONE, OTHER]}
      />,
    )

    // Lado a lado com outra fileira, dois `+` iguais não dizem a qual pertencem:
    // aqui o gatilho continua mostrando o valor, e o `+1` conta o resto.
    const trigger = screen.getByRole('button', { name: /Telefones: / })
    expect(trigger.textContent).toContain('+1')
    expect(
      screen.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBeNull()

    await act(async () => fireEvent.click(trigger))
    expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toBeTruthy()
  })

  test('somente leitura e vazia, diz a ausência em vez de ficar em branco', () => {
    render(<PhoneProperty value={[]} />)

    expect(screen.getByText('Sem telefone')).toBeTruthy()
  })

  test('`addDisabled` fecha só o caminho de adição; remover continua', () => {
    const action = mock(() => undefined)
    render(<PhoneProperty action={action} addDisabled value={[PHONE]} />)

    // O contrato que guarda um número só não tem segundo a adicionar, mas o
    // número existente continua removível.
    expect(
      screen.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBeNull()
    expect(
      screen.getByRole('button', { name: `Remover telefone ${PHONE_LABEL}` }),
    ).toBeTruthy()
  })

  test('Enter no campo salva sem exigir o mouse', async () => {
    const action = mock(() => undefined)
    render(<PhoneProperty action={action} value={[]} />)

    await openAddPopover('Adicionar telefone')
    const field = await fillEntry('Principal', PHONE)
    await act(async () => fireEvent.keyDown(field, { key: 'Enter' }))

    expect(action).toHaveBeenCalledWith([PHONE], {
      added: PHONE,
      previousValue: [],
      removed: null,
    })
  })
})
