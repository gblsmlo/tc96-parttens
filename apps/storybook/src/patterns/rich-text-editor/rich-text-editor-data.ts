import type { RichTextMention, RichTextValue } from '@tc96/parttens'

export const sampleMentions: readonly RichTextMention[] = [
  { id: 'ana', label: 'Ana Souza' },
  { id: 'bruno', label: 'Bruno Lima' },
  { id: 'carla', label: 'Carla Dias' },
]

export const pixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

export const paragraph = (text: string) => ({
  children: [{ text }],
  type: 'p',
})

export const contentTitle = 'Phrasal verbs de movimento'

export const counterTitle =
  'Uma nota com um título bem comprido que se aproxima do limite de caracteres'

export const everyNode: RichTextValue = [
  { children: [{ text: 'Título da nota' }], type: 'h2' },
  { children: [{ text: 'Uma seção' }], type: 'h3' },
  {
    children: [
      { text: 'Com ' },
      { bold: true, text: 'negrito' },
      { text: ', ' },
      { italic: true, text: 'itálico' },
      { text: ', ' },
      { text: 'sublinhado', underline: true },
      { text: ', ' },
      { strikethrough: true, text: 'tachado' },
      { text: ' e ' },
      { code: true, text: 'código' },
      { text: '.' },
    ],
    type: 'p',
  },
  { children: [{ text: 'Uma citação.' }], type: 'blockquote' },
  {
    children: [
      {
        children: [
          { children: [{ text: 'Primeiro item' }], type: 'lic' },
          {
            children: [
              {
                children: [{ children: [{ text: 'Aninhado' }], type: 'lic' }],
                type: 'li',
              },
            ],
            type: 'ol',
          },
        ],
        type: 'li',
      },
    ],
    type: 'ul',
  },
]

const list = (
  type: 'ol' | 'ul',
  ...items: (string | [string, RichTextValue[number]])[]
): RichTextValue[number] => ({
  children: items.map((item) => ({
    children: [
      {
        children: [{ text: typeof item === 'string' ? item : item[0] }],
        type: 'lic',
      },
      ...(typeof item === 'string' ? [] : [item[1]]),
    ],
    type: 'li',
  })),
  type,
})

export const fullDocument: RichTextValue = [
  { children: [{ text: 'Phrasal verbs de movimento' }], type: 'h2' },
  {
    children: [
      {
        text: 'Um phrasal verb junta um verbo a uma partícula e ganha um sentido que as duas palavras não têm sozinhas. Esta nota reúne os de ',
      },
      { bold: true, text: 'movimento' },
      { text: ', os mais frequentes em conversas do dia a dia, com ' },
      { italic: true, text: 'um exemplo' },
      { text: ' por verbo e a tradução ' },
      { underline: true, text: 'mais próxima' },
      { text: ' em português.' },
    ],
    type: 'p',
  },
  { children: [{ text: 'Como estudar esta nota' }], type: 'h3' },
  {
    children: [
      {
        text: 'Leia cada verbo em voz alta, cubra a tradução e tente lembrar. O que ',
      },
      { strikethrough: true, text: 'não funciona' },
      { text: ' é decorar a lista inteira de uma vez: separe em sessões de ' },
      { code: true, text: '10' },
      { text: ' cartões.' },
    ],
    type: 'p',
  },
  {
    children: [
      {
        text: 'A língua não é um conjunto de regras a memorizar, mas um hábito a cultivar.',
      },
    ],
    type: 'blockquote',
  },
  { children: [{ text: 'Verbos' }], type: 'h3' },
  list(
    'ul',
    ['get up: levantar-se', list('ol', 'I get up at six.', 'She got up late.')],
    ['go out: sair', list('ol', 'We went out for dinner.')],
    'come back: voltar',
    'run into: encontrar por acaso',
  ),
  { children: [{ text: 'Plano de revisão' }], type: 'h3' },
  list(
    'ol',
    'Hoje: ler a lista e marcar os verbos conhecidos.',
    'Amanhã: revisar só os marcados como difíceis.',
    'Em uma semana: escrever uma frase nova para cada verbo.',
  ),
  {
    children: [
      { text: 'Dúvidas vão para o fim da nota, com ' },
      { bold: true, italic: true, text: 'negrito e itálico' },
      { text: ' para destacar o que ainda falta confirmar.' },
    ],
    type: 'p',
  },
]

export const englishLabels = {
  blockLabels: {
    blockquote: 'Quote',
    h2: 'Section heading',
    h3: 'Subheading',
    ol: 'Numbered list',
    ul: 'Bulleted list',
  },
  extraBlockLabels: {
    callout: 'Callout',
    code: 'Code block',
    date: 'Today’s date',
    hr: 'Divider',
    image: 'Image',
    table: 'Table',
    todo: 'Task list',
  },
  markLabels: {
    bold: 'Bold',
    code: 'Code',
    highlight: 'Highlight',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    underline: 'Underline',
  },
  paragraphLabel: 'Text',
  slashMenuEmptyLabel: 'No block with that name',
  slashMenuLabel: 'Blocks',
  toolbarLabel: 'Formatting',
} as const
