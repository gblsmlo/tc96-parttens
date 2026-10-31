import { expect, test } from 'bun:test'
import * as parttens from '../../index'

test('publishes one collection-owned toolbar API', () => {
  expect(typeof parttens.CollectionToolbar).toBe('function')
  expect(typeof parttens.ViewSettingsMenu).toBe('function')
  expect(typeof parttens.ViewSettingsSection).toBe('function')
  expect(typeof parttens.PresetsMenu).toBe('function')
  expect(Reflect.has(parttens, 'SavedViewsMenu')).toBe(false)
  // Os dois gatilhos vizinhos viraram seções de um só menu (Decisão 058); o
  // catálogo não pode reoferecer o arranjo antigo.
  expect(Reflect.has(parttens, 'FilterMenu')).toBe(false)
  expect(Reflect.has(parttens, 'SettingsMenu')).toBe(false)
  expect(typeof parttens.Action).toBe('function')
})
