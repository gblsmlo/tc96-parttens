'use client'

import { copyToClipboard } from '@tc96/helpers/clipboard'
import { cn } from '@tc96/utils'
import { CopyIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { EditableText } from '../editable-text/index'
import {
  IconLabelProperty,
  type IconLabelPropertyIcon,
  type IconLabelPropertyTrailingVisibility,
} from '../icon-label/icon-label-property'

export type TextPropertyIcon = IconLabelPropertyIcon

export type TextPropertyEditing = 'inline' | 'trigger'

export interface TextPropertyProps {
  value: string | null
  /** Nome acessível do gatilho de preenchimento; ausente, usa o `fallback`. */
  addLabel?: string
  ariaLabel?: string
  className?: string
  /**
   * Ausente, o valor não oferece cópia. O rótulo nomeia o que vai para a área de
   * transferência — "Copiar" repetido numa lateral inteira não deixa escolher.
   */
  copyLabel?: string
  /** Mantém `onCommit` mas fecha a escrita: a property volta a ler como leitura. */
  disabled?: boolean
  /**
   * Como a property vazia oferece o preenchimento. `inline` troca o valor por um
   * campo editado no lugar — clicar já é escrever, e é o que serve à unidade que
   * é vitrine de um cadastro. `trigger` mostra o gatilho ao lado, na anatomia do
   * `+` de `TagsProperty`: serve à fileira onde o valor ausente não deve parecer
   * um campo esperando digitação.
   */
  editing?: TextPropertyEditing
  fallback?: string
  icon?: TextPropertyIcon
  /**
   * Exemplo do formato esperado, mostrado dentro do campo. É outra coisa que
   * `fallback`: um diz que não há valor, o outro ensina como o valor se escreve.
   */
  inputPlaceholder?: string
  iconClassName?: string
  /** Visibilidade da afordância de cópia; `hover` a guarda até o ponteiro chegar. */
  trailingVisibility?: IconLabelPropertyTrailingVisibility
  variant?: PropertyVariant
  /** Ausente, a property é leitura: é o estado de quem não pode escrever. */
  onCommit?: (value: string | null) => void
}

export function TextProperty({
  addLabel,
  ariaLabel,
  className,
  copyLabel,
  disabled = false,
  editing = 'trigger',
  fallback = 'Não informado',
  icon: Icon,
  iconClassName,
  inputPlaceholder,
  trailingVisibility,
  value,
  variant = 'badge',
  onCommit,
}: Readonly<TextPropertyProps>) {
  const [editingInline, setEditingInline] = useState(false)
  const text = value?.trim() || null
  // Sem valor não há o que copiar: o ícone prometeria uma ação sobre o fallback.
  const copiable = Boolean(copyLabel && text)
  const editable = Boolean(onCommit) && !disabled

  const commit = (next: string | null) => {
    setEditingInline(false)
    onCommit?.(next)
  }

  // O gatilho não é um campo: enquanto ninguém pediu para escrever, a fileira
  // continua lendo como ausência, e não como formulário em branco.
  if (editable && !text && editing === 'trigger' && !editingInline) {
    return (
      <PropertySurface
        aria-label={addLabel ?? fallback}
        className={cn('gap-1', className)}
        muted
        onClick={() => setEditingInline(true)}
        render={<button type="button" />}
      >
        <PlusIcon aria-hidden="true" className="size-3.5" />
        {fallback}
      </PropertySurface>
    )
  }

  const copyAffordance =
    copiable && text ? (
      <button
        aria-label={copyLabel}
        className="h-full shrink-0 cursor-pointer px-1.5 opacity-80 transition-opacity hover:opacity-100"
        data-slot="text-property-copy"
        // A recusa do navegador — permissão negada, contexto inseguro — não sobe
        // como rejeição não tratada: não há o que dizer ao leitor além de que a
        // cópia não aconteceu.
        onClick={() => void copyToClipboard(text)?.catch(() => undefined)}
        type="button"
      >
        <CopyIcon aria-hidden="true" className="size-3" />
      </button>
    ) : null

  // O campo entra no lugar do rótulo, dentro da mesma superfície: ícone, cópia e
  // tom de ausência continuam sendo os da property, não do campo.
  const label =
    editable && (editing === 'inline' || editingInline) ? (
      <EditableText
        ariaLabel={ariaLabel ?? fallback}
        className="field-sizing-content w-auto min-w-[1ch] max-w-full"
        onCommit={commit}
        placeholder={inputPlaceholder ?? fallback}
        size="sm"
        value={text}
      />
    ) : (
      (text ?? fallback)
    )

  return (
    <IconLabelProperty
      // Com campo, o nome acessível é do próprio campo: um `img` rotulado por
      // fora anunciaria o valor duas vezes.
      ariaLabel={typeof label === 'string' ? ariaLabel : undefined}
      className={cn(copiable && 'pe-0', className)}
      icon={Icon}
      iconClassName={iconClassName}
      label={label}
      muted={!text}
      trailing={copyAffordance}
      trailingVisibility={trailingVisibility}
      variant={variant}
    />
  )
}
