"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-6 text-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
			<div className="flex items-center gap-3 mb-6">
				<span className="material-symbols-outlined text-error text-3xl">error</span>
				<h2 className="text-xl font-bold text-error">Unexpected error</h2>
			</div>
			<p className="text-sm text-on-surface-variant mb-8 max-w-xs">
				Something went wrong. You can try resetting the page.
			</p>
			<button
				onClick={() => reset()}
				className="min-h-[44px] px-6 py-3 bg-primary text-on-primary rounded-none border border-primary interaction-tap touch-manipulation font-semibold text-sm"
			>
				Try again
			</button>
		</div>
	);
}
