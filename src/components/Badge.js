export default function Badge({
  children,
  variant = "gold",
  size = "md",
  className = "",
  pulse = false,
}) {
  const variantStyles = {
    gold: "bg-amber-50 text-amber-800 border-amber-300 shadow-sm",
    crimson: "bg-red-50 text-red-700 border-red-200 shadow-sm",
    dark: "bg-slate-100 text-slate-700 border-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm",
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
