import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "🎄 Gift Redemption System",
	description: "Redeem gifts for your team! Merry Christmas! 🎅🎁🎄",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={ `dark ${inter.className}` }>
				<Providers>
					<Toaster />
					{ children }
				</Providers>
			</body>
		</html>
	);
}
