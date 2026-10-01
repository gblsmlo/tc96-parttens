'use client'

import { cn } from '@tc96/utils'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

export type EditableTextSize = 'sm' | 'base' | 'lg' | 'xl'

export interface EditableTextProps {
  ariaLabel: string
  className?: string
  /**
   * Valor literal que a entidade guarda para "vazio" — some ao focar, para não
   * ser apagado caractere por caractere por quem vai nomear o registro.
   */
  emptyValue?: string
  /** Aceita quebra de linha e cresce com o conteúdo; `Enter` deixa de comitar. */
  multiline?: boolean
  placeholder?: string
  /** Renderiza o valor como texto, sem campo. */
  readOnly?: boolean
  /**
   * Rascunho vazio volta para o valor confirmado em vez de comitar `null` — para
   * o campo que o contrato exige não-vazio.
   */
  revertWhenEmpty?: boolean
  /** Escala do texto: `sm` 14px, `base` 1rem, `lg` 1.5rem, `xl` 2rem. */
  size?: EditableTextSize
  type?: 'email' | 'text'
  value: string | null
  /** Recebe `null` quando o campo é esvaziado, salvo sob `revertWhenEmpty`. */
  onCommit: (value: string | null) => void
}

const sizeClassName: Record<EditableTextSize, string> = {
  base: 'text-base',
  lg: 'text-2xl',
  sm: 'text-sm',
  // 2rem não tem token na escala do Tailwind: `text-3xl` é 1.875rem.
  xl: 'text-[2rem]',
}

// O campo é editado no lugar do texto: qualquer moldura ao focar denunciaria a
// caixa que a superfície esconde. O cursor é o indicador de foco.
const fieldClassName =
  'w-full bg-transparent outline-none placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none'

/**
 * Campo de texto editado no lugar: rascunho local, commit no `blur` — um PATCH
 * por caractere inundaria a API, e uma colisão de unicidade só pode ser julgada
 * sobre o valor final. `Enter` tira o foco, e é o `blur` que persiste; `Escape`
 * devolve o rascunho ao valor confirmado.
 *
 * Não conhece campo, mutação nem rota: recebe o valor e devolve o commit. A
 * escala do texto é `size`; peso, família e largura ficam com quem compõe.
 */
export function EditableText({
  ariaLabel,
  className,
  emptyValue,
  multiline = false,
  placeholder,
  readOnly = false,
  revertWhenEmpty = false,
  size = 'base',
  type = 'text',
  value,
  onCommit,
}: Readonly<EditableTextProps>) {
  const confirmed = value ?? ''
  const [draft, setDraft] = useState(confirmed)
  // O `blur` que o `Escape` provoca leria um state ainda não aplicado; o commit
  // lê o rascunho por referência para decidir sobre o valor já revertido.
  const draftRef = useRef(draft)
  // O rascunho como estava ao focar. "Sujo" é o que a pessoa digitou — limpar o
  // `emptyValue` na entrada é obra nossa, e não pode contar como edição dela.
  const draftAtFocus = useRef(draft)
  const isFocused = useRef(false)

  const writeDraft = (next: string) => {
    draftRef.current = next
    setDraft(next)
  }

  useEffect(() => {
    // Um refetch não pisa em cima de quem está digitando.
    if (isFocused.current) return
    draftRef.current = value ?? ''
    setDraft(value ?? '')
  }, [value])

  // O default do domínio não é um nome que alguém escreveu: enquanto ele estiver
  // ali, o campo lê como espaço reservado, e não como valor confirmado.
  const showsEmptyValue = !draft || draft === emptyValue
  const emptyClassName = showsEmptyValue ? 'text-muted-foreground' : undefined

  if (readOnly) {
    return (
      <span
        className={cn(sizeClassName[size], emptyClassName, className)}
        data-slot="editable-text"
      >
        {value ?? placeholder}
      </span>
    )
  }

  const isDirty = () => draftRef.current !== draftAtFocus.current

  const commit = () => {
    if (!isDirty()) return writeDraft(confirmed)
    const next = draftRef.current.trim()
    if (!next && revertWhenEmpty) return writeDraft(confirmed)
    // `''` não é "sem valor" para o contrato — a ausência é `null`.
    if (next !== confirmed) onCommit(next || null)
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Escape') {
      // Sem rascunho sujo o evento sobe: dentro de um diálogo, o primeiro
      // `Escape` cancela a edição e só o segundo fecha o diálogo.
      if (!isDirty()) return
      event.stopPropagation()
      writeDraft(confirmed)
      event.currentTarget.blur()
      return
    }

    if (event.key === 'Enter' && !multiline) {
      // Sair do campo é o que persiste — comitar aqui duplicaria com o `blur`.
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  const fieldProps = {
    'aria-label': ariaLabel,
    'data-slot': 'editable-text',
    onBlur: () => {
      isFocused.current = false
      commit()
    },
    onFocus: () => {
      isFocused.current = true
      if (emptyValue !== undefined && draftRef.current === emptyValue)
        writeDraft('')
      draftAtFocus.current = draftRef.current
    },
    onKeyDown: handleKeyDown,
    placeholder,
    value: draft,
  }

  if (multiline) {
    return (
      <textarea
        {...fieldProps}
        className={cn(
          'field-sizing-content resize-none',
          fieldClassName,
          sizeClassName[size],
          emptyClassName,
          className,
        )}
        onChange={(event) => writeDraft(event.target.value)}
        rows={1}
      />
    )
  }

  return (
    <input
      {...fieldProps}
      className={cn(
        fieldClassName,
        sizeClassName[size],
        emptyClassName,
        className,
      )}
      onChange={(event) => writeDraft(event.target.value)}
      type={type}
    />
  )
}
