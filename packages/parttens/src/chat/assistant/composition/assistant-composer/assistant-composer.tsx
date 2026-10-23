'use client'

import { Button } from '@tc96/ui/button'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from '@tc96/ui/composer'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { ArrowUpIcon, PaperclipIcon } from 'lucide-react'
import { type ReactElement, useState } from 'react'
import { assistantDefaultPlaceholder, assistantDraftText } from '../../core'
import { assistantPlaceholderClassName } from '../../lib/variants'
import { useAssistantLabels } from '../../store/assistant-context'
import type { AssistantComposerProps } from '../../types'

export function AssistantComposer({
  className,
  onAttach,
  onSend,
  placeholder = assistantDefaultPlaceholder,
}: Readonly<AssistantComposerProps>): ReactElement {
  const labels = useAssistantLabels()
  const [draft, setDraft] = useState<ComposerValue>([])

  return (
    <Composer
      className={className}
      data-slot="assistant-composer"
      onSubmit={(value: ComposerValue) => {
        const text = assistantDraftText(getComposerText(value))
        if (text === null) return
        setDraft([])
        onSend(text)
      }}
      onValueChange={setDraft}
      value={draft}
    >
      <ComposerInput
        aria-label={labels.composer}
        className={assistantPlaceholderClassName}
        placeholder={placeholder}
        render={<textarea />}
      />
      <ComposerActions>
        <ComposerActionGroup>
          {onAttach ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label={labels.attach}
                    onClick={onAttach}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <PaperclipIcon aria-hidden="true" />
                  </Button>
                }
              />
              <TooltipPopup>{labels.attach}</TooltipPopup>
            </Tooltip>
          ) : null}
        </ComposerActionGroup>
        <ComposerActionGroup align="end">
          <ComposerSubmit
            render={
              <Button aria-label={labels.send} size="icon-sm">
                <ArrowUpIcon aria-hidden="true" />
              </Button>
            }
          />
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  )
}
