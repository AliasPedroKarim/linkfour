import { type User } from "@prisma/client"
import { type Session } from "next-auth"

export type Role = "admin" | "user"

export function hasRole(user: User | null | undefined, role: Role): boolean {
  return user?.role === role
}

export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, "admin")
}

export function canModerate(user: User | null | undefined): boolean {
  return isAdmin(user)
}

export function canManageUser(
  currentUser: User | null | undefined,
  targetUser: User
): boolean {
  if (!currentUser) return false
  if (isAdmin(currentUser)) return true
  return currentUser.id === targetUser.id
}

export function canAccessAdminArea(session: Session | null): boolean {
  if (!session?.user) return false
  return isAdmin(session.user as User)
}

export function canManageContent(
  user: User | null | undefined,
  content: { userId: string }
): boolean {
  if (!user) return false
  if (isAdmin(user)) return true
  return user.id === content.userId
} 