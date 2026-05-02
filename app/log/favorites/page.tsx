"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { db } from "@/utils/db";

export default function FavoritesPage() {
	const foods = useLiveQuery(() => db.foods.toArray());

	return (
		<main className="px-6 mt-12 max-w-5xl mx-auto pb-24">
			<section>
				<div className="flex items-center gap-4 mb-10">
					<div className="h-px flex-1 bg-outline/50" />
					<h1 className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-on-surface-variant whitespace-nowrap">
						Library
					</h1>
					<div className="h-px flex-1 bg-outline/50" />
				</div>

				<div className="mb-8">
					<Link
						href="/log/favorites/add"
						className="flex items-center justify-center gap-2 w-full py-4 bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors font-bold text-xs tracking-widest uppercase"
					>
						<span className="material-symbols-outlined text-lg">add</span>
						Add New Food
					</Link>
				</div>

				<div className="divide-y divide-outline/15">
					{foods?.length === 0 ? (
						<div className="py-20 text-center">
							<p className="text-sm font-mono text-on-surface-variant uppercase tracking-widest">
								Library is empty
							</p>
						</div>
					) : (
						foods?.map((food) => (
							<div
								key={food.name}
								className="group flex justify-between items-center py-5 gap-4 hover:bg-surface-container transition-colors px-4 -mx-4"
							>
								<Link
									href={`/log/favorites/${encodeURIComponent(food.name)}`}
									className="min-w-0 flex-1"
								>
									<p className="font-semibold truncate">{food.name}</p>
									<p className="text-xs text-on-surface-variant mt-1 font-mono">
										{Math.round(
											food.protein_per_100g * 4 + food.carbs_per_100g * 4 + food.fat_per_100g * 9,
										)}{" "}
										kcal / 100g
									</p>
								</Link>
								<button
									onClick={() => {
										if (window.confirm(`Delete "${food.name}" from library?`))
											db.foods.delete(food.name);
									}}
									className="p-2 -mr-2 text-on-surface-variant hover:text-error transition-colors"
									aria-label="Delete food"
								>
									<span className="material-symbols-outlined text-xl">delete</span>
								</button>
							</div>
						))
					)}
				</div>
			</section>
		</main>
	);
}
