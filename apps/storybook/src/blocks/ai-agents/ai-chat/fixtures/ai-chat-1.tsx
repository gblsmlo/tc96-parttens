import {
  BookOpenIcon,
  CodeIcon,
  CompassIcon,
  FileTextIcon,
  GlobeIcon,
  LinkSimpleIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import type {
  AiChat1AttachAction,
  AiChat1Chip,
  AiChat1Message,
  AiChat1Model,
  AiChat1Starter,
  AiChat1Thread,
  AiChat1Usage,
} from '@tc96/ui/blocks/ai-agents/ai-chat/ai-chat-1'

export const copilotThreads: AiChat1Thread[] = [
  { id: 'launch-plan', pinned: true, title: 'Plano de lançamento do Q1' },
  { id: 'refund-policy', pinned: true, title: 'Política de reembolso' },
  { id: 'churn-query', title: 'Consulta de churn por plano' },
  { id: 'acme-meeting', title: 'Resumo da reunião com a Acme' },
  { id: 'onboarding-ideas', title: 'Ideias para o onboarding' },
]

export const copilotModels: AiChat1Model[] = [
  {
    description: 'Respostas mais completas',
    id: 'atlas-pro',
    label: 'Atlas Pro',
  },
  {
    description: 'Mais rápido e barato',
    id: 'atlas-mini',
    label: 'Atlas Mini',
  },
]

export const copilotStarters: AiChat1Starter[] = [
  {
    icon: <PencilSimpleIcon aria-hidden="true" />,
    id: 'create',
    label: 'Criar',
    prompts: [
      'Escreva um e-mail de boas-vindas para novos clientes',
      'Monte a pauta da reunião semanal do time de produto',
      'Sugira três títulos para o post sobre o lançamento',
    ],
  },
  {
    icon: <CompassIcon aria-hidden="true" />,
    id: 'explore',
    label: 'Explorar',
    prompts: [
      'Quais clientes tiveram queda de uso no último mês?',
      'Compare a receita dos planos Pro e Equipe no trimestre',
    ],
  },
  {
    icon: <CodeIcon aria-hidden="true" />,
    id: 'code',
    label: 'Código',
    prompts: [
      'Escreva uma consulta SQL de churn por plano',
      'Explique o que faz este hook de React',
    ],
  },
  {
    icon: <BookOpenIcon aria-hidden="true" />,
    id: 'learn',
    label: 'Aprender',
    prompts: [
      'Explique a diferença entre churn de receita e de clientes',
      'Como calcular o LTV de um cliente?',
    ],
  },
]

export const copilotAttachActions: AiChat1AttachAction[] = [
  {
    icon: <FileTextIcon aria-hidden="true" />,
    id: 'file',
    label: 'Arquivo do computador',
  },
  {
    icon: <GlobeIcon aria-hidden="true" />,
    id: 'page',
    label: 'Página atual',
  },
  {
    icon: <LinkSimpleIcon aria-hidden="true" />,
    id: 'link',
    label: 'Link',
  },
]

export const copilotAttachChips: Record<string, AiChat1Chip> = {
  file: { id: 'chip-file', kind: 'file', label: 'assinaturas-2026.csv' },
  link: { id: 'chip-link', kind: 'link', label: 'docs.exemplo.com/metricas' },
  page: { id: 'chip-page', kind: 'page', label: 'Painel de receita' },
}

export const copilotChips: AiChat1Chip[] = [
  { id: 'chip-clients', kind: 'file', label: 'clientes.csv' },
  { id: 'chip-dashboard', kind: 'page', label: 'Painel de receita' },
]

export const copilotUsage: AiChat1Usage = { limit: 200000, used: 48200 }

export const churnQuery = `select
  plano,
  count(*) filter (where cancelado_em is not null) as cancelados,
  count(*) as total,
  round(100.0 * count(*) filter (where cancelado_em is not null) / count(*), 1) as churn
from assinaturas
where iniciado_em < date '2026-10-01'
group by plano
order by churn desc;`

export const copilotMessages: AiChat1Message[] = [
  {
    chips: [{ id: 'chip-clients', kind: 'file', label: 'clientes.csv' }],
    id: 'm1',
    role: 'user',
    text: 'Preciso do churn por plano no último trimestre. Pode montar a consulta?',
  },
  {
    code: { code: churnQuery, language: 'SQL' },
    id: 'm2',
    model: 'atlas-pro',
    reasoning: {
      seconds: 6,
      text: 'O arquivo tem as colunas plano, iniciado_em e cancelado_em. Churn do trimestre = assinaturas canceladas entre outubro e dezembro dividido pelas ativas no início do período.',
    },
    role: 'assistant',
    sources: [
      {
        href: 'https://example.com/metricas/churn',
        id: 's1',
        title: 'Guia de métricas: churn',
      },
      {
        href: 'https://example.com/dados/assinaturas',
        id: 's2',
        title: 'Dicionário da tabela assinaturas',
      },
    ],
    text: 'Montei a consulta considerando só as assinaturas ativas no início do trimestre.\n\nEla agrupa por plano, conta os cancelamentos e devolve o churn em porcentagem, do maior para o menor.',
  },
  {
    id: 'm3',
    role: 'user',
    text: 'E qual plano está pior?',
  },
  {
    feedback: 'up',
    id: 'm4',
    model: 'atlas-pro',
    role: 'assistant',
    text: 'Pelos dados de clientes.csv, o plano Básico tem o maior churn: 7,8% no trimestre, contra 3,1% no Pro e 1,4% no Equipe.\n\nVale olhar o onboarding do Básico: 60% dos cancelamentos acontecem nos primeiros 30 dias.',
  },
]

export const copilotReply = (prompt: string): string =>
  `Entendi: "${prompt}". Separei os pontos principais e posso detalhar qualquer um deles.\n\nSe quiser, anexe um arquivo para eu usar os seus dados na resposta.`
