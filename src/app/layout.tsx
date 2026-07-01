import type { Metadata, Viewport } from "next";
import "./globals.scss";
import Navbar from "@/components/navbarV2/NavbarV2";
import DarkThemeProviders from "./darkThemeProviders";
import Footer from "@/components/footer/Footer";
import { Roboto } from "next/font/google";
import { ContextAPI } from "@/context/contextAPI/ContextAPI";
import AddToCartProvider from "@/context/addToCart/AddToCartContext";
import AiChatbot from "@/components/ai/AiChatbot";
import AiIntakeGate from "@/components/ai/AiIntakeGate";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import PwaBottomNav from "@/components/pwa/PwaBottomNav";
import { Suspense } from "react";
const BASE_URL = "https://apexfit.ro";

export const metadata: Metadata = {
	title: {
		default: "ApexFit | Sală de Fitness & Aerobic",
		template: "%s | ApexFit",
	},
	description:
		"ApexFit — sală de fitness, zumba, aerobic și cycling. Abonamente accesibile, antrenori certificați, echipamente moderne. Înscrie-te azi!",
	metadataBase: new URL(BASE_URL),
	openGraph: {
		type: "website",
		locale: "ro_RO",
		url: BASE_URL,
		siteName: "ApexFit",
		title: "ApexFit | Sală de Fitness & Aerobic",
		description:
			"Sală de fitness, zumba, aerobic și cycling. Antrenori certificați, echipamente moderne, prețuri accesibile.",
		images: [
			{
				url: "/cardsImages/fitnessCards.jpg",
				width: 1200,
				height: 630,
				alt: "ApexFit — Sală de Fitness & Aerobic",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "ApexFit | Sală de Fitness & Aerobic",
		description: "Sală de fitness, zumba, aerobic și cycling.",
		images: ["/cardsImages/fitnessCards.jpg"],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "ApexFit",
	},
	applicationName: "ApexFit",
	formatDetection: { telephone: false },
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#FF5C00" },
		{ media: "(prefers-color-scheme: dark)", color: "#FF5C00" },
	],
};

const roboto = Roboto({
	weight: "400",
	subsets: ["latin", "latin-ext"],
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body>
				<ContextAPI>
					<AddToCartProvider>
						<DarkThemeProviders>
							<main className={`${roboto.className} relative`}>
								<Navbar />
								<div className="page-content">{children}</div>
								<Footer />
								<AiChatbot />
								<Suspense fallback={null}>
									<AiIntakeGate />
								</Suspense>
								<PwaInstallPrompt />
								<PwaBottomNav />
							</main>
						</DarkThemeProviders>
					</AddToCartProvider>
				</ContextAPI>
			</body>
		</html>
	);
}
