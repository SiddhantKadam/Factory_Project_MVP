/* ============================================================
   SCREEN D — PO Review / Approval (GM / Director)
   ============================================================ */

const REVIEW_PO = {
  poNumber: 'PO-2026-0042',
  title: 'Structural steel — Warehouse Block B',
  client: 'Acme Infrastructure Ltd.',
  currency: 'INR',
  total: 788800,
  due: '2026-08-20',
  pm: 'R. Okafor',
  submittedBy: 'M. Delgado',
  submittedRole: 'Planning Officer',
  submitted: '2026-06-04',
  file: { name: 'acme-PO-bay4-structural.pdf', size: '2.4 MB', pages: 3 },
  items: [
    { desc: 'ISMB 300 primary beams — fabricated & shot-blasted', qty: 24, price: 18500 },
    { desc: 'ISMC 150 channel bracing', qty: 60, price: 4200 },
    { desc: 'Base plates 400×400×20mm w/ anchor assembly', qty: 16, price: 5800 },
  ],
  activity: [
    { status: 'Under Review', actor: 'A. Rahman · Director', time: '04 Jun 2026 · 14:08', note: 'Opened for review.' },
    { status: 'Under Review', actor: 'M. Delgado · Planning Officer', time: '04 Jun 2026 · 09:31', note: 'Sent for approval.' },
    { status: 'Draft', actor: 'M. Delgado · Planning Officer', time: '02 Jun 2026 · 11:02', note: 'Draft created from client PDF.' },
  ],
};

/* ---- read-only key fact ---- */
function RFact({ label, children, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{label}</span>
      <span className={'text-[14px] text-[#1A1A17] ' + (mono ? 'font-mono tabular-nums font-semibold' : 'font-medium')}>{children}</span>
    </div>
  );
}

/* ---- PDF preview placeholder with page controls ---- */
function PdfPreview({ po }) {
  const [page, setPage] = React.useState(1);
  const [zoom, setZoom] = React.useState(100);
  const pages = po.file.pages;
  const ToolBtn = ({ onClick, disabled, children, label }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={'w-8 h-8 rounded-md grid place-items-center text-[#1A1A17] ' + (disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#F0F0EE]')}
    >
      {children}
    </button>
  );
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
      {/* viewer toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#FAFAF8] border-b border-[#DEDEDA]">
        <span className="w-7 h-7 rounded-md bg-[#FCECEC] text-[#B91C1C] grid place-items-center flex-none">
          <Icon name="pdf" className="w-4 h-4" strokeWidth={1.5} />
        </span>
        <span className="text-[13px] font-mono font-semibold text-[#1A1A17] truncate min-w-0">{po.file.name}</span>
        <div className="flex-1"></div>
        <ToolBtn onClick={() => setZoom((z) => Math.max(60, z - 20))} label="Zoom out">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 10h10" strokeLinecap="round"/></svg>
        </ToolBtn>
        <span className="text-[12px] font-mono tabular-nums text-[#57564F] w-12 text-center">{zoom}%</span>
        <ToolBtn onClick={() => setZoom((z) => Math.min(160, z + 20))} label="Zoom in">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M10 5v10M5 10h10" strokeLinecap="round"/></svg>
        </ToolBtn>
        <span className="w-px h-5 bg-[#DEDEDA] mx-1"></span>
        <button className="w-8 h-8 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE]" aria-label="Download"><Icon name="upload" className="w-[18px] h-[18px] rotate-180" /></button>
      </div>
      {/* page canvas */}
      <div className="bg-[#E8E8E4] px-6 py-6 grid place-items-center overflow-hidden">
        <div
          className="bg-white shadow-[0_2px_10px_rgba(26,26,23,0.14)] border border-[#DEDEDA] origin-top transition-transform"
          style={{ width: 340, transform: `scale(${zoom / 100})` }}
        >
          <div className="px-7 py-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-[13px] font-bold text-[#1A1A17] tracking-tight">ACME INFRASTRUCTURE LTD.</div>
                <div className="text-[8px] text-[#84837C] font-mono mt-0.5">Plot 14, MIDC Industrial Area · Pune 411026</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-[#1A1A17]">PURCHASE ORDER</div>
                <div className="text-[8px] font-mono text-[#57564F] mt-0.5">{po.poNumber}</div>
              </div>
            </div>
            <div className="h-px bg-[#DEDEDA] mb-3"></div>
            {/* faux body lines vary by page */}
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-1.5 rounded-full bg-[#EDEDEA]" style={{ width: `${[96, 72, 88, 60, 92, 78, 50, 84, 66][(i + page) % 9]}%` }}></div>
              ))}
            </div>
            <div className="mt-4 border border-[#EDEDEA] rounded">
              <div className="flex bg-[#FAFAF8] border-b border-[#EDEDEA] px-2 py-1.5 gap-2">
                <div className="h-1.5 rounded-full bg-[#E0E0DC] w-1/2"></div>
                <div className="h-1.5 rounded-full bg-[#E0E0DC] w-1/6 ml-auto"></div>
                <div className="h-1.5 rounded-full bg-[#E0E0DC] w-1/6"></div>
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex px-2 py-1.5 gap-2 border-b border-[#F2F2EF] last:border-0">
                  <div className="h-1.5 rounded-full bg-[#EDEDEA] w-1/2"></div>
                  <div className="h-1.5 rounded-full bg-[#EDEDEA] w-1/6 ml-auto"></div>
                  <div className="h-1.5 rounded-full bg-[#EDEDEA] w-1/6"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <div className="h-2 rounded-full bg-[#E0E0DC] w-1/3"></div>
            </div>
            <div className="text-center mt-6 text-[7px] font-mono text-[#B7B6AF]">Page {page} of {pages}</div>
          </div>
        </div>
      </div>
      {/* page nav */}
      <div className="flex items-center justify-center gap-3 px-3 py-2.5 bg-[#FAFAF8] border-t border-[#DEDEDA]">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={'px-3 py-1.5 rounded-md border text-[13px] font-semibold ' + (page === 1 ? 'border-[#DEDEDA] text-[#84837C] opacity-50 cursor-not-allowed' : 'border-[#C9C9C3] text-[#1A1A17] hover:bg-white')}
        >
          Previous
        </button>
        <span className="text-[13px] font-mono tabular-nums text-[#57564F]">Page {page} / {pages}</span>
        <button
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          disabled={page === pages}
          className={'px-3 py-1.5 rounded-md border text-[13px] font-semibold ' + (page === pages ? 'border-[#DEDEDA] text-[#84837C] opacity-50 cursor-not-allowed' : 'border-[#C9C9C3] text-[#1A1A17] hover:bg-white')}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ---- read-only line items ---- */
function ReviewLineItems({ po }) {
  const total = po.items.reduce((s, it) => s + it.qty * it.price, 0);
  const th = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3]';
  const td = 'px-4 py-3 border-b border-[#DEDEDA] text-[#1A1A17]';
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr>
            <th className={th + ' text-left'}>Description</th>
            <th className={th + ' text-right w-16'}>Qty</th>
            <th className={th + ' text-right w-32'}>Unit Price</th>
            <th className={th + ' text-right w-36'}>Amount</th>
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

/* ---- confirmation modal (reject / request revision) ---- */
function ConfirmModal({ kind, notes, onClose, onConfirm }) {
  const cfg = {
    reject: {
      title: 'Reject this PO?',
      tone: '#B91C1C', toneBg: '#FCECEC',
      icon: 'x',
      lead: 'The PO will be marked Rejected and returned to the Planning Officer. It cannot move to production.',
      confirmLabel: 'Reject PO',
      confirmClass: 'bg-[#B91C1C] hover:bg-[#991717] text-white',
      pill: 'Rejected',
      notesRequired: true,
    },
    revision: {
      title: 'Send back for revision?',
      tone: '#C2410C', toneBg: '#FCEEE4',
      icon: 'edit',
      lead: 'The PO returns to M. Delgado (Planning Officer) as Revision Requested. They can edit and resubmit.',
      confirmLabel: 'Request revision',
      confirmClass: 'bg-[#C2410C] hover:bg-[#9A330A] text-white',
      pill: 'Revision Requested',
      notesRequired: true,
    },
  }[kind];
  const missing = cfg.notesRequired && !notes.trim();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A17]/40" onClick={onClose}></div>
      <div className="relative w-full max-w-[460px] bg-white rounded-xl border border-[#DEDEDA] shadow-[0_20px_50px_rgba(26,26,23,0.25)] overflow-hidden po-rise">
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: cfg.toneBg, color: cfg.tone }}>
              <Icon name={cfg.icon} className="w-6 h-6" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">{cfg.title}</h3>
              <p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">{cfg.lead}</p>
            </div>
          </div>

          {/* resulting status */}
          <div className="flex items-center gap-2 mt-4 text-[13px] text-[#57564F]">
            <span className="font-mono">New status</span>
            <Icon name="chevron" className="w-3.5 h-3.5 -rotate-90 text-[#84837C]" />
            <StatusPill status={cfg.pill} />
          </div>

          {/* notes echo */}
          <div className="mt-4">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] font-mono mb-1.5">Reviewer notes {cfg.notesRequired && <span className="text-[#C2410C]">· required</span>}</div>
            {missing ? (
              <div className="flex items-center gap-2 text-[13px] text-[#B91C1C] bg-[#FCECEC] border border-[#EDC9C9] rounded-md px-3 py-2.5">
                <Icon name="disputes" className="w-4 h-4 flex-none" />
                Add reviewer notes before you can {kind === 'reject' ? 'reject' : 'request a revision'}.
              </div>
            ) : (
              <p className="text-[13px] text-[#1A1A17] leading-relaxed bg-[#FAFAF8] border border-[#DEDEDA] rounded-md px-3 py-2.5 whitespace-pre-wrap">{notes}</p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA] flex items-center justify-end gap-2.5">
          <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
          <button
            className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (missing ? 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed' : cfg.confirmClass)}
            disabled={missing}
            onClick={() => onConfirm()}
          >
            <Icon name={cfg.icon} className="w-[18px] h-[18px]" /> {cfg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- decision rail ---- */
function DecisionRail({ po, notes, setNotes, onDecision, decided }) {
  const [approveArmed, setApproveArmed] = React.useState(false);
  const notesMissing = !notes.trim();

  if (decided) {
    const map = {
      Approved: { bg: '#E6F6EC', fg: '#15803D', icon: 'check', line: 'Approved and released to production scheduling.' },
      Rejected: { bg: '#FCECEC', fg: '#B91C1C', icon: 'x', line: 'Rejected and returned to the Planning Officer.' },
      'Revision Requested': { bg: '#FCEEE4', fg: '#C2410C', icon: 'edit', line: 'Sent back to M. Delgado for revision.' },
    }[decided];
    return (
      <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-6 text-center">
        <span className="w-14 h-14 rounded-full grid place-items-center mx-auto" style={{ background: map.bg, color: map.fg }}>
          <Icon name={map.icon} className="w-8 h-8" strokeWidth={2} />
        </span>
        <div className="mt-4 flex justify-center"><StatusPill status={decided} /></div>
        <p className="text-[14px] text-[#1A1A17] mt-3 leading-relaxed">{map.line}</p>
        <button className="mt-5 text-[13px] font-semibold text-[#1D4ED8] hover:underline" onClick={() => onDecision(null)}>Undo decision</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#DEDEDA]">
        <h2 className="text-[16px] font-semibold text-[#1A1A17]">Approval decision</h2>
        <p className="text-[13px] text-[#57564F] mt-0.5">Reviewing as <span className="font-semibold text-[#1A1A17]">A. Rahman · Director</span></p>
      </div>

      <div className="p-5">
        {/* reviewer notes */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[13px] font-semibold text-[#1A1A17]">Reviewer notes</label>
            <span className="text-[11px] font-semibold rounded-full px-1.5 py-0.5" style={{ color: '#C2410C', background: '#FCEEE4' }}>required</span>
          </div>
          <textarea
            className={'w-full min-h-[92px] rounded-md border bg-white text-[14px] text-[#1A1A17] px-3 py-2.5 resize-y leading-relaxed focus:outline-none focus:ring-[3px] ' + (notesMissing ? 'border-[#C9C9C3] focus:border-[#C2410C] focus:ring-[#C2410C]/35' : 'border-[#C9C9C3] focus:border-[#C2410C] focus:ring-[#C2410C]/35')}
            placeholder="Record the reason for your decision. Visible to the Planning Officer and in the PO history."
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setApproveArmed(false); }}
          />
          <span className="text-[12px] text-[#57564F]">Required for Reject and Request revision.</span>
        </div>

        {/* actions */}
        <div className="mt-5 flex flex-col gap-3">
          {/* APPROVE — dominant */}
          <div>
            {!approveArmed ? (
              <button
                className="w-full rounded-lg bg-[#15803D] hover:bg-[#11652F] text-white px-4 py-3.5 text-left transition-colors shadow-[0_1px_2px_rgba(26,26,23,0.10)]"
                onClick={() => setApproveArmed(true)}
              >
                <span className="flex items-center gap-2.5">
                  <Icon name="check" className="w-5 h-5" strokeWidth={2.2} />
                  <span className="text-[16px] font-semibold">Approve PO</span>
                </span>
                <span className="block text-[12px] text-white/85 mt-1 pl-[30px]">Releases the PO to production scheduling.</span>
              </button>
            ) : (
              <div className="rounded-lg border-2 border-[#15803D] bg-[#E6F6EC] p-3.5">
                <div className="flex items-center gap-2 text-[#15803D]">
                  <Icon name="check" className="w-5 h-5" strokeWidth={2.2} />
                  <span className="text-[14px] font-semibold text-[#1A1A17]">Confirm approval?</span>
                </div>
                <p className="text-[12px] text-[#57564F] mt-1">This releases <span className="font-mono font-semibold text-[#1A1A17]">{po.poNumber}</span> to production. You can undo right after.</p>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 rounded-md bg-[#15803D] hover:bg-[#11652F] text-white font-semibold text-[14px] px-4 py-2.5 inline-flex items-center justify-center gap-2" onClick={() => onDecision('Approved')}>
                    <Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Yes, approve
                  </button>
                  <button className="rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5" onClick={() => setApproveArmed(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* REQUEST REVISION — orange outline */}
          <button
            className="w-full rounded-lg border-2 border-[#C2410C] bg-white hover:bg-[#FCEEE4] text-[#C2410C] px-4 py-3 text-left transition-colors"
            onClick={() => onDecision('open:revision')}
          >
            <span className="flex items-center gap-2.5">
              <Icon name="edit" className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="text-[15px] font-semibold">Request revision</span>
            </span>
            <span className="block text-[12px] text-[#9A330A] mt-1 pl-[28px]">Sends it back to the Planning Officer to edit and resubmit.</span>
          </button>

          {/* REJECT — destructive */}
          <button
            className="w-full rounded-lg border border-[#EDC9C9] bg-white hover:bg-[#FCECEC] text-[#B91C1C] px-4 py-3 text-left transition-colors"
            onClick={() => onDecision('open:reject')}
          >
            <span className="flex items-center gap-2.5">
              <Icon name="x" className="w-[18px] h-[18px]" strokeWidth={2.2} />
              <span className="text-[15px] font-semibold">Reject PO</span>
            </span>
            <span className="block text-[12px] text-[#9C2A2A] mt-1 pl-[28px]">Declines the PO. It will not proceed to production.</span>
          </button>
        </div>

        {/* warning line */}
        <div className="mt-4 flex items-start gap-2 text-[12px] text-[#57564F] bg-[#FAFAF8] border border-[#DEDEDA] rounded-md px-3 py-2.5">
          <Icon name="disputes" className="w-4 h-4 text-[#B45309] flex-none mt-px" />
          Approve, Request revision and Reject each notify the Planning Officer. Reject and Request revision ask you to confirm.
        </div>
      </div>

      {/* timeline */}
      <div className="px-5 py-4 border-t border-[#DEDEDA]">
        <h3 className="text-[13px] font-semibold text-[#1A1A17] mb-3">Status history</h3>
        <Timeline items={po.activity} compact />
      </div>
    </div>
  );
}

/* ---- main review screen ---- */
function ScreenD({ notify }) {
  const po = REVIEW_PO;
  const [notes, setNotes] = React.useState('');
  const [modal, setModal] = React.useState(null);     // 'reject' | 'revision' | null
  const [decided, setDecided] = React.useState(null); // resulting status

  const handle = (action) => {
    if (action === null) { setDecided(null); return; }
    if (action === 'Approved') { setDecided('Approved'); notify('PO approved ✓'); return; }
    if (action === 'open:reject') { setModal('reject'); return; }
    if (action === 'open:revision') { setModal('revision'); return; }
  };

  const confirmModal = () => {
    if (modal === 'reject') { setDecided('Rejected'); notify('PO rejected'); }
    if (modal === 'revision') { setDecided('Revision Requested'); notify('Revision requested'); }
    setModal(null);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Purchase Orders', po.poNumber, 'Review']} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1180px] mx-auto">

          {/* page heading */}
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">Review purchase order</h1>
                <StatusPill status="Under Review" />
              </div>
              <p className="text-[14px] text-[#57564F] mt-1">Approve, send back for revision, or reject this submitted PO.</p>
            </div>
          </div>

          {/* two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5 items-start">

            {/* LEFT — read-only PO */}
            <div className="flex flex-col gap-5 min-w-0">
              <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-6">
                <div className="flex items-center gap-2 text-[12px] font-mono text-[#84837C] mb-2">
                  <Icon name="eye" className="w-4 h-4" /> Read-only — submitted for your approval
                </div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-[24px] font-mono font-semibold tabular-nums text-[#1A1A17] tracking-tight">{po.poNumber}</span>
                </div>
                <h2 className="text-[18px] font-semibold text-[#1A1A17] mt-1">{po.title}</h2>
                <div className="text-[14px] text-[#57564F] mt-0.5">{po.client}</div>

                <div className="mt-5 pt-5 border-t border-[#DEDEDA] grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                  <RFact label="Total amount" mono>{money(po.total, po.currency)}</RFact>
                  <RFact label="Currency" mono>{po.currency}</RFact>
                  <RFact label="Required delivery" mono>{fmtDate(po.due)}</RFact>
                  <RFact label="Assigned PM">{po.pm}</RFact>
                  <RFact label="Submitted by">{po.submittedBy}</RFact>
                  <RFact label="Submitted" mono>{fmtDate(po.submitted)}</RFact>
                </div>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Line items</h3>
                <ReviewLineItems po={po} />
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Uploaded PO document</h3>
                <PdfPreview po={po} />
              </div>
            </div>

            {/* RIGHT — decision rail (sticky) */}
            <div className="lg:sticky lg:top-2">
              <DecisionRail po={po} notes={notes} setNotes={setNotes} onDecision={handle} decided={decided} />
            </div>
          </div>
        </div>
      </div>

      {modal && <ConfirmModal kind={modal} notes={notes} onClose={() => setModal(null)} onConfirm={confirmModal} />}
    </div>
  );
}

window.ScreenD = ScreenD;
