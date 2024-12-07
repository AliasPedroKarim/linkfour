import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	// Créer l'administrateur
	const adminEmail = "admin@example.com";
	const adminPassword = await hash("admin123", 12);
	const admin = await prisma.user.upsert({
		where: { email: adminEmail },
		update: {
			password: adminPassword,
		},
		create: {
			email: adminEmail,
			name: "Admin",
			role: "admin",
			password: adminPassword,
			emailVerified: new Date(),
		},
	});

	// Créer quelques utilisateurs de test
	const users = await Promise.all(
		Array.from({ length: 5 }).map(async (_, i) => {
			const email = `user${i + 1}@example.com`;
			const password = await hash(`user${i + 1}pass`, 12);
			return prisma.user.upsert({
				where: { email },
				update: {
					password,
				},
				create: {
					email,
					name: `Utilisateur ${i + 1}`,
					role: "user",
					password,
					emailVerified: new Date(),
					pages: {
						create: [
							{
								title: `Page de ${i + 1}`,
								slug: `page-${i + 1}`,
								description: `Description de la page ${i + 1}`,
								theme: "default",
								links: {
									create: Array.from({ length: 3 }).map((_, j) => ({
										title: `Lien ${j + 1}`,
										url: `https://example.com/link-${j + 1}`,
										order: j,
										user: {
											connect: { email },
										},
									})),
								},
							},
						],
					},
				},
			});
		}),
	);

	// Créer quelques signalements
	await prisma.report.createMany({
		data: Array.from({ length: 10 }).map((_, i) => ({
			reason: `Signalement ${i + 1}`,
			details: `Détails du signalement ${i + 1}`,
			userId: users[Math.floor(Math.random() * users.length)].id,
			linkId: null,
			pageId: null,
		})),
	});

	console.log({
		admin,
		users,
		message: "Base de données initialisée avec succès !",
	});

	// Afficher les identifiants de connexion pour référence
	console.log("\nIdentifiants de connexion :");
	console.log("Admin :");
	console.log("- Email: admin@example.com");
	console.log("- Mot de passe: admin123");
	console.log("\nUtilisateurs test :");
	Array.from({ length: 5 }).forEach((_, i) => {
		console.log(`\nUtilisateur ${i + 1} :`);
		console.log(`- Email: user${i + 1}@example.com`);
		console.log(`- Mot de passe: user${i + 1}pass`);
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
