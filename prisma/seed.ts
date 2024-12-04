import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Créer l'administrateur
  const adminEmail = "admin@example.com"
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      role: "admin",
      emailVerified: new Date(),
    },
  })

  // Créer quelques utilisateurs de test
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async (_, i) => {
      const email = `user${i + 1}@example.com`
      return prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: `Utilisateur ${i + 1}`,
          role: "user",
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
                  })),
                },
              },
            ],
          },
        },
      })
    })
  )

  // Créer quelques signalements
  await prisma.report.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      reason: `Signalement ${i + 1}`,
      details: `Détails du signalement ${i + 1}`,
      userId: users[Math.floor(Math.random() * users.length)].id,
      linkId: null,
      pageId: null,
    })),
  })

  console.log({
    admin,
    users,
    message: "Base de données initialisée avec succès !",
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 