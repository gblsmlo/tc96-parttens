import type { RichTextEditor2Person } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-2'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'

export const people: RichTextEditor2Person[] = [
  { id: 'ana', name: 'Ana Souza', role: 'Líder de plantão' },
  { id: 'bruno', name: 'Bruno Lima', role: 'Engenharia' },
  { id: 'carla', name: 'Carla Prado', role: 'Suporte nível 2' },
  { id: 'diego', name: 'Diego Alves', role: 'Segurança' },
]

const text = (value: string) => ({ children: [{ text: value }], type: 'p' })

const cell = (type: 'td' | 'th', value: string) => ({
  children: [text(value)],
  type,
})

const row = (type: 'td' | 'th', values: string[]) => ({
  children: values.map((value) => cell(type, value)),
  type: 'tr',
})

export const playbook: RichTextValue = [
  { children: [{ text: 'Playbook de escalonamento' }], type: 'h1' },
  {
    children: [
      {
        text: 'Use esta página quando um incidente passar do limite combinado com o cliente. Ela diz quem decide, em quanto tempo e o que registrar.',
      },
    ],
    type: 'p',
  },
  { children: [{ text: 'Quando escalar' }], type: 'h2' },
  {
    children: [
      {
        children: [
          {
            children: [{ text: 'Cliente sem acesso há mais de 15 minutos' }],
            type: 'lic',
          },
        ],
        type: 'li',
      },
      {
        children: [
          { children: [{ text: 'Perda de dados confirmada' }], type: 'lic' },
        ],
        type: 'li',
      },
      {
        children: [
          {
            children: [
              { text: 'Falha de pagamento em mais de 5% das tentativas' },
            ],
            type: 'lic',
          },
        ],
        type: 'li',
      },
    ],
    type: 'ul',
  },
  { children: [{ text: 'Quem decide' }], type: 'h2' },
  {
    children: [
      row('th', ['Nível', 'Responsável', 'Prazo']),
      row('td', ['1', 'Plantão de suporte', '15 min']),
      row('td', ['2', 'Engenharia de plantão', '30 min']),
    ],
    colSizes: [120, 260, 120],
    type: 'table',
  },
  { children: [{ text: 'Primeiros passos' }], type: 'h2' },
  {
    checked: true,
    children: [{ text: 'Abrir o canal do incidente' }],
    type: 'action_item',
  },
  {
    checked: false,
    children: [{ text: 'Avisar a pessoa de plantão' }],
    type: 'action_item',
  },
  {
    checked: false,
    children: [{ text: 'Registrar a hora do primeiro alerta' }],
    type: 'action_item',
  },
  { children: [{ text: 'Comunicação' }], type: 'h2' },
  { children: [{ text: 'Modelo de aviso' }], type: 'h3' },
  {
    children: [
      { text: 'Seguimos investigando e voltamos a falar em 30 minutos.' },
    ],
    type: 'blockquote',
  },
  { children: [{ text: 'Comando de diagnóstico' }], type: 'h3' },
  { children: [{ text: 'kubectl get pods -n producao' }], type: 'code_block' },
  { children: [{ text: '' }], type: 'hr' },
  { children: [{ text: 'Depois do incidente' }], type: 'h2' },
  {
    children: [{ text: 'Marque uma revisão em até três dias úteis.' }],
    type: 'p',
  },
]

export const shortPage: RichTextValue = [
  { children: [{ text: 'Primeiro bloco' }], type: 'p' },
  { children: [{ text: 'Segundo bloco' }], type: 'p' },
  { children: [{ text: 'Terceiro bloco' }], type: 'p' },
]

export const tablePage: RichTextValue = [
  { children: [{ text: 'Plantão' }], type: 'p' },
  {
    children: [
      row('th', ['Turno', 'Pessoa']),
      row('td', ['Manhã', 'Ana']),
      row('td', ['Tarde', 'Bruno']),
    ],
    colSizes: [160, 200],
    type: 'table',
  },
  { children: [{ text: 'Fim' }], type: 'p' },
]

export const emptyPage: RichTextValue = [
  { children: [{ text: '' }], type: 'p' },
]

export const breadcrumbs = [
  { href: '/wiki', label: 'Wiki' },
  { href: '/wiki/operacoes', label: 'Operações' },
  { label: 'Playbook de escalonamento' },
]
