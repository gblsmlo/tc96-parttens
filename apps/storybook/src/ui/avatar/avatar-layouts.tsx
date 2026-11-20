import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@tc96/ui/avatar'
import type { AvatarControls } from './avatar-controls.ts'
import { ana, brokenPhoto, bruno, carla } from './avatar-images.ts'
import { avatarSizeClasses } from './avatar-variants.ts'

const groupMembers = [bruno, carla]

export const ComposedAvatar = ({
  broken,
  count,
  element,
  group,
  image,
  initials,
  name,
  size,
  topmost,
}: Readonly<AvatarControls>) => {
  const sizeClassName = avatarSizeClasses[size]
  const avatar = (
    <Avatar
      aria-label={element === 'button' ? name : undefined}
      className={group ? undefined : sizeClassName}
      render={element === 'button' ? <button type="button" /> : undefined}
    >
      {image ? (
        <AvatarImage alt={name} src={broken ? brokenPhoto : ana.photo} />
      ) : null}
      {initials ? <AvatarFallback>{initials}</AvatarFallback> : null}
    </Avatar>
  )
  if (!group) return avatar
  return (
    <AvatarGroup className={sizeClassName} topmost={topmost}>
      {avatar}
      {groupMembers.map((member) => (
        <Avatar key={member.name}>
          <AvatarImage alt={member.name} src={member.photo} />
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      {count ? <AvatarGroupCount>+3</AvatarGroupCount> : null}
    </AvatarGroup>
  )
}
