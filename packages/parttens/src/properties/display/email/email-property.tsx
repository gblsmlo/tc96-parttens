'use client'

import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { MailIcon, PlusIcon, XIcon } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { z } from 'zod'
import {
  PropertySurface,
  type PropertyVariant,
  propertyBadgeClassName,
} from '../../shared/property-surface'
import { EditableText } from '../editable-text/index'
import { IconLabelProperty } from '../icon-label/icon-label-property'

const emailSchema = z.email('Informe um e-mail válido.')

export interface EmailPropertyActionContext {
  added: string | null
  previousValue: readonly string[]
  removed: string | null
}

export interface EmailPropertyProps {
  value: readonly string[]
  action?: (
    value: readonly string[],
    context: EmailPropertyActionContext,
  ) => void
  /**
   * Fecha o caminho de adição sem tornar a fileira somente leitura: os endereços
   * já existentes continuam removíveis. Serve ao contrato que guarda um e-mail
   * só — com um preenchido, não há segundo a adicionar.
   */
  addDisabled?: boolean
  addLabel?: string
  ariaLabel?: string
  className?: string
  disabled?: boolean
  /**
   * `chips` mostra um chip por valor e colapsa o gatilho no `+`; `trigger`
   * mantém um gatilho único que segue nomeando a propriedade mesmo preenchida.
   * Lado a lado com outra fileira, dois `+` iguais não dizem a qual pertencem —
   * é o caso que `trigger` resolve, e a edição inteira vive no popup.
   */
  display?: 'chips' | 'trigger'
  /**
   * `popover` abre um campo de e-mail sobre o gatilho; `inline` troca o próprio
   * gatilho por um `EditableText` no lugar. A escolha é de quem compõe: o popup
   * cabe na fileira que guarda vários endereços, e o inline serve à superfície
   * que guarda um só e quer editar sem sair da linha.
   */
  editing?: 'inline' | 'popover'
  /**
   * Rótulos das entradas do popup, na ordem de precedência — o cadastro que
   * guarda um e-mail principal e um secundário declara os dois aqui. O tamanho
   * da lista é o teto: com todas preenchidas, não há outra a acrescentar.
   */
  entryLabels?: readonly string[]
  /**
   * Recusa do **consumidor** — duplicata no workspace, unicidade, domínio
   * corporativo. Formato não passa por aqui: o campo já recusa o que não é
   * e-mail antes de chegar ao servidor.
   */
  errorMessage?: string | null
  inputPlaceholder?: string
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly string[]) => void
}

/**
 * E-mails como fileira de chips, na mesma anatomia de `PhoneProperty`: vazia, o
 * gatilho se explica ("Adicionar e-mail"); com endereços na fileira o contexto
 * já está dado e sobra o `+`.
 *
 * O que muda em relação ao telefone é só a entrada — não há país nem formatação
 * a aplicar —, e por isso a entrada tem duas formas: o popup com um campo, ou o
 * `EditableText` no lugar do gatilho.
 */
export function EmailProperty({
  action,
  addDisabled = false,
  addLabel = 'Adicionar e-mail',
  ariaLabel = 'E-mails',
  className,
  disabled = false,
  display = 'chips',
  editing = 'popover',
  entryLabels = ['Principal', 'Secundário'],
  errorMessage = null,
  inputPlaceholder = 'nome@exemplo.com',
  onValueChange,
  placeholder = 'Sem e-mail',
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<EmailPropertyProps>) {
  const [open, setOpen] = useState(false)
  const [editingInline, setEditingInline] = useState(false)
  // O popup edita a lista inteira, não um endereço por vez: quem guarda
  // principal e secundário precisa ver os dois juntos para decidir qual é qual.
  const [drafts, setDrafts] = useState<readonly string[]>([])
  const [errors, setErrors] = useState<readonly (string | null)[]>([])
  // O rascunho do inline vive aqui, e não dentro do `EditableText`: recusado o
  // formato, o campo continua aberto com o que a pessoa escreveu para corrigir.
  const [inlineDraft, setInlineDraft] = useState<string | null>(null)
  const [formatError, setFormatError] = useState<string | null>(null)
  const canUpdate = Boolean(action ?? onValueChange)

  useEffect(() => {
    if (!open) return
    setDrafts(value.length > 0 ? [...value] : [''])
    setErrors([])
  }, [open, value])

  const commit = (
    next: readonly string[],
    context: EmailPropertyActionContext,
  ) => {
    if (action) {
      action(next, context)
      return
    }
    onValueChange?.(next)
  }

  /** Devolve `true` quando o endereço entrou, para o chamador fechar a entrada. */
  const addEmail = (candidate: string): boolean => {
    const parsed = emailSchema.safeParse(candidate.trim())
    if (!parsed.success) {
      setFormatError(
        parsed.error.issues[0]?.message ?? 'Informe um e-mail válido.',
      )
      return false
    }

    const added = parsed.data
    // Repetido não vira chip duplicado: a fileira representa endereços distintos.
    if (value.includes(added)) {
      setFormatError('Este e-mail já está na lista.')
      return false
    }

    commit([...value, added], { added, previousValue: value, removed: null })
    return true
  }

  const save = () => {
    const nextErrors: (string | null)[] = []
    const saved: string[] = []

    for (const draft of drafts) {
      const raw = draft.trim()
      if (!raw) {
        // Linha em branco é linha não preenchida, não erro: guardar só o que tem.
        nextErrors.push(null)
        continue
      }

      const parsed = emailSchema.safeParse(raw)
      if (!parsed.success) {
        nextErrors.push(
          parsed.error.issues[0]?.message ?? 'Informe um e-mail válido.',
        )
        continue
      }
      if (saved.includes(parsed.data)) {
        nextErrors.push('Este e-mail já está na lista.')
        continue
      }

      nextErrors.push(null)
      saved.push(parsed.data)
    }

    setErrors(nextErrors)
    if (nextErrors.some(Boolean)) return

    const added = saved.find((email) => !value.includes(email)) ?? null
    const removed = value.find((email) => !saved.includes(email)) ?? null
    commit(saved, { added, previousValue: value, removed })
    setOpen(false)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    save()
  }

  /**
   * Acrescentar só faz sentido depois que o anterior está completo: uma linha em
   * branco sobre outra em branco não é entrada, é ruído.
   */
  const canAddAnother =
    drafts.length < entryLabels.length &&
    drafts.every((draft) => emailSchema.safeParse(draft.trim()).success)

  const removeEmail = (email: string) =>
    commit(
      value.filter((current) => current !== email),
      { added: null, previousValue: value, removed: email },
    )

  if (readOnly || !canUpdate) {
    return (
      <fieldset
        aria-label={ariaLabel}
        className={cn(
          'm-0 flex min-w-0 flex-wrap gap-1 border-0 p-0',
          className,
        )}
        data-slot="email-property"
        data-variant={variant}
      >
        {value.length > 0 ? (
          value.map((email) => (
            <IconLabelProperty
              icon={MailIcon}
              key={email}
              label={email}
              variant={variant}
            />
          ))
        ) : (
          <PropertySurface muted variant={variant}>
            {placeholder}
          </PropertySurface>
        )}
      </fieldset>
    )
  }

  /** O mesmo formulário para os dois arranjos de gatilho. */
  const entryForm = (
    <PopoverPopup align="start" aria-label={addLabel} className="w-80">
      {/* `noValidate`: a validação é a nossa, com mensagem em pt-BR junto
              do campo. A do navegador bloquearia o submit antes disso e
              mostraria um balão que não sabemos posicionar nem traduzir. */}
      <form className="grid gap-3 p-1" noValidate onSubmit={submit}>
        {drafts.map((draft, index) => (
          <div
            className="group/entry grid gap-1"
            key={entryLabels[index] ?? index}
          >
            {drafts.length > 1 || entryLabels.length > 1 ? (
              <span className="font-medium text-muted-foreground text-xs">
                {entryLabels[index] ?? `${index + 1}`}
              </span>
            ) : null}
            <div className="flex items-center gap-1">
              <Input
                aria-invalid={Boolean(errors[index]) || undefined}
                aria-label={entryLabels[index] ?? addLabel}
                nativeInput
                onChange={(event) => {
                  const next = event.target.value
                  setDrafts(
                    drafts.map((current, at) =>
                      at === index ? next : current,
                    ),
                  )
                  setErrors(
                    errors.map((current, at) =>
                      at === index ? null : current,
                    ),
                  )
                }}
                // O popup do Base UI fecha no `Enter`. Conter o evento no
                // próprio campo — antes de ele subir — é o que deixa salvar
                // pelo teclado sem o popup sumir por baixo.
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return
                  event.preventDefault()
                  event.stopPropagation()
                  save()
                }}
                placeholder={inputPlaceholder}
                type="email"
                value={draft}
              />
              {drafts.length > 1 ? (
                // Só aparece no hover da linha: com os dois preenchidos a
                // fileira fica limpa, e a remoção surge onde o cursor já
                // está. `focus-within` mantém o caminho pelo teclado.
                <Button
                  aria-label={`Remover ${entryLabels[index] ?? ''} e-mail`}
                  className="opacity-0 transition-opacity focus-visible:opacity-100 group-focus-within/entry:opacity-100 group-hover/entry:opacity-100"
                  onClick={() => {
                    setDrafts(drafts.filter((_, at) => at !== index))
                    setErrors(errors.filter((_, at) => at !== index))
                  }}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              ) : null}
            </div>
            {errors[index] ? (
              <p className="text-destructive-foreground text-xs" role="alert">
                {errors[index]}
              </p>
            ) : null}
          </div>
        ))}
        {errorMessage ? (
          <p className="text-destructive-foreground text-xs" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <Button
            disabled={!canAddAnother}
            onClick={() => setDrafts([...drafts, ''])}
            size="sm"
            type="button"
            variant="ghost"
          >
            <PlusIcon aria-hidden="true" />
            Adicionar outro
          </Button>
          <Button size="sm" type="submit" variant="secondary">
            Salvar
          </Button>
        </div>
      </form>
    </PopoverPopup>
  )

  const summary =
    value.length > 1
      ? `${value[0]} +${value.length - 1}`
      : (value[0] ?? placeholder)

  if (display === 'trigger') {
    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <PropertySurface
              aria-label={
                value.length > 0 ? `${ariaLabel}: ${summary}` : ariaLabel
              }
              className={cn('max-w-full', className)}
              muted={value.length === 0}
              render={<button disabled={disabled} type="button" />}
              variant={variant === 'plain' ? 'plain' : 'badge'}
            >
              <MailIcon aria-hidden="true" className="size-3" />
              <span className="truncate">{summary}</span>
            </PropertySurface>
          }
        />
        {entryForm}
      </Popover>
    )
  }

  return (
    <fieldset
      aria-label={ariaLabel}
      className={cn(
        'm-0 flex min-w-0 flex-wrap items-center gap-1 border-0 p-0',
        className,
      )}
      data-editing={editing}
      data-slot="email-property"
      data-variant={variant}
    >
      {value.map((email) => (
        <IconLabelProperty
          className="pe-0"
          icon={MailIcon}
          key={email}
          label={email}
          trailing={
            <button
              aria-label={`Remover e-mail ${email}`}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              disabled={disabled}
              onClick={() => removeEmail(email)}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-3" />
            </button>
          }
        />
      ))}

      {addDisabled ? null : editing === 'inline' ? (
        editingInline ? (
          <span className="inline-flex min-w-0 flex-col gap-0.5">
            {/* O campo ocupa o lugar do gatilho, com largura própria: `w-full`
                aqui quebraria a fileira de pílulas numa segunda linha. */}
            <span className={cn(propertyBadgeClassName, 'w-48')}>
              <EditableText
                ariaLabel={addLabel}
                className="text-sm"
                onCommit={(next) => {
                  const candidate = next?.trim() ?? ''
                  if (!candidate) {
                    setInlineDraft(null)
                    setFormatError(null)
                    setEditingInline(false)
                    return
                  }
                  if (addEmail(candidate)) {
                    setInlineDraft(null)
                    setEditingInline(false)
                    return
                  }
                  // Recusado, o campo fica aberto com o rascunho e a mensagem.
                  setInlineDraft(candidate)
                }}
                placeholder={inputPlaceholder}
                size="sm"
                type="email"
                value={inlineDraft}
              />
            </span>
            {(formatError ?? errorMessage) ? (
              <span
                className="text-destructive-foreground text-xs"
                role="alert"
              >
                {formatError ?? errorMessage}
              </span>
            ) : null}
          </span>
        ) : (
          <AddTrigger
            addLabel={addLabel}
            disabled={disabled}
            hasValue={value.length > 0}
            onClick={() => {
              setFormatError(null)
              setEditingInline(true)
            }}
            placeholder={placeholder}
          />
        )
      ) : (
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger
            render={
              <AddTrigger
                addLabel={addLabel}
                disabled={disabled}
                hasValue={value.length > 0}
                placeholder={placeholder}
              />
            }
          />
          {entryForm}
        </Popover>
      )}
    </fieldset>
  )
}

/**
 * Vazia, a fileira lê como as outras propriedades ausentes — texto esmaecido
 * dizendo que não há endereço —, e o que ela faz fica no nome acessível. Com
 * endereços nela o contexto já está dado e sobra o sinal de adicionar.
 */
function AddTrigger({
  addLabel,
  disabled,
  hasValue,
  onClick,
  placeholder,
}: Readonly<{
  addLabel: string
  disabled: boolean
  hasValue: boolean
  onClick?: () => void
  placeholder: string
}>) {
  return (
    <Button
      aria-label={addLabel}
      className={cn(
        propertyBadgeClassName,
        '[&_svg]:mx-0',
        hasValue ? 'w-6 px-0' : 'gap-1 text-muted-foreground',
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
      variant="ghost"
    >
      {hasValue ? (
        <PlusIcon aria-hidden="true" className="size-3.5" />
      ) : (
        <>
          <MailIcon aria-hidden="true" className="size-3.5" />
          {placeholder}
        </>
      )}
    </Button>
  )
}
