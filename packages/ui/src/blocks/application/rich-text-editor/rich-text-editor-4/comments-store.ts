import * as Y from 'yjs'
import type {
  RichTextEditor4Message,
  RichTextEditor4Thread,
  RichTextEditor4User,
} from './types'

export const COMMENTS_KEY = 'comments'
export const MEMBERS_KEY = 'members'

export const getComments = (doc: Y.Doc): Y.Map<Y.Map<unknown>> =>
  doc.getMap(COMMENTS_KEY)

export const getMembers = (doc: Y.Doc): Y.Map<RichTextEditor4User> =>
  doc.getMap(MEMBERS_KEY)

export function registerMember(doc: Y.Doc, user: RichTextEditor4User) {
  getMembers(doc).set(String(doc.clientID), user)
}

export function createThread(
  doc: Y.Doc,
  input: {
    author: RichTextEditor4User
    body: string
    createdAt: number
    id: string
    quote: string
  },
) {
  doc.transact(() => {
    const thread = new Y.Map<unknown>()
    const messages = new Y.Array<RichTextEditor4Message>()
    thread.set('id', input.id)
    thread.set('quote', input.quote)
    thread.set('createdAt', input.createdAt)
    thread.set('resolved', false)
    thread.set('messages', messages)
    messages.push([
      {
        author: input.author,
        body: input.body,
        createdAt: input.createdAt,
        id: `${input.id}-m1`,
      },
    ])
    getComments(doc).set(input.id, thread)
  })
}

export function addReply(
  doc: Y.Doc,
  threadId: string,
  message: Omit<RichTextEditor4Message, 'id'>,
) {
  const messages = getComments(doc).get(threadId)?.get('messages')
  if (!(messages instanceof Y.Array)) return
  messages.push([
    { ...message, id: `${threadId}-${doc.clientID}-${messages.length + 1}` },
  ])
}

export function setResolved(
  doc: Y.Doc,
  threadId: string,
  resolved: boolean,
  by?: RichTextEditor4User,
) {
  const thread = getComments(doc).get(threadId)
  if (!thread) return
  doc.transact(() => {
    thread.set('resolved', resolved)
    if (resolved && by) thread.set('resolvedBy', by)
    else thread.delete('resolvedBy')
  })
}

export function clearThreads(doc: Y.Doc) {
  doc.transact(() => {
    for (const key of [...getComments(doc).keys()]) getComments(doc).delete(key)
  })
}

export function readThreads(
  doc: Y.Doc,
  anchored: (id: string) => boolean,
): RichTextEditor4Thread[] {
  const threads: RichTextEditor4Thread[] = []
  getComments(doc).forEach((thread, id) => {
    const messages = thread.get('messages')
    const resolvedBy = thread.get('resolvedBy') as
      | RichTextEditor4User
      | undefined
    threads.push({
      anchored: anchored(id),
      createdAt: Number(thread.get('createdAt') ?? 0),
      id,
      messages: messages instanceof Y.Array ? messages.toArray() : [],
      quote: String(thread.get('quote') ?? ''),
      resolved: thread.get('resolved') === true,
      ...(resolvedBy ? { resolvedBy } : {}),
    })
  })
  return threads.sort((a, b) => a.createdAt - b.createdAt)
}
