import { describe, expect, mock, test } from 'bun:test'

await import('../test/dom')

const { act, renderHook } = await import('@testing-library/react')
const { useEntryListEditor } = await import('./use-entry-list-editor')

const parse = (raw: string) =>
  raw.length >= 3
    ? ({ success: true, value: raw.toLowerCase() } as const)
    : ({ message: 'Curto demais.', success: false } as const)

const setup = (value: readonly string[] = [], limit = 2) => {
  const onCommit = mock()
  const hook = renderHook(
    (props: { value: readonly string[] }) =>
      useEntryListEditor({
        duplicateMessage: 'Repetido.',
        limit,
        onCommit,
        parse,
        value: props.value,
      }),
    { initialProps: { value } },
  )
  return { ...hook, onCommit }
}

const open = (result: { current: { onOpenChange: (next: boolean) => void } }) =>
  act(() => result.current.onOpenChange(true))

describe('useEntryListEditor', () => {
  test('opens with the value as drafts, or one blank draft when empty', () => {
    const filled = setup(['abc', 'def'])
    open(filled.result)
    expect(filled.result.current.open).toBe(true)
    expect(filled.result.current.drafts).toEqual(['abc', 'def'])

    const empty = setup([])
    open(empty.result)
    expect(empty.result.current.drafts).toEqual([''])
    expect(empty.result.current.errors).toEqual([])
  })

  test('reopening discards what was typed before', () => {
    const { result } = setup(['abc'])
    open(result)
    act(() => result.current.setDraft(0, 'xyz'))
    act(() => result.current.onOpenChange(false))
    open(result)

    expect(result.current.drafts).toEqual(['abc'])
  })

  test('a new value while the popup is open does not overwrite the drafts', () => {
    const { rerender, result } = setup(['abc'])
    open(result)
    act(() => result.current.setDraft(0, 'typing'))

    rerender({ value: ['abc'] })

    expect(result.current.drafts).toEqual(['typing'])
  })

  test('editing a draft clears only its own error', () => {
    const { result } = setup([])
    open(result)
    act(() => result.current.setDraft(0, 'ab'))
    act(() => result.current.addDraft())
    act(() => result.current.setDraft(1, 'cd'))
    act(() => result.current.save())
    expect(result.current.errors).toEqual(['Curto demais.', 'Curto demais.'])

    act(() => result.current.setDraft(0, 'abc'))

    expect(result.current.errors).toEqual([null, 'Curto demais.'])
  })

  test('adds and removes drafts together with their errors', () => {
    const { result } = setup(['abc'])
    open(result)
    act(() => result.current.addDraft())
    expect(result.current.drafts).toEqual(['abc', ''])

    act(() => result.current.removeDraft(0))

    expect(result.current.drafts).toEqual([''])
  })

  test('only allows another draft while valid and under the limit', () => {
    const { result } = setup(['abc'], 2)
    open(result)
    expect(result.current.canAddAnother).toBe(true)

    act(() => result.current.setDraft(0, 'ab'))
    expect(result.current.canAddAnother).toBe(false)

    act(() => result.current.setDraft(0, 'abc'))
    act(() => result.current.addDraft())
    expect(result.current.canAddAnother).toBe(false)
  })

  test('saves the parsed drafts with the diff, skips blank rows and closes', () => {
    const { onCommit, result } = setup(['abc', 'def'])
    open(result)
    act(() => result.current.setDraft(0, 'ABC'))
    act(() => result.current.setDraft(1, ''))
    act(() => result.current.addDraft())
    act(() => result.current.setDraft(2, 'ghi'))

    act(() => result.current.save())

    expect(onCommit).toHaveBeenCalledWith(['abc', 'ghi'], {
      added: 'ghi',
      previousValue: ['abc', 'def'],
      removed: 'def',
    })
    expect(result.current.open).toBe(false)
  })

  test('keeps the popup open and reports the parse message when a draft is invalid', () => {
    const { onCommit, result } = setup([])
    open(result)
    act(() => result.current.setDraft(0, 'ab'))

    act(() => result.current.save())

    expect(onCommit).not.toHaveBeenCalled()
    expect(result.current.errors).toEqual(['Curto demais.'])
    expect(result.current.open).toBe(true)
  })

  test('reports the duplicate message on the second equal draft', () => {
    const { onCommit, result } = setup([])
    open(result)
    act(() => result.current.setDraft(0, 'abc'))
    act(() => result.current.addDraft())
    act(() => result.current.setDraft(1, 'ABC'))

    act(() => result.current.save())

    expect(onCommit).not.toHaveBeenCalled()
    expect(result.current.errors).toEqual([null, 'Repetido.'])
  })
})
