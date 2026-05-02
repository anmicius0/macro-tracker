"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useMemo } from "react";
import { MacroLine } from "@/components/MacroLine";
import { getTodayDateStr } from "@/utils/core";
import { db } from "@/utils/db";

export default function Home() {
	const today = getTodayDateStr();

	// --- 1. Fetch Data (Formerly useOverviewData) ---
	const target = useLiveQuery(() => db.targets.get(1));
	const logs = useLiveQuery(() => db.entries.where("log_date").equals(today).toArray(), [today]);

	// --- 2. Calculate Goals & Totals ---
	const goals = useMemo(() => {
		const p = target?.protein_g ?? 180;
		const c = target?.carbs_g ?? 250;
		const f = target?.fat_g ?? 75;
		return { goalProtein: p, goalCarbs: c, goalFat: f, goalCalories: p * 4 + c * 4 + f * 9 };
	}, [target]);

	const totals = useMemo(() => {
		const safeLogs = logs ?? [];
		const p = safeLogs.reduce((acc, c) => acc + (c.protein_g || 0), 0);
		const c = safeLogs.reduce((acc, c) => acc + (c.carbs_g || 0), 0);
		const f = safeLogs.reduce((acc, c) => acc + (c.fat_g || 0), 0);
		return { protein: p, carbs: c, fat: f, consumed: p * 4 + c * 4 + f * 9 };
	}, [logs]);

	const sortedLogs = useMemo(
		() => [...(logs || [])].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
		[logs],
	);

	return (
		<div dir="auto">
			<main className="px-6 mt-12 max-w-5xl mx-auto">
				{/* --- Log Food Hero --- */}
				<section className="mb-12">
					<div className="flex items-center gap-4 mb-6">
						<div className="h-px flex-1 bg-outline/50" />
						<span className="text-[10px] font-mono font-bold tracking-widest uppercase text-on-surface-variant whitespace-nowrap">
							Log Food
						</span>
						<div className="h-px flex-1 bg-outline/50" />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
						<Link
							href="/log/entry"
							className="group flex items-center justify-between p-5 bg-primary text-on-primary hover:bg-primary/90 transition-colors rounded-none interaction-tap"
						>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 flex items-center justify-center bg-on-primary/10 rounded-none">
									<span className="material-symbols-outlined text-lg">terminal</span>
								</div>
								<span className="font-bold text-sm">Manual Entry</span>
							</div>
							<span className="material-symbols-outlined text-sm text-on-primary/70">
								chevron_right
							</span>
						</Link>

						<Link
							href="/log/favorites"
							className="group flex items-center justify-between p-5 bg-surface-container hover:bg-surface-container/80 transition-colors rounded-none border border-outline/15 interaction-tap"
						>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 flex items-center justify-center bg-on-surface/5 rounded-none">
									<span className="material-symbols-outlined text-lg">database</span>
								</div>
								<span className="font-bold text-sm">Library</span>
							</div>
							<span className="material-symbols-outlined text-sm text-on-surface-variant">
								chevron_right
							</span>
						</Link>
					</div>
				</section>

				{/* --- Energy Readout --- */}
				<section className="mb-12">
					<div className="flex items-center gap-4 mb-6">
						<div className="h-px flex-1 bg-outline/50" />
						<span className="text-[10px] font-mono font-bold tracking-widest uppercase text-on-surface-variant whitespace-nowrap">
							Energy
						</span>
						<div className="h-px flex-1 bg-outline/50" />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-start gap-8">
						<div>
							<div className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-1">
								Remaining
							</div>
							<div className="font-mono text-3xl lg:text-4xl font-black tabular-nums tracking-tighter">
								{Math.round(
									Math.max(0, (goals.goalCalories ?? 2400) - totals.consumed),
								).toLocaleString()}
							</div>
							<div className="text-xs font-mono text-on-surface-variant mt-1">
								/ {Math.round(goals.goalCalories ?? 2400).toLocaleString()} kcal
							</div>
						</div>

						<div className="hidden lg:block h-24 w-px bg-outline/50" />

						<div className="space-y-4">
							{target !== undefined && (
								<>
									<MacroLine
										label="Protein"
										current={totals.protein}
										target={goals.goalProtein}
										color="var(--color-protein)"
									/>
									<MacroLine
										label="Carbs"
										current={totals.carbs}
										target={goals.goalCarbs}
										color="var(--color-carbs)"
									/>
									<MacroLine
										label="Fat"
										current={totals.fat}
										target={goals.goalFat}
										color="var(--color-fats)"
									/>
								</>
							)}
						</div>
					</div>
				</section>

				{/* --- Today's Log --- */}
				<section className="border-t border-outline/50 mt-6 pt-2">
					<div className="divide-y divide-outline/15">
						{logs !== undefined && sortedLogs.length === 0 ? (
							<div className="py-16 text-center">
								<p className="text-sm font-mono text-on-surface-variant">No entries yet.</p>
							</div>
						) : (
							sortedLogs.map((log, index) => (
								<div
									key={log.id ?? index}
									className="flex justify-between items-center py-5 gap-4 hover:bg-surface-container transition-colors px-4 -mx-4 min-w-0"
								>
									<div className="min-w-0 flex-1">
										<p className="font-semibold truncate">{log.meal_type || "Entry"}</p>
										<p className="text-xs text-on-surface-variant mt-1 font-mono">
											P: {Math.round(log.protein_g ?? 0)}g · C: {Math.round(log.carbs_g ?? 0)}g · F:{" "}
											{Math.round(log.fat_g ?? 0)}g
										</p>
									</div>
									<div className="flex items-center gap-6 shrink-0">
										<span className="font-mono tabular-nums text-on-surface-variant">
											{Math.round(
												(log.protein_g ?? 0) * 4 + (log.carbs_g ?? 0) * 4 + (log.fat_g ?? 0) * 9,
											).toLocaleString()}{" "}
											kcal
										</span>
										<button
											onClick={() => {
												if (window.confirm("Delete this entry?")) db.entries.delete(log.id!);
											}}
											className="p-2 -mr-2 text-on-surface-variant hover:text-error transition-colors"
										>
											<span className="material-symbols-outlined text-xl">delete</span>
										</button>
									</div>
								</div>
							))
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
