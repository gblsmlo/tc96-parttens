import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

export function richTextTyping(name: string) {
  const current = (canvasElement: HTMLElement) =>
    within(canvasElement).getByRole('textbox', { name })

  async function focusEditor(canvasElement: HTMLElement): Promise<HTMLElement> {
    await waitFor(async () => {
      const editor = current(canvasElement)
      if (!hasCaretInside(editor)) placeCaretAtEnd(editor)
      await expect(editor).toHaveFocus()
      await expect(hasCaretInside(editor)).toBe(true)
    })
    return current(canvasElement)
  }

  async function startTyping(
    canvasElement: HTMLElement,
    text: string,
    expected = text,
  ): Promise<HTMLElement> {
    await focusEditor(canvasElement)
    await waitFor(
      async () => {
        const editor = current(canvasElement)
        if (typedText(editor) === '') {
          editor.blur()
          placeCaretAtEnd(editor)
          await userEvent.keyboard(text)
        }
        await expect(typedText(current(canvasElement))).toBe(expected)
      },
      { timeout: 3000 },
    )
    return current(canvasElement)
  }

  return { focusEditor, startTyping }
}

export async function expectCaretAtStart(editor: HTMLElement) {
  await waitFor(async () => {
    const selection = editor.ownerDocument.getSelection()
    await expect(editor).toHaveFocus()
    await expect(selection?.isCollapsed).toBe(true)
    const anchor = selection?.anchorNode ?? null
    const firstText = editor.querySelector('[data-slate-string]')
    if (firstText) {
      await expect(firstText.contains(anchor)).toBe(true)
      await expect(selection?.anchorOffset).toBe(0)
    } else {
      await expect(
        editor.querySelector('[data-slate-zero-width]')?.contains(anchor),
      ).toBe(true)
    }
  })
}

export function hasCaretInside(editor: HTMLElement): boolean {
  const anchor = editor.ownerDocument.getSelection()?.anchorNode ?? null
  return (
    editor.ownerDocument.activeElement === editor &&
    anchor !== null &&
    editor.contains(anchor)
  )
}

export function placeCaretAtEnd(
  editor: HTMLElement,
  target: Element | null = Array.from(
    editor.querySelectorAll('[data-slate-string]'),
  ).at(-1) ?? null,
): void {
  const node =
    target?.firstChild ?? editor.querySelector('[data-slate-zero-width]')
  const document = editor.ownerDocument
  const selection = document.getSelection()
  if (!node || !selection) return
  editor.focus()
  const range = document.createRange()
  range.setStart(
    node,
    node.nodeType === Node.TEXT_NODE ? (node.textContent?.length ?? 0) : 0,
  )
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

export const typedText = (editor: HTMLElement) =>
  Array.from(
    editor.querySelectorAll('[data-slate-string]'),
    (node) => node.textContent,
  ).join('')

export async function extendSelectionBackward(
  editor: HTMLElement,
  count: number,
) {
  const selection = editor.ownerDocument.getSelection()
  for (let step = 0; step < count; step += 1) {
    selection?.modify('extend', 'backward', 'character')
  }
  await waitFor(() => expect(selection?.toString()).toHaveLength(count))
}

export const findFloatingToolbar = () =>
  screen.findByRole('toolbar', { name: 'Formatação' })

export const queryFloatingToolbar = () =>
  screen.queryByRole('toolbar', { name: 'Formatação' })

export async function pressFloatingButton(name: string) {
  const toolbar = await findFloatingToolbar()
  const button = within(toolbar).getByRole('button', { name })
  await userEvent.click(button)
  return button
}
