"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import {
  Shield,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Upload,
  AlertCircle,
  Phone,
  User,
  GraduationCap,
  Shirt,
  CreditCard,
  Building2,
  Smartphone,
  Send,
  X,
  Trash2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame,
  Award
} from "lucide-react";

const GRADES = [
  "KG1",
  "KG2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
];

const UNIFORM_SIZES = [
  { value: "100cm", label: "Size 100cm (KG1 / KG2, Height ~95-105cm)" },
  { value: "110cm", label: "Size 110cm (KG2 / Grade 1, Height ~105-115cm)" },
  { value: "120cm", label: "Size 120cm (Grade 1 / 2, Height ~115-125cm)" },
  { value: "130cm", label: "Size 130cm (Grade 2 / 3, Height ~125-135cm)" },
  { value: "140cm", label: "Size 140cm (Grade 4 / 5, Height ~135-145cm)" },
  { value: "150cm+", label: "Size 150cm+ (Height 145cm and above)" },
];

const BANK_ACCOUNTS = [
  {
    id: "cbe",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    shortName: "CBE",
    accountNumber: "1000456789123",
    accountHolder: "Sonnenland TKD / Master Daniel",
    branch: "Finfinnee Branch",
    icon: Building2,
    color: "from-purple-900/40 to-surface-card",
    borderColor: "border-purple-500/30",
    badge: "Most Popular",
  },
  {
    id: "telebirr",
    bankName: "Telebirr SuperApp / Mobile",
    shortName: "Telebirr",
    accountNumber: "0911223344",
    accountHolder: "Master Daniel (Sonnenland TKD)",
    branch: "Merchant / Mobile Account",
    icon: Smartphone,
    color: "from-blue-900/40 to-surface-card",
    borderColor: "border-blue-500/30",
    badge: "Instant Transfer",
  },
  {
    id: "awash",
    bankName: "Awash International Bank",
    shortName: "Awash Bank",
    accountNumber: "01320876543200",
    accountHolder: "Sonnenland Taekwondo Club",
    branch: "Bole Medhanialem Branch",
    icon: CreditCard,
    color: "from-amber-900/40 to-surface-card",
    borderColor: "border-amber-500/30",
    badge: "Available",
  },
];

export default function ParentRegistrationPage() {
  // Form State
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [includeUniform, setIncludeUniform] = useState(false);
  const [uniformSize, setUniformSize] = useState("120cm");

  // Payment Proof Upload State
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState("");
  const [receiptFileSize, setReceiptFileSize] = useState("");
  const fileInputRef = useRef(null);

  // UI Interactive States
  const [copiedId, setCopiedId] = useState(null);
  const [copiedToast, setCopiedToast] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Pricing Constants
  const TUITION_FEE = 10000;
  const UNIFORM_FEE = 1500;
  const totalAmount = TUITION_FEE + (includeUniform ? UNIFORM_FEE : 0);

  // Validate Ethiopian phone number (09... or 07... or +251...)
  const validateEthiopianPhone = (phone) => {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    return /^(?:\+251|0)[97]\d{8}$/.test(cleaned);
  };

  // Copy bank details helper
  const handleCopy = (id, text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedToast(`Copied ${label || "account"} to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
    setTimeout(() => {
      setCopiedToast("");
    }, 3500);
  };

  // File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        receipt: "Please upload an image file (PNG, JPG, or JPEG).",
      }));
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        receipt: "Image file size should be less than 8MB.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptImage(event.target.result);
      setReceiptFileName(file.name);
      setReceiptFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      setErrors((prev) => ({ ...prev, receipt: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReceipt = () => {
    setReceiptImage(null);
    setReceiptFileName("");
    setReceiptFileSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!studentName.trim()) {
      newErrors.studentName = "Student full name is required";
    }

    if (!grade) {
      newErrors.grade = "Please select a grade/class level";
    }

    if (!parentName.trim()) {
      newErrors.parentName = "Parent/Guardian full name is required";
    }

    if (!parentPhone.trim()) {
      newErrors.parentPhone = "Parent phone number is required";
    } else if (!validateEthiopianPhone(parentPhone)) {
      newErrors.parentPhone =
        "Enter a valid Ethiopian phone number (e.g. 0911223344 or 0712345678)";
    }

    if (emergencyPhone.trim() && !validateEthiopianPhone(emergencyPhone)) {
      newErrors.emergencyPhone =
        "Emergency contact should be a valid Ethiopian phone number";
    }

    if (!receiptImage) {
      newErrors.receipt =
        "Please upload a screenshot of your payment transfer receipt";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `TKD-2026-${randomDigits}`;

    const registrationData = {
      id: referenceId,
      studentName: studentName.trim(),
      grade,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      emergencyPhone: emergencyPhone.trim() || "N/A",
      includeUniform,
      uniformSize: includeUniform ? uniformSize : "None",
      uniformStatus: includeUniform ? "Needed" : "None",
      tuitionFee: TUITION_FEE,
      uniformFee: includeUniform ? UNIFORM_FEE : 0,
      totalAmount,
      paymentStatus: "Pending",
      receiptImage,
      receiptFileName,
      registeredAt: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Submitted (Payment Verification Pending)",
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("sonnenland_registrations") || "[]"
      );
      existing.unshift(registrationData);
      localStorage.setItem(
        "sonnenland_registrations",
        JSON.stringify(existing)
      );
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket(registrationData);
      setShowSuccessModal(true);
    }, 600);
  };

  const getWhatsAppShareUrl = (ticket) => {
    if (!ticket) return "#";
    const text = encodeURIComponent(
      `🥋 *Sonnenland TKD Hub Registration Confirmation*\n` +
        `-----------------------------------------\n` +
        `*Reference ID:* ${ticket.id}\n` +
        `*Student:* ${ticket.studentName} (${ticket.grade})\n` +
        `*Parent:* ${ticket.parentName} (${ticket.parentPhone})\n` +
        `*Uniform:* ${ticket.includeUniform ? `Yes (${ticket.uniformSize})` : "No"}\n` +
        `*Total Paid:* ${ticket.totalAmount.toLocaleString()} ETB\n` +
        `*Date:* ${ticket.displayDate}\n\n` +
        `Hello Master Daniel, I have registered my child for the Sonnenland After-School Taekwondo program and submitted my payment receipt. Thank you!`
    );
    return `https://wa.me/251911223344?text=${text}`;
  };

  const getTelegramShareUrl = (ticket) => {
    if (!ticket) return "#";
    const text = encodeURIComponent(
      `🥋 Sonnenland TKD Registration\nRef: ${ticket.id}\nStudent: ${ticket.studentName} (${ticket.grade})\nPaid: ${ticket.totalAmount.toLocaleString()} ETB\nParent: ${ticket.parentName} (${ticket.parentPhone})`
    );
    return `https://t.me/share/url?url=https://sonnenland.school/tkd&text=${text}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-deep text-gray-100 selection:bg-crimson selection:text-white overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 pb-28 sm:pb-24">
        {/* ========================================================= */}
        {/* 1. HEADER / HERO SECTION                                  */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-20 border-b border-surface-border bg-gradient-to-b from-background-rich via-background-deep to-background-deep">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-crimson/15 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-gold/10 blur-[100px] pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex mb-4">
              <Badge variant="gold" size="md" pulse={true}>
                <Calendar className="h-4 w-4 text-gold shrink-0" />
                <span className="font-bold">Oct 26 – Oct 28 Registration Open</span>
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Sonnenland <span className="text-crimson">TKD</span> Hub
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-base sm:text-2xl font-semibold text-gray-200 max-w-3xl mx-auto leading-snug">
              Official Taekwondo Training Registration – Led by Master Daniel
            </p>

            {/* Schedule Indicator */}
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-surface-border bg-surface-card/90 px-4 py-2.5 sm:px-5 sm:py-3 shadow-card backdrop-blur-md">
              <div className="flex items-center gap-2 text-gold font-bold text-xs sm:text-sm">
                <Clock className="h-4 w-4 text-gold shrink-0" />
                <span>Mon / Wed / Fri – 3:30 PM to 4:30 PM</span>
              </div>
              <span className="hidden sm:inline text-surface-border">•</span>
              <div className="flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm">
                <MapPin className="h-4 w-4 text-crimson shrink-0" />
                <span>SIS Main Gymnasium (Dojang Mat)</span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
              Open to Sonnenland International School students (KG1 to Grade 5).
              Please complete student details, choose uniform options, transfer fees, and upload your payment proof below.
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MAIN FORM & SIDEBAR GRID                                  */}
        {/* ========================================================= */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: REGISTRATION FORM & PAYMENT PROOF (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 2. REGISTRATION FORM FIELDS */}
                <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-8 shadow-card">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson/20 text-crimson-light border border-crimson/40 shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">Student & Parent Information</h2>
                        <p className="text-xs text-gray-400">Step 1: Enrolment Profile</p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-400">
                      * Required
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Row 1: Student Name & Grade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Student Full Name */}
                      <div id="studentName">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                          Student Full Name <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Nahom Solomon"
                            value={studentName}
                            onChange={(e) => {
                              setStudentName(e.target.value);
                              if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-4 py-3 text-base sm:text-sm text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                              errors.studentName
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-surface-border focus:border-gold focus:ring-gold"
                            }`}
                          />
                        </div>
                        {errors.studentName && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson-light font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.studentName}
                          </p>
                        )}
                      </div>

                      {/* Grade / Class Level */}
                      <div id="grade">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                          Grade / Class Level <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
                          <select
                            value={grade}
                            onChange={(e) => {
                              setGrade(e.target.value);
                              if (errors.grade) setErrors((prev) => ({ ...prev, grade: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-4 py-3 text-base sm:text-sm text-white transition-colors focus:outline-none focus:ring-1 ${
                              errors.grade
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-surface-border focus:border-gold focus:ring-gold"
                            }`}
                          >
                            <option value="" disabled className="text-gray-500">
                              -- Select Student Grade --
                            </option>
                            {GRADES.map((g) => (
                              <option key={g} value={g} className="bg-surface-card text-white">
                                {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.grade && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson-light font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.grade}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Parent Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Parent / Guardian Full Name */}
                      <div id="parentName">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                          Parent / Guardian Full Name <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Solomon Haile"
                            value={parentName}
                            onChange={(e) => {
                              setParentName(e.target.value);
                              if (errors.parentName) setErrors((prev) => ({ ...prev, parentName: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-4 py-3 text-base sm:text-sm text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                              errors.parentName
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-surface-border focus:border-gold focus:ring-gold"
                            }`}
                          />
                        </div>
                        {errors.parentName && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson-light font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.parentName}
                          </p>
                        )}
                      </div>

                      {/* Parent Phone Number with Hint */}
                      <div id="parentPhone">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                          Parent Phone Number <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
                          <input
                            type="tel"
                            placeholder="0911223344"
                            value={parentPhone}
                            onChange={(e) => {
                              setParentPhone(e.target.value);
                              if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-4 py-3 text-base sm:text-sm text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                              errors.parentPhone
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-surface-border focus:border-gold focus:ring-gold"
                            }`}
                          />
                        </div>
                        {errors.parentPhone ? (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson-light font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.parentPhone}
                          </p>
                        ) : (
                          <p className="mt-1.5 text-xs text-gray-400">
                            e.g., 0911223344 or 0711223344
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Emergency Contact Phone */}
                    <div id="emergencyPhone">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Emergency Contact Phone <span className="text-gray-400 text-[11px] font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="e.g. 0912345678"
                          value={emergencyPhone}
                          onChange={(e) => {
                            setEmergencyPhone(e.target.value);
                            if (errors.emergencyPhone) setErrors((prev) => ({ ...prev, emergencyPhone: null }));
                          }}
                          className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-4 py-3 text-base sm:text-sm text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                            errors.emergencyPhone
                              ? "border-crimson focus:border-crimson focus:ring-crimson"
                              : "border-surface-border focus:border-gold focus:ring-gold"
                          }`}
                        />
                      </div>
                      {errors.emergencyPhone ? (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson-light font-medium">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {errors.emergencyPhone}
                        </p>
                      ) : (
                        <p className="mt-1 text-[11px] text-gray-400">
                          e.g., 0912345678 (Secondary guardian or relative)
                        </p>
                      )}
                    </div>

                    {/* UNIFORM SELECTION TOGGLE */}
                    <div className="pt-3 border-t border-surface-border">
                      <div className="rounded-xl border border-surface-border bg-background-rich/70 p-4 sm:p-5">
                        <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px]">
                          <input
                            type="checkbox"
                            checked={includeUniform}
                            onChange={(e) => setIncludeUniform(e.target.checked)}
                            className="mt-1 h-5 w-5 rounded border-surface-border bg-background-deep text-crimson focus:ring-crimson focus:ring-offset-background-deep shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-bold text-white flex items-center gap-2">
                                <Shirt className="h-4 w-4 text-gold shrink-0" />
                                Include Official TKD Uniform (Dobok) + White Belt
                              </span>
                              <span className="text-xs font-bold text-gold bg-gold/15 px-2.5 py-1 rounded-md border border-gold/30">
                                +1,500 ETB
                              </span>
                            </div>
                            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                              Required for all students without an existing Sonnenland SIS Taekwondo uniform. High quality ribbed cotton-poly blend with official SIS martial arts embroidery.
                            </p>
                          </div>
                        </label>

                        {/* CONDITIONAL UNIFORM SIZE DROPDOWN */}
                        {includeUniform && (
                          <div className="mt-4 pt-4 border-t border-surface-border/60 animate-fade-in">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gold mb-1.5">
                              Select Uniform Size <span className="text-crimson">*</span>
                            </label>
                            <div className="relative">
                              <Shirt className="h-4 w-4 absolute left-3.5 top-3.5 text-gold" />
                              <select
                                value={uniformSize}
                                onChange={(e) => setUniformSize(e.target.value)}
                                className="w-full min-h-[44px] rounded-xl border border-gold/40 bg-background-deep pl-10 pr-4 py-3 text-base sm:text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                              >
                                {UNIFORM_SIZES.map((size) => (
                                  <option key={size.value} value={size.value} className="bg-surface-card text-white">
                                    {size.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <p className="mt-1 text-[11px] text-gray-400">
                              Sizes are sized based on student total height in centimeters.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 4. BANK & PAYMENT TRANSFER DETAILS SECTION */}
                <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-8 shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold border border-gold/40 shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">Bank & Payment Transfer Details</h2>
                        <p className="text-xs text-gray-400">Step 2: Transfer Required Fee</p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-crimson/15 px-3 py-1.5 text-xs font-bold text-crimson-light border border-crimson/40 self-start sm:self-auto">
                      <Clock className="h-3.5 w-3.5 text-crimson shrink-0" />
                      <span>Payment Deadline: Wednesday before 3:30 PM</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Transfer the total payable amount (<span className="text-gold font-bold">{totalAmount.toLocaleString()} ETB</span>) via Mobile Banking, CBE Birr, or Telebirr using any of the accounts below:
                  </p>

                  {/* Account Cards - Responsive stacking for phones */}
                  <div className="mt-5 space-y-4">
                    {BANK_ACCOUNTS.map((acc) => {
                      const IconComponent = acc.icon;
                      const isCopied = copiedId === acc.id;

                      return (
                        <div
                          key={acc.id}
                          className={`rounded-2xl border ${acc.borderColor} bg-gradient-to-r ${acc.color} p-4 sm:p-5 transition-all hover:border-gold/40 shadow-sm`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl bg-surface-card/90 p-2.5 text-white border border-surface-border shrink-0 mt-0.5">
                                <IconComponent className="h-5 w-5 text-gold" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-sm font-bold text-white">{acc.bankName}</h3>
                                  <span className="text-[10px] font-semibold text-gray-300 bg-surface-card px-2 py-0.5 rounded border border-surface-border">
                                    {acc.badge}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className="text-base sm:text-lg font-mono font-black text-gold tracking-wider select-all break-all">
                                    {acc.accountNumber}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-300 mt-0.5">
                                  Account Name: <span className="font-semibold text-white">{acc.accountHolder}</span>
                                </p>
                                <p className="text-[11px] text-gray-400">{acc.branch}</p>
                              </div>
                            </div>

                            {/* 1-Click Copy Account Button - Full width touch target on mobile */}
                            <button
                              type="button"
                              onClick={() => handleCopy(acc.id, acc.accountNumber, acc.shortName)}
                              className={`w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:self-center shrink-0 active:scale-95 ${
                                isCopied
                                  ? "bg-emerald-500 text-white shadow-md scale-105"
                                  : "border border-surface-border bg-surface-card text-gray-200 hover:border-gold hover:text-gold hover:bg-surface-elevated"
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-4 w-4 text-white" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5 text-gold" />
                                  <span>Copy Account</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. PAYMENT PROOF SCREENSHOT UPLOAD */}
                <div id="receipt" className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-8 shadow-card">
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson/20 text-crimson-light border border-crimson/40 shrink-0">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">Upload Payment Receipt Proof</h2>
                      <p className="text-xs text-gray-400">Step 3: Verification Screenshot</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Upload screenshot of your CBE Birr, Telebirr, or Mobile Banking receipt.
                  </p>

                  <div className="mt-5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!receiptImage ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all min-h-[160px] ${
                          errors.receipt
                            ? "border-crimson bg-crimson/5 hover:bg-crimson/10"
                            : "border-surface-border hover:border-gold/60 bg-background-deep/70 hover:bg-surface-elevated/40"
                        }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-card border border-surface-border group-hover:scale-110 transition-transform group-hover:border-gold/50">
                          <Upload className="h-6 w-6 text-gold" />
                        </div>
                        <h3 className="mt-3 text-sm font-bold text-white group-hover:text-gold transition-colors">
                          Tap to select payment screenshot
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          Supports PNG, JPG, or JPEG (Max 8MB)
                        </p>
                        <span className="mt-3 min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-xs font-semibold text-gray-300 group-hover:text-white">
                          Select Image File
                        </span>
                      </div>
                    ) : (
                      /* Uploaded Preview with max-h-56 limit */
                      <div className="rounded-2xl border border-surface-border bg-background-deep p-4">
                        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="text-xs font-bold text-white truncate">
                              {receiptFileName}
                            </span>
                            <span className="text-[11px] text-gray-400 shrink-0">({receiptFileSize})</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveReceipt}
                            className="min-h-[36px] inline-flex items-center gap-1 rounded-lg border border-surface-border bg-surface-card px-3 py-1 text-xs font-semibold text-crimson-light hover:bg-crimson/15 hover:border-crimson/40 transition-colors shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Image Preview limited to max-h-56 with object-contain */}
                        <div className="relative overflow-hidden rounded-xl border border-surface-border max-h-56 flex items-center justify-center bg-gray-950 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={receiptImage}
                            alt="Payment Receipt Preview"
                            className="w-auto h-auto max-h-56 object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {errors.receipt && (
                      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-crimson-light font-medium">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {errors.receipt}
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: DYNAMIC FEE SUMMARY & SUBMIT CTA (4 cols) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                
                {/* 3. LIVE FEE SUMMARY CARD (DYNAMIC) */}
                <div className="rounded-2xl border-2 border-gold/40 bg-surface-card p-6 shadow-card relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gold text-gray-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    Term 1 • 2026
                  </div>

                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-crimson" />
                    <h2 className="text-lg font-bold text-white">Live Fee Summary</h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Sonnenland After-School Taekwondo
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-surface-border pt-5 text-sm">
                    <div className="flex items-center justify-between text-gray-300">
                      <div>
                        <span className="font-semibold text-white">Tuition Fee</span>
                        <p className="text-[11px] text-gray-400">1 Term (Mon/Wed/Fri)</p>
                      </div>
                      <span className="font-mono font-bold text-white">10,000 ETB</span>
                    </div>

                    <div className="flex items-center justify-between text-gray-300">
                      <div>
                        <span className="font-semibold text-white">Uniform (Dobok) + Belt</span>
                        <p className="text-[11px] text-gray-400">
                          {includeUniform ? uniformSize : "Not included"}
                        </p>
                      </div>
                      <span className={`font-mono font-bold ${includeUniform ? "text-gold" : "text-gray-400"}`}>
                        {includeUniform ? "1,500 ETB" : "0 ETB"}
                      </span>
                    </div>

                    <div className="border-t border-surface-border pt-4 mt-2 flex items-baseline justify-between">
                      <span className="text-sm font-extrabold uppercase tracking-wider text-gray-200">
                        Total Payable:
                      </span>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black text-gold tracking-tight drop-shadow-md">
                          {totalAmount.toLocaleString()} ETB
                        </span>
                        <p className="text-[10px] text-emerald-400 font-medium">All taxes & equipment included</p>
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT ACTION BUTTON */}
                  <div className="mt-6 pt-5 border-t border-surface-border">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[50px] inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark px-6 py-3.5 text-base font-extrabold text-white shadow-glow-crimson transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Processing Submission...</span>
                        </>
                      ) : (
                        <>
                          <Flame className="h-5 w-5 text-gold-light" />
                          <span>Complete Registration & Submit Proof</span>
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-[11px] text-gray-400 leading-relaxed">
                      Instant registration ticket and WhatsApp confirmation generated upon submission.
                    </p>
                  </div>
                </div>

                {/* Helpful Contact Box */}
                <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
                    <Award className="h-4 w-4" />
                    <span>Instructor Inquiries</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                    Have questions about sizing, dojang training, or medical clearance? Reach Master Daniel directly:
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    <a
                      href="tel:+251911223344"
                      className="min-h-[44px] flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Phone className="h-4 w-4 text-crimson shrink-0" />
                      <span className="font-mono">+251 911 223 344</span>
                    </a>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>Office hours: 8:00 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Instructor Admin Portal Quick Link */}
                <div className="text-center pt-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gold transition-colors py-2"
                  >
                    <span>Master Daniel Admin Portal</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

              </div>

            </div>
          </form>
        </div>
      </main>

      {/* ========================================================= */}
      {/* STICKY TOTAL DUE BAR ON MOBILE BOTTOM (< lg: screens)     */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-surface-border bg-background-rich/95 px-4 py-3 backdrop-blur-md shadow-2xl safe-area-pb">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block leading-tight">
              Total Due:
            </span>
            <span className="text-xl font-black text-gold font-mono leading-none">
              {totalAmount.toLocaleString()} ETB
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("receipt");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-crimson px-5 py-2.5 text-xs font-black text-white shadow-glow-crimson hover:bg-crimson-dark active:scale-95 transition-all"
          >
            <span>Submit Proof</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CELEBRATORY SUCCESS MODAL                                 */}
      {/* ========================================================= */}
      {showSuccessModal && submittedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-gold/40 bg-surface-card p-6 sm:p-8 shadow-2xl text-left my-8 max-h-[90vh] overflow-y-auto slim-scrollbar">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-surface-elevated hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pb-5 border-b border-surface-border">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="mt-3 text-2xl font-black text-white">
                Registration Submitted!
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-300">
                Payment receipt received. Master Daniel will confirm your student roster spot.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-surface-border bg-background-deep p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Registration Ticket
                </span>
                <span className="font-mono text-xs font-extrabold text-gold bg-gold/15 px-2.5 py-0.5 rounded border border-gold/30">
                  {submittedTicket.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400">Student Name:</span>
                  <p className="font-bold text-white mt-0.5">{submittedTicket.studentName}</p>
                </div>
                <div>
                  <span className="text-gray-400">Grade Level:</span>
                  <p className="font-bold text-white mt-0.5">{submittedTicket.grade}</p>
                </div>
                <div>
                  <span className="text-gray-400">Parent / Guardian:</span>
                  <p className="font-bold text-white mt-0.5">{submittedTicket.parentName}</p>
                </div>
                <div>
                  <span className="text-gray-400">Contact Phone:</span>
                  <p className="font-bold text-white mt-0.5">{submittedTicket.parentPhone}</p>
                </div>
                <div>
                  <span className="text-gray-400">Uniform Option:</span>
                  <p className="font-bold text-gold mt-0.5">
                    {submittedTicket.includeUniform ? `Yes (${submittedTicket.uniformSize})` : "Not included"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Total Paid:</span>
                  <p className="font-bold text-white mt-0.5 text-sm">
                    {submittedTicket.totalAmount.toLocaleString()} ETB
                  </p>
                </div>
              </div>

              {submittedTicket.receiptImage && (
                <div className="pt-2 border-t border-surface-border flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submittedTicket.receiptImage}
                    alt="Receipt Thumbnail"
                    className="h-12 w-12 rounded-lg object-cover border border-surface-border"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Receipt Screenshot Attached
                    </span>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                      {submittedTicket.receiptFileName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <a
                href={getWhatsAppShareUrl(submittedTicket)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors shadow-md"
              >
                <Send className="h-4 w-4" />
                <span>Confirm with Master Daniel on WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>

              <a
                href={getTelegramShareUrl(submittedTicket)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-xs font-semibold text-gray-200 hover:border-gold hover:text-white transition-colors"
              >
                <span>Share Confirmation via Telegram</span>
                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              </a>
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="min-h-[44px] px-4 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Dismiss & Return to Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Copied Toast */}
      {copiedToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-surface-card px-4 py-2.5 text-xs font-bold text-emerald-400 shadow-2xl animate-fade-in">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
