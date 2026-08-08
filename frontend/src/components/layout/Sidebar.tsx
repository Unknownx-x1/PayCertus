'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UploadCloud, Users, Network, Search, ShieldCheck, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Upload & Ingest', href: '/upload', icon: UploadCloud },
  { name: 'Payroll Batches', href: '/overview', icon: Users },
  { name: 'Trust Graph', href: '/trust-graph', icon: Network },
  { name: 'Investigation Hub', href: '/investigation', icon: Search },
  { name: 'Firewall & Reports', href: '/reports', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card/60 backdrop-blur-xl border-r border-border min-h-screen p-4 flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide">PAYCERTUS</h1>
            <p className="text-xs text-sky-400 font-semibold tracking-wider">ENTERPRISE AI</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-900/60 rounded-lg border border-border/50 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>Security Layer</span>
          <span className="text-emerald-400 font-semibold">ACTIVE</span>
        </div>
        <div className="text-slate-500 text-[10px]">v1.0 Enterprise Edition</div>
      </div>
    </aside>
  );
}
