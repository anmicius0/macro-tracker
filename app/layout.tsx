import type { Metadata, Viewport } from "next";
import { TopAppBar } from "@/components/TopAppBar";
import "./globals.css";

export const metadata: Metadata = {
	title: "Macro Tracker",
	description: "Minimalist macro tracking application",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "dark",
	themeColor: "#1c1c1c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-surface text-on-surface min-h-screen overflow-x-hidden">
				<a href="#main-content" className="skip-link">
					Skip to content
				</a>
				<TopAppBar />
				<div id="main-content">{children}</div>
			</body>
		</html>
	);
}
