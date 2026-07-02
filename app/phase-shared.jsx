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

Object.assign(window, {
  VA_ROLES, NeutralBadge, ViewingAs, MiniRail, FrameTopbar, PHASE_STATUS, PhasePill, Progress, PROJECT, PHASES,
});
