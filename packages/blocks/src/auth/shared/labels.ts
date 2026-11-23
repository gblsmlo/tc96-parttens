import type { AuthCommonLabels, AuthNewPasswordLabels } from './types'

export const defaultAuthCommonLabels: AuthCommonLabels = {
  email: 'E-mail',
  errorTitle: 'Não foi possível continuar',
  hidePassword: 'Ocultar senha',
  password: 'Senha',
  providerContinue: (label) => `Continuar com ${label}`,
  providersGroup: 'Entrar com outro serviço',
  providersSeparator: 'ou continue com',
  showPassword: 'Mostrar senha',
}

export const defaultAuthNewPasswordLabels: AuthNewPasswordLabels = {
  confirmPassword: 'Confirmar senha',
  passwordLength: (count, minLength) =>
    `${Math.min(count, minLength)} de ${minLength} caracteres`,
  passwordMismatch: 'As senhas não coincidem.',
  passwordSuggestionsTitle: 'Para uma senha mais segura, use:',
  suggestionLowercase: 'letra minúscula',
  suggestionMet: 'atendida',
  suggestionMissing: 'faltando',
  suggestionNumber: 'número',
  suggestionSymbol: 'símbolo',
  suggestionUppercase: 'letra maiúscula',
}

export function resolveAuthLabels<TLabels>(
  defaults: TLabels,
  labels?: Partial<TLabels>,
): TLabels {
  return { ...defaults, ...labels }
}
