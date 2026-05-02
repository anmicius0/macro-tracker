"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { parseMacroGrams } from "@/utils/core";
import { db } from "@/utils/db";

export default function AddFavoritePage() {
	const router = useRouter();
	const [name, setName] = useState("");
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
		await db.foods.put({
			name: name.trim(),
			protein_per_100g: vals.p,
			carbs_per_100g: vals.c,
			fat_per_100g: vals.f,
		});
		router.push("/log/favorites");
	};

	return (
		<main className="px-6 mt-12 max-w-5xl mx-auto space-y-12 pb-24">
			<section>
				<div className="flex items-center gap-4 mb-10">
					<div className="h-px flex-1 bg-outline/50" />
					<h1 className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-on-surface-variant whitespace-nowrap">
						New Food
					</h1>
					<div className="h-px flex-1 bg-outline/50" />
				</div>

				<form onSubmit={handleSave} className="space-y-10">
					<div>
						<label
							htmlFor="food-name"
							className="block text-[10px] font-mono font-bold text-on-surface-variant tracking-widest uppercase mb-4"
						>
							Name
						</label>
						<input
							id="food-name"
							required
							className="w-full bg-surface-container border border-outline-variant px-5 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary truncate"
							placeholder="Chicken breast"
							value={name}
							onChange={(e) => setName(e.target.value)}
							maxLength={100}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{[
							{ label: "Protein", color: "text-protein", val: protein, set: setProtein },
							{ label: "Carbs", color: "text-carbs", val: carbs, set: setCarbs },
							{ label: "Fat", color: "text-fats", val: fat, set: setFat },
						].map((m) => (
							<div
								key={m.label}
								className="p-6 bg-surface-container flex flex-col justify-between border focus-within:border-primary transition-colors border-outline-variant"
							>
								<label
									htmlFor={`macro-${m.label.toLowerCase()}`}
									className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-4 ${m.color}`}
								>
									{m.label}
								</label>
								<input
									id={`macro-${m.label.toLowerCase()}`}
									required
									className="w-full bg-transparent border-none py-2 text-4xl font-bold tracking-tight focus:outline-none placeholder:text-surface-dim tabular-nums"
									placeholder="0"
									type="number"
									inputMode="decimal"
									step="0.1"
									min="0"
									max="100"
									value={m.val}
									onChange={(e) => m.set(e.target.value)}
								/>
								<span className="text-xs text-on-surface-variant/70 mt-1">per 100g</span>
							</div>
						))}
					</div>

					<div className="flex justify-between items-end border-t border-outline/15 pt-8">
						<div>
							<span className="block text-[10px] font-mono font-bold text-on-surface-variant tracking-widest uppercase mb-2">
								Calories
							</span>
							<span className="text-6xl font-bold font-mono tracking-tight leading-none tabular-nums">
								{calories.toLocaleString()}
							</span>
							<span className="text-base text-on-surface-variant ml-2 font-medium">kcal</span>
						</div>
					</div>

					<button
						type="submit"
						className="min-h-[44px] w-full bg-primary text-on-primary py-5 rounded-none font-semibold text-sm border border-primary hover:bg-primary/90 active:bg-primary/80 transition-colors interaction-tap touch-manipulation"
					>
						Save to library
					</button>
				</form>
			</section>
		</main>
	);
}
