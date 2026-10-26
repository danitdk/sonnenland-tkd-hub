export default function Badge({
  children,
  variant = "gold",
  size = "md",
  className = "",
  pulse = false,
}) {
  const variantStyles = {
    gold: "bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-400/40 shadow-sm",
    crimson: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/40 shadow-sm",
    dark: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    emerald: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40 shadow-sm",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3.5 py-1 text-xs sm:text-sm font-semibold",
    lg: "px-4 py-1.5 text-sm sm:text-base font-bold",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border transition-all ${
        variantStyles[variant] || variantStyles.gold
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "crimson" ? "bg-red-600" : "bg-amber-500"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === "crimson" ? "bg-red-600" : "bg-amber-500"
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
