import { Shield, CheckCircle2, CreditCard, ChevronRight } from "lucide-react";

export default function RegistrationCard({
  title = "Term Registration",
  price = "$240",
  term = "Fall / Winter Trimester",
  features = [
    "20 Guided Training Sessions with Master Daniel",
    "Official Sonnenland TKD Uniform (Dobok) & White Belt",
    "Digital Belt Progress & Attendance Tracking",
    "Eligible for Term-End Belt Promotion Examination",
  ],
  onRegister,
}) {
  return (
    <div className="rounded-2xl border-2 border-gold/40 bg-surface-card p-6 sm:p-8 shadow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-gold text-gray-950 font-bold text-xs uppercase px-4 py-1.5 rounded-bl-xl tracking-wider">
        October 26–28
      </div>

      <div className="flex items-center gap-2 text-crimson-light font-semibold text-xs uppercase tracking-wider">
        <Shield className="h-4 w-4 text-crimson" />
        {term}
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{title}</h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl sm:text-5xl font-extrabold text-white">{price}</span>
        <span className="text-sm text-gray-400">/ 10-week term</span>
      </div>

      <ul className="mt-6 space-y-3 border-t border-surface-border pt-6 text-sm text-gray-300">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <a
          href="#registration"
          onClick={onRegister}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 font-bold text-gray-950 shadow-glow-gold hover:brightness-105 transition-all text-sm sm:text-base"
        >
          <span>Complete Registration Now</span>
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
