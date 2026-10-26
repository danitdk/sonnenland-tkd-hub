"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, UserCheck, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & School Affiliation */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-crimson to-crimson-dark shadow-sm transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 text-base sm:text-lg">
                Sonnenland <span className="text-crimson">TKD</span> Hub
              </span>
              <span className="hidden sm:inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                SIS Program
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Master Daniel • Taekwondo</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#program-details"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-crimson"
          >
            Program Info
          </Link>
          <Link
            href="#schedule"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-crimson"
          >
            Schedule & Tuition
          </Link>
          <Link
            href="#registration"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-crimson"
          >
            Registration Flow
          </Link>
        </nav>

        {/* Action Button: Instructor Admin Portal */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-crimson shadow-sm"
          >
            <UserCheck className="h-4 w-4 text-amber-600" />
            <span>Instructor Admin</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-2">
            <Link
              href="#program-details"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold text-slate-700 hover:text-crimson rounded-lg hover:bg-slate-50"
            >
              Program Info
            </Link>
            <Link
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold text-slate-700 hover:text-crimson rounded-lg hover:bg-slate-50"
            >
              Schedule & Tuition
            </Link>
            <Link
              href="#registration"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold text-slate-700 hover:text-crimson rounded-lg hover:bg-slate-50"
            >
              Registration Flow
            </Link>
            <div className="pt-2 border-t border-slate-200">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900 border border-amber-200"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-amber-700" />
                  Instructor Admin Dashboard
                </span>
                <ArrowUpRight className="h-4 w-4 text-amber-700" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
