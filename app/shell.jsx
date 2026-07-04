/* ============================================================
   PO Tracker — shared shell, tokens-in-JS, icons, data
   ============================================================ */

/* ---- Status palette (solid text on soft tint) ---- */
const STATUS = {
  'Draft':              { fg: '#4B5563', bg: '#F0F0EE' },
  'Under Review':       { fg: '#B45309', bg: '#FBF1DD' },
  'Approved':           { fg: '#15803D', bg: '#E6F6EC' },
  'Rejected':           { fg: '#B91C1C', bg: '#FCECEC' },
  'Revision Requested': { fg: '#C2410C', bg: '#FCEEE4' },
};

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS['Draft'];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap leading-none"
      style={{ color: s.fg, background: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }}></span>
      {status}
    </span>
  );
}

/* ---- Currency ---- */
const CURRENCY = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ', SGD: 'S$' };

function fmtINR(n) {
  const s = Math.abs(n).toFixed(2);
  let [int, dec] = s.split('.');
  let last3 = int.slice(-3);
  let other = int.slice(0, -3);
  if (other) last3 = ',' + last3;
  other = other.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return (n < 0 ? '-' : '') + other + last3 + '.' + dec;
}
function money(n, cur = 'INR') {
  const sym = CURRENCY[cur] || '';
  if (cur === 'INR') return sym + fmtINR(n);
  return sym + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---- Sample PO data (steel fabrication, INR) ---- */
const PO_DATA = [
  { no: 'PO-2026-0481', title: 'Structural beams — Bay 4',        client: 'Acme Infrastructure Ltd.',   amount: 1849200, due: '2026-07-15', status: 'Under Review',       created: '2026-06-02' },
  { no: 'PO-2026-0479', title: 'Crane runway girders',            client: 'Meridian Construction Co.',  amount: 624000,  due: '2026-07-02', status: 'Under Review',          created: '2026-06-04' },
  { no: 'PO-2026-0477', title: 'Mezzanine floor framing',         client: 'Sterling Steel Projects',    amount: 918050,  due: '2026-06-28', status: 'Approved',           created: '2026-06-01' },
  { no: 'PO-2026-0474', title: 'Transfer girders — Bay 7',        client: 'Vertex Engineering Pvt Ltd', amount: 2417750, due: '2026-08-10', status: 'Revision Requested', created: '2026-05-28' },
  { no: 'PO-2026-0470', title: 'Loading dock frame',              client: 'Orient Structurals',         amount: 336400,  due: '2026-07-20', status: 'Rejected',           created: '2026-05-26' },
  { no: 'PO-2026-0468', title: 'Roof truss assembly — Shed 2',    client: 'Larsen Build Group',         amount: 1126500, due: '2026-08-01', status: 'Draft',              created: '2026-06-09' },
  { no: 'PO-2026-0465', title: 'Column base plates',              client: 'Kamani Industrial',          amount: 472300,  due: '2026-07-18', status: 'Under Review',          created: '2026-06-06' },
  { no: 'PO-2026-0461', title: 'Conveyor support structure',      client: 'Coastal Bridgeworks',        amount: 798900,  due: '2026-07-25', status: 'Under Review',       created: '2026-06-05' },
  { no: 'PO-2026-0458', title: 'Pipe rack modules',               client: 'Helix Petrochem Ltd.',       amount: 1564000, due: '2026-08-15', status: 'Approved',           created: '2026-05-30' },
  { no: 'PO-2026-0455', title: 'Staircase & handrails — Block C', client: 'Acme Infrastructure Ltd.',   amount: 289750,  due: '2026-07-10', status: 'Draft',              created: '2026-06-08' },
];

function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1];
  return `${d} ${mon} ${y}`;
}

/* ============================================================
   ICONS — single source, 20x20 stroke
   ============================================================ */
function Icon({ name, className = 'w-[18px] h-[18px]', strokeWidth = 1.6 }) {
  const p = {
    dashboard: <g><rect x="2.5" y="2.5" width="6" height="6" rx="1"/><rect x="11.5" y="2.5" width="6" height="6" rx="1"/><rect x="2.5" y="11.5" width="6" height="6" rx="1"/><rect x="11.5" y="11.5" width="6" height="6" rx="1"/></g>,
    po: <g><path d="M5 2.5h7l4 4V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" strokeLinejoin="round"/><path d="M11.5 2.5V6.5H15.5M7 11h6M7 14h4" strokeLinecap="round"/></g>,
    projects: <g><path d="M2.5 7 10 3l7.5 4-7.5 4-7.5-4Z" strokeLinejoin="round"/><path d="M2.5 11 10 15l7.5-4" strokeLinejoin="round"/></g>,
    production: <g><circle cx="10" cy="10" r="2.4"/><path d="M10 2.5v2.2M10 15.3v2.2M2.5 10h2.2M15.3 10h2.2M4.7 4.7l1.6 1.6M13.7 13.7l1.6 1.6M15.3 4.7l-1.6 1.6M6.3 13.7l-1.6 1.6" strokeLinecap="round"/></g>,
    quality: <g><path d="M10 2.5 3.5 5v4.2c0 4 2.8 6.6 6.5 8.3 3.7-1.7 6.5-4.3 6.5-8.3V5L10 2.5Z" strokeLinejoin="round"/><path d="M7.2 10 9.3 12l3.5-3.8" strokeLinecap="round" strokeLinejoin="round"/></g>,
    dispatch: <g><rect x="2" y="6" width="10" height="8" rx="1"/><path d="M12 8.5h3l3 2.5v3h-6" strokeLinejoin="round"/><circle cx="6" cy="15" r="1.6"/><circle cx="14.5" cy="15" r="1.6"/></g>,
    documents: <g><path d="M5 2.5h6l4 4V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" strokeLinejoin="round"/><path d="M7 9h6M7 12h6M7 6h2" strokeLinecap="round"/></g>,
    disputes: <g><circle cx="10" cy="10" r="7.5"/><path d="M10 6.5v4.5M10 13.6h.01" strokeLinecap="round"/></g>,
    reports: <g><path d="M3 17V8M8 17V4M13 17v-6M17 17V9" strokeLinecap="round"/></g>,
    search: <g><circle cx="9" cy="9" r="6"/><path d="m13.5 13.5 3 3" strokeLinecap="round"/></g>,
    bell: <g><path d="M5 8a5 5 0 0 1 10 0c0 5 2 6 2 6H3s2-1 2-6Z" strokeLinejoin="round"/><path d="M8 16a2 2 0 0 0 4 0"/></g>,
    kebab: <g><circle cx="10" cy="4.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="10" cy="10" r="1.3" fill="currentColor" stroke="none"/><circle cx="10" cy="15.5" r="1.3" fill="currentColor" stroke="none"/></g>,
    chevron: <path d="M5 8 10 13 15 8" strokeLinecap="round" strokeLinejoin="round"/>,
    upload: <g><path d="M10 13V4M6.5 7.5 10 4l3.5 3.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 13.5V15a1.5 1.5 0 0 0 1.5 1.5h10A1.5 1.5 0 0 0 16.5 15v-1.5" strokeLinecap="round"/></g>,
    pdf: <g><path d="M5 2.5h6l4 4V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" strokeLinejoin="round"/><path d="M11 2.5V6.5H15" strokeLinejoin="round"/><path d="M6.5 13.5h1a1 1 0 0 0 0-2h-1v4M13.5 11.5h-2v4M11.7 13.6h1.3M9.6 13.5a1.5 2 0 0 1 0 0" strokeLinecap="round" strokeWidth="1.1"/></g>,
    check: <path d="M4 10.5 8 14.5 16 5.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>,
    x: <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" strokeLinecap="round"/>,
    plus: <path d="M10 4v12M4 10h12" strokeLinecap="round"/>,
    calendar: <g><rect x="3" y="4.5" width="14" height="12" rx="1.5"/><path d="M3 8h14M7 2.5v3M13 2.5v3" strokeLinecap="round"/></g>,
    trash: <g><path d="M4 5.5h12M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5.5 5.5 6 16a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l.5-10.5" strokeLinecap="round" strokeLinejoin="round"/></g>,
    sparkle: <path d="M10 3l1.6 4.4L16 9l-4.4 1.6L10 15l-1.6-4.4L4 9l4.4-1.6L10 3Z" strokeLinejoin="round"/>,
    spinner: <g><circle cx="10" cy="10" r="7" opacity="0.25"/><path d="M10 3a7 7 0 0 1 7 7" strokeLinecap="round"/></g>,
    eye: <g><path d="M2.5 10S5 4.5 10 4.5 17.5 10 17.5 10 15 15.5 10 15.5 2.5 10 2.5 10Z" strokeLinejoin="round"/><circle cx="10" cy="10" r="2.2"/></g>,
    edit: <g><path d="M13.5 4.5 15.5 6.5 7 15l-3 1 1-3 8.5-8.5Z" strokeLinejoin="round"/></g>,
    send: <path d="M17 3 9 11M17 3l-5 14-3-6-6-3 14-5Z" strokeLinejoin="round"/>,
    lock: <g><rect x="4.5" y="9" width="11" height="8" rx="1.5"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9" strokeLinecap="round"/></g>,
    info: <g><circle cx="10" cy="10" r="7.5"/><path d="M10 9v4.5" strokeLinecap="round"/><circle cx="10" cy="6.4" r="0.95" fill="currentColor" stroke="none"/></g>,
    block: <g><circle cx="10" cy="10" r="7.5"/><path d="m5 5 10 10" strokeLinecap="round"/></g>,
    image: <g><rect x="3" y="4" width="14" height="12" rx="1.5"/><circle cx="7.5" cy="8.5" r="1.4"/><path d="m4 14 4-3.5 3 2.5 3-3 2 2" strokeLinecap="round" strokeLinejoin="round"/></g>,
    paperclip: <path d="M14.5 9.5 9.7 14.3a3 3 0 0 1-4.2-4.2l5.4-5.4a2 2 0 0 1 2.8 2.8l-5.3 5.3a1 1 0 0 1-1.4-1.4l4.8-4.8" strokeLinecap="round" strokeLinejoin="round"/>,
  }[name];
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className}>
      {p}
    </svg>
  );
}

/* ============================================================
   APP SHELL — sidebar + topbar
   ============================================================ */
const NAV = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Purchase Orders', icon: 'po', badge: 12 },
  { name: 'Projects', icon: 'projects' },
  { name: 'Production', icon: 'production' },
  { name: 'Quality', icon: 'quality' },
  { name: 'Dispatch', icon: 'dispatch' },
  { name: 'Documents', icon: 'documents' },
  { name: 'Disputes', icon: 'disputes', badge: 3 },
  { name: 'Reports', icon: 'reports' },
];

function Sidebar({ active = 'Purchase Orders' }) {
  return (
    <aside className="w-[232px] flex-none bg-white border-r border-[#DEDEDA] flex flex-col">
      <div className="flex items-center gap-2.5 px-[18px] py-4 border-b border-[#DEDEDA]">
        <div className="w-[30px] h-[30px] rounded-md bg-[#C2410C] text-white grid place-items-center font-bold text-[15px] font-mono flex-none">PO</div>
        <div className="leading-tight">
          <div className="font-bold text-[15px] text-[#1A1A17] tracking-tight">PO Tracker</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#84837C] font-semibold">Fabrication</div>
        </div>
      </div>
      <nav className="p-3 flex-1 overflow-y-auto">
        {NAV.map((item) => {
          const on = item.name === active;
          return (
            <a
              key={item.name}
              className={
                'flex items-center gap-3 px-2.5 py-2.5 rounded-md text-[14px] cursor-pointer mb-0.5 ' +
                (on ? 'bg-[#FCEEE4] text-[#C2410C] font-semibold' : 'text-[#57564F] font-medium hover:bg-[#FAFAF8] hover:text-[#1A1A17]')
              }
            >
              <Icon name={item.icon} />
              <span>{item.name}</span>
              {item.badge ? (
                <span className="ml-auto font-mono text-[11px] font-semibold bg-[#FCECEC] text-[#B91C1C] rounded-full px-[7px] py-px leading-tight">{item.badge}</span>
              ) : null}
            </a>
          );
        })}
      </nav>
      <div className="px-[18px] py-3 border-t border-[#DEDEDA] text-[11px] font-mono text-[#84837C]">v2.4 · Shop floor</div>
    </aside>
  );
}

function TopBar({ crumb = ['Home', 'Purchase Orders'] }) {
  return (
    <header className="bg-white border-b border-[#DEDEDA] px-6 py-2.5 flex items-center gap-4 flex-none">
      <div className="flex items-center gap-1.5 text-[13px] text-[#57564F] min-w-0 flex-nowrap whitespace-nowrap overflow-hidden">
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#84837C] flex-none">/</span>}
            {i === crumb.length - 1 ? (
              <span className="text-[#1A1A17] font-semibold truncate">{c}</span>
            ) : (
              <a className="text-[#1D4ED8] hover:underline cursor-pointer flex-none">{c}</a>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex-1"></div>
      <div className="hidden md:flex items-center gap-2 border border-[#C9C9C3] rounded-md px-2.5 py-[7px] w-[240px] text-[#84837C] bg-[#FAFAF8] text-[13px]">
        <Icon name="search" className="w-[15px] h-[15px]" />
        <span>Search PO # or client…</span>
      </div>
      <button className="w-9 h-9 rounded-md border border-[#DEDEDA] bg-white grid place-items-center text-[#57564F] hover:bg-[#FAFAF8] relative">
        <Icon name="bell" />
        <span className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full bg-[#C2410C] border-[1.5px] border-white"></span>
      </button>
      <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full border border-[#DEDEDA] bg-white cursor-pointer hover:bg-[#FAFAF8]">
        <span className="w-[30px] h-[30px] rounded-full bg-[#3C3A33] text-white grid place-items-center text-[12px] font-semibold font-mono flex-none">MD</span>
        <span className="leading-tight hidden sm:block">
          <span className="block text-[13px] font-semibold text-[#1A1A17]">M. Delgado</span>
          <span className="block text-[11px] text-[#84837C] font-medium">Planning Officer</span>
        </span>
        <Icon name="chevron" className="w-3 h-3 text-[#84837C]" strokeWidth={1.6} />
      </div>
    </header>
  );
}

/* ---- 4-step wizard stepper ---- */
const WIZARD_STEPS = ['Upload', 'Analyse', 'Review', 'Confirm'];
function Stepper({ current = 1, maxStep = current, onJump }) {
  return (
    <div className="flex items-start">
      {WIZARD_STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'active' : 'upcoming';
        const canJump = onJump && n <= maxStep && n !== current;
        return (
          <div
            key={label}
            className={'flex-1 flex flex-col items-center relative text-center ' + (canJump ? 'cursor-pointer group' : '')}
            onClick={canJump ? () => onJump(n) : undefined}
          >
            {i > 0 && (
              <span
                className="absolute top-[15px] h-0.5 left-[-50%] right-[50%] z-0"
                style={{ background: n <= current ? '#C2410C' : '#C9C9C3' }}
              ></span>
            )}
            <span
              className={
                'w-8 h-8 rounded-full z-[1] grid place-items-center font-mono text-[13px] font-semibold border-2 transition-colors ' +
                (state === 'done'
                  ? 'bg-[#C2410C] border-[#C2410C] text-white ' + (canJump ? 'group-hover:bg-[#9A330A] group-hover:border-[#9A330A]' : '')
                  : state === 'active'
                  ? 'bg-white border-[#C2410C] text-[#C2410C]'
                  : 'bg-white border-[#C9C9C3] text-[#84837C]')
              }
              style={state === 'active' ? { boxShadow: '0 0 0 4px #FCEEE4' } : undefined}
            >
              {state === 'done' ? <Icon name="check" className="w-4 h-4" /> : n}
            </span>
            <span className={'text-[13px] font-semibold mt-2.5 ' + (state === 'upcoming' ? 'text-[#84837C]' : 'text-[#1A1A17]')}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---- status-history timeline (vertical) ---- */
function Timeline({ items, compact = false }) {
  return (
    <ol className="relative">
      {items.map((it, i) => {
        const s = STATUS[it.status] || STATUS['Draft'];
        const last = i === items.length - 1;
        return (
          <li key={i} className="relative pl-7 pb-5 last:pb-0">
            {!last && <span className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-[#C9C9C3]"></span>}
            <span
              className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 z-[1]"
              style={{ background: i === 0 ? s.fg : '#FFFFFF', borderColor: s.fg }}
            ></span>
            {compact ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-[#1A1A17]">{it.status}</span>
                <span className="text-[11px] font-mono text-[#84837C] whitespace-nowrap">{it.date}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <StatusPill status={it.status} />
                  <span className="text-[12px] font-mono text-[#84837C]">{it.time}</span>
                </div>
                <div className="text-[14px] text-[#1A1A17] font-medium mt-1.5">{it.actor}</div>
                {it.note && <div className="text-[13px] text-[#57564F] mt-0.5">{it.note}</div>}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---- role badge + role→lens data (shared) ---- */
const ROLE_LENS = {
  'Admin':              { lens: 'Admin',     dot: '#C2410C' },
  'Finance Officer':    { lens: 'Creator',   dot: '#1D4ED8' },
  'General Manager':    { lens: 'Approver',  dot: '#15803D' },
  'Planning Officer':   { lens: 'Project',   dot: '#B45309' },
  'Project Manager':    { lens: 'Project',   dot: '#B45309' },
  'Quality Head':       { lens: 'Read-only', dot: '#84837C' },
  'Quality Inspector':  { lens: 'Read-only', dot: '#84837C' },
  'Dispatch In-charge': { lens: 'Read-only', dot: '#84837C' },
  'Viewer':             { lens: 'Read-only', dot: '#84837C' },
};
function RoleBadge({ role, dot }) {
  const d = dot || (ROLE_LENS[role] && ROLE_LENS[role].dot) || '#84837C';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DEDEDA] bg-[#FAFAF8] px-2 py-[3px] text-[12px] font-medium text-[#57564F] whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: d }}></span>
      {role}
    </span>
  );
}

/* ---- expose to other babel scripts ---- */
Object.assign(window, {
  STATUS, StatusPill, CURRENCY, fmtINR, money, PO_DATA, fmtDate, Icon, Sidebar, TopBar, Stepper, WIZARD_STEPS, Timeline, ROLE_LENS, RoleBadge,
});
