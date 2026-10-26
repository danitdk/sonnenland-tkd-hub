export default function Badge({
  children,
  variant = "gold",
  size = "md",
  className = "",
  pulse = false,
}) {
  const variantStyles = {
    gold: "bg-gold/15 text-gold border-gold/40 shadow-glow-gold",
    crimson: "bg-crimson/15 text-crimson-light border-crimson/40 shadow-glow-crimson",
    dark: "bg-surface-card text-gray-300 border-surface-border",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3.5 py-1 text-xs sm:text-sm font-semibold",
    lg: "px-4 py-1.5 text-sm sm:text-base font-bold",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-sm transition-all ${
        variantStyles[variant] || variantStyles.gold
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "crimson" ? "bg-crimson" : "bg-gold"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === "crimson" ? "bg-crimson" : "bg-gold"
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
