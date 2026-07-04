/* ============================================================
   PHASE PATTERNS — shared building blocks
   ============================================================ */

const VA_ROLES = [
  'General Manager', 'Planning Officer', 'Project Manager', 'Quality Inspector', 'Quality Head',
  'Finance Officer', 'Dispatch In-charge', 'Viewer',
];

/* neutral role badge (#F0F0EE / #4B5563) */
function NeutralBadge({ role }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-[3px] text-[12px] font-medium whitespace-nowrap" style={{ background: '#F0F0EE', color: '#4B5563' }}>
      {role}
    </span>
  );
}

/* ---- Pattern A: Viewing-as control ---- */
function ViewingAs({ value = 'Project Manager', open = false, onToggle, onPick }) {
  return (
    <div className="relative">
      <button
        className={'inline-flex items-center gap-2 h-9 rounded-md border bg-white px-3 text-[13px] font-semibold text-[#1A1A17] ' + (open ? 'border-[#C2410C] ring-[3px] ring-[#C2410C]/35' : 'border-[#C9C9C3] hover:border-[#84837C]')}
        onClick={onToggle}
      >
        <Icon name="eye" className="w-4 h-4 text-[#84837C]" />
        <span className="text-[#84837C] font-medium">Viewing as:</span> {value}
        <Icon name="chevron" className={'w-3 h-3 text-[#84837C] transition-transform ' + (open ? 'rotate-180' : '')} />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-[210px] bg-white border border-[#DEDEDA] rounded-md shadow-[0_8px_24px_rgba(26,26,23,0.14)] py-1">
          {VA_ROLES.map((r) => {
            const on = r === value;
            return (
              <button
                key={r}
                className={'w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] ' + (on ? 'bg-[#FCEEE4] text-[#C2410C] font-semibold' : 'text-[#1A1A17] hover:bg-[#FAFAF8]')}
                onClick={() => onPick && onPick(r)}
              >
                {on ? <Icon name="check" className="w-4 h-4" /> : <span className="w-4 h-4" />}
                {r}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---- slim icon rail (implies the app shell) ---- */
function MiniRail() {
  const items = ['dashboard', 'po', 'projects', 'production', 'quality', 'dispatch'];
  return (
    <div className="w-[52px] flex-none bg-white border-r border-[#DEDEDA] flex flex-col items-center py-3 gap-1">
      <div className="w-8 h-8 rounded-md bg-[#C2410C] text-white grid place-items-center font-bold text-[12px] font-mono mb-2">PO</div>
      {items.map((ic, i) => (
        <div key={ic} className={'w-9 h-9 rounded-md grid place-items-center ' + (ic === 'projects' ? 'bg-[#FCEEE4] text-[#C2410C]' : 'text-[#57564F]')}>
          <Icon name={ic} className="w-[18px] h-[18px]" />
        </div>
      ))}
    </div>
  );
}

/* ---- frame top bar — static role + access display (no dropdown; use stacked sections for role switching) ---- */
function FrameTopbar({ crumb, role, access = 'view' }) {
  return (
    <header className="bg-white border-b border-[#DEDEDA] px-4 py-2.5 flex items-center gap-3 flex-none">
      <div className="flex items-center gap-1.5 text-[12px] text-[#57564F] min-w-0 flex-nowrap whitespace-nowrap overflow-hidden">
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#84837C] flex-none">/</span>}
            {i === crumb.length - 1
              ? <span className="text-[#1A1A17] font-semibold truncate">{c}</span>
              : <a className="text-[#1D4ED8] hover:underline cursor-pointer flex-none">{c}</a>}
          </React.Fragment>
        ))}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 flex-none">
        <span className="text-[12px] text-[#84837C] font-medium hidden md:block">Viewing as</span>
        <NeutralBadge role={role} />
        <span className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold"
          style={access === 'edit' ? { background: '#DCFCE7', color: '#15803D' } : { background: '#F0F0EE', color: '#57564F' }}>
          {access === 'edit' ? 'Edit' : 'View only'}
        </span>
      </div>
      <button className="w-9 h-9 rounded-md border border-[#DEDEDA] bg-white grid place-items-center text-[#57564F] hover:bg-[#FAFAF8] relative flex-none">
        <Icon name="bell" />
        <span className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full bg-[#C2410C] border-[1.5px] border-white" />
      </button>
      <span className="w-[30px] h-[30px] rounded-full bg-[#3C3A33] text-white grid place-items-center text-[12px] font-semibold font-mono flex-none">MD</span>
    </header>
  );
}

/* ---- phase status pill ---- */
const PHASE_STATUS = {
  Completed:    { fg: '#15803D', bg: '#E6F6EC' },
  'In Progress':{ fg: '#1D4ED8', bg: '#E9F0FF' },
  Pending:      { fg: '#4B5563', bg: '#F0F0EE' },
};
function PhasePill({ status, locked }) {
  const s = PHASE_STATUS[status] || PHASE_STATUS.Pending;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap leading-none" style={{ color: s.fg, background: s.bg }}>
      {status === 'In Progress'
        ? <span className="w-1.5 h-1.5 rounded-full po-pulse-dot" style={{ background: s.fg }} />
        : locked
        ? <Icon name="lock" className="w-3 h-3" strokeWidth={2} />
        : <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }} />}
      {status}
    </span>
  );
}

/* thin progress bar */
function Progress({ done, total, tone = '#C2410C' }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full bg-[#F0F0EE] overflow-hidden">
      <div className="h-full rounded-full" style={{ width: pct + '%', background: tone }} />
    </div>
  );
}

const PROJECT = {
  id: 'PROJ-2026-0018',
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  pm: 'R. Okafor',
};

const PHASES = [
  { n: 1, name: 'Cutting',  status: 'Completed',   done: 8, total: 8 },
  { n: 2, name: 'Beamline', status: 'Completed',   done: 6, total: 6 },
  { n: 3, name: 'Fit-Up',   status: 'In Progress', done: 3, total: 6 },
  { n: 4, name: 'QC',       status: 'Pending', locked: true, done: 0, total: 5 },
  { n: 5, name: 'Dispatch', status: 'Pending', locked: true, done: 0, total: 4 },
];

/* ---- per-phase accent palette ---- */
const PHASE_ACCENT = {
  Cutting:  { color: '#C2410C', bg: '#FCEEE4', ring: 'rgba(194,65,12,0.18)' },
  Beamline: { color: '#1D4ED8', bg: '#EFF6FF', ring: 'rgba(29,78,216,0.18)' },
  'Fit-Up': { color: '#B45309', bg: '#FBF1DD', ring: 'rgba(180,83,9,0.18)'  },
  QC:       { color: '#7E22CE', bg: '#F5F3FF', ring: 'rgba(126,34,206,0.18)'},
  Dispatch: { color: '#0E7490', bg: '#ECFEFF', ring: 'rgba(14,116,144,0.18)'},
};

/* ---- horizontal phase stepper ---- */
function PhaseStepper({ phases }) {
  return (
    <div className="flex items-start w-full gap-0">
      {phases.map((p, i) => {
        const isDone   = p.status === 'Completed';
        const isActive = p.status === 'In Progress';
        const acc      = PHASE_ACCENT[p.name] || { color: '#84837C', ring: 'none' };
        return (
          <React.Fragment key={p.n}>
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full grid place-items-center flex-none"
                style={{
                  background:  isDone ? '#15803D' : isActive ? acc.color : '#E5E5E1',
                  color:       (isDone || isActive) ? '#fff' : '#9CA3AF',
                  boxShadow:   isActive ? `0 0 0 4px ${acc.ring}` : 'none',
                }}>
                {isDone
                  ? <Icon name="check" className="w-4 h-4" strokeWidth={2.5} />
                  : p.locked
                  ? <Icon name="lock"  className="w-3.5 h-3.5" strokeWidth={2} />
                  : <span className="text-[12px] font-bold font-mono">{p.n}</span>}
              </div>
              <span className="text-[11px] font-semibold text-center leading-tight whitespace-nowrap"
                style={{ color: isDone ? '#15803D' : isActive ? acc.color : '#9CA3AF' }}>
                {p.name}
              </span>
            </div>
            {i < phases.length - 1 && (
              <div className="flex-1 h-0.5 mt-4 min-w-[8px]"
                style={{ background: isDone ? '#15803D' : '#E5E5E1' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ---- phase shell — full-page wrapper with role dropdown ---- */
function PhaseShell({ crumb, ownerRoles, children }) {
  const [role, setRole]       = React.useState('General Manager');
  const [dropOpen, setDropOpen] = React.useState(false);
  const [toast, setToast]     = React.useState(null);
  const timer                 = React.useRef(null);

  const access = ownerRoles.includes(role) ? 'edit' : 'view';
  const notify = React.useCallback((m) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1900);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex text-[#1A1A17]">
      <MiniRail />
      <div className="flex-1 min-w-0 flex flex-col">

        {/* sticky header */}
        <header className="bg-white border-b border-[#DEDEDA] px-5 py-2.5 flex items-center gap-3 flex-none sticky top-0 z-30">
          <div className="flex items-center gap-1.5 text-[12px] text-[#57564F] min-w-0 flex-nowrap overflow-hidden">
            {crumb.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-[#84837C] flex-none">/</span>}
                {i === crumb.length - 1
                  ? <span className="font-semibold text-[#1A1A17] truncate">{c}</span>
                  : <a className="text-[#1D4ED8] hover:underline cursor-pointer flex-none">{c}</a>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex-1" />

          {/* role dropdown */}
          <div className="relative flex-none">
            <button
              className={'inline-flex items-center gap-2 h-9 rounded-md border bg-white px-3 text-[13px] font-semibold ' +
                (dropOpen ? 'border-[#C2410C] ring-[3px] ring-[#C2410C]/25' : 'border-[#C9C9C3] hover:border-[#84837C]')}
              onClick={() => setDropOpen(o => !o)}
            >
              <Icon name="eye" className="w-4 h-4 text-[#84837C]" />
              <span className="text-[#84837C] font-medium hidden sm:inline">Role:</span>
              <span className="text-[#1A1A17]">{role}</span>
              <Icon name="chevron" className={'w-3 h-3 text-[#84837C] transition-transform ' + (dropOpen ? 'rotate-180' : '')} />
            </button>
            {dropOpen && (
              <>
                <div className="fixed inset-0 z-[25]" onClick={() => setDropOpen(false)} />
                <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[220px] bg-white border border-[#DEDEDA] rounded-lg shadow-[0_8px_24px_rgba(26,26,23,0.14)] py-1.5">
                  {VA_ROLES.map(r => (
                    <button key={r}
                      className={'w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] ' +
                        (r === role ? 'bg-[#FCEEE4] text-[#C2410C] font-semibold' : 'text-[#1A1A17] hover:bg-[#FAFAF8]')}
                      onClick={() => { setRole(r); setDropOpen(false); }}
                    >
                      {r === role
                        ? <Icon name="check" className="w-4 h-4 flex-none" />
                        : <span className="w-4 flex-none" />}
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold flex-none"
            style={access === 'edit' ? { background: '#DCFCE7', color: '#15803D' } : { background: '#F0F0EE', color: '#57564F' }}>
            {access === 'edit' ? 'Edit' : 'View only'}
          </span>
          <button className="w-9 h-9 rounded-md border border-[#DEDEDA] bg-white grid place-items-center text-[#57564F] hover:bg-[#FAFAF8] relative flex-none">
            <Icon name="bell" />
            <span className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full bg-[#C2410C] border-[1.5px] border-white" />
          </button>
          <span className="w-[30px] h-[30px] rounded-full bg-[#3C3A33] text-white grid place-items-center text-[12px] font-semibold font-mono flex-none">MD</span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children(role, access, notify)}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" />
          <span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

/* ---- status tag (ok / wait / no / neutral) ---- */
function PTag({ tone = 'neutral', children }) {
  const map = {
    ok:      { bg: '#E6F6EC', bd: '#BFE3CB', fg: '#15803D' },
    wait:    { bg: '#FBF1DD', bd: '#E6CFA0', fg: '#B45309' },
    no:      { bg: '#FBEAEA', bd: '#E3BFBF', fg: '#B91C1C' },
    neutral: { bg: '#F0F0EE', bd: '#DEDEDA', fg: '#57564F' },
  };
  const s = map[tone] || map.neutral;
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold font-mono whitespace-nowrap"
      style={{ background: s.bg, border: `1px solid ${s.bd}`, color: s.fg }}>
      {children}
    </span>
  );
}

/* ---- generic data table card ---- */
function TableCard({ title, count, right, cols, rows }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-3">
        <h3 className="text-[15px] font-bold text-[#1A1A17]">{title}</h3>
        {count != null && <span className="text-[11px] font-mono font-semibold bg-[#F0F0EE] text-[#4B5563] px-2 py-0.5 rounded-full">{count}</span>}
        {right && <span className="ml-auto text-[12px] font-mono text-[#84837C]">{right}</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={i} className="text-left font-mono text-[10px] uppercase tracking-wide text-[#84837C] px-4 py-2.5 border-b border-[#DEDEDA] bg-[#FAFAF8] whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="hover:bg-[#FAFAF8]">
                {r.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5 border-b border-[#F0F0EE] font-mono text-[#1A1A17] align-middle whitespace-nowrap">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- read-only field-grid card ---- */
function FieldsCard({ title, right, fields, cols = 3 }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-3">
        <h3 className="text-[15px] font-bold text-[#1A1A17]">{title}</h3>
        {right && <span className="ml-auto text-[12px] font-mono text-[#84837C]">{right}</span>}
      </div>
      <div className={'p-5 grid gap-4 ' + (cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
        {fields.map(([label, value], i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-[#84837C]">{label}</span>
            <div className="border border-[#DEDEDA] bg-[#FAFAF8] rounded-lg px-3 py-2 text-[13px] font-mono text-[#1A1A17]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- side key/value info panel ---- */
function InfoPanel({ title, rows }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0EE]">
        <h3 className="text-[15px] font-bold text-[#1A1A17]">{title}</h3>
      </div>
      <div className="px-5 py-2">
        {rows.map(([k, v], i) => (
          <div key={i} className="flex justify-between items-center gap-3 py-2 border-b border-[#F0F0EE] last:border-0">
            <span className="text-[12px] text-[#84837C]">{k}</span>
            <span className="text-[13px] font-mono font-semibold text-[#1A1A17] text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- activity log timeline ---- */
function ActivityLog({ items, acc }) {
  const dot = {
    done:    '#15803D',
    approve: '#15803D',
    edit:    (acc && acc.color) || '#57564F',
    upload:  '#1D4ED8',
    comment: '#84837C',
    alert:   '#B91C1C',
    start:   '#B45309',
    system:  '#84837C',
  };
  return (
    <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden mt-5">
      <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-[#1A1A17]">Activity Log</h3>
        <span className="text-[11px] font-mono font-semibold bg-[#F0F0EE] text-[#4B5563] px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <ol className="p-5 pt-4">
        {items.map((it, i) => (
          <li key={i} className="relative flex gap-3.5 pb-4 last:pb-0">
            {i < items.length - 1 && <span className="absolute left-[5.5px] top-[15px] bottom-0 w-px bg-[#E5E5E1]" />}
            <span className="relative z-10 mt-1 w-3 h-3 rounded-full flex-none ring-4 ring-white" style={{ background: dot[it.type] || '#84837C' }} />
            <div className="min-w-0 flex-1 flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-[#1A1A17] leading-snug">
                  <span className="font-semibold">{it.who}</span> <span className="text-[#57564F]">{it.action}</span>
                  {it.detail && <span className="font-mono text-[#1A1A17]"> {it.detail}</span>}
                </div>
                {it.note && <div className="text-[12px] text-[#84837C] mt-0.5">{it.note}</div>}
              </div>
              <span className="text-[11px] font-mono text-[#84837C] flex-none whitespace-nowrap mt-0.5">{it.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

Object.assign(window, {
  VA_ROLES, NeutralBadge, ViewingAs, MiniRail, FrameTopbar,
  PHASE_STATUS, PhasePill, Progress, PROJECT, PHASES,
  PHASE_ACCENT, PhaseStepper, PhaseShell,
  PTag, TableCard, FieldsCard, InfoPanel, ActivityLog,
});
