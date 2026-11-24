import { notionists } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

export const avatarUrl = (seed: string) =>
  createAvatar(notionists, { backgroundColor: ['e5e7eb'], seed }).toDataUri()
