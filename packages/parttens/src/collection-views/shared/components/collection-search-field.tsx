'use client'

import { Input } from '@tc96/ui/input'
import { ToolbarInput } from '@tc96/ui/toolbar'
import { SearchIcon } from 'lucide-react'
import { type FormEvent, type ReactElement, useEffect, useState } from 'react'
import { cn } from '../lib/utils'

export interface CollectionSearchFieldProps {
  className?: string
  label?: string
  /**
   * Chamado no submit e ao esvaziar, nunca a cada tecla: quem consome escreve o
   * valor na URL, e escrever por tecla empilha uma entrada de histórico por
   * letra digitada.
   */
  onCommit: (value: string) => void
  placeholder?: string
  /** Valor já confirmado. O rascunho até o submit é local. */
  value?: string
}

/**
 * Busca da coleção, à esquerda da toolbar. Compõe dentro do `CollectionToolbar`:
 * o campo se registra no roving focus da toolbar e não monta fora dela.
 *
 * O rascunho é estado local porque ainda não foi escrito em lugar nenhum — não
 * é cópia do valor confirmado, e por isso não concorre com ele. Quando o valor
 * confirmado muda por fora (botão voltar, link compartilhado), o rascunho o
 * reflete.
 */
export function CollectionSearchField({
  className,
  label = 'Buscar',
  onCommit,
  placeholder = 'Buscar',
  value = '',
}: Readonly<CollectionSearchFieldProps>): ReactElement {
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onCommit(draft.trim())
  }

  return (
    <form className={cn('relative', className)} onSubmit={submit}>
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-2.5 z-1 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <ToolbarInput
        render={
          // O recuo vai no invólucro do Input, não no campo: só o invólucro
          // aceita classe, e é ele que abre o espaço para a lupa.
          <Input
            aria-label={label}
            className="w-56 ps-6 sm:w-64"
            nativeInput
            onChange={(event) => {
              setDraft(event.target.value)
              if (event.target.value === '') onCommit('')
            }}
            placeholder={placeholder}
            type="search"
            value={draft}
          />
        }
      />
    </form>
  )
}
