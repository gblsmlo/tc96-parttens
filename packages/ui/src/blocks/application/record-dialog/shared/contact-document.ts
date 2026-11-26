export type ContactDocumentKind = 'cpf' | 'cnpj'

const CPF_LENGTH = 11
const CNPJ_LENGTH = 14

export function contactDocumentDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, CNPJ_LENGTH)
}

export function contactDocumentKind(value: string): ContactDocumentKind | null {
  const digits = contactDocumentDigits(value)
  if (digits.length === 0) return null
  return digits.length > CPF_LENGTH ? 'cnpj' : 'cpf'
}

function joinParts(parts: readonly string[], separator: string): string {
  return parts.filter((part) => part.length > 0).join(separator)
}

export function formatContactDocument(value: string): string {
  const digits = contactDocumentDigits(value)
  if (digits.length === 0) return ''
  if (digits.length <= CPF_LENGTH) {
    const head = joinParts(
      [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)],
      '.',
    )
    const check = digits.slice(9, 11)
    return check ? `${head}-${check}` : head
  }
  const head = joinParts(
    [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 8)],
    '.',
  )
  const branch = digits.slice(8, 12)
  const withBranch = branch ? `${head}/${branch}` : head
  const check = digits.slice(12, 14)
  return check ? `${withBranch}-${check}` : withBranch
}

export function parseContactDocument(
  raw: string,
): { success: true; value: string } | { success: false; message: string } {
  const digits = contactDocumentDigits(raw)
  if (digits.length === CPF_LENGTH || digits.length === CNPJ_LENGTH) {
    return { success: true, value: formatContactDocument(digits) }
  }
  return {
    message: 'Informe um CPF ou um CNPJ completo.',
    success: false,
  }
}
