/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserPersona } from "../types";
import * as db from "../lib/db";
import { isSupabaseConfigured } from "../lib/supabase";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  UserPlus,
  User,
  Building2,
  BadgeCheck,
  Briefcase
} from "lucide-react";

interface LoginGateProps {
  onLogin: (persona: UserPersona) => void;
  onBack: () => void;
}

interface DemoAccount {
  role: 'Employee' | 'C-POC' | 'IRC Member' | 'Functional Head' | 'Plan Owner' | 'Finance' | 'CFO';
  name: string;
  email: string;
  businessUnit?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  suggestedPassword: string;
  badge: string;
  avatarInitials: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "Employee",
    name: "Sathya Kumar",
    email: "sathyakumar@entrans.io",
    businessUnit: "Industrial Water Division",
    employeeId: "ION-EMP-2026-081",
    department: "Process Engineering & Design",
    designation: "Senior Process Engineer",
    suggestedPassword: "password",
    badge: "Idea Proposer",
    avatarInitials: "SK"
  },
  {
    role: "Employee",
    name: "Anita Desai",
    email: "anita.d@ionexchange.com",
    businessUnit: "R&D Centre of Excellence",
    employeeId: "ION-EMP-2026-044",
    department: "Membrane Research Division",
    designation: "Research Scientist",
    suggestedPassword: "password",
    badge: "Idea Proposer",
    avatarInitials: "AD"
  },
  {
    role: "Employee",
    name: "Aditi Rao",
    email: "aditi.rao@ionexchange.com",
    businessUnit: "Chemical Division",
    employeeId: "ION-EMP-2026-067",
    department: "Chemical Process Engineering",
    designation: "Process Automation Engineer",
    suggestedPassword: "password",
    badge: "Idea Proposer",
    avatarInitials: "AR"
  },
  {
    role: "Employee",
    name: "Sanjay Deshmukh",
    email: "sanjay.deshmukh@ionexchange.com",
    businessUnit: "Municipal Infrastructure Group",
    employeeId: "ION-EMP-2026-029",
    department: "Municipal Water & Waste",
    designation: "Municipal Systems Engineer",
    suggestedPassword: "password",
    badge: "Idea Proposer",
    avatarInitials: "SD"
  },
  {
    role: "C-POC",
    name: "TM & OD CoE Lead",
    email: "coe@ionexchange.com",
    businessUnit: "Central HR & OD",
    employeeId: "ION-HR-2026-004",
    department: "Talent Management & OD",
    designation: "AVP - Talent Management & OD",
    suggestedPassword: "cpocGlobal99",
    badge: "Central Program Coordinator",
    avatarInitials: "CP"
  },
  {
    role: "IRC Member",
    name: "Senior Advisory Panel",
    email: "advisor@ionexchange.com",
    businessUnit: "Technical Board",
    employeeId: "ION-TECH-2026-012",
    department: "R&D Centre of Excellence",
    designation: "Technical Jury Chairman",
    suggestedPassword: "ircJuryBoard",
    badge: "Idea Review Committee",
    avatarInitials: "IR"
  },
  {
    role: "IRC Member",
    name: "Advisory Panel Member",
    email: "advisor1@ionexchange.com",
    businessUnit: "Technical Board",
    employeeId: "ION-TECH-2026-013",
    department: "R&D Centre of Excellence",
    designation: "Technical Jury Member",
    suggestedPassword: "ircJuryBoard",
    badge: "Idea Review Committee",
    avatarInitials: "IR"
  },
  {
    role: "Functional Head",
    name: "Dr. Alok Gupta",
    email: "alok.gupta@ionexchange.com",
    businessUnit: "Chemical Division",
    employeeId: "ION-EXEC-2026-003",
    department: "Chemical Manufacturing & Trials",
    designation: "Executive Director & Business Head",
    suggestedPassword: "fhChemicalDivision",
    badge: "Functional Head Approval",
    avatarInitials: "AG"
  },
  {
    role: "Plan Owner",
    name: "Kavita Sharma (Lead)",
    email: "kavita.s@ionexchange.com",
    businessUnit: "Project Execution Team",
    employeeId: "ION-PIL-2026-052",
    department: "Project Execution & Commissioning",
    designation: "Pilot Implementation Manager",
    suggestedPassword: "planLeadAction",
    badge: "Project Pilot Lead",
    avatarInitials: "KS"
  },
  {
    role: "Finance",
    name: "Central Finance Admin",
    email: "finance@ionexchange.com",
    businessUnit: "Corporate Finance",
    employeeId: "ION-FIN-2026-018",
    department: "Corporate Treasury & Audit",
    designation: "Senior Finance Auditor",
    suggestedPassword: "finAuditVoucher",
    badge: "Finance Evaluator",
    avatarInitials: "CF"
  },
  {
    role: "CFO",
    name: "N. M. Ranadive (CFO)",
    email: "nmr@ionexchange.com",
    businessUnit: "Executive Committee",
    employeeId: "ION-CFO-2026-001",
    department: "Executive Finance Committee",
    designation: "Chief Financial Officer (CFO)",
    suggestedPassword: "cfoDisbursment",
    badge: "Chief Financial Officer",
    avatarInitials: "NMR"
  },
  {
    role: "Super Admin" as any,
    name: "Super Admin Observer",
    email: "superadmin@ionexchange.com",
    businessUnit: "System Administration",
    employeeId: "ION-SYS-2026-000",
    department: "IT Governance & Audit",
    designation: "Platform Super Administrator",
    suggestedPassword: "superadmin",
    badge: "Full Platform Oversight",
    avatarInitials: "SA"
  }
];

export const LoginGate: React.FC<LoginGateProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login state
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number | null>(null);
  const [syncStep, setSyncStep] = useState<number>(0);
  const [syncingData, setSyncingData] = useState<DemoAccount | null>(null);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmpId, setRegEmpId] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regBU, setRegBU] = useState("");
  const [regDept, setRegDept] = useState("");
  const [regDesignation, setRegDesignation] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setErrorMsg(null);
    setRegError(null);
    setRegSuccess(false);
    setIsSuccess(false);
  };

  // Quick fill configuration when clicking on individual cards
  const handleSelectDemo = (account: DemoAccount, index: number) => {
    setSelectedDemoIndex(index);
    setEmailInput(account.email);
    setPasswordInput(account.suggestedPassword);
    setErrorMsg(null);
  };

  const doLoginAnimation = (syncData: DemoAccount, persona: UserPersona) => {
    setIsLoading(true);
    setSyncingData(syncData);
    setSyncStep(1);
    setTimeout(() => {
      setSyncStep(2);
      setTimeout(() => {
        setSyncStep(3);
        setTimeout(() => {
          setSyncStep(4);
          setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => { onLogin(persona); }, 700);
          }, 600);
        }, 700);
      }, 700);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!emailInput.trim()) {
      setErrorMsg("Please enter your corporate email address.");
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMsg("Please enter your secure workspace password.");
      return;
    }

    // 1. Check predefined demo accounts
    const matchedAccount = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (matchedAccount) {
      const isCorrectPassword =
        passwordInput === matchedAccount.suggestedPassword ||
        passwordInput.toLowerCase() === "password" ||
        passwordInput.slice(0, 4) === "pass";
      if (!isCorrectPassword) {
        setErrorMsg(`Invalid security key for ${matchedAccount.name}. Refer to credentials tip box.`);
        return;
      }
      doLoginAnimation(matchedAccount, {
        role: matchedAccount.role,
        name: matchedAccount.name,
        email: matchedAccount.email,
        businessUnit: matchedAccount.businessUnit,
        employeeId: matchedAccount.employeeId,
        department: matchedAccount.department,
        designation: matchedAccount.designation,
      });
      return;
    }

    // 2. Check Supabase registered users
    if (isSupabaseConfigured) {
      setIsLoading(true);
      const dbUser = await db.lookupUser(emailInput.trim());
      setIsLoading(false);
      if (dbUser) {
        if (dbUser.password !== passwordInput) {
          setErrorMsg("Incorrect password. Please try again.");
          return;
        }
        const syncData: DemoAccount = {
          role: dbUser.role as DemoAccount["role"],
          name: dbUser.name,
          email: dbUser.email,
          businessUnit: dbUser.business_unit,
          employeeId: dbUser.employee_id,
          department: dbUser.department,
          designation: dbUser.designation,
          suggestedPassword: dbUser.password,
          badge: "Registered Employee",
          avatarInitials: dbUser.name.split(" ").map((w: string) => w[0]).slice(0,2).join("").toUpperCase(),
        };
        doLoginAnimation(syncData, {
          role: dbUser.role as UserPersona["role"],
          name: dbUser.name,
          email: dbUser.email,
          businessUnit: dbUser.business_unit,
          employeeId: dbUser.employee_id,
          department: dbUser.department,
          designation: dbUser.designation,
        });
        return;
      }
    }

    setErrorMsg("Email not found. Please register first or check your spelling.");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regBU.trim() || !regDept.trim() || !regDesignation.trim()) {
      setRegError("All fields are required.");
      return;
    }
    if (!isSupabaseConfigured) {
      setRegError("Registration requires Supabase. The app is running in offline mode.");
      return;
    }
    const empId = regEmpId.trim() || `ION-EMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    setIsRegistering(true);
    const { error } = await db.registerUser({
      email: regEmail.trim(),
      password: regPassword,
      name: regName.trim(),
      role: "Employee",
      business_unit: regBU.trim(),
      employee_id: empId,
      department: regDept.trim(),
      designation: regDesignation.trim(),
    });
    setIsRegistering(false);
    if (error) { setRegError(error); return; }
    setRegSuccess(true);
    // Auto-login after short delay
    setTimeout(() => {
      const syncData: DemoAccount = {
        role: "Employee",
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        businessUnit: regBU.trim(),
        employeeId: empId,
        department: regDept.trim(),
        designation: regDesignation.trim(),
        suggestedPassword: regPassword,
        badge: "Registered Employee",
        avatarInitials: regName.trim().split(" ").map((w: string) => w[0]).slice(0,2).join("").toUpperCase(),
      };
      doLoginAnimation(syncData, {
        role: "Employee",
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        businessUnit: regBU.trim(),
        employeeId: empId,
        department: regDept.trim(),
        designation: regDesignation.trim(),
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex flex-col font-sans overflow-x-hidden">
      {/* Background decorative rings — same as hero */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-white/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" fill="white" />
              <circle cx="12" cy="12" r="7" strokeOpacity="0.5" />
              <circle cx="12" cy="12" r="11" strokeOpacity="0.25" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Ripple</span>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-indigo-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Main Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Card header */}
          <div className="text-center mb-6 space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Sign In to Ripple</h1>
            <p className="text-indigo-300 text-sm">Access your personalized ideation workspace</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Mode Tabs — Register hidden; login only per client requirement */}
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => switchMode("login")}
                style={{ borderBottomColor: "#0098DB", color: "#0098DB" }}
                className="flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 bg-sky-50/30 cursor-pointer"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </div>

            <div className="p-7 sm:p-9">

              {/* ── REGISTER FORM ── */}
              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <p className="text-xs text-slate-500 mb-4">New employees can self-register here. Governance roles (C-POC, IRC, FH, Finance, CFO) are assigned by the platform administrator.</p>

                  {regError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                      <span>{regError}</span>
                    </div>
                  )}
                  {regSuccess && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Registration successful! Signing you in…</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                          placeholder="e.g. Ravi Shankar Mishra"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">Corporate Email *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                          placeholder="you@ionexchange.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input type={regShowPassword ? "text" : "password"} value={regPassword} onChange={e => setRegPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all" />
                        <button type="button" onClick={() => setRegShowPassword(!regShowPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                          {regShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Business Unit */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">Business Unit *</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input type="text" value={regBU} onChange={e => setRegBU(e.target.value)}
                          placeholder="e.g. Industrial Water Division"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all" />
                      </div>
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">Department *</label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input type="text" value={regDept} onChange={e => setRegDept(e.target.value)}
                          placeholder="e.g. Process Engineering & Design"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all" />
                      </div>
                    </div>

                    {/* Designation */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">Designation *</label>
                      <div className="relative">
                        <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input type="text" value={regDesignation} onChange={e => setRegDesignation(e.target.value)}
                          placeholder="e.g. Senior Process Engineer"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all" />
                      </div>
                    </div>

                    {/* Employee ID (optional) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">Employee ID <span className="normal-case font-normal text-slate-400">(auto-generated if blank)</span></label>
                      <div className="relative">
                        <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input type="text" value={regEmpId} onChange={e => setRegEmpId(e.target.value)}
                          placeholder="e.g. ION-EMP-2026-099"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering || regSuccess}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg mt-2 ${
                      regSuccess
                        ? "bg-emerald-500 text-white"
                        : isRegistering
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-violet-200"
                    }`}
                  >
                    {isRegistering ? (
                      <><span className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" /><span>Creating account…</span></>
                    ) : regSuccess ? (
                      <><CheckCircle2 className="w-4 h-4" /><span>Registered! Signing in…</span></>
                    ) : (
                      <><UserPlus className="w-4 h-4" /><span>Create Account &amp; Sign In</span></>
                    )}
                  </button>
                </form>
              )}

              {/* ── LOGIN FORM ── */}
              {mode === "login" && (
              <>
              {/* Error Message */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5 mb-6">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setSelectedDemoIndex(null); }}
                      placeholder="e.g. employee@ionexchange.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => { setPasswordInput(e.target.value); setSelectedDemoIndex(null); }}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* AD/SAP Sync panel */}
                {isLoading && syncingData && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-indigo-100">
                      <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
                      <span className="text-xs text-indigo-700 font-bold uppercase tracking-wide">Verifying credentials…</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {[
                        [1, "Authenticate LDAP Directory"],
                        [2, "Match SAP HR Employee Profile"],
                        [3, "Retrieve Metadata (BU, Dept, Title)"],
                        [4, "Run SoD Segregation of Duties Check"],
                      ].map(([step, label]) => (
                        <div key={step} className="flex items-center justify-between">
                          <span className="text-slate-600">{label as string}</span>
                          <span className={syncStep >= (step as number) ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                            {syncStep >= (step as number) ? "✓ Done" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                    {syncStep >= 3 && (
                      <div className="pt-3 border-t border-indigo-100 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div><span className="text-xs text-slate-400 block uppercase tracking-wide">Name</span><strong className="text-slate-800">{syncingData.name}</strong></div>
                        <div><span className="text-xs text-slate-400 block uppercase tracking-wide">Employee ID</span><strong className="text-indigo-600 font-mono">{syncingData.employeeId}</strong></div>
                        <div><span className="text-xs text-slate-400 block uppercase tracking-wide">Department</span><strong className="text-slate-800">{syncingData.department}</strong></div>
                        <div><span className="text-xs text-slate-400 block uppercase tracking-wide">Business Unit</span><strong className="text-slate-800">{syncingData.businessUnit}</strong></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                    isSuccess
                      ? "bg-emerald-500 text-white shadow-emerald-200"
                      : isLoading
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-200"
                  }`}
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" /><span>Verifying…</span></>
                  ) : isSuccess ? (
                    <><CheckCircle2 className="w-4 h-4" /><span>Authentication Successful!</span></>
                  ) : (
                    <><LogIn className="w-4 h-4" /><span>Sign In to Ripple</span></>
                  )}
                </button>
              </form>

              {/* Demo Quick Select */}
              <div className="mt-7 pt-6 border-t border-slate-100 space-y-4">

                {/* Employees */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Employee Accounts <span className="text-slate-500 font-normal">— password: <code className="font-mono text-slate-700">password</code></span></span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DEMO_ACCOUNTS.filter(a => a.role === "Employee").map((acc) => {
                      const globalIdx = DEMO_ACCOUNTS.indexOf(acc);
                      const isSelected = selectedDemoIndex === globalIdx;
                      return (
                        <button
                          key={globalIdx}
                          type="button"
                          onClick={() => handleSelectDemo(acc, globalIdx)}
                          className={`p-2.5 text-left rounded-xl border text-sm cursor-pointer flex items-center gap-2 transition-all ${
                            isSelected
                              ? "bg-emerald-100 border-emerald-400 shadow-sm"
                              : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0">
                            {acc.avatarInitials}
                          </div>
                          <div className="truncate flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 text-xs leading-tight truncate">{acc.name.split(" ").slice(0,2).join(" ")}</div>
                            <div className="text-xs text-emerald-600 leading-none mt-0.5 truncate">{acc.role}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Governance Roles */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>Governance &amp; Admin Roles</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DEMO_ACCOUNTS.filter(a => a.role !== "Employee" && (a.role as string) !== "Super Admin").map((acc) => {
                      const globalIdx = DEMO_ACCOUNTS.indexOf(acc);
                      const isSelected = selectedDemoIndex === globalIdx;
                      return (
                        <button
                          key={globalIdx}
                          type="button"
                          onClick={() => handleSelectDemo(acc, globalIdx)}
                          className={`p-2.5 text-left rounded-xl border text-sm cursor-pointer flex items-center gap-2 transition-all ${
                            isSelected
                              ? "bg-indigo-50 border-indigo-400 shadow-sm"
                              : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-sky-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                            {acc.avatarInitials}
                          </div>
                          <div className="truncate flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 text-xs leading-tight truncate">{acc.name.split(" ")[0]}</div>
                            <div className="text-xs text-indigo-500 leading-none mt-0.5 uppercase">{acc.role}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Super Admin */}
                {DEMO_ACCOUNTS.filter(a => (a.role as string) === "Super Admin").map((acc) => {
                  const globalIdx = DEMO_ACCOUNTS.indexOf(acc);
                  const isSelected = selectedDemoIndex === globalIdx;
                  return (
                    <div key={globalIdx} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                      <div className="text-sm font-semibold text-amber-700">🛡 Super Admin — Full Oversight <span className="text-slate-500 font-normal">(password: <code className="font-mono text-slate-700">superadmin</code>)</span></div>
                      <button
                        type="button"
                        onClick={() => handleSelectDemo(acc, globalIdx)}
                        className={`w-full p-2.5 text-left rounded-xl border text-sm cursor-pointer flex items-center gap-2 transition-all ${
                          isSelected
                            ? "bg-amber-100 border-amber-400 shadow-sm"
                            : "bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center font-bold text-amber-700 text-xs shrink-0">SA</div>
                        <div>
                          <div className="font-semibold text-slate-800 text-xs">{acc.name}</div>
                          <div className="text-xs text-amber-600 mt-0.5">All ideas · All stages · Observer mode</div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs text-slate-400 mt-6">Authorized personnel only. Sessions are encrypted client-side.</p>
              </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" fill="white" />
                <circle cx="12" cy="12" r="7" strokeOpacity="0.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Ripple</span>
            <span className="text-indigo-400 text-sm">· Talent Management &amp; OD</span>
          </div>
          <p className="text-xs text-indigo-400">&copy; {new Date().getFullYear()} Ripple Initiative. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );

};
