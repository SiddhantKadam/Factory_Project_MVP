/* ============================================================
   SCREEN C — PO Detail
   ============================================================ */

/* --- the PO being viewed --- */
const DETAIL_PO = {
  poNumber: 'PO-2026-0042',
  title: 'Structural steel — Warehouse Block B',
  client: 'Acme Infrastructure Ltd.',
  currency: 'INR',
  total: 788800,
  due: '2026-08-20',
  pm: 'R. Okafor',
  createdBy: 'M. Delgado',
  createdRole: 'Planning Officer',
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
    { name: 'MTR-cert-batch-118.pdf', type: 'Certificate', by: 'Atlas Steel (supplier)', date: '2026-06-04', size: '1.2 MB' },
  ],
  activity: [
    { status: 'Approved', actor: 'A. Rahman · Director', time: '06 Jun 2026 · 14:08', note: 'Approved. Proceed to production scheduling.' },
    { status: 'Under Review', actor: 'R. Okafor · Project Manager', time: '04 Jun 2026 · 14:08', note: 'Checked against quote Q-8841 and drawings. Pricing OK.' },
    { status: 'Under Review', actor: 'M. Delgado · Planning Officer', time: '04 Jun 2026 · 09:31', note: 'Sent for approval.' },
    { status: 'Draft', actor: 'M. Delgado · Planning Officer', time: '02 Jun 2026 · 11:02', note: 'Draft created from client PDF.' },
  ],
};

const DOC_TYPE = {
  PO:          { fg: '#C2410C', bg: '#FCEEE4' },
  Drawing:     { fg: '#1D4ED8', bg: '#E9F0FF' },
  Spec:        { fg: '#57564F', bg: '#F0F0EE' },
  Certificate: { fg: '#15803D', bg: '#E6F6EC' },
};

const dBtnPrimary = 'inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md';
const dBtnSecondary = 'inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md';
const dBtnDestructive = 'inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#B91C1C] hover:text-[#B91C1C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md';

/* action buttons differ by status */
function ActionsFor({ status, notify }) {
  const A = (msg, cls, icon) => (
    <button className={cls} onClick={() => notify(msg)}>{icon}{msg}</button>
  );
  switch (status) {
    case 'Approved':
      return (
        <>
          {A('Download PO', dBtnSecondary, <Icon name="documents" className="w-[18px] h-[18px]" />)}
          {A('Start project', dBtnPrimary, <Icon name="production" className="w-[18px] h-[18px]" />)}
        </>
      );
    case 'Draft':
      return (
        <>
          {A('Edit', dBtnSecondary, <Icon name="edit" className="w-[18px] h-[18px]" />)}
          {A('Submit for approval', dBtnPrimary, <Icon name="send" className="w-[18px] h-[18px]" />)}
        </>
      );
    case 'Rejected':
      return (
        <>
          {A('View rejection note', dBtnSecondary, <Icon name="disputes" className="w-[18px] h-[18px]" />)}
          {A('Duplicate & revise', dBtnPrimary, <Icon name="edit" className="w-[18px] h-[18px]" />)}
        </>
      );
    case 'Under Review':
      return (
        <>
          {A('Add note', dBtnSecondary, <Icon name="edit" className="w-[18px] h-[18px]" />)}
          {A('Approve', dBtnPrimary, <Icon name="check" className="w-[18px] h-[18px]" />)}
        </>
      );
    case 'Revision Requested':
      return A('Edit & resubmit', dBtnPrimary, <Icon name="edit" className="w-[18px] h-[18px]" />);
    default:
      return null;
  }
}

/* small annotation card describing other states' actions */
function ActionVariantNote({ status, label, children }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-[#DEDEDA] bg-white px-3.5 py-3">
      <div className="flex-none pt-0.5"><StatusPill status={status} /></div>
      <p className="text-[13px] text-[#57564F] leading-relaxed">
        <span className="text-[#1A1A17] font-semibold">{label}:</span> {children}
      </p>
    </div>
  );
}

function Fact({ label, children, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{label}</span>
      <span className={'text-[14px] text-[#1A1A17] ' + (mono ? 'font-mono tabular-nums font-semibold' : 'font-medium')}>{children}</span>
    </div>
  );
}

/* ---- tab bodies ---- */
function LineItemsTable({ po }) {
  const total = po.items.reduce((s, it) => s + it.qty * it.price, 0);
  const th = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3]';
  const td = 'px-4 py-3 border-b border-[#DEDEDA] text-[#1A1A17]';
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr>
            <th className={th + ' text-left'}>Description</th>
            <th className={th + ' text-right w-20'}>Qty</th>
            <th className={th + ' text-right w-36'}>Unit Price</th>
            <th className={th + ' text-right w-40'}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {po.items.map((it, i) => (
            <tr key={i} className="hover:bg-[#FAFAF8]">
              <td className={td + ' font-medium'}>{it.desc}</td>
              <td className={td + ' text-right font-mono tabular-nums'}>{it.qty}</td>
              <td className={td + ' text-right font-mono tabular-nums text-[#57564F]'}>{money(it.price, po.currency)}</td>
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
  );
}

function DocsList({ po, notify }) {
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden divide-y divide-[#DEDEDA]">
      {po.docs.map((d, i) => {
        const t = DOC_TYPE[d.type] || DOC_TYPE.Spec;
        return (
          <div key={i} className="flex items-center gap-3.5 px-4 py-3 hover:bg-[#FAFAF8]">
            <span className="w-10 h-10 rounded-md bg-[#FCECEC] text-[#B91C1C] grid place-items-center flex-none">
              <Icon name="pdf" className="w-5 h-5" strokeWidth={1.5} />
            </span>
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

function OverviewTab({ po }) {
  const total = po.items.reduce((s, it) => s + it.qty * it.price, 0);
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
        <h3 className="text-[16px] font-semibold text-[#1A1A17] mb-2">Notes &amp; description</h3>
        <p className="text-[14px] text-[#1A1A17] leading-relaxed bg-[#FAFAF8] border border-[#DEDEDA] rounded-lg px-4 py-3.5">{po.notes}</p>
      </div>
    </div>
  );
}

/* ---- main screen ---- */
function ScreenC({ notify }) {
  const [tab, setTab] = React.useState('Overview');
  const [status, setStatus] = React.useState('Approved');
  const po = DETAIL_PO;
  const tabs = ['Overview', 'Line Items', 'Documents', 'Activity'];
  const counts = { 'Line Items': po.items.length, Documents: po.docs.length, Activity: po.activity.length };

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Purchase Orders', po.poNumber]} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1180px] mx-auto">

          {/* status demo switcher */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">Preview status</span>
            {['Approved', 'Draft', 'Rejected', 'Under Review', 'Revision Requested'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={'text-[12px] font-semibold px-2.5 py-1 rounded-full border transition-colors ' + (status === s ? 'border-[#C2410C] bg-[#FCEEE4] text-[#C2410C]' : 'border-[#DEDEDA] bg-white text-[#57564F] hover:border-[#84837C]')}
              >
                {s}
              </button>
            ))}
          </div>

          {/* header block */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-6 mb-5">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[26px] font-mono font-semibold tabular-nums text-[#1A1A17] tracking-tight">{po.poNumber}</span>
                  <StatusPill status={status} />
                </div>
                <h1 className="text-[20px] font-semibold text-[#1A1A17] mt-1.5">{po.title}</h1>
                <div className="text-[14px] text-[#57564F] mt-1">{po.client}</div>
              </div>
              <div className="flex items-center gap-2.5 flex-none">
                <ActionsFor status={status} notify={notify} />
                <button className="w-[42px] h-[42px] rounded-md border border-[#C9C9C3] bg-white grid place-items-center text-[#57564F] hover:bg-[#FAFAF8]" onClick={() => notify('More actions')} aria-label="More"><Icon name="kebab" /></button>
              </div>
            </div>

            {/* key facts strip */}
            <div className="mt-6 pt-5 border-t border-[#DEDEDA] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-4">
              <Fact label="Client">{po.client}</Fact>
              <Fact label="Total amount" mono>{money(po.total, po.currency)}</Fact>
              <Fact label="Currency" mono>{po.currency}</Fact>
              <Fact label="Required delivery" mono>{fmtDate(po.due)}</Fact>
              <Fact label="Project manager">{po.pm}</Fact>
              <Fact label="Created by">{po.createdBy}</Fact>
              <Fact label="Created" mono>{fmtDate(po.created)}</Fact>
            </div>
          </div>

          {/* two-column: body + status rail */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
            {/* body */}
            <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
              <div className="px-5 border-b border-[#DEDEDA] flex gap-1">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={'text-[14px] font-semibold px-3.5 py-3 border-b-2 -mb-px ' + (tab === t ? 'text-[#C2410C] border-[#C2410C]' : 'text-[#57564F] border-transparent hover:text-[#1A1A17]')}
                  >
                    {t}
                    {counts[t] != null && <span className="font-mono text-[12px] text-[#84837C] ml-1.5">{counts[t]}</span>}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {tab === 'Overview' && <OverviewTab po={po} />}
                {tab === 'Line Items' && <LineItemsTable po={po} />}
                {tab === 'Documents' && <DocsList po={po} notify={notify} />}
                {tab === 'Activity' && (
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1A1A17] mb-4">Status history</h3>
                    <Timeline items={po.activity} />
                  </div>
                )}
              </div>
            </div>

            {/* right rail: status history always visible */}
            <aside className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-5 lg:sticky lg:top-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#1A1A17]">Status history</h3>
                <button className="text-[12px] font-semibold text-[#1D4ED8] hover:underline" onClick={() => setTab('Activity')}>View all</button>
              </div>
              <Timeline items={po.activity} compact />
              <div className="mt-4 pt-4 border-t border-[#DEDEDA] text-[12px] font-mono text-[#84837C] flex items-center gap-2">
                <Icon name="quality" className="w-4 h-4 text-[#15803D]" /> 4 transitions · 0 open issues
              </div>
            </aside>
          </div>

          {/* action variants annotation */}
          <div className="mt-6">
            <div className="text-[12px] font-mono uppercase tracking-wider text-[#84837C] mb-2.5">How the top-right actions change by status</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ActionVariantNote status="Approved" label="Approved (shown)">primary <b>Start project</b> + <b>Download PO</b>.</ActionVariantNote>
              <ActionVariantNote status="Draft" label="Draft">secondary <b>Edit</b> + primary <b>Submit for approval</b>.</ActionVariantNote>
              <ActionVariantNote status="Rejected" label="Rejected">secondary <b>View rejection note</b> + primary <b>Duplicate &amp; revise</b>.</ActionVariantNote>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

window.ScreenC = ScreenC;
