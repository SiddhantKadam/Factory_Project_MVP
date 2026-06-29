/* ============================================================
   PHASE PATTERNS — documentation sheet (A · B · C)
   ============================================================ */

/* sheet chrome */
function Sec({ num, title, note, children }) {
  return (
    <section className="mt-16 first:mt-0">
      <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-[#DEDEDA]">
        <span className="font-mono text-[13px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">{num}</span>
        <h2 className="text-[20px] font-semibold text-[#1A1A17]">{title}</h2>
        {note && <span className="ml-auto text-[13px] text-[#57564F]">{note}</span>}
      </div>
      {children}
    </section>
  );
}
function Sub({ children }) {
  return <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#57564F] font-semibold mt-8 first:mt-0 mb-3">{children}</div>;
}
function Cap({ children }) {
  return (
    <p className="mt-3 text-[13px] text-[#57564F] leading-relaxed flex items-start gap-2">
      <Icon name="info" className="w-4 h-4 text-[#84837C] flex-none mt-0.5" /><span>{children}</span>
    </p>
  );
}
/* annotation label chip over a region */
function Anno({ children }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#C2410C] font-semibold mb-1.5">{children}</div>;
}
function Frame({ crumb, role, children, h }) {
  return (
    <div className="border border-[#C9C9C3] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(26,26,23,0.05)] bg-[#F4F4F2]">
      <div className="flex" style={h ? { height: h } : undefined}>
        <MiniRail />
        <div className="flex-1 min-w-0 flex flex-col">
          <FrameTopbar crumb={crumb} role={role} />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PATTERN B pieces
   ============================================================ */
function PhaseCard({ phase, owner, onlyView }) {
  const active = phase.status === 'In Progress';
  const completed = phase.status === 'Completed';
  const tone = completed ? '#15803D' : active ? '#1D4ED8' : '#84837C';
  return (
    <div className={'relative bg-white rounded-lg border p-3 flex flex-col gap-2 min-w-0 ' + (active ? 'border-[#C2410C] ring-1 ring-[#C2410C]/30' : phase.locked ? 'border-[#DEDEDA] opacity-90' : 'border-[#DEDEDA]')}>
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full grid place-items-center text-[12px] font-mono font-semibold flex-none" style={completed ? { background: '#15803D', color: '#fff' } : active ? { background: '#1D4ED8', color: '#fff' } : { background: '#F0F0EE', color: '#84837C' }}>
          {completed ? <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.4} /> : phase.n}
        </span>
        <span className="text-[13px] font-semibold text-[#1A1A17] truncate">{phase.name}</span>
        {phase.locked && <Icon name="lock" className="w-3.5 h-3.5 text-[#84837C] ml-auto flex-none" strokeWidth={2} />}
      </div>
      <PhasePill status={phase.status} locked={phase.locked} />
      <div className="flex items-center gap-2">
        <div className="flex-1"><Progress done={phase.done} total={phase.total} tone={tone} /></div>
        <span className="text-[11px] font-mono tabular-nums text-[#84837C] flex-none">{phase.done}/{phase.total}</span>
      </div>
      {active && (
        owner && !onlyView
          ? <button className="mt-1 w-full text-[12px] font-semibold bg-[#C2410C] hover:bg-[#9A330A] text-white rounded-md py-1.5">Open Phase</button>
          : <button className="mt-1 w-full text-[12px] font-semibold bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] rounded-md py-1.5">View Phase</button>
      )}
    </div>
  );
}

function Pipeline({ owner }) {
  return (
    <div className="flex items-stretch gap-1.5">
      {PHASES.map((p, i) => (
        <React.Fragment key={p.n}>
          <div className="flex-1 min-w-0"><PhaseCard phase={p} owner={owner} onlyView={!owner} /></div>
          {i < PHASES.length - 1 && (
            <div className="flex items-center flex-none text-[#C9C9C3]"><Icon name="chevron" className="w-4 h-4 -rotate-90" strokeWidth={2} /></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const FEED = [
  { who: 'Q. Singh · Quality Inspector', what: 'checked “Web alignment verified” in Fit-Up', time: 'Today · 10:42' },
  { who: 'R. Okafor · Project Manager', what: 'started the Fit-Up phase', time: 'Today · 08:15' },
  { who: 'System', what: 'Beamline phase marked Completed (6/6)', time: 'Yesterday · 16:30' },
  { who: 'A. Mehta · Operator', what: 'uploaded drilling-report.pdf to Beamline', time: 'Yesterday · 15:02' },
  { who: 'System', what: 'Cutting phase marked Completed (8/8)', time: '11 Jun · 14:20' },
];
function ActivityFeed() {
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg p-4">
      <h3 className="text-[14px] font-semibold text-[#1A1A17] mb-3">Recent activity</h3>
      <ol className="flex flex-col gap-2.5">
        {FEED.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9C9C3] mt-1.5 flex-none" />
            <span className="text-[#1A1A17]"><span className="font-semibold">{f.who.split(' · ')[0]}</span> <span className="text-[#57564F]">{f.what}</span></span>
            <span className="ml-auto text-[11px] font-mono text-[#84837C] whitespace-nowrap flex-none">{f.time}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OverviewBody({ owner }) {
  return (
    <div className="p-5 overflow-y-auto h-full">
      {/* header */}
      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 mb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[20px] font-semibold text-[#1A1A17] tracking-tight">{PROJECT.name}</h1>
              <PhasePill status="In Progress" />
            </div>
            <div className="text-[14px] text-[#57564F] mt-1">{PROJECT.client}</div>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-right">
            <div><div className="text-[10px] font-mono uppercase tracking-wider text-[#84837C]">PO</div><div className="text-[13px] font-mono font-semibold text-[#1A1A17]">{PROJECT.po}</div></div>
            <div><div className="text-[10px] font-mono uppercase tracking-wider text-[#84837C]">Target</div><div className="text-[13px] font-mono font-semibold text-[#1A1A17]">{PROJECT.target}</div></div>
            <div><div className="text-[10px] font-mono uppercase tracking-wider text-[#84837C]">PM</div><div className="text-[13px] font-semibold text-[#1A1A17]">{PROJECT.pm}</div></div>
          </div>
        </div>
      </div>

      {/* read-only banner (read-only role) */}
      {!owner && (
        <div className="flex items-center gap-2.5 rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3.5 py-2.5 mb-3">
          <Icon name="eye" className="w-[18px] h-[18px] text-[#57564F] flex-none" />
          <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">You're viewing this project in read-only mode.</span></span>
        </div>
      )}

      {/* pipeline */}
      <div className="mb-3"><Anno>Pipeline strip · click a phase to open it</Anno><Pipeline owner={owner} /></div>

      {/* active phase summary + activity */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3">
        <div className="bg-white border border-[#C2410C]/40 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white grid place-items-center text-[12px] font-mono font-semibold">3</span>
            <h3 className="text-[15px] font-semibold text-[#1A1A17]">Active phase — Fit-Up</h3>
            <PhasePill status="In Progress" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-3">
            <div><div className="text-[10px] font-mono uppercase tracking-wider text-[#84837C]">Assignee</div><div className="text-[13px] font-medium text-[#1A1A17]">Q. Singh · Quality Inspector</div></div>
            <div><div className="text-[10px] font-mono uppercase tracking-wider text-[#84837C]">Started</div><div className="text-[13px] font-mono text-[#1A1A17]">Today · 08:15</div></div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1"><Progress done={3} total={6} tone="#1D4ED8" /></div>
            <span className="text-[12px] font-mono tabular-nums text-[#57564F]">Checklist 3/6</span>
          </div>
          {owner
            ? <button className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[13px] px-3.5 py-2 rounded-md"><Icon name="production" className="w-4 h-4" /> Open Phase</button>
            : <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[13px] px-3.5 py-2 rounded-md"><Icon name="eye" className="w-4 h-4" /> View Phase</button>}
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}

/* ============================================================
   PATTERN C — phase shell wireframe
   ============================================================ */
const CHECK = [
  { t: 'Drawings issued to floor', req: true, done: true },
  { t: 'Members tagged & staged', req: true, done: true },
  { t: 'Web alignment verified', req: true, done: true },
  { t: 'Bolt holes match template', req: true, done: false },
  { t: 'Tack welds inspected', req: false, done: false },
  { t: 'Surface prep complete', req: false, done: false },
];
function CheckRow({ item, owner, disabled }) {
  return (
    <li className="flex items-center gap-3 py-2 border-b border-[#F0F0EE] last:border-0">
      <span className={'w-[18px] h-[18px] rounded border flex-none grid place-items-center ' + (item.done ? 'bg-[#C2410C] border-[#C2410C]' : 'bg-white border-[#C9C9C3]') + (disabled ? ' opacity-50' : '')}>
        {item.done && <Icon name="check" className="w-3 h-3 text-white" strokeWidth={2.4} />}
      </span>
      <span className={'text-[14px] ' + (item.done ? 'text-[#1A1A17]' : 'text-[#57564F]')}>{item.t}{item.req && <span className="text-[#B91C1C] font-semibold"> *</span>}</span>
      {owner && !disabled && <span className="ml-auto text-[11px] font-mono text-[#84837C]">{item.done ? 'checked' : 'toggle'}</span>}
    </li>
  );
}

function PhaseShellBody({ role = 'owner', state = 'normal' }) {
  const owner = role === 'owner';
  const locked = state === 'locked';
  const disputed = state === 'disputed';
  const dim = locked ? ' opacity-60' : '';
  const doneCount = CHECK.filter(c => c.done).length;
  const reqLeft = CHECK.filter(c => c.req && !c.done).length;

  return (
    <div className="p-5 overflow-y-auto h-full">
      {/* disputed banner */}
      {disputed && (
        <div className="flex items-center gap-2.5 rounded-md mb-3 px-4 py-3" style={{ background: '#FBF1DD', border: '1px solid #EBD9AE', borderLeft: '4px solid #B45309' }}>
          <Icon name="disputes" className="w-[18px] h-[18px] flex-none" style={{ color: '#B45309' }} />
          <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">This project has an open dispute.</span> Phase actions are paused until the dispute is resolved.</span>
        </div>
      )}

      {/* header card */}
      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 mb-3">
        <Anno>Page header card</Anno>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white grid place-items-center text-[14px] font-mono font-semibold">1</span>
              <h1 className="text-[20px] font-semibold text-[#1A1A17]">Cutting</h1>
              <PhasePill status={locked ? 'Pending' : 'In Progress'} locked={locked} />
            </div>
            <div className="text-[13px] text-[#57564F] mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5">
              <span>{PROJECT.name}</span><span className="text-[#C9C9C3]">·</span>
              <span>{PROJECT.client}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">{PROJECT.po}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">Target {PROJECT.target}</span><span className="text-[#C9C9C3]">·</span>
              <span>Assignee A. Mehta</span>
            </div>
          </div>
          {/* right action area */}
          <div className="flex-none">
            {owner && !locked && !disputed && (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[13px] px-3.5 py-2 rounded-md">Save Progress</button>
                  <button className="inline-flex items-center gap-2 bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed font-semibold text-[13px] px-3.5 py-2 rounded-md">Complete Phase</button>
                </div>
                <span className="text-[11px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>
              </div>
            )}
            {owner && locked && (
              <div className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5" style={{ background: '#F0F0EE', border: '1px solid #DEDEDA' }}>
                <Icon name="lock" className="w-[18px] h-[18px] text-[#84837C] flex-none" strokeWidth={2} />
                <span className="text-[13px] text-[#57564F]">Locked until <span className="font-semibold text-[#1A1A17]">Beamline</span> is completed.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* two-column */}
      <div className="grid lg:grid-cols-[1.85fr_1fr] gap-3">
        {/* LEFT */}
        <div className={'flex flex-col gap-3' + dim}>
          {/* checklist */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-4">
            <Anno>Checklist card · left col ~65%</Anno>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[15px] font-semibold text-[#1A1A17]">Checklist</h3>
              <span className="text-[12px] font-mono font-semibold rounded-full px-2 py-0.5" style={{ background: '#F0F0EE', color: '#4B5563' }}>{doneCount}/{CHECK.length}</span>
            </div>
            <div className="mb-3"><Progress done={doneCount} total={CHECK.length} /></div>
            <ul>
              {CHECK.map((c, i) => <CheckRow key={i} item={c} owner={owner} disabled={locked || disputed} />)}
            </ul>
            <div className="mt-3 pt-3 border-t border-[#F0F0EE] text-[12px] text-[#57564F]"><span className="text-[#B91C1C] font-semibold">*</span> Required — must be checked before completing the phase.</div>
          </div>
          {/* phase-specific extras placeholder */}
          <div className="bg-white border border-dashed border-[#C9C9C3] rounded-lg p-4">
            <Anno>Phase-specific extras · slot</Anno>
            <div className="grid place-items-center text-center py-6 text-[#84837C]">
              <Icon name="documents" className="w-7 h-7 mb-2" strokeWidth={1.4} />
              <div className="text-[13px] font-medium text-[#57564F]">Filled by P1–P5 — e.g. Inspection Form (Fit-Up) or Delivery Info (Dispatch).</div>
            </div>
          </div>
          {/* comments */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-4">
            <Anno>Comments / activity card</Anno>
            <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-3">Comments &amp; activity</h3>
            <ol className="flex flex-col gap-2.5 mb-3">
              {FEED.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9C9C3] mt-1.5 flex-none" />
                  <span className="text-[#1A1A17]"><span className="font-semibold">{f.who.split(' · ')[0]}</span> <span className="text-[#57564F]">{f.what}</span></span>
                  <span className="ml-auto text-[11px] font-mono text-[#84837C] whitespace-nowrap flex-none">{f.time}</span>
                </li>
              ))}
            </ol>
            {role !== 'viewer' && !disputed ? (
              <div className="flex flex-col gap-2">
                <textarea className="w-full min-h-[56px] rounded-md border border-[#C9C9C3] bg-white text-[14px] px-3 py-2 resize-y focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35" placeholder="Add a comment…" />
                <button className="self-end inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[13px] px-3.5 py-2 rounded-md">Post</button>
              </div>
            ) : (
              <div className="text-[12px] font-mono text-[#84837C] bg-[#FAFAF8] border border-dashed border-[#DEDEDA] rounded-md px-3 py-2">{disputed ? 'Comment input paused during dispute' : 'Viewer — no comment input'}</div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className={'flex flex-col gap-3' + dim}>
          {/* documents */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-4">
            <Anno>Documents card · right col ~35%</Anno>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[14px] font-semibold text-[#1A1A17]">Phase Documents</h3>
              <span className="text-[12px] font-mono text-[#84837C]">2</span>
            </div>
            {[{ n: 'cutting-plan-S204.pdf', t: 'Drawing', s: '1.8 MB', by: 'A. Mehta', d: '11 Jun' }, { n: 'mill-cert-A992.pdf', t: 'Certificate', s: '640 KB', by: 'Atlas Steel', d: '11 Jun' }].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[#F0F0EE] last:border-0">
                <span className="w-8 h-8 rounded-md bg-[#FCECEC] text-[#B91C1C] grid place-items-center flex-none"><Icon name="pdf" className="w-4 h-4" strokeWidth={1.5} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5"><span className="text-[13px] font-semibold font-mono text-[#1A1A17] truncate">{f.n}</span><span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex-none" style={{ color: '#1D4ED8', background: '#E9F0FF' }}>{f.t}</span></div>
                  <div className="text-[11px] font-mono text-[#84837C]">{f.s} · {f.by} · {f.d}</div>
                </div>
                <button className="w-8 h-8 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE] flex-none"><Icon name="upload" className="w-4 h-4 rotate-180" /></button>
              </div>
            ))}
            {owner && !locked && !disputed ? (
              <div className="mt-3 rounded-md border-2 border-dashed border-[#C9C9C3] bg-[#FAFAF8] p-3 text-center">
                <div className="text-[12px] text-[#57564F]">Drop file or <span className="text-[#C2410C] font-semibold underline">browse</span> · PDF/JPG/PNG</div>
                <div className="flex items-center gap-2 mt-2">
                  <select className="flex-1 h-8 rounded-md border border-[#C9C9C3] text-[12px] px-2 bg-white"><option>Drawing</option><option>Certificate</option><option>Photo</option></select>
                  <button className="h-8 px-3 rounded-md bg-[#C2410C] text-white text-[12px] font-semibold">Upload</button>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-[11px] font-mono text-[#84837C]">{owner ? '' : 'Read-only — no upload form'}</div>
            )}
          </div>
          {/* phase info */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-4">
            <Anno>Phase info card</Anno>
            <h3 className="text-[14px] font-semibold text-[#1A1A17] mb-2.5">Phase info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed mb-3">Cut primary members to length per cutting plan, tag and stage for the beamline.</p>
            <div className="grid grid-cols-2 gap-y-2 text-[13px]">
              <span className="text-[#84837C]">Phase order</span><span className="text-[#1A1A17] font-mono text-right">1 of 5</span>
              <span className="text-[#84837C]">Started</span><span className="text-[#1A1A17] font-mono text-right">11 Jun 2026</span>
              <span className="text-[#84837C]">Completed</span><span className="text-[#1A1A17] font-mono text-right">—</span>
              <span className="text-[#84837C]">Duration</span><span className="text-[#1A1A17] font-mono text-right">2 days</span>
            </div>
          </div>
          {/* related phases */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-4">
            <Anno>Related phases card</Anno>
            <h3 className="text-[14px] font-semibold text-[#1A1A17] mb-2.5">All phases</h3>
            <ul className="flex flex-col gap-1.5">
              {PHASES.map((p) => (
                <li key={p.n} className={'flex items-center gap-2 px-2 py-1.5 rounded-md ' + (p.n === 1 ? 'bg-[#FCEEE4]' : '')}>
                  <span className="w-5 h-5 rounded-full grid place-items-center text-[11px] font-mono font-semibold flex-none" style={p.status === 'Completed' ? { background: '#15803D', color: '#fff' } : p.status === 'In Progress' ? { background: '#1D4ED8', color: '#fff' } : { background: '#F0F0EE', color: '#84837C' }}>{p.n}</span>
                  <span className={'text-[13px] ' + (p.n === 1 ? 'font-semibold text-[#C2410C]' : 'text-[#1A1A17]')}>{p.name}</span>
                  <span className="ml-auto"><PhasePill status={p.status} locked={p.locked} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
function PhasePatterns() {
  const [openDemo, setOpenDemo] = React.useState(false);
  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A17]">
      <div className="max-w-[1180px] mx-auto px-8 py-12 pb-28">
        <header className="mb-12">
          <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#C2410C] font-semibold mb-2.5">Siteflow · PO Tracker · Production phases</p>
          <h1 className="text-[26px] font-semibold tracking-tight mb-2">Project Phase — Shared Patterns</h1>
          <p className="text-[16px] text-[#57564F] max-w-[64ch]">Three reusable building blocks for the five-phase production system: the “Viewing as” role control, the project production overview, and the shared phase-page shell. Owner / Admin see full controls; all other roles get a read-only view where controls are <span className="font-semibold text-[#1A1A17]">hidden, not disabled</span>.</p>
        </header>

        {/* ===== PATTERN A ===== */}
        <Sec num="A" title="“Viewing as” top bar control" note="On every phase page">
          <Sub>(a) closed / rest &nbsp;·&nbsp; (b) open, Project Manager highlighted</Sub>
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-6 flex flex-wrap items-start gap-12">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#84837C] mb-2">closed</div>
              <ViewingAs value="Project Manager" open={false} onToggle={() => {}} />
              <p className="text-[11px] text-[#84837C] mt-1.5 max-w-[210px]">Preview only — role switching is for design review.</p>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#84837C] mb-2">open</div>
              <ViewingAs value="Project Manager" open={true} onToggle={() => {}} onPick={() => {}} />
            </div>
          </div>

          <Sub>(c) Top bar composition — breadcrumb · viewing-as · bell · role badge + avatar</Sub>
          <div className="border border-[#C9C9C3] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <FrameTopbar crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Fit-Up']} role="Project Manager" />
            <div className="bg-[#F4F4F2] h-12 grid place-items-center text-[11px] font-mono text-[#84837C]">↑ live — open the dropdown, pick a role, watch the badge follow</div>
          </div>
          <Cap>The control sits between breadcrumb and the bell/avatar. Its value drives which version of the page renders; a quiet neutral role badge (#F0F0EE / #4B5563) mirrors the choice next to the avatar.</Cap>
        </Sec>

        {/* ===== PATTERN B ===== */}
        <Sec num="B" title="Project production overview" note="/projects/[id] — above the phase pages">
          <Sub>Role state 1 — Owner / Admin (active phase actionable)</Sub>
          <Frame crumb={['Home', 'Projects', 'PROJ-2026-0018']} role="Project Manager" h={620}>
            <OverviewBody owner={true} />
          </Frame>

          <Sub>Role state 2 — Read-only (e.g. General Manager / Viewer)</Sub>
          <Frame crumb={['Home', 'Projects', 'PROJ-2026-0018']} role="Viewer" h={620}>
            <OverviewBody owner={false} />
          </Frame>
          <Cap>Same anatomy in both: header, five-phase pipeline strip (Cutting ✓ → Beamline ✓ → Fit-Up ● → QC 🔒 → Dispatch 🔒), active-phase summary, activity feed. Read-only adds the banner and swaps every “Open Phase” for “View Phase” — write affordances simply aren’t rendered.</Cap>
        </Sec>

        {/* ===== PATTERN C ===== */}
        <Sec num="C" title="Shared phase-page shell" note="Skeleton for P1–P5">
          <Sub>Owner role — annotated layout</Sub>
          <Frame crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Cutting']} role="Project Manager" h={860}>
            <PhaseShellBody role="owner" state="normal" />
          </Frame>
          <Cap>Header card (phase circle · name · status · project meta · owner action buttons) over a two-column body: left ~65% = Checklist + phase-specific slot + Comments; right ~35% = Documents (with upload) + Phase info + Related phases. “Complete Phase” stays disabled with a “N required items remaining” hint until required (*) items are checked.</Cap>

          <Sub>Read-only role — what changes</Sub>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#DEDEDA] rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3"><Icon name="block" className="w-[18px] h-[18px] text-[#84837C]" /><h4 className="text-[14px] font-semibold text-[#1A1A17]">Removed (hidden, not disabled)</h4></div>
              <ul className="flex flex-col gap-2 text-[13px] text-[#57564F]">
                {['Save Progress / Complete Phase / Start Phase buttons', 'Checklist toggles → static read indicators', 'Document upload dropzone + type selector', 'Comment textarea + Post (Viewer only)'].map((t, i) => (
                  <li key={i} className="flex items-start gap-2"><Icon name="x" className="w-4 h-4 text-[#B91C1C] flex-none mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-[#DEDEDA] rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3"><Icon name="eye" className="w-[18px] h-[18px] text-[#57564F]" /><h4 className="text-[14px] font-semibold text-[#1A1A17]">Added</h4></div>
              <ul className="flex flex-col gap-2 text-[13px] text-[#57564F]">
                <li className="flex items-start gap-2"><Icon name="check" className="w-4 h-4 text-[#15803D] flex-none mt-0.5" />Slim read-only banner under the header: “You're viewing this in read-only mode.”</li>
                <li className="flex items-start gap-2"><Icon name="check" className="w-4 h-4 text-[#15803D] flex-none mt-0.5" />All cards otherwise identical — same data, no write controls.</li>
              </ul>
            </div>
          </div>

          <Sub>Locked state — predecessor not complete</Sub>
          <Frame crumb={['Home', 'Projects', 'PROJ-2026-0018', 'QC']} role="Project Manager" h={680}>
            <PhaseShellBody role="owner" state="locked" />
          </Frame>
          <Cap>Header actions replaced by a lock banner; checklist and right-column interactions disabled, upload form gone, the whole body dimmed.</Cap>

          <Sub>On-hold — open dispute</Sub>
          <Frame crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Cutting']} role="Project Manager" h={680}>
            <PhaseShellBody role="owner" state="disputed" />
          </Frame>
          <Cap>Amber banner across the top; action buttons absent and the checklist + comment input are paused until the dispute resolves.</Cap>
        </Sec>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PhasePatterns />);
