(()=>{var e={};e.id=882,e.ids=[882],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2542:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>i.a,__next_app__:()=>f,originalPathname:()=>c,pages:()=>p,routeModule:()=>m,tree:()=>l}),a(4174),a(278),a(5866);var o=a(3191),s=a(8716),r=a(7922),i=a.n(r),n=a(5231),d={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>n[e]);a.d(t,d);let l=["",{children:["reports",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,4174)),"C:\\Users\\SHIVANSH\\payroll_fintech\\frontend\\src\\app\\reports\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,278)),"C:\\Users\\SHIVANSH\\payroll_fintech\\frontend\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}],p=["C:\\Users\\SHIVANSH\\payroll_fintech\\frontend\\src\\app\\reports\\page.tsx"],c="/reports/page",f={require:a,loadChunk:()=>Promise.resolve()},m=new o.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/reports/page",pathname:"/reports",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},9524:(e,t,a)=>{Promise.resolve().then(a.bind(a,4399))},4659:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,a(6557).Z)("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},6283:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,a(6557).Z)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},4399:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>x});var o=a(326),s=a(7577),r=a(8069),i=a(4153),n=a(9015),d=a(4659),l=a(6557);/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let p=(0,l.Z)("PauseCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"10",x2:"10",y1:"15",y2:"9",key:"c1nkhi"}],["line",{x1:"14",x2:"14",y1:"15",y2:"9",key:"h65svq"}]]),c=(0,l.Z)("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);var f=a(6283);/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let m=(0,l.Z)("Printer",[["polyline",{points:"6 9 6 2 18 2 18 9",key:"1306q4"}],["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["rect",{width:"12",height:"8",x:"6",y:"14",key:"5ipwut"}]]);function x(){let[e,t]=(0,s.useState)([]),[a,l]=(0,s.useState)(""),[x,b]=(0,s.useState)(""),[g,u]=(0,s.useState)("");async function y(){let e=await (0,r.Og)();t(e),e.length>0&&l(e[0].id)}let h=e.find(e=>e.id===a)||e[0];async function v(e){h&&(await (0,r.Gi)(h.id,e,x),u(`Action [${e}] recorded successfully for batch ${h.batch_name}!`),y())}return(0,o.jsxs)("div",{className:"space-y-5 max-w-7xl mx-auto select-none",children:[(0,o.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",children:[(0,o.jsxs)("div",{children:[(0,o.jsxs)("h1",{className:"text-lg font-bold text-white flex items-center gap-2 tracking-tight",children:[o.jsx(n.Z,{className:"w-4 h-4 text-white"})," Payroll Firewall & Compliance Reports"]}),o.jsx("p",{className:"text-xs text-[#a1a1aa] mt-0.5",children:"Pre-disbursement approval gatekeeper and cryptographic audit report export center"})]}),o.jsx("select",{value:a,onChange:e=>l(e.target.value),className:"bg-[#18181b] border border-[#27272a] text-white text-xs font-mono font-semibold rounded px-3 py-2 outline-none focus:border-white",children:e.map(e=>(0,o.jsxs)("option",{value:e.id,children:[e.batch_name," (Status: ",e.status,")"]},e.id))})]}),h&&(0,o.jsxs)("div",{className:"enterprise-card p-5 space-y-5",children:[(0,o.jsxs)("div",{className:"flex justify-between items-center border-b border-[#27272a] pb-3",children:[(0,o.jsxs)("div",{children:[o.jsx("span",{className:"text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider",children:"Target Payroll Batch"}),o.jsx("h2",{className:"text-base font-bold text-white mt-0.5 font-mono",children:h.batch_name})]}),(0,o.jsxs)("div",{className:"text-right",children:[o.jsx("span",{className:"text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider",children:"Firewall Decision"}),o.jsx("div",{className:"mt-1",children:o.jsx("span",{className:`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${"BLOCKED"===h.status?"bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d]":"bg-[#064e3b] text-[#6ee7b7] border border-[#047857]"}`,children:h.status})})]})]}),(0,o.jsxs)("div",{className:"space-y-3",children:[o.jsx("label",{className:"text-xs font-semibold text-white",children:"Auditor Compliance Justification & Notes:"}),o.jsx("textarea",{value:x,onChange:e=>b(e.target.value),placeholder:"Enter optional compliance override or hold notes...",className:"w-full bg-[#09090b] border border-[#27272a] rounded p-3 text-xs text-white focus:outline-none focus:border-white h-20 font-mono"}),(0,o.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1",children:[(0,o.jsxs)("button",{onClick:()=>v("APPROVE"),className:"py-2.5 px-3 rounded bg-[#064e3b] hover:bg-[#047857] text-[#6ee7b7] font-bold text-xs border border-[#047857] flex items-center justify-center gap-2 transition",children:[o.jsx(d.Z,{className:"w-4 h-4"})," Authorize & Release Salary"]}),(0,o.jsxs)("button",{onClick:()=>v("HOLD"),className:"py-2.5 px-3 rounded bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] font-bold text-xs border border-[#3f3f46] flex items-center justify-center gap-2 transition",children:[o.jsx(p,{className:"w-4 h-4"})," Place Batch On Hold"]}),(0,o.jsxs)("button",{onClick:()=>v("BLOCK"),className:"btn-solid-danger justify-center py-2.5",children:[o.jsx(c,{className:"w-4 h-4"})," Block Fraudulent Payroll"]})]})]}),g&&o.jsx("div",{className:"p-3 rounded bg-[#27272a] border border-[#3f3f46] text-white text-xs font-semibold font-mono",children:g})]}),(0,o.jsxs)("div",{className:"enterprise-card p-5 space-y-3",children:[(0,o.jsxs)("h2",{className:"text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2",children:[o.jsx(f.Z,{className:"w-4 h-4 text-white"})," Compliance Audit Reports"]}),o.jsx("p",{className:"text-xs text-[#a1a1aa]",children:"Export immutable PDF and HTML reports for external audit partners and regulatory compliance."}),h&&(0,o.jsxs)("div",{className:"p-3.5 rounded bg-[#09090b] border border-[#27272a] flex justify-between items-center",children:[(0,o.jsxs)("div",{children:[(0,o.jsxs)("h3",{className:"text-xs font-bold text-white",children:[h.batch_name," Audit Report"]}),(0,o.jsxs)("p",{className:"text-[11px] text-[#71717a] font-mono mt-0.5",children:["ID: ",h.id]})]}),(0,o.jsxs)("button",{onClick:()=>(0,i.$)(h),className:"btn-solid-primary",children:[o.jsx(m,{className:"w-3.5 h-3.5"})," Export Audit Report"]})]})]})]})}},4153:(e,t,a)=>{"use strict";function o(e){let t=window.open("","_blank");if(!t){alert("Please allow popups to export the audit report.");return}let a=e.risk_findings||[],o=e.transactions||[],s=a.filter(e=>"RULE"===e.layer),r=a.filter(e=>"ANOMALY"===e.layer),i=a.filter(e=>"GRAPH"===e.layer),n=e.approved_amount||o.filter(e=>"APPROVED"===e.status).reduce((e,t)=>e+t.gross_salary,0),d=e.held_amount||o.filter(e=>"FLAG_REVIEW"===e.status||"HOLD"===e.status).reduce((e,t)=>e+t.gross_salary,0),l=e.blocked_amount||o.filter(e=>"BLOCKED"===e.status).reduce((e,t)=>e+t.gross_salary,0),p=a.length>0?a.map(e=>`
    <div style="background: #18181b; border: 1px solid #27272a; border-left: 4px solid ${"CRITICAL"===e.severity?"#ef4444":"HIGH"===e.severity?"#f97316":"#eab308"}; padding: 14px; margin-bottom: 12px; border-radius: 6px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; font-family: monospace; font-weight: bold; background: #27272a; color: #fafafa; padding: 2px 6px; border-radius: 4px;">
          ${e.severity} • ${e.layer} LAYER
        </span>
        <span style="font-size: 11px; font-family: monospace; color: #71717a;">${e.rule_code}</span>
      </div>
      <div style="font-weight: bold; font-size: 15px; color: #ffffff; margin-top: 8px;">${e.title}</div>
      <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px; line-height: 1.5; font-family: monospace;">${e.description}</div>
      ${e.evidence_json?`
        <div style="margin-top: 8px; font-size: 11px; font-family: monospace; color: #71717a; background: #09090b; padding: 8px; border-radius: 4px;">
          Evidence: ${JSON.stringify(e.evidence_json)}
        </div>
      `:""}
    </div>
  `).join(""):'<p style="color: #6ee7b7; font-family: monospace;">No risk findings recorded for this batch. All evaluation checks passed cleanly.</p>',c=`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PayCertus Audit Report — ${e.batch_name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #27272a; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
        .sub { font-size: 11px; color: #a1a1aa; font-family: monospace; margin-top: 4px; }
        .card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; }
        .label { font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; font-weight: bold; }
        .val { font-size: 22px; font-weight: bold; font-family: monospace; margin-top: 6px; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; font-family: monospace; }
        .badge-blocked { background: #3f1214; color: #fca5a5; border: 1px solid #7f1d1d; }
        .badge-approved { background: #064e3b; color: #6ee7b7; border: 1px solid #047857; }
        .fin-strip { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center; font-family: monospace; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #18181b; border-bottom: 1px solid #27272a; text-align: left; padding: 10px; font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; }
        td { padding: 10px; border-bottom: 1px solid #27272a; font-size: 12px; font-family: monospace; }
        @media print {
          body { background: #ffffff; color: #000000; }
          .card, .fin-strip { background: #f4f4f5; border: 1px solid #e4e4e7; }
          th { background: #f4f4f5; color: #000000; }
          td { color: #000000; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">PAYCERTUS ENTERPRISE AUDIT REPORT</div>
          <div class="sub">Batch ID: ${e.id} • Processed At: ${new Date(e.processed_at||Date.now()).toLocaleString()}</div>
          <div class="sub" style="color: #6ee7b7; font-weight: bold; margin-top: 2px;">PROOF HASH: ${e.proof_hash||"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}</div>
        </div>
        <div>
          <span class="badge ${"BLOCKED"===e.status||"PARTIAL_HOLD"===e.status?"badge-blocked":"badge-approved"}">
            FIREWALL DECISION: ${e.status}
          </span>
        </div>
      </div>

      <div class="card-grid">
        <div class="card">
          <div class="label">Target Payroll Batch</div>
          <div style="font-size: 14px; font-weight: bold; font-family: monospace; margin-top: 8px;">${e.batch_name}</div>
        </div>
        <div class="card">
          <div class="label">Integrity Score (PIS)</div>
          <div class="val" style="color: ${e.integrity_score<40?"#ef4444":"#10b981"};">${e.integrity_score} / 100</div>
        </div>
        <div class="card">
          <div class="label">Total Employees</div>
          <div class="val">${e.total_employees}</div>
        </div>
        <div class="card">
          <div class="label">Total Payroll Value</div>
          <div class="val" style="color: #ffffff;">$${(e.total_amount||0).toLocaleString()}</div>
        </div>
      </div>

      <!-- Financial Exposure Distribution Strip -->
      <div class="fin-strip">
        <div>
          <div class="label" style="color: #6ee7b7;">Approved Amount</div>
          <div style="font-size: 18px; font-weight: bold; color: #6ee7b7; margin-top: 4px;">$${n.toLocaleString()}</div>
        </div>
        <div>
          <div class="label" style="color: #fdba74;">Held Amount</div>
          <div style="font-size: 18px; font-weight: bold; color: #fdba74; margin-top: 4px;">$${d.toLocaleString()}</div>
        </div>
        <div>
          <div class="label" style="color: #fca5a5;">Blocked Amount</div>
          <div style="font-size: 18px; font-weight: bold; color: #fca5a5; margin-top: 4px;">$${l.toLocaleString()}</div>
        </div>
      </div>

      <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 32px;">
        Multi-Layer Risk Findings (${a.length} total: ${s.length} Rule, ${r.length} ML, ${i.length} Graph)
      </h2>
      ${p}

      <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 32px;">
        Employee Transaction Summary (${o.length})
      </h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Bank Account</th>
            <th>Gross Salary</th>
            <th>Attendance</th>
            <th>Overtime</th>
            <th>Risk Score (R / ML / G)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${o.map(e=>`
            <tr>
              <td>${e.employee_id}</td>
              <td><strong>${e.employee_name}</strong></td>
              <td>${e.bank_account_no||"Data unavailable"}</td>
              <td>$${e.gross_salary.toLocaleString()}</td>
              <td>${e.attendance_days} days</td>
              <td>${e.overtime_hours}h</td>
              <td style="color: ${e.risk_score>=75?"#ef4444":e.risk_score>=35?"#fdba74":"#10b981"}; font-weight: bold;">
                ${e.risk_score}/100 (+${e.rule_contrib||0} / +${e.ml_contrib||0} / +${e.graph_contrib||0})
              </td>
              <td><strong>${e.status}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #27272a; color: #71717a; font-size: 11px; font-family: monospace; text-align: center;">
        Cryptographic Proof Hash: ${e.proof_hash||"sha256:..."} • PayCertus Compliance Engine v2.4
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;t.document.write(c),t.document.close()}function s(e,t){let a=window.open("","_blank");if(!a){alert("Please allow popups to export the employee evidence packet.");return}let o=t.filter(t=>t.employee_id===e.employee_id||t.employee_name&&e.employee_name&&t.employee_name.includes(e.employee_name)),s=`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Individual Audit Dossier — ${e.employee_name} (${e.employee_id})</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #27272a; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 20px; font-weight: 800; color: #ffffff; }
        .sub { font-size: 12px; color: #a1a1aa; font-family: monospace; margin-top: 4px; }
        .card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; }
        .label { font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; font-weight: bold; }
        .val { font-size: 20px; font-weight: bold; font-family: monospace; margin-top: 6px; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; font-family: monospace; }
        .badge-blocked { background: #3f1214; color: #fca5a5; border: 1px solid #7f1d1d; }
        .badge-approved { background: #064e3b; color: #6ee7b7; border: 1px solid #047857; }
        @media print {
          body { background: #ffffff; color: #000000; }
          .card { background: #f4f4f5; border: 1px solid #e4e4e7; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">INDIVIDUAL FORENSIC AUDIT DOSSIER</div>
          <div class="sub">Employee: ${e.employee_name} (${e.employee_id}) • Generated At: ${new Date().toLocaleString()}</div>
        </div>
        <div>
          <span class="badge ${e.risk_score>=60?"badge-blocked":"badge-approved"}">
            RISK SCORE: ${e.risk_score} / 100 (${e.status})
          </span>
        </div>
      </div>

      <div class="card-grid">
        <div class="card">
          <div class="label">Gross Salary Claimed</div>
          <div class="val">$${e.gross_salary.toLocaleString()}</div>
        </div>
        <div class="card">
          <div class="label">Attendance Days</div>
          <div class="val" style="color: ${0===e.attendance_days?"#ef4444":"#ffffff"};">${e.attendance_days} days</div>
        </div>
        <div class="card">
          <div class="label">Overtime Claimed</div>
          <div class="val">${e.overtime_hours} hrs</div>
        </div>
        <div class="card">
          <div class="label">Destination Bank Account</div>
          <div class="val" style="font-size: 16px;">${e.bank_account_no||"Data unavailable"}</div>
        </div>
      </div>

      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-family: monospace;">
        <span style="font-size: 11px; color: #a1a1aa; font-weight: bold; text-transform: uppercase;">Deterministic Score Aggregation</span>
        <div style="display: flex; gap: 24px; margin-top: 8px; font-size: 13px;">
          <div>Rule Contribution: <strong style="color: #ffffff;">+${e.rule_contrib||0} pts</strong></div>
          <div>ML Outlier Contribution: <strong style="color: #ffffff;">+${e.ml_contrib||0} pts</strong></div>
          <div>Graph Cluster Contribution: <strong style="color: #ffffff;">+${e.graph_contrib||0} pts</strong></div>
        </div>
      </div>

      <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 32px;">
        Multi-Layer Evidence Checklist (${o.length})
      </h2>
      ${o.length>0?o.map(e=>`
        <div style="background: #18181b; border: 1px solid #27272a; border-left: 4px solid ${"CRITICAL"===e.severity?"#ef4444":"HIGH"===e.severity?"#f97316":"#eab308"}; padding: 14px; margin-bottom: 12px; border-radius: 6px;">
          <div style="font-size: 11px; font-family: monospace; font-weight: bold; background: #27272a; color: #fafafa; padding: 2px 6px; border-radius: 4px; display: inline-block;">
            ${e.severity} • ${e.layer} LAYER
          </div>
          <div style="font-weight: bold; font-size: 14px; color: #ffffff; margin-top: 8px;">${e.title}</div>
          <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px; line-height: 1.5; font-family: monospace;">${e.description}</div>
        </div>
      `).join(""):'<p style="color: #6ee7b7; font-family: monospace;">No risk findings or anomalies recorded for this employee.</p>'}

      <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #27272a; color: #71717a; font-size: 11px; font-family: monospace; text-align: center;">
        PayCertus AI Security System • Individual Audit Dossier
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;a.document.write(s),a.document.close()}a.d(t,{$:()=>o,B:()=>s})},4174:(e,t,a)=>{"use strict";a.r(t),a.d(t,{$$typeof:()=>i,__esModule:()=>r,default:()=>n});var o=a(8570);let s=(0,o.createProxy)(String.raw`C:\Users\SHIVANSH\payroll_fintech\frontend\src\app\reports\page.tsx`),{__esModule:r,$$typeof:i}=s;s.default;let n=(0,o.createProxy)(String.raw`C:\Users\SHIVANSH\payroll_fintech\frontend\src\app\reports\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),o=t.X(0,[729,491],()=>a(2542));module.exports=o})();