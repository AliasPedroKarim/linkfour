import { prisma } from "@/lib/prisma"
import { type User } from "@prisma/client"

export type SecurityEvent =
  | "login"
  | "logout"
  | "password_change"
  | "email_change"
  | "account_banned"
  | "account_unbanned"
  | "admin_access"
  | "failed_login"

export async function logSecurityEvent(
  event: SecurityEvent,
  data: {
    user?: User | null
    ip?: string | null
    userAgent?: string | null
    details?: string | null
  }
) {
  try {
    await prisma.securityLog.create({
      data: {
        event,
        ip: data.ip || null,
        userAgent: data.userAgent || null,
        details: data.details || null,
        userId: data.user?.id || null,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la création du log de sécurité:", error)
  }
}

export async function getSecurityStats() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

  const [failedLogins, bannedAccounts] = await Promise.all([
    prisma.securityLog.count({
      where: {
        event: "failed_login",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.securityLog.count({
      where: {
        event: "account_banned",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
  ])

  return {
    failedLogins,
    bannedAccounts,
  }
} 