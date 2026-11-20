export const avatarSizeNames = ['16px', '24px', '32px', '40px', '48px'] as const

export type AvatarSizeName = (typeof avatarSizeNames)[number]

export const avatarSizeClasses: Record<AvatarSizeName, string | undefined> = {
  '16px': '[--avatar-size:--spacing(4)]',
  '24px': '[--avatar-size:--spacing(6)]',
  '32px': undefined,
  '40px': '[--avatar-size:--spacing(10)]',
  '48px': '[--avatar-size:--spacing(12)]',
}

export const avatarElementNames = ['span', 'button'] as const

export type AvatarElementName = (typeof avatarElementNames)[number]

export const avatarTopmostNames = ['first', 'last'] as const

export type AvatarTopmostName = (typeof avatarTopmostNames)[number]
