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
			role: "admin",
		},
		create: {
			email: adminEmail,
			name: "Admin",
			role: "admin",
			password: adminPassword,
			emailVerified: new Date(),
		},
	});

	console.log("Admin user created:", admin);

	// Créer quelques utilisateurs de test
	const users = await Promise.all(
		Array.from({ length: 20 }).map(async (_, i) => {
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
						create: Array.from({
							length: Math.floor(Math.random() * 4) + 1,
						}).map((_, pageIndex) => ({
							title: `Page ${pageIndex + 1} de l'utilisateur ${i + 1}`,
							slug: `page-${i + 1}-${pageIndex + 1}`,
							description: `Description détaillée de la page ${pageIndex + 1} de l'utilisateur ${i + 1}`,
							theme: ["default", "dark", "light", "colorful"][
								Math.floor(Math.random() * 4)
							],
							links: {
								create: Array.from({
									length: Math.floor(Math.random() * 8) + 2,
								}).map((_, j) => ({
									title: `Lien ${j + 1}`,
									url: `https://example.com/user${i + 1}/link-${j + 1}`,
									order: j,
									user: {
										connect: { email },
									},
								})),
							},
						})),
					},
				},
			});
		}),
	);

	// Création des métriques pour chaque page
	for (const user of users) {
		const userPages = await prisma.page.findMany({
			where: { userId: user.id },
		});

		for (const page of userPages) {
			// Création des vues sur 30 jours avec des données plus détaillées
			await prisma.pageView.createMany({
				data: Array.from({ length: 30 }).map((_, i) => {
					const devices = ["desktop", "mobile", "tablet"];
					const countries = ["FR", "US", "GB", "DE", "ES"];
					const cities = ["Paris", "New York", "London", "Berlin", "Madrid"];
					const referers = [
						"https://google.com",
						"https://facebook.com",
						"https://twitter.com",
						null,
					];

					return {
						pageId: page.id,
						ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
						userAgent: [
							"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
							"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
							"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
							"Mozilla/5.0 (Linux; Android 11; SM-G991B)",
						][Math.floor(Math.random() * 4)],
						device: devices[Math.floor(Math.random() * devices.length)],
						country: countries[Math.floor(Math.random() * countries.length)],
						city: cities[Math.floor(Math.random() * cities.length)],
						referer: referers[Math.floor(Math.random() * referers.length)],
						createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
					};
				}),
			});

			// Création des clics pour chaque lien
			const pageLinks = await prisma.link.findMany({
				where: { pageId: page.id },
			});

			for (const link of pageLinks) {
				await prisma.click.createMany({
					data: Array.from({ length: Math.floor(Math.random() * 50) + 10 }).map(
						() => {
							const devices = ["desktop", "mobile", "tablet"];
							const countries = ["FR", "US", "GB", "DE", "ES"];
							const cities = [
								"Paris",
								"New York",
								"London",
								"Berlin",
								"Madrid",
							];
							const referers = [
								"https://google.com",
								"https://facebook.com",
								"https://twitter.com",
								null,
							];

							return {
								linkId: link.id,
								ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
								userAgent: [
									"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
									"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
									"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
									"Mozilla/5.0 (Linux; Android 11; SM-G991B)",
								][Math.floor(Math.random() * 4)],
								device: devices[Math.floor(Math.random() * devices.length)],
								country:
									countries[Math.floor(Math.random() * countries.length)],
								city: cities[Math.floor(Math.random() * cities.length)],
								referer: referers[Math.floor(Math.random() * referers.length)],
								createdAt: new Date(
									Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
								),
							};
						},
					),
				});
			}
		}
	}

	// Créer quelques signalements
	await prisma.report.createMany({
		data: Array.from({ length: 30 }).map((_, i) => ({
			reason: [
				"Contenu inapproprié",
				"Spam",
				"Violation des droits d'auteur",
				"Harcèlement",
				"Fausse information",
			][Math.floor(Math.random() * 5)],
			details: `Détails détaillés du signalement ${i + 1}. Signalement effectué le ${new Date().toLocaleDateString()}`,
			userId: users[Math.floor(Math.random() * users.length)].id,
			linkId: null,
			pageId: null,
		})),
	});

	console.log({
		admin,
		usersCount: users.length,
		message: "Base de données initialisée avec succès !",
	});

	// Afficher les identifiants de connexion pour référence
	console.log("\nIdentifiants de connexion :");
	console.log("Admin :");
	console.log("- Email: admin@example.com");
	console.log("- Mot de passe: admin123");
	console.log("\nUtilisateurs test :");
	Array.from({ length: 20 }).forEach((_, i) => {
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
