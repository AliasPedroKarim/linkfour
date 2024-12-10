import { type ClassValue, clsx } from "clsx";
import { User } from "next-auth";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
	return new Date(date).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function slugify(str: string) {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number) {
	return str.length > length ? `${str.substring(0, length)}...` : str;
}

// Définition des emails admin
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

console.log(
	">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ADMIN_EMAILS",
	ADMIN_EMAILS,
);

export const isAdmin = (user: User): boolean => {
	// if (!user.email) return false;
	// console.log("Checking admin status for:", user.email);
	// console.log("Admin emails:", ADMIN_EMAILS);
	// return ADMIN_EMAILS.includes(user.email.toLowerCase());

	return user.role === "admin";
};
