import { describe, expect, test } from 'bun:test'
import { phoneNumberSchema } from './phone-number'

describe('phoneNumberSchema', () => {
  test('accepts a complete number', () => {
    expect(phoneNumberSchema().safeParse('+5511987654321').success).toBe(true)
  })

  test('rejects a number that is still incomplete', () => {
    const result = phoneNumberSchema().safeParse('+55119876')

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Informe um telefone válido.')
  })

  test('rejects digits that no country accepts, not only short ones', () => {
    expect(phoneNumberSchema().safeParse('+551199999999').success).toBe(false)
  })

  test('reports an empty field with the required message', () => {
    const result = phoneNumberSchema().safeParse('')

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Informe um telefone.')
  })

  test('carries the messages the consumer chose', () => {
    const schema = phoneNumberSchema({
      invalidMessage: 'Número incompleto.',
      requiredMessage: 'Campo obrigatório.',
    })

    expect(schema.safeParse('').error?.issues[0]?.message).toBe(
      'Campo obrigatório.',
    )
    expect(schema.safeParse('+55119876').error?.issues[0]?.message).toBe(
      'Número incompleto.',
    )
  })
})
