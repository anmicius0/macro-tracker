"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { parseMacroGrams } from "@/utils/core";
import { db } from "@/utils/db";

export default function SysPage() {
	const target = useLiveQuery(() => db.targets.get(1));

	const [protein, setProtein] = useState("");
	const [carbs, setCarbs] = useState("");
	const [fat, setFat] = useState("");

	const displayProtein = protein || (target?.protein_g.toString() ?? "");
	const displayCarbs = carbs || (target?.carbs_g.toString() ?? "");
	const displayFat = fat || (target?.fat_g.toString() ?? "");

	const calories = useMemo(() => {
		const p = parseMacroGrams(displayProtein);
		const c = parseMacroGrams(displayCarbs);
		const f = parseMacroGrams(displayFat);
		return Math.round(p * 4 + c * 4 + f * 9);
	}, [displayProtein, displayCarbs, displayFat]);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		const p = parseMacroGrams(displayProtein);
		const c = parseMacroGrams(displayCarbs);
		const f = parseMacroGrams(displayFat);

		await db.targets.put({
			id: 1,
			protein_g: p,
			carbs_g: c,
			fat_g: f,
		});
	};

	return (
		<div dir="auto">
			<main className="pt-12 px-6 max-w-2xl mx-auto">
				<header className="mb-12">
					<h2 className="text-5xl font-bold tracking-tight text-primary">Settings</h2>
				</header>

				<section className="mb-16">
					<div className="flex items-center gap-4 mb-8">
						<div className="h-px flex-1 bg-outline/50" />
						<span className="text-[10px] font-mono font-bold tracking-widest uppercase text-on-surface-variant whitespace-nowrap">
							Daily targets (g)
						</span>
						<div className="h-px flex-1 bg-outline/50" />
					</div>

					<div className="bg-surface-container rounded-none p-5 md:p-8 border border-outline/15">
						<div className="text-center mb-10 pb-8 border-b border-outline/15">
							<span className="text-[10px] font-mono font-bold tracking-widest uppercase text-on-surface-variant">
								Total calories
							</span>
							<div className="flex items-baseline justify-center gap-3 mt-3 min-w-0">
								<span className="text-5xl md:text-6xl font-black font-mono tracking-tighter tabular-nums transition-colors duration-150 truncate">
									{calories.toLocaleString()}
								</span>
								<span className="text-sm font-mono text-on-surface-variant shrink-0">kcal</span>
							</div>
						</div>

						<form onSubmit={handleSave} className="space-y-2">
							{[
								{
									label: "Protein",
									color: "text-protein",
									icon: "egg_alt",
									val: displayProtein,
									set: setProtein,
								},
								{
									label: "Carbs",
									color: "text-carbs",
									icon: "grain",
									val: displayCarbs,
									set: setCarbs,
								},
								{ label: "Fat", color: "text-fats", icon: "opacity", val: displayFat, set: setFat },
							].map((m) => (
								<label
									key={m.label}
									htmlFor={`goal-${m.label.toLowerCase()}`}
									className="flex items-center group py-5 border-b border-outline/15 hover:bg-surface-container focus-within:bg-surface-container hover:-mx-4 focus-within:-mx-4 hover:px-4 focus-within:px-4 transition-colors duration-200 rounded-none cursor-text min-h-[44px] touch-manipulation min-w-0"
								>
									<span
										className={`text-[10px] font-mono font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface group-focus-within:text-on-surface transition-colors duration-150 flex items-center gap-2 shrink-0 ${m.color}`}
									>
										<span
											className="material-symbols-outlined text-sm transition-transform duration-200 group-focus-within:scale-110"
											style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
										>
											{m.icon}
										</span>
										{m.label}
									</span>
									<div className="grow mx-4 md:mx-6 border-b border-dotted border-outline/15 min-w-4" />
									<div className="flex items-center gap-3 min-w-0 shrink">
										<input
											id={`goal-${m.label.toLowerCase()}`}
											required
											type="number"
											inputMode="decimal"
											step="0.1"
											min="0"
											value={m.val}
											onChange={(e) => m.set(e.target.value)}
											className="bg-transparent font-mono text-3xl font-bold text-right outline-none min-w-[3rem] md:min-w-[4rem] max-w-full focus:text-primary transition-colors duration-150 rounded-none"
										/>
										<span className="text-xs font-mono text-on-surface-variant shrink-0">g</span>
									</div>
								</label>
							))}

							<button
								type="submit"
								className="min-h-[44px] w-full bg-primary text-on-primary py-5 mt-8 rounded-none font-bold text-sm border border-primary flex items-center justify-center gap-2 font-mono interaction-tap touch-manipulation"
							>
								Save targets
							</button>
						</form>
					</div>
				</section>
			</main>
		</div>
	);
}
