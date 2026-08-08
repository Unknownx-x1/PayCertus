'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UploadCloud, Users, Network, Search, ShieldCheck } from 'lucide-react';

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
    <aside className="w-60 bg-[#050505] border-r border-[#262626] min-h-screen p-4 flex flex-col justify-between select-none">
      <div>
        {/* Minimalist Monochromatic Brand Header */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-[#262626]">
          <div className="w-9 h-9 rounded-lg bg-[#171717] border border-[#333333] flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">PAYCERTUS</h1>
            <p className="text-[10px] text-neutral-400 font-mono font-semibold tracking-wider uppercase">Enterprise AI</p>
          </div>
        </div>

        {/* Minimalist Monochromatic Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-[#171717]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Minimalist Monochromatic Footer Status */}
      <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#262626] text-[11px]">
        <div className="flex items-center justify-between text-neutral-400 mb-1">
          <span className="font-medium">Security Engine</span>
          <span className="text-white font-mono font-bold">ONLINE</span>
        </div>
        <div className="text-neutral-500 text-[10px] font-mono">v1.0 • PayCertus Platform</div>
      </div>
    </aside>
  );
}
