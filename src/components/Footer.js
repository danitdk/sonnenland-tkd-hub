import Link from "next/link";
import { Shield, Mail, MapPin, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B0F19] text-slate-600 dark:text-slate-400 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson shadow-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Sonnenland <span className="text-crimson">TKD</span> Hub
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              Official After-School Taekwondo Training Program at Sonnenland International School (SIS), led by certified Master Daniel. Dedicated to building physical discipline, confidence, respect, and martial arts excellence.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                Courtesy • 예의
              </span>
              <span className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                Integrity • 염치
              </span>
              <span className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                Perseverance • 인내
              </span>
              <span className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                Self-Control • 극기
              </span>
              <span className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                Indomitable Spirit • 백절불굴
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Quick Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#program-details" className="hover:text-crimson dark:hover:text-amber-400 transition-colors">
                  Program Highlights
                </Link>
              </li>
              <li>
                <Link href="#schedule" className="hover:text-crimson dark:hover:text-amber-400 transition-colors">
                  Class Schedule & Tuition
                </Link>
              </li>
              <li>
                <Link href="#registration" className="hover:text-crimson dark:hover:text-amber-400 transition-colors">
                  Online Registration
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-crimson dark:text-red-400 hover:underline transition-colors font-bold">
                  Instructor Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Master Daniel & Location */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-crimson dark:text-red-400">
              Contact & Location
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-crimson shrink-0" />
                <span>Sonnenland International School Gymnasium, Main Campus (Bisrate Gabriel, Addis Ababa)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Head Instructor: Master Daniel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span>sonnenlandprimary@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Sonnenland International School Taekwondo Program. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for <span className="text-slate-800 dark:text-slate-200 font-semibold">Master Daniel</span> • Mobile-Friendly Web App
          </p>
        </div>
      </div>
    </footer>
  );
}
