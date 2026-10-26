"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import ThemeToggle from "@/components/ThemeToggle";
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
  ArrowRight,
  ExternalLink,
  Flame,
  Award,
  Mail,
  Hash
} from "lucide-react";

const AGES = [
  "3 Years Old",
  "4 Years Old",
  "5 Years Old",
  "6 Years Old",
];

const UNIFORM_SIZES = [
  { value: "100cm", label: "Size 100cm (Age 3, Height ~95-105cm)" },
  { value: "110cm", label: "Size 110cm (Age 4, Height ~105-115cm)" },
  { value: "120cm", label: "Size 120cm (Age 5, Height ~115-125cm)" },
  { value: "130cm", label: "Size 130cm (Age 6+, Height ~125cm+)" },
];

const BANK_ACCOUNTS = [
  {
    id: "cbe",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    shortName: "CBE Account",
    accountNumber: "1000530983459",
    accountHolder: "Daniel Teshome",
    copyLabel: "Copy Account",
    icon: Building2,
    color: "from-purple-50/70 to-white dark:from-purple-950/20 dark:to-slate-800/90",
    borderColor: "border-purple-200 dark:border-purple-900/50",
    badge: "Official Account",
    badgeStyle: "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-950/50",
  },
  {
    id: "telebirr",
    bankName: "Telebirr",
    shortName: "Telebirr Number",
    accountNumber: "0935368595",
    accountHolder: "Daniel Teshome",
    copyLabel: "Copy Number",
    icon: Smartphone,
    color: "from-blue-50/70 to-white dark:from-blue-950/20 dark:to-slate-800/90",
    borderColor: "border-blue-200 dark:border-blue-900/50",
    badge: "Instant Transfer",
    badgeStyle: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-950/50",
  },
  {
    id: "awash",
    bankName: "Awash Bank",
    shortName: "Awash Account",
    accountNumber: "013201241104400",
    accountHolder: "Daniel Teshome",
    copyLabel: "Copy Account",
    icon: CreditCard,
    color: "from-amber-50/70 to-white dark:from-amber-950/20 dark:to-slate-800/90",
    borderColor: "border-amber-200 dark:border-amber-900/50",
    badge: "Official Account",
    badgeStyle: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-950/50",
  },
];

export default function ParentRegistrationPage() {
  // Form State
  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [includeUniform, setIncludeUniform] = useState(false);
  const [uniformSize, setUniformSize] = useState("110cm");
  const [transactionId, setTransactionId] = useState("");

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

  // Copy bank details helper with resilient clipboard & mobile fallback
  const handleCopy = (id, text, label) => {
    const copySuccess = () => {
      setCopiedId(id);
      setCopiedToast(`Copied ${label || "account"} (${text}) to clipboard!`);
      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
      setTimeout(() => {
        setCopiedToast("");
      }, 3500);
    };

    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(copySuccess)
        .catch(() => {
          fallbackCopyText(text);
          copySuccess();
        });
    } else {
      fallbackCopyText(text);
      copySuccess();
    }
  };

  const fallbackCopyText = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (err) {
      console.warn("Fallback copy failed:", err);
    }
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

    setReceiptFileName(file.name);
    setReceiptFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setReceiptImage(loadEvent.target.result);
      setErrors((prev) => ({ ...prev, receipt: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReceipt = () => {
    setReceiptImage(null);
    setReceiptFileName("");
    setReceiptFileSize("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Form Validation & Submission Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!studentName.trim()) {
      newErrors.studentName = "Student full name is required";
    }

    if (!age) {
      newErrors.age = "Please select student's age / እድሜ ይምረጡ";
    }

    if (!parentName.trim()) {
      newErrors.parentName = "Parent or guardian full name is required";
    }

    if (!parentPhone.trim()) {
      newErrors.parentPhone = "Parent phone number is required";
    } else if (!validateEthiopianPhone(parentPhone)) {
      newErrors.parentPhone =
        "Enter a valid Ethiopian phone (e.g. 0911223344 or 0711223344)";
    }

    if (emergencyPhone.trim() && !validateEthiopianPhone(emergencyPhone)) {
      newErrors.emergencyPhone =
        "Enter a valid emergency phone number (e.g. 0912345678)";
    }

    if (!transactionId.trim()) {
      newErrors.transactionId =
        "Please enter the reference number from your bank or Telebirr SMS/receipt to confirm your payment.";
    }

    if (!receiptImage) {
      newErrors.receipt =
        "Please upload a screenshot or photo of your payment transfer receipt";
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
      age,
      grade: age,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      emergencyPhone: emergencyPhone.trim() || "N/A",
      includeUniform,
      uniformSize: includeUniform ? uniformSize : "None",
      uniformStatus: includeUniform ? "Needed" : "None",
      tuitionFee: TUITION_FEE,
      uniformFee: includeUniform ? UNIFORM_FEE : 0,
      totalAmount,
      transactionId: transactionId.trim(),
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
      `🥋 *Sönnenland TKD Hub Registration Confirmation*\n` +
        `-----------------------------------------\n` +
        `*Reference ID:* ${ticket.id}\n` +
        `*Transaction / Ref:* ${ticket.transactionId || "N/A"}\n` +
        `*Student:* ${ticket.studentName} (${ticket.age || ticket.grade})\n` +
        `*Parent:* ${ticket.parentName} (${ticket.parentPhone})\n` +
        `*Uniform:* ${ticket.includeUniform ? `Yes (${ticket.uniformSize})` : "No"}\n` +
        `*Total Paid:* ${ticket.totalAmount.toLocaleString()} ETB\n` +
        `*Date:* ${ticket.displayDate}\n\n` +
        `Hello Master Daniel, I have registered my child for the Sönnenland International Kindergarten After-School TKD Hub and submitted my payment receipt. Thank you!`
    );
    return `https://wa.me/251935368595?text=${text}`;
  };

  const getTelegramShareUrl = (ticket) => {
    if (!ticket) return "#";
    const text = encodeURIComponent(
      `🥋 Sönnenland TKD Hub Registration\nRef: ${ticket.id}\nTxn: ${ticket.transactionId || "N/A"}\nStudent: ${ticket.studentName} (${ticket.age || ticket.grade})\nPaid: ${ticket.totalAmount.toLocaleString()} ETB\nParent: ${ticket.parentName} (${ticket.parentPhone})`
    );
    return `https://t.me/share/url?url=https://sonnenland.school/tkd&text=${text}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] text-slate-800 dark:text-slate-100 selection:bg-crimson selection:text-white overflow-x-hidden transition-colors duration-200">
      {/* Top Navigation with Theme Switcher */}
      <Navbar />

      <main className="flex-1 pb-28 sm:pb-24">
        {/* ========================================================= */}
        {/* 1. HEADER / HERO SECTION                                  */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-slate-100 via-slate-50 to-[#F8FAFC] dark:from-[#0F172A] dark:via-[#090D16] dark:to-[#090D16]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-crimson/5 dark:bg-crimson/15 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-amber-400/10 dark:bg-amber-400/15 blur-[90px] pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Registration Status Badge */}
            <div className="inline-flex mb-4">
              <Badge variant="gold" size="md" pulse={true}>
                <Calendar className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" />
                <span className="font-bold">Oct 26 – Oct 28 Registration Open</span>
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Sönnenland International Kindergarten <span className="text-crimson">After-School TKD Hub</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-base sm:text-2xl font-bold text-slate-700 dark:text-slate-200 max-w-3xl mx-auto leading-snug">
              Specialized martial arts, discipline, and physical development exclusively for Sönnenland kindergarten students (Ages 3 to 6).
            </p>

            {/* Schedule Indicator */}
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 px-4 py-2.5 sm:px-5 sm:py-3 shadow-sm dark:shadow-md">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Mon / Wed / Fri – 3:30 PM to 4:30 PM</span>
              </div>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm">
                <MapPin className="h-4 w-4 text-crimson shrink-0" />
                <span>Sönnenland International Kindergarten (Dojang)</span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Exclusively open to Sönnenland International Kindergarten students (Ages 3, 4, 5, and 6).
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
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/90 dark:bg-[#1E293B] p-5 sm:p-8 shadow-sm dark:shadow-md transition-colors">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700/80">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/15 text-crimson dark:text-red-400 border border-red-200 dark:border-red-500/30 shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Student & Parent Information</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Step 1: Enrolment Profile</p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500">
                      * Required
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Row 1: Student Name & Grade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Student Full Name */}
                      <div id="studentName">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Student Full Name <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Nahom Solomon"
                            value={studentName}
                            onChange={(e) => {
                              setStudentName(e.target.value);
                              if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900/90 pl-10 pr-4 py-3 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                              errors.studentName
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                            }`}
                          />
                        </div>
                        {errors.studentName && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.studentName}
                          </p>
                        )}
                      </div>

                      {/* Age / እድሜ Selection */}
                      <div id="age">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Age / እድሜ <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                          <select
                            value={age}
                            onChange={(e) => {
                              setAge(e.target.value);
                              if (errors.age) setErrors((prev) => ({ ...prev, age: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900/90 pl-10 pr-10 py-3 text-base sm:text-sm text-slate-900 dark:text-white appearance-none transition-colors focus:outline-none focus:ring-1 ${
                              errors.age
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                            }`}
                          >
                            <option value="" disabled className="text-slate-400">
                              Select Student Age / እድሜ ይምረጡ
                            </option>
                            {AGES.map((a) => (
                              <option key={a} value={a} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                {a}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-4 text-slate-400">
                            ▼
                          </div>
                        </div>
                        {errors.age && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.age}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Parent Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Parent Full Name */}
                      <div id="parentName">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Parent / Guardian Full Name <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Solomon Haile"
                            value={parentName}
                            onChange={(e) => {
                              setParentName(e.target.value);
                              if (errors.parentName) setErrors((prev) => ({ ...prev, parentName: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900/90 pl-10 pr-4 py-3 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                              errors.parentName
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                            }`}
                          />
                        </div>
                        {errors.parentName && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.parentName}
                          </p>
                        )}
                      </div>

                      {/* Parent Phone Number with Ethiopian validation */}
                      <div id="parentPhone">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Parent Phone Number <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="0911223344"
                            value={parentPhone}
                            onChange={(e) => {
                              setParentPhone(e.target.value);
                              if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: null }));
                            }}
                            className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900/90 pl-10 pr-4 py-3 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                              errors.parentPhone
                                ? "border-crimson focus:border-crimson focus:ring-crimson"
                                : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                            }`}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          e.g., 0911223344 or 0711223344 (Ethiopian mobile)
                        </p>
                        {errors.parentPhone && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-crimson font-medium">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.parentPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Emergency Contact Phone (Optional) */}
                    <div id="emergencyPhone">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Emergency Contact Phone <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="e.g. 0912345678 (Secondary guardian or relative)"
                          value={emergencyPhone}
                          onChange={(e) => {
                            setEmergencyPhone(e.target.value);
                            if (errors.emergencyPhone) setErrors((prev) => ({ ...prev, emergencyPhone: null }));
                          }}
                          className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900/90 pl-10 pr-4 py-3 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                            errors.emergencyPhone
                              ? "border-crimson focus:border-crimson focus:ring-crimson"
                              : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                          }`}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Optional backup phone number in case primary guardian is unreachable.
                      </p>
                      {errors.emergencyPhone && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-crimson font-medium">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {errors.emergencyPhone}
                        </p>
                      )}
                    </div>

                    {/* Row 4: Uniform Selection Toggle & Size Dropdown */}
                    <div className="pt-2">
                      <div className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
                        includeUniform
                          ? "border-amber-300 dark:border-amber-500/50 bg-amber-50/50 dark:bg-amber-500/10"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                      }`}>
                        <label className="flex items-start gap-3.5 cursor-pointer select-none min-h-[44px]">
                          <input
                            type="checkbox"
                            checked={includeUniform}
                            onChange={(e) => setIncludeUniform(e.target.checked)}
                            className="mt-1 h-5 w-5 rounded border-slate-300 text-crimson focus:ring-crimson shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Shirt className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                Include Official TKD Uniform (Dobok) + White Belt
                              </span>
                              <span className="text-xs font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-500/30">
                                +1,500 ETB
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                              Required for all students without an existing Sonnenland approved Dobok. Comes with jacket, pants, and white belt.
                            </p>
                          </div>
                        </label>

                        {/* Conditional Size Selector */}
                        {includeUniform && (
                          <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-500/30 animate-fade-in">
                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1.5">
                              Select Uniform Size (Based on Student Height):
                            </label>
                            <div className="relative">
                              <select
                                value={uniformSize}
                                onChange={(e) => setUniformSize(e.target.value)}
                                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-base sm:text-sm text-slate-900 dark:text-white focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
                              >
                                {UNIFORM_SIZES.map((size) => (
                                  <option key={size.value} value={size.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    {size.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                              Master Daniel will also verify exact fits on day one of training.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 4. BANK & PAYMENT TRANSFER DETAILS SECTION */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/90 dark:bg-[#1E293B] p-5 sm:p-8 shadow-sm dark:shadow-md transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/80">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-400/30 shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Bank & Payment Transfer Details</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Step 2: Transfer Required Fee</p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 self-start sm:self-auto shadow-xs">
                      <Clock className="h-3.5 w-3.5 text-crimson shrink-0" />
                      <span>Payment Deadline: Wednesday before 3:30 PM</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Transfer the total payable amount (<span className="text-amber-700 dark:text-amber-400 font-black">{totalAmount.toLocaleString()} ETB</span>) via Mobile Banking, CBE Birr, or Telebirr using any of Master Daniel's official accounts below:
                  </p>

                  {/* Account Cards - Responsive stacking for phones */}
                  <div className="mt-5 space-y-4">
                    {BANK_ACCOUNTS.map((acc) => {
                      const IconComponent = acc.icon;
                      const isCopied = copiedId === acc.id;

                      return (
                        <div
                          key={acc.id}
                          className={`rounded-2xl border ${acc.borderColor} bg-gradient-to-r ${acc.color} p-4 sm:p-5 transition-all hover:border-amber-400 shadow-sm`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className={`rounded-xl ${acc.iconBg} p-2.5 ${acc.iconColor} border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{acc.bankName}</h3>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${acc.badgeStyle}`}>
                                    {acc.badge}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className="text-base sm:text-lg font-mono font-black text-amber-700 dark:text-amber-400 tracking-wider select-all break-all">
                                    {acc.accountNumber}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                  Account Name: <span className="font-bold text-slate-900 dark:text-white">{acc.accountHolder}</span>
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                    Verified Official Account
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 1-Click Copy Button - Full width touch target on mobile */}
                            <button
                              type="button"
                              onClick={() => handleCopy(acc.id, acc.accountNumber, acc.shortName)}
                              className={`w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:self-center shrink-0 active:scale-95 ${
                                isCopied
                                  ? "bg-emerald-600 text-white shadow-md"
                                  : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-amber-500 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700"
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-4 w-4 text-white" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                  <span>{acc.copyLabel || "Copy Account"}</span>
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
                <div id="receipt" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/90 dark:bg-[#1E293B] p-5 sm:p-8 shadow-sm dark:shadow-md transition-colors">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/15 text-crimson dark:text-red-400 border border-red-200 dark:border-red-500/30 shrink-0">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Payment Verification & Proof</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Step 3: Reference Number & Transfer Screenshot</p>
                    </div>
                  </div>

                  {/* Mandatory Field 1: Transaction ID / Reference Number */}
                  <div id="transactionId" className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Transaction ID / Reference Number <span className="text-crimson">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. FT26298XXXXX or Telebirr transaction reference"
                        value={transactionId}
                        onChange={(e) => {
                          setTransactionId(e.target.value);
                          if (errors.transactionId) setErrors((prev) => ({ ...prev, transactionId: null }));
                        }}
                        className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900/90 pl-10 pr-4 py-3 text-base sm:text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                          errors.transactionId
                            ? "border-crimson focus:border-crimson focus:ring-crimson"
                            : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                        }`}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      Please enter the reference number from your bank or Telebirr SMS/receipt to confirm your payment.
                    </p>
                    {errors.transactionId && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-crimson font-medium">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.transactionId}
                      </p>
                    )}
                  </div>

                  {/* Mandatory Field 2: Transfer Receipt Screenshot */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700/80">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Upload Transfer Receipt Screenshot <span className="text-crimson">*</span>
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Upload screenshot of your CBE Birr, Telebirr, or Mobile Banking receipt.
                    </p>

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
                            ? "border-crimson bg-red-50/60 dark:bg-red-950/20 hover:bg-red-50"
                            : "border-slate-300 dark:border-slate-700 hover:border-amber-500 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-900/80"
                        }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform group-hover:border-amber-400 shadow-sm">
                          <Upload className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                          Tap to select payment screenshot
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Supports PNG, JPG, or JPEG (Max 8MB)
                        </p>
                        <span className="mt-3 min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:border-amber-400 shadow-xs">
                          Select Image File
                        </span>
                      </div>
                    ) : (
                      /* Uploaded Preview with max-h-56 limit */
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 p-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {receiptFileName}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">({receiptFileSize})</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveReceipt}
                            className="min-h-[36px] inline-flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-3 py-1 text-xs font-bold text-crimson dark:text-red-400 hover:bg-red-100 transition-colors shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Image Preview limited to max-h-56 with object-contain */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 max-h-56 flex items-center justify-center bg-white dark:bg-slate-950 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={receiptImage}
                            alt="Payment Receipt Preview"
                            className="w-auto h-auto max-h-56 object-contain rounded-lg shadow-xs"
                          />
                        </div>
                      </div>
                    )}

                    {errors.receipt && (
                      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-crimson font-medium">
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
                <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-400/60 bg-white dark:bg-slate-850/95 dark:bg-[#1E293B] p-6 shadow-sm dark:shadow-glow-gold relative overflow-hidden transition-colors">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-xs">
                    Term 1 • 2026
                  </div>

                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-crimson" />
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Live Fee Summary</h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sönnenland Kindergarten After-School Program
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-slate-200 dark:border-slate-700/80 pt-5 text-sm">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Tuition Fee</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">1 Term (Mon/Wed/Fri)</p>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">10,000 ETB</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Uniform (Dobok) + Belt</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {includeUniform ? uniformSize : "Not included"}
                        </p>
                      </div>
                      <span className={`font-mono font-bold ${includeUniform ? "text-amber-700 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
                        {includeUniform ? "1,500 ETB" : "0 ETB"}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700/80 pt-4 mt-2 flex items-baseline justify-between">
                      <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Total Payable:
                      </span>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
                          {totalAmount.toLocaleString()} ETB
                        </span>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Equipment & tuition included</p>
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT ACTION BUTTON */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700/80">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[50px] inline-flex items-center justify-center gap-2.5 rounded-xl bg-crimson hover:bg-crimson-dark px-6 py-3.5 text-base font-extrabold text-white shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Processing Submission...</span>
                        </>
                      ) : (
                        <>
                          <Flame className="h-5 w-5 text-amber-300" />
                          <span>Complete Registration & Submit Proof</span>
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Instant registration ticket and WhatsApp confirmation generated upon submission.
                    </p>
                  </div>
                </div>

                {/* Helpful Contact Box */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/90 dark:bg-[#1E293B] p-5 shadow-sm dark:shadow-md transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Instructor Inquiries</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Have questions about sizing, dojang training, or medical clearance? Reach Master Daniel directly:
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    <a
                      href="tel:+251935368595"
                      className="min-h-[44px] flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-crimson font-medium transition-colors"
                    >
                      <Phone className="h-4 w-4 text-crimson shrink-0" />
                      <span className="font-mono font-bold">+251 935 368 595</span>
                    </a>
                    <a
                      href="mailto:danielteshome335@gmail.com"
                      className="min-h-[44px] flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-crimson font-medium transition-colors"
                    >
                      <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="font-mono font-medium">danielteshome335@gmail.com</span>
                    </a>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Office hours: 8:00 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </form>
        </div>
      </main>

      {/* ========================================================= */}
      {/* STICKY TOTAL DUE BAR ON MOBILE BOTTOM (< lg: screens)     */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/95 px-4 py-3 backdrop-blur-md shadow-lg safe-area-pb">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-tight">
              Total Due:
            </span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono leading-none">
              {totalAmount.toLocaleString()} ETB
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("receipt");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-crimson px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-crimson-dark active:scale-95 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 dark:bg-[#1E293B] p-6 sm:p-8 shadow-2xl text-left my-8 max-h-[90vh] overflow-y-auto slim-scrollbar text-slate-900 dark:text-white">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pb-5 border-b border-slate-200 dark:border-slate-700">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shadow-xs">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                Registration Submitted!
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Payment receipt received. Master Daniel will confirm your student roster spot.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Registration Ticket
                </span>
                <span className="font-mono text-xs font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-300 dark:border-amber-400/40">
                  {submittedTicket.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Student Name:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{submittedTicket.studentName}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Age / እድሜ:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{submittedTicket.age || submittedTicket.grade}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Parent / Guardian:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{submittedTicket.parentName}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Contact Phone:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{submittedTicket.parentPhone}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Uniform Option:</span>
                  <p className="font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                    {submittedTicket.includeUniform ? `Yes (${submittedTicket.uniformSize})` : "Not included"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Total Paid:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5 text-sm">
                    {submittedTicket.totalAmount.toLocaleString()} ETB
                  </p>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700/80">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Transaction ID / Reference:</span>
                  <p className="font-mono font-bold text-amber-700 dark:text-amber-400 mt-0.5 text-xs sm:text-sm select-all">
                    {submittedTicket.transactionId || "N/A"}
                  </p>
                </div>
              </div>

              {submittedTicket.receiptImage && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submittedTicket.receiptImage}
                    alt="Receipt Thumbnail"
                    className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      Receipt Screenshot Attached
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
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
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>Confirm with Master Daniel on WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>

              <a
                href={getTelegramShareUrl(submittedTicket)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              >
                <span>Share Confirmation via Telegram</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
              >
                Dismiss & Return to Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Copy Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white shadow-xl animate-fade-in max-w-sm">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0">
            <Check className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{copiedToast}</span>
          <button
            type="button"
            onClick={() => setCopiedToast("")}
            className="ml-auto min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
