import {
  defaultPlannerData,
  type RichTextEditor5PlannerData,
  stepText,
} from './planner-data'
import type {
  RichTextEditor5Edit,
  RichTextEditor5Finding,
  RichTextEditor5Plan,
  RichTextEditor5Planner,
  RichTextEditor5Step,
  RichTextEditor5StepKind,
  RichTextEditor5Task,
} from './types'

const taskNames: Record<RichTextEditor5Task, string> = {
  checklist: 'adicionar um checklist',
  owners: 'listar responsáveis',
  questions: 'listar perguntas em aberto',
  spelling: 'corrigir a ortografia',
  summary: 'escrever um resumo',
  tighten: 'enxugar o texto',
}

export const matchOrder: readonly RichTextEditor5Task[] = [
  'spelling',
  'tighten',
  'summary',
  'checklist',
  'questions',
  'owners',
]

export const selectionTasks: readonly RichTextEditor5Task[] = [
  'spelling',
  'tighten',
  'summary',
]

export const fallbackTasks: readonly RichTextEditor5Task[] = [
  'spelling',
  'tighten',
  'summary',
]

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function matchTask(
  request: string,
  data: RichTextEditor5PlannerData = defaultPlannerData,
): RichTextEditor5Task | null {
  const text = normalize(request)
  let best: RichTextEditor5Task | null = null
  let bestHits = 0
  for (const task of matchOrder) {
    const hits = data.keywords[task].filter((word) =>
      text.includes(word),
    ).length
    if (hits > bestHits) {
      best = task
      bestHits = hits
    }
  }
  return best
}

const escapePattern = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const wordPattern = (word: string, flags = 'gu') =>
  new RegExp(`(?<![\\p{L}])${escapePattern(word)}(?![\\p{L}])`, flags)

const step = (
  task: RichTextEditor5Task,
  index: number,
  kind: RichTextEditor5StepKind,
  text: string,
): RichTextEditor5Step => ({ id: `${task}-${index}`, kind, text })

const sentencesOf = (line: string) =>
  (line.match(/[^.!?]+[.!?]?/g) ?? [])
    .map((part) => part.trim())
    .filter(Boolean)

function spellingEdits(
  lines: readonly string[],
  data: RichTextEditor5PlannerData,
): RichTextEditor5Edit[] {
  const edits: RichTextEditor5Edit[] = []
  for (const [typo, fix] of Object.entries(data.typos)) {
    const hits = lines.join('\n').match(wordPattern(typo)) ?? []
    for (let index = 0; index < hits.length; index += 1)
      edits.push({ find: typo, text: fix, type: 'replace' })
  }
  return edits
}

function tightenEdits(
  lines: readonly string[],
  data: RichTextEditor5PlannerData,
): RichTextEditor5Edit[] {
  const edits: RichTextEditor5Edit[] = []
  for (const { from, to } of data.rewrites) {
    const hits = lines.join('\n').split(from).length - 1
    for (let index = 0; index < hits; index += 1)
      edits.push({ find: from, text: to, type: 'replace' })
  }
  return edits
}

function summaryEdits(
  lines: readonly string[],
  scoped: boolean,
  data: RichTextEditor5PlannerData,
): RichTextEditor5Edit[] {
  if (!scoped)
    return [
      {
        after: lines[0] ?? '',
        block: 'p',
        text: data.summary,
        type: 'add-block',
      },
    ]
  const last = [...lines].reverse().find((line) => line.trim().length > 0)
  const first = lines.find((line) => line.trim().length > 0)
  if (!last || !first) return []
  const sentence = sentencesOf(first)[0] ?? first
  const clipped =
    sentence.length > 90 ? `${sentence.slice(0, 87)}...` : sentence
  return [
    {
      after: last.slice(-30),
      text: ` Resumindo: ${clipped}`,
      type: 'insert',
    },
  ]
}

function checklistEdits(
  lines: readonly string[],
  data: RichTextEditor5PlannerData,
): RichTextEditor5Edit[] {
  const last = lines.at(-1)
  return data.checklist.map((text, index) => {
    const anchor = index === 0 ? last : data.checklist[index - 1]
    return {
      ...(anchor ? { after: anchor } : {}),
      block: 'action_item' as const,
      text,
      type: 'add-block' as const,
    }
  })
}

function questionFindings(lines: readonly string[]): RichTextEditor5Finding[] {
  const found: RichTextEditor5Finding[] = []
  for (const line of lines)
    for (const sentence of sentencesOf(line)) {
      const tbd = /\b(TBD|a definir|a confirmar|a combinar)\b/i.test(sentence)
      if (!tbd && !sentence.endsWith('?')) continue
      found.push({
        id: `${tbd ? 'tbd' : 'question'}-${found.length + 1}`,
        kind: tbd ? 'tbd' : 'question',
        quote: sentence,
        text: sentence,
      })
    }
  return found
}

function ownerFindings(
  lines: readonly string[],
  data: RichTextEditor5PlannerData,
): RichTextEditor5Finding[] {
  const found: RichTextEditor5Finding[] = []
  for (const line of lines)
    for (const name of data.teammates) {
      const acts = new RegExp(
        `${escapePattern(name)}[^.]*\\b(fica|cuida|valida|revisa|entrega|prepara|aprova|publica|conduz|lidera|responde)`,
        'u',
      )
      const owns = new RegExp(`respons[aá]vel[^.]*${escapePattern(name)}`, 'iu')
      if (!acts.test(line) && !owns.test(line)) continue
      found.push({
        id: `owner-${found.length + 1}`,
        kind: 'owner',
        quote: line,
        text: `${name}: ${line}`,
      })
      break
    }
  return found
}

export function planAction(
  task: RichTextEditor5Task,
  source: string,
  scoped = false,
  data: RichTextEditor5PlannerData = defaultPlannerData,
): RichTextEditor5Plan {
  const lines = source.split('\n')
  const edits: RichTextEditor5Edit[] =
    task === 'spelling'
      ? spellingEdits(lines, data)
      : task === 'tighten'
        ? tightenEdits(lines, data)
        : task === 'summary'
          ? summaryEdits(lines, scoped, data)
          : task === 'checklist'
            ? checklistEdits(lines, data)
            : []
  const findings =
    task === 'questions'
      ? questionFindings(lines)
      : task === 'owners'
        ? ownerFindings(lines, data)
        : []
  const steps: RichTextEditor5Step[] = [
    step(task, 1, 'planning', stepText.planning(taskNames[task])),
    step(
      task,
      2,
      'reading',
      scoped
        ? stepText.readingPassage
        : stepText.readingDocument(lines.filter(Boolean).length),
    ),
    step(task, 3, 'reviewing', stepText.reviewing[task]),
  ]
  if (edits.length > 0)
    steps.push(step(task, 4, 'editing', stepText.editing(edits.length)))
  return { edits, findings, steps }
}

export const defaultPlanner: RichTextEditor5Planner = (request) =>
  planAction(
    request.task,
    request.selection ?? request.text,
    request.selection !== null,
  )
