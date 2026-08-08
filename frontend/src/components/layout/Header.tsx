'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, User, CheckCircle2, Moon, Sun } from 'lucide-react';

export default function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('minimal-light');
    } else {
      document.body.classList.remove('minimal-light');
    }
  }, [theme]);

  return (
    <header className="h-16 border-b border-[#262626] bg-[#050505]/80 backdrop-blur-md px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#171717] text-neutral-200 border border-[#333333]">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" /> HRMS Gateway Connected
        </span>
        <span className="text-neutral-700 text-sm">|</span>
        <span className="text-neutral-400 text-xs font-medium">Payroll Cycle: <strong className="text-white">August 2026</strong></span>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-[#171717] hover:bg-[#262626] border border-[#333333] text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition"
          title="Toggle Minimalist Theme Mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-[11px]">Minimal Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-[11px]">Minimal Dark</span>
            </>
          )}
        </button>

        {/* Firewall Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#18090a] border border-[#7f1d1d] text-rose-400 text-xs font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Firewall: <strong className="text-white font-mono">ENFORCING</strong></span>
        </div>

        {/* User Badges */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#262626]">
          <div className="w-8 h-8 rounded-full bg-[#171717] border border-[#333333] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-white">Security Officer</div>
            <div className="text-neutral-400 text-[10px]">Internal Auditor</div>
          </div>
        </div>
      </div>
    </header>
  );
}
