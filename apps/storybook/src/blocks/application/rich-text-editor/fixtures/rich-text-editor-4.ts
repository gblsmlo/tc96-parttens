import type {
  LocalRoomStep,
  RichTextEditor4User,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-4'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'

export const localUser: RichTextEditor4User = {
  color: 'primary',
  id: 'marina',
  name: 'Marina Costa',
}

export const secondUser: RichTextEditor4User = {
  color: 'chart-5',
  id: 'otavio',
  name: 'Otávio Reis',
}

export const teammateUsers: RichTextEditor4User[] = [
  { color: 'chart-2', id: 'bruno', name: 'Bruno Lima' },
  { color: 'chart-3', id: 'carla', name: 'Carla Prado' },
  { color: 'chart-4', id: 'diego', name: 'Diego Alves' },
]

const paragraph = (text: string) => ({ children: [{ text }], type: 'p' })

const item = (text: string) => ({
  children: [{ children: [{ text }], type: 'lic' }],
  type: 'li',
})

export const specValue: RichTextValue = [
  { children: [{ text: 'Checkout em um passo' }], type: 'h2' },
  paragraph(
    'Objetivo: reduzir o abandono do carrinho levando o pedido de três telas para uma só.',
  ),
  { children: [{ text: 'Escopo' }], type: 'h3' },
  {
    children: [
      item('Endereço e pagamento na mesma tela.'),
      item('Cartão salvo com confirmação por biometria.'),
      item('Resumo do pedido fixo ao rolar a página.'),
    ],
    type: 'ul',
  },
  { children: [{ text: 'Métricas de sucesso' }], type: 'h3' },
  paragraph(
    'Conversão do checkout acima de 62% em até oito semanas depois do lançamento.',
  ),
  paragraph('Prazo: piloto com 10% do tráfego no primeiro mês.'),
]

const fillers = Array.from({ length: 16 }, (_, index) =>
  paragraph(
    `Nota ${index + 1}: o time de produto revisa este ponto com suporte e engenharia antes de seguir para a próxima etapa do piloto.`,
  ),
)

export const longSpecValue: RichTextValue = [...specValue, ...fillers]

export const specScript: LocalRoomStep[] = [
  { at: 100, status: 'idle', type: 'status', user: 'diego' },
  { at: 800, block: 1, from: 0, to: 8, type: 'select', user: 'bruno' },
  { at: 1600, block: 7, offset: 12, type: 'caret', user: 'carla' },
  {
    at: 2400,
    block: 8,
    offset: 'end',
    text: ' Revisar com o time de dados.',
    type: 'type',
    user: 'carla',
  },
  {
    at: 3200,
    block: 7,
    body: 'Qual é a linha de base de hoje?',
    from: 0,
    id: 'thread-bruno-1',
    to: 9,
    type: 'comment',
    user: 'bruno',
  },
]

export const followScript: LocalRoomStep[] = [
  { at: 100, block: 20, offset: 6, type: 'caret', user: 'carla' },
]
