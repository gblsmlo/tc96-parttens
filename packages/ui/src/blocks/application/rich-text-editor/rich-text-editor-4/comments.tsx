'use client'

import { ChatCenteredDotsIcon } from '@phosphor-icons/react'
import { getCommentKey, getCommentKeyId, isCommentKey } from '@platejs/comment'
import { CommentPlugin } from '@platejs/comment/react'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { Label } from '@tc96/ui/label'
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
} from '@tc96/ui/popover'
import { Switch } from '@tc96/ui/switch'
import { Textarea } from '@tc96/ui/textarea'
import { toastManager } from '@tc96/ui/toast'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import { KEYS, RangeApi, type RangeRef, TextApi, type TRange } from 'platejs'
import {
  type PlateEditor,
  PlateLeaf,
  type PlateLeafProps,
  useEditorRef,
  useEditorSelector,
} from 'platejs/react'
import {
  createContext,
  type ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type * as Y from 'yjs'
import {
  addReply,
  createThread,
  getComments,
  readThreads,
  setResolved,
} from './comments-store'
import type {
  RichTextEditor4Labels,
  RichTextEditor4Thread,
  RichTextEditor4User,
} from './types'

type CommentLabels = RichTextEditor4Labels['comments']

type PopoverState =
  | { kind: 'compose'; ref: RangeRef }
  | { anchor: Element | null; id: string; kind: 'thread' }
  | null

interface CommentsContextValue {
  activeId: string | null
  beginCompose: () => void
  labels: CommentLabels
  openThread: (id: string, anchor?: Element | null) => void
  popover: PopoverState
  resolvedIds: ReadonlySet<string>
  threads: RichTextEditor4Thread[]
  user: RichTextEditor4User
}

const CommentsContext = createContext<CommentsContextValue | null>(null)

const useComments = (): CommentsContextValue => {
  const value = useContext(CommentsContext)
  if (!value) throw new Error('Comments parts need the comments provider')
  return value
}

const draftKey = 'comment_draft'

const idsOf = (leaf: Record<string, unknown>): string[] =>
  Object.keys(leaf)
    .filter((key) => isCommentKey(key) && key !== draftKey)
    .map((key) => getCommentKeyId(key))

export function CommentLeaf(props: PlateLeafProps): ReactElement {
  const context = useContext(CommentsContext)
  const ids = idsOf(props.leaf as Record<string, unknown>)
  const open = ids.some((id) => !context?.resolvedIds.has(id))
  const active = ids.some((id) => id === context?.activeId)
  return (
    <PlateLeaf
      {...props}
      as="mark"
      className={cn(
        'rounded-xs text-inherit',
        open
          ? 'border-primary/60 border-b-2 bg-primary/15'
          : 'border-muted-foreground/60 border-b border-dashed bg-transparent',
        active && 'bg-primary/30',
      )}
      attributes={{ ...props.attributes, 'data-comment-id': ids.join(' ') }}
    />
  )
}

export function commentPlugins() {
  return [CommentPlugin.withComponent(CommentLeaf)]
}

const initialsOf = (name: string) => getInitials(name)

const timeFormat = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export interface CommentsController {
  context: CommentsContextValue
  threads: RichTextEditor4Thread[]
}

export function useCommentsController({
  doc,
  editor,
  labels,
  now,
  onCommentsChange,
  user,
}: Readonly<{
  doc: Y.Doc
  editor: PlateEditor
  labels: CommentLabels
  now: () => number
  onCommentsChange?: (threads: RichTextEditor4Thread[]) => void
  user: RichTextEditor4User
}>) {
  const [threads, setThreads] = useState<RichTextEditor4Thread[]>([])
  const [popover, setPopover] = useState<PopoverState>(null)
  const counter = useRef(0)
  const signature = useRef('')
  const onChangeRef = useRef(onCommentsChange)
  onChangeRef.current = onCommentsChange

  const refresh = useCallback(() => {
    const next = readThreads(doc, (id) =>
      editor.getApi(CommentPlugin).comment.has({ id }),
    )
    const key = JSON.stringify(next)
    if (key === signature.current) return
    signature.current = key
    setThreads(next)
    onChangeRef.current?.(next)
  }, [doc, editor])

  useEffect(() => {
    const comments = getComments(doc)
    comments.observeDeep(refresh)
    doc.on('update', refresh)
    refresh()
    return () => {
      comments.unobserveDeep(refresh)
      doc.off('update', refresh)
    }
  }, [doc, refresh])

  const closePopover = useCallback(() => {
    setPopover((current) => {
      if (current?.kind === 'compose') current.ref.unref()
      return null
    })
  }, [])

  const beginCompose = useCallback(() => {
    const selection = editor.selection
    if (!selection || RangeApi.isCollapsed(selection)) return
    setPopover((current) => {
      if (current?.kind === 'compose') current.ref.unref()
      return {
        kind: 'compose',
        ref: editor.api.rangeRef(selection, { affinity: 'inward' }),
      }
    })
  }, [editor])

  const openThread = useCallback(
    (id: string, anchor?: Element | null) => {
      const root = editor.api.toDOMNode(editor)
      const element =
        anchor ??
        root?.querySelector(`[data-comment-id~="${CSS.escape(id)}"]`) ??
        null
      setPopover((current) => {
        if (current?.kind === 'compose') current.ref.unref()
        return { anchor: element, id, kind: 'thread' }
      })
    },
    [editor],
  )

  useEffect(() => {
    const root = editor.api.toDOMNode(editor)
    if (!root) return
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(
        '[data-comment-id]',
      )
      const id = target?.getAttribute('data-comment-id')?.split(' ')[0]
      if (target && id) openThread(id, target)
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  })

  const submitThread = useCallback(
    (body: string) => {
      if (popover?.kind !== 'compose') return
      const range = popover.ref.current
      if (!range) {
        closePopover()
        return
      }
      counter.current += 1
      const id = `thread-${doc.clientID}-${counter.current}-${now()}`
      const quote = editor.api.string(range)
      editor.tf.setNodes(
        { [KEYS.comment]: true, [getCommentKey(id)]: true },
        { at: range, match: (node) => TextApi.isText(node), split: true },
      )
      createThread(doc, { author: user, body, createdAt: now(), id, quote })
      closePopover()
    },
    [closePopover, doc, editor, now, popover, user],
  )

  const reply = useCallback(
    (id: string, body: string) =>
      addReply(doc, id, { author: user, body, createdAt: now() }),
    [doc, now, user],
  )

  const resolve = useCallback(
    (id: string) => {
      setResolved(doc, id, true, user)
      const toast = toastManager.add({
        actionProps: {
          children: labels.undo,
          onClick: () => {
            setResolved(doc, id, false)
            toastManager.close(toast)
          },
        },
        title: labels.resolved,
      })
      closePopover()
    },
    [closePopover, doc, labels, user],
  )

  const reopen = useCallback(
    (id: string) => {
      setResolved(doc, id, false)
      toastManager.add({ title: labels.reopened })
    },
    [doc, labels],
  )

  const resolvedIds = useMemo(
    () => new Set(threads.filter((t) => t.resolved).map((t) => t.id)),
    [threads],
  )

  const context = useMemo<CommentsContextValue>(
    () => ({
      activeId: popover?.kind === 'thread' ? popover.id : null,
      beginCompose,
      labels,
      openThread,
      popover,
      resolvedIds,
      threads,
      user,
    }),
    [beginCompose, labels, openThread, popover, resolvedIds, threads, user],
  )

  return {
    actions: { closePopover, reopen, reply, resolve, submitThread },
    context,
    threads,
  }
}

export type CommentsActions = ReturnType<
  typeof useCommentsController
>['actions']

export const CommentsProvider = CommentsContext.Provider

export function CommentToolbarButton({
  label,
}: Readonly<{ label: string }>): ReactElement {
  const { beginCompose } = useComments()
  const canComment = useEditorSelector(
    (editor) => !!editor.selection && RangeApi.isExpanded(editor.selection),
    [],
  )
  return (
    <ToolbarButton
      aria-label={label}
      disabled={!canComment}
      onClick={beginCompose}
      onMouseDown={(event) => event.preventDefault()}
      render={<Button size="icon-sm" variant="ghost" />}
    >
      <ChatCenteredDotsIcon aria-hidden="true" />
    </ToolbarButton>
  )
}

function Message({
  author,
  body,
  createdAt,
}: Readonly<{
  author: RichTextEditor4User
  body: string
  createdAt: number
}>): ReactElement {
  return (
    <li className="flex gap-2" data-slot="comment-message">
      <Avatar className="[--avatar-size:--spacing(6)]">
        <AvatarFallback>{initialsOf(author.name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="flex items-baseline gap-2 text-sm">
          <span className="font-medium">{author.name}</span>
          <time
            className="text-muted-foreground text-xs"
            dateTime={new Date(createdAt).toISOString()}
          >
            {timeFormat.format(createdAt)}
          </time>
        </p>
        <p className="whitespace-pre-wrap break-words text-sm">{body}</p>
      </div>
    </li>
  )
}

function Quote({ children }: Readonly<{ children: string }>): ReactElement {
  return (
    <blockquote className="line-clamp-3 border-primary/60 border-s-2 ps-2 text-muted-foreground text-sm">
      {children}
    </blockquote>
  )
}

function ComposePanel({
  actions,
  labels,
  quote,
}: Readonly<{
  actions: CommentsActions
  labels: CommentLabels
  quote: string
}>): ReactElement {
  const [body, setBody] = useState('')
  return (
    <form
      className="flex w-72 flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (body.trim()) actions.submitThread(body.trim())
      }}
    >
      <PopoverTitle className="text-sm">{labels.newThread}</PopoverTitle>
      <Quote>{quote}</Quote>
      <Textarea
        aria-label={labels.composer}
        autoFocus
        onChange={(event) => setBody(event.target.value)}
        placeholder={labels.composer}
        value={body}
      />
      <div className="flex justify-end gap-2">
        <Button onClick={actions.closePopover} size="sm" variant="ghost">
          {labels.cancel}
        </Button>
        <Button disabled={!body.trim()} size="sm" type="submit">
          {labels.send}
        </Button>
      </div>
    </form>
  )
}

function ThreadPanel({
  actions,
  labels,
  thread,
}: Readonly<{
  actions: CommentsActions
  labels: CommentLabels
  thread: RichTextEditor4Thread
}>): ReactElement {
  const [body, setBody] = useState('')
  return (
    <div className="flex w-80 flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <PopoverTitle className="text-sm">{labels.thread}</PopoverTitle>
        <Badge variant={thread.resolved ? 'success' : 'info'}>
          {thread.resolved ? labels.resolvedBadge : labels.open}
        </Badge>
      </div>
      <PopoverDescription className="sr-only">
        {thread.quote}
      </PopoverDescription>
      <Quote>{thread.quote}</Quote>
      <ol className="flex flex-col gap-3">
        {thread.messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
      </ol>
      {thread.resolved ? (
        <div className="flex justify-end">
          <Button
            onClick={() => actions.reopen(thread.id)}
            size="sm"
            variant="outline"
          >
            {labels.reopen}
          </Button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            if (!body.trim()) return
            actions.reply(thread.id, body.trim())
            setBody('')
          }}
        >
          <Textarea
            aria-label={labels.replyComposer}
            onChange={(event) => setBody(event.target.value)}
            placeholder={labels.replyComposer}
            value={body}
          />
          <div className="flex justify-between gap-2">
            <Button
              onClick={() => actions.resolve(thread.id)}
              size="sm"
              variant="outline"
            >
              {labels.resolve}
            </Button>
            <Button disabled={!body.trim()} size="sm" type="submit">
              {labels.reply}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

const virtualAnchor = (getRect: () => DOMRect | undefined) => ({
  getBoundingClientRect: () => getRect() ?? new DOMRect(),
})

export function CommentPopovers({
  actions,
}: Readonly<{ actions: CommentsActions }>): ReactElement | null {
  const editor = useEditorRef()
  const { beginCompose, labels, popover, threads } = useComments()
  const selectionKey = useEditorSelector(
    (current) =>
      current.selection && RangeApi.isExpanded(current.selection)
        ? JSON.stringify(current.selection)
        : null,
    [],
  )
  const [offer, setOffer] = useState<TRange | null>(null)
  const dismissed = useRef<string | null>(null)

  useEffect(() => {
    if (!selectionKey) {
      setOffer(null)
      dismissed.current = null
      return
    }
    if (selectionKey === dismissed.current) return
    if (editor.api.isFocused()) setOffer(JSON.parse(selectionKey) as TRange)
  }, [editor, selectionKey])

  const composeRange = popover?.kind === 'compose' ? popover.ref.current : null
  const thread =
    popover?.kind === 'thread'
      ? threads.find((item) => item.id === popover.id)
      : undefined

  if (popover?.kind === 'compose' && composeRange) {
    return (
      <Popover
        onOpenChange={(open) => {
          if (!open) actions.closePopover()
        }}
        open
      >
        <PopoverPopup
          anchor={virtualAnchor(() =>
            editor.api.toDOMRange(composeRange)?.getBoundingClientRect(),
          )}
          aria-label={labels.newThread}
          data-slot="comment-compose"
        >
          <ComposePanel
            actions={actions}
            labels={labels}
            quote={editor.api.string(composeRange)}
          />
        </PopoverPopup>
      </Popover>
    )
  }

  if (popover?.kind === 'thread' && thread) {
    return (
      <Popover
        onOpenChange={(open) => {
          if (!open) actions.closePopover()
        }}
        open
      >
        <PopoverPopup
          anchor={popover.anchor ?? undefined}
          aria-label={labels.thread}
          data-slot="comment-thread"
        >
          <ThreadPanel actions={actions} labels={labels} thread={thread} />
        </PopoverPopup>
      </Popover>
    )
  }

  if (!popover && offer) {
    return (
      <Popover
        onOpenChange={(open) => {
          if (open) return
          dismissed.current = selectionKey
          setOffer(null)
        }}
        open
      >
        <PopoverPopup
          anchor={virtualAnchor(() =>
            editor.api.toDOMRange(offer)?.getBoundingClientRect(),
          )}
          data-slot="comment-offer"
          initialFocus={false}
          side="top"
        >
          <div className="p-1">
            <Button
              onClick={() => {
                setOffer(null)
                beginCompose()
              }}
              onMouseDown={(event) => event.preventDefault()}
              size="sm"
              variant="ghost"
            >
              <ChatCenteredDotsIcon aria-hidden="true" />
              {labels.new}
            </Button>
          </div>
        </PopoverPopup>
      </Popover>
    )
  }
  return null
}

export function CommentsRail(): ReactElement {
  const { activeId, labels, openThread, threads } = useComments()
  const [showResolved, setShowResolved] = useState(false)
  const resolvedCount = threads.filter((thread) => thread.resolved).length
  const visible = threads.filter((thread) => showResolved || !thread.resolved)
  return (
    <div className="flex min-w-0 flex-col gap-3 p-4" data-slot="comments-rail">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium text-sm">{labels.list}</h3>
        {resolvedCount > 0 ? (
          <Label className="text-xs">
            <Switch checked={showResolved} onCheckedChange={setShowResolved} />
            {labels.showResolved}
          </Label>
        ) : null}
      </div>
      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">{labels.empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((thread) => {
            const first = thread.messages[0]
            return (
              <li key={thread.id}>
                <button
                  aria-label={labels.openThread(thread.quote)}
                  aria-pressed={activeId === thread.id}
                  className={cn(
                    'flex w-full flex-col gap-1.5 rounded-lg border bg-background p-3 text-start text-sm outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-accent',
                    thread.resolved && 'text-muted-foreground',
                  )}
                  data-resolved={thread.resolved}
                  data-slot="comment-thread-item"
                  data-thread={thread.id}
                  onClick={(event) =>
                    openThread(
                      thread.id,
                      thread.anchored ? undefined : event.currentTarget,
                    )
                  }
                  type="button"
                >
                  <span className="line-clamp-2 border-primary/60 border-s-2 ps-2 text-xs">
                    {thread.quote}
                  </span>
                  {first ? (
                    <span className="line-clamp-2 text-foreground">
                      <span className="font-medium">{first.author.name}: </span>
                      {first.body}
                    </span>
                  ) : null}
                  <span className="flex flex-wrap items-center gap-1.5 text-xs">
                    <Badge variant={thread.resolved ? 'success' : 'info'}>
                      {thread.resolved ? labels.resolvedBadge : labels.open}
                    </Badge>
                    <span>{labels.replies(thread.messages.length)}</span>
                    {thread.anchored ? null : <span>{labels.unanchored}</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
