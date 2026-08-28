(()=>{var e={};e.id=617,e.ids=[617],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},986:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>i.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>c,routeModule:()=>m,tree:()=>l}),a(5344),a(278),a(5866);var s=a(3191),o=a(8716),r=a(7922),i=a.n(r),n=a(5231),d={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>n[e]);a.d(t,d);let l=["",{children:["investigation",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,5344)),"C:\\Users\\SHIVANSH\\payroll_fintech\\frontend\\src\\app\\investigation\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,278)),"C:\\Users\\SHIVANSH\\payroll_fintech\\frontend\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\SHIVANSH\\payroll_fintech\\frontend\\src\\app\\investigation\\page.tsx"],p="/investigation/page",x={require:a,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/investigation/page",pathname:"/investigation",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},1351:(e,t,a)=>{Promise.resolve().then(a.bind(a,78))},1208:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(6557).Z)("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]])},6283:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,a(6557).Z)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},78:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>f});var s=a(326),o=a(7577),r=a(5047);a(8069);var i=a(4153),n=a(8307);/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let d=(0,a(6557).Z)("FileSpreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);var l=a(1208),c=a(1110),p=a(6283),x=a(2179);function m(){let e=(0,r.useSearchParams)();e.get("emp"),e.get("batch");let[t,a]=(0,o.useState)([]),[m,f]=(0,o.useState)(""),[b,h]=(0,o.useState)(""),[g,u]=(0,o.useState)(""),y=t.find(e=>e.id===m)||t[0],v=y?.transactions||[],j=y?.risk_findings||[],_=v.find(e=>e.employee_id===b)||v[0],N=j.filter(e=>"RULE"===e.layer&&(e.employee_id===b||_&&e.employee_name?.includes(_.employee_name)));j.filter(e=>"CROSS_SIGNAL"===e.layer&&(e.employee_id===b||_&&e.employee_name?.includes(_.employee_name)));let k=j.filter(e=>"ANOMALY"===e.layer&&(e.employee_id===b||_&&e.employee_name?.includes(_.employee_name))),w=j.filter(e=>"GRAPH"===e.layer&&(e.employee_id===b||_&&e.employee_name?.includes(_.employee_name)));return(0,s.jsxs)("div",{className:"space-y-5 max-w-7xl mx-auto select-none",children:[(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("h1",{className:"text-lg font-bold text-white flex items-center gap-2 tracking-tight",children:[s.jsx(n.Z,{className:"w-4 h-4 text-white"})," AI Investigation Hub & Forensic Evidence Dossier"]}),s.jsx("p",{className:"text-xs text-[#a1a1aa] mt-0.5",children:"Deep-dive 5-layer forensic breakdown: Rule Engine, Statistical ML, Trust Graph, and Risk Scoring"})]}),s.jsx("select",{value:m,onChange:e=>{f(e.target.value);let a=t.find(t=>t.id===e.target.value);a&&a.transactions&&a.transactions.length>0&&h(a.transactions[0].employee_id)},className:"bg-[#18181b] border border-[#27272a] text-white text-xs font-mono font-semibold rounded px-3 py-2 outline-none focus:border-white",children:t.map(e=>s.jsx("option",{value:e.id,children:e.batch_name},e.id))})]}),(0,s.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-5",children:[(0,s.jsxs)("div",{className:"enterprise-card p-4 space-y-3",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center border-b border-[#27272a] pb-2.5",children:[(0,s.jsxs)("h2",{className:"text-xs font-mono font-bold text-white uppercase tracking-wider",children:["Batch Transactions (",v.length,")"]}),s.jsx("span",{className:"text-[10px] font-mono text-[#a1a1aa]",children:"Select employee"})]}),s.jsx("div",{className:"space-y-2 max-h-[640px] overflow-y-auto pr-1",children:v.map(e=>{let t=e.employee_id===b,a=e.risk_score>=75,o=e.risk_score>=60;return s.jsx("div",{onClick:()=>h(e.employee_id),className:`p-3 rounded border cursor-pointer transition-colors ${t?"bg-white text-black border-white font-bold":"bg-[#09090b] border-[#27272a] text-white hover:border-[#3f3f46]"}`,children:(0,s.jsxs)("div",{className:"flex justify-between items-start",children:[(0,s.jsxs)("div",{children:[s.jsx("div",{className:"font-bold text-xs",children:e.employee_name}),(0,s.jsxs)("div",{className:`text-[10px] font-mono ${t?"text-[#3f3f46]":"text-[#a1a1aa]"}`,children:["ID: ",e.employee_id," ",e.bank_account_no?`• ${e.bank_account_no}`:""]})]}),(0,s.jsxs)("span",{className:`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border ${a?"bg-[#3f1214] text-[#fca5a5] border-[#7f1d1d]":o?"bg-[#451a03] text-[#fdba74] border-[#9a3412]":t?"bg-[#27272a] text-black border-[#3f3f46]":"bg-[#064e3b] text-[#6ee7b7] border-[#047857]"}`,children:["Risk: ",e.risk_score,"/100"]})]})},e.id)})})]}),s.jsx("div",{className:"lg:col-span-2 space-y-5",children:_?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"enterprise-card p-5 border-l-4 border-l-white space-y-4",children:[(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#27272a] pb-3",children:[(0,s.jsxs)("div",{children:[s.jsx("span",{className:"text-[10px] font-mono font-bold text-[#a1a1aa] uppercase tracking-wider",children:"Target Forensic Dossier"}),s.jsx("h2",{className:"text-lg font-extrabold text-white mt-0.5 font-mono",children:_.employee_name}),(0,s.jsxs)("div",{className:"text-xs font-mono text-[#a1a1aa] mt-0.5",children:["ID: ",s.jsx("strong",{className:"text-white",children:_.employee_id})," • Bank Account: ",s.jsx("strong",{className:"text-white",children:_.bank_account_no||"Data unavailable"})]})]}),(0,s.jsxs)("div",{className:"text-right",children:[s.jsx("span",{className:"text-[10px] font-mono text-[#a1a1aa] uppercase font-bold",children:"Firewall Decision"}),s.jsx("div",{className:"mt-1",children:s.jsx("span",{className:`px-3 py-1 rounded text-xs font-mono font-extrabold border ${"BLOCKED"===_.status?"bg-[#3f1214] text-[#fca5a5] border-[#7f1d1d]":"HOLD"===_.status?"bg-[#451a03] text-[#fdba74] border-[#9a3412]":"bg-[#064e3b] text-[#6ee7b7] border-[#047857]"}`,children:_.status})})]})]}),(0,s.jsxs)("div",{className:"p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-2",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center text-xs font-mono",children:[s.jsx("span",{className:"text-[#a1a1aa] font-bold uppercase",children:"Layer 4: Risk Aggregation Breakdown"}),(0,s.jsxs)("span",{className:"text-white font-bold",children:["Final Employee Risk Score: ",(0,s.jsxs)("span",{className:"text-red-400",children:[_.risk_score," / 100"]})]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-3 gap-2 font-mono text-[11px]",children:[(0,s.jsxs)("div",{className:"p-2 rounded bg-[#18181b] border border-[#27272a] text-center",children:[s.jsx("span",{className:"text-[#a1a1aa] block text-[9px] uppercase font-bold",children:"Rule Points"}),(0,s.jsxs)("span",{className:"font-bold text-white",children:["+",_.rule_contrib||0," pts"]})]}),(0,s.jsxs)("div",{className:"p-2 rounded bg-[#18181b] border border-[#27272a] text-center",children:[s.jsx("span",{className:"text-[#a1a1aa] block text-[9px] uppercase font-bold",children:"ML Outlier Points"}),(0,s.jsxs)("span",{className:"font-bold text-white",children:["+",_.ml_contrib||0," pts"]})]}),(0,s.jsxs)("div",{className:"p-2 rounded bg-[#18181b] border border-[#27272a] text-center",children:[s.jsx("span",{className:"text-[#a1a1aa] block text-[9px] uppercase font-bold",children:"Graph Cluster Points"}),(0,s.jsxs)("span",{className:"font-bold text-white",children:["+",_.graph_contrib||0," pts"]})]})]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs",children:[(0,s.jsxs)("div",{className:"p-3 rounded bg-[#09090b] border border-[#27272a]",children:[s.jsx("span",{className:"text-[10px] text-[#a1a1aa] uppercase font-semibold",children:"Gross Salary"}),(0,s.jsxs)("p",{className:"text-sm font-bold text-white mt-0.5",children:["$",_.gross_salary.toLocaleString()]})]}),(0,s.jsxs)("div",{className:"p-3 rounded bg-[#09090b] border border-[#27272a]",children:[s.jsx("span",{className:"text-[10px] text-[#a1a1aa] uppercase font-semibold",children:"Overtime"}),(0,s.jsxs)("p",{className:"text-sm font-bold text-white mt-0.5",children:[_.overtime_hours," hrs"]})]}),(0,s.jsxs)("div",{className:"p-3 rounded bg-[#09090b] border border-[#27272a]",children:[s.jsx("span",{className:"text-[10px] text-[#a1a1aa] uppercase font-semibold",children:"Attendance"}),(0,s.jsxs)("p",{className:`text-sm font-bold mt-0.5 ${0===_.attendance_days?"text-[#fca5a5]":"text-white"}`,children:[_.attendance_days," days"]})]}),(0,s.jsxs)("div",{className:"p-3 rounded bg-[#09090b] border border-[#27272a]",children:[s.jsx("span",{className:"text-[10px] text-[#a1a1aa] uppercase font-semibold",children:"Bank Account"}),s.jsx("p",{className:"text-sm font-bold text-white mt-0.5",children:_.bank_account_no||"Data unavailable"})]})]})]}),(0,s.jsxs)("div",{className:"enterprise-card p-5 space-y-3",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider border-b border-[#27272a] pb-3",children:[s.jsx(d,{className:"w-4 h-4 text-white"})," Layer 1 — Deterministic Rule Engine"]}),N.length>0?s.jsx("div",{className:"space-y-2",children:N.map(e=>(0,s.jsxs)("div",{className:"p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-1",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center font-mono",children:[(0,s.jsxs)("span",{className:"text-[10px] font-bold bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d] px-2 py-0.5 rounded",children:[e.severity," • ",e.rule_code]}),s.jsx("span",{className:"text-[10px] text-[#71717a]",children:"Rule Violation"})]}),s.jsx("h4",{className:"text-xs font-bold text-white mt-1",children:e.title}),s.jsx("p",{className:"text-xs text-[#a1a1aa] font-mono leading-relaxed",children:e.description})]},e.id))}):s.jsx("div",{className:"text-xs text-[#6ee7b7] font-mono p-3 bg-[#09090b] border border-[#27272a] rounded",children:"✓ No deterministic policy violations detected."})]}),(0,s.jsxs)("div",{className:"enterprise-card p-5 space-y-3",children:[(0,s.jsxs)("div",{className:"flex items-center justify-between border-b border-[#27272a] pb-3",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider",children:[s.jsx(l.Z,{className:"w-4 h-4 text-white"})," Layer 2 — Statistical ML Outlier Engine"]}),s.jsx("span",{className:"text-[10px] font-mono font-bold text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded",children:"Core Principle: ANOMALY ≠ FRAUD"})]}),k.length>0?s.jsx("div",{className:"space-y-2 font-mono",children:k.map(e=>(0,s.jsxs)("div",{className:"p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-2",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center text-xs",children:[s.jsx("span",{className:"font-bold text-white",children:e.title}),(0,s.jsxs)("span",{className:"text-[10px] bg-[#27272a] text-white px-2 py-0.5 rounded border border-[#3f3f46]",children:["Model: ",e.evidence_json?.model||"Isolation Forest"]})]}),s.jsx("p",{className:"text-xs text-[#a1a1aa] leading-relaxed",children:e.description}),e.evidence_json?.major_deviations&&(0,s.jsxs)("div",{className:"p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1 text-[11px]",children:[s.jsx("span",{className:"text-[#a1a1aa] font-bold uppercase block text-[9px]",children:"Calculated Baseline Deviations"}),e.evidence_json.major_deviations.map((e,t)=>(0,s.jsxs)("div",{className:"text-white flex items-center gap-1.5",children:[s.jsx("span",{className:"text-red-400",children:"•"})," ",e]},t))]})]},e.id))}):s.jsx("div",{className:"text-xs text-[#6ee7b7] font-mono p-3 bg-[#09090b] border border-[#27272a] rounded",children:"✓ Feature values conform to standard population baselines. No multivariate ML anomaly detected."})]}),(0,s.jsxs)("div",{className:"enterprise-card p-5 space-y-3",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider border-b border-[#27272a] pb-3",children:[s.jsx(c.Z,{className:"w-4 h-4 text-white"})," Layer 3 — Enterprise Trust Graph Topology"]}),w.length>0?s.jsx("div",{className:"space-y-2 font-mono",children:w.map(e=>(0,s.jsxs)("div",{className:"p-3.5 rounded bg-[#3f1214] border border-[#7f1d1d] text-[#fca5a5] space-y-1",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center",children:[s.jsx("span",{className:"text-[10px] font-bold bg-[#5c1d20] text-white px-2 py-0.5 rounded",children:"CRITICAL CLUSTER DETECTED"}),s.jsx("span",{className:"text-[10px]",children:e.rule_code})]}),s.jsx("h4",{className:"text-xs font-bold text-white mt-1",children:e.title}),s.jsx("p",{className:"text-xs leading-relaxed text-[#fca5a5]",children:e.description})]},e.id))}):s.jsx("div",{className:"text-xs text-[#6ee7b7] font-mono p-3 bg-[#09090b] border border-[#27272a] rounded",children:"✓ Unique payment destination. No shared infrastructure or fraud cluster relationship detected."})]}),(0,s.jsxs)("div",{className:"enterprise-card p-5 flex flex-wrap items-center gap-3",children:[s.jsx("button",{onClick:()=>u(`Individual payment for ${_.employee_name} placed on HOLD.`),className:"btn-solid-secondary",children:"Hold Payment"}),(0,s.jsxs)("button",{onClick:()=>(0,i.B)(_,j),className:"btn-solid-primary",children:[s.jsx(p.Z,{className:"w-3.5 h-3.5"})," Export Individual Evidence Packet"]}),g&&(0,s.jsxs)("span",{className:"text-xs font-mono font-semibold text-[#6ee7b7] flex items-center gap-1.5 ml-auto",children:[s.jsx(x.Z,{className:"w-4 h-4"})," ",g]})]})]}):null})]})]})}function f(){return s.jsx(o.Suspense,{fallback:s.jsx("div",{className:"text-white text-xs font-mono p-5",children:"Loading Investigation Workspace..."}),children:s.jsx(m,{})})}},4153:(e,t,a)=>{"use strict";function s(e){let t=window.open("","_blank");if(!t){alert("Please allow popups to export the audit report.");return}let a=e.risk_findings||[],s=e.transactions||[],o=a.filter(e=>"RULE"===e.layer),r=a.filter(e=>"ANOMALY"===e.layer),i=a.filter(e=>"GRAPH"===e.layer),n=e.approved_amount||s.filter(e=>"APPROVED"===e.status).reduce((e,t)=>e+t.gross_salary,0),d=e.held_amount||s.filter(e=>"FLAG_REVIEW"===e.status||"HOLD"===e.status).reduce((e,t)=>e+t.gross_salary,0),l=e.blocked_amount||s.filter(e=>"BLOCKED"===e.status).reduce((e,t)=>e+t.gross_salary,0),c=a.length>0?a.map(e=>`
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
  `).join(""):'<p style="color: #6ee7b7; font-family: monospace;">No risk findings recorded for this batch. All evaluation checks passed cleanly.</p>',p=`
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
        Multi-Layer Risk Findings (${a.length} total: ${o.length} Rule, ${r.length} ML, ${i.length} Graph)
      </h2>
      ${c}

      <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 32px;">
        Employee Transaction Summary (${s.length})
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
          ${s.map(e=>`
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
  `;t.document.write(p),t.document.close()}function o(e,t){let a=window.open("","_blank");if(!a){alert("Please allow popups to export the employee evidence packet.");return}let s=t.filter(t=>t.employee_id===e.employee_id||t.employee_name&&e.employee_name&&t.employee_name.includes(e.employee_name)),o=`
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
        Multi-Layer Evidence Checklist (${s.length})
      </h2>
      ${s.length>0?s.map(e=>`
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
  `;a.document.write(o),a.document.close()}a.d(t,{$:()=>s,B:()=>o})},5344:(e,t,a)=>{"use strict";a.r(t),a.d(t,{$$typeof:()=>i,__esModule:()=>r,default:()=>n});var s=a(8570);let o=(0,s.createProxy)(String.raw`C:\Users\SHIVANSH\payroll_fintech\frontend\src\app\investigation\page.tsx`),{__esModule:r,$$typeof:i}=o;o.default;let n=(0,s.createProxy)(String.raw`C:\Users\SHIVANSH\payroll_fintech\frontend\src\app\investigation\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[729,491],()=>a(986));module.exports=s})();