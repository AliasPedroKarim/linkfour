"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { isAdmin } from "@/lib/utils";

export function SignInButton() {
	const { data: session } = useSession();

	const handleSignOut = async () => {
		try {
			await nextAuthSignOut({ redirect: true, callbackUrl: "/" });
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
		}
	};

	if (session?.user) {
		console.log("Session user:", session.user);
		console.log("Is admin?", isAdmin(session.user));

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						{session.user.name || session.user.email}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{isAdmin(session.user) && (
						<DropdownMenuItem asChild>
							<Link href="/admin/dashboard">Administration</Link>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem asChild>
						<Link href="/dashboard">Tableau de bord</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/profile">Profil</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleSignOut}>
						Déconnexion
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return <Button onClick={() => signIn()}>Connexion</Button>;
}
