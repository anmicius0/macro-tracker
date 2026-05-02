"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getTodayDateStr, parseMacroGrams } from "@/utils/core";
import { db } from "@/utils/db";

export default function EntryPage() {
	const router = useRouter();
	const [protein, setProtein] = useState("");
	const [carbs, setCarbs] = useState("");
	const [fat, setFat] = useState("");

	const vals = useMemo(
		() => ({
			p: parseMacroGrams(protein),
			c: parseMacroGrams(carbs),
			f: parseMacroGrams(fat),
		}),
		[protein, carbs, fat],
	);

	const calories = Math.round(vals.p * 4 + vals.c * 4 + vals.f * 9);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		const todayStr = getTodayDateStr();
		await db.entries.add({
			log_date: todayStr,
			meal_type: "Manual Entry",
			protein_g: vals.p,
			carbs_g: vals.c,
			fat_g: vals.f,
		});
		router.push("/");
	};

	return (
		<main className="px-6 mt-12 max-w-5xl mx-auto space-y-12 pb-24">
			<section>
				<div className="flex items-center gap-4 mb-10">
					<div className="h-px flex-1 bg-outline/50" />
					<h1 className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-on-surface-variant whitespace-nowrap">
						Manual Entry
					</h1>
					<div className="h-px flex-1 bg-outline/50" />
				</div>

				<form onSubmit={handleSave} className="space-y-12">
					<fieldset className="space-y-4 border-none p-0 m-0">
						<legend className="sr-only">Macros (g)</legend>

						{[
							{ label: "Protein", color: "text-protein", val: protein, set: setProtein },
							{ label: "Carbs", color: "text-carbs", val: carbs, set: setCarbs },
							{ label: "Fat", color: "text-fats", val: fat, set: setFat },
						].map((m) => (
							<div
								key={m.label}
								className="group p-6 bg-surface-container border border-outline-variant focus-within:border-primary transition-all"
							>
								<div className="flex items-baseline gap-1 mb-1">
									<label
										htmlFor={`macro-${m.label.toLowerCase()}`}
										className={`text-[10px] font-mono font-bold uppercase tracking-widest ${m.color}`}
									>
										{m.label}
									</label>
									<span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
										g
									</span>
								</div>
								<input
									id={`macro-${m.label.toLowerCase()}`}
									className="w-full bg-transparent text-5xl font-bold tracking-tighter outline-none tabular-nums placeholder:text-on-surface-variant/10 mt-1 block"
									type="number"
									inputMode="decimal"
									step="0.1"
									min="0"
									placeholder="0"
									value={m.val}
									onChange={(e) => m.set(e.target.value)}
								/>
							</div>
						))}
					</fieldset>

					<div className="flex justify-between items-end border-t border-outline/15 pt-10">
						<div>
							<span className="block text-[10px] font-mono font-bold text-on-surface-variant tracking-widest uppercase mb-2">
								Calories
							</span>
							<span className="text-7xl font-black font-mono tracking-tighter tabular-nums leading-none">
								{calories.toLocaleString()}
							</span>
							<span className="text-sm font-mono ml-2 text-on-surface-variant">kcal</span>
						</div>
					</div>

					<button
						type="submit"
						className="min-h-[44px] w-full bg-primary text-on-primary py-5 rounded-none font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 active:bg-primary/80 transition-colors interaction-tap touch-manipulation"
					>
						Save entry
					</button>
				</form>
			</section>
		</main>
	);
}
