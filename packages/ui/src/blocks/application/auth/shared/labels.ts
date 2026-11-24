import type { AuthCommonLabels, AuthNewPasswordLabels } from './types'

export const defaultAuthCommonLabels: AuthCommonLabels = {
  email: 'E-mail',
  errorTitle: 'Não foi possível continuar',
  hidePassword: 'Ocultar senha',
  password: 'Senha',
  providerContinue: (label) => `Continuar com ${label}`,
  providersGroup: 'Entrar com outro serviço',
  providersSeparator: 'ou continue com e-mail',
  showPassword: 'Mostrar senha',
}

export const defaultAuthNewPasswordLabels: AuthNewPasswordLabels = {
  confirmPassword: 'Confirmar senha',
  passwordMismatch: 'As senhas não coincidem.',
  suggestionLowercase: 'minúscula',
  suggestionMet: 'atendida',
  suggestionMissing: 'faltando',
  suggestionNumber: 'número',
  suggestionSymbol: 'símbolo',
  suggestionUppercase: 'maiúscula',
}

export function resolveAuthLabels<TLabels>(
  defaults: TLabels,
  labels?: Partial<TLabels>,
): TLabels {
  return { ...defaults, ...labels }
}
