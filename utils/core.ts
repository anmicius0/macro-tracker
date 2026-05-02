export function parseMacroGrams(value: string): number {
	const parsed = parseFloat(value);
	return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

export function getTodayDateStr(): string {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	return new Date().toLocaleDateString("en-CA", { timeZone: tz });
}
