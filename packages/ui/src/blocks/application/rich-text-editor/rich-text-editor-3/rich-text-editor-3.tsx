'use client'

import { ListMagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  CodePlugin,
  HighlightPlugin,
  StrikethroughPlugin,
} from '@platejs/basic-nodes/react'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@tc96/ui/alert-dialog'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'
import { MenuItem } from '@tc96/ui/menu'
import {
  RichTextEditor,
  type RichTextValue,
  useRichTextEditor,
} from '@tc96/ui/patterns/rich-text-editor'
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from '@tc96/ui/sheet'
import { cn } from '@tc96/utils'
import { useMemo, useState } from 'react'
import {
  acceptAll,
  acceptSuggestion,
  createSuggestionKit,
  finalText,
  goTo,
  originalText,
  rejectAll,
  rejectSuggestion,
  type SuggestionView,
  setActiveSuggestion,
  setSuggestionView,
  suggestionsToHtml,
  useSuggestionState,
  useSuggestions,
} from '../shared/suggestions'
import { defaultRichTextEditor3Labels } from './labels'
import { RedlineReviewPanel } from './redline-parts'
import type {
  RichTextEditor3ExportFormat,
  RichTextEditor3Labels,
  RichTextEditor3NavbarContext,
  RichTextEditor3Props,
} from './types'

const floatingMarks = ['bold', 'italic', 'underline'] as const

export function RichTextEditor3({
  author,
  authors = [],
  className,
  defaultValue,
  formatTime,
  labels: labelsProp,
  navbar,
  onChange,
  onDecision,
  onExport,
}: Readonly<RichTextEditor3Props>) {
  const labels: RichTextEditor3Labels = {
    ...defaultRichTextEditor3Labels,
    ...labelsProp,
    blocks: { ...defaultRichTextEditor3Labels.blocks, ...labelsProp?.blocks },
    review: {
      ...defaultRichTextEditor3Labels.review,
      ...labelsProp?.review,
      kind: {
        ...defaultRichTextEditor3Labels.review.kind,
        ...labelsProp?.review?.kind,
      },
    },
  }
  const roster = useMemo(
    () => [author, ...authors.filter((person) => person.id !== author.id)],
    [author, authors],
  )
  const editor = useRichTextEditor({
    defaultValue,
    features: {
      plugins: [
        ...createSuggestionKit({ author }),
        StrikethroughPlugin.configure({ enabled: false }),
        CodePlugin.configure({ enabled: false }),
        HighlightPlugin.configure({ enabled: false }),
      ],
    },
  })
  const wide = useMediaQuery('(min-width: 1024px)')
  const changes = useSuggestions(editor, roster)
  const { activeId, view } = useSuggestionState(editor)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [confirm, setConfirm] = useState<'accept' | 'reject' | null>(null)
  const activeIndex = changes.findIndex((change) => change.id === activeId)

  const decide = (id: string, action: 'accept' | 'reject') => {
    const change = changes.find((candidate) => candidate.id === id)
    if (action === 'accept') acceptSuggestion(editor, id)
    else rejectSuggestion(editor, id)
    if (id === activeId) setActiveSuggestion(editor, null)
    if (change) onDecision?.({ action, change })
  }

  const decideAll = (action: 'accept' | 'reject') => {
    const snapshot = [...changes]
    if (action === 'accept') acceptAll(editor)
    else rejectAll(editor)
    setActiveSuggestion(editor, null)
    setConfirm(null)
    onDecision?.({ action: `${action}-all`, changes: snapshot })
  }

  const step = (direction: 1 | -1) => {
    if (changes.length === 0) return
    const next =
      activeIndex < 0
        ? direction === 1
          ? 0
          : changes.length - 1
        : (activeIndex + direction + changes.length) % changes.length
    const target = changes[next]
    if (target) goTo(editor, target.id)
  }

  const select = (id: string) => {
    goTo(editor, id)
    setReviewOpen(false)
  }

  const exportAs = (format: RichTextEditor3ExportFormat) => {
    const value = editor.children as RichTextValue
    const content =
      format === 'redline-html'
        ? suggestionsToHtml(value, roster)
        : format === 'final-text'
          ? finalText(value)
          : originalText(value)
    onExport?.(format, content)
  }

  const panel = (showTitle: boolean) => (
    <RedlineReviewPanel
      activeId={activeId}
      changes={changes}
      formatTime={formatTime}
      labels={labels}
      onAccept={(id) => decide(id, 'accept')}
      onAcceptAll={() => setConfirm('accept')}
      onReject={(id) => decide(id, 'reject')}
      onRejectAll={() => setConfirm('reject')}
      onSelect={select}
      onStep={step}
      onViewChange={(next: SuggestionView) => setSuggestionView(editor, next)}
      showTitle={showTitle}
      view={view}
    />
  )

  const context: RichTextEditor3NavbarContext = {
    count: changes.length,
    menuItems: (
      <>
        <MenuItem onClick={() => exportAs('redline-html')}>
          {labels.exportHtml}
        </MenuItem>
        <MenuItem onClick={() => exportAs('final-text')}>
          {labels.exportFinal}
        </MenuItem>
        <MenuItem onClick={() => exportAs('original-text')}>
          {labels.exportOriginal}
        </MenuItem>
      </>
    ),
    status: (
      <>
        <Badge data-slot="redline-count" variant="secondary">
          {labels.count(changes.length)}
        </Badge>
        {wide ? null : (
          <Button
            aria-label={labels.openReview}
            onClick={() => setReviewOpen(true)}
            size="icon-sm"
            variant="ghost"
          >
            <ListMagnifyingGlassIcon aria-hidden="true" />
          </Button>
        )}
      </>
    ),
    view,
  }
  const navbarNode = typeof navbar === 'function' ? navbar(context) : navbar

  return (
    <div
      className={cn(
        'flex w-full flex-col bg-background text-foreground',
        className,
      )}
      data-slot="rich-text-editor-3"
      data-view={view}
    >
      {navbarNode}
      <div className="flex items-start">
        <div className="min-w-0 flex-1 px-6 pt-10 pb-6 sm:px-12">
          <div className="mx-auto max-w-3xl">
            <RichTextEditor
              aria-label={labels.document}
              blockLabels={labels.blocks}
              contentClassName="min-h-96 pb-16 leading-7"
              editor={editor}
              floatingToolbarMarks={floatingMarks}
              onValueChange={onChange}
              placeholder={labels.placeholder}
              readOnly={view !== 'all'}
              slashMenuEmptyLabel={labels.slashMenuEmpty}
              slashMenuLabel={labels.slashMenu}
              toolbarLabel={labels.formatting}
            />
          </div>
        </div>
        {wide ? (
          <aside
            aria-label={labels.reviewTitle}
            className="sticky top-0 max-h-dvh w-80 shrink-0 self-stretch overflow-y-auto border-s"
            data-slot="redline-margin"
          >
            {panel(true)}
          </aside>
        ) : null}
      </div>
      {wide ? null : (
        <Sheet onOpenChange={setReviewOpen} open={reviewOpen}>
          <SheetPopup closeProps={{ 'aria-label': labels.closeReview }}>
            <SheetHeader>
              <SheetTitle>{labels.reviewTitle}</SheetTitle>
              <SheetDescription>{labels.reviewDescription}</SheetDescription>
            </SheetHeader>
            <SheetPanel className="p-0">{panel(false)}</SheetPanel>
          </SheetPopup>
        </Sheet>
      )}
      <AlertDialog
        onOpenChange={(open) => {
          if (!open) setConfirm(null)
        }}
        open={confirm !== null}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === 'accept'
                ? labels.confirmAcceptAllTitle
                : labels.confirmRejectAllTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === 'accept'
                ? labels.confirmAcceptAllDescription(changes.length)
                : labels.confirmRejectAllDescription(changes.length)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button size="sm" variant="outline" />}>
              {labels.cancel}
            </AlertDialogClose>
            <Button
              onClick={() => confirm && decideAll(confirm)}
              size="sm"
              variant={confirm === 'reject' ? 'destructive' : 'default'}
            >
              {confirm === 'accept'
                ? labels.confirmAcceptAll
                : labels.confirmRejectAll}
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  )
}
