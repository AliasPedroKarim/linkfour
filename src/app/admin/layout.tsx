import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/utils";
import { AdminNav } from "@/components/admin/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session?.user || !isAdmin(session.user)) {
		redirect("/auth/login");
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-b">
				<div className="container flex h-16 items-center justify-between mx-auto">
					<div className="flex items-center gap-6">
						<Link href="/" className="font-bold">
							LinkTree Clone
						</Link>
						<AdminNav />
					</div>
					<div className="flex items-center gap-4">
						<ThemeToggle />
						<Link href="/dashboard">Retour au dashboard</Link>
					</div>
				</div>
			</header>
			<main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}
