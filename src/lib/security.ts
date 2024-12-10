import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type SecurityEvent =
	| "login"
	| "logout"
	| "password_change"
	| "email_change"
	| "account_banned"
	| "account_unbanned"
	| "admin_access"
	| "failed_login";

export async function logSecurityEvent(
	event: SecurityEvent,
	userId: string | null = null,
	details: string | null = null,
) {
	const headersList = headers();

	await prisma.securityLog.create({
		data: {
			event,
			userId,
			details,
			ip: headersList.get("x-forwarded-for") || null,
			userAgent: headersList.get("user-agent") || null,
		},
	});
}

export async function getSecurityStats() {
	const now = new Date();
	const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

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
	]);

	return {
		failedLogins,
		bannedAccounts,
	};
}
