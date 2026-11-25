import { KeyboardIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { richTextStats } from '@tc96/ui/helpers/rich-text'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { useEditorSelector } from 'platejs/react'
import type { RichTextEditor1Labels, RichTextEditor1SaveState } from './types'

function ShortcutsPopover({
  labels,
}: Readonly<{ labels: RichTextEditor1Labels }>) {
  const { shortcuts } = labels

  return (
    <Popover>
      <PopoverTrigger render={<Button size="sm" variant="ghost" />}>
        <KeyboardIcon aria-hidden="true" />
        {shortcuts.trigger}
      </PopoverTrigger>
      <PopoverPopup align="end" aria-label={shortcuts.title} side="top">
        <div className="flex w-72 flex-col gap-4">
          <section aria-label={shortcuts.shortcutsTitle}>
            <h3 className="mb-2 font-medium text-sm">
              {shortcuts.shortcutsTitle}
            </h3>
            <ul className="flex flex-col gap-1.5">
              {shortcuts.shortcutList.map((shortcut) => (
                <li
                  className="flex items-center justify-between gap-3 text-sm"
                  key={shortcut.id}
                >
                  <span>{shortcut.label}</span>
                  <KbdGroup>
                    {shortcut.keys.map((key) => (
                      <Kbd key={key}>{key}</Kbd>
                    ))}
                  </KbdGroup>
                </li>
              ))}
            </ul>
          </section>
          <section aria-label={shortcuts.markdownTitle}>
            <h3 className="mb-2 font-medium text-sm">
              {shortcuts.markdownTitle}
            </h3>
            <ul className="flex flex-col gap-1.5">
              {shortcuts.markdownRules.map((rule) => (
                <li
                  className="flex items-center justify-between gap-3 text-sm"
                  key={rule.id}
                >
                  <span>{rule.label}</span>
                  <KbdGroup>
                    <Kbd>{rule.syntax}</Kbd>
                    <Kbd>Espaço</Kbd>
                  </KbdGroup>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </PopoverPopup>
    </Popover>
  )
}

export function RichTextEditor1Footer({
  labels,
  saveState,
}: Readonly<{
  labels: RichTextEditor1Labels
  saveState: RichTextEditor1SaveState | null
}>) {
  const stats = useEditorSelector(
    (editor) => richTextStats(editor.children as RichTextValue),
    [],
  )

  return (
    <footer
      className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 border-t bg-background px-4 py-2 text-muted-foreground text-sm"
      data-slot="rich-text-editor-1-footer"
    >
      <p className="flex flex-wrap items-center gap-x-3 tabular-nums">
        <span data-stat="words">{labels.words(stats.words)}</span>
        <span data-stat="characters">
          {labels.characters(stats.charactersWithSpaces)}
        </span>
        <span data-stat="reading">
          {labels.readingTime(stats.readingMinutes)}
        </span>
        {saveState ? (
          <span data-save-state={saveState}>{labels.saveState[saveState]}</span>
        ) : null}
      </p>
      <ShortcutsPopover labels={labels} />
    </footer>
  )
}
