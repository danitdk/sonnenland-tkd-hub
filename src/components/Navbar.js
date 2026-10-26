"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCheck, Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md shadow-sm transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand Logo & School Affiliation */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          {/* Official Sönnenland School Logo properly placed in header slot */}
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Sönnenland International Kindergarten Logo"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/logo.svg";
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                Sonnenland <span className="text-crimson">TKD</span> Hub
              </span>
              <span className="hidden sm:inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30">
                Kindergarten Program
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              After-School Taekwondo • Master Daniel
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#program-details"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-crimson dark:hover:text-amber-400"
          >
            Program Info
          </Link>
          <Link
            href="#schedule"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-crimson dark:hover:text-amber-400"
          >
            Schedule & Tuition
          </Link>
          <Link
            href="#registration"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-crimson dark:hover:text-amber-400"
          >
            Registration Flow
          </Link>
        </nav>

        {/* Right Action Buttons: Theme Toggle & Admin Portal */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Instructor Admin Portal Link */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-crimson dark:hover:text-amber-400 shadow-sm"
          >
            <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Instructor Admin</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Mobile controls (Theme Toggle + Hamburger) */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle size="sm" showLabel={false} />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 md:hidden shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-2">
            <Link
              href="#program-details"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-crimson dark:hover:text-amber-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Program Info
            </Link>
            <Link
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-crimson dark:hover:text-amber-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Schedule & Tuition
            </Link>
            <Link
              href="#registration"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-crimson dark:hover:text-amber-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Registration Flow
            </Link>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Theme:</span>
              <ThemeToggle size="sm" showLabel={true} />
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-between rounded-xl bg-amber-50 dark:bg-slate-800 px-4 py-3 text-sm font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  Instructor Admin Dashboard
                </span>
                <ArrowUpRight className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
