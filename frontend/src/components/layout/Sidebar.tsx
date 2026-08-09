'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, UploadCloud, Users, Network, Search, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Executive Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'HR Portal Simulator', href: '/hr-simulator', icon: Building2 },
  { name: 'Upload & Ingest', href: '/upload', icon: UploadCloud },
  { name: 'Payroll Batches', href: '/overview', icon: Users },
  { name: 'Trust Graph Workspace', href: '/trust-graph', icon: Network },
  { name: 'AI Investigation Hub', href: '/investigation', icon: Search },
  { name: 'Firewall & Audit PDF', href: '/reports', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#121215] border-r border-[#27272a] min-h-screen p-4 flex flex-col justify-between select-none z-30">
      <div>
        {/* Solid Enterprise Brand Header */}
        <div className="flex items-center gap-2.5 px-2 py-3 mb-5 border-b border-[#27272a]">
          <div className="w-7 h-7 rounded bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-white font-mono font-bold text-xs">
            P
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight">PAYCERTUS</h1>
            <p className="text-[10px] text-[#a1a1aa] font-mono font-medium tracking-wider uppercase">Enterprise Platform</p>
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
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#27272a] text-white font-semibold'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#71717a]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Footer */}
      <div className="p-3 bg-[#18181b] rounded-md border border-[#27272a] text-[11px]">
        <div className="flex items-center justify-between text-[#a1a1aa] mb-1">
          <span className="font-medium">Engine Status</span>
          <span className="text-[#6ee7b7] font-mono font-bold text-[10px] bg-[#064e3b] px-1.5 py-0.5 rounded border border-[#047857]">
            ACTIVE
          </span>
        </div>
        <div className="text-[#71717a] text-[10px] font-mono">v1.0 • Solid Enterprise Engine</div>
      </div>
    </aside>
  );
}
