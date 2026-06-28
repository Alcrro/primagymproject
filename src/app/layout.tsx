import type { Metadata } from "next";
import "./globals.scss";
import Navbar from "@/components/navbarV2/NavbarV2";
import DarkThemeProviders from "./darkThemeProviders";
import Footer from "@/components/footer/Footer";
import localFont from "next/font/local";
import { ContextAPI } from "@/context/contextAPI/ContextAPI";
import AddToCartProvider from "@/context/addToCart/AddToCartContext";
import Head from "next/head";
const BASE_URL = 'https://apexfit.ro';

export const metadata: Metadata = {
	title: {
		default: 'ApexFit | Sala de Fitness din Bacău',
		template: '%s | ApexFit',
	},
	description:
		'ApexFit — sala de fitness, zumba, aerobic și cycling din Bacău. Abonamente accesibile, antrenori certificați, echipamente moderne. Înscrie-te azi!',
	metadataBase: new URL(BASE_URL),
	openGraph: {
		type: 'website',
		locale: 'ro_RO',
		url: BASE_URL,
		siteName: 'ApexFit',
		title: 'ApexFit | Sala de Fitness din Bacău',
		description:
			'Sala de fitness, zumba, aerobic și cycling din Bacău. Antrenori certificați, echipamente moderne, prețuri accesibile.',
		images: [
			{
				url: '/cardsImages/fitnessCards.jpg',
				width: 1200,
				height: 630,
				alt: 'ApexFit — Sala de Fitness din Bacău',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ApexFit | Sala de Fitness din Bacău',
		description: 'Sala de fitness, zumba, aerobic și cycling din Bacău.',
		images: ['/cardsImages/fitnessCards.jpg'],
	},
};

const roboto = localFont({
	src: "../../public/fonts/roboto-400.woff2",
	weight: "400",
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
							</main>
						</DarkThemeProviders>
					</AddToCartProvider>
				</ContextAPI>
			</body>
		</html>
	);
}
