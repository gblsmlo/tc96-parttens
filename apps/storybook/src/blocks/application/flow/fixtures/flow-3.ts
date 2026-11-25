import type {
  Flow3Connection,
  Flow3Step,
} from '@tc96/ui/blocks/application/flow/flow-3'

export const steps: Flow3Step[] = [
  {
    description: 'Branch main',
    durationMs: 4200,
    id: 'checkout',
    name: 'Obter código',
    owner: 'Marina Costa',
    status: 'succeeded',
  },
  {
    description: 'Imagem de produção',
    durationMs: 38000,
    id: 'build',
    name: 'Compilar',
    owner: 'Marina Costa',
    status: 'succeeded',
  },
  {
    description: '412 casos',
    durationMs: 91000,
    id: 'tests',
    name: 'Testes',
    owner: 'Rafael Lima',
    status: 'succeeded',
  },
  {
    description: '3 avisos bloqueantes',
    durationMs: 6400,
    id: 'lint',
    name: 'Análise estática',
    owner: 'Rafael Lima',
    status: 'failed',
  },
  {
    description: 'Dependências',
    durationMs: 12000,
    id: 'scan',
    name: 'Varredura de segurança',
    status: 'running',
  },
  {
    description: 'Libera a publicação',
    id: 'approval',
    name: 'Liberar release',
    owner: 'Júlia Andrade',
    status: 'waiting-approval',
  },
  {
    description: 'Região sa-east-1',
    id: 'deploy',
    name: 'Publicar em produção',
    status: 'pending',
  },
]

export const connections: Flow3Connection[] = [
  { id: 'c1', source: 'checkout', target: 'build' },
  { id: 'c2', source: 'build', target: 'tests' },
  { id: 'c3', source: 'build', target: 'lint' },
  { id: 'c4', source: 'build', target: 'scan' },
  { id: 'c5', source: 'tests', target: 'approval' },
  { id: 'c6', source: 'approval', target: 'deploy' },
]

export const run = { connections, steps }
