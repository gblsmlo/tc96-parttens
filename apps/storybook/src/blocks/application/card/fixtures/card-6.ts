import type { Card6Job } from '@tc96/ui/blocks/application/card/card-6'

export const jobs: Card6Job[] = [
  {
    company: 'Atlas Tecnologia',
    id: 'frontend',
    location: 'São Paulo, SP',
    salary: { max: 14000, min: 9000 },
    title: 'Engenheira de front-end',
    workMode: 'hybrid',
  },
  {
    company: 'Rio Dados',
    id: 'data',
    location: 'Brasil',
    salary: { max: 16500, min: 11000 },
    title: 'Analista de dados sênior',
    workMode: 'remote',
  },
  {
    company: 'Vale Logística',
    id: 'product',
    location: 'Belo Horizonte, MG',
    title: 'Gerente de produto',
    workMode: 'onsite',
  },
]
