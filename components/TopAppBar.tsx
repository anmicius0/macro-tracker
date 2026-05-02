"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// --- TopAppBar ---
export function TopAppBar() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Overview", icon: "analytics" },
		{ href: "/sys", label: "Settings", icon: "settings" },
	];

	return (
		<header className="w-full top-0 sticky bg-surface border-b border-outline/15 z-50 pt-[env(safe-area-inset-top)]">
			<div className="flex items-center justify-between px-4 py-2 w-full max-w-5xl mx-auto">
				<nav className="flex items-center gap-1" aria-label="Main navigation">
					{navItems.map((item) => {
						const active =
							item.href === "/"
								? pathname === "/" || pathname?.startsWith("/log")
								: pathname?.startsWith(item.href);
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-none transition-colors touch-manipulation ${
									active
										? "bg-surface-container text-primary"
										: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
								}`}
								aria-current={active ? "page" : undefined}
							>
								<span
									className="material-symbols-outlined text-lg"
									style={{
										fontVariationSettings: `'FILL' ${active ? 1 : 0}, 'wght' ${active ? 400 : 300}`,
									}}
									aria-hidden="true"
								>
									{item.icon}
								</span>
								<span className="text-sm font-semibold hidden sm:inline">{item.label}</span>
							</Link>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
