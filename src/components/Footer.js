import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background-rich">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson shadow-glow-crimson">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Sonnenland <span className="text-crimson">TKD</span> Hub
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Official After-School Taekwondo Training Program at Sonnenland International School (SIS), led by certified Master Daniel. Dedicated to building physical discipline, confidence, respect, and martial arts excellence.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-md bg-surface-card px-2.5 py-1 text-xs font-medium text-gray-300 border border-surface-border">
                Courtesy • 예의
              </span>
              <span className="rounded-md bg-surface-card px-2.5 py-1 text-xs font-medium text-gray-300 border border-surface-border">
                Integrity • 염치
              </span>
              <span className="rounded-md bg-surface-card px-2.5 py-1 text-xs font-medium text-gray-300 border border-surface-border">
                Perseverance • 인내
              </span>
              <span className="rounded-md bg-surface-card px-2.5 py-1 text-xs font-medium text-gray-300 border border-surface-border">
                Self-Control • 극기
              </span>
              <span className="rounded-md bg-surface-card px-2.5 py-1 text-xs font-medium text-gray-300 border border-surface-border">
                Indomitable Spirit • 백절불굴
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Quick Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="#program-details" className="hover:text-white transition-colors">
                  Program Highlights
                </Link>
              </li>
              <li>
                <Link href="#schedule" className="hover:text-white transition-colors">
                  Class Schedule & Ages
                </Link>
              </li>
              <li>
                <Link href="#registration" className="hover:text-white transition-colors">
                  Online Registration
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gold/90 hover:text-gold transition-colors font-medium">
                  Instructor Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Master Daniel & Location */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-crimson-light">
              Contact & Location
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-crimson shrink-0" />
                <span>Sonnenland International School Gymnasium, Main Campus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-gold shrink-0" />
                <span>Head Instructor: Master Daniel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span>tkd@sonnenland.school</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Sonnenland International School Taekwondo Program. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for <span className="text-gray-300 font-medium">Master Daniel</span> • Mobile-Friendly Web App
          </p>
        </div>
      </div>
    </footer>
  );
}
