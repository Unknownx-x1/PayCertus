'use client';

import { Bell, ShieldAlert, User, CheckCircle2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> HRMS Integration Live
        </span>
        <span className="text-slate-500 text-sm">|</span>
        <span className="text-slate-400 text-sm">Target Payroll Cycle: <strong className="text-slate-200">August 2026</strong></span>
      </div>

      <div className="flex items-center gap-4">
        {/* Risk Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          <ShieldAlert className="w-4 h-4" />
          <span>Firewall Status: <strong className="text-white">ENFORCING</strong></span>
        </div>

        {/* User Badges */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-200">Security Officer</div>
            <div className="text-slate-500">Internal Auditor</div>
          </div>
        </div>
      </div>
    </header>
  );
}
