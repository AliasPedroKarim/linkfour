import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await auth();
	if (!session?.user || !isAdmin(session.user)) {
		return new NextResponse("Non autorisé", { status: 401 });
	}

	try {
		const report = await prisma.report.delete({
			where: { id: params.id },
		});

		// Mettre à jour le compteur de signalements
		if (report.linkId) {
			await prisma.link.update({
				where: { id: report.linkId },
				data: {
					reportCount: {
						decrement: 1,
					},
				},
			});
		}

		if (report.pageId) {
			await prisma.page.update({
				where: { id: report.pageId },
				data: {
					reportCount: {
						decrement: 1,
					},
				},
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur lors de la suppression du signalement:", error);
		return new NextResponse("Erreur interne", { status: 500 });
	}
}
