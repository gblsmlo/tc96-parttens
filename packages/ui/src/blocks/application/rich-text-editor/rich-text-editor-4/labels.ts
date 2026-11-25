import type { RichTextEditor4Labels } from './types'

export const defaultRichTextEditor4Labels: RichTextEditor4Labels = {
  blocks: {
    blockquote: 'Citação',
    h2: 'Título de seção',
    h3: 'Subtítulo',
  },
  comments: {
    cancel: 'Cancelar',
    composer: 'Escreva um comentário',
    empty: 'Selecione um trecho do texto para abrir uma conversa.',
    list: 'Conversas',
    new: 'Comentar',
    newThread: 'Nova conversa',
    open: 'Aberta',
    openThread: (quote) => `Abrir conversa sobre "${quote}"`,
    reopen: 'Reabrir',
    reopened: 'Conversa reaberta',
    replies: (count) => (count === 1 ? '1 mensagem' : `${count} mensagens`),
    reply: 'Responder',
    replyComposer: 'Escreva uma resposta',
    resolve: 'Resolver',
    resolved: 'Conversa resolvida',
    resolvedBadge: 'Resolvida',
    send: 'Enviar',
    showResolved: 'Mostrar resolvidas',
    thread: 'Conversa',
    unanchored: 'O trecho comentado foi removido',
    undo: 'Desfazer resolução',
  },
  editor: 'Especificação do produto',
  online: {
    label: 'Online',
    merged: (names) =>
      `As edições de ${names.join(', ')} foram mescladas ao documento.`,
    offline: (queued) =>
      queued === 0
        ? 'Você está offline. As suas edições ficam na fila até voltar.'
        : `Você está offline. ${queued} ${queued === 1 ? 'edição aguarda' : 'edições aguardam'} na fila.`,
    synced: 'Sincronizado. Nenhuma edição de outras pessoas chegou.',
  },
  presence: {
    follow: (name) => `Seguir o cursor de ${name}`,
    following: (name) => `Seguindo ${name}`,
    group: 'Pessoas neste documento',
    person: (name, status) => `${name}, ${status}`,
    status: {
      editing: 'Editando',
      idle: 'Ausente',
      viewing: 'Visualizando',
    },
    stopFollowing: 'Parar de seguir',
    summary: ({ editing, idle, viewing }) =>
      [
        editing > 0 ? `${editing} editando` : null,
        viewing > 0 ? `${viewing} visualizando` : null,
        idle > 0 ? `${idle} ausente${idle === 1 ? '' : 's'}` : null,
      ]
        .filter(Boolean)
        .join(', '),
    you: 'Você',
  },
  placeholder: "Digite '/' para blocos",
  replay: 'Reproduzir',
  slashMenu: 'Blocos',
  slashMenuEmpty: 'Nenhum bloco com esse nome',
  title: 'Especificação em tempo real',
  tools: {
    blockType: 'Tipo de bloco',
    bulletList: 'Lista com marcadores',
    comment: 'Comentar trecho',
    format: 'Formatação do documento',
    numberedList: 'Lista numerada',
    paragraph: 'Texto',
  },
}
