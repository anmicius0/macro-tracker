import Dexie, { type Table } from "dexie";

export interface FavoriteFood {
	name: string;
	protein_per_100g: number;
	carbs_per_100g: number;
	fat_per_100g: number;
}

export interface MealEntry {
	id?: number;
	log_date: string;
	meal_type: string;
	protein_g: number;
	carbs_g: number;
	fat_g: number;
}

export interface UserTarget {
	id?: number;
	protein_g: number;
	carbs_g: number;
	fat_g: number;
}

class MonolithDB extends Dexie {
	foods!: Table<FavoriteFood>;
	entries!: Table<MealEntry>;
	targets!: Table<UserTarget>;

	constructor() {
		super("MonolithDB");
		// Bump version to 11 to remove calorie fields
		this.version(11).stores({
			foods: "name",
			entries: "++id, log_date",
			targets: "++id",
		});

		// Insert defaults automatically on first run
		this.on("populate", () => {
			this.targets.add({
				id: 1,
				protein_g: 180,
				carbs_g: 250,
				fat_g: 75,
			});
		});
	}
}

export const db = new MonolithDB();
