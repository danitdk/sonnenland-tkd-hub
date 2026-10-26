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
  Globe
} from "lucide-react";
import Badge from "@/components/Badge";

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
  "100cm",
  "110cm",
  "120cm",
  "130cm",
  "140cm",
  "150cm+",
];

const SEED_REGISTRATIONS = [
  {
    id: "TKD-2026-1042",
    studentName: "Nahom Solomon",
    grade: "Grade 3",
    parentName: "Solomon Haile",
    parentPhone: "0911223344",
    emergencyPhone: "0912345678",
    includeUniform: true,
    uniformSize: "130cm",
    uniformStatus: "Needed",
    tuitionFee: 10000,
    uniformFee: 1500,
    totalAmount: 11500,
    paymentStatus: "Verified",
    receiptImage: null,
    receiptFileName: "cbe_receipt_1042.jpg",
    registeredAt: "2026-10-26T08:30:00Z",
    displayDate: "Oct 26, 2026, 08:30 AM",
    notes: "Paid in advance via CBE Mobile Banking",
  },
  {
    id: "TKD-2026-1043",
    studentName: "Selamawit Tadesse",
    grade: "Grade 4",
    parentName: "Tadesse Bekele",
    parentPhone: "0912445566",
    emergencyPhone: "N/A",
    includeUniform: false,
    uniformSize: "None",
    uniformStatus: "None",
    tuitionFee: 10000,
    uniformFee: 0,
    totalAmount: 10000,
    paymentStatus: "Verified",
    receiptImage: null,
    receiptFileName: "telebirr_tx_445566.png",
    registeredAt: "2026-10-26T09:10:00Z",
    displayDate: "Oct 26, 2026, 09:10 AM",
  },
  {
    id: "TKD-2026-1044",
    studentName: "Ephraim Yohannes",
    grade: "KG2",
    parentName: "Yohannes Girma",
    parentPhone: "0918778899",
    emergencyPhone: "0911002233",
    includeUniform: true,
    uniformSize: "110cm",
    uniformStatus: "Needed",
    tuitionFee: 10000,
    uniformFee: 1500,
    totalAmount: 11500,
    paymentStatus: "Pending",
    receiptImage: null,
    receiptFileName: "awash_app_screenshot.jpg",
    registeredAt: "2026-10-27T10:15:00Z",
    displayDate: "Oct 27, 2026, 10:15 AM",
    notes: "Parent called, requested uniform size 110cm",
  },
  {
    id: "TKD-2026-1045",
    studentName: "Liya Mekonnen",
    grade: "Grade 1",
    parentName: "Mekonnen Tesfaye",
    parentPhone: "0920112233",
    emergencyPhone: "N/A",
    includeUniform: true,
    uniformSize: "120cm",
    uniformStatus: "Delivered",
    tuitionFee: 10000,
    uniformFee: 1500,
    totalAmount: 11500,
    paymentStatus: "Verified",
    receiptImage: null,
    receiptFileName: "cbe_receipt_201122.png",
    registeredAt: "2026-10-27T11:40:00Z",
    displayDate: "Oct 27, 2026, 11:40 AM",
  },
  {
    id: "TKD-2026-1046",
    studentName: "Dawit Abebe",
    grade: "Grade 5",
    parentName: "Abebe Kebede",
    parentPhone: "0911334455",
    emergencyPhone: "0911998877",
    includeUniform: false,
    uniformSize: "None",
    uniformStatus: "None",
    tuitionFee: 10000,
    uniformFee: 0,
    totalAmount: 10000,
    paymentStatus: "Pending",
    receiptImage: null,
    receiptFileName: "telebirr_payment_receipt.jpg",
    registeredAt: "2026-10-28T07:20:00Z",
    displayDate: "Oct 28, 2026, 07:20 AM",
    notes: "Awaiting CBE Birr transfer",
  },
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
  const [filterGrade, setFilterGrade] = useState("ALL");

  const [selectedReceiptStudent, setSelectedReceiptStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    studentName: "",
    grade: "Grade 1",
    parentName: "",
    parentPhone: "",
    includeUniform: false,
    uniformSize: "120cm",
    paymentStatus: "Pending",
    notes: "",
  });
  const [addFormErrors, setAddFormErrors] = useState({});

  const [reminderStudent, setReminderStudent] = useState(null);
  const [reminderLang, setReminderLang] = useState("am");
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sonnenland_registrations");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((item, idx) => ({
            id: item.id || `TKD-2026-${1000 + idx}`,
            studentName: item.studentName || "Unknown Student",
            grade: item.grade || "Grade 1",
            parentName: item.parentName || "Unknown Parent",
            parentPhone: item.parentPhone || "0911000000",
            emergencyPhone: item.emergencyPhone || "N/A",
            includeUniform: Boolean(item.includeUniform),
            uniformSize: item.uniformSize || (item.includeUniform ? "120cm" : "None"),
            uniformStatus:
              item.uniformStatus ||
              (item.includeUniform ? "Needed" : "None"),
            tuitionFee: item.tuitionFee || 10000,
            uniformFee: item.uniformFee || (item.includeUniform ? 1500 : 0),
            totalAmount:
              item.totalAmount ||
              (item.tuitionFee || 10000) + (item.includeUniform ? 1500 : 0),
            paymentStatus:
              item.paymentStatus === "Verified" || item.paymentStatus === "Paid"
                ? "Verified"
                : "Pending",
            receiptImage: item.receiptImage || null,
            receiptFileName: item.receiptFileName || "receipt_screenshot.png",
            registeredAt: item.registeredAt || new Date().toISOString(),
            displayDate: item.displayDate || "Recent Registration",
            notes: item.notes || undefined,
            registrationType: item.registrationType || "Online",
          }));
          setStudents(normalized);
          return;
        }
      }
      setStudents(SEED_REGISTRATIONS);
      localStorage.setItem(
        "sonnenland_registrations",
        JSON.stringify(SEED_REGISTRATIONS)
      );
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
      setStudents(SEED_REGISTRATIONS);
    }
  }, []);

  useEffect(() => {
    if (!reminderStudent) {
      setReminderText("");
      return;
    }
    const total = reminderStudent.totalAmount?.toLocaleString() || "10,000";
    if (reminderLang === "am") {
      setReminderText(
        `ሰላም ${reminderStudent.parentName}፣ የ${reminderStudent.studentName} የሶነንላንድ ቴኳንዶ ምዝገባን በተመለከተ ነው። የልምምድ ቦታውን ለማረጋገጥ እና ዩኒፎርም ለማዘጋጀት የTerm ክፍያ ${total} ብር እስከ ረቡዕ ከቀኑ 9:30 በፊት በCBE ወይም በTelebirr እንዲያጠናቅቁ በአክብሮት እናሳስባለን። ክፍያውን ሲፈጽሙ ደረሰኙን በዚህ ቁጥር ይላኩልን። እናመሰግናለን! - Master Daniel`
      );
    } else {
      setReminderText(
        `Hello ${reminderStudent.parentName}, this is Master Daniel regarding ${reminderStudent.studentName}'s registration for Sonnenland Taekwondo. To secure their spot and prepare their uniform, kindly finalize the term fee of ${total} ETB before Wednesday 3:30 PM. Please share the transfer receipt once completed. Thank you!`
      );
    }
    setIsCopiedReminder(false);
  }, [reminderStudent, reminderLang]);

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
    if (pinInput === "1234") {
      setIsUnlocked(true);
      setPinError("");
      try {
        sessionStorage.setItem("tkd_admin_unlocked", "true");
      } catch (err) {
        console.warn(err);
      }
    } else {
      setPinError("Incorrect PIN. Please enter Master Daniel's 4-digit code (Default: 1234).");
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

  const handleTogglePayment = (studentId) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        const nextStatus = s.paymentStatus === "Verified" ? "Pending" : "Verified";
        return { ...s, paymentStatus: nextStatus };
      }
      return s;
    });
    persistStudents(updated);

    if (selectedReceiptStudent?.id === studentId) {
      setSelectedReceiptStudent((prev) => ({
        ...prev,
        paymentStatus: prev.paymentStatus === "Verified" ? "Pending" : "Verified",
      }));
    }
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
      grade: addForm.grade,
      parentName: addForm.parentName.trim(),
      parentPhone: addForm.parentPhone.trim(),
      emergencyPhone: "N/A",
      includeUniform: addForm.includeUniform,
      uniformSize: addForm.includeUniform ? addForm.uniformSize : "None",
      uniformStatus: addForm.includeUniform ? "Needed" : "None",
      tuitionFee: 10000,
      uniformFee: addForm.includeUniform ? 1500 : 0,
      totalAmount,
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
      grade: "Grade 1",
      parentName: "",
      parentPhone: "",
      includeUniform: false,
      uniformSize: "120cm",
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
      s.id.toLowerCase().includes(term);

    const matchesPayment =
      filterPayment === "ALL" || s.paymentStatus === filterPayment;

    let matchesUniform = true;
    if (filterUniform === "Needed") {
      matchesUniform = s.includeUniform && s.uniformStatus === "Needed";
    } else if (filterUniform === "Delivered") {
      matchesUniform = s.includeUniform && s.uniformStatus === "Delivered";
    }

    let matchesGrade = true;
    if (filterGrade === "KG") {
      matchesGrade = s.grade.startsWith("KG");
    } else if (filterGrade !== "ALL") {
      matchesGrade = s.grade === filterGrade;
    }

    return matchesSearch && matchesPayment && matchesUniform && matchesGrade;
  });

  const handleExportCSV = () => {
    const headers = [
      "Student Name",
      "Grade",
      "Parent Name",
      "Parent Phone",
      "Fee Amount (ETB)",
      "Payment Status",
      "Uniform Selection",
      "Uniform Size",
      "Registration Date",
    ];

    const rows = filteredStudents.map((s) => [
      `"${(s.studentName || "").replace(/"/g, '""')}"`,
      `"${s.grade || ""}"`,
      `"${(s.parentName || "").replace(/"/g, '""')}"`,
      `"${s.parentPhone || ""}"`,
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
  const uniformsNeededCount = students.filter(
    (s) => s.includeUniform && s.uniformStatus === "Needed"
  ).length;

  const modalTotalFee = 10000 + (addForm.includeUniform ? 1500 : 0);

  if (!hasCheckedSession) {
    return <div className="min-h-screen bg-background-deep" />;
  }

  // =========================================================
  // SECURITY PIN PROTECTION GATE
  // =========================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-deep px-4 py-8 selection:bg-crimson selection:text-white">
        <div className="relative w-full max-w-md rounded-3xl border-2 border-surface-border bg-surface-card p-6 sm:p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-crimson to-crimson-dark shadow-glow-crimson border border-crimson/40">
            <KeyRound className="h-8 w-8 text-white" />
          </div>

          <h2 className="mt-5 text-2xl font-black text-white tracking-tight">
            Instructor Portal
          </h2>
          <p className="mt-1 text-sm font-semibold text-gold">
            Master Daniel • Sonnenland International School
          </p>
          <p className="mt-2 text-xs text-gray-400">
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
                className="w-full min-h-[48px] text-center text-3xl font-mono tracking-[0.5em] rounded-2xl border border-surface-border bg-background-deep px-4 py-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {pinError && (
              <p className="flex items-center justify-center gap-1.5 text-xs text-crimson-light font-medium animate-fade-in">
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
                      if (next.length === 4 && next === "1234") {
                        setIsUnlocked(true);
                        sessionStorage.setItem("tkd_admin_unlocked", "true");
                      }
                    }
                  }}
                  className="min-h-[48px] rounded-xl border border-surface-border bg-background-deep py-3 text-lg font-bold text-gray-200 hover:border-gold hover:text-gold hover:bg-surface-elevated active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPinInput("")}
                className="min-h-[48px] rounded-xl border border-surface-border bg-background-deep py-3 text-xs font-semibold text-gray-400 hover:text-white active:scale-95"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pinInput.length < 4) {
                    const next = pinInput + "0";
                    setPinInput(next);
                    if (next.length === 4 && next === "1234") {
                      setIsUnlocked(true);
                      sessionStorage.setItem("tkd_admin_unlocked", "true");
                    }
                  }
                }}
                className="min-h-[48px] rounded-xl border border-surface-border bg-background-deep py-3 text-lg font-bold text-gray-200 hover:border-gold hover:text-gold hover:bg-surface-elevated active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                className="min-h-[48px] rounded-xl border border-surface-border bg-background-deep py-3 text-sm font-semibold text-crimson-light hover:bg-crimson/15 active:scale-95"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark px-6 py-3.5 text-sm font-extrabold text-white shadow-glow-crimson hover:brightness-110 active:scale-95 transition-all"
            >
              <Unlock className="h-4 w-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-1.5 text-[11px] text-gray-300 border border-surface-border">
            <Lock className="h-3 w-3 text-gold" />
            <span>Default PIN: <strong className="text-gold font-mono">1234</strong></span>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border">
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
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
  // UNLOCKED INSTRUCTOR DASHBOARD VIEW
  // =========================================================
  return (
    <div className="min-h-screen bg-background-deep text-gray-100 flex flex-col selection:bg-crimson selection:text-white overflow-x-hidden">
      
      {/* 1. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-surface-border bg-background-rich/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-card px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:border-gold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Public Registration</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="h-5 w-[1px] bg-surface-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-crimson shadow-glow-crimson shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black text-white leading-tight truncate">
                  Instructor Portal — Master Daniel
                </h1>
                <p className="text-[11px] text-gray-400 hidden sm:block">Sonnenland International School (SIS)</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Export CSV button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-card px-3 py-2 text-xs font-bold text-gray-200 hover:border-emerald-500 hover:text-emerald-400 hover:bg-surface-elevated transition-all"
              title="Export filtered roster to CSV for Director Betty"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* + Add Student (Phone Call) */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-3 py-2 sm:px-4 sm:py-2 text-xs font-black text-gray-950 shadow-glow-gold hover:brightness-110 active:scale-95 transition-all"
            >
              <PhoneCall className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">+ Add Student</span>
            </button>

            {/* Lock button */}
            <button
              type="button"
              onClick={handleLock}
              title="Lock Admin Session"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-surface-border bg-surface-card p-2 text-xs font-semibold text-gray-300 hover:text-crimson-light hover:border-crimson/40 transition-colors"
            >
              <Lock className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-5 sm:px-6 lg:px-8 space-y-6">

        {/* 2. SUMMARY METRIC KPI CARDS */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          
          <div className="rounded-2xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-card transition-all hover:border-crimson/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Enrolled
              </span>
              <div className="rounded-xl bg-crimson/15 p-2 text-crimson-light border border-crimson/30">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-4xl font-black text-white">
                {totalStudents}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400">Students</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400 truncate">KG1 to Grade 5</p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-card transition-all hover:border-emerald-500/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Verified (ETB)
              </span>
              <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-emerald-400 font-mono truncate block">
                {verifiedPaymentsETB.toLocaleString()} ETB
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              {students.filter((s) => s.paymentStatus === "Verified").length} confirmed
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-card transition-all hover:border-gold/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Pending (ETB)
              </span>
              <div className="rounded-xl bg-gold/15 p-2 text-gold border border-gold/30">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-gold font-mono truncate block">
                {pendingPaymentsETB.toLocaleString()} ETB
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              {students.filter((s) => s.paymentStatus === "Pending").length} awaiting
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-card transition-all hover:border-purple-500/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Uniforms Needed
              </span>
              <div className="rounded-xl bg-purple-500/15 p-2 text-purple-400 border border-purple-500/30">
                <Shirt className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-4xl font-black text-purple-300">
                {uniformsNeededCount}
              </span>
              <span className="text-[11px] font-semibold text-purple-400">To Deliver</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400 truncate">Official Dobok sets</p>
          </div>

        </div>

        {/* 3. FILTER & SEARCH CONTROLS */}
        <div className="rounded-2xl border border-surface-border bg-surface-card p-4 shadow-card">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or parent phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-surface-border bg-background-deep pl-10 pr-9 py-2.5 text-base sm:text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="min-h-[44px] rounded-xl border border-surface-border bg-background-deep px-3 py-2 text-xs font-medium text-white focus:border-gold focus:outline-none"
              >
                <option value="ALL">Payment: All</option>
                <option value="Verified">Verified (Paid)</option>
                <option value="Pending">Pending</option>
              </select>

              <select
                value={filterUniform}
                onChange={(e) => setFilterUniform(e.target.value)}
                className="min-h-[44px] rounded-xl border border-surface-border bg-background-deep px-3 py-2 text-xs font-medium text-white focus:border-gold focus:outline-none"
              >
                <option value="ALL">Uniform: All</option>
                <option value="Needed">Needed</option>
                <option value="Delivered">Delivered</option>
              </select>

              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="min-h-[44px] col-span-2 sm:col-span-1 rounded-xl border border-surface-border bg-background-deep px-3 py-2 text-xs font-medium text-white focus:border-gold focus:outline-none"
              >
                <option value="ALL">All Grades</option>
                <option value="KG">Kindergarten (KG1/KG2)</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
              </select>
            </div>

          </div>
        </div>

        {/* 4. STUDENTS DATA DISPLAY */}
        <div className="rounded-2xl border border-surface-border bg-surface-card shadow-card overflow-hidden">
          
          <div className="p-4 border-b border-surface-border flex items-center justify-between bg-background-rich">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Enrollment Roster</h2>
              <span className="rounded-md bg-background-deep px-2 py-0.5 text-xs font-mono font-semibold text-gold border border-surface-border">
                {filteredStudents.length} Students
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                Swipe horizontally or tap cards to manage
              </span>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="min-h-[36px] inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add via Call</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MOBILE CARD VIEW (< md: screens)                          */}
          {/* ========================================================= */}
          <div className="md:hidden divide-y divide-surface-border">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isVerified = student.paymentStatus === "Verified";
                const isUniformDelivered = student.uniformStatus === "Delivered";

                return (
                  <div key={student.id} className="p-4 space-y-3 bg-surface-card hover:bg-surface-elevated/30 transition-colors">
                    {/* Header Row: Student Name, Grade & ID */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-white text-base">
                            {student.studentName}
                          </span>
                          {student.registrationType === "Phone Call" && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold text-gold border border-gold/30">
                              <PhoneCall className="h-2.5 w-2.5" />
                              <span>Call</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-gray-200 border border-surface-border">
                            {student.grade}
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            {student.id}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-black text-gold text-lg">
                          {student.totalAmount?.toLocaleString()} ETB
                        </span>
                      </div>
                    </div>

                    {/* Parent Contact Card (min-h-[44px] touch target) */}
                    <div className="rounded-xl border border-surface-border bg-background-deep p-3 flex items-center justify-between gap-2">
                      <div className="text-xs truncate">
                        <span className="text-gray-400">Parent: </span>
                        <span className="font-bold text-white">{student.parentName}</span>
                      </div>
                      <a
                        href={`tel:${student.parentPhone}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gold hover:underline bg-surface-card px-3 py-1.5 rounded-lg border border-surface-border shrink-0"
                      >
                        <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span>{student.parentPhone}</span>
                      </a>
                    </div>

                    {/* Notes if present */}
                    {student.notes && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-300/95 italic bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        <FileText className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span className="truncate">{student.notes}</span>
                      </div>
                    )}

                    {/* Status & Action Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Payment Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePayment(student.id)}
                        className={`min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border shadow-sm active:scale-95 ${
                          isVerified
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                            : "bg-gold/15 text-gold border-gold/40"
                        }`}
                      >
                        {isVerified ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>

                      {/* Reminder Button if Pending */}
                      {!isVerified ? (
                        <button
                          type="button"
                          onClick={() => {
                            setReminderStudent(student);
                            setReminderLang("am");
                          }}
                          className="min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-gray-950 active:scale-95 transition-all"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Send Reminder</span>
                        </button>
                      ) : (
                        /* Uniform Toggle if Verified */
                        student.includeUniform ? (
                          <button
                            type="button"
                            onClick={() => handleToggleUniform(student.id)}
                            className={`min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold border active:scale-95 transition-colors ${
                              isUniformDelivered
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                                : "bg-purple-500/15 text-purple-300 border-purple-500/40"
                            }`}
                          >
                            <Shirt className="h-4 w-4 shrink-0" />
                            <span className="truncate">{student.uniformSize} – {isUniformDelivered ? "Delivered" : "Needed"}</span>
                          </button>
                        ) : (
                          <div className="min-h-[44px] flex items-center justify-center text-xs text-gray-500 italic rounded-xl border border-surface-border bg-background-deep">
                            No Uniform
                          </div>
                        )
                      )}
                    </div>

                    {/* Secondary Actions Row */}
                    <div className="flex items-center justify-between pt-1 text-xs border-t border-surface-border/60">
                      <button
                        type="button"
                        onClick={() => setSelectedReceiptStudent(student)}
                        className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-gray-200 hover:text-gold"
                      >
                        <Eye className="h-4 w-4 text-gold shrink-0" />
                        <span>View Proof / Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudentToDelete(student)}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-gray-400 hover:text-crimson-light active:scale-95"
                        title="Delete registration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-300">
                  No student registrations match your filter.
                </p>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* DESKTOP TABLE VIEW (>= md: screens)                       */}
          {/* ========================================================= */}
          <div className="hidden md:block overflow-x-auto slim-scrollbar">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-background-deep/70 uppercase tracking-wider text-[11px] text-gray-400 border-b border-surface-border">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-bold">1. Student & Grade</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">2. Parent & Phone</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">3. Total Fee</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">4. Payment Status & Reminder</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">5. Uniform</th>
                  <th scope="col" className="px-5 py-3.5 font-bold text-center">6. Proof Receipt</th>
                  <th scope="col" className="px-5 py-3.5 font-bold text-right">7. Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isVerified = student.paymentStatus === "Verified";
                    const isUniformDelivered = student.uniformStatus === "Delivered";

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-surface-elevated/40 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">
                              {student.studentName}
                            </span>
                            {student.registrationType === "Phone Call" && (
                              <span
                                title="Enrolled via Phone Call"
                                className="inline-flex items-center gap-1 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold text-gold border border-gold/30"
                              >
                                <PhoneCall className="h-2.5 w-2.5" />
                                <span>Call</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex rounded-md bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-gray-200 border border-surface-border">
                              {student.grade}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400">
                              {student.id}
                            </span>
                          </div>
                          {student.notes && (
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-300/90 italic">
                              <FileText className="h-3 w-3 shrink-0" />
                              <span className="truncate max-w-[200px]" title={student.notes}>
                                Note: {student.notes}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-white">{student.parentName}</div>
                          <a
                            href={`tel:${student.parentPhone}`}
                            className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-mono text-gold hover:underline hover:text-gold-light transition-colors"
                            title={`Call parent: ${student.parentPhone}`}
                          >
                            <Phone className="h-3 w-3 text-gold shrink-0" />
                            <span>{student.parentPhone}</span>
                          </a>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-extrabold text-white font-mono text-sm">
                            {student.totalAmount?.toLocaleString()} ETB
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {student.includeUniform ? "10,000 + 1,500 Dobok" : "10,000 Tuition"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleTogglePayment(student.id)}
                              title="Click to toggle Payment Status"
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all border shadow-sm ${
                                isVerified
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25"
                                  : "bg-gold/15 text-gold border-gold/40 hover:bg-gold/25"
                              }`}
                            >
                              {isVerified ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Verified</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Pending</span>
                                </>
                              )}
                            </button>

                            {!isVerified && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReminderStudent(student);
                                  setReminderLang("am");
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500 hover:text-gray-950 transition-all shadow-sm"
                                title="Open Polite Reminder Generator Modal"
                              >
                                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                                <span>Send Reminder</span>
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {student.includeUniform ? (
                            <button
                              type="button"
                              onClick={() => handleToggleUniform(student.id)}
                              title="Click to toggle Delivery Status"
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                                isUniformDelivered
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25"
                                  : "bg-purple-500/15 text-purple-300 border-purple-500/40 hover:bg-purple-500/25"
                              }`}
                            >
                              <Shirt className="h-3 w-3" />
                              <span>
                                {student.uniformSize} – {isUniformDelivered ? "Delivered" : "Needed"}
                              </span>
                            </button>
                          ) : (
                            <span className="text-gray-500 italic text-[11px]">
                              No Uniform
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptStudent(student)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated px-2.5 py-1.5 text-[11px] font-semibold text-gray-200 hover:border-gold hover:text-gold transition-colors"
                            title="View receipt proof or details"
                          >
                            <Eye className="h-3.5 w-3.5 text-gold" />
                            <span>Proof</span>
                          </button>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setStudentToDelete(student)}
                            className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:text-crimson-light hover:bg-crimson/15 transition-colors"
                            title="Delete Registration"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                      <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-300">
                        No student registrations match your filter.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterPayment("ALL");
                          setFilterUniform("ALL");
                          setFilterGrade("ALL");
                        }}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
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

          {/* Table Footer */}
          <div className="p-4 border-t border-surface-border bg-background-rich flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
            <span>
              Showing {filteredStudents.length} of {students.length} enrolled students
            </span>
            <span className="text-gray-300">
              Master Daniel • Sonnenland International School Taekwondo Program
            </span>
          </div>
        </div>

      </main>

      {/* ========================================================= */}
      {/* 2. POLITE REMINDER GENERATOR MODAL                        */}
      {/* ========================================================= */}
      {reminderStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border-2 border-gold/40 bg-surface-card p-5 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto slim-scrollbar">
            {/* Close button with 44px touch target */}
            <button
              type="button"
              onClick={() => setReminderStudent(null)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-surface-elevated hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-glow-gold shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Polite Reminder Generator
                </h3>
                <p className="text-xs text-gray-300">
                  Personalized message for Master Daniel to remind parent
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-surface-border bg-background-deep p-3.5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-400">Student:</span>
                <p className="font-extrabold text-white text-sm mt-0.5">
                  {reminderStudent.studentName}
                </p>
                <p className="text-[11px] text-gray-400">{reminderStudent.grade}</p>
              </div>
              <div>
                <span className="text-gray-400">Parent & Phone:</span>
                <p className="font-bold text-white mt-0.5">{reminderStudent.parentName}</p>
                <a
                  href={`tel:${reminderStudent.parentPhone}`}
                  className="text-[11px] font-mono text-gold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Phone className="h-3 w-3 text-gold" />
                  {reminderStudent.parentPhone}
                </a>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Total Fee Due:</span>
                <p className="font-extrabold text-gold font-mono text-base mt-0.5">
                  {reminderStudent.totalAmount?.toLocaleString()} ETB
                </p>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Payment Pending
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gold" />
                Select Language:
              </span>
              <div className="inline-flex rounded-xl border border-surface-border bg-background-deep p-1">
                <button
                  type="button"
                  onClick={() => setReminderLang("am")}
                  className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    reminderLang === "am"
                      ? "bg-gold text-gray-950 shadow-glow-gold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  አማርኛ (Amharic)
                </button>
                <button
                  type="button"
                  onClick={() => setReminderLang("en")}
                  className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    reminderLang === "en"
                      ? "bg-gold text-gray-950 shadow-glow-gold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">
                Generated Message (Editable):
              </label>
              <textarea
                rows={5}
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                className="w-full rounded-2xl border border-surface-border bg-background-deep p-3.5 text-xs sm:text-sm text-gray-100 leading-relaxed focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={handleCopyReminder}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm flex-1 sm:flex-initial ${
                  isCopiedReminder
                    ? "bg-emerald-500 text-white"
                    : "border border-surface-border bg-surface-elevated text-white hover:border-gold hover:text-gold"
                }`}
              >
                {isCopiedReminder ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-gold" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>

              <a
                href={`https://t.me/share/url?text=${encodeURIComponent(reminderText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-sm flex-1 sm:flex-initial"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send via Telegram</span>
                <ExternalLink className="h-3 w-3 opacity-80" />
              </a>

              <a
                href={`sms:${reminderStudent.parentPhone}?body=${encodeURIComponent(reminderText)}`}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm flex-1 sm:flex-initial"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Send via SMS</span>
              </a>

              <button
                type="button"
                onClick={() => setReminderStudent(null)}
                className="min-h-[44px] rounded-xl border border-surface-border bg-background-deep px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors ml-auto w-full sm:w-auto"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MANUAL STUDENT ENTRY MODAL                                */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border-2 border-gold/40 bg-surface-card p-5 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto slim-scrollbar">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setAddFormErrors({});
              }}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-surface-elevated hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-gray-950 shadow-glow-gold shrink-0">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Register Student (Phone Call)
                </h3>
                <p className="text-xs text-gray-300">
                  Manual enrollment entry by Master Daniel for direct phone registrations
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveManualStudent} className="mt-5 space-y-4" noValidate>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Student Full Name <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
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
                      className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-3 py-2.5 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 ${
                        addFormErrors.studentName
                          ? "border-crimson focus:border-crimson focus:ring-crimson"
                          : "border-surface-border focus:border-gold focus:ring-gold"
                      }`}
                    />
                  </div>
                  {addFormErrors.studentName && (
                    <p className="mt-1 text-[11px] text-crimson-light font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {addFormErrors.studentName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Grade / Class Level <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <select
                      value={addForm.grade}
                      onChange={(e) =>
                        setAddForm((prev) => ({ ...prev, grade: e.target.value }))
                      }
                      className="w-full min-h-[44px] rounded-xl border border-surface-border bg-background-deep pl-10 pr-3 py-2.5 text-base sm:text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g} className="bg-surface-card text-white">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Parent / Guardian Full Name <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
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
                      className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-3 py-2.5 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 ${
                        addFormErrors.parentName
                          ? "border-crimson focus:border-crimson focus:ring-crimson"
                          : "border-surface-border focus:border-gold focus:ring-gold"
                      }`}
                    />
                  </div>
                  {addFormErrors.parentName && (
                    <p className="mt-1 text-[11px] text-crimson-light font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {addFormErrors.parentName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Parent Phone Number <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400" />
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
                      className={`w-full min-h-[44px] rounded-xl border bg-background-deep pl-10 pr-3 py-2.5 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 ${
                        addFormErrors.parentPhone
                          ? "border-crimson focus:border-crimson focus:ring-crimson"
                          : "border-surface-border focus:border-gold focus:ring-gold"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    e.g., 0911223344 or 0711223344
                  </p>
                  {addFormErrors.parentPhone && (
                    <p className="mt-1 text-[11px] text-crimson-light font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {addFormErrors.parentPhone}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-surface-border bg-background-deep p-4 space-y-3">
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
                    className="mt-1 h-5 w-5 rounded border-surface-border bg-surface-card text-gold focus:ring-gold shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Shirt className="h-3.5 w-3.5 text-gold" />
                        Uniform Requested (Dobok + White Belt)
                      </span>
                      <span className="text-[11px] font-extrabold text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                        +1,500 ETB
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Check if student requires official SIS Taekwondo uniform.
                    </p>
                  </div>
                </label>

                {addForm.includeUniform && (
                  <div className="pt-3 border-t border-surface-border/60 animate-fade-in">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gold mb-1.5">
                      Uniform Size
                    </label>
                    <select
                      value={addForm.uniformSize}
                      onChange={(e) =>
                        setAddForm((prev) => ({ ...prev, uniformSize: e.target.value }))
                      }
                      className="w-full min-h-[44px] rounded-xl border border-gold/40 bg-surface-card px-3 py-2 text-base sm:text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    >
                      {UNIFORM_SIZES.map((size) => (
                        <option key={size} value={size} className="bg-surface-card text-white">
                          Size {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Initial Payment Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      addForm.paymentStatus === "Pending"
                        ? "border-gold bg-gold/10 text-white"
                        : "border-surface-border bg-background-deep text-gray-400 hover:text-white"
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
                      className="text-gold focus:ring-gold h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-gold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Pending
                      </div>
                      <p className="text-[10px] text-gray-400">Awaiting bank transfer</p>
                    </div>
                  </label>

                  <label
                    className={`min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      addForm.paymentStatus === "Verified"
                        ? "border-emerald-500 bg-emerald-500/10 text-white"
                        : "border-surface-border bg-background-deep text-gray-400 hover:text-white"
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
                      className="text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified / Paid Cash
                      </div>
                      <p className="text-[10px] text-gray-400">Paid directly or confirmed</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Notes / Remarks <span className="text-gray-400 text-[11px] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Called on Monday, promised CBE transfer by Tuesday morning"
                  value={addForm.notes}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full rounded-xl border border-surface-border bg-background-deep px-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="rounded-xl border border-surface-border bg-background-deep p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Calculated Total Fee
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    10,000 Tuition {addForm.includeUniform ? "+ 1,500 Uniform" : "+ 0 Uniform"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-gold font-mono tracking-tight">
                    {modalTotalFee.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setAddFormErrors({});
                  }}
                  className="min-h-[44px] rounded-xl border border-surface-border bg-background-deep px-5 py-2.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-2.5 text-xs font-black text-gray-950 shadow-glow-gold hover:brightness-105 active:scale-95 transition-all"
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
      {/* 5. RECEIPT SCREENSHOT VIEWER MODAL                        */}
      {/* ========================================================= */}
      {selectedReceiptStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-gold/40 bg-surface-card p-5 sm:p-7 shadow-2xl my-8 max-h-[90vh] overflow-y-auto slim-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedReceiptStudent(null)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-surface-elevated hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold border border-gold/40 shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Payment Proof Screenshot / Details
                </h3>
                <p className="text-xs text-gray-300">
                  {selectedReceiptStudent.studentName} ({selectedReceiptStudent.grade}) • Ref:{" "}
                  <span className="font-mono text-gold font-bold">
                    {selectedReceiptStudent.id}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-background-deep p-3 rounded-xl border border-surface-border">
              <div>
                <span className="text-gray-400">Total Payable:</span>
                <p className="font-extrabold text-gold font-mono text-sm mt-0.5">
                  {selectedReceiptStudent.totalAmount?.toLocaleString()} ETB
                </p>
              </div>
              <div>
                <span className="text-gray-400">Current Status:</span>
                <p className="mt-0.5 font-bold">
                  {selectedReceiptStudent.paymentStatus === "Verified" ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-gold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Pending Approval
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Parent Contact:</span>
                <p className="font-medium text-white mt-0.5">
                  {selectedReceiptStudent.parentName} ({selectedReceiptStudent.parentPhone})
                </p>
              </div>
              <div>
                <span className="text-gray-400">Submission Date:</span>
                <p className="font-medium text-white mt-0.5">
                  {selectedReceiptStudent.displayDate}
                </p>
              </div>
            </div>

            {selectedReceiptStudent.notes && (
              <div className="mt-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 flex items-start gap-2">
                <FileText className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gold">Instructor Note:</span>{" "}
                  {selectedReceiptStudent.notes}
                </div>
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-surface-border bg-background-deep p-3 flex flex-col items-center justify-center min-h-[180px] max-h-[300px] overflow-hidden">
              {selectedReceiptStudent.receiptImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedReceiptStudent.receiptImage}
                  alt="Uploaded Payment Receipt Screenshot"
                  className="w-auto h-auto max-h-[280px] rounded-lg object-contain"
                />
              ) : (
                <div className="w-full rounded-xl border border-surface-border bg-gradient-to-br from-background-rich to-background-deep p-4 text-center space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-surface-card border border-gold/40 text-gold">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {selectedReceiptStudent.registrationType === "Phone Call"
                        ? "Phone Call Registration Record"
                        : "Mobile Banking / CBE Birr / Telebirr"}
                    </span>
                    <h4 className="mt-1 text-xs font-bold text-white font-mono">
                      Ref: {selectedReceiptStudent.receiptFileName || "DIRECT-RECORD"}
                    </h4>
                    <p className="text-[11px] text-gray-300">
                      Student: <strong>{selectedReceiptStudent.studentName}</strong> • {selectedReceiptStudent.grade}
                    </p>
                  </div>
                  <div className="text-base font-black text-gold font-mono">
                    {selectedReceiptStudent.totalAmount?.toLocaleString()} ETB
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setSelectedReceiptStudent(null)}
                className="w-full sm:w-auto min-h-[44px] rounded-xl border border-surface-border bg-background-deep px-5 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Close
              </button>

              {selectedReceiptStudent.paymentStatus !== "Verified" ? (
                <button
                  type="button"
                  onClick={() => {
                    handleTogglePayment(selectedReceiptStudent.id);
                    setSelectedReceiptStudent(null);
                  }}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md transition-colors active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve Payment (Mark Verified)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleTogglePayment(selectedReceiptStudent.id);
                    setSelectedReceiptStudent(null);
                  }}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-5 py-2 text-xs font-bold text-gold hover:bg-gold hover:text-gray-950 transition-colors active:scale-95"
                >
                  <Clock className="h-4 w-4" />
                  <span>Revert to Pending</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-surface-border bg-surface-card p-6 shadow-2xl text-center max-h-[90vh] overflow-y-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/20 text-crimson-light border border-crimson/40">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-white">
              Remove Registration?
            </h3>
            <p className="mt-2 text-xs text-gray-300">
              Are you sure you want to delete the registration for{" "}
              <strong className="text-white">{studentToDelete.studentName}</strong> ({studentToDelete.id})? This action will remove the record from your roster.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="min-h-[44px] rounded-xl border border-surface-border bg-background-deep px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                className="min-h-[44px] rounded-xl bg-crimson px-5 py-2 text-xs font-bold text-white hover:bg-crimson-dark transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-surface-card px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-black/80 animate-fade-in max-w-sm">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white shrink-0">
            <Check className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="ml-auto min-w-[32px] min-h-[32px] flex items-center justify-center text-gray-400 hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
}
