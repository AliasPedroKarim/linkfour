"use client";

import { signOut as nextAuthSignOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
	const handleSignOut = async () => {
		try {
			await nextAuthSignOut({ redirect: true, callbackUrl: "/" });
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
		}
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleSignOut}
			title="Se déconnecter"
		>
			<LogOut className="h-4 w-4" />
		</Button>
	);
}
