import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

export function richTextTyping(name: string) {
  const current = (canvasElement: HTMLElement) =>
    within(canvasElement).getByRole('textbox', { name })

  async function focusEditor(canvasElement: HTMLElement): Promise<HTMLElement> {
    await waitFor(async () => {
      const editor = current(canvasElement)
      await userEvent.click(editor)
      const anchor = editor.ownerDocument.getSelection()?.anchorNode ?? null
      await expect(editor).toHaveFocus()
      await expect(anchor !== null && editor.contains(anchor)).toBe(true)
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
          await userEvent.click(editor)
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
