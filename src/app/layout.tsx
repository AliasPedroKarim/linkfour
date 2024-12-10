import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { SecurityLog } from "@/components/security-log";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/landing/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	console.log("Admin emails:", process.env.ADMIN_EMAILS);

	return (
		<html lang="fr" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<SecurityLog />
						{children}
						<Toaster richColors />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
