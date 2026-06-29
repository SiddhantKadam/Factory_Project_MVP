/* ============================================================
   ACCESS BY ROLE — gated approval + creation surfaces
   ============================================================ */

const A_PO = {
  poNumber: 'PO-2026-0042',
  title: 'Structural steel — Warehouse Block B',
  client: 'Acme Infrastructure Ltd.',
  currency: 'INR',
  total: 788800,
  due: '2026-08-20',
  pm: 'R. Okafor',
  submittedBy: 'M. Delgado',
  submitted: '2026-06-04',
  file: { name: 'acme-PO-bay4-structural.pdf', size: '2.4 MB', pages: 3 },
  items: [
    { desc: 'ISMB 300 primary beams — fabricated & shot-blasted', qty: 24, price: 18500 },
    { desc: 'ISMC 150 channel bracing', qty: 60, price: 4200 },
    { desc: 'Base plates 400×400×20mm w/ anchor assembly', qty: 16, price: 5800 },
  ],
};

/* ---------- sheet chrome ---------- */
function CaptionStrip({ tag, title, roles }) {
  return (
    <div className="flex items-center gap-3 mb-3 flex-wrap">
      <span className="font-mono text-[12px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">{tag}</span>
      <span className="text-[15px] font-semibold text-[#1A1A17]">{title}</span>
      <span className="flex items-center gap-1.5 flex-wrap">
        {roles.map((r) => <RoleBadge key={r} role={r} dot={ROLE_LENS[r] && ROLE_LENS[r].dot} />)}
      </span>
    </div>
  );
}
function AccessTag({ tone, children }) {
  const map = { yes: { fg: '#15803D', bg: '#E6F6EC', icon: 'check' }, no: { fg: '#84837C', bg: '#F0F0EE', icon: 'block' } }[tone];
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide rounded px-2 py-0.5" style={{ color: map.fg, background: map.bg }}>
      <Icon name={map.icon} className="w-3.5 h-3.5" strokeWidth={2} /> {children}
    </span>
  );
}

/* ---------- read-only PO column (compact) ---------- */
function ROFact({ label, children, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{label}</span>
      <span className={'text-[14px] text-[#1A1A17] ' + (mono ? 'font-mono tabular-nums font-semibold' : 'font-medium')}>{children}</span>
    </div>
  );
}
function ROLineItems({ po }) {
  const total = po.items.reduce((s, it) => s + it.qty * it.price, 0);
  const th = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3]';
  const td = 'px-4 py-3 border-b border-[#DEDEDA] text-[#1A1A17]';
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-[14px]">
        <thead><tr>
          <th className={th + ' text-left'}>Description</th>
          <th className={th + ' text-right w-16'}>Qty</th>
          <th className={th + ' text-right w-32'}>Unit Price</th>
          <th className={th + ' text-right w-36'}>Amount</th>
        </tr></thead>
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
        <tfoot><tr className="bg-[#FAFAF8]">
          <td className="px-4 py-3 text-right font-semibold text-[#57564F] text-[13px] uppercase tracking-wide" colSpan={3}>Total</td>
          <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-[16px] text-[#1A1A17] whitespace-nowrap">{money(total, po.currency)}</td>
        </tr></tfoot>
      </table>
    </div>
  );
}
function ROPdf({ po }) {
  const [page, setPage] = React.useState(1);
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#FAFAF8] border-b border-[#DEDEDA]">
        <span className="w-7 h-7 rounded-md bg-[#FCECEC] text-[#B91C1C] grid place-items-center flex-none"><Icon name="pdf" className="w-4 h-4" strokeWidth={1.5} /></span>
        <span className="text-[13px] font-mono font-semibold text-[#1A1A17] truncate">{po.file.name}</span>
      </div>
      <div className="bg-[#E8E8E4] px-6 py-5 grid place-items-center">
        <div className="bg-white shadow-[0_2px_10px_rgba(26,26,23,0.14)] border border-[#DEDEDA] w-[300px] px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div><div className="text-[12px] font-bold text-[#1A1A17]">ACME INFRASTRUCTURE LTD.</div><div className="text-[7px] text-[#84837C] font-mono mt-0.5">Pune 411026</div></div>
            <div className="text-right"><div className="text-[10px] font-bold text-[#1A1A17]">PURCHASE ORDER</div><div className="text-[7px] font-mono text-[#57564F] mt-0.5">{po.poNumber}</div></div>
          </div>
          <div className="h-px bg-[#DEDEDA] mb-3"></div>
          <div className="flex flex-col gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-1.5 rounded-full bg-[#EDEDEA]" style={{ width: `${[92, 70, 86, 58, 90, 76, 64][(i + page) % 7]}%` }}></div>)}
          </div>
          <div className="text-center mt-5 text-[7px] font-mono text-[#B7B6AF]">Page {page} of {po.file.pages}</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 px-3 py-2 bg-[#FAFAF8] border-t border-[#DEDEDA]">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={'px-3 py-1.5 rounded-md border text-[13px] font-semibold ' + (page === 1 ? 'border-[#DEDEDA] text-[#84837C] opacity-50 cursor-not-allowed' : 'border-[#C9C9C3] text-[#1A1A17] hover:bg-white')}>Previous</button>
        <span className="text-[13px] font-mono tabular-nums text-[#57564F]">Page {page} / {po.file.pages}</span>
        <button onClick={() => setPage((p) => Math.min(po.file.pages, p + 1))} disabled={page === po.file.pages} className={'px-3 py-1.5 rounded-md border text-[13px] font-semibold ' + (page === po.file.pages ? 'border-[#DEDEDA] text-[#84837C] opacity-50 cursor-not-allowed' : 'border-[#C9C9C3] text-[#1A1A17] hover:bg-white')}>Next</button>
      </div>
    </div>
  );
}

function ROColumn({ po, status, topSlot }) {
  return (
    <div className="flex flex-col gap-5 min-w-0">
      <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-6">
        {topSlot}
        <div className="flex items-center gap-2 text-[12px] font-mono text-[#84837C] mb-2"><Icon name="eye" className="w-4 h-4" /> Read-only</div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-[24px] font-mono font-semibold tabular-nums text-[#1A1A17] tracking-tight">{po.poNumber}</span>
          <StatusPill status={status} />
        </div>
        <h2 className="text-[18px] font-semibold text-[#1A1A17] mt-1">{po.title}</h2>
        <div className="text-[14px] text-[#57564F] mt-0.5">{po.client}</div>
        <div className="mt-5 pt-5 border-t border-[#DEDEDA] grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <ROFact label="Total amount" mono>{money(po.total, po.currency)}</ROFact>
          <ROFact label="Currency" mono>{po.currency}</ROFact>
          <ROFact label="Required delivery" mono>{fmtDate(po.due)}</ROFact>
          <ROFact label="Assigned PM">{po.pm}</ROFact>
          <ROFact label="Submitted by">{po.submittedBy}</ROFact>
          <ROFact label="Submitted" mono>{fmtDate(po.submitted)}</ROFact>
        </div>
      </div>
      <div><h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Line items</h3><ROLineItems po={po} /></div>
      <div><h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Uploaded PO document</h3><ROPdf po={po} /></div>
    </div>
  );
}

/* ---------- confirm modal ---------- */
function AConfirmModal({ kind, notes, onClose, onConfirm }) {
  const cfg = {
    reject: { title: 'Reject this PO?', tone: '#B91C1C', toneBg: '#FCECEC', icon: 'x', lead: 'The PO will be marked Rejected and returned to the Planning Officer.', confirmLabel: 'Reject PO', confirmClass: 'bg-[#B91C1C] hover:bg-[#991717] text-white', pill: 'Rejected' },
    revision: { title: 'Send back for revision?', tone: '#C2410C', toneBg: '#FCEEE4', icon: 'edit', lead: 'The PO returns to M. Delgado as Revision Requested. They can edit and resubmit.', confirmLabel: 'Request revision', confirmClass: 'bg-[#C2410C] hover:bg-[#9A330A] text-white', pill: 'Revision Requested' },
  }[kind];
  const missing = !notes.trim();
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A17]/40" onClick={onClose}></div>
      <div className="relative w-full max-w-[460px] bg-white rounded-xl border border-[#DEDEDA] shadow-[0_20px_50px_rgba(26,26,23,0.25)] overflow-hidden po-rise">
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: cfg.toneBg, color: cfg.tone }}><Icon name={cfg.icon} className="w-6 h-6" strokeWidth={1.9} /></span>
            <div className="min-w-0"><h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">{cfg.title}</h3><p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">{cfg.lead}</p></div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[13px] text-[#57564F]"><span className="font-mono">New status</span><Icon name="chevron" className="w-3.5 h-3.5 -rotate-90 text-[#84837C]" /><StatusPill status={cfg.pill} /></div>
          <div className="mt-4">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] font-mono mb-1.5">Reviewer notes · required</div>
            {missing ? (
              <div className="flex items-center gap-2 text-[13px] text-[#B91C1C] bg-[#FCECEC] border border-[#EDC9C9] rounded-md px-3 py-2.5"><Icon name="disputes" className="w-4 h-4 flex-none" /> Add reviewer notes before you can {kind === 'reject' ? 'reject' : 'request a revision'}.</div>
            ) : (
              <p className="text-[13px] text-[#1A1A17] leading-relaxed bg-[#FAFAF8] border border-[#DEDEDA] rounded-md px-3 py-2.5 whitespace-pre-wrap">{notes}</p>
            )}
          </div>
        </div>
        <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA] flex items-center justify-end gap-2.5">
          <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
          <button className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (missing ? 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed' : cfg.confirmClass)} disabled={missing} onClick={onConfirm}><Icon name={cfg.icon} className="w-[18px] h-[18px]" /> {cfg.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- decision rail ---------- */
function ADecisionRail({ po, notes, setNotes, decided, setDecided, openModal, notify }) {
  const [armed, setArmed] = React.useState(false);
  if (decided) {
    const map = {
      Approved: { bg: '#E6F6EC', fg: '#15803D', icon: 'check', line: 'Approved and released to production scheduling.' },
      Rejected: { bg: '#FCECEC', fg: '#B91C1C', icon: 'x', line: 'Rejected and returned to the Planning Officer.' },
      'Revision Requested': { bg: '#FCEEE4', fg: '#C2410C', icon: 'edit', line: 'Sent back to M. Delgado for revision.' },
    }[decided];
    return (
      <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-6 text-center">
        <span className="w-14 h-14 rounded-full grid place-items-center mx-auto" style={{ background: map.bg, color: map.fg }}><Icon name={map.icon} className="w-8 h-8" strokeWidth={2} /></span>
        <div className="mt-4 flex justify-center"><StatusPill status={decided} /></div>
        <p className="text-[14px] text-[#1A1A17] mt-3 leading-relaxed">{map.line}</p>
        <button className="mt-5 text-[13px] font-semibold text-[#1D4ED8] hover:underline" onClick={() => { setDecided(null); setArmed(false); }}>Undo decision</button>
      </div>
    );
  }
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#DEDEDA]"><h2 className="text-[16px] font-semibold text-[#1A1A17]">Approval decision</h2><p className="text-[13px] text-[#57564F] mt-0.5">Reviewing as <span className="font-semibold text-[#1A1A17]">A. Rahman · Director</span></p></div>
      <div className="p-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2"><label className="text-[13px] font-semibold text-[#1A1A17]">Reviewer notes</label><span className="text-[11px] font-semibold rounded-full px-1.5 py-0.5" style={{ color: '#C2410C', background: '#FCEEE4' }}>required</span></div>
          <textarea className="w-full min-h-[88px] rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 py-2.5 resize-y leading-relaxed focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35" placeholder="Record the reason for your decision. Visible to the Planning Officer and in the PO history." value={notes} onChange={(e) => { setNotes(e.target.value); setArmed(false); }} />
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {!armed ? (
            <button className="w-full rounded-lg bg-[#15803D] hover:bg-[#11652F] text-white px-4 py-3.5 text-left shadow-[0_1px_2px_rgba(26,26,23,0.10)]" onClick={() => setArmed(true)}>
              <span className="flex items-center gap-2.5"><Icon name="check" className="w-5 h-5" strokeWidth={2.2} /><span className="text-[16px] font-semibold">Approve PO</span></span>
              <span className="block text-[12px] text-white/85 mt-1 pl-[30px]">Releases the PO to production scheduling.</span>
            </button>
          ) : (
            <div className="rounded-lg border-2 border-[#15803D] bg-[#E6F6EC] p-3.5">
              <div className="flex items-center gap-2 text-[#15803D]"><Icon name="check" className="w-5 h-5" strokeWidth={2.2} /><span className="text-[14px] font-semibold text-[#1A1A17]">Confirm approval?</span></div>
              <p className="text-[12px] text-[#57564F] mt-1">This releases <span className="font-mono font-semibold text-[#1A1A17]">{po.poNumber}</span> to production.</p>
              <div className="flex items-center gap-2 mt-3">
                <button className="flex-1 rounded-md bg-[#15803D] hover:bg-[#11652F] text-white font-semibold text-[14px] px-4 py-2.5 inline-flex items-center justify-center gap-2" onClick={() => { setDecided('Approved'); notify('PO approved ✓'); }}><Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Yes, approve</button>
                <button className="rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5" onClick={() => setArmed(false)}>Cancel</button>
              </div>
            </div>
          )}
          <button className="w-full rounded-lg border-2 border-[#C2410C] bg-white hover:bg-[#FCEEE4] text-[#C2410C] px-4 py-3 text-left" onClick={() => openModal('revision')}>
            <span className="flex items-center gap-2.5"><Icon name="edit" className="w-[18px] h-[18px]" strokeWidth={2} /><span className="text-[15px] font-semibold">Request revision</span></span>
            <span className="block text-[12px] text-[#9A330A] mt-1 pl-[28px]">Sends it back to the Planning Officer to edit and resubmit.</span>
          </button>
          <button className="w-full rounded-lg border border-[#EDC9C9] bg-white hover:bg-[#FCECEC] text-[#B91C1C] px-4 py-3 text-left" onClick={() => openModal('reject')}>
            <span className="flex items-center gap-2.5"><Icon name="x" className="w-[18px] h-[18px]" strokeWidth={2.2} /><span className="text-[15px] font-semibold">Reject PO</span></span>
            <span className="block text-[12px] text-[#9C2A2A] mt-1 pl-[28px]">Declines the PO. It will not proceed to production.</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- A: authorised approval ---------- */
function SectionApprovalAuthorised({ notify }) {
  const [notes, setNotes] = React.useState('');
  const [decided, setDecided] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const confirm = () => { setDecided(modal === 'reject' ? 'Rejected' : 'Revision Requested'); notify(modal === 'reject' ? 'PO rejected' : 'Revision requested'); setModal(null); };
  return (
    <section>
      <CaptionStrip tag="A" title="PO Review / Approval — decision rail present" roles={['General Manager', 'Admin']} />
      <div className="mb-3"><AccessTag tone="yes">authorised · can decide</AccessTag></div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
        <ROColumn po={A_PO} status="Under Review" />
        <div className="lg:sticky lg:top-2"><ADecisionRail po={A_PO} notes={notes} setNotes={setNotes} decided={decided} setDecided={setDecided} openModal={setModal} notify={notify} /></div>
      </div>
      {modal && <AConfirmModal kind={modal} notes={notes} onClose={() => setModal(null)} onConfirm={confirm} />}
    </section>
  );
}

/* ---------- B: unauthorised viewers (no rail) ---------- */
function StatusNote({ icon, tone, children }) {
  const map = { info: { bg: '#E9F0FF', bd: '#C7D9FF', edge: '#1D4ED8', fg: '#1D4ED8' }, neutral: { bg: '#FAFAF8', bd: '#DEDEDA', edge: '#84837C', fg: '#57564F' } }[tone];
  return (
    ``
    // <div className="flex items-center gap-2.5 rounded-md border px-4 py-2.5 mb-5" style={{ background: map.bg, borderColor: map.bd, borderLeft: `4px solid ${map.edge}` }}>
    //   <Icon name={icon} className="w-[18px] h-[18px] flex-none" />
    //   <span className="text-[13px] text-[#1A1A17]">{children}</span>
    // </div>
  );
}
function SectionApprovalUnauthorised({ who }) {
  const isCreator = who === 'creator';
  const topSlot = isCreator
    ? <StatusNote icon="info" tone="info"><span className="font-semibold">Under Review — awaiting approval from the General Manager.</span> You'll be notified when a decision is made.</StatusNote>
    : <StatusNote icon="eye" tone="neutral"><span className="font-semibold">You're viewing this in read-only mode.</span> Your role can view this PO but not act on it.</StatusNote>;
  return (
    ``
    // <section>
    //   <CaptionStrip tag={isCreator ? 'B·1' : 'B·2'} title={isCreator ? 'Same Under Review PO — Creator (owner, awaiting decision)' : 'Same Under Review PO — Viewer'} roles={isCreator ? ['Finance Officer'] : ['Viewer']} />
    //   <div className="mb-3 flex items-center gap-2"><AccessTag tone="no">decision rail absent</AccessTag><span className="text-[12px] text-[#84837C]">column reflows to full width</span></div>
    //   <div className="max-w-[760px]"><ROColumn po={A_PO} status={isCreator ? 'Under Review' : 'Approved'} topSlot={topSlot} /></div>
    // </section>
  );
}

/* ---------- C: wizard access ---------- */
function NoAccessPage({ title, body }) {
  return (
    <div className="border border-[#DEDEDA] rounded-lg bg-white shadow-[0_1px_2px_rgba(26,26,23,0.05)] grid place-items-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#F0F0EE] grid place-items-center text-[#84837C] mb-5"><Icon name="block" className="w-9 h-9" strokeWidth={1.5} /></div>
      <h3 className="text-[20px] font-semibold text-[#1A1A17]">{title}</h3>
      <p className="text-[14px] text-[#57564F] mt-2 max-w-[46ch]">{body}</p>
      <a className="mt-6 inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md cursor-pointer"><Icon name="chevron" className="w-4 h-4 rotate-90" /> Back to dashboard</a>
    </div>
  );
}
function WizardUpload({ notify }) {
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
      <div className="px-7 pt-6 pb-5 border-b border-[#DEDEDA]">
        <div className="flex items-start">
          {['Upload', 'Analyse', 'Review', 'Confirm'].map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center relative text-center">
              {i > 0 && <span className="absolute top-[15px] h-0.5 left-[-50%] right-[50%] z-0" style={{ background: '#C9C9C3' }}></span>}
              <span className={'w-8 h-8 rounded-full z-[1] grid place-items-center font-mono text-[13px] font-semibold border-2 ' + (i === 0 ? 'bg-white border-[#C2410C] text-[#C2410C]' : 'bg-white border-[#C9C9C3] text-[#84837C]')} style={i === 0 ? { boxShadow: '0 0 0 4px #FCEEE4' } : undefined}>{i + 1}</span>
              <span className={'text-[13px] font-semibold mt-2.5 ' + (i === 0 ? 'text-[#1A1A17]' : 'text-[#84837C]')}>{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6"><h2 className="text-[20px] font-semibold text-[#1A1A17] leading-tight">New purchase order</h2><p className="text-[14px] text-[#57564F] mt-1">Upload the PO PDF from your client and submit it for approval.</p></div>
      </div>
      <div className="px-7 py-6">
        <div className="rounded-lg border-2 border-dashed border-[#C9C9C3] bg-[#FAFAF8] grid place-items-center text-center px-6 py-12 cursor-pointer hover:border-[#84837C]" onClick={() => notify('Browse files')}>
          <div className="w-12 h-12 rounded-full bg-white border border-[#DEDEDA] grid place-items-center text-[#C2410C] mb-3.5"><Icon name="upload" className="w-6 h-6" strokeWidth={1.6} /></div>
          <div className="text-[15px] font-semibold text-[#1A1A17]">Drag &amp; drop or <span className="text-[#C2410C] underline underline-offset-2">browse</span></div>
          <div className="text-[13px] text-[#57564F] mt-1">PDF only · max 10 MB</div>
        </div>
      </div>
    </div>
  );
}
function ListHeaderDemo({ withCTA, role }) {
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><h3 className="text-[18px] font-semibold text-[#1A1A17]">Purchase Orders</h3><RoleBadge role={role} dot={ROLE_LENS[role].dot} /></div>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#57564F]"><Icon name="info" className="w-4 h-4 text-[#84837C]" /> {withCTA ? 'Showing purchase orders you created.' : 'Showing purchase orders shared with you.'}</div>
        </div>
        {withCTA ? (
          <button className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md"><Icon name="plus" className="w-[18px] h-[18px]" strokeWidth={2} /> New PO</button>
        ) : (
          <span className="inline-flex items-center h-[42px] rounded-md border border-dashed border-[#C9C9C3] bg-[#FAFAF8] px-3 text-[12px] font-mono text-[#84837C]">— no “New PO” button —</span>
        )}
      </div>
    </div>
  );
}
function SectionWizardAccess({ notify }) {
  return (
    ``
    // <section>
    //   <CaptionStrip tag="C" title="New PO wizard — creation entry" roles={['Finance Officer', 'Admin']} />
    //   <div className="grid lg:grid-cols-2 gap-5 items-start">
    //     <div>
    //       <div className="mb-3"><AccessTag tone="yes">authorised · can create</AccessTag></div>
    //       <WizardUpload notify={notify} />
    //       <p className="mt-2.5 text-[12px] text-[#84837C]">Finance Officer / Admin — wizard opens normally at Step 1 · Upload.</p>
    //     </div>
    //     <div>
    //       <div className="mb-3 flex items-center gap-2"><AccessTag tone="no">no po.create</AccessTag><span className="flex items-center gap-1.5">{['General Manager', 'Planning Officer', 'Viewer'].map((r) => <RoleBadge key={r} role={r} dot={ROLE_LENS[r].dot} />)}</span></div>
    //       <NoAccessPage title="You don't have access to create purchase orders" body="Creating POs is limited to Finance Officers and Admins. If you think this is a mistake, ask an administrator to update your access." />
    //       <p className="mt-2.5 text-[12px] text-[#84837C]">Any role without create permission hitting the wizard route.</p>
    //     </div>
    //   </div>
    //   <div className="mt-6">
    //     <div className="text-[12px] font-mono uppercase tracking-wider text-[#84837C] mb-2.5">…and the entry point itself is hidden on the list header</div>
    //     <div className="grid md:grid-cols-2 gap-4">
    //       <div><div className="mb-2"><AccessTag tone="yes">button present</AccessTag></div><ListHeaderDemo withCTA={true} role="Finance Officer" /></div>
    //       <div><div className="mb-2"><AccessTag tone="no">button hidden</AccessTag></div><ListHeaderDemo withCTA={false} role="Viewer" /></div>
    //     </div>
    //   </div>
    // </section>
  );
}

/* ---------- page ---------- */
function AccessByRole() {
  const [toast, setToast] = React.useState(null);
  const timer = React.useRef(null);
  const notify = React.useCallback((m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 1900); }, []);
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F4F4F2] text-[#1A1A17]">
      <Sidebar active="Purchase Orders" />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar crumb={['Home', 'Purchase Orders', 'Access by role']} />
        <div className="bg-white border-b border-[#DEDEDA] px-6 py-3 flex items-center gap-3 flex-none flex-wrap">
          <Icon name="lock" className="w-[18px] h-[18px] text-[#C2410C]" />
          <span className="text-[13px] font-semibold text-[#1A1A17]">Gated surfaces — approval &amp; creation</span>
          <span className="ml-auto text-[12px] font-mono text-[#84837C]">Decision controls &amp; creation entry are present only for permitted roles — absent (not disabled) for everyone else</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1180px] mx-auto flex flex-col gap-12">
            <SectionApprovalAuthorised notify={notify} />
            <div className="grid lg:grid-cols-2 gap-x-6 gap-y-12">
              <SectionApprovalUnauthorised who="creator" />
              <SectionApprovalUnauthorised who="viewer" />
            </div>
            <SectionWizardAccess notify={notify} />
          </div>
        </div>
      </main>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" /><span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AccessByRole />);
