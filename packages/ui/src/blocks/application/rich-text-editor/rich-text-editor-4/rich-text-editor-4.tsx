'use client'

import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { HighlightPlugin } from '@platejs/basic-nodes/react'
import { YjsPlugin } from '@platejs/yjs/react'
import { Button } from '@tc96/ui/button'
import { Label } from '@tc96/ui/label'
import {
  RichTextEditor,
  type RichTextValue,
  useRichTextEditor,
} from '@tc96/ui/patterns/rich-text-editor'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { NodeIdPlugin } from 'platejs'
import {
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as Y from 'yjs'
import {
  CommentPopovers,
  CommentsProvider,
  CommentsRail,
  CommentToolbarButton,
  commentPlugins,
  useCommentsController,
} from './comments'
import { clearThreads, getMembers, registerMember } from './comments-store'
import { historyKeysPlugin } from './history-keys'
import { defaultRichTextEditor4Labels } from './labels'
import { type PresenceEntry, PresenceStack } from './presence-stack'
import { RemoteCarets, useRemotePeople } from './remote-carets'
import { ROOM_PROVIDER_TYPE } from './room-provider'
import type {
  RichTextEditor4Labels,
  RichTextEditor4NavbarContext,
  RichTextEditor4Props,
  RichTextEditor4Status,
} from './types'

const floatingMarks = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
] as const

const emptyValue: RichTextValue = [{ children: [{ text: '' }], type: 'p' }]

const EDITING_MS = 4000

const IDLE_MS = 60000

const roomKeys = new WeakMap<object, number>()

let nextRoomKey = 0

function roomKey(room: object): number {
  const known = roomKeys.get(room)
  if (known !== undefined) return known
  nextRoomKey += 1
  roomKeys.set(room, nextRoomKey)
  return nextRoomKey
}

function mergeLabels(
  input: RichTextEditor4Props['labels'],
): RichTextEditor4Labels {
  const base = defaultRichTextEditor4Labels
  return {
    ...base,
    ...input,
    blocks: { ...base.blocks, ...input?.blocks },
    comments: { ...base.comments, ...input?.comments },
    online: { ...base.online, ...input?.online },
    presence: {
      ...base.presence,
      ...input?.presence,
      status: { ...base.presence.status, ...input?.presence?.status },
    },
    tools: { ...base.tools, ...input?.tools },
  }
}

type Note = { kind: 'merged'; names: string[] } | { kind: 'synced' }

function CollaborativeEditor({
  className,
  defaultValue = emptyValue,
  labels: labelsInput,
  navbar,
  now = Date.now,
  onCommentsChange,
  room,
  user,
}: Readonly<RichTextEditor4Props>): ReactElement {
  const labels = useMemo(() => mergeLabels(labelsInput), [labelsInput])
  const valueRef = useRef(defaultValue)
  const rootRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const collecting = useRef<Set<number> | null>(null)
  const offline = useRef(false)
  const plugins = useMemo(
    () => [
      HighlightPlugin.configure({ enabled: false }),
      NodeIdPlugin.configure({ enabled: false }),
      ...commentPlugins(),
      historyKeysPlugin,
      YjsPlugin.configure({
        options: {
          awareness: room.awareness,
          cursors: { data: { ...user } },
          providers: [{ options: {}, type: ROOM_PROVIDER_TYPE } as never],
          ydoc: room.doc,
        },
      }),
    ],
    [room, user],
  )
  const editor = useRichTextEditor({
    features: { plugins, skipInitialization: true },
  })

  const [online, setOnline] = useState(true)
  const [queued, setQueued] = useState(0)
  const [note, setNote] = useState<Note | null>(null)
  const [followId, setFollowId] = useState<string | null>(null)
  const [selfStatus, setSelfStatus] = useState<RichTextEditor4Status>('viewing')

  useEffect(() => {
    void editor
      .getApi(YjsPlugin)
      .yjs.init({ id: 'tc96-room', value: valueRef.current })
    return () => editor.getApi(YjsPlugin).yjs.destroy()
  }, [editor])

  useEffect(() => {
    registerMember(room.doc, user)
  }, [room.doc, user])

  useEffect(() => {
    const onUpdate = (
      update: Uint8Array,
      _origin: unknown,
      _doc: Y.Doc,
      transaction: Y.Transaction,
    ) => {
      if (transaction.local) {
        if (offline.current) setQueued((count) => count + 1)
        return
      }
      const ids = collecting.current
      if (!ids) return
      const decoded = Y.decodeUpdate(update)
      for (const struct of decoded.structs) ids.add(struct.id.client)
      for (const client of decoded.ds.clients.keys()) ids.add(client)
    }
    room.doc.on('update', onUpdate)
    return () => room.doc.off('update', onUpdate)
  }, [room.doc])

  useEffect(() => {
    const { awareness, doc } = room
    let status: RichTextEditor4Status = 'viewing'
    let editingTimer: ReturnType<typeof setTimeout> | undefined
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    const publish = (next: RichTextEditor4Status) => {
      status = next
      setSelfStatus(next)
      awareness.setLocalStateField('presence', { status: next })
    }
    const touch = () => {
      clearTimeout(idleTimer)
      if (status === 'idle') publish('viewing')
      idleTimer = setTimeout(() => publish('idle'), IDLE_MS)
    }
    const edited = (
      _update: Uint8Array,
      _origin: unknown,
      _doc: Y.Doc,
      transaction: Y.Transaction,
    ) => {
      if (!transaction.local) return
      publish('editing')
      clearTimeout(editingTimer)
      editingTimer = setTimeout(() => publish('viewing'), EDITING_MS)
      touch()
    }
    const element = rootRef.current
    publish('viewing')
    touch()
    doc.on('update', edited)
    for (const type of ['keydown', 'pointerdown', 'pointermove'])
      element?.addEventListener(type, touch)
    return () => {
      clearTimeout(editingTimer)
      clearTimeout(idleTimer)
      doc.off('update', edited)
      for (const type of ['keydown', 'pointerdown', 'pointermove'])
        element?.removeEventListener(type, touch)
    }
  }, [room])

  useEffect(() => {
    const element = rootRef.current
    const stop = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey && event.key.length === 1)
        setFollowId(null)
    }
    element?.addEventListener('keydown', stop)
    return () => element?.removeEventListener('keydown', stop)
  }, [])

  const people = useRemotePeople(room.awareness, user.id, online)
  const others = useMemo<PresenceEntry[]>(
    () =>
      people.map((person) => ({
        id: person.id,
        name: person.name,
        status: person.status,
        user: { color: person.color, id: person.id, name: person.name },
      })),
    [people],
  )
  const self = useMemo<PresenceEntry>(
    () => ({ id: user.id, name: user.name, status: selfStatus, user }),
    [selfStatus, user],
  )

  const comments = useCommentsController({
    doc: room.doc,
    editor,
    labels: labels.comments,
    now,
    ...(onCommentsChange ? { onCommentsChange } : {}),
    user,
  })

  const changeOnline = useCallback(
    async (next: boolean) => {
      setOnline(next)
      if (!next) {
        offline.current = true
        setQueued(0)
        setNote(null)
        setFollowId(null)
        room.disconnect?.()
        return
      }
      collecting.current = new Set()
      offline.current = false
      await room.connect?.()
      await new Promise((resolve) => setTimeout(resolve, 0))
      const members = getMembers(room.doc)
      const names = [...(collecting.current ?? [])]
        .map((id) => members.get(String(id))?.name)
        .filter((name): name is string => !!name && name !== user.name)
      collecting.current = null
      setNote(
        names.length > 0
          ? { kind: 'merged', names: [...new Set(names)] }
          : { kind: 'synced' },
      )
    },
    [room, user.name],
  )

  const replay = useCallback(async () => {
    collecting.current = null
    offline.current = false
    setOnline(true)
    setQueued(0)
    setNote(null)
    setFollowId(null)
    await room.connect?.()
    clearThreads(room.doc)
    editor.tf.setValue(structuredClone(valueRef.current))
    room.replay?.()
  }, [editor, room])

  const context: RichTextEditor4NavbarContext = {
    online,
    status: (
      <>
        <PresenceStack
          followId={followId}
          labels={labels.presence}
          onFollow={setFollowId}
          others={others}
          self={self}
        />
        <Label>
          <Switch
            checked={online}
            onCheckedChange={(next) => void changeOnline(next)}
          />
          {labels.online.label}
        </Label>
        {room.replay ? (
          <Button onClick={() => void replay()} size="sm" variant="outline">
            <ArrowCounterClockwiseIcon aria-hidden="true" />
            {labels.replay}
          </Button>
        ) : null}
      </>
    ),
  }
  const navbarNode = typeof navbar === 'function' ? navbar(context) : navbar

  const composeRange =
    comments.context.popover?.kind === 'compose'
      ? comments.context.popover.ref.current
      : null

  return (
    <CommentsProvider value={comments.context}>
      <section
        aria-label={labels.title}
        className={cn(
          'flex min-w-0 flex-col bg-background text-foreground',
          className,
        )}
        data-online={online}
        data-slot="rich-text-editor-4"
        ref={rootRef}
      >
        {navbarNode}
        {online && note ? (
          <output
            className="block border-b bg-info/8 px-4 py-2 text-info-foreground text-sm"
            data-slot="online-note"
          >
            {note.kind === 'merged'
              ? labels.online.merged(note.names)
              : labels.online.synced}
          </output>
        ) : null}
        {online ? null : (
          <output
            className="block border-b bg-warning/8 px-4 py-2 text-sm text-warning-foreground"
            data-slot="offline-note"
          >
            {labels.online.offline(queued)}
          </output>
        )}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div
            className="min-h-80 min-w-0 flex-1 px-6 pt-10 pb-16 sm:px-12"
            data-slot="rich-text-editor-4-body"
          >
            <div className="relative mx-auto max-w-3xl" ref={contentRef}>
              <RichTextEditor
                aria-label={labels.editor}
                blockLabels={{
                  ...labels.blocks,
                  ol: labels.tools.numberedList,
                  ul: labels.tools.bulletList,
                }}
                blockTypeLabel={labels.tools.blockType}
                contentClassName="min-h-72"
                editor={editor}
                floatingToolbarActions={
                  <CommentToolbarButton label={labels.tools.comment} />
                }
                floatingToolbarMarks={floatingMarks}
                paragraphLabel={labels.tools.paragraph}
                placeholder={labels.placeholder}
                slashMenuEmptyLabel={labels.slashMenuEmpty}
                slashMenuLabel={labels.slashMenu}
                toolbarLabel={labels.tools.format}
              >
                <CommentPopovers actions={comments.actions} />
              </RichTextEditor>
              <RemoteCarets
                containerRef={contentRef}
                doc={room.doc}
                draft={composeRange}
                editor={editor}
                followId={followId}
                people={people}
              />
            </div>
          </div>
          <aside
            aria-label={labels.comments.list}
            className="border-t md:w-80 md:shrink-0 md:border-t-0 md:border-s"
          >
            <CommentsRail />
          </aside>
        </div>
      </section>
    </CommentsProvider>
  )
}

export function RichTextEditor4(
  props: Readonly<RichTextEditor4Props>,
): ReactElement {
  return <CollaborativeEditor key={roomKey(props.room)} {...props} />
}
