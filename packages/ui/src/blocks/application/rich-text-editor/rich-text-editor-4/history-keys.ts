import { createPlatePlugin } from 'platejs/react'

export const historyKeysPlugin = createPlatePlugin({
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return false
      const key = event.key.toLowerCase()
      const redo = (key === 'z' && event.shiftKey) || key === 'y'
      if (key !== 'z' && !redo) return false
      event.preventDefault()
      if (redo) editor.redo()
      else editor.undo()
      return true
    },
  },
  key: 'yjs_history_keys',
})
