/* ============================================================
   SCREEN NEW PO — Create New Purchase Order
   Phases: choose → wizard (upload→analyse→review→confirm)
                  → manual
                  → submitted (approval workflow preview)

   Reuses from screen-b.jsx (globals):
     INPUT, SELECT_BG, btnPrimary, btnSecondary,
     AutoTag, Field, Step1Body, Step2Body, Step3Body, Step4Body, SummaryRow
   Reuses from shell.jsx (globals):
     Icon, TopBar, Stepper, StatusPill, Timeline,
     CURRENCY, money, fmtDate
   ============================================================ */

/* ---- default form & items (manual / pre-ai) ---- */
const NP_EMPTY_FORM = {
  poNumber: '', title: '', client: '',
  currency: 'INR', due: '', pm: 'R. Okafor', notes: '',
};
const NP_EMPTY_ITEMS = [{ desc: '', qty: 1, price: 0 }];

/* ---- pre-filled data simulated by AI extraction ---- */
const NP_AI_FORM = {
  poNumber: 'PO-2026-0042',
  title: 'Structural steel — Warehouse Block B',
  client: 'Acme Infrastructure Ltd.',
  currency: 'INR',
  due: '2026-08-20',
  pm: 'R. Okafor',
  notes: 'Fabricate and supply primary structural steel for Warehouse Block B. All members to be shot-blasted to SA 2.5 and primed before dispatch. Camber per drawing S-204.',
};
const NP_AI_ITEMS = [
  { desc: 'ISMB 300 primary beams — fabricated & shot-blasted', qty: 24, price: 18500 },
  { desc: 'ISMC 150 channel bracing',                           qty: 60, price: 4200  },
  { desc: 'Base plates 400×400×20mm w/ anchor assembly',        qty: 16, price: 5800  },
];

/* ---- step metadata for the wizard ---- */
const NP_STEP_META = {
  1: { title: 'Upload purchase order',       sub: "Upload the client PO PDF. We'll read it for you." },
  2: { title: 'Reading your purchase order…', sub: 'Extracting fields from the uploaded PDF. Usually takes a few seconds.' },
  3: { title: 'Review extracted data',        sub: 'Check every field we pulled from the PDF and correct anything before continuing.' },
  4: { title: 'Confirm & submit',             sub: 'Review everything below. Nothing is sent until you click Submit.' },
};

/* ---- approval chain ---- */
const NP_APPROVAL_CHAIN = [
  { role: 'Finance Officer',      person: 'M. Delgado', initials: 'MD', color: '#C2410C', isSubmitter: true  },
  { role: 'Manager',              person: 'A. Singh',   initials: 'AS', color: '#7C3AED', isSubmitter: false },
  { role: 'Procurement Head',     person: 'V. Rao',     initials: 'VR', color: '#1D4ED8', isSubmitter: false },
  { role: 'Finance Head',         person: 'K. Mehta',   initials: 'KM', color: '#0369A1', isSubmitter: false },
  { role: 'Director / Approver',  person: 'A. Rahman',  initials: 'AR', color: '#15803D', isSubmitter: false },
];

/* ============================================================
   STEP 1: CHOOSE CREATION METHOD
   ============================================================ */
function NPChooseMethod({ onChoose }) {
  return (
    <div className="max-w-[680px] mx-auto">
      <div className="mb-8">
        <div className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#C2410C] mb-1">New purchase order</div>
        <h1 className="text-[24px] font-semibold text-[#1A1A17] tracking-tight">How would you like to create this PO?</h1>
        <p className="text-[14px] text-[#57564F] mt-1.5">Choose a method below. You can go back and switch at any time before submitting.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* AI Wizard */}
        <button
          onClick={() => onChoose('wizard')}
          className="group text-left bg-white border-2 border-[#DEDEDA] hover:border-[#C2410C] rounded-xl p-6 transition-all duration-150 shadow-[0_1px_3px_rgba(26,26,23,0.06)] hover:shadow-[0_4px_20px_rgba(194,65,12,0.13)] focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-[#FCEEE4] text-[#C2410C] grid place-items-center mb-5 transition-transform group-hover:scale-105">
            <Icon name="sparkle" className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="text-[16px] font-semibold text-[#1A1A17] mb-1.5">AI Wizard</div>
          <p className="text-[13px] text-[#57564F] leading-relaxed">Upload a client PDF and let AI read and auto-fill all fields. Review and edit before submitting.</p>
          <div className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-[#C2410C]">
            Recommended <Icon name="chevron" className="w-3.5 h-3.5 -rotate-90" />
          </div>
        </button>

        {/* Manual Entry */}
        <button
          onClick={() => onChoose('manual')}
          className="group text-left bg-white border-2 border-[#DEDEDA] hover:border-[#1D4ED8] rounded-xl p-6 transition-all duration-150 shadow-[0_1px_3px_rgba(26,26,23,0.06)] hover:shadow-[0_4px_20px_rgba(29,78,216,0.10)] focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-[#E9F0FF] text-[#1D4ED8] grid place-items-center mb-5 transition-transform group-hover:scale-105">
            <Icon name="edit" className="w-6 h-6" strokeWidth={1.6} />
          </div>
          <div className="text-[16px] font-semibold text-[#1A1A17] mb-1.5">Create Manually</div>
          <p className="text-[13px] text-[#57564F] leading-relaxed">Fill in all fields yourself. Best when you don't have a PDF or want full control over every value.</p>
          <div className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-[#1D4ED8]">
            Manual entry <Icon name="chevron" className="w-3.5 h-3.5 -rotate-90" />
          </div>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MANUAL FORM BODY
   Same fields as Step3Body but no auto-fill badges, starts empty,
   and shows required-field validation errors.
   ============================================================ */
function NPManualBody({ form, setForm, items, setItems, errors }) {
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setItem = (i, k) => (e) => {
    const v = k === 'desc' ? e.target.value : Number(e.target.value || 0);
    setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  };
  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const delItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const cur = form.currency;

  const cell  = 'px-3 py-2 border-b border-[#DEDEDA] align-middle';
  const liInp = 'w-full bg-transparent text-[14px] text-[#1A1A17] px-1.5 py-1 rounded focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C2410C]/30';
  const thLi  = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-3 py-2.5 border-b border-[#C9C9C3]';

  const err = (k) => errors && errors[k]
    ? <span className="text-[11px] text-[#B91C1C] font-medium mt-0.5 block">{errors[k]}</span>
    : null;

  const inpCls = (k) => INPUT + (errors && errors[k] ? ' border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/35' : '');

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">PO Number <span className="text-[#B91C1C]">*</span></label>
          <input className={inpCls('poNumber') + ' font-mono tabular-nums'} value={form.poNumber} onChange={set('poNumber')} placeholder="e.g. PO-2026-0050" />
          {err('poNumber')}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">Required Delivery Date <span className="text-[#B91C1C]">*</span></label>
          <input type="date" className={inpCls('due') + ' font-mono tabular-nums'} value={form.due} onChange={set('due')} />
          {err('due')}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">PO Title <span className="text-[#B91C1C]">*</span></label>
          <input className={inpCls('title')} value={form.title} onChange={set('title')} placeholder="e.g. Structural steel supply — Bay 4" />
          {err('title')}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">Client / Vendor <span className="text-[#B91C1C]">*</span></label>
          <input className={inpCls('client')} value={form.client} onChange={set('client')} placeholder="e.g. Acme Infrastructure Ltd." />
          {err('client')}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">Currency</label>
          <select className={INPUT + ' pr-8 appearance-none cursor-pointer'} style={SELECT_BG} value={form.currency} onChange={set('currency')}>
            {Object.keys(CURRENCY).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">Total Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84837C] font-mono text-[14px]">{CURRENCY[cur]}</span>
            <input className={INPUT + ' text-right font-mono tabular-nums pr-3 pl-9 bg-[#FAFAF8]'} value={money(total, cur).replace(CURRENCY[cur], '')} readOnly tabIndex={-1} />
          </div>
          <span className="text-[12px] text-[#57564F]">Auto-summed from line items.</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">Assign Project Manager</label>
          <select className={INPUT + ' pr-8 appearance-none cursor-pointer'} style={SELECT_BG} value={form.pm} onChange={set('pm')}>
            <option>R. Okafor</option>
            <option>S. Iyer</option>
            <option>T. Nakamura</option>
            <option>P. Fernandes</option>
          </select>
        </div>

        <div className="hidden md:block" />

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#1A1A17]">Notes / Description</label>
          <textarea
            className={INPUT.replace('h-10', 'min-h-[88px]') + ' py-2.5 resize-y leading-relaxed'}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Add any relevant notes, specifications, or delivery instructions…"
          />
        </div>
      </div>

      {/* Line items */}
      <div className="mt-7">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-[#1A1A17]">Line items</h3>
            <span className="text-[#B91C1C] text-[14px] font-semibold">*</span>
          </div>
          <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C2410C] hover:bg-[#FCEEE4] px-2.5 py-1.5 rounded-md" onClick={addItem}>
            <Icon name="plus" className="w-4 h-4" strokeWidth={2} /> Add line item
          </button>
        </div>
        {errors && errors.items && <p className="text-[12px] text-[#B91C1C] font-medium mb-2">{errors.items}</p>}
        <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#FAFAF8]">
                <th className={thLi + ' text-left'}>Description</th>
                <th className={thLi + ' text-right w-20'}>Qty</th>
                <th className={thLi + ' text-right w-32'}>Unit Price</th>
                <th className={thLi + ' text-right w-36'}>Amount</th>
                <th className="border-b border-[#C9C9C3] w-10" />
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="hover:bg-[#FAFAF8]">
                  <td className={cell}><input className={liInp} value={it.desc} placeholder="Item description" onChange={setItem(i, 'desc')} /></td>
                  <td className={cell}><input type="number" min="1" className={liInp + ' text-right font-mono tabular-nums'} value={it.qty} onChange={setItem(i, 'qty')} /></td>
                  <td className={cell}><input type="number" min="0" className={liInp + ' text-right font-mono tabular-nums'} value={it.price} onChange={setItem(i, 'price')} /></td>
                  <td className={cell + ' text-right font-mono tabular-nums text-[#1A1A17] whitespace-nowrap'}>{money(it.qty * it.price, cur)}</td>
                  <td className={cell + ' text-center'}>
                    <button className="w-7 h-7 rounded grid place-items-center text-[#84837C] hover:bg-[#FCECEC] hover:text-[#B91C1C]" onClick={() => delItem(i)} aria-label="Remove item">
                      <Icon name="trash" className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#FAFAF8]">
                <td className="px-3 py-3 text-right font-semibold text-[#57564F] text-[13px] uppercase tracking-wide" colSpan={3}>Total</td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-semibold text-[16px] text-[#1A1A17] whitespace-nowrap">{money(total, cur)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   APPROVAL WORKFLOW PREVIEW
   Shown after Send for Approval. Interactive — each role can
   Approve / Request Changes / Reject. Advance-on-approve chain.
   ============================================================ */
function NPApprovalPreview({ form, items, onBackToList }) {
  const [decisions, setDecisions] = React.useState({});   // { index: { decision, note } }
  const [activeIdx, setActiveIdx]  = React.useState(1);   // 0 = Finance Officer (done), 1 = Manager (first approver)
  const [draftNotes, setDraftNotes] = React.useState({}); // { index: string }

  const total = items.reduce((s, it) => s + it.qty * it.price, 0);

  const setNote = (i, v) => setDraftNotes((n) => ({ ...n, [i]: v }));

  const decide = (i, decision) => {
    setDecisions((d) => ({ ...d, [i]: { decision, note: draftNotes[i] || '' } }));
    if (decision === 'Approved' && i + 1 < NP_APPROVAL_CHAIN.length) {
      setActiveIdx(i + 1);
    }
  };

  const undoDecision = (i) => {
    const d = { ...decisions };
    delete d[i];
    setDecisions(d);
    setActiveIdx(i);
  };

  const allApproved = NP_APPROVAL_CHAIN.every((_, i) => i === 0 || (decisions[i] && decisions[i].decision === 'Approved'));

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start gap-3.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#FCEEE4] text-[#C2410C] grid place-items-center flex-none mt-0.5">
          <Icon name="disputes" className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-[#1A1A17]">Approval Workflow Preview</h2>
          <p className="text-[13px] text-[#57564F] mt-0.5 leading-relaxed">See how this PO moves through each approver. Use the controls below to simulate the approval chain. <span className="font-medium text-[#1A1A17]">No notifications are sent in preview mode.</span></p>
        </div>
      </div>

      {/* PO summary strip */}
      <div className="bg-[#FAFAF8] border border-[#DEDEDA] rounded-lg px-4 py-3 mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
        <span className="font-mono font-semibold text-[#1A1A17]">{form.poNumber || 'PO-XXXX'}</span>
        <span className="text-[#57564F] truncate min-w-0">{form.title || 'Untitled PO'}</span>
        <span className="text-[#57564F]">{form.client || '—'}</span>
        <span className="font-mono font-semibold text-[#1A1A17] ml-auto">{money(total, form.currency || 'INR')}</span>
        <StatusPill status="Under Review" />
      </div>

      {/* Fully approved banner */}
      {allApproved && (
        <div className="flex items-center gap-3 bg-[#E6F6EC] border border-[#C3E6CC] rounded-lg px-4 py-3.5 mb-6">
          <Icon name="check" className="w-5 h-5 text-[#15803D] flex-none" strokeWidth={2.4} />
          <div>
            <div className="text-[14px] font-semibold text-[#15803D]">Fully approved — PO released to production scheduling.</div>
            <div className="text-[12px] text-[#57564F] mt-0.5">All approvers in the chain have signed off on this purchase order.</div>
          </div>
        </div>
      )}

      {/* Chain */}
      <div>
        {NP_APPROVAL_CHAIN.map((step, i) => {
          const dec   = decisions[i];
          const isDone    = i === 0 || (dec !== undefined);
          const isActive  = i === activeIdx && dec === undefined && !step.isSubmitter;
          const isPending = !isDone && !isActive;
          const isApproved       = dec && dec.decision === 'Approved';
          const isRejected       = dec && dec.decision === 'Rejected';
          const isRevision       = dec && dec.decision === 'Revision Requested';
          const noteVal = draftNotes[i] || '';
          const noteMissing = !noteVal.trim();

          /* dot color */
          const dotBg = step.isSubmitter
            ? '#15803D'
            : isApproved ? '#15803D'
            : isRejected ? '#B91C1C'
            : isRevision ? '#C2410C'
            : isActive ? '#C2410C'
            : '#E5E5E1';

          const dotContent = step.isSubmitter || isApproved
            ? <Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} />
            : isRejected
            ? <Icon name="x" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} />
            : isRevision
            ? <Icon name="edit" className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
            : isActive
            ? <span className="w-2.5 h-2.5 rounded-full bg-white block" style={{ animation: 'po-pulse 1.6s ease-in-out infinite' }} />
            : <span className="w-2 h-2 rounded-full bg-[#C9C9C3] block" />;

          /* connector line */
          const lineColor = step.isSubmitter || isApproved ? '#86EFAC' : '#E5E5E1';

          /* card border / bg */
          const cardBorder = isActive
            ? 'border-[#C2410C] shadow-[0_0_0_3px_rgba(194,65,12,0.09)]'
            : isApproved ? 'border-[#C3E6CC]'
            : isRejected ? 'border-[#EDC9C9]'
            : isRevision ? 'border-[#F5D5C5]'
            : 'border-[#DEDEDA]';

          const headerBg = isActive ? 'bg-[#FCEEE4]'
            : isApproved ? 'bg-[#E6F6EC]'
            : isRejected ? 'bg-[#FCECEC]'
            : isRevision ? 'bg-[#FEF3EE]'
            : 'bg-[#FAFAF8]';

          return (
            <div key={i} className="flex gap-3">
              {/* Left: dot + line */}
              <div className="flex flex-col items-center flex-none" style={{ width: 32 }}>
                <div
                  className="w-8 h-8 rounded-full grid place-items-center flex-none z-10"
                  style={{ background: dotBg }}
                >
                  {dotContent}
                </div>
                {i < NP_APPROVAL_CHAIN.length - 1 && (
                  <div className="flex-1 w-0.5 my-1" style={{ background: lineColor, minHeight: 20 }} />
                )}
              </div>

              {/* Right: card */}
              <div className={'flex-1 min-w-0 mb-3 border rounded-lg overflow-hidden ' + cardBorder + (isPending ? ' opacity-50' : '')}>

                {/* card header */}
                <div className={'flex items-center justify-between gap-4 px-4 py-3 ' + headerBg}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-8 h-8 rounded-full flex-none grid place-items-center text-white text-[11px] font-bold font-mono"
                      style={{ background: step.color }}
                    >
                      {step.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-semibold text-[#1A1A17]">{step.role}</span>
                        {isActive && (
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#C2410C] bg-white border border-[#C2410C]/25 rounded-full px-2 py-0.5 font-mono leading-none">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#57564F] font-mono mt-0.5">{step.person}</div>
                    </div>
                  </div>
                  <div className="flex-none">
                    {step.isSubmitter
                      ? <StatusPill status="Under Review" />
                      : isApproved  ? <StatusPill status="Approved" />
                      : isRejected  ? <StatusPill status="Rejected" />
                      : isRevision  ? <StatusPill status="Revision Requested" />
                      : isActive    ? <StatusPill status="Under Review" />
                      : <span className="text-[12px] font-mono text-[#84837C]">Waiting</span>
                    }
                  </div>
                </div>

                {/* submitted note */}
                {step.isSubmitter && (
                  <div className="px-4 py-3 text-[13px] text-[#57564F] border-t border-[#DEDEDA] bg-white leading-relaxed">
                    Sent for approval.
                  </div>
                )}

                {/* decision note (after deciding) */}
                {!step.isSubmitter && dec && dec.note && (
                  <div className="px-4 py-3 border-t border-[#DEDEDA] bg-white">
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#84837C] mb-1">Reviewer note</div>
                    <p className="text-[13px] text-[#1A1A17] leading-relaxed">{dec.note}</p>
                    <button className="mt-2 text-[12px] font-semibold text-[#1D4ED8] hover:underline" onClick={() => undoDecision(i)}>
                      Undo decision
                    </button>
                  </div>
                )}

                {/* active: decision panel */}
                {isActive && (
                  <div className="px-4 py-4 bg-white border-t border-[#DEDEDA]">
                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className="text-[13px] font-semibold text-[#1A1A17] flex items-center gap-2">
                        Reviewer notes
                        <span className="text-[11px] font-normal text-[#84837C]">required for Reject / Request Changes</span>
                      </label>
                      <textarea
                        className="w-full min-h-[72px] rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 py-2.5 resize-y leading-relaxed focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35"
                        placeholder="Add review notes…"
                        value={noteVal}
                        onChange={(e) => setNote(i, e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Approve */}
                      <button
                        className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-[#11652F] text-white font-semibold text-[13px] px-4 py-2 rounded-md"
                        onClick={() => decide(i, 'Approved')}
                      >
                        <Icon name="check" className="w-4 h-4" strokeWidth={2.2} /> Approve
                      </button>
                      {/* Request Changes */}
                      <button
                        className={'inline-flex items-center gap-2 border font-semibold text-[13px] px-4 py-2 rounded-md ' + (noteMissing ? 'border-[#DEDEDA] text-[#84837C] bg-[#FAFAF8] cursor-not-allowed' : 'border-[#C2410C] text-[#C2410C] bg-white hover:bg-[#FCEEE4]')}
                        disabled={noteMissing}
                        onClick={() => !noteMissing && decide(i, 'Revision Requested')}
                        title={noteMissing ? 'Add reviewer notes first' : ''}
                      >
                        <Icon name="edit" className="w-4 h-4" strokeWidth={1.9} /> Request Changes
                      </button>
                      {/* Reject */}
                      <button
                        className={'inline-flex items-center gap-2 border font-semibold text-[13px] px-4 py-2 rounded-md ' + (noteMissing ? 'border-[#DEDEDA] text-[#84837C] bg-[#FAFAF8] cursor-not-allowed' : 'border-[#EDC9C9] text-[#B91C1C] bg-white hover:bg-[#FCECEC]')}
                        disabled={noteMissing}
                        onClick={() => !noteMissing && decide(i, 'Rejected')}
                        title={noteMissing ? 'Add reviewer notes first' : ''}
                      >
                        <Icon name="x" className="w-4 h-4" strokeWidth={2.2} /> Reject
                      </button>
                    </div>
                    {noteMissing && (
                      <p className="text-[11.5px] text-[#84837C] mt-2">Reject and Request Changes require a reviewer note.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Final: Completed node */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center flex-none" style={{ width: 32 }}>
            <div
              className="w-8 h-8 rounded-full grid place-items-center"
              style={{ background: allApproved ? '#15803D' : '#F0F0EE' }}
            >
              {allApproved
                ? <Icon name="check" className="w-4 h-4 text-white" strokeWidth={2.6} />
                : <Icon name="dispatch" className="w-4 h-4 text-[#84837C]" strokeWidth={1.6} />}
            </div>
          </div>
          <div className={'flex-1 mb-3 border rounded-lg px-4 py-3 ' + (allApproved ? 'border-[#C3E6CC] bg-[#E6F6EC]' : 'border-[#DEDEDA] bg-[#FAFAF8] opacity-50')}>
            <div className="text-[14px] font-semibold text-[#1A1A17]">Completed</div>
            <div className="text-[12px] text-[#57564F] mt-0.5">PO fully approved and released to production scheduling.</div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-3 mt-4 pt-5 border-t border-[#DEDEDA]">
        <button
          className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md"
          onClick={onBackToList}
        >
          Back to PO list
        </button>
        <button
          className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md"
          onClick={onBackToList}
        >
          <Icon name="po" className="w-[18px] h-[18px]" strokeWidth={1.6} /> View PO
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN SCREEN — orchestrates all phases
   ============================================================ */
function ScreenNewPO({ notify, goTo }) {
  /* 'choose' | 'wizard' | 'manual' | 'submitted' */
  const [phase, setPhase]   = React.useState('choose');
  const [method, setMethod] = React.useState(null);

  /* wizard state */
  const [step, setStep]       = React.useState(1);
  const [maxStep, setMaxStep] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [file, setFile]       = React.useState(null);

  /* shared form & items */
  const [form, setForm]   = React.useState(NP_EMPTY_FORM);
  const [items, setItems] = React.useState(NP_EMPTY_ITEMS);
  const [errors, setErrors] = React.useState({});

  const go = (n) => { setStep(n); setMaxStep((m) => Math.max(m, n)); };

  /* AI analysis simulation */
  React.useEffect(() => {
    if (phase !== 'wizard' || step !== 2) return;
    setProgress(0);
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + 4 + Math.random() * 4);
      setProgress(v);
      if (v >= 100) {
        clearInterval(id);
        setForm(NP_AI_FORM);
        setItems(NP_AI_ITEMS);
        setTimeout(() => go(3), 450);
      }
    }, 90);
    return () => clearInterval(id);
  }, [phase, step]);

  const handleChoose = (m) => {
    setMethod(m);
    setErrors({});
    if (m === 'wizard') {
      setFile({ name: 'acme-PO-bay4-structural.pdf', size: '2.4 MB' });
      setForm(NP_EMPTY_FORM);
      setItems(NP_EMPTY_ITEMS);
      setPhase('wizard');
      setStep(1);
      setMaxStep(1);
    } else {
      setForm(NP_EMPTY_FORM);
      setItems(NP_EMPTY_ITEMS);
      setPhase('manual');
    }
  };

  const validateManual = () => {
    const e = {};
    if (!form.poNumber.trim()) e.poNumber = 'PO Number is required';
    if (!form.title.trim())    e.title    = 'PO Title is required';
    if (!form.client.trim())   e.client   = 'Client / Vendor is required';
    if (!form.due)             e.due      = 'Delivery date is required';
    if (!items.some((it) => it.desc.trim())) e.items = 'At least one line item with a description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveAsDraft = () => {
    notify('Draft saved ✓');
    goTo('list');
  };

  const handleManualSubmit = () => {
    if (!validateManual()) return;
    notify('Sent for approval ✓');
    setPhase('submitted');
  };

  const handleWizardSubmit = () => {
    notify('Sent for approval ✓');
    go(5);
  };

  /* Wizard step footer */
  const wizardFooter = ({
    1: (
      <>
        <button className={btnSecondary} onClick={() => setPhase('choose')}>Cancel</button>
        <button
          className={file ? btnPrimary : 'inline-flex items-center gap-2 bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed font-semibold text-[14px] px-4 py-2.5 rounded-md'}
          disabled={!file}
          onClick={() => go(2)}
        >
          Analyse PO <Icon name="sparkle" className="w-4 h-4" strokeWidth={1.6} />
        </button>
      </>
    ),
    2: (
      <>
        <button className={btnSecondary} onClick={() => go(1)}>Back</button>
        <span className="text-[13px] text-[#57564F] font-mono">Detecting fields…</span>
      </>
    ),
    3: (
      <>
        <button className={btnSecondary} onClick={() => go(1)}>Back</button>
        <div className="flex items-center gap-2">
          <button className={btnSecondary} onClick={handleSaveAsDraft}>Save as Draft</button>
          <button className={btnPrimary} onClick={() => go(4)}>Continue to review</button>
        </div>
      </>
    ),
    4: (
      <>
        <button className={btnSecondary} onClick={() => go(3)}>Back to edit</button>
        <div className="flex items-center gap-2">
          <button className={btnSecondary} onClick={handleSaveAsDraft}>Save as Draft</button>
          <button className={btnPrimary} onClick={handleWizardSubmit}>
            <Icon name="send" className="w-[18px] h-[18px]" /> Send for Approval
          </button>
        </div>
      </>
    ),
  })[step];

  const isWizardSubmitted = phase === 'wizard' && step === 5;

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Purchase Orders', 'Create New PO']} />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto w-full max-w-[720px]">

          {/* ---- CHOOSE ---- */}
          {phase === 'choose' && <NPChooseMethod onChoose={handleChoose} />}

          {/* ---- WIZARD ---- */}
          {phase === 'wizard' && !isWizardSubmitted && (
            <>
              <div className="flex items-center justify-between mb-7">
                <div>
                  <div className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#C2410C]">New purchase order · AI Wizard</div>
                  <h1 className="text-[24px] font-semibold text-[#1A1A17] tracking-tight mt-1">Create a PO from a client PDF</h1>
                </div>
                <span className="text-[12px] font-mono text-[#84837C] hidden sm:block">Step {step} of 4</span>
              </div>

              <section className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
                <div className="px-7 pt-6 pb-5 border-b border-[#DEDEDA]">
                  <Stepper current={step} maxStep={maxStep} onJump={(n) => n <= maxStep && setStep(n)} />
                  <div className="mt-6">
                    <h2 className="text-[20px] font-semibold text-[#1A1A17] leading-tight">{NP_STEP_META[step].title}</h2>
                    <p className="text-[14px] text-[#57564F] mt-1">{NP_STEP_META[step].sub}</p>
                  </div>
                </div>
                <div className="px-7 py-6">
                  {step === 1 && <Step1Body file={file} setFile={setFile} />}
                  {step === 2 && <Step2Body progress={progress} />}
                  {step === 3 && <Step3Body form={form} setForm={setForm} items={items} setItems={setItems} />}
                  {step === 4 && <Step4Body form={form} items={items} file={file} />}
                </div>
                <div className="px-7 py-4 border-t border-[#DEDEDA] bg-[#FAFAF8] flex items-center justify-between gap-3">
                  {wizardFooter}
                </div>
              </section>
            </>
          )}

          {/* ---- WIZARD SUBMITTED ---- */}
          {isWizardSubmitted && (
            <>
              <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] px-7 py-10 text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-[#E6F6EC] text-[#15803D] grid place-items-center mx-auto mb-4">
                  <Icon name="check" className="w-8 h-8" strokeWidth={2} />
                </div>
                <h2 className="text-[20px] font-semibold text-[#1A1A17]">Sent for Approval</h2>
                <p className="text-[14px] text-[#57564F] mt-1.5 max-w-[46ch] mx-auto">
                  <span className="font-mono font-semibold text-[#1A1A17]">{form.poNumber}</span> has been routed through the approval workflow below.
                </p>
              </div>
              <NPApprovalPreview form={form} items={items} onBackToList={() => goTo('list')} />
            </>
          )}

          {/* ---- MANUAL ---- */}
          {phase === 'manual' && (
            <>
              <div className="flex items-center justify-between mb-7">
                <div>
                  <div className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#1D4ED8]">New purchase order · Manual</div>
                  <h1 className="text-[24px] font-semibold text-[#1A1A17] tracking-tight mt-1">Create New Purchase Order</h1>
                </div>
                <button className={btnSecondary} onClick={() => setPhase('choose')}>
                  ← Back
                </button>
              </div>

              <section className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
                <div className="px-7 py-6">
                  <NPManualBody form={form} setForm={setForm} items={items} setItems={setItems} errors={errors} />
                </div>
                <div className="px-7 py-4 border-t border-[#DEDEDA] bg-[#FAFAF8] flex items-center justify-between gap-3">
                  <button className={btnSecondary} onClick={() => setPhase('choose')}>Cancel</button>
                  <div className="flex items-center gap-2">
                    <button className={btnSecondary} onClick={handleSaveAsDraft}>Save as Draft</button>
                    <button className={btnPrimary} onClick={handleManualSubmit}>
                      <Icon name="send" className="w-[18px] h-[18px]" /> Send for Approval
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ---- MANUAL SUBMITTED ---- */}
          {phase === 'submitted' && (
            <>
              <div className="flex items-center justify-between mb-7">
                <div>
                  <div className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#1D4ED8]">New purchase order · Manual</div>
                  <h1 className="text-[24px] font-semibold text-[#1A1A17] tracking-tight mt-1">Create New Purchase Order</h1>
                </div>
              </div>

              <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] px-7 py-10 text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-[#E6F6EC] text-[#15803D] grid place-items-center mx-auto mb-4">
                  <Icon name="check" className="w-8 h-8" strokeWidth={2} />
                </div>
                <h2 className="text-[20px] font-semibold text-[#1A1A17]">Sent for Approval</h2>
                <p className="text-[14px] text-[#57564F] mt-1.5 max-w-[46ch] mx-auto">
                  <span className="font-mono font-semibold text-[#1A1A17]">{form.poNumber || 'Your PO'}</span> has been routed through the approval workflow below.
                </p>
              </div>

              <NPApprovalPreview form={form} items={items} onBackToList={() => goTo('list')} />
            </>
          )}

        </div>
      </div>
    </div>
  );
}

window.ScreenNewPO = ScreenNewPO;
