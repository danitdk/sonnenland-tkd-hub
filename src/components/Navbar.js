"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Award, UserCheck, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background-deep/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & School Affiliation */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-crimson to-crimson-dark shadow-glow-crimson transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                Sonnenland <span className="text-crimson">TKD</span> Hub
              </span>
              <span className="hidden sm:inline-flex items-center rounded-md bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold border border-gold/30">
                SIS Program
              </span>
            </div>
            <p className="text-xs text-gray-400">Master Daniel • Taekwondo</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#program-details"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Program Info
          </Link>
          <Link
            href="#schedule"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Schedule & Tuition
          </Link>
          <Link
            href="#registration"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Registration Flow
          </Link>
        </nav>

        {/* Action Button: Instructor Admin Portal */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3.5 py-2 text-xs font-semibold text-gray-200 transition-all hover:border-gold/50 hover:bg-surface-elevated hover:text-gold"
          >
            <UserCheck className="h-4 w-4 text-gold" />
            <span>Instructor Admin</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl p-2.5 text-gray-400 hover:bg-surface-card hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-surface-border bg-background-rich px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-2">
            <Link
              href="#program-details"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium text-gray-200 hover:text-white rounded-lg hover:bg-surface-card"
            >
              Program Info
            </Link>
            <Link
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium text-gray-200 hover:text-white rounded-lg hover:bg-surface-card"
            >
              Schedule & Tuition
            </Link>
            <Link
              href="#registration"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium text-gray-200 hover:text-white rounded-lg hover:bg-surface-card"
            >
              Registration Flow
            </Link>
            <div className="pt-2 border-t border-surface-border">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-between rounded-xl bg-surface-card px-4 py-3 text-sm font-bold text-gold border border-gold/30"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Instructor Admin Dashboard
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
