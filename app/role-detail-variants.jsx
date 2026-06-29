/* ============================================================
   PO DETAIL — FOUR ROLE VARIANTS (+ role dropdown)
   ============================================================ */

const D_PO = {
  poNumber: 'PO-2026-0042',
  title: 'Structural steel — Warehouse Block B',
  client: 'Acme Infrastructure Ltd.',
  currency: 'INR',
  total: 788800,
  due: '2026-08-20',
  pm: 'R. Okafor',
  submittedBy: 'M. Delgado',
  createdBy: 'M. Delgado',
  created: '2026-06-02',
  notes:
    'Fabricate and supply primary structural steel for Warehouse Block B. All members to be shot-blasted to SA 2.5 and primed before dispatch. Camber per drawing S-204. Delivery to site in two lots, sequenced with the erection schedule.',
  items: [
    { desc: 'ISMB 300 primary beams — fabricated & shot-blasted', qty: 24, price: 18500 },
    { desc: 'ISMC 150 channel bracing', qty: 60, price: 4200 },
    { desc: 'Base plates 400×400×20mm w/ anchor assembly', qty: 16, price: 5800 },
  ],
  docs: [
    { name: 'acme-PO-bay4-structural.pdf', type: 'PO', by: 'M. Delgado', date: '2026-06-02', size: '2.4 MB' },
    { name: 'GA-drawing-S-204.pdf', type: 'Drawing', by: 'R. Okafor', date: '2026-06-03', size: '5.1 MB' },
    { name: 'material-spec-A992.pdf', type: 'Spec', by: 'R. Okafor', date: '2026-06-03', size: '820 KB' },
  ],
};

const D_DOC_TYPE = {
  PO: { fg: '#C2410C', bg: '#FCEEE4' },
  Drawing: { fg: '#1D4ED8', bg: '#E9F0FF' },
  Spec: { fg: '#57564F', bg: '#F0F0EE' },
  Certificate: { fg: '#15803D', bg: '#E6F6EC' },
};

/* activity history truncated to a given status */
const FULL_ACTIVITY = [
  { status: 'Approved', actor: 'A. Rahman · Director', time: '06 Jun 2026 · 14:08', note: 'Approved. Proceed to production scheduling.' },
  { status: 'Under Review', actor: 'A. Rahman · Director', time: '04 Jun 2026 · 14:08', note: 'Opened for review.' },
  { status: 'Under Review', actor: 'M. Delgado · Planning Officer', time: '04 Jun 2026 · 09:31', note: 'Sent for approval.' },
  { status: 'Draft', actor: 'M. Delgado · Planning Officer', time: '02 Jun 2026 · 11:02', note: 'Draft created from client PDF.' },
];
function activityUpTo(status) {
  const order = ['Draft', 'Under Review', 'Approved'];
  const max = order.indexOf(status);
  return FULL_ACTIVITY.filter((a) => order.indexOf(a.status) <= max);
}

/* ---------- shared tab bodies ---------- */
function DFact({ label, children, mono, editable }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{label}</span>
      <span className={'text-[14px] text-[#1A1A17] inline-flex items-center gap-1.5 ' + (mono ? 'font-mono tabular-nums font-semibold' : 'font-medium')}>
        {children}
        {editable && <Icon name="edit" className="w-3.5 h-3.5 text-[#84837C]" />}
      </span>
    </div>
  );
}

function DOverview({ po, editable, total }) {
  const cards = [
    { label: 'Total amount', val: money(total, po.currency), mono: true },
    { label: 'Required delivery', val: fmtDate(po.due), mono: true },
    { label: 'Project manager', val: po.pm },
    { label: 'Line items', val: po.items.length + ' items', mono: true },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="border border-[#DEDEDA] rounded-lg bg-white px-4 py-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{c.label}</div>
            <div className={'mt-1 text-[18px] text-[#1A1A17] ' + (c.mono ? 'font-mono tabular-nums font-semibold' : 'font-semibold')}>{c.val}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-[16px] font-semibold text-[#1A1A17]">Notes &amp; description</h3>
          {editable && <span className="text-[11px] font-semibold rounded-full px-1.5 py-0.5" style={{ color: '#C2410C', background: '#FCEEE4' }}>editable</span>}
        </div>
        {editable ? (
          <textarea
            defaultValue={po.notes}
            className="w-full min-h-[96px] rounded-lg border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3.5 py-3 leading-relaxed resize-y focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35"
          />
        ) : (
          <p className="text-[14px] text-[#1A1A17] leading-relaxed bg-[#FAFAF8] border border-[#DEDEDA] rounded-lg px-4 py-3.5">{po.notes}</p>
        )}
      </div>
    </div>
  );
}

function DLineItems({ po, editable }) {
  const [items, setItems] = React.useState(po.items);
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const th = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3]';
  const td = 'px-4 py-3 border-b border-[#DEDEDA] text-[#1A1A17]';
  const liInput = 'w-full bg-transparent text-[14px] text-[#1A1A17] px-1.5 py-1 rounded text-right font-mono tabular-nums focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C2410C]/30';
  const setItem = (i, k) => (e) => { const v = k === 'desc' ? e.target.value : Number(e.target.value || 0); setItems(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it)); };
  return (
    <div>
      {editable && (
        <div className="flex items-center justify-end mb-2.5">
          <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C2410C] hover:bg-[#FCEEE4] px-2.5 py-1.5 rounded-md" onClick={() => setItems([...items, { desc: '', qty: 1, price: 0 }])}>
            <Icon name="plus" className="w-4 h-4" strokeWidth={2} /> Add line item
          </button>
        </div>
      )}
      <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              <th className={th + ' text-left'}>Description</th>
              <th className={th + ' text-right w-20'}>Qty</th>
              <th className={th + ' text-right w-32'}>Unit Price</th>
              <th className={th + ' text-right w-36'}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="hover:bg-[#FAFAF8]">
                <td className={td + ' font-medium'}>{it.desc}</td>
                <td className={td + ' text-right'}>{editable ? <input type="number" className={liInput} value={it.qty} onChange={setItem(i, 'qty')} /> : <span className="font-mono tabular-nums">{it.qty}</span>}</td>
                <td className={td + ' text-right text-[#57564F]'}>{editable ? <input type="number" className={liInput} value={it.price} onChange={setItem(i, 'price')} /> : <span className="font-mono tabular-nums">{money(it.price, po.currency)}</span>}</td>
                <td className={td + ' text-right font-mono tabular-nums whitespace-nowrap'}>{money(it.qty * it.price, po.currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#FAFAF8]">
              <td className="px-4 py-3 text-right font-semibold text-[#57564F] text-[13px] uppercase tracking-wide" colSpan={3}>Total</td>
              <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-[16px] text-[#1A1A17] whitespace-nowrap">{money(total, po.currency)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function DDocs({ po, notify }) {
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden divide-y divide-[#DEDEDA]">
      {po.docs.map((d, i) => {
        const t = D_DOC_TYPE[d.type] || D_DOC_TYPE.Spec;
        return (
          <div key={i} className="flex items-center gap-3.5 px-4 py-3 hover:bg-[#FAFAF8]">
            <span className="w-10 h-10 rounded-md bg-[#FCECEC] text-[#B91C1C] grid place-items-center flex-none"><Icon name="pdf" className="w-5 h-5" strokeWidth={1.5} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#1A1A17] truncate font-mono">{d.name}</span>
                <span className="text-[11px] font-semibold rounded-full px-2 py-0.5 flex-none" style={{ color: t.fg, background: t.bg }}>{d.type}</span>
              </div>
              <div className="text-[12px] text-[#84837C] font-mono mt-0.5">{d.size} · {d.by} · {fmtDate(d.date)}</div>
            </div>
            <div className="flex items-center gap-1 flex-none">
              <button className="w-9 h-9 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE]" onClick={() => notify('Preview · ' + d.name)} aria-label="Preview"><Icon name="eye" className="w-[18px] h-[18px]" /></button>
              <button className="w-9 h-9 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE]" onClick={() => notify('Download · ' + d.name)} aria-label="Download"><Icon name="upload" className="w-[18px] h-[18px] rotate-180" /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- variant config ---------- */
const D_VARIANTS = [
  { key: 'creator',   n: 'Variant 1', role: 'Finance Officer',  lensLabel: 'Creator',              status: 'Draft',        editable: true,  banner: null },
  { key: 'submitted', n: 'Variant 2', role: 'Finance Officer',  lensLabel: 'Creator (Submitted)',  status: 'Under Review', editable: false, banner: 'This PO is under review. No edits can be made until the approval chain is complete.' },
  { key: 'approver',  n: 'Variant 3', role: 'General Manager',  lensLabel: 'Approver',             status: 'Under Review', editable: false, banner: "You're reviewing this PO — open Review to make a decision." },
  { key: 'project',   n: 'Variant 4', role: 'Planning Officer', lensLabel: 'Project',              status: 'Approved',     editable: false, banner: 'This PO is approved. You can start its project.' },
  { key: 'viewer',    n: 'Variant 5', role: 'Viewer',           lensLabel: 'Read-only',            status: 'Approved',     editable: false, banner: "You're viewing this in read-only mode." },
];

/* role-specific top-right action area */
function DActions({ variant, started, onStart, notify }) {
  const primary = 'inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md';
  const secondary = 'inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md';
  const quiet = 'inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1D4ED8] hover:underline';
  if (variant.key === 'creator') {
    return (
      <>
        <button className={secondary} onClick={() => notify('Edit · ' + D_PO.poNumber)}><Icon name="edit" className="w-[18px] h-[18px]" /> Edit</button>
        <button className={primary} onClick={() => notify('Submit for approval')}><Icon name="send" className="w-[18px] h-[18px]" /> Submit for approval</button>
      </>
    );
  }
  if (variant.key === 'submitted') {
    return null;
  }
  if (variant.key === 'approver') {
    return <button className={primary} onClick={() => notify('Open Review screen')}><Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Review</button>;
  }
  if (variant.key === 'project') {
    return started ? (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold rounded-full px-2.5 py-1" style={{ color: '#15803D', background: '#E6F6EC' }}><Icon name="check" className="w-4 h-4" /> Project started</span>
        <button className={quiet} onClick={() => notify('Open created project')}><Icon name="projects" className="w-4 h-4" /> View created project</button>
      </div>
    ) : (
      <button className={primary} onClick={onStart}><Icon name="production" className="w-[18px] h-[18px]" /> Start project</button>
    );
  }
  /* viewer */
  return <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#57564F] font-semibold text-[14px] px-4 py-2.5 rounded-md" onClick={() => notify('Add comment')}><Icon name="documents" className="w-[18px] h-[18px]" /> Add comment</button>;
}

function DetailVariant({ variant, notify }) {
  const [tab, setTab] = React.useState('Overview');
  const [bannerOpen, setBannerOpen] = React.useState(true);
  const [started, setStarted] = React.useState(false);
  const po = D_PO;
  const meta = ROLE_LENS[variant.role];
  const tabs = ['Overview', 'Line Items', 'Documents', 'Activity'];
  const total = po.items.reduce((s, it) => s + it.qty * it.price, 0);
  const activity = activityUpTo(variant.status);
  const counts = { 'Line Items': po.items.length, Documents: po.docs.length, Activity: activity.length };

  return (
    <section>
      {/* caption strip */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[12px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">{variant.n}</span>
        <span className="text-[15px] font-semibold text-[#1A1A17]">{variant.lensLabel}</span>
        <RoleBadge role={variant.role} dot={meta.dot} />
        <span className="text-[12px] font-mono text-[#84837C]">· PO is <span className="font-semibold text-[#57564F]">{variant.status}</span></span>
      </div>

      {/* read-only banner */}
      {variant.banner && bannerOpen && (
        <div className="flex items-center gap-2.5 rounded-t-lg border border-b-0 border-[#DEDEDA] bg-[#FAFAF8] px-4 py-2.5">
          <Icon name={variant.key === 'project' ? 'production' : 'eye'} className="w-[18px] h-[18px] text-[#57564F] flex-none" />
          <span className="text-[13px] text-[#1A1A17] font-medium">{variant.banner}</span>
          <button className="ml-auto w-7 h-7 rounded-md grid place-items-center text-[#84837C] hover:bg-[#F0F0EE] flex-none" aria-label="Dismiss" onClick={() => setBannerOpen(false)}><Icon name="x" className="w-4 h-4" /></button>
        </div>
      )}

      {/* card */}
      <div className={'bg-white border border-[#DEDEDA] shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden ' + (variant.banner && bannerOpen ? 'rounded-b-lg' : 'rounded-lg')}>
        {/* header + action area */}
        <div className="p-6 border-b border-[#DEDEDA]">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[24px] font-mono font-semibold tabular-nums text-[#1A1A17] tracking-tight">{po.poNumber}</span>
                <StatusPill status={variant.status} />
              </div>
              <h2 className="text-[18px] font-semibold text-[#1A1A17] mt-1.5">{po.title}</h2>
              <div className="text-[14px] text-[#57564F] mt-0.5">{po.client}</div>
            </div>
            {/* FOCAL: action area */}
            <div className="flex items-center gap-2.5 flex-none">
              <DActions variant={variant} started={started} onStart={() => { setStarted(true); notify('Project started'); }} notify={notify} />
            </div>
          </div>

          {/* key facts */}
          <div className="mt-6 pt-5 border-t border-[#DEDEDA] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
            <DFact label="Total amount" mono editable={variant.editable}>{money(total, po.currency)}</DFact>
            <DFact label="Currency" mono editable={variant.editable}>{po.currency}</DFact>
            <DFact label="Required delivery" mono editable={variant.editable}>{fmtDate(po.due)}</DFact>
            <DFact label="Assigned PM" editable={variant.editable}>{po.pm}</DFact>
            <DFact label={variant.key === 'creator' ? 'Created by' : 'Submitted by'}>{po.createdBy}</DFact>
            <DFact label="Created" mono>{fmtDate(po.created)}</DFact>
          </div>
        </div>

        {/* tabs */}
        <div className="px-5 border-b border-[#DEDEDA] flex gap-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={'text-[14px] font-semibold px-3.5 py-3 border-b-2 -mb-px ' + (tab === t ? 'text-[#C2410C] border-[#C2410C]' : 'text-[#57564F] border-transparent hover:text-[#1A1A17]')}>
              {t}{counts[t] != null && <span className="font-mono text-[12px] text-[#84837C] ml-1.5">{counts[t]}</span>}
            </button>
          ))}
        </div>

        {/* tab body */}
        <div className="p-6">
          {tab === 'Overview' && <DOverview po={po} editable={variant.editable} total={total} />}
          {tab === 'Line Items' && <DLineItems po={po} editable={variant.editable} />}
          {tab === 'Documents' && <DDocs po={po} notify={notify} />}
          {tab === 'Activity' && (
            <div>
              <h3 className="text-[16px] font-semibold text-[#1A1A17] mb-4">Status history</h3>
              <Timeline items={activity} />
            </div>
          )}
        </div>
      </div>

      {/* action legend */}
      <p className="mt-2.5 text-[12px] text-[#84837C] leading-relaxed">
        {variant.key === 'creator'   && 'Action area: Edit + Submit for approval. Fields and line items are editable while the PO is a Draft.'}
        {variant.key === 'submitted' && 'Action area: no buttons. The Finance Officer cannot edit or act once the PO is Under Review — it is locked pending approval.'}
        {variant.key === 'approver'  && 'Action area: a single prominent Review button → approval screen. All fields read-only.'}
        {variant.key === 'project'   && 'Action area: Start project (Approved PO); becomes a “Project started” marker + quiet link once begun. Fields read-only.'}
        {variant.key === 'viewer'    && 'Action area: no state actions — only a quiet Add comment. Everything is strictly read-only.'}
      </p>
    </section>
  );
}

/* ---------- page ---------- */
function RoleDetailVariants() {
  const [toast, setToast] = React.useState(null);
  const [role, setRole] = React.useState('all');
  const timer = React.useRef(null);
  const notify = React.useCallback((m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 1900); }, []);

  const current = D_VARIANTS.find((v) => v.key === role);
  const shown = role === 'all' ? D_VARIANTS : [current];

  const SELECT_BG = {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F4F4F2] text-[#1A1A17]">
      <Sidebar active="Purchase Orders" />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar crumb={['Home', 'Purchase Orders', D_PO.poNumber]} />

        {/* role control bar */}
        <div className="bg-white border-b border-[#DEDEDA] px-6 py-3 flex items-center gap-3 flex-none flex-wrap">
          <Icon name="lock" className="w-[18px] h-[18px] text-[#C2410C]" />
          <span className="text-[13px] font-semibold text-[#1A1A17]">Preview this PO as role</span>
          <select
            className="h-9 rounded-md border border-[#C9C9C3] bg-white text-[14px] font-semibold text-[#1A1A17] pl-3 pr-9 appearance-none cursor-pointer focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35"
            style={SELECT_BG}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="all">Compare all five variants</option>
            <option value="creator">Variant 1 · Finance Officer (Draft)</option>
            <option value="submitted">Variant 2 · Finance Officer (Under Review)</option>
            <option value="approver">Variant 3 · General Manager (Under Review)</option>
            <option value="project">Variant 4 · Planning Officer (Approved)</option>
            <option value="viewer">Variant 5 · Read-only · Viewer</option>
          </select>
          {role !== 'all' && current && (
            <span className="flex items-center gap-2 text-[13px] text-[#57564F]"><span className="text-[#84837C]">signed in as</span><RoleBadge role={current.role} dot={ROLE_LENS[current.role].dot} /></span>
          )}
          <span className="ml-auto text-[12px] font-mono text-[#84837C]">Same body · action area, editability &amp; banner change by role</span>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1080px] mx-auto flex flex-col gap-10">
            {shown.map((v) => <DetailVariant key={v.key} variant={v} notify={notify} />)}
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

ReactDOM.createRoot(document.getElementById('root')).render(<RoleDetailVariants />);
