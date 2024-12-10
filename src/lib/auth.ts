import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import Facebook from "next-auth/providers/facebook";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, User } from "next-auth";
import { logSecurityEvent } from "./security";

// Étendre les types par défaut
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: string;
		} & DefaultSession["user"];
	}

	interface User {
		role: string;
	}
}

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/login",
	},
	secret: process.env.AUTH_SECRET,
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
			if (isOnDashboard) {
				if (isLoggedIn) return true;
				return false;
			}
			return true;
		},
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
		async signIn({ user }) {
			try {
				await logSecurityEvent("login", user.id);
			} catch (error) {
				console.error("Erreur lors du log de connexion:", error);
			}
			return true;
		},
	},
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Mot de passe", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email et mot de passe requis");
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
					select: {
						id: true,
						email: true,
						name: true,
						password: true,
						role: true,
					},
				});

				if (!user || !user.password) {
					throw new Error("Aucun utilisateur trouvé");
				}

				const isPasswordValid = await compare(
					credentials.password,
					user.password,
				);

				if (!isPasswordValid) {
					throw new Error("Mot de passe incorrect");
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
		Discord({
			clientId: process.env.DISCORD_CLIENT_ID || "",
			clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
		}),
		Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID || "",
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
		}),
	],
});
