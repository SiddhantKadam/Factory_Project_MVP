/* ============================================================
   PO LIST — FOUR ROLE VARIANTS (+ role dropdown)
   ============================================================ */

/* master dataset; per-role flags decide scope */
const ROWS = [
  { no: 'PO-2026-0481', title: 'Structural beams — Bay 4',     client: 'Acme Infrastructure Ltd.',   amount: 1849200, due: '2026-07-15', status: 'Under Review',       created: '2026-06-02', mine: true,  project: true,  shared: true,  started: false },
  { no: 'PO-2026-0479', title: 'Crane runway girders',         client: 'Meridian Construction Co.',  amount: 624000,  due: '2026-07-02', status: 'Under Review',          created: '2026-06-04', mine: false, project: false, shared: true,  started: false },
  { no: 'PO-2026-0477', title: 'Mezzanine floor framing',      client: 'Sterling Steel Projects',    amount: 918050,  due: '2026-06-28', status: 'Approved',           created: '2026-06-01', mine: true,  project: true,  shared: true,  started: false },
  { no: 'PO-2026-0474', title: 'Transfer girders — Bay 7',     client: 'Vertex Engineering Pvt Ltd', amount: 2417750, due: '2026-08-10', status: 'Revision Requested', created: '2026-05-28', mine: true,  project: false, shared: false, started: false },
  { no: 'PO-2026-0470', title: 'Loading dock frame',           client: 'Orient Structurals',         amount: 336400,  due: '2026-07-20', status: 'Rejected',           created: '2026-05-26', mine: true,  project: false, shared: true,  started: false },
  { no: 'PO-2026-0468', title: 'Roof truss assembly — Shed 2', client: 'Larsen Build Group',         amount: 1126500, due: '2026-08-01', status: 'Draft',              created: '2026-06-09', mine: true,  project: false, shared: false, started: false },
  { no: 'PO-2026-0465', title: 'Column base plates',           client: 'Kamani Industrial',          amount: 472300,  due: '2026-07-18', status: 'Under Review',          created: '2026-06-06', mine: true,  project: false, shared: false, started: false },
  { no: 'PO-2026-0461', title: 'Conveyor support structure',   client: 'Coastal Bridgeworks',        amount: 798900,  due: '2026-07-25', status: 'Under Review',       created: '2026-06-05', mine: false, project: true,  shared: false, started: false },
  { no: 'PO-2026-0458', title: 'Pipe rack modules',            client: 'Helix Petrochem Ltd.',       amount: 1564000, due: '2026-08-15', status: 'Approved',           created: '2026-05-30', mine: true,  project: true,  shared: false, started: true  },
];

/* role registry */
const VARIANTS = [
  { key: 'creator',    n: 'Variant 1', role: 'Finance Officer',  lensLabel: 'Creator',                 scope: 'Showing purchase orders you created.' },
  { key: 'approver',   n: 'Variant 2', role: 'General Manager',  lensLabel: 'Approver',                scope: 'Showing all purchase orders.' },
  { key: 'project_po', n: 'Variant 3', role: 'Planning Officer', lensLabel: 'Project · Planning Officer', scope: 'Showing purchase orders linked to your projects.' },
  { key: 'project_pm', n: 'Variant 3', role: 'Project Manager',  lensLabel: 'Project · Project Manager',  scope: 'Showing purchase orders linked to your projects.' },
  { key: 'viewer',     n: 'Variant 4', role: 'Viewer',           lensLabel: 'Read-only',               scope: 'Showing purchase orders shared with you.' },
];

/* ---- generic kebab ---- */
function Kebab({ id, openId, setOpenId, items }) {
  const open = openId === id;
  if (!items.length) return <span className="text-[#C9C9C3]">—</span>;
  return (
    <div className="relative flex justify-end">
      <button
        className={'w-8 h-8 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE] ' + (open ? 'bg-[#F0F0EE]' : '')}
        onClick={(e) => { e.stopPropagation(); setOpenId(open ? null : id); }}
        aria-label="Row actions"
      >
        <Icon name="kebab" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-44 bg-white border border-[#DEDEDA] rounded-md shadow-[0_6px_20px_rgba(26,26,23,0.12)] py-1 text-[13px]">
          {items.map((it, i) =>
            it.divider ? (
              <div key={i} className="h-px bg-[#DEDEDA] my-1"></div>
            ) : (
              <button
                key={i}
                className={'w-full flex items-center gap-2.5 px-3 py-2 text-left ' +
                  (it.tone === 'primary' ? 'text-[#C2410C] font-semibold hover:bg-[#FCEEE4]'
                   : it.tone === 'danger' ? 'text-[#B91C1C] hover:bg-[#FCECEC]'
                   : 'text-[#1A1A17] hover:bg-[#FAFAF8]')}
                onClick={(e) => { e.stopPropagation(); setOpenId(null); it.onClick && it.onClick(); }}
              >
                <Icon name={it.icon} className="w-4 h-4" /> {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* build kebab items for a row + role */
function actionsFor(roleKey, row, notify, startProject) {
  const view = { label: 'View', icon: 'eye', onClick: () => notify('View · ' + row.no) };
  if (roleKey === 'creator') {
    const items = [view];
    if (row.status === 'Draft' || row.status === 'Revision Requested') items.push({ label: 'Edit', icon: 'edit', onClick: () => notify('Edit · ' + row.no) });
    if (row.status === 'Draft') items.push({ label: 'Submit', icon: 'send', tone: 'primary', onClick: () => notify('Submit · ' + row.no) });
    items.push({ divider: true });
    items.push({ label: 'Cancel PO', icon: 'x', tone: 'danger', onClick: () => notify('Cancel · ' + row.no) });
    return items;
  }
  if (roleKey === 'approver') {
    const items = [view];
    if (row.status === 'Submitted' || row.status === 'Under Review') items.push({ label: 'Review', icon: 'check', tone: 'primary', onClick: () => notify('Review · ' + row.no) });
    return items;
  }
  if (roleKey === 'project_po') {
    const items = [view];
    if (row.status === 'Approved' && !startProject.has(row.no)) items.push({ label: 'Start project', icon: 'production', tone: 'primary', onClick: () => startProject.start(row.no) });
    return items;
  }
  /* project_pm + viewer → View only */
  return [view];
}

/* ---- one variant block ---- */
function VariantList({ variant, notify, standalone }) {
  const [openId, setOpenId] = React.useState(null);
  const [seg, setSeg] = React.useState('awaiting'); // approver
  const [empty, setEmpty] = React.useState(false);
  const [startedSet, setStartedSet] = React.useState(() => new Set(ROWS.filter(r => r.started).map(r => r.no)));
  const meta = ROLE_LENS[variant.role];

  const startProject = {
    has: (no) => startedSet.has(no),
    start: (no) => { setStartedSet(prev => new Set(prev).add(no)); notify('Project started · ' + no); },
  };

  /* scope filter */
  let rows = ROWS;
  if (variant.key === 'creator') rows = ROWS.filter(r => r.mine);
  else if (variant.key === 'approver') rows = seg === 'awaiting' ? ROWS.filter(r => r.status === 'Under Review') : ROWS;
  else if (variant.key === 'project_po' || variant.key === 'project_pm') rows = ROWS.filter(r => r.project);
  else if (variant.key === 'viewer') rows = ROWS.filter(r => r.shared);

  const awaitingCount = ROWS.filter(r => r.status === 'Under Review').length;

  if (empty) rows = [];

  /* role-specific empty copy */
  const emptyCopy = {
    creator:    { title: 'No purchase orders yet', body: 'Upload a client PO to get started.', cta: 'Create your first PO' },
    approver:   { title: seg === 'awaiting' ? 'Nothing awaiting approval' : 'No purchase orders to show', body: seg === 'awaiting' ? "You're all caught up — no submitted POs need your decision." : 'POs will appear here once created.', cta: null },
    project_po: { title: 'No purchase orders yet', body: 'POs linked to your projects will appear here.', cta: null },
    project_pm: { title: 'No purchase orders yet', body: 'POs linked to your projects will appear here.', cta: null },
    viewer:     { title: 'No purchase orders to show yet', body: 'POs shared with you will appear here.', cta: null },
  }[variant.key];

  const th = 'text-left text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3] whitespace-nowrap';
  const td = 'px-4 py-3 border-b border-[#DEDEDA] text-[#1A1A17] align-middle';

  return (
    <section className={standalone ? '' : ''}>
      {/* caption strip */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[12px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">{variant.n}</span>
        <span className="text-[15px] font-semibold text-[#1A1A17]">{variant.lensLabel}</span>
        <RoleBadge role={variant.role} dot={meta.dot} />
        <button
          className="ml-auto text-[12px] font-semibold text-[#1D4ED8] hover:underline"
          onClick={() => setEmpty(e => !e)}
        >
          {empty ? '← Show populated list' : 'Preview empty state'}
        </button>
      </div>

      {/* card */}
      <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
        {/* header */}
        <div className="p-4 border-b border-[#DEDEDA] flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">Purchase Orders</h2>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#57564F]">
              <Icon name="info" className="w-4 h-4 text-[#84837C] flex-none" />
              {variant.scope}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {/* approver segmented control */}
            {variant.key === 'approver' && (
              <div className="inline-flex rounded-md border border-[#C9C9C3] overflow-hidden bg-white">
                <button
                  className={'px-3 py-2 text-[13px] font-semibold ' + (seg === 'awaiting' ? 'bg-[#FCEEE4] text-[#C2410C]' : 'text-[#57564F] hover:bg-[#FAFAF8]')}
                  onClick={() => { setSeg('awaiting'); setEmpty(false); }}
                >
                  Awaiting my approval <span className="font-mono">({awaitingCount})</span>
                </button>
                <span className="w-px bg-[#C9C9C3]"></span>
                <button
                  className={'px-3 py-2 text-[13px] font-semibold ' + (seg === 'all' ? 'bg-[#FCEEE4] text-[#C2410C]' : 'text-[#57564F] hover:bg-[#FAFAF8]')}
                  onClick={() => { setSeg('all'); setEmpty(false); }}
                >
                  All <span className="font-mono">({ROWS.length})</span>
                </button>
              </div>
            )}
            {/* creator CTA */}
            {variant.key === 'creator' && (
              <button className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md" onClick={() => notify('New PO')}>
                <Icon name="plus" className="w-[18px] h-[18px]" strokeWidth={2} /> New PO
              </button>
            )}
          </div>
        </div>

        {/* table or empty */}
        {rows.length === 0 ? (
          <div className="grid place-items-center text-center py-14 px-6">
            <div className={'w-14 h-14 rounded-xl grid place-items-center mb-4 ' + (emptyCopy.cta ? 'bg-[#FCEEE4] text-[#C2410C]' : 'bg-[#F0F0EE] text-[#84837C]')}>
              <Icon name="po" className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#1A1A17]">{emptyCopy.title}</h3>
            <p className="text-[13px] text-[#57564F] mt-1 max-w-[40ch]">{emptyCopy.body}</p>
            {emptyCopy.cta && (
              <button className="mt-5 inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md" onClick={() => notify(emptyCopy.cta)}>
                <Icon name="plus" className="w-[18px] h-[18px]" strokeWidth={2} /> {emptyCopy.cta}
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            {openId && <div className="fixed inset-0 z-20" onClick={() => setOpenId(null)}></div>}
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr>
                  <th className={th}>PO Number</th>
                  <th className={th}>Title</th>
                  <th className={th}>Client / Vendor</th>
                  <th className={th + ' text-right'}>Total Amount</th>
                  <th className={th}>Required Delivery</th>
                  <th className={th}>Status</th>
                  <th className={th}>Created</th>
                  <th className={th + ' text-right'}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const items = actionsFor(variant.key, r, notify, startProject);
                  const needs = variant.key === 'approver' && (r.status === 'Under Review');
                  const cellBg = needs ? ' bg-[#FFFBF7]' : '';
                  const started = (variant.key === 'project_po' || variant.key === 'project_pm') && startProject.has(r.no);
                  return (
                    <tr
                      key={r.no}
                      className={'group hover:bg-[#FAFAF8] ' + (variant.key === 'viewer' ? '' : 'cursor-pointer')}
                      onClick={() => notify('Open · ' + r.no)}
                    >
                      <td className={td + cellBg + ' font-mono font-semibold tabular-nums whitespace-nowrap relative ' + (needs ? 'border-l-[3px] border-l-[#C2410C]' : '')}>{r.no}</td>
                      <td className={td + cellBg + ' font-medium max-w-[210px]'}>{r.title}</td>
                      <td className={td + cellBg + ' text-[#57564F]'}>{r.client}</td>
                      <td className={td + cellBg + ' text-right font-mono tabular-nums whitespace-nowrap'}>{money(r.amount)}</td>
                      <td className={td + cellBg + ' font-mono tabular-nums text-[13px] text-[#57564F] whitespace-nowrap'}>{fmtDate(r.due)}</td>
                      <td className={td + cellBg}><StatusPill status={r.status} /></td>
                      <td className={td + cellBg + ' font-mono tabular-nums text-[12px] text-[#84837C] whitespace-nowrap'}>{fmtDate(r.created)}</td>
                      <td className={td + cellBg + ' py-1.5'} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {started && (
                            <span className="inline-flex items-center gap-1 text-[12px] font-semibold rounded-full px-2 py-0.5" style={{ color: '#15803D', background: '#E6F6EC' }}>
                              <Icon name="check" className="w-3 h-3" /> Project started
                            </span>
                          )}
                          <Kebab id={r.no} openId={openId} setOpenId={setOpenId} items={items} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* per-variant action legend */}
      <p className="mt-2.5 text-[12px] text-[#84837C] leading-relaxed">
        {variant.key === 'creator' && 'Row actions: View · Edit (Draft / Revision Requested) · Submit (Draft) · Cancel.'}
        {variant.key === 'approver' && 'Row actions: View · Review (Under Review). Rows needing a decision carry a left accent edge.'}
        {variant.key === 'project_po' && 'Row actions: View · Start project (Approved rows). A “Project started” marker replaces it once begun.'}
        {variant.key === 'project_pm' && 'Row actions: View only. Project Managers don’t start projects or create POs.'}
        {variant.key === 'viewer' && 'Row actions: View only. Rows are otherwise non-interactive.'}
      </p>
    </section>
  );
}

/* ---- page ---- */
function RoleListVariants() {
  const [toast, setToast] = React.useState(null);
  const [role, setRole] = React.useState('all');
  const timer = React.useRef(null);
  const notify = React.useCallback((m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 1900); }, []);

  const current = VARIANTS.find(v => v.key === role);
  const shown = role === 'all' ? VARIANTS : [current];

  const SELECT_BG = {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F4F4F2] text-[#1A1A17]">
      <Sidebar active="Purchase Orders" />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar crumb={['Home', 'Purchase Orders']} />

        {/* role control bar */}
        <div className="bg-white border-b border-[#DEDEDA] px-6 py-3 flex items-center gap-3 flex-none flex-wrap">
          <Icon name="lock" className="w-[18px] h-[18px] text-[#C2410C]" />
          <span className="text-[13px] font-semibold text-[#1A1A17]">Preview the list as role</span>
          <div className="relative">
            <select
              className="h-9 rounded-md border border-[#C9C9C3] bg-white text-[14px] font-semibold text-[#1A1A17] pl-3 pr-9 appearance-none cursor-pointer focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35"
              style={SELECT_BG}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="all">Compare all four variants</option>
              <option value="creator">Creator · Finance Officer</option>
              <option value="approver">Approver · General Manager</option>
              <option value="project_po">Project · Planning Officer</option>
              <option value="project_pm">Project · Project Manager</option>
              <option value="viewer">Read-only · Viewer</option>
            </select>
          </div>
          {role !== 'all' && current && (
            <span className="flex items-center gap-2 text-[13px] text-[#57564F]">
              <span className="text-[#84837C]">signed in as</span>
              <RoleBadge role={current.role} dot={ROLE_LENS[current.role].dot} />
            </span>
          )}
          <span className="ml-auto text-[12px] font-mono text-[#84837C]">Same table · scope, CTA, actions &amp; empty state change by role</span>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1180px] mx-auto flex flex-col gap-10">
            {shown.map((v) => <VariantList key={v.key} variant={v} notify={notify} standalone={role !== 'all'} />)}
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" />
          <span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<RoleListVariants />);
