'use client'

import { unwrapLink, upsertLink, validateUrl } from '@platejs/link'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Popover, PopoverPopup } from '@tc96/ui/popover'
import { Toggle } from '@tc96/ui/toggle'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { LinkIcon } from 'lucide-react'
import type { TRange } from 'platejs'
import { useEditorRef, useEditorSelector } from 'platejs/react'
import type { FormEvent, ReactElement } from 'react'
import { useState } from 'react'

export interface LinkButtonLabels {
  apply: string
  button: string
  remove: string
  url: string
}

export function LinkButton({
  labels,
}: Readonly<{ labels: LinkButtonLabels }>): ReactElement {
  const editor = useEditorRef()
  const active = useEditorSelector(
    (state) => state.api.some({ match: { type: 'a' } }),
    [],
  )
  const currentUrl = useEditorSelector((state) => {
    const entry = state.api.above({ match: { type: 'a' } })
    return entry ? String(entry[0].url ?? '') : ''
  }, [])
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [at, setAt] = useState<TRange | null>(null)

  const finish = () => {
    setOpen(false)
    editor.tf.focus()
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const url = draft.trim()
    if (!url || !validateUrl(editor, url) || !at) return
    editor.tf.select(at)
    upsertLink(editor, { url })
    finish()
  }

  return (
    <Popover
      onOpenChange={(next) => {
        if (next) {
          setAt(editor.selection)
          setDraft(currentUrl)
        }
        setOpen(next)
      }}
      open={open}
    >
      <ToolbarButton
        onMouseDown={(event) => event.preventDefault()}
        render={
          <Toggle
            aria-label={labels.button}
            onPressedChange={(next) => {
              setAt(editor.selection)
              setDraft(currentUrl)
              setOpen(next)
            }}
            pressed={active}
            size="sm"
          />
        }
      >
        <LinkIcon aria-hidden="true" />
      </ToolbarButton>
      <PopoverPopup
        finalFocus={false}
        side="top"
        sideOffset={8}
        tooltipStyle={false}
      >
        <form className="flex items-center gap-2" onSubmit={submit}>
          <Input
            aria-label={labels.url}
            autoFocus
            inputMode="url"
            onChange={(event) => setDraft(event.target.value)}
            placeholder="https://"
            type="url"
            value={draft}
          />
          <Button size="sm" type="submit">
            {labels.apply}
          </Button>
          {active ? (
            <Button
              onClick={() => {
                if (at) editor.tf.select(at)
                unwrapLink(editor)
                finish()
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              {labels.remove}
            </Button>
          ) : null}
        </form>
      </PopoverPopup>
    </Popover>
  )
}
