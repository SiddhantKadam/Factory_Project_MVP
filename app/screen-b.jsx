/* ============================================================
   SCREEN B — New PO wizard (single-active stepper)
   ============================================================ */

const INPUT = 'w-full h-10 rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35';
const SELECT_BG = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
};

const btnPrimary = 'inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md';
const btnSecondary = 'inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md';

function AutoTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#B45309', background: '#FBF1DD' }}>
      <Icon name="sparkle" className="w-2.5 h-2.5" strokeWidth={1.4} /> auto-filled
    </span>
  );
}

function Field({ label, auto, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label className="text-[13px] font-semibold text-[#1A1A17]">{label}</label>
        {auto && <AutoTag />}
      </div>
      {children}
      {hint && <span className="text-[12px] text-[#57564F]">{hint}</span>}
    </div>
  );
}

/* ---------------- STEP 1 — UPLOAD ---------------- */
function Step1Body({ file, setFile }) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);
  const pick = (f) => f && setFile({ name: f.name, size: (f.size / 1048576).toFixed(1) + ' MB' });
  return (
    <>
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => pick(e.target.files[0])} />
      <div
        className={'rounded-lg border-2 border-dashed grid place-items-center text-center px-6 py-14 transition-colors cursor-pointer ' + (drag ? 'border-[#C2410C] bg-[#FCEEE4]' : 'border-[#C9C9C3] bg-[#FAFAF8] hover:border-[#84837C]')}
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
      >
        <div className="w-12 h-12 rounded-full bg-white border border-[#DEDEDA] grid place-items-center text-[#C2410C] mb-3.5">
          <Icon name="upload" className="w-6 h-6" strokeWidth={1.6} />
        </div>
        <div className="text-[15px] font-semibold text-[#1A1A17]">Drag &amp; drop or <span className="text-[#C2410C] underline underline-offset-2">browse</span></div>
        <div className="text-[13px] text-[#57564F] mt-1">PDF only · max 10 MB</div>
      </div>

      {file && (
        <div className="mt-4 flex items-center gap-3 rounded-md border border-[#DEDEDA] bg-white px-3 py-2.5">
          <span className="w-9 h-9 rounded-md bg-[#FCECEC] text-[#B91C1C] grid place-items-center flex-none">
            <Icon name="pdf" className="w-5 h-5" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-[#1A1A17] truncate font-mono">{file.name}</div>
            <div className="text-[12px] text-[#84837C] font-mono">{file.size} · PDF</div>
          </div>
          <button className="w-8 h-8 rounded-md grid place-items-center text-[#84837C] hover:bg-[#F0F0EE] hover:text-[#B91C1C] flex-none" onClick={(e) => { e.stopPropagation(); setFile(null); }} aria-label="Remove file">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}

/* ---------------- STEP 2 — ANALYSE ---------------- */
function Step2Body({ progress }) {
  const checks = [
    { label: 'PO number', val: 'PO-2026-0042', at: 18 },
    { label: 'Client / Vendor', val: 'Acme Infrastructure Ltd.', at: 38 },
    { label: 'Total amount', val: '₹7,88,800.00', at: 58 },
    { label: 'Required delivery date', val: '20 Aug 2026', at: 78 },
    { label: 'Line items', val: '3 found', at: 94 },
  ];
  let busyShown = false;
  return (
    <>
      <div className="relative rounded-lg border border-[#DEDEDA] bg-[#FAFAF8] h-40 overflow-hidden grid place-items-center">
        <div className="flex flex-col items-center text-[#84837C]">
          <Icon name="pdf" className="w-10 h-10 text-[#C9C9C3]" strokeWidth={1.4} />
          <span className="text-[12px] font-mono mt-2">page 1 / 3</span>
        </div>
        <div className="po-scanline"></div>
        <div className="po-scanglow"></div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[13px] mb-1.5">
          <span className="font-semibold text-[#1A1A17]">Analysing</span>
          <span className="font-mono tabular-nums text-[#57564F]">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#F0F0EE] overflow-hidden">
          <div className="h-full rounded-full bg-[#C2410C] transition-[width] duration-200" style={{ width: progress + '%' }}></div>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2.5">
        {checks.map((c) => {
          const done = progress >= c.at;
          const busy = !done && !busyShown;
          if (busy) busyShown = true;
          return (
            <li key={c.label} className="flex items-center gap-3">
              <span className={'w-6 h-6 rounded-full grid place-items-center flex-none ' + (done ? 'bg-[#E6F6EC] text-[#15803D]' : busy ? 'bg-[#FBF1DD] text-[#B45309]' : 'bg-[#F0F0EE] text-[#84837C]')}>
                {done ? <Icon name="check" className="w-3.5 h-3.5" /> : busy ? <Icon name="spinner" className="w-4 h-4 po-spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
              </span>
              <span className={'text-[14px] ' + (done ? 'text-[#1A1A17] font-medium' : 'text-[#57564F]')}>{c.label}</span>
              <span className="ml-auto text-[13px] font-mono tabular-nums text-[#84837C] truncate max-w-[45%] text-right">{done ? c.val : busy ? 'Reading…' : 'Pending'}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ---------------- STEP 3 — REVIEW ---------------- */
function Step3Body({ form, setForm, items, setItems }) {
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setItem = (i, k) => (e) => {
    const v = k === 'desc' ? e.target.value : Number(e.target.value || 0);
    setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  };
  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const delItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const cur = form.currency;
  const cell = 'px-3 py-2 border-b border-[#DEDEDA] align-middle';
  const liInput = 'w-full bg-transparent text-[14px] text-[#1A1A17] px-1.5 py-1 rounded focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C2410C]/30';
  const thLi = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-3 py-2.5 border-b border-[#C9C9C3]';

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <Field label="PO Number" auto>
          <input className={INPUT + ' font-mono tabular-nums'} value={form.poNumber} onChange={set('poNumber')} />
        </Field>
        <Field label="Required Delivery Date" auto>
          <input type="date" className={INPUT + ' font-mono tabular-nums'} value={form.due} onChange={set('due')} />
        </Field>
        <Field label="PO Title" auto>
          <input className={INPUT} value={form.title} onChange={set('title')} />
        </Field>
        <Field label="Client / Vendor" auto>
          <input className={INPUT} value={form.client} onChange={set('client')} />
        </Field>
        <Field label="Currency">
          <select className={INPUT + ' pr-8 appearance-none cursor-pointer'} style={SELECT_BG} value={form.currency} onChange={set('currency')}>
            {Object.keys(CURRENCY).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Total Amount" auto hint="Auto-summed from line items below.">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84837C] font-mono text-[14px]">{CURRENCY[cur]}</span>
            <input className={INPUT + ' text-right font-mono tabular-nums pr-3 pl-9 bg-[#FAFAF8]'} value={money(total, cur).replace(CURRENCY[cur], '')} readOnly />
          </div>
        </Field>
        <Field label="Assign Project Manager">
          <select className={INPUT + ' pr-8 appearance-none cursor-pointer'} style={SELECT_BG} value={form.pm} onChange={set('pm')}>
            <option>R. Okafor</option>
            <option>S. Iyer</option>
            <option>T. Nakamura</option>
            <option>P. Fernandes</option>
          </select>
        </Field>
        <div className="hidden md:block"></div>
        <div className="col-span-2">
          <Field label="Notes / Description">
            <textarea className={INPUT.replace('h-10', 'min-h-[88px]') + ' py-2.5 resize-y leading-relaxed'} value={form.notes} onChange={set('notes')} />
          </Field>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-[#1A1A17]">Line items</h3>
            <AutoTag />
          </div>
          <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C2410C] hover:bg-[#FCEEE4] px-2.5 py-1.5 rounded-md" onClick={addItem}>
            <Icon name="plus" className="w-4 h-4" strokeWidth={2} /> Add line item
          </button>
        </div>
        <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#FAFAF8]">
                <th className={thLi + ' text-left'}>Description</th>
                <th className={thLi + ' text-right w-20'}>Qty</th>
                <th className={thLi + ' text-right w-32'}>Unit Price</th>
                <th className={thLi + ' text-right w-36'}>Amount</th>
                <th className="border-b border-[#C9C9C3] w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="hover:bg-[#FAFAF8]">
                  <td className={cell}><input className={liInput} value={it.desc} placeholder="Item description" onChange={setItem(i, 'desc')} /></td>
                  <td className={cell}><input type="number" className={liInput + ' text-right font-mono tabular-nums'} value={it.qty} onChange={setItem(i, 'qty')} /></td>
                  <td className={cell}><input type="number" className={liInput + ' text-right font-mono tabular-nums'} value={it.price} onChange={setItem(i, 'price')} /></td>
                  <td className={cell + ' text-right font-mono tabular-nums text-[#1A1A17] whitespace-nowrap'}>{money(it.qty * it.price, cur)}</td>
                  <td className={cell + ' text-center'}>
                    <button className="w-7 h-7 rounded grid place-items-center text-[#84837C] hover:bg-[#FCECEC] hover:text-[#B91C1C]" onClick={() => delItem(i)} aria-label="Remove">
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
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------------- STEP 4 — CONFIRM ---------------- */
function SummaryRow({ label, children, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#DEDEDA] last:border-0">
      <span className="text-[13px] text-[#57564F] flex-none">{label}</span>
      <span className={'text-[14px] text-[#1A1A17] text-right ' + (mono ? 'font-mono tabular-nums' : 'font-medium')}>{children}</span>
    </div>
  );
}

function Step4Body({ form, items, file }) {
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const cur = form.currency;
  return (
    <>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] mb-1.5 font-mono">PO details</div>
          <SummaryRow label="PO Number" mono>{form.poNumber}</SummaryRow>
          <SummaryRow label="Title">{form.title}</SummaryRow>
          <SummaryRow label="Client / Vendor">{form.client}</SummaryRow>
          <SummaryRow label="Required delivery" mono>{fmtDate(form.due)}</SummaryRow>
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] mb-1.5 font-mono">Routing</div>
          <SummaryRow label="Project Manager">{form.pm}</SummaryRow>
          <SummaryRow label="Currency" mono>{form.currency}</SummaryRow>
          <SummaryRow label="Total amount" mono>{money(total, cur)}</SummaryRow>
          <SummaryRow label="Status"><StatusPill status="Draft" /></SummaryRow>
        </div>
      </div>

      {form.notes && (
        <div className="mt-5">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] mb-1.5 font-mono">Notes</div>
          <p className="text-[14px] text-[#1A1A17] leading-relaxed bg-[#FAFAF8] border border-[#DEDEDA] rounded-md px-3.5 py-3">{form.notes}</p>
        </div>
      )}

      <div className="mt-5">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] mb-1.5 font-mono">Line items · {items.length}</div>
        <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-[14px]">
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-b border-[#DEDEDA] last:border-0">
                  <td className="px-3.5 py-2.5 text-[#1A1A17]">{it.desc}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono tabular-nums text-[#57564F] w-16">{it.qty}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono tabular-nums text-[#57564F] w-28">{money(it.price, cur)}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono tabular-nums text-[#1A1A17] w-32">{money(it.qty * it.price, cur)}</td>
                </tr>
              ))}
              <tr className="bg-[#FAFAF8]">
                <td className="px-3.5 py-3 text-right font-semibold text-[13px] uppercase tracking-wide text-[#57564F]" colSpan={3}>Total</td>
                <td className="px-3.5 py-3 text-right font-mono tabular-nums font-semibold text-[16px] text-[#1A1A17]">{money(total, cur)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {file && (
        <div className="mt-5 flex items-center gap-3 rounded-md border border-[#DEDEDA] bg-white px-3 py-2.5">
          <span className="w-9 h-9 rounded-md bg-[#FCECEC] text-[#B91C1C] grid place-items-center flex-none">
            <Icon name="pdf" className="w-5 h-5" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-[#1A1A17] truncate font-mono">{file.name}</div>
            <div className="text-[12px] text-[#84837C] font-mono">{file.size} · attached source document</div>
          </div>
          <span className="text-[12px] font-semibold text-[#15803D] flex items-center gap-1"><Icon name="check" className="w-3.5 h-3.5" /> attached</span>
        </div>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-md border border-[#C7D9FF] bg-[#E9F0FF] border-l-4 border-l-[#1D4ED8] px-4 py-3">
        <Icon name="disputes" className="w-5 h-5 text-[#1D4ED8] flex-none mt-px" />
        <p className="text-[13px] text-[#1A1A17]">Once submitted, this PO goes to the <strong>GM / Director</strong> for approval. You'll be notified when it's reviewed.</p>
      </div>
    </>
  );
}

/* ---------------- SUBMITTED (success) ---------------- */
function SubmittedView({ form, goTo }) {
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] px-7 py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#E6F6EC] text-[#15803D] grid place-items-center mx-auto mb-5">
        <Icon name="check" className="w-9 h-9" />
      </div>
      <h2 className="text-[20px] font-semibold text-[#1A1A17]">Sent for Approval</h2>
      <p className="text-[14px] text-[#57564F] mt-1.5 max-w-[46ch] mx-auto">
        <span className="font-mono font-semibold text-[#1A1A17]">{form.poNumber}</span> has been routed to the GM / Director. You'll be notified when it's reviewed.
      </p>
      <div className="flex items-center justify-center gap-3 mt-6">
        <button className={btnSecondary} onClick={() => goTo('list')}>Back to list</button>
        <button className={btnPrimary} onClick={() => goTo('detail')}>View PO</button>
      </div>
    </div>
  );
}

/* ---------------- WIZARD CONTAINER ---------------- */
const STEP_META = {
  1: { title: 'New purchase order', sub: 'Upload the PO PDF from your client and submit it for approval.' },
  2: { title: 'Reading your purchase order…', sub: 'Extracting fields from the uploaded PDF. This usually takes a few seconds.' },
  3: { title: 'Review extracted data', sub: 'Check the fields we pulled from the PDF and correct anything before continuing.' },
  4: { title: 'Confirm & submit', sub: 'Review everything below. Nothing is sent until you submit.' },
};

function ScreenB({ notify, goTo }) {
  const [step, setStep] = React.useState(1);
  const [maxStep, setMaxStep] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [file, setFile] = React.useState({ name: 'acme-PO-bay4-structural.pdf', size: '2.4 MB' });
  const [form, setForm] = React.useState({
    poNumber: 'PO-2026-0042',
    title: 'Structural steel — Warehouse Block B',
    client: 'Acme Infrastructure Ltd.',
    currency: 'INR',
    due: '2026-08-20',
    pm: 'R. Okafor',
    notes: 'Fabricate and supply primary structural steel for Warehouse Block B. All members to be shot-blasted to SA 2.5 and primed before dispatch. Camber per drawing S-204.',
  });
  const [items, setItems] = React.useState([
    { desc: 'ISMB 300 primary beams — fabricated & shot-blasted', qty: 24, price: 18500 },
    { desc: 'ISMC 150 channel bracing', qty: 60, price: 4200 },
    { desc: 'Base plates 400×400×20mm w/ anchor assembly', qty: 16, price: 5800 },
  ]);

  const go = (n) => { setStep(n); setMaxStep((m) => Math.max(m, n)); };

  /* drive the analyse progress + auto-advance */
  React.useEffect(() => {
    if (step !== 2) return;
    setProgress(0);
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + 4 + Math.random() * 4);
      setProgress(v);
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => go(3), 450);
      }
    }, 90);
    return () => clearInterval(id);
  }, [step]);

  const meta = STEP_META[step];

  const footer = {
    1: (
      <>
        <button className={btnSecondary} onClick={() => goTo('list')}>Cancel</button>
        <button className={file ? btnPrimary : 'inline-flex items-center gap-2 bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed font-semibold text-[14px] px-4 py-2.5 rounded-md'} disabled={!file} onClick={() => go(2)}>
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
        <button className={btnPrimary} onClick={() => go(4)}>Continue to review</button>
      </>
    ),
    4: (
      <>
        <button className={btnSecondary} onClick={() => go(3)}>Back to edit</button>
        <button className={btnPrimary} onClick={() => { notify('Sent for approval ✓'); go(5); }}>
          <Icon name="send" className="w-[18px] h-[18px]" /> Submit for approval
        </button>
      </>
    ),
  }[step];

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Purchase Orders', 'New PO']} />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto w-full max-w-[720px]">
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#C2410C]">New purchase order</div>
              <h1 className="text-[24px] font-semibold text-[#1A1A17] tracking-tight mt-1">Create a PO from a client PDF</h1>
            </div>
            {step <= 4 && <span className="text-[12px] font-mono text-[#84837C] hidden sm:block">Step {step} of 4</span>}
          </div>

          {step === 5 ? (
            <SubmittedView form={form} goTo={goTo} />
          ) : (
            <section className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
              <div className="px-7 pt-6 pb-5 border-b border-[#DEDEDA]">
                <Stepper current={step} maxStep={maxStep} onJump={(n) => setStep(n)} />
                <div className="mt-6">
                  <h2 className="text-[20px] font-semibold text-[#1A1A17] leading-tight">{meta.title}</h2>
                  <p className="text-[14px] text-[#57564F] mt-1">{meta.sub}</p>
                </div>
              </div>
              <div className="px-7 py-6">
                {step === 1 && <Step1Body file={file} setFile={setFile} />}
                {step === 2 && <Step2Body progress={progress} />}
                {step === 3 && <Step3Body form={form} setForm={setForm} items={items} setItems={setItems} />}
                {step === 4 && <Step4Body form={form} items={items} file={file} />}
              </div>
              <div className="px-7 py-4 border-t border-[#DEDEDA] bg-[#FAFAF8] flex items-center justify-between gap-3">{footer}</div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

window.ScreenB = ScreenB;
