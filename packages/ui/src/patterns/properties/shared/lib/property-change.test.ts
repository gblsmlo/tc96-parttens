import { describe, expect, mock, test } from 'bun:test'
import { emitChange, isEditable } from './property-change'

describe('isEditable', () => {
  test('is false without any handler', () => {
    expect(isEditable({})).toBe(false)
  })

  test('is true with either handler', () => {
    expect(isEditable({ action: () => undefined })).toBe(true)
    expect(isEditable({ onValueChange: () => undefined })).toBe(true)
  })

  test('readOnly wins over the handlers', () => {
    expect(isEditable({ onValueChange: () => undefined, readOnly: true })).toBe(
      false,
    )
  })
})

describe('emitChange', () => {
  test('runs action with the context and skips onValueChange', () => {
    const action = mock()
    const onValueChange = mock()

    emitChange({ action, onValueChange }, 'next', { previousValue: 'prev' })

    expect(action).toHaveBeenCalledWith('next', { previousValue: 'prev' })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test('falls back to onValueChange without the context', () => {
    const onValueChange = mock()

    emitChange({ onValueChange }, 'next', { previousValue: 'prev' })

    expect(onValueChange).toHaveBeenCalledWith('next')
  })

  test('does nothing without handlers', () => {
    expect(() => emitChange({}, 'next', undefined)).not.toThrow()
  })
})
