import { Shield, CheckCircle2, ChevronRight } from "lucide-react";

export default function RegistrationCard({
  title = "Term Training",
  price = "10,000 ETB",
  term = "Fall / Term 1 Trimester",
  features = [
    "Mon / Wed / Fri (3:30 PM - 4:30 PM) Training with Master Daniel",
    "Optional Official Uniform (Dobok) & White Belt (+1,500 ETB)",
    "Direct Mobile Payment: CBE (1000530983459), Telebirr (0935368595), Awash (013201241104400)",
    "Official Account Name: Daniel Teshome",
    "Digital Belt Progress & Attendance Tracking",
    "Eligible for Term-End Belt Promotion Examination",
  ],
  onRegister,
}) {
  return (
    <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-400/60 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-glow-gold relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 bg-amber-500 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-bl-xl tracking-wider shadow-xs">
        October 26–28
      </div>

      <div className="flex items-center gap-2 text-crimson font-bold text-xs uppercase tracking-wider">
        <Shield className="h-4 w-4 text-crimson" />
        {term}
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
        {title}
      </h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {price}
        </span>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          / 10-week term
        </span>
      </div>

      <ul className="mt-6 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-6 text-sm text-slate-700 dark:text-slate-300 font-medium">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <a
          href="#registration"
          onClick={onRegister}
          className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl bg-crimson px-6 py-3.5 font-bold text-white shadow-sm hover:bg-crimson-dark transition-all text-sm sm:text-base active:scale-95"
        >
          <span>Complete Registration Now</span>
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
