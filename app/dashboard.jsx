/* ============================================================
   DASHBOARD — Role-based overview
   ============================================================ */

const DASH_ROLES = [
  'General Manager', 'Planning Officer', 'Project Manager',
  'Quality Inspector', 'Quality Head', 'Finance Officer', 'Dispatch In-charge',
];

/* ---- sample data ---- */

const DB_PROJECTS = [
  { id: 'PROJ-2026-0018', name: 'Structural Beams — Bay 4',   client: 'Acme Infrastructure Ltd.', pm: 'R. Okafor', phase: 'QC',       phaseN: 4, target: '30 Jun 2026', po: 18.4, risk: false },
  { id: 'PROJ-2026-0014', name: 'Column Sections — Block C',  client: 'Metro Builders',           pm: 'S. Rao',    phase: 'Dispatch',  phaseN: 5, target: '28 Jun 2026', po: 12.1, risk: false },
  { id: 'PROJ-2026-0011', name: 'Roof Trusses — Phase 2',     client: 'Horizon Infra',            pm: 'R. Okafor', phase: 'Fit-Up',   phaseN: 3, target: '05 Jul 2026', po:  9.8, risk: true  },
  { id: 'PROJ-2026-0009', name: 'Pipe Supports — Plant A',    client: 'ChemCo Industries',        pm: 'P. Nair',   phase: 'Beamline', phaseN: 2, target: '08 Jul 2026', po:  6.2, risk: false },
  { id: 'PROJ-2026-0007', name: 'Gantry Frames — Unit 2',     client: 'Portline Pvt. Ltd.',       pm: 'S. Rao',    phase: 'Cutting',  phaseN: 1, target: '12 Jul 2026', po: 22.3, risk: false },
  { id: 'PROJ-2026-0005', name: 'Mezzanine Floor — Level 3',  client: 'Acme Infrastructure Ltd.', pm: 'P. Nair',   phase: 'Cutting',  phaseN: 1, target: '18 Jul 2026', po:  7.5, risk: false },
];

const DB_DISPUTES = [
  { id: 'DSP-004', proj: 'PROJ-2026-0011', phase: 'Fit-Up',   by: 'Planning Officer', date: '29 Jun 2026', issue: 'Weld alignment deviation on beam 3B',       status: 'Open'      },
  { id: 'DSP-003', proj: 'PROJ-2026-0018', phase: 'QC',       by: 'Project Manager',  date: '27 Jun 2026', issue: 'DFT reading below spec on panel 7',           status: 'In Review' },
  { id: 'DSP-002', proj: 'PROJ-2026-0014', phase: 'Dispatch', by: 'Planning Officer', date: '25 Jun 2026', issue: 'Packing list discrepancy — 2 items missing',  status: 'Resolved'  },
];

const DB_ACTIVITIES = [
  { time: '10:42 AM',  user: 'Meera Joshi',    action: 'completed QC checklist',              proj: 'PROJ-2026-0018' },
  { time: '09:18 AM',  user: 'V. Patil',        action: 'verified and signed packing list',   proj: 'PROJ-2026-0014' },
  { time: '08:55 AM',  user: 'Planning Officer', action: 'raised dispute DSP-004',             proj: 'PROJ-2026-0011' },
  { time: 'Yesterday', user: 'R. Okafor',        action: 'submitted Fit-Up inspection report', proj: 'PROJ-2026-0011' },
  { time: 'Yesterday', user: 'S. Rao',           action: 'completed Beamline phase',           proj: 'PROJ-2026-0009' },
];

const DB_FINANCIALS = [
  { id: 'PROJ-2026-0018', name: 'Structural Beams — Bay 4',  phase: 'QC',       po: 18.4, inv: 12.5, payStatus: 'Pending' },
  { id: 'PROJ-2026-0014', name: 'Column Sections — Block C', phase: 'Dispatch',  po: 12.1, inv: 12.1, payStatus: 'Paid'    },
  { id: 'PROJ-2026-0011', name: 'Roof Trusses — Phase 2',    phase: 'Fit-Up',   po:  9.8, inv:  5.5, payStatus: 'Pending' },
  { id: 'PROJ-2026-0009', name: 'Pipe Supports — Plant A',   phase: 'Beamline', po:  6.2, inv:  6.2, payStatus: 'Paid'    },
  { id: 'PROJ-2026-0007', name: 'Gantry Frames — Unit 2',    phase: 'Cutting',  po: 22.3, inv: 10.5, payStatus: 'Partial' },
  { id: 'PROJ-2026-0005', name: 'Mezzanine Floor — Level 3', phase: 'Cutting',  po:  7.5, inv:  5.3, payStatus: 'Pending' },
];

/* ---- shared UI ---- */

const PHASE_COLORS = {
  Cutting:  { bg: '#FFF7ED', fg: '#C2410C' },
  Beamline: { bg: '#EFF6FF', fg: '#1D4ED8' },
  'Fit-Up': { bg: '#F0FDF4', fg: '#15803D' },
  QC:       { bg: '#FAF5FF', fg: '#7E22CE' },
  Dispatch: { bg: '#ECFEFF', fg: '#0E7490' },
};

function PhaseTag({ phase }) {
  const c = PHASE_COLORS[phase] || { bg: '#F0F0EE', fg: '#57564F' };
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.fg }}>{phase}</span>
  );
}

function RiskBadge({ risk }) {
  return risk
    ? <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309]">At Risk</span>
    : <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[#E6F6EC] text-[#15803D]">On Track</span>;
}

function DSpBadge({ status }) {
  const map = { Open: { bg: '#FEF3C7', fg: '#B45309' }, 'In Review': { bg: '#EFF6FF', fg: '#1D4ED8' }, Resolved: { bg: '#E6F6EC', fg: '#15803D' } };
  const s = map[status] || { bg: '#F0F0EE', fg: '#57564F' };
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ background: s.bg, color: s.fg }}>{status}</span>;
}

function PayBadge({ status }) {
  const map = { Paid: { bg: '#E6F6EC', fg: '#15803D' }, Pending: { bg: '#FEF3C7', fg: '#B45309' }, Partial: { bg: '#EFF6FF', fg: '#1D4ED8' } };
  const s = map[status] || { bg: '#F0F0EE', fg: '#57564F' };
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: s.bg, color: s.fg }}>{status}</span>;
}

function StatCard({ label, value, sub, color, bg, icon }) {
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-xl p-5 shadow-[0_1px_3px_rgba(26,26,23,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-[#84837C] font-semibold uppercase tracking-[0.06em] mb-1.5">{label}</div>
          <div className="text-[28px] font-bold text-[#1A1A17] leading-none tracking-tight">{value}</div>
        </div>
        <span className="w-10 h-10 rounded-lg grid place-items-center flex-none" style={{ background: bg, color }}>
          <Icon name={icon} className="w-5 h-5" strokeWidth={1.8} />
        </span>
      </div>
      {sub && <div className="text-[12px] text-[#84837C] mt-2.5">{sub}</div>}
    </div>
  );
}

function Card({ title, action, children }) {
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-xl shadow-[0_1px_3px_rgba(26,26,23,0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0F0EE]">
        <h3 className="text-[14px] font-semibold text-[#1A1A17]">{title}</h3>
        {action && <span className="text-[12px] font-semibold text-[#1D4ED8] cursor-pointer hover:underline">{action}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function TH({ children }) {
  return <th className="text-left text-[11px] font-semibold text-[#84837C] uppercase tracking-[0.05em] pb-2.5 pr-4 whitespace-nowrap">{children}</th>;
}

function Empty({ msg }) {
  return <div className="text-[13px] text-[#84837C] py-6 text-center">{msg}</div>;
}

function Initials({ name }) {
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/* ---- General Manager ---- */
function GMDashboard() {
  const totalPO = DB_PROJECTS.reduce((s, p) => s + p.po, 0);
  const openD   = DB_DISPUTES.filter(d => d.status !== 'Resolved').length;
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Projects"    value="6"   sub="3 PMs · 4 clients"      icon="projects"    color="#1D4ED8" bg="#EFF6FF" />
        <StatCard label="Projects At Risk"   value="1"   sub="Roof Trusses delayed"    icon="disputes"    color="#B45309" bg="#FEF3C7" />
        <StatCard label="Open Disputes"      value={String(openD)} sub="1 raised today"  icon="disputes"    color="#C2410C" bg="#FCEEE4" />
        <StatCard label="Total PO Value"     value={'Rs.' + totalPO.toFixed(1) + 'L'} sub="All active projects" icon="po" color="#15803D" bg="#E6F6EC" />
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-5">
        <Card title="All Projects" action="Export">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead><tr><TH>Project</TH><TH>Phase</TH><TH>PM</TH><TH>Target</TH><TH>PO Value</TH><TH>Status</TH></tr></thead>
              <tbody>
                {DB_PROJECTS.map(p => (
                  <tr key={p.id} className="border-t border-[#F0F0EE] hover:bg-[#FAFAF8]">
                    <td className="py-2.5 pr-4">
                      <div className="text-[13px] font-semibold text-[#1A1A17]">{p.name}</div>
                      <div className="text-[11px] font-mono text-[#84837C]">{p.id}</div>
                    </td>
                    <td className="py-2.5 pr-4"><PhaseTag phase={p.phase} /></td>
                    <td className="py-2.5 pr-4 text-[12px] text-[#57564F] whitespace-nowrap">{p.pm}</td>
                    <td className="py-2.5 pr-4 text-[12px] font-mono text-[#57564F] whitespace-nowrap">{p.target}</td>
                    <td className="py-2.5 pr-4 text-[13px] font-semibold font-mono text-[#1A1A17]">Rs.{p.po}L</td>
                    <td className="py-2.5"><RiskBadge risk={p.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Disputes and Issues">
            {DB_DISPUTES.map(d => (
              <div key={d.id} className="py-3 border-b border-[#F0F0EE] last:border-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[11px] text-[#84837C]">{d.id} · {d.proj}</span>
                  <DSpBadge status={d.status} />
                </div>
                <div className="text-[13px] text-[#1A1A17] mb-0.5">{d.issue}</div>
                <div className="text-[11px] font-mono text-[#84837C]">{d.phase} · {d.date} · {d.by}</div>
              </div>
            ))}
          </Card>

          <Card title="Recent Activity">
            {DB_ACTIVITIES.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[#F0F0EE] last:border-0">
                <span className="w-7 h-7 rounded-full bg-[#F0F0EE] grid place-items-center flex-none text-[10px] font-bold font-mono text-[#57564F] mt-0.5"><Initials name={a.user} /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[#1A1A17]"><span className="font-semibold">{a.user}</span> {a.action}</div>
                  <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{a.proj} · {a.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- Planning Officer ---- */
function PODashboard() {
  const myDisputes = DB_DISPUTES.filter(d => d.by === 'Planning Officer');
  const atRisk = DB_PROJECTS.filter(p => p.risk).length;
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Projects"   value="6"              sub="Under planning oversight"   icon="projects" color="#1D4ED8" bg="#EFF6FF" />
        <StatCard label="Due This Week"     value="2"              sub="PROJ-0018 · PROJ-0014"      icon="production" color="#C2410C" bg="#FCEEE4" />
        <StatCard label="At Risk"           value={String(atRisk)} sub="Roof Trusses delayed"       icon="disputes" color="#B45309" bg="#FEF3C7" />
        <StatCard label="Disputes Raised"   value={String(myDisputes.length)} sub="2 open · 1 resolved" icon="disputes" color="#7E22CE" bg="#FAF5FF" />
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-5">
        <Card title="Project Schedule" action="Export">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead><tr><TH>Project</TH><TH>Phase</TH><TH>PM</TH><TH>Target</TH><TH>Status</TH></tr></thead>
              <tbody>
                {DB_PROJECTS.map(p => (
                  <tr key={p.id} className="border-t border-[#F0F0EE] hover:bg-[#FAFAF8]">
                    <td className="py-2.5 pr-4">
                      <div className="text-[13px] font-semibold text-[#1A1A17]">{p.name}</div>
                      <div className="text-[11px] font-mono text-[#84837C]">{p.id}</div>
                    </td>
                    <td className="py-2.5 pr-4"><PhaseTag phase={p.phase} /></td>
                    <td className="py-2.5 pr-4 text-[12px] text-[#57564F] whitespace-nowrap">{p.pm}</td>
                    <td className="py-2.5 pr-4 text-[12px] font-mono text-[#57564F] whitespace-nowrap">{p.target}</td>
                    <td className="py-2.5"><RiskBadge risk={p.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="My Disputes">
            {myDisputes.length === 0 ? <Empty msg="No disputes raised." /> : myDisputes.map(d => (
              <div key={d.id} className="py-3 border-b border-[#F0F0EE] last:border-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[11px] text-[#84837C]">{d.id} · {d.proj}</span>
                  <DSpBadge status={d.status} />
                </div>
                <div className="text-[13px] text-[#1A1A17] mb-0.5">{d.issue}</div>
                <div className="text-[11px] font-mono text-[#84837C]">{d.phase} · {d.date}</div>
              </div>
            ))}
          </Card>

          <Card title="Phase Distribution">
            {['Cutting', 'Beamline', 'Fit-Up', 'QC', 'Dispatch'].map(ph => {
              const count = DB_PROJECTS.filter(p => p.phase === ph).length;
              const c = PHASE_COLORS[ph] || { fg: '#84837C' };
              return (
                <div key={ph} className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
                  <PhaseTag phase={ph} />
                  <div className="flex-1 h-1.5 rounded-full bg-[#F0F0EE] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: (count / DB_PROJECTS.length * 100) + '%', background: c.fg }} />
                  </div>
                  <span className="text-[12px] font-mono font-semibold text-[#1A1A17] w-4 text-right">{count}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- Project Manager (R. Okafor) ---- */
function PMDashboard() {
  const myProjs = DB_PROJECTS.filter(p => p.pm === 'R. Okafor');
  const myDisp  = DB_DISPUTES.filter(d => myProjs.some(p => p.id === d.proj));
  const myAct   = DB_ACTIVITIES.filter(a => myProjs.some(p => p.id === a.proj));
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="My Projects"    value={String(myProjs.length)} sub="Currently active"           icon="projects"    color="#1D4ED8" bg="#EFF6FF" />
        <StatCard label="Checklist Rate" value="89%"                    sub="47 of 53 items completed"   icon="check"       color="#15803D" bg="#E6F6EC" />
        <StatCard label="At Risk"        value={String(myProjs.filter(p => p.risk).length)} sub="Roof Trusses delayed" icon="disputes" color="#B45309" bg="#FEF3C7" />
        <StatCard label="Docs Uploaded"  value="12"                     sub="This week"                  icon="paperclip"   color="#7E22CE" bg="#FAF5FF" />
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        {myProjs.map(p => (
          <Card key={p.id} title={p.name}>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PhaseTag phase={p.phase} />
                  <span className="text-[12px] text-[#84837C]">Phase {p.phaseN} of 5</span>
                </div>
                <RiskBadge risk={p.risk} />
              </div>
              <div>
                <div className="flex justify-between text-[12px] text-[#57564F] mb-1.5">
                  <span>Overall progress</span>
                  <span className="font-mono font-semibold text-[#1A1A17]">{Math.round(p.phaseN / 5 * 100)}%</span>
                </div>
                <Progress done={p.phaseN} total={5} />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] pt-2.5 border-t border-[#F0F0EE]">
                <div><span className="text-[#84837C] block text-[11px]">Client</span><span className="font-semibold text-[#1A1A17]">{p.client}</span></div>
                <div><span className="text-[#84837C] block text-[11px]">Target</span><span className="font-mono font-semibold text-[#1A1A17]">{p.target}</span></div>
                <div><span className="text-[#84837C] block text-[11px]">PO Value</span><span className="font-mono font-semibold text-[#1A1A17]">Rs.{p.po}L</span></div>
                <div><span className="text-[#84837C] block text-[11px]">Project ID</span><span className="font-mono font-semibold text-[#1A1A17]">{p.id}</span></div>
              </div>
            </div>
          </Card>
        ))}

        <Card title="Activity on My Projects">
          {myAct.length === 0 ? <Empty msg="No recent activity." /> : myAct.map((a, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[#F0F0EE] last:border-0">
              <span className="w-7 h-7 rounded-full bg-[#F0F0EE] grid place-items-center flex-none text-[10px] font-bold font-mono text-[#57564F]"><Initials name={a.user} /></span>
              <div>
                <div className="text-[12px] text-[#1A1A17]"><span className="font-semibold">{a.user}</span> {a.action}</div>
                <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{a.proj} · {a.time}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Disputes on My Projects">
          {myDisp.length === 0 ? <Empty msg="No disputes on your projects." /> : myDisp.map(d => (
            <div key={d.id} className="py-2.5 border-b border-[#F0F0EE] last:border-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-[11px] text-[#84837C]">{d.id}</span>
                <DSpBadge status={d.status} />
              </div>
              <div className="text-[13px] text-[#1A1A17] mb-0.5">{d.issue}</div>
              <div className="text-[11px] font-mono text-[#84837C]">{d.phase} · {d.date} · Raised by {d.by}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ---- Quality Inspector ---- */
function QIDashboard() {
  const pending = DB_PROJECTS.filter(p => p.phase === 'Fit-Up');
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Pending Inspections"  value={String(pending.length)} sub="Fit-Up phase"        icon="quality"  color="#7E22CE" bg="#FAF5FF" />
        <StatCard label="Completed This Week"  value="5"                      sub="Last 7 days"          icon="check"    color="#15803D" bg="#E6F6EC" />
        <StatCard label="Pass Rate"            value="96%"                    sub="24 of 25 passed"      icon="quality"  color="#1D4ED8" bg="#EFF6FF" />
        <StatCard label="Open Issues"          value="1"                      sub="DSP-004 · beam 3B"    icon="disputes" color="#B45309" bg="#FEF3C7" />
      </div>

      <div className="grid xl:grid-cols-[1.2fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <Card title="Inspection Queue">
            {pending.length === 0 ? <Empty msg="No pending inspections." /> : pending.map(p => (
              <div key={p.id} className="border border-[#F0F0EE] rounded-lg p-4 mb-3 last:mb-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#1A1A17]">{p.name}</div>
                    <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{p.id} · {p.client}</div>
                  </div>
                  <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] whitespace-nowrap">Awaiting Inspection</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px] mb-3">
                  <div><span className="text-[#84837C]">PM: </span><span className="font-medium text-[#1A1A17]">{p.pm}</span></div>
                  <div><span className="text-[#84837C]">Target: </span><span className="font-mono text-[#1A1A17]">{p.target}</span></div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-md bg-[#1D4ED8] text-white text-[13px] font-semibold">Start Inspection</button>
                  <button className="px-4 py-2 rounded-md border border-[#C9C9C3] text-[13px] text-[#57564F]">View Details</button>
                </div>
              </div>
            ))}
          </Card>

          <Card title="Checklist Completion">
            {[
              { item: 'Dimensional verification', done: 25, total: 25 },
              { item: 'Weld visual inspection',   done: 23, total: 25 },
              { item: 'Alignment check',           done: 22, total: 25 },
              { item: 'Surface defect review',    done: 25, total: 25 },
            ].map((c, i) => (
              <div key={i} className="mb-3.5 last:mb-0">
                <div className="flex justify-between text-[12px] text-[#57564F] mb-1.5">
                  <span>{c.item}</span>
                  <span className="font-mono font-semibold text-[#1A1A17]">{c.done}/{c.total}</span>
                </div>
                <Progress done={c.done} total={c.total} tone={c.done === c.total ? '#15803D' : '#1D4ED8'} />
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Recent Inspections">
            {[
              { proj: 'PROJ-2026-0009', name: 'Pipe Supports — Plant A',   result: 'Pass', date: '27 Jun 2026' },
              { proj: 'PROJ-2026-0007', name: 'Gantry Frames — Unit 2',    result: 'Pass', date: '25 Jun 2026' },
              { proj: 'PROJ-2026-0005', name: 'Mezzanine Floor — Level 3', result: 'Pass', date: '23 Jun 2026' },
              { proj: 'PROJ-2026-0003', name: 'Steel Columns — Block A',   result: 'Fail', date: '20 Jun 2026' },
              { proj: 'PROJ-2026-0001', name: 'Platform Frames — West',    result: 'Pass', date: '15 Jun 2026' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
                <span className="w-2 h-2 rounded-full flex-none" style={{ background: r.result === 'Pass' ? '#15803D' : '#B91C1C' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#1A1A17] truncate">{r.name}</div>
                  <div className="text-[11px] font-mono text-[#84837C]">{r.proj} · {r.date}</div>
                </div>
                <span className="text-[12px] font-semibold" style={{ color: r.result === 'Pass' ? '#15803D' : '#B91C1C' }}>{r.result}</span>
              </div>
            ))}
          </Card>

          <Card title="Open Issues">
            {DB_DISPUTES.filter(d => d.status !== 'Resolved').map(d => (
              <div key={d.id} className="py-2.5 border-b border-[#F0F0EE] last:border-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[11px] text-[#84837C]">{d.id}</span>
                  <DSpBadge status={d.status} />
                </div>
                <div className="text-[13px] text-[#1A1A17] mb-0.5">{d.issue}</div>
                <div className="text-[11px] font-mono text-[#84837C]">{d.proj} · {d.phase} · {d.date}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- Quality Head ---- */
function QHDashboard() {
  const qcQueue = DB_PROJECTS.filter(p => p.phase === 'QC');
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="QC Pending Approval"  value={String(qcQueue.length)} sub="Awaiting final sign-off"   icon="quality"  color="#7E22CE" bg="#FAF5FF" />
        <StatCard label="Approved This Month"   value="4"                      sub="All passed first review"   icon="check"    color="#15803D" bg="#E6F6EC" />
        <StatCard label="Issues Raised"         value="2"                      sub="1 open · 1 resolved"       icon="disputes" color="#B45309" bg="#FEF3C7" />
        <StatCard label="On-Time Rate"          value="100%"                   sub="June 2026"                 icon="quality"  color="#1D4ED8" bg="#EFF6FF" />
      </div>

      <div className="grid xl:grid-cols-[1.2fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <Card title="QC Approval Queue">
            {qcQueue.length === 0 ? <Empty msg="No projects awaiting QC approval." /> : qcQueue.map(p => (
              <div key={p.id} className="border border-[#F0F0EE] rounded-lg p-4 mb-3 last:mb-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#1A1A17]">{p.name}</div>
                    <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{p.id} · {p.client}</div>
                  </div>
                  <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] whitespace-nowrap">Pending Sign-off</span>
                </div>
                <div className="mb-3">
                  {[
                    { label: 'Surface preparation inspected',  done: true },
                    { label: 'Primer coat applied and dried',  done: true },
                    { label: 'Paint thickness verified (DFT)', done: true },
                    { label: 'Finishing quality meets spec',   done: true },
                    { label: 'QC report completed and signed', done: true },
                    { label: 'Marked ready for dispatch',      done: false },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#F0F0EE] last:border-0">
                      <span className="w-4 h-4 rounded-full grid place-items-center flex-none"
                        style={{ background: c.done ? '#15803D' : 'transparent', border: c.done ? 'none' : '2px solid #C9C9C3' }}>
                        {c.done && <Icon name="check" className="w-2.5 h-2.5 text-white" strokeWidth={2.8} />}
                      </span>
                      <span className="text-[12px] flex-1" style={{ color: c.done ? '#84837C' : '#1A1A17', fontWeight: c.done ? 400 : 600 }}>{c.label}</span>
                      {!c.done && <span className="text-[11px] text-[#B45309] font-semibold">Pending</span>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-md text-white text-[13px] font-semibold" style={{ background: '#15803D' }}>Approve QC</button>
                  <button className="px-4 py-2 rounded-md border text-[13px] font-semibold" style={{ borderColor: '#C2410C', color: '#C2410C' }}>Raise Issue</button>
                </div>
              </div>
            ))}
          </Card>

          <Card title="Quality Metrics — June 2026">
            {[
              { metric: 'DFT Pass Rate',        value: '94%',      note: '+2% vs May'       },
              { metric: 'First-Pass Approval',  value: '100%',     note: 'All 4 approved'   },
              { metric: 'Avg. QC Duration',     value: '1.4 days', note: '-0.3d vs May'     },
              { metric: 'Issues Raised',        value: '2',        note: '1 open · 1 closed'},
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#F0F0EE] last:border-0">
                <span className="text-[13px] text-[#57564F]">{m.metric}</span>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#1A1A17]">{m.value}</div>
                  <div className="text-[11px] font-mono text-[#84837C]">{m.note}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Issues Log">
            {DB_DISPUTES.map(d => (
              <div key={d.id} className="py-2.5 border-b border-[#F0F0EE] last:border-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[11px] text-[#84837C]">{d.id}</span>
                  <DSpBadge status={d.status} />
                </div>
                <div className="text-[13px] text-[#1A1A17] mb-0.5">{d.issue}</div>
                <div className="text-[11px] font-mono text-[#84837C]">{d.proj} · {d.phase} · {d.date}</div>
              </div>
            ))}
          </Card>

          <Card title="Recent QC Approvals">
            {[
              { proj: 'PROJ-2026-0012', name: 'Steel Columns — Block B', date: '24 Jun 2026' },
              { proj: 'PROJ-2026-0009', name: 'Pipe Supports — Plant A', date: '20 Jun 2026' },
              { proj: 'PROJ-2026-0006', name: 'Walkway Grating',         date: '15 Jun 2026' },
              { proj: 'PROJ-2026-0003', name: 'Steel Columns — Block A', date: '10 Jun 2026' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
                <span className="w-7 h-7 rounded-full bg-[#E6F6EC] text-[#15803D] grid place-items-center flex-none">
                  <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#1A1A17] truncate">{a.name}</div>
                  <div className="text-[11px] font-mono text-[#84837C]">{a.proj} · Approved {a.date}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- Finance Officer ---- */
function FODashboard() {
  const totalPO  = DB_FINANCIALS.reduce((s, f) => s + f.po,  0);
  const totalInv = DB_FINANCIALS.reduce((s, f) => s + f.inv, 0);
  const pending  = totalPO - totalInv;
  const invPct   = Math.round(totalInv / totalPO * 100);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total PO Value"    value={'Rs.' + totalPO.toFixed(1) + 'L'}  sub="All active projects"               icon="po"       color="#15803D" bg="#E6F6EC" />
        <StatCard label="Total Invoiced"    value={'Rs.' + totalInv.toFixed(1) + 'L'} sub={invPct + '% of total PO value'}    icon="po"       color="#1D4ED8" bg="#EFF6FF" />
        <StatCard label="Pending Invoice"   value={'Rs.' + pending.toFixed(1) + 'L'}  sub="Not yet billed"                    icon="disputes" color="#B45309" bg="#FEF3C7" />
        <StatCard label="Active Projects"   value="6"                                  sub="Across 3 project managers"         icon="projects" color="#7E22CE" bg="#FAF5FF" />
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-5">
        <Card title="Project Financials" action="Export CSV">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead><tr><TH>Project</TH><TH>Phase</TH><TH>PO Value</TH><TH>Invoiced</TH><TH>Balance</TH><TH>Status</TH></tr></thead>
              <tbody>
                {DB_FINANCIALS.map(f => {
                  const bal = f.po - f.inv;
                  return (
                    <tr key={f.id} className="border-t border-[#F0F0EE] hover:bg-[#FAFAF8]">
                      <td className="py-2.5 pr-4">
                        <div className="text-[12px] font-semibold text-[#1A1A17]">{f.name}</div>
                        <div className="text-[11px] font-mono text-[#84837C]">{f.id}</div>
                      </td>
                      <td className="py-2.5 pr-4"><PhaseTag phase={f.phase} /></td>
                      <td className="py-2.5 pr-4 text-[13px] font-mono font-semibold text-[#1A1A17]">Rs.{f.po.toFixed(1)}L</td>
                      <td className="py-2.5 pr-4 text-[13px] font-mono text-[#57564F]">Rs.{f.inv.toFixed(1)}L</td>
                      <td className="py-2.5 pr-4 text-[13px] font-mono font-semibold" style={{ color: bal > 0 ? '#B45309' : '#15803D' }}>
                        {bal === 0 ? '—' : 'Rs.' + bal.toFixed(1) + 'L'}
                      </td>
                      <td className="py-2.5"><PayBadge status={f.payStatus} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Invoice Summary">
            {[
              { inv: 'INV-2026-0031', proj: 'PROJ-2026-0014', amt: 'Rs.12.1L', status: 'Paid'    },
              { inv: 'INV-2026-0028', proj: 'PROJ-2026-0009', amt: 'Rs.6.2L',  status: 'Paid'    },
              { inv: 'INV-2026-0025', proj: 'PROJ-2026-0018', amt: 'Rs.12.5L', status: 'Pending' },
              { inv: 'INV-2026-0022', proj: 'PROJ-2026-0007', amt: 'Rs.10.5L', status: 'Partial' },
              { inv: 'INV-2026-0019', proj: 'PROJ-2026-0011', amt: 'Rs.5.5L',  status: 'Pending' },
              { inv: 'INV-2026-0016', proj: 'PROJ-2026-0005', amt: 'Rs.5.3L',  status: 'Pending' },
            ].map((inv, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#1A1A17]">{inv.inv}</div>
                  <div className="text-[11px] font-mono text-[#84837C]">{inv.proj} · {inv.amt}</div>
                </div>
                <PayBadge status={inv.status} />
              </div>
            ))}
          </Card>

          <Card title="Budget Utilisation">
            {[
              { label: 'PO Value (Total)', pct: 100,    color: '#1D4ED8' },
              { label: 'Invoiced',         pct: invPct, color: '#7E22CE' },
              { label: 'Collected',        pct: 47,     color: '#15803D' },
            ].map((b, i) => (
              <div key={i} className="mb-3.5 last:mb-0">
                <div className="flex justify-between text-[12px] text-[#57564F] mb-1.5">
                  <span>{b.label}</span>
                  <span className="font-mono font-semibold text-[#1A1A17]">{b.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#F0F0EE] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: b.pct + '%', background: b.color }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- Dispatch In-charge ---- */
function DIDashboard() {
  const dispatchQ = DB_PROJECTS.filter(p => p.phase === 'Dispatch');
  const qcPending = DB_PROJECTS.filter(p => p.phase === 'QC');
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Ready to Dispatch"    value={String(dispatchQ.length)} sub="QC cleared"                    icon="dispatch" color="#0E7490" bg="#ECFEFF" />
        <StatCard label="In Transit"           value="1"                        sub="PROJ-2026-0012"                 icon="dispatch" color="#1D4ED8" bg="#EFF6FF" />
        <StatCard label="Dispatched This Month" value="5"                       sub="June 2026"                     icon="check"    color="#15803D" bg="#E6F6EC" />
        <StatCard label="Overdue"              value="0"                        sub="All deliveries on schedule"    icon="check"    color="#15803D" bg="#E6F6EC" />
      </div>

      <div className="grid xl:grid-cols-[1.2fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <Card title="Dispatch Queue — QC Cleared">
            {dispatchQ.length === 0 ? <Empty msg="No items ready for dispatch." /> : dispatchQ.map(p => (
              <div key={p.id} className="border border-[#DEDEDA] rounded-lg p-4 mb-3 last:mb-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#1A1A17]">{p.name}</div>
                    <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{p.id} · {p.client}</div>
                  </div>
                  <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#ECFEFF] text-[#0E7490] whitespace-nowrap">QC Cleared</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px] mb-3">
                  <div><span className="text-[#84837C]">Target: </span><span className="font-mono font-semibold text-[#1A1A17]">{p.target}</span></div>
                  <div><span className="text-[#84837C]">PO Value: </span><span className="font-mono font-semibold text-[#1A1A17]">Rs.{p.po}L</span></div>
                </div>
                {[
                  { t: 'QC clearance received and on file', done: true  },
                  { t: 'Packing list prepared and signed',  done: true  },
                  { t: 'Delivery note completed',           done: false },
                  { t: 'Goods loaded and signed off',       done: false },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#F0F0EE] last:border-0">
                    <span className="w-4 h-4 rounded-full grid place-items-center flex-none"
                      style={{ background: c.done ? '#15803D' : 'transparent', border: c.done ? 'none' : '2px solid #C9C9C3' }}>
                      {c.done && <Icon name="check" className="w-2.5 h-2.5 text-white" strokeWidth={2.8} />}
                    </span>
                    <span className="text-[12px]" style={{ color: c.done ? '#84837C' : '#1A1A17' }}>{c.t}</span>
                  </div>
                ))}
                <button className="w-full mt-3 py-2 rounded-md font-semibold text-[13px] text-white" style={{ background: '#0E7490' }}>Mark as Dispatched</button>
              </div>
            ))}
          </Card>

          <Card title="Awaiting QC Clearance">
            {qcPending.length === 0 ? <Empty msg="No projects currently in QC." /> : qcPending.map(p => (
              <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
                <PhaseTag phase="QC" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#1A1A17] truncate">{p.name}</div>
                  <div className="text-[11px] font-mono text-[#84837C]">{p.id} · Target {p.target}</div>
                </div>
                <span className="text-[11px] text-[#84837C] font-mono whitespace-nowrap">In QC</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="In Transit">
            <div className="border border-[#F0F0EE] rounded-lg p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <div className="text-[13px] font-semibold text-[#1A1A17]">Steel Columns — Block B</div>
                  <div className="text-[11px] font-mono text-[#84837C]">PROJ-2026-0012 · Metro Builders</div>
                </div>
                <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8]">In Transit</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[12px]">
                <div><span className="text-[#84837C] block text-[11px]">Dispatch Date</span><span className="font-mono font-semibold text-[#1A1A17]">28 Jun 2026</span></div>
                <div><span className="text-[#84837C] block text-[11px]">Expected Delivery</span><span className="font-mono font-semibold text-[#1A1A17]">01 Jul 2026</span></div>
                <div><span className="text-[#84837C] block text-[11px]">Vehicle No.</span><span className="font-mono font-semibold text-[#1A1A17]">MH-12-AB-1234</span></div>
                <div><span className="text-[#84837C] block text-[11px]">Delivery Note</span><span className="font-mono font-semibold text-[#1A1A17]">DN-2026-0014</span></div>
              </div>
            </div>
          </Card>

          <Card title="Completed Dispatches — June 2026">
            {[
              { proj: 'PROJ-2026-0012', name: 'Steel Columns — Block B', date: '28 Jun 2026' },
              { proj: 'PROJ-2026-0010', name: 'Roof Gussets — Phase 1',  date: '22 Jun 2026' },
              { proj: 'PROJ-2026-0008', name: 'Walkway Grating Sets',    date: '18 Jun 2026' },
              { proj: 'PROJ-2026-0006', name: 'Mezzanine Brackets',      date: '12 Jun 2026' },
              { proj: 'PROJ-2026-0003', name: 'Steel Columns — Block A', date: '05 Jun 2026' },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
                <span className="w-7 h-7 rounded-full bg-[#E6F6EC] text-[#15803D] grid place-items-center flex-none">
                  <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#1A1A17] truncate">{d.name}</div>
                  <div className="text-[11px] font-mono text-[#84837C]">{d.proj} · {d.date}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- page ---- */

const ROLE_META = {
  'General Manager':    { desc: 'Company-wide overview — all projects, phases, disputes, and activity.',  color: '#1D4ED8', bg: '#EFF6FF' },
  'Planning Officer':   { desc: 'Project schedules, timelines, phase distribution, and dispute tracking.', color: '#7E22CE', bg: '#FAF5FF' },
  'Project Manager':    { desc: 'Your active projects, checklist progress, and team activity.',             color: '#C2410C', bg: '#FCEEE4' },
  'Quality Inspector':  { desc: 'Pending Fit-Up inspections, pass/fail results, and open issues.',          color: '#15803D', bg: '#E6F6EC' },
  'Quality Head':       { desc: 'QC approval queue, quality metrics, issues log, and recent approvals.',   color: '#7E22CE', bg: '#FAF5FF' },
  'Finance Officer':    { desc: 'Project financials, PO values, invoice status, and budget utilisation.',  color: '#0E7490', bg: '#ECFEFF' },
  'Dispatch In-charge': { desc: 'Dispatch queue, in-transit tracker, and completed deliveries.',            color: '#0E7490', bg: '#ECFEFF' },
};

const DASH_BODY = {
  'General Manager':    GMDashboard,
  'Planning Officer':   PODashboard,
  'Project Manager':    PMDashboard,
  'Quality Inspector':  QIDashboard,
  'Quality Head':       QHDashboard,
  'Finance Officer':    FODashboard,
  'Dispatch In-charge': DIDashboard,
};

function DashboardPage() {
  const [role, setRole] = React.useState('General Manager');
  const [open, setOpen] = React.useState(false);
  const meta     = ROLE_META[role];
  const DashBody = DASH_BODY[role];

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A17] flex">
      <MiniRail />
      <div className="flex-1 min-w-0 flex flex-col">

        {/* sticky topbar */}
        <header className="bg-white border-b border-[#DEDEDA] px-5 py-2.5 flex items-center gap-3 flex-none sticky top-0 z-30">
          <div className="flex items-center gap-1.5 text-[12px] text-[#57564F] min-w-0">
            <a className="text-[#1D4ED8] hover:underline cursor-pointer flex-none">Home</a>
            <span className="text-[#84837C] flex-none">/</span>
            <span className="text-[#1A1A17] font-semibold">Dashboard</span>
          </div>
          <div className="flex-1" />

          {/* role selector */}
          <div className="relative flex-none">
            <button
              className={'inline-flex items-center gap-2 h-9 rounded-md border bg-white px-3 text-[13px] font-semibold text-[#1A1A17] ' + (open ? 'border-[#C2410C] ring-[3px] ring-[#C2410C]/25' : 'border-[#C9C9C3] hover:border-[#84837C]')}
              onClick={() => setOpen(o => !o)}
            >
              <Icon name="eye" className="w-4 h-4 text-[#84837C]" />
              <span className="text-[#84837C] font-medium hidden sm:inline">Viewing as:</span>
              <span>{role}</span>
              <Icon name="chevron" className={'w-3 h-3 text-[#84837C] transition-transform ' + (open ? 'rotate-180' : '')} />
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-[25]" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[220px] bg-white border border-[#DEDEDA] rounded-lg shadow-[0_8px_24px_rgba(26,26,23,0.14)] py-1.5">
                  {DASH_ROLES.map(r => (
                    <button key={r}
                      className={'w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] ' + (r === role ? 'bg-[#FCEEE4] text-[#C2410C] font-semibold' : 'text-[#1A1A17] hover:bg-[#FAFAF8]')}
                      onClick={() => { setRole(r); setOpen(false); }}
                    >
                      {r === role
                        ? <Icon name="check" className="w-4 h-4 flex-none" />
                        : <span className="w-4 h-4 flex-none" />}
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="w-9 h-9 rounded-md border border-[#DEDEDA] bg-white grid place-items-center text-[#57564F] hover:bg-[#FAFAF8] relative flex-none">
            <Icon name="bell" />
            <span className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full bg-[#C2410C] border-[1.5px] border-white" />
          </button>
          <span className="w-[30px] h-[30px] rounded-full bg-[#3C3A33] text-white grid place-items-center text-[12px] font-semibold font-mono flex-none">MD</span>
        </header>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto px-6 py-8">

            {/* page heading */}
            <div className="mb-7 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold mb-2.5"
                  style={{ background: meta.bg, color: meta.color }}>{role}</span>
                <h1 className="text-[24px] font-bold text-[#1A1A17] tracking-tight leading-none mb-1.5">Dashboard</h1>
                <p className="text-[14px] text-[#57564F] max-w-[60ch]">{meta.desc}</p>
              </div>
              <div className="text-[12px] font-mono text-[#84837C] mt-1 whitespace-nowrap">01 Jul 2026</div>
            </div>

            <DashBody />
          </div>
        </div>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DashboardPage />);
