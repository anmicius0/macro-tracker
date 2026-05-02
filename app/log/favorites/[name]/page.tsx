"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { notFound, useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";
import { db } from "@/utils/db";

interface PageProps {
	params: Promise<{ name: string }>;
}

export default function LogFavoritePage({ params }: PageProps) {
	const router = useRouter();
	const { name } = use(params);
	const decodedName = decodeURIComponent(name);
	const food = useLiveQuery(() => db.foods.get(decodedName), [decodedName]);
	const [weight, setWeight] = useState("");

	const grams = parseFloat(weight) || 0;
	const p = ((food?.protein_per_100g ?? 0) / 100) * grams;
	const c = ((food?.carbs_per_100g ?? 0) / 100) * grams;
	const f = ((food?.fat_per_100g ?? 0) / 100) * grams;
	const calories = p * 4 + c * 4 + f * 9;

	const handleLog = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!food) return;
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: tz });
		await db.entries.add({
			log_date: todayStr,
			meal_type: food.name,
			protein_g: Math.round(p * 10) / 10,
			carbs_g: Math.round(c * 10) / 10,
			fat_g: Math.round(f * 10) / 10,
		});
		router.push("/");
	};

	if (food === null) return notFound();
	if (!food) return null;

	return (
		<main className="px-6 mt-12 max-w-5xl mx-auto space-y-12 pb-24">
			<section>
				<div className="flex items-center gap-4 mb-10">
					<div className="h-px flex-1 bg-outline/50" />
					<h1 className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-on-surface-variant whitespace-nowrap">
						Log {food.name}
					</h1>
					<div className="h-px flex-1 bg-outline/50" />
				</div>

				<form onSubmit={handleLog} className="space-y-10">
					<div>
						<label
							htmlFor="favorite-weight"
							className="block text-[10px] font-mono font-bold text-on-surface-variant tracking-widest uppercase mb-4"
						>
							Weight (g)
						</label>
						<input
							id="favorite-weight"
							autoFocus
							required
							className="w-full bg-surface-container border border-outline-variant rounded-none px-5 py-4 text-4xl font-bold focus:outline-none focus:border-primary tabular-nums"
							placeholder="0"
							type="number"
							inputMode="decimal"
							step="0.1"
							min="0.1"
							value={weight}
							onChange={(e) => setWeight(e.target.value)}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{[
							{ label: "Protein", color: "text-protein", val: p },
							{ label: "Carbs", color: "text-carbs", val: c },
							{ label: "Fat", color: "text-fats", val: f },
						].map((m) => (
							<div
								key={m.label}
								className="p-4 bg-surface-container rounded-none border border-outline-variant"
							>
								<span className="block text-[10px] font-mono font-bold text-on-surface-variant uppercase mb-1">
									{m.label}
								</span>
								<span className={`text-xl font-bold font-mono tabular-nums ${m.color}`}>
									{Math.round(m.val)}g
								</span>
							</div>
						))}
					</div>

					<div className="border-t border-outline/15 pt-8">
						<span className="block text-[10px] font-mono font-bold text-on-surface-variant tracking-widest uppercase mb-2">
							Calories
						</span>
						<span className="text-6xl font-bold font-mono tabular-nums">
							{Math.round(calories).toLocaleString()}
						</span>
						<span className="text-base text-on-surface-variant ml-2 font-medium">kcal</span>
					</div>

					<button
						type="submit"
						className="min-h-[44px] w-full bg-primary text-on-primary py-5 rounded-none font-semibold border border-primary hover:bg-primary/90 active:bg-primary/80 transition-colors interaction-tap touch-manipulation"
					>
						Log food
					</button>
				</form>
			</section>
		</main>
	);
}
