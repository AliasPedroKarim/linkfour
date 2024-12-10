"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
	{
		title: "Vue d'ensemble",
		href: "/admin",
	},
	{
		title: "Utilisateurs",
		href: "/admin/users",
	},
	{
		title: "Signalements",
		href: "/admin/reports",
	},
	{
		title: "Logs",
		href: "/admin/logs",
	},
	{
		title: "Sécurité",
		href: "/admin/security",
	},
];

export function AdminNav() {
	const pathname = usePathname();

	return (
		<nav className="hidden gap-6 md:flex">
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						pathname === item.href
							? "text-foreground"
							: "text-muted-foreground",
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
}
