import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'
import { storySnippets } from '../../../scripts/story-component.ts'

const storyFile = /\.stories\.tsx$/
const storyExport = /^export const (\w+)/gm

export function storySourcePlugin(): Plugin {
  return {
    enforce: 'pre',
    name: 'tc96:story-source',
    transform(code, id) {
      const file = id.split('?')[0] ?? ''
      if (!storyFile.test(file)) return undefined
      const names = [...code.matchAll(storyExport)].map(([, name]) => name)
      if (names.length === 0) return undefined
      const read = (path: string) => {
        this.addWatchFile(path)
        return readFileSync(path, 'utf8')
      }
      const snippets = storySnippets(code, names as string[], file, read)
      const assignments = names.map(
        (name, index) =>
          `${name}.parameters = { ...${name}.parameters, docs: { ...${name}.parameters?.docs, source: { ...${name}.parameters?.docs?.source, code: ${JSON.stringify(snippets[index])} } } }`,
      )
      return { code: `${code}\n${assignments.join('\n')}\n`, map: null }
    },
  }
}
