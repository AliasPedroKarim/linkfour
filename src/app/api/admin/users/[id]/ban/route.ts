import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await auth();
	if (!session?.user || !isAdmin(session.user)) {
		return new NextResponse("Non autorisé", { status: 401 });
	}

	try {
		// Vérifier que l'utilisateur n'est pas un admin
		const targetUser = await prisma.user.findUnique({
			where: { id: params.id },
		});

		if (!targetUser) {
			return new NextResponse("Utilisateur non trouvé", { status: 404 });
		}

		if (isAdmin(targetUser)) {
			return new NextResponse("Impossible de bannir un administrateur", {
				status: 403,
			});
		}

		// Désactiver les pages et les liens de l'utilisateur
		await prisma.$transaction([
			prisma.page.updateMany({
				where: { userId: params.id },
				data: { isPublic: false },
			}),
			prisma.link.updateMany({
				where: { userId: params.id },
				data: { isActive: false },
			}),
			prisma.user.update({
				where: { id: params.id },
				data: { isBanned: true },
			}),
		]);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur lors du bannissement:", error);
		return new NextResponse("Erreur interne", { status: 500 });
	}
}
