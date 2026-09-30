import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { AttachmentsProperty } = await import('./attachments-property')
const { AttachmentProperty } = await import('./attachment-property')

afterEach(cleanup)

describe('AttachmentProperty', () => {
  test('só oferece remoção quando o consumidor a passa', () => {
    const removed: string[] = []
    const { rerender } = render(
      <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />,
    )
    expect(screen.queryByRole('button', { name: /Remover/ })).toBeNull()

    rerender(
      <AttachmentProperty
        href="#contrato"
        label="Contrato.pdf"
        onRemove={() => removed.push('contrato')}
        removeLabel="Remover Contrato.pdf"
        type="pdf"
      />,
    )
    const remove = screen.getByRole('button', { name: 'Remover Contrato.pdf' })
    // Irmão do link, não filho: botão dentro de âncora seria marcação inválida.
    expect(remove.closest('a')).toBeNull()

    fireEvent.click(remove)
    expect(removed).toEqual(['contrato'])
  })

  test('desenha o tipo à esquerda e nada além do remover à direita', () => {
    render(
      <>
        <AttachmentProperty
          action="download"
          href="#proposta"
          label="Proposta comercial.pdf"
          onRemove={() => undefined}
          removeLabel="Remover Proposta comercial.pdf"
          type="pdf"
        />
        <AttachmentProperty
          href="#gravacao"
          label="Gravação da reunião"
          onRemove={() => undefined}
          removeLabel="Remover Gravação da reunião"
          type="link"
        />
      </>,
    )

    const download = screen.getByRole('link', {
      name: 'Proposta comercial.pdf',
    })
    const anchor = screen.getByRole('link', { name: 'Gravação da reunião' })

    expect(download.getAttribute('data-slot')).toBe('attachment-property-link')
    expect(download.hasAttribute('download')).toBe(true)
    expect(anchor.hasAttribute('download')).toBe(false)
    expect(
      download
        .closest('[data-slot="attachment-property"]')
        ?.querySelector('[data-slot="attachment-type-icon"]')
        ?.getAttribute('data-attachment-type'),
    ).toBe('pdf')

    // `anchor` e `download` decidem como o destino abre, não a afordância da
    // direita: os dois chips terminam no mesmo `×`.
    for (const chip of screen.getAllByRole('link')) {
      const surface = chip.closest('[data-slot="attachment-property"]')
      expect(
        surface?.querySelectorAll('[data-slot="attachment-property-remove"]'),
      ).toHaveLength(1)
    }
  })
})

describe('AttachmentsProperty', () => {
  test('lists the attachments it receives', () => {
    render(
      <AttachmentsProperty ariaLabel="Arquivos">
        <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />
      </AttachmentsProperty>,
    )

    expect(screen.getByText('Contrato.pdf')).toBeTruthy()
  })

  test('keeps the add action visible without a menu to open', () => {
    render(
      <AttachmentsProperty
        action={{ label: 'Anexar arquivo', onSelect: () => undefined }}
        ariaLabel="Arquivos"
      />,
    )

    // Sem `…`: numa fileira vazia o comando é a única afordância, e escondê-lo
    // deixaria o estado inicial sem caminho de entrada.
    expect(screen.getByRole('button', { name: 'Anexar arquivo' })).toBeTruthy()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('runs the action on the first click', () => {
    const chosen: string[] = []
    render(
      <AttachmentsProperty
        action={{
          label: 'Adicionar link',
          onSelect: () => chosen.push('link'),
        }}
        ariaLabel="Links"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar link' }))

    expect(chosen).toEqual(['link'])
  })

  test('hides the action when the row is read-only', () => {
    render(
      <AttachmentsProperty ariaLabel="Arquivos">
        <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />
      </AttachmentsProperty>,
    )

    expect(screen.queryByRole('button')).toBeNull()
  })

  test('names the action by extenso when the row is empty', () => {
    render(
      <AttachmentsProperty
        action={{ label: 'Anexar arquivo', onSelect: () => undefined }}
        ariaLabel="Arquivos"
      />,
    )

    // Um `+` sozinho não diz o que adiciona; sem anexos o nome tem que aparecer.
    expect(screen.getByText('Anexar arquivo')).toBeTruthy()
  })

  test('collapses to a single sign once the row carries attachments', () => {
    render(
      <AttachmentsProperty
        action={{ label: 'Anexar arquivo', onSelect: () => undefined }}
        ariaLabel="Arquivos"
      >
        <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />
      </AttachmentsProperty>,
    )

    expect(screen.queryByText('Anexar arquivo')).toBeNull()
    // O nome some do visível mas fica no rótulo acessível — e o gatilho é um só,
    // como o `+` de TagsProperty. Dois `+` idênticos não diriam qual é qual.
    expect(
      screen.getAllByRole('button', { name: 'Anexar arquivo' }),
    ).toHaveLength(1)
  })

  test('does not run a disabled action', () => {
    const chosen: string[] = []
    render(
      <AttachmentsProperty
        action={{
          disabled: true,
          label: 'Enviando…',
          onSelect: () => chosen.push('file'),
        }}
        ariaLabel="Arquivos"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Enviando…' }))

    expect(chosen).toEqual([])
  })
})
