import type { Navbar10Labels } from './types'

export const defaultNavbar10Labels: Navbar10Labels = {
  account: 'Menu da conta',
  method: 'Método HTTP',
  path: 'Caminho da requisição',
  pathPlaceholder: '/modelos/{id}',
  request: 'Requisição',
  send: 'Enviar',
  service: 'Serviço',
  serviceTrigger: (name) => `Serviço: ${name}`,
}
