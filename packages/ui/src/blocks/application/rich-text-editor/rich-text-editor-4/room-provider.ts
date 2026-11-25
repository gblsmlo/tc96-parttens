import {
  type ProviderConstructorProps,
  registerProviderType,
  type UnifiedProvider,
} from '@platejs/yjs'
import type { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'

export const ROOM_PROVIDER_TYPE = 'tc96-room'

class RoomProvider implements UnifiedProvider {
  awareness: Awareness
  document: Y.Doc
  isConnected = false
  isSynced = false
  type = ROOM_PROVIDER_TYPE
  private readonly props: ProviderConstructorProps

  constructor(props: ProviderConstructorProps) {
    this.props = props
    this.awareness = props.awareness as Awareness
    this.document = props.doc as Y.Doc
  }

  connect() {
    this.isConnected = true
    this.isSynced = true
    this.props.onConnect?.()
    this.props.onSyncChange?.(true)
  }

  disconnect() {
    this.isConnected = false
    this.isSynced = false
    this.props.onDisconnect?.()
  }

  destroy() {
    this.disconnect()
  }
}

registerProviderType(ROOM_PROVIDER_TYPE, RoomProvider)
