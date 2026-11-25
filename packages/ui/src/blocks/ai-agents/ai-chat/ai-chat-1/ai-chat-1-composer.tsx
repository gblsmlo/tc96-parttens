import {
  ArrowUpIcon,
  BrainIcon,
  CaretUpDownIcon,
  GlobeIcon,
  MicrophoneIcon,
  PlusIcon,
  StopIcon,
  XIcon,
} from '@phosphor-icons/react'
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
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Toggle } from '@tc96/ui/toggle'
import { type ReactElement, useState } from 'react'
import { AiChat1ChipLabel } from './ai-chat-1-message'
import type {
  AiChat1AttachAction,
  AiChat1Chip,
  AiChat1Labels,
  AiChat1Model,
} from './types'

export interface AiChat1ComposerProps {
  attachActions: readonly AiChat1AttachAction[]
  chips: readonly AiChat1Chip[]
  disabled: boolean
  extendedThinking?: boolean | undefined
  labels: AiChat1Labels
  listening?: boolean | undefined
  model?: string | undefined
  models: readonly AiChat1Model[]
  onAttach?: ((actionId: string) => void) | undefined
  onChipRemove?: ((chipId: string) => void) | undefined
  onExtendedThinkingChange?: ((enabled: boolean) => void) | undefined
  onListeningChange?: ((listening: boolean) => void) | undefined
  onModelChange?: ((modelId: string) => void) | undefined
  onSend: (text: string) => void
  onStop?: (() => void) | undefined
  onWebSearchChange?: ((enabled: boolean) => void) | undefined
  responding: boolean
  webSearch?: boolean | undefined
}

export function AiChat1Composer({
  attachActions,
  chips,
  disabled,
  extendedThinking = false,
  labels,
  listening = false,
  model,
  models,
  onAttach,
  onChipRemove,
  onExtendedThinkingChange,
  onListeningChange,
  onModelChange,
  onSend,
  onStop,
  onWebSearchChange,
  responding,
  webSearch = false,
}: Readonly<AiChat1ComposerProps>): ReactElement {
  const [draft, setDraft] = useState<ComposerValue>([])
  const currentModel = models.find((item) => item.id === model) ?? models[0]

  return (
    <div className="flex flex-col gap-2" data-slot="ai-chat-composer">
      <Composer
        onSubmit={(value: ComposerValue) => {
          const text = getComposerText(value).trim()
          if (!text || responding || disabled) return
          setDraft([])
          onSend(text)
        }}
        onValueChange={setDraft}
        submitDisabled={responding || disabled}
        value={draft}
      >
        {chips.length > 0 ? (
          <ul
            aria-label={labels.chips}
            className="flex flex-wrap gap-1.5 px-2 pt-2"
            data-slot="ai-chat-chips"
          >
            {chips.map((chip) => (
              <li
                className="flex max-w-56 items-center gap-1 rounded-md bg-accent py-0.5 ps-2 pe-0.5 text-accent-foreground text-xs"
                key={chip.id}
              >
                <AiChat1ChipLabel chip={chip} />
                {onChipRemove ? (
                  <Button
                    aria-label={labels.removeChip(chip.label)}
                    onClick={() => onChipRemove(chip.id)}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        <ComposerInput
          aria-label={labels.prompt}
          placeholder={labels.promptPlaceholder}
          render={<textarea />}
        />
        <ComposerActions>
          <ComposerActionGroup>
            {attachActions.length > 0 && onAttach ? (
              <Menu>
                <MenuTrigger
                  render={
                    <Button
                      aria-label={labels.attach}
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                >
                  <PlusIcon aria-hidden="true" />
                </MenuTrigger>
                <MenuPopup align="start" side="top">
                  {attachActions.map((action) => (
                    <MenuItem
                      key={action.id}
                      onClick={() => onAttach(action.id)}
                    >
                      {action.icon}
                      {action.label}
                    </MenuItem>
                  ))}
                </MenuPopup>
              </Menu>
            ) : null}
            {onWebSearchChange ? (
              <Toggle
                onPressedChange={onWebSearchChange}
                pressed={webSearch}
                size="sm"
              >
                <GlobeIcon aria-hidden="true" />
                <span className="max-sm:sr-only">{labels.webSearch}</span>
              </Toggle>
            ) : null}
            {onExtendedThinkingChange ? (
              <Toggle
                onPressedChange={onExtendedThinkingChange}
                pressed={extendedThinking}
                size="sm"
              >
                <BrainIcon aria-hidden="true" />
                <span className="max-sm:sr-only">
                  {labels.extendedThinking}
                </span>
              </Toggle>
            ) : null}
          </ComposerActionGroup>
          <ComposerActionGroup align="end">
            {currentModel && onModelChange ? (
              <Menu>
                <MenuTrigger
                  data-slot="ai-chat-model"
                  render={<Button size="sm" variant="ghost" />}
                >
                  <span className="sr-only">{labels.model}</span>
                  {currentModel.label}
                  <CaretUpDownIcon aria-hidden="true" />
                </MenuTrigger>
                <MenuPopup align="end" className="min-w-56" side="top">
                  <MenuRadioGroup
                    aria-label={labels.model}
                    onValueChange={(next) => onModelChange(String(next))}
                    value={currentModel.id}
                  >
                    {models.map((item) => (
                      <MenuRadioItem closeOnClick key={item.id} value={item.id}>
                        <span className="flex flex-col">
                          {item.label}
                          {item.description ? (
                            <span className="text-muted-foreground text-xs">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                      </MenuRadioItem>
                    ))}
                  </MenuRadioGroup>
                </MenuPopup>
              </Menu>
            ) : null}
            {onListeningChange ? (
              <Toggle
                aria-label={labels.microphone}
                onPressedChange={onListeningChange}
                pressed={listening}
                size="sm"
              >
                <MicrophoneIcon aria-hidden="true" />
                {listening ? (
                  <span aria-hidden="true">{labels.listening}</span>
                ) : null}
              </Toggle>
            ) : null}
            {responding && onStop ? (
              <Button
                aria-label={labels.stop}
                onClick={onStop}
                size="icon-sm"
                variant="outline"
              >
                <StopIcon aria-hidden="true" />
              </Button>
            ) : (
              <ComposerSubmit
                render={
                  <Button aria-label={labels.send} size="icon-sm">
                    <ArrowUpIcon aria-hidden="true" />
                  </Button>
                }
              />
            )}
          </ComposerActionGroup>
        </ComposerActions>
      </Composer>
      <p className="text-center text-muted-foreground text-xs">
        {labels.disclaimer}
      </p>
    </div>
  )
}
