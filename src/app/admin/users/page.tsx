import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { format } from "date-fns";

export default async function UsersPage() {
	const session = await auth();
	if (!session?.user || !isAdmin(session.user)) {
		redirect("/auth/login");
	}

	const users = await prisma.user.findMany({
		include: {
			_count: {
				select: {
					pages: true,
					links: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedUsers = users.map((user) => ({
		id: user.id,
		name: user.name || "Sans nom",
		email: user.email || "Pas d'email",
		pagesCount: user._count.pages,
		linksCount: user._count.links,
		createdAt: format(user.createdAt, "dd/MM/yyyy"),
		status: user.emailVerified ? "Vérifié" : "Non vérifié",
		isBanned: user.isBanned,
	}));

	return (
		<div className="container py-10">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
			</div>

			<DataTable columns={columns} data={formattedUsers} />
		</div>
	);
}
