import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { format, subDays } from "date-fns";

export default async function SecurityLogsPage() {
	const session = await auth();
	if (!session?.user || !isAdmin(session.user)) {
		redirect("/auth/login");
	}

	const logs = await prisma.securityLog.findMany({
		where: {
			createdAt: {
				gte: subDays(new Date(), 30),
			},
		},
		include: {
			user: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedLogs = logs.map((log) => ({
		id: log.id,
		event: log.event,
		ip: log.ip,
		userAgent: log.userAgent,
		user: log.user?.name || log.user?.email || "Système",
		details: log.details || "",
		createdAt: format(log.createdAt, "dd/MM/yyyy HH:mm"),
	}));

	return (
		<div className="container py-10">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Logs de sécurité</h1>
			</div>

			<DataTable columns={columns} data={formattedLogs} />
		</div>
	);
}
