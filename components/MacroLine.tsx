interface MacroLineProps {
	label: string;
	current: number | null | undefined;
	target: number | null | undefined;
	color: string;
}

export function MacroLine({ label, current, target, color }: MacroLineProps) {
	const safeCurrent = Number.isFinite(current ?? NaN) ? (current ?? 0) : 0;
	const safeTarget = Number.isFinite(target ?? NaN) && (target ?? 0) > 0 ? (target ?? 0) : 0;
	const percent = safeTarget > 0 ? Math.min((safeCurrent / safeTarget) * 100, 100) : 0;
	const isOver = safeTarget > 0 && safeCurrent > safeTarget;
	const isGoalMet = percent >= 95 && percent <= 105;

	const icon = label === "Protein" ? "egg_alt" : label === "Carbs" ? "grain" : "opacity";

	return (
		<div className="group">
			<div className="flex justify-between items-end mb-2">
				<div className="flex items-center gap-2">
					<span
						className="material-symbols-outlined text-on-surface-variant"
						style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
					>
						{icon}
					</span>
					<span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
						{label}
					</span>
				</div>
				<span
					className={`font-mono text-sm ${isGoalMet ? "text-primary font-bold" : isOver ? "text-error" : ""}`}
				>
					{Math.round(safeCurrent)}
					<span className="text-on-surface-variant">/{safeTarget}g</span>
				</span>
			</div>
			<div
				className={`macro-strip ${isGoalMet ? "shadow-[0_0_8px_-2px_var(--color-primary)]" : ""}`}
			>
				<div
					className="macro-strip-fill"
					style={{
						transform: `scaleX(${percent / 100})`,
						backgroundColor: isOver ? "var(--color-error)" : color,
					}}
				/>
			</div>
		</div>
	);
}
