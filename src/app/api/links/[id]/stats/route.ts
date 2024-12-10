import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format, subDays } from "date-fns";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await auth();
	if (!session?.user) {
		return new NextResponse("Non autorisé", { status: 401 });
	}

	const link = await prisma.link.findUnique({
		where: {
			id: params.id,
			userId: session.user.id,
		},
	});

	if (!link) {
		return new NextResponse("Lien non trouvé", { status: 404 });
	}

	// Récupérer les clics des 30 derniers jours
	const thirtyDaysAgo = subDays(new Date(), 30);

	const clicks = await prisma.click.findMany({
		where: {
			linkId: params.id,
			createdAt: {
				gte: thirtyDaysAgo,
			},
		},
	});

	// Agréger les données
	const daily = Array.from({ length: 30 }, (_, i) => {
		const date = format(subDays(new Date(), i), "yyyy-MM-dd");
		const dayClicks = clicks.filter(
			(click) => format(click.createdAt, "yyyy-MM-dd") === date,
		);
		return {
			date,
			clicks: dayClicks.length,
		};
	}).reverse();

	const devices = Object.entries(
		clicks.reduce(
			(acc, click) => {
				const device = click.device || "unknown";
				acc[device] = (acc[device] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		),
	).map(([device, count]) => ({ device, count }));

	const countries = Object.entries(
		clicks.reduce(
			(acc, click) => {
				const country = click.country || "unknown";
				acc[country] = (acc[country] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		),
	).map(([country, count]) => ({ country, count }));

	const referrers = Object.entries(
		clicks.reduce(
			(acc, click) => {
				const referrer = click.referer || "direct";
				acc[referrer] = (acc[referrer] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		),
	).map(([referrer, count]) => ({ referrer, count }));

	return NextResponse.json({
		total: clicks.length,
		daily,
		devices,
		countries,
		referrers,
	});
}
