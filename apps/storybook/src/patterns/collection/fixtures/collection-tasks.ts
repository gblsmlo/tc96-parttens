import {
  initialTasks,
  people,
  priorityOptions,
  statusOptions,
  type Task,
} from './tasks'

const backlog: readonly [title: string, description: string][] = [
  ['Tela de perfil', 'Edição de nome, foto e preferências de notificação.'],
  ['Modo escuro no app', 'Aplicar os tokens de tema escuro nas telas novas.'],
  ['Cache de imagens', 'Reduzir downloads repetidos no feed de produtos.'],
  ['Revisar textos de erro', 'Padronizar mensagens de falha de rede e login.'],
  [
    'Deep links de campanha',
    'Abrir produto e cupom direto a partir do e-mail.',
  ],
  ['Feature flags remotas', 'Ligar e desligar telas sem publicar nova versão.'],
  ['Relatório de crashes', 'Painel semanal com os crashes mais frequentes.'],
  ['Onboarding em inglês', 'Traduzir as telas de cadastro para o lançamento.'],
  ['Busca de produtos', 'Busca com sugestões e histórico recente.'],
  ['Carrinho offline', 'Guardar o carrinho quando a rede cair.'],
  ['Avaliação na loja', 'Pedir avaliação depois da terceira compra.'],
  [
    'Biometria no login',
    'Entrar com Face ID e digital nos aparelhos suportados.',
  ],
  ['Limite de requisições', 'Proteger a API de catálogo contra picos.'],
  ['Checklist de release', 'Passos de publicação nas duas lojas.'],
  ['Banner de atualização', 'Avisar quando houver versão obrigatória.'],
  ['Métricas de retenção', 'Coortes de D1, D7 e D30 no painel.'],
  ['Revisão de permissões', 'Pedir câmera e localização só quando usadas.'],
  ['Tempo de abertura', 'Medir e reduzir o cold start no Android.'],
]

const pick = <TValue>(values: readonly TValue[], index: number) =>
  values[index % values.length]

const DAY = 24 * 60 * 60 * 1000
const FIRST_DAY = Date.parse('2026-10-01T12:00:00.000Z')

const backlogTasks: Task[] = backlog.map(([title, description], index) => {
  const start = FIRST_DAY + ((index * 5) % 29) * DAY
  return {
    assigneeId: pick(people, index).id,
    description,
    end: new Date(start + 2 * 60 * 60 * 1000).toISOString(),
    estimate: 2 + ((index * 3) % 13),
    id: `TSK-${201 + index}`,
    priority: pick(priorityOptions, index + 1).value,
    start: new Date(start).toISOString(),
    status: pick(statusOptions, index).value,
    title,
  }
})

export const collectionTasks: readonly Task[] = [
  ...initialTasks,
  ...backlogTasks,
]
