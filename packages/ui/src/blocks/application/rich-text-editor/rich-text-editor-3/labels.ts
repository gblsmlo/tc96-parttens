import type { RichTextEditor3Labels } from './types'

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`

export const defaultRichTextEditor3Labels: RichTextEditor3Labels = {
  acceptAll: 'Aceitar tudo',
  blocks: {
    blockquote: 'Citação',
    h2: 'Título de cláusula',
    h3: 'Subtítulo',
    ol: 'Lista numerada',
    ul: 'Lista com marcadores',
  },
  cancel: 'Cancelar',
  closeReview: 'Fechar revisão',
  confirmAcceptAll: 'Aceitar todas',
  confirmAcceptAllDescription: (count) =>
    `${plural(count, 'alteração entra', 'alterações entram')} no texto final. Você ainda pode desfazer.`,
  confirmAcceptAllTitle: 'Aceitar todas as alterações?',
  confirmRejectAll: 'Rejeitar todas',
  confirmRejectAllDescription: (count) =>
    `${plural(count, 'alteração é descartada', 'alterações são descartadas')} e o texto volta ao original. Você ainda pode desfazer.`,
  confirmRejectAllTitle: 'Rejeitar todas as alterações?',
  count: (count) => plural(count, 'alteração', 'alterações'),
  document: 'Contrato de prestação de serviços',
  exportFinal: 'Copiar texto final',
  exportHtml: 'Copiar redline em HTML',
  exportOriginal: 'Copiar texto original',
  formatting: 'Formatação do contrato',
  next: 'Próxima alteração',
  openReview: 'Revisar alterações',
  placeholder: "Digite '/' para blocos",
  previous: 'Alteração anterior',
  rejectAll: 'Rejeitar tudo',
  review: {
    accept: 'Aceitar',
    acceptChange: (change) =>
      `Aceitar alteração de ${change.author.name}: ${change.after || change.before}`,
    empty: 'Nenhuma alteração para revisar.',
    kind: { delete: 'Exclusão', insert: 'Inserção', replace: 'Substituição' },
    list: 'Alterações do contrato',
    now: 'Depois',
    reject: 'Rejeitar',
    rejectChange: (change) =>
      `Rejeitar alteração de ${change.author.name}: ${change.after || change.before}`,
    was: 'Antes',
  },
  reviewDescription: 'Aceite ou rejeite cada alteração proposta ao contrato.',
  reviewTitle: 'Revisão',
  slashMenu: 'Blocos',
  slashMenuEmpty: 'Nenhum bloco com esse nome',
  viewAll: 'Todas as marcações',
  viewFinal: 'Final',
  viewOriginal: 'Original',
  views: 'Versão exibida',
}
