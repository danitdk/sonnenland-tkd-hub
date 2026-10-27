"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  Eye,
  Phone,
  PhoneCall,
  UserPlus,
  Trash2,
  KeyRound,
  Lock,
  Unlock,
  Search,
  Filter,
  ArrowLeft,
  Shirt,
  Calendar,
  AlertCircle,
  Download,
  X,
  Check,
  Building2,
  ExternalLink,
  Smartphone,
  CreditCard,
  RefreshCw,
  Plus,
  FileText,
  User,
  GraduationCap,
  MessageSquare,
  Send,
  FileSpreadsheet,
  Copy,
  Globe,
  XCircle,
  Flag
} from "lucide-react";
import Badge from "@/components/Badge";
import ThemeToggle from "@/components/ThemeToggle";

const AGES = [
  "3 Years Old",
  "4 Years Old",
  "5 Years Old",
  "6 Years Old",
];

const UNIFORM_SIZES = [
  "100cm",
  "110cm",
  "120cm",
  "130cm",
];

export default function InstructorAdminDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [filterUniform, setFilterUniform] = useState("ALL");
  const [filterAge, setFilterAge] = useState("ALL");
  const [filterTerm, setFilterTerm] = useState("ALL");

  const [selectedReceiptStudent, setSelectedReceiptStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    studentName: "",
    studentType: "New Student", // "New Student" | "Returning Student"
    term: "Term 2", // "Term 2" | "Term 3"
    age: "3 Years Old",
    grade: "3 Years Old",
    parentName: "",
    parentPhone: "",
    emergencyPhone: "",
    paymentMethod: "Telebirr",
    includeUniform: true,
    uniformSize: "110cm",
    paymentStatus: "Pending",
    notes: "",
  });
  const [addFormErrors, setAddFormErrors] = useState({});

  const [reminderStudent, setReminderStudent] = useState(null);
  const [reminderText, setReminderText] = useState("");
  const [isCopiedReminder, setIsCopiedReminder] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    try {
      const unlocked = sessionStorage.getItem("tkd_admin_unlocked");
      if (unlocked === "true") {
        setIsUnlocked(true);
      }
    } catch (e) {
      console.warn("sessionStorage unavailable:", e);
    }
    setHasCheckedSession(true);
  }, []);

  // Persistent Submissions via localStorage (No dummy/seed records)
  const loadStudentsFromStorage = () => {
    try {
      const stored = localStorage.getItem("sonnenland_registrations");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy seed IDs if they were previously saved by old mock code
          const realStudents = parsed.filter(
            (item) =>
              item &&
              item.id !== "TKD-2026-1042" &&
              item.id !== "TKD-2026-1043" &&
              item.id !== "TKD-2026-1044" &&
              item.id !== "TKD-2026-1045" &&
              item.id !== "TKD-2026-1046"
          );

          const normalized = realStudents.map((item, idx) => ({
            id: item.id || `TKD-2026-${1000 + idx}`,
            studentName: item.studentName || "Unknown Student",
            studentType: item.studentType || (item.includeUniform ? "New Student" : "Returning Student"),
            term: item.term || "Term 2",
            age: item.age || item.grade || "3 Years Old",
            grade: item.age || item.grade || "3 Years Old",
            parentName: item.parentName || "Unknown Parent",
            parentPhone: item.parentPhone || "0911000000",
            emergencyPhone: item.emergencyPhone && item.emergencyPhone !== "N/A" ? item.emergencyPhone : "N/A",
            paymentMethod: item.paymentMethod || "Telebirr / CBE",
            includeUniform: Boolean(item.includeUniform),
            uniformSize: item.uniformSize || (item.includeUniform ? "110cm" : "None"),
            uniformStatus: item.uniformStatus || (item.includeUniform ? "Needed" : "None"),
            trainingFee: item.trainingFee || item.tuitionFee || 10000,
            tuitionFee: item.trainingFee || item.tuitionFee || 10000,
            uniformFee: item.uniformFee !== undefined ? item.uniformFee : (item.includeUniform ? 1500 : 0),
            totalAmount: item.totalAmount || ((item.trainingFee || item.tuitionFee || 10000) + (item.includeUniform ? 1500 : 0)),
            transactionId: item.transactionId || "N/A",
            paymentStatus:
              item.paymentStatus === "Verified" || item.paymentStatus === "Paid"
                ? "Verified"
                : item.paymentStatus === "Invalid" || item.paymentStatus === "Rejected"
                ? "Invalid"
                : "Pending",
            receiptImage: item.receiptImage || null,
            receiptFileName: item.receiptFileName || "receipt_screenshot.png",
            registeredAt: item.registeredAt || new Date().toISOString(),
            displayDate: item.displayDate || "Recent Registration",
            notes: item.notes || undefined,
            registrationType: item.registrationType || "Online",
          }));

          setStudents(normalized);
          // If legacy dummy seed entries were present in localStorage, purge them
          if (realStudents.length !== parsed.length) {
            localStorage.setItem("sonnenland_registrations", JSON.stringify(normalized));
          }
          return;
        }
      }
      setStudents([]);
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
      setStudents([]);
    }
  };

  useEffect(() => {
    loadStudentsFromStorage();
  }, []);

  useEffect(() => {
    if (!reminderStudent) {
      setReminderText("");
      return;
    }
    const total = reminderStudent.totalAmount?.toLocaleString() || "10,000";
    setReminderText(
      `Hello ${reminderStudent.parentName}, this is Master Daniel regarding ${reminderStudent.studentName}'s enrollment in Sönnenland Taekwondo. To secure their spot, kindly finalize the term training fee of ${total} ETB. Please share the transfer receipt once completed. Thank you!`
    );
    setIsCopiedReminder(false);
  }, [reminderStudent]);

  const persistStudents = (updatedStudents) => {
    setStudents(updatedStudents);
    try {
      localStorage.setItem(
        "sonnenland_registrations",
        JSON.stringify(updatedStudents)
      );
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  const handlePinSubmit = (e) => {
    e?.preventDefault();
    if (pinInput === "2141") {
      setIsUnlocked(true);
      setPinError("");
      try {
        sessionStorage.setItem("tkd_admin_unlocked", "true");
      } catch (err) {
        console.warn(err);
      }
    } else {
      setPinError("Incorrect PIN. Please enter Master Daniel's 4-digit code.");
      setPinInput("");
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem("tkd_admin_unlocked");
    } catch (err) {
      console.warn(err);
    }
    setIsUnlocked(false);
    setPinInput("");
    setPinError("");
  };

  const handleSetPaymentStatus = (studentId, newStatus) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return { ...s, paymentStatus: newStatus };
      }
      return s;
    });
    persistStudents(updated);

    if (selectedReceiptStudent?.id === studentId) {
      setSelectedReceiptStudent((prev) => ({
        ...prev,
        paymentStatus: newStatus,
      }));
    }

    setToastMessage(
      newStatus === "Verified"
        ? "Payment marked as Verified!"
        : newStatus === "Invalid"
        ? "Payment flagged as Invalid (Rejected)."
        : "Payment status reset to Pending."
    );
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleTogglePayment = (studentId) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;
    const nextStatus = target.paymentStatus === "Verified" ? "Pending" : "Verified";
    handleSetPaymentStatus(studentId, nextStatus);
  };

  const handleToggleUniform = (studentId) => {
    const updated = students.map((s) => {
      if (s.id === studentId && s.includeUniform) {
        const nextStatus = s.uniformStatus === "Delivered" ? "Needed" : "Delivered";
        return { ...s, uniformStatus: nextStatus };
      }
      return s;
    });
    persistStudents(updated);
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;
    const updated = students.filter((s) => s.id !== studentToDelete.id);
    persistStudents(updated);
    setStudentToDelete(null);
    setToastMessage("Registration removed from roster.");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveManualStudent = (e) => {
    e.preventDefault();
    const errors = {};

    if (!addForm.studentName.trim()) {
      errors.studentName = "Student full name is required";
    }
    if (!addForm.parentName.trim()) {
      errors.parentName = "Parent full name is required";
    }
    if (!addForm.parentPhone.trim()) {
      errors.parentPhone = "Parent phone number is required";
    }

    if (Object.keys(errors).length > 0) {
      setAddFormErrors(errors);
      return;
    }

    setAddFormErrors({});

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `TKD-2026-${randomDigits}`;
    const totalAmount = 10000 + (addForm.includeUniform ? 1500 : 0);

    const newStudent = {
      id: newId,
      studentName: addForm.studentName.trim(),
      studentType: addForm.studentType || (addForm.includeUniform ? "New Student" : "Returning Student"),
      term: addForm.term || "Term 2",
      age: addForm.age || addForm.grade || "3 Years Old",
      grade: addForm.age || addForm.grade || "3 Years Old",
      parentName: addForm.parentName.trim(),
      parentPhone: addForm.parentPhone.trim(),
      emergencyPhone: addForm.emergencyPhone?.trim() || "N/A",
      paymentMethod: addForm.paymentMethod || "Telebirr",
      includeUniform: addForm.includeUniform,
      uniformSize: addForm.includeUniform ? addForm.uniformSize : "None",
      uniformStatus: addForm.includeUniform ? "Needed" : "None",
      trainingFee: 10000,
      tuitionFee: 10000,
      uniformFee: addForm.includeUniform ? 1500 : 0,
      totalAmount,
      transactionId: "N/A",
      paymentStatus: addForm.paymentStatus,
      receiptImage: null,
      receiptFileName:
        addForm.paymentStatus === "Verified"
          ? "Paid in Cash / Verified by Phone"
          : "Awaiting Transfer",
      registeredAt: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      notes: addForm.notes.trim() || undefined,
      registrationType: "Phone Call",
    };

    const updated = [newStudent, ...students];
    persistStudents(updated);

    setAddForm({
      studentName: "",
      studentType: "New Student",
      term: "Term 2",
      age: "3 Years Old",
      grade: "3 Years Old",
      parentName: "",
      parentPhone: "",
      emergencyPhone: "",
      paymentMethod: "Telebirr",
      includeUniform: true,
      uniformSize: "110cm",
      paymentStatus: "Pending",
      notes: "",
    });
    setIsAddModalOpen(false);

    setToastMessage("Student registered successfully!");
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  const handleCopyReminder = () => {
    navigator.clipboard.writeText(reminderText);
    setIsCopiedReminder(true);
    setToastMessage("Reminder message copied to clipboard!");
    setTimeout(() => {
      setIsCopiedReminder(false);
    }, 3000);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      s.studentName.toLowerCase().includes(term) ||
      s.parentName.toLowerCase().includes(term) ||
      (s.parentPhone && s.parentPhone.includes(term)) ||
      (s.transactionId && s.transactionId.toLowerCase().includes(term)) ||
      s.id.toLowerCase().includes(term);

    const matchesPayment =
      filterPayment === "ALL" || s.paymentStatus === filterPayment;

    let matchesUniform = true;
    if (filterUniform === "Needed") {
      matchesUniform = s.includeUniform && s.uniformStatus === "Needed";
    } else if (filterUniform === "Delivered") {
      matchesUniform = s.includeUniform && s.uniformStatus === "Delivered";
    }

    let matchesAge = true;
    if (filterAge !== "ALL") {
      matchesAge = (s.age || s.grade) === filterAge;
    }

    const matchesTerm = filterTerm === "ALL" || (s.term || "Term 2") === filterTerm;

    return matchesSearch && matchesPayment && matchesUniform && matchesAge && matchesTerm;
  });

  const handleExportCSV = () => {
    const headers = [
      "Student Name",
      "Age",
      "Parent Name",
      "Parent Phone",
      "Emergency Contact",
      "Registration Type",
      "Term",
      "Payment Method",
      "Training Fee (ETB)",
      "Uniform Fee (ETB)",
      "Total Amount (ETB)",
      "Payment Status",
      "Uniform Selection",
      "Uniform Size",
      "Registration Date",
    ];

    const rows = filteredStudents.map((s) => [
      `"${(s.studentName || "").replace(/"/g, '""')}"`,
      `"${s.age || s.grade || ""}"`,
      `"${(s.parentName || "").replace(/"/g, '""')}"`,
      `"${s.parentPhone || ""}"`,
      `"${s.emergencyPhone || "N/A"}"`,
      `"${s.studentType || (s.includeUniform ? "New Student" : "Returning Student")}"`,
      `"${s.term || "Term 2"}"`,
      `"${s.paymentMethod || "Telebirr / CBE"}"`,
      s.trainingFee || s.tuitionFee || 10000,
      s.uniformFee !== undefined ? s.uniformFee : (s.includeUniform ? 1500 : 0),
      s.totalAmount || 0,
      `"${s.paymentStatus || "Pending"}"`,
      s.includeUniform ? "Yes" : "No",
      `"${s.uniformSize || "None"}"`,
      `"${s.displayDate || s.registeredAt || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `Sonnenland_TKD_Students_${dateStr}.csv`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`CSV export downloaded: ${fileName} (${filteredStudents.length} students)`);
    setTimeout(() => setToastMessage(""), 4500);
  };

  const totalStudents = students.length;
  const verifiedPaymentsETB = students
    .filter((s) => s.paymentStatus === "Verified")
    .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const pendingPaymentsETB = students
    .filter((s) => s.paymentStatus === "Pending")
    .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const invalidPaymentsCount = students.filter(
    (s) => s.paymentStatus === "Invalid"
  ).length;
  const uniformsNeededCount = students.filter(
    (s) => s.includeUniform && s.uniformStatus === "Needed"
  ).length;

  const modalTotalFee = 10000 + (addForm.includeUniform ? 1500 : 0);

  if (!hasCheckedSession) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17]" />;
  }

  // =========================================================
  // SECURITY PIN PROTECTION GATE (Dark & Light Mode Supported)
  // =========================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F17] px-4 py-8 selection:bg-crimson selection:text-white transition-colors duration-200">
        
        {/* Top Floating Controls */}
        <div className="fixed top-4 right-4 z-20">
          <ThemeToggle size="sm" />
        </div>

        <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 sm:p-8 shadow-xl text-center transition-colors">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-crimson to-red-700 shadow-md text-white border border-crimson/20">
            <KeyRound className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Instructor Portal
          </h2>
          <p className="mt-1 text-sm font-bold text-amber-700 dark:text-amber-400">
            Master Daniel • Sönnenland International Kindergarten After-School TKD
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Please enter the 4-digit Master PIN to unlock the enrollment administration dashboard.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="• • • •"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError("");
                }}
                className="w-full min-h-[48px] text-center text-3xl font-mono tracking-[0.5em] rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-amber-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {pinError && (
              <p className="flex items-center justify-center gap-1.5 text-xs text-crimson dark:text-red-400 font-medium animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{pinError}</span>
              </p>
            )}

            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (pinInput.length < 4) {
                      const next = pinInput + num;
                      setPinInput(next);
                      if (next.length === 4 && next === "2141") {
                        setIsUnlocked(true);
                        sessionStorage.setItem("tkd_admin_unlocked", "true");
                      }
                    }
                  }}
                  className="min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 py-3 text-lg font-bold text-slate-800 dark:text-slate-200 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPinInput("")}
                className="min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white active:scale-95"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pinInput.length < 4) {
                    const next = pinInput + "0";
                    setPinInput(next);
                    if (next.length === 4 && next === "2141") {
                      setIsUnlocked(true);
                      sessionStorage.setItem("tkd_admin_unlocked", "true");
                    }
                  }
                }}
                className="min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 py-3 text-lg font-bold text-slate-800 dark:text-slate-200 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                className="min-h-[48px] rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 py-3 text-sm font-semibold text-crimson dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/70 active:scale-95"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-crimson px-6 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-red-700 active:scale-95 transition-all"
            >
              <Unlock className="h-4 w-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/80">
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-crimson dark:hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Registration Page</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // UNLOCKED INSTRUCTOR DASHBOARD VIEW (Dark & Light Theme)
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex flex-col selection:bg-crimson selection:text-white overflow-x-hidden transition-colors duration-200">
      
      {/* 1. HEADER & NAVIGATION WITH THEME SWITCHER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md shadow-sm transition-colors duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-crimson dark:hover:text-amber-400 hover:border-crimson/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Public Registration</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 overflow-hidden">
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
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight truncate">
                  Instructor Portal — Master Daniel
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Sönnenland International Kindergarten After-School TKD
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dynamic Theme Switcher ("ፀሐይ" / "ጨለማ") */}
            <ThemeToggle size="md" className="hidden sm:inline-flex" />
            <ThemeToggle size="sm" showLabel={false} className="sm:hidden" />

            {/* Refresh from localStorage button */}
            <button
              type="button"
              onClick={() => {
                loadStudentsFromStorage();
                setToastMessage("Roster refreshed from storage.");
                setTimeout(() => setToastMessage(""), 2500);
              }}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-700 transition-all shadow-sm"
              title="Refresh roster from storage"
            >
              <RefreshCw className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden md:inline">Refresh</span>
            </button>

            {/* Export CSV button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-slate-700 transition-all shadow-sm"
              title="Export filtered roster to CSV for Director Betty"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* + Add Student (Phone Call) */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-crimson px-3 py-2 sm:px-4 sm:py-2 text-xs font-black text-white shadow-md hover:bg-red-700 active:scale-95 transition-all"
            >
              <PhoneCall className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">+ Add Student</span>
            </button>

            {/* Lock button */}
            <button
              type="button"
              onClick={handleLock}
              title="Lock Admin Session"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-crimson dark:hover:text-red-400 hover:border-red-300 hover:bg-red-50/40 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Lock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-5 sm:px-6 lg:px-8 space-y-6">

        {/* 2. SUMMARY METRIC KPI CARDS */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm transition-all hover:border-crimson/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Enrolled
              </span>
              <div className="rounded-xl bg-red-50 dark:bg-red-500/15 p-2 text-crimson dark:text-red-400 border border-red-200 dark:border-red-500/30">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {totalStudents}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Students</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">Ages 3 to 6 Years Old</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm transition-all hover:border-emerald-400">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Verified (ETB)
              </span>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/15 p-2 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono truncate block">
                {verifiedPaymentsETB.toLocaleString()} ETB
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {students.filter((s) => s.paymentStatus === "Verified").length} confirmed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm transition-all hover:border-amber-400">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending (ETB)
              </span>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-500/15 p-2 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 font-mono truncate block">
                {pendingPaymentsETB.toLocaleString()} ETB
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {students.filter((s) => s.paymentStatus === "Pending").length} awaiting
              {invalidPaymentsCount > 0 && (
                <span className="text-crimson font-semibold"> • {invalidPaymentsCount} flagged</span>
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm transition-all hover:border-purple-300">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Uniforms Needed
              </span>
              <div className="rounded-xl bg-purple-50 dark:bg-purple-500/15 p-2 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                <Shirt className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-4xl font-black text-purple-900 dark:text-purple-300">
                {uniformsNeededCount}
              </span>
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400">To Deliver</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">Official Dobok sets</p>
          </div>

        </div>

        {/* 3. FILTER & SEARCH CONTROLS */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 shadow-sm transition-colors">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student or parent phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-10 pr-9 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
              <select
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:border-amber-600 focus:outline-none shadow-sm"
              >
                <option value="ALL">Term: All</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>

              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:border-amber-600 focus:outline-none shadow-sm"
              >
                <option value="ALL">Payment: All</option>
                <option value="Verified">Verified (Paid)</option>
                <option value="Pending">Pending</option>
                <option value="Invalid">Invalid (Flagged)</option>
              </select>

              <select
                value={filterUniform}
                onChange={(e) => setFilterUniform(e.target.value)}
                className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:border-amber-600 focus:outline-none shadow-sm"
              >
                <option value="ALL">Uniform: All</option>
                <option value="Needed">Needed</option>
                <option value="Delivered">Delivered</option>
              </select>

              <select
                value={filterAge}
                onChange={(e) => setFilterAge(e.target.value)}
                className="min-h-[44px] col-span-2 sm:col-span-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:border-amber-600 focus:outline-none shadow-sm"
              >
                <option value="ALL">All Ages</option>
                {AGES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* 4. STUDENTS DATA DISPLAY */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden transition-colors">
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Enrollment Roster</h2>
              <span className="rounded-md bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                {filteredStudents.length} Students
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                Swipe horizontally or tap cards to manage
              </span>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="min-h-[36px] inline-flex items-center gap-1.5 text-xs font-bold text-crimson dark:text-red-400 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add via Call</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* EMPTY STATE: WHEN NO REGISTRATIONS EXIST                   */}
          {/* ========================================================= */}
          {students.length === 0 ? (
            <div className="p-10 sm:p-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4 border border-slate-200 dark:border-slate-700 shadow-xs">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                No student registrations yet.
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                When parents register on the public enrollment page, their submissions and payment receipt screenshots will appear here in real time.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="min-h-[42px] inline-flex items-center gap-2 rounded-xl bg-crimson px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Public Registration</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-95 transition-all"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-amber-500" />
                  <span>+ Add Student via Call</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* MOBILE CARD VIEW (< md: screens)                          */}
              {/* ========================================================= */}
              <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isVerified = student.paymentStatus === "Verified";
                    const isUniformDelivered = student.uniformStatus === "Delivered";

                    return (
                      <div key={student.id} className="p-4 space-y-3 bg-white dark:bg-[#1E293B] hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                        {/* 1. Header: Student Name & Age */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                                {student.studentName}
                              </span>
                              {student.registrationType === "Phone Call" && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 dark:bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40">
                                  <PhoneCall className="h-2.5 w-2.5" />
                                  <span>Call</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {student.age || student.grade}
                              </span>
                              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                                {student.id}
                              </span>
                            </div>
                          </div>

                          {/* 4 & 5. Type & Amount */}
                          <div className="text-right">
                            <span className="font-mono font-black text-amber-700 dark:text-amber-400 text-lg">
                              {student.totalAmount?.toLocaleString()} ETB
                            </span>
                            <div className="flex items-center justify-end gap-1 mt-0.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {student.paymentMethod || "Telebirr / CBE"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 2 & 3. Parent Contact & Emergency Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Parent Name & Phone */}
                          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 p-2.5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                                Parent / Guardian:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white truncate block">
                                {student.parentName}
                              </span>
                            </div>
                            <a
                              href={`tel:${student.parentPhone}`}
                              className="min-h-[36px] inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 hover:underline bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs shrink-0"
                            >
                              <Phone className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                              <span>{student.parentPhone}</span>
                            </a>
                          </div>

                          {/* Emergency Contact */}
                          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 p-2.5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                                Emergency Contact:
                              </span>
                              {student.emergencyPhone && student.emergencyPhone !== "N/A" ? (
                                <a
                                  href={`tel:${student.emergencyPhone}`}
                                  className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300 hover:text-amber-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                                >
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  <span>{student.emergencyPhone}</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">None provided</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 4. Registration Type & Term */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                              student.studentType?.includes("New")
                                ? "bg-purple-50 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/40"
                                : "bg-blue-50 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/40"
                            }`}
                          >
                            {student.studentType || "New Student"}
                          </span>
                          <span className="rounded-md bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                            {student.term || "Term 2"}
                          </span>
                          {student.includeUniform ? (
                            <button
                              type="button"
                              onClick={() => handleToggleUniform(student.id)}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold border flex items-center gap-1 transition-colors ${
                                isUniformDelivered
                                  ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40"
                                  : "bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40"
                              }`}
                            >
                              <Shirt className="h-3 w-3" />
                              <span>Dobok {student.uniformSize} ({student.uniformStatus || "Needed"})</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No Uniform</span>
                          )}
                        </div>

                        {/* 6. Receipt Thumbnail (Clickable) */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 p-3 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptStudent(student)}
                            className="flex items-center gap-3 min-w-0 flex-1 text-left group"
                            title="Tap to preview receipt"
                          >
                            {student.receiptImage ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={student.receiptImage}
                                alt="Receipt Thumbnail"
                                className="h-12 w-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow-xs group-hover:scale-105 group-hover:border-amber-500 transition-all shrink-0"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                <FileText className="h-5 w-5" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-amber-600 transition-colors">
                                {student.receiptImage ? "Receipt Attached" : "No Receipt Image"}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                Tap to inspect payment screenshot
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedReceiptStudent(student)}
                            className="min-h-[36px] px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 flex items-center gap-1.5 shrink-0 shadow-xs"
                          >
                            <Eye className="h-3.5 w-3.5 text-amber-600" />
                            <span>Inspect</span>
                          </button>
                        </div>

                        {/* 7. Registration Date & Verification Status + Action Buttons */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                              {student.displayDate}
                            </span>
                            <div className="mt-0.5">
                              {student.paymentStatus === "Verified" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>Verified (Paid)</span>
                                </span>
                              ) : student.paymentStatus === "Invalid" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-crimson dark:text-red-400 border border-red-300 dark:border-red-500/40">
                                  <XCircle className="h-3 w-3 text-crimson dark:text-red-400" />
                                  <span>Invalid / Flagged</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                                  <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                  <span>Pending</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {student.paymentStatus !== "Verified" ? (
                              <button
                                type="button"
                                onClick={() => handleSetPaymentStatus(student.id, "Verified")}
                                className="min-h-[36px] inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold shadow-xs active:scale-95"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Verify</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPaymentStatus(student.id, "Pending")}
                                className="min-h-[36px] inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 text-xs font-semibold"
                              >
                                <span>Reset</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setStudentToDelete(student)}
                              className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-crimson hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Delete registration"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <Users className="h-8 w-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No student registrations match your filter.
                    </p>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* DESKTOP TABLE VIEW (>= md: screens)                       */}
              {/* ========================================================= */}
              <div className="hidden md:block overflow-x-auto slim-scrollbar">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 font-bold">1. Student Name & Age</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">2. Parent Name & Phone</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">3. Emergency Contact</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">4. Type & Term</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">5. Payment Method & Amount</th>
                      <th scope="col" className="px-4 py-3.5 font-bold">6. Receipt Thumbnail</th>
                      <th scope="col" className="px-4 py-3.5 font-bold text-right">7. Registration Date & Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => {
                        const isUniformDelivered = student.uniformStatus === "Delivered";

                        return (
                          <tr
                            key={student.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            {/* 1. Student Name & Age */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                                  {student.studentName}
                                </span>
                                {student.registrationType === "Phone Call" && (
                                  <span
                                    title="Enrolled via Phone Call"
                                    className="inline-flex items-center gap-0.5 rounded bg-amber-50 dark:bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40"
                                  >
                                    <PhoneCall className="h-2.5 w-2.5" />
                                    <span>Call</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  {student.age || student.grade}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                  {student.id}
                                </span>
                              </div>
                              {student.notes && (
                                <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300 italic">
                                  <FileText className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                                  <span className="truncate max-w-[180px]" title={student.notes}>
                                    {student.notes}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* 2. Parent Name & Phone */}
                            <td className="px-4 py-4">
                              <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                                {student.parentName}
                              </div>
                              <a
                                href={`tel:${student.parentPhone}`}
                                className="inline-flex items-center gap-1.5 mt-1 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 hover:underline hover:text-amber-800 transition-colors"
                                title={`Call parent: ${student.parentPhone}`}
                              >
                                <Phone className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>{student.parentPhone}</span>
                              </a>
                            </td>

                            {/* 3. Emergency Contact */}
                            <td className="px-4 py-4">
                              {student.emergencyPhone && student.emergencyPhone !== "N/A" ? (
                                <a
                                  href={`tel:${student.emergencyPhone}`}
                                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 hover:underline transition-colors"
                                  title={`Call emergency: ${student.emergencyPhone}`}
                                >
                                  <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span>{student.emergencyPhone}</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                                  None provided
                                </span>
                              )}
                            </td>

                            {/* 4. Registration Type & Term */}
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1.5 items-start">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                                      student.studentType?.includes("New")
                                        ? "bg-purple-50 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/40"
                                        : "bg-blue-50 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/40"
                                    }`}
                                  >
                                    {student.studentType || "New Student"}
                                  </span>
                                  <span className="inline-flex rounded-md bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                                    {student.term || "Term 2"}
                                  </span>
                                </div>
                                {student.includeUniform ? (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUniform(student.id)}
                                    title="Toggle Dobok delivery status"
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border transition-colors shadow-xs ${
                                      isUniformDelivered
                                        ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-100"
                                        : "bg-purple-50 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40 hover:bg-purple-100"
                                    }`}
                                  >
                                    <Shirt className="h-3 w-3 shrink-0" />
                                    <span>Dobok {student.uniformSize} ({student.uniformStatus || "Needed"})</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                                    No Uniform
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 5. Payment Method & Amount Paid */}
                            <td className="px-4 py-4">
                              <div className="font-extrabold text-slate-900 dark:text-white font-mono text-sm">
                                {student.totalAmount?.toLocaleString()} ETB
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  <CreditCard className="h-3 w-3 text-amber-500" />
                                  <span>{student.paymentMethod || "Telebirr / CBE"}</span>
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {student.includeUniform ? "10,000 Tuition + 1,500 Dobok" : "10,000 Tuition"}
                              </p>
                            </td>

                            {/* 6. Receipt Thumbnail (Clickable to inspect) */}
                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => setSelectedReceiptStudent(student)}
                                className="group relative flex items-center gap-2.5 focus:outline-none"
                                title="Click to view & inspect receipt proof"
                              >
                                {student.receiptImage ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={student.receiptImage}
                                    alt="Receipt Thumbnail"
                                    className="h-11 w-11 rounded-xl object-cover border-2 border-slate-300 dark:border-slate-700 shadow-xs group-hover:scale-105 group-hover:border-amber-500 transition-all cursor-pointer shrink-0"
                                  />
                                ) : (
                                  <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 shrink-0">
                                    <FileText className="h-5 w-5 text-slate-400" />
                                  </div>
                                )}
                                <div className="text-left">
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 block transition-colors">
                                    {student.receiptImage ? "Inspect" : "No File"}
                                  </span>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                                    <Eye className="h-3 w-3" />
                                    <span>Preview</span>
                                  </span>
                                </div>
                              </button>
                            </td>

                            {/* 7. Registration Date & Verification Status + Actions */}
                            <td className="px-4 py-4 text-right">
                              <div className="flex flex-col items-end gap-1.5">
                                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                  {student.displayDate || "Recent Registration"}
                                </div>
                                <div>
                                  {student.paymentStatus === "Verified" ? (
                                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40">
                                      <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                      <span>Verified</span>
                                    </span>
                                  ) : student.paymentStatus === "Invalid" ? (
                                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-red-50 dark:bg-red-500/20 text-crimson dark:text-red-400 border border-red-300 dark:border-red-500/40">
                                      <XCircle className="h-3 w-3 text-crimson dark:text-red-400" />
                                      <span>Invalid</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                                      <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                      <span>Pending</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 mt-1">
                                  {student.paymentStatus !== "Verified" && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetPaymentStatus(student.id, "Verified")}
                                      title="Mark payment as Verified"
                                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 text-[11px] font-bold transition-all shadow-xs active:scale-95"
                                    >
                                      <Check className="h-3 w-3" />
                                      <span>Verify</span>
                                    </button>
                                  )}
                                  {student.paymentStatus !== "Invalid" && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetPaymentStatus(student.id, "Invalid")}
                                      title="Flag or Reject payment as Invalid"
                                      className="inline-flex items-center gap-1 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-crimson dark:text-red-400 px-2 py-1 text-[11px] font-bold transition-all shadow-xs active:scale-95"
                                    >
                                      <XCircle className="h-3 w-3" />
                                      <span>Flag</span>
                                    </button>
                                  )}
                                  {student.paymentStatus !== "Pending" && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetPaymentStatus(student.id, "Pending")}
                                      title="Reset status to Pending"
                                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 px-1.5 py-1 text-[11px] font-semibold transition-all shadow-xs"
                                    >
                                      <Clock className="h-3 w-3" />
                                      <span>Reset</span>
                                    </button>
                                  )}
                                  {student.paymentStatus === "Pending" && (
                                    <button
                                      type="button"
                                      onClick={() => setReminderStudent(student)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/20 px-2 py-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-all shadow-xs"
                                      title="Send Polite Reminder"
                                    >
                                      <MessageSquare className="h-3 w-3" />
                                      <span>Remind</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setStudentToDelete(student)}
                                    className="inline-flex items-center justify-center rounded-lg p-1 text-slate-400 hover:text-crimson hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ml-0.5"
                                    title="Delete Registration"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                          <Users className="h-8 w-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            No student registrations match your filter.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchTerm("");
                              setFilterPayment("ALL");
                              setFilterUniform("ALL");
                              setFilterAge("ALL");
                              setFilterTerm("ALL");
                            }}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Reset all filters</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Table Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <span>
              Showing {filteredStudents.length} of {students.length} enrolled students
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Master Daniel • Sönnenland International Kindergarten After-School TKD
            </span>
          </div>
        </div>

      </main>

      {/* ========================================================= */}
      {/* 2. POLITE REMINDER GENERATOR MODAL (Dark & Light Mode)     */}
      {/* ========================================================= */}
      {reminderStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-5 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto slim-scrollbar text-slate-900 dark:text-white">
            {/* Close button with 44px touch target */}
            <button
              type="button"
              onClick={() => setReminderStudent(null)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40 shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Polite Reminder Generator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Personalized message for Master Daniel to remind parent
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-3.5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Student:</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                  {reminderStudent.studentName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{reminderStudent.age || reminderStudent.grade}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Parent & Phone:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{reminderStudent.parentName}</p>
                <a
                  href={`tel:${reminderStudent.parentPhone}`}
                  className="text-[11px] font-mono text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Phone className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  {reminderStudent.parentPhone}
                </a>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400">Total Fee Due:</span>
                <p className="font-extrabold text-amber-700 dark:text-amber-400 font-mono text-base mt-0.5">
                  {reminderStudent.totalAmount?.toLocaleString()} ETB
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {reminderStudent.includeUniform ? "10,000 Training + 1,500 Dobok" : "10,000 Training Fee"}
                </p>
                <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/40 inline-block mt-1">
                  Payment Pending
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Generated Message (Editable):
              </label>
              <textarea
                rows={5}
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 shadow-sm"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleCopyReminder}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm flex-1 sm:flex-initial ${
                  isCopiedReminder
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {isCopiedReminder ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>

              <a
                href={`https://t.me/share/url?text=${encodeURIComponent(reminderText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm flex-1 sm:flex-initial"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send via Telegram</span>
                <ExternalLink className="h-3 w-3 opacity-80" />
              </a>

              <a
                href={`sms:${reminderStudent.parentPhone}?body=${encodeURIComponent(reminderText)}`}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm flex-1 sm:flex-initial"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Send via SMS</span>
              </a>

              <button
                type="button"
                onClick={() => setReminderStudent(null)}
                className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ml-auto w-full sm:w-auto"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MANUAL STUDENT ENTRY MODAL (Dark & Light Mode)            */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-5 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto slim-scrollbar text-slate-900 dark:text-white">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setAddFormErrors({});
              }}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/20 text-crimson dark:text-red-400 border border-red-200 dark:border-red-500/30 shrink-0">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Register Student (Phone Call)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manual enrollment entry by Master Daniel for direct phone registrations
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveManualStudent} className="mt-5 space-y-4" noValidate>
              
              {/* Compact Segmented Pills: Student Type & Term Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Student Type <span className="text-crimson">*</span>
                  </label>
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900/90 p-1 border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAddForm((prev) => ({ ...prev, studentType: "New Student", includeUniform: true }))}
                      className={`flex-1 min-h-[42px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        addForm.studentType === "New Student"
                          ? "bg-crimson text-white shadow-md font-extrabold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent"
                      }`}
                    >
                      New Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddForm((prev) => ({ ...prev, studentType: "Returning Student", includeUniform: false }))}
                      className={`flex-1 min-h-[42px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        addForm.studentType === "Returning Student"
                          ? "bg-crimson text-white shadow-md font-extrabold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent"
                      }`}
                    >
                      Returning Student
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Term Selection <span className="text-crimson">*</span>
                  </label>
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900/90 p-1 border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAddForm((prev) => ({ ...prev, term: "Term 2" }))}
                      className={`flex-1 min-h-[42px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        addForm.term === "Term 2"
                          ? "bg-crimson text-white shadow-md font-extrabold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent"
                      }`}
                    >
                      Term 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddForm((prev) => ({ ...prev, term: "Term 3" }))}
                      className={`flex-1 min-h-[42px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        addForm.term === "Term 3"
                          ? "bg-crimson text-white shadow-md font-extrabold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent"
                      }`}
                    >
                      Term 3
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Student Full Name <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Abenezer Getachew"
                      value={addForm.studentName}
                      onChange={(e) => {
                        setAddForm((prev) => ({ ...prev, studentName: e.target.value }));
                        if (addFormErrors.studentName) {
                          setAddFormErrors((prev) => ({ ...prev, studentName: null }));
                        }
                      }}
                      className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900 pl-10 pr-3 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 shadow-sm ${
                        addFormErrors.studentName
                          ? "border-crimson focus:border-crimson focus:ring-crimson"
                          : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                      }`}
                    />
                  </div>
                  {addFormErrors.studentName && (
                    <p className="mt-1 text-[11px] text-crimson font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {addFormErrors.studentName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Age <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <select
                      value={addForm.age || addForm.grade}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          age: e.target.value,
                          grade: e.target.value,
                        }))
                      }
                      className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson shadow-sm"
                    >
                      {AGES.map((a) => (
                        <option key={a} value={a} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Parent / Guardian Name <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Getachew Alemu"
                      value={addForm.parentName}
                      onChange={(e) => {
                        setAddForm((prev) => ({ ...prev, parentName: e.target.value }));
                        if (addFormErrors.parentName) {
                          setAddFormErrors((prev) => ({ ...prev, parentName: null }));
                        }
                      }}
                      className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900 pl-10 pr-3 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 shadow-sm ${
                        addFormErrors.parentName
                          ? "border-crimson focus:border-crimson focus:ring-crimson"
                          : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                      }`}
                    />
                  </div>
                  {addFormErrors.parentName && (
                    <p className="mt-1 text-[11px] text-crimson font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {addFormErrors.parentName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Parent Phone Number <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="0911223344"
                      value={addForm.parentPhone}
                      onChange={(e) => {
                        setAddForm((prev) => ({ ...prev, parentPhone: e.target.value }));
                        if (addFormErrors.parentPhone) {
                          setAddFormErrors((prev) => ({ ...prev, parentPhone: null }));
                        }
                      }}
                      className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900 pl-10 pr-3 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 shadow-sm ${
                        addFormErrors.parentPhone
                          ? "border-crimson focus:border-crimson focus:ring-crimson"
                          : "border-slate-300 dark:border-slate-700 focus:border-crimson focus:ring-crimson"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    e.g., 0911223344 or 0711223344
                  </p>
                  {addFormErrors.parentPhone && (
                    <p className="mt-1 text-[11px] text-crimson font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {addFormErrors.parentPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Emergency Contact & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Emergency Contact Phone <span className="text-slate-500 dark:text-slate-400 text-[11px] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="0911223344"
                      value={addForm.emergencyPhone}
                      onChange={(e) =>
                        setAddForm((prev) => ({ ...prev, emergencyPhone: e.target.value }))
                      }
                      className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:border-crimson focus:ring-crimson shadow-sm"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Secondary contact person
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["Telebirr", "CBE", "Awash Bank", "Cash"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setAddForm((prev) => ({ ...prev, paymentMethod: method }))}
                        className={`min-h-[42px] px-2 py-1.5 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center ${
                          addForm.paymentMethod === method
                            ? "border-crimson bg-crimson text-white shadow-xs font-black"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={addForm.includeUniform}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        includeUniform: e.target.checked,
                      }))
                    }
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-crimson focus:ring-crimson shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Shirt className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        Uniform Requested (Dobok + White Belt)
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-400/40">
                        +1,500 ETB
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Check if student requires official Sönnenland Taekwondo uniform.
                    </p>
                  </div>
                </label>

                {addForm.includeUniform && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1.5">
                      Uniform Size
                    </label>
                    <select
                      value={addForm.uniformSize}
                      onChange={(e) =>
                        setAddForm((prev) => ({ ...prev, uniformSize: e.target.value }))
                      }
                      className="w-full min-h-[44px] rounded-xl border border-amber-300 dark:border-amber-500/50 bg-white dark:bg-slate-900 px-3 py-2 text-base sm:text-sm text-slate-900 dark:text-white focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 shadow-sm"
                    >
                      {UNIFORM_SIZES.map((size) => (
                        <option key={size} value={size} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                          Size {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Initial Payment Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      addForm.paymentStatus === "Pending"
                        ? "border-amber-400 bg-amber-50/70 dark:bg-amber-500/20 text-slate-900 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentStatus"
                      value="Pending"
                      checked={addForm.paymentStatus === "Pending"}
                      onChange={() =>
                        setAddForm((prev) => ({ ...prev, paymentStatus: "Pending" }))
                      }
                      className="text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Pending
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Awaiting bank transfer</p>
                    </div>
                  </label>

                  <label
                    className={`min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      addForm.paymentStatus === "Verified"
                        ? "border-emerald-400 bg-emerald-50/70 dark:bg-emerald-500/20 text-slate-900 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentStatus"
                      value="Verified"
                      checked={addForm.paymentStatus === "Verified"}
                      onChange={() =>
                        setAddForm((prev) => ({ ...prev, paymentStatus: "Verified" }))
                      }
                      className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified / Paid Cash
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Paid directly or confirmed</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Notes / Remarks <span className="text-slate-500 dark:text-slate-400 text-[11px] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Called on Monday, promised CBE transfer by Tuesday morning"
                  value={addForm.notes}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson shadow-sm"
                />
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Calculated Total Fee ({addForm.term || "Term 2"})
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    10,000 Training Fee {addForm.includeUniform ? "+ 1,500 Uniform (Dobok)" : "+ 0 Uniform"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono tracking-tight">
                    {modalTotalFee.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setAddFormErrors({});
                  }}
                  className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-crimson px-6 py-2.5 text-xs font-black text-white shadow-md hover:bg-red-700 active:scale-95 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Save Student</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. RECEIPT SCREENSHOT VIEWER MODAL (Dark & Light Mode)    */}
      {/* ========================================================= */}
      {selectedReceiptStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-5 sm:p-7 shadow-2xl my-8 max-h-[90vh] overflow-y-auto slim-scrollbar text-slate-900 dark:text-white">
            <button
              type="button"
              onClick={() => setSelectedReceiptStudent(null)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40 shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Proof Screenshot / Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedReceiptStudent.studentName} ({selectedReceiptStudent.age || selectedReceiptStudent.grade}) • <span className="font-bold text-amber-700 dark:text-amber-400">{selectedReceiptStudent.term || "Term 2"}</span> • Ref:{" "}
                  <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                    {selectedReceiptStudent.id}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Student & Term:</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedReceiptStudent.studentName}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                    {selectedReceiptStudent.term || "Term 2"}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedReceiptStudent.studentType || (selectedReceiptStudent.includeUniform ? "New" : "Returning")}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400">Parent & Emergency:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedReceiptStudent.parentName}
                </p>
                <a
                  href={`tel:${selectedReceiptStudent.parentPhone}`}
                  className="font-mono text-[11px] text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  <span>{selectedReceiptStudent.parentPhone}</span>
                </a>
                {selectedReceiptStudent.emergencyPhone && selectedReceiptStudent.emergencyPhone !== "N/A" ? (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Emerg: {selectedReceiptStudent.emergencyPhone}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">No emerg. contact</p>
                )}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400">Payment & Method:</span>
                <p className="font-extrabold text-amber-700 dark:text-amber-400 font-mono text-sm mt-0.5">
                  {selectedReceiptStudent.totalAmount?.toLocaleString()} ETB
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedReceiptStudent.paymentMethod || "Telebirr / CBE"}
                  </span>
                </div>
                <div className="mt-1">
                  {selectedReceiptStudent.paymentStatus === "Verified" ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  ) : selectedReceiptStudent.paymentStatus === "Invalid" ? (
                    <span className="text-crimson dark:text-red-400 font-bold flex items-center gap-1 text-[11px]">
                      <XCircle className="h-3.5 w-3.5" />
                      Invalid
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                      <Clock className="h-3.5 w-3.5" />
                      Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Date: {selectedReceiptStudent.displayDate}</span>
                <span>Ref: <strong className="font-mono text-slate-700 dark:text-slate-300">{selectedReceiptStudent.id}</strong></span>
              </div>
            </div>

            {selectedReceiptStudent.notes && (
              <div className="mt-3 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-300">Instructor Note:</span>{" "}
                  {selectedReceiptStudent.notes}
                </div>
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-3 flex flex-col items-center justify-center min-h-[180px] max-h-[300px] overflow-hidden">
              {selectedReceiptStudent.receiptImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedReceiptStudent.receiptImage}
                  alt="Uploaded Payment Receipt Screenshot"
                  className="w-auto h-auto max-h-[280px] rounded-lg object-contain shadow-sm"
                />
              ) : (
                <div className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-center space-y-2 shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      {selectedReceiptStudent.registrationType === "Phone Call"
                        ? "Phone Call Registration Record"
                        : "Mobile Banking / CBE Birr / Telebirr"}
                    </span>
                    <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                      {selectedReceiptStudent.receiptFileName || "Payment Receipt Screenshot"}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Student: <strong>{selectedReceiptStudent.studentName}</strong> • {selectedReceiptStudent.age || selectedReceiptStudent.grade} ({selectedReceiptStudent.studentType || (selectedReceiptStudent.includeUniform ? "New Student" : "Returning Student")})
                    </p>
                  </div>
                  <div className="text-base font-black text-amber-700 dark:text-amber-400 font-mono">
                    {selectedReceiptStudent.totalAmount?.toLocaleString()} ETB
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedReceiptStudent(null)}
                className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>

              {/* Set to Pending if not pending */}
              {selectedReceiptStudent.paymentStatus !== "Pending" && (
                <button
                  type="button"
                  onClick={() => {
                    handleSetPaymentStatus(selectedReceiptStudent.id, "Pending");
                    setSelectedReceiptStudent(null);
                  }}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors active:scale-95"
                >
                  <Clock className="h-4 w-4" />
                  <span>Set Pending</span>
                </button>
              )}

              {/* Flag as Invalid Button */}
              {selectedReceiptStudent.paymentStatus !== "Invalid" && (
                <button
                  type="button"
                  onClick={() => {
                    handleSetPaymentStatus(selectedReceiptStudent.id, "Invalid");
                    setSelectedReceiptStudent(null);
                  }}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-3.5 py-2 text-xs font-bold text-crimson dark:text-red-400 hover:bg-red-100 transition-colors active:scale-95"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Flag as Invalid</span>
                </button>
              )}

              {/* Verify Button */}
              {selectedReceiptStudent.paymentStatus !== "Verified" && (
                <button
                  type="button"
                  onClick={() => {
                    handleSetPaymentStatus(selectedReceiptStudent.id, "Verified");
                    setSelectedReceiptStudent(null);
                  }}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-colors active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve & Verify</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Dark & Light Mode) */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-6 shadow-2xl text-center max-h-[90vh] overflow-y-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/20 text-crimson dark:text-red-400 border border-red-200 dark:border-red-500/30">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              Remove Registration?
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete the registration for{" "}
              <strong className="text-slate-900 dark:text-white">{studentToDelete.studentName}</strong> ({studentToDelete.id})? This action will remove the record from your roster.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                className="min-h-[44px] rounded-xl bg-crimson px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification (Dark & Light Mode) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white shadow-xl animate-fade-in max-w-sm">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0">
            <Check className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="ml-auto min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
}
