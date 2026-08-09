'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, User, CheckCircle2, Moon, Sun, Lock } from 'lucide-react';

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
    <header className="h-14 border-b border-[#27272a] bg-[#121215] px-5 flex items-center justify-between select-none sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-[#064e3b] text-[#6ee7b7] border border-[#047857] font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" /> HRMS Gateway Connected
        </span>
        <span className="text-[#3f3f46] text-sm">|</span>
        <span className="text-[#a1a1aa] text-xs font-mono">Payroll Cycle: <strong className="text-white">August 2026</strong></span>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-2.5 py-1 rounded bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-[#fafafa] text-xs font-medium flex items-center gap-1.5 transition font-mono"
          title="Toggle Minimalist Theme Mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-[#e4e4e7]" />
              <span className="text-[11px]">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#e4e4e7]" />
              <span className="text-[11px]">Dark Mode</span>
            </>
          )}
        </button>

        {/* Firewall Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#3f1214] border border-[#7f1d1d] text-[#fca5a5] text-xs font-mono font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Firewall: <strong className="text-white">ENFORCING</strong></span>
        </div>

        {/* User Avatar Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#27272a]">
          <div className="w-7 h-7 rounded bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-white font-bold text-xs">
            SO
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-white">Security Officer</div>
            <div className="text-[#71717a] text-[10px] font-mono">Auditor</div>
          </div>
        </div>
      </div>
    </header>
  );
}
