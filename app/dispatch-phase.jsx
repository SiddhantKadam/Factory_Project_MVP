/* ============================================================
   DISPATCH PHASE PAGE — Phase 5 of 5
   Owner: Dispatch In-charge
   Key action: Mark as Dispatched (final phase action)
   Roles: Dispatch In-charge (owner) · All others (read-only)
   ============================================================ */

const DS_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  deliveryAddress: 'Site B — Sector 12, Pune Industrial Zone',
  assignee: 'V. Patil',
};

const DS_CHECKLIST_INIT = [
  { t: 'QC clearance received and on file',                req: true, done: true,  by: 'V. Patil', date: '14 Jun 2026' },
  { t: 'Packing list prepared, verified, and signed',      req: true, done: true,  by: 'V. Patil', date: '14 Jun 2026' },
  { t: 'Delivery note and dispatch documents completed',   req: true, done: false },
  { t: 'Goods dispatched — vehicle loaded and signed off', req: true, done: false },
];

const DS_DOCS = [
  { n: 'qc-clearance-cert.pdf', t: 'QC Clearance', s: '2.4 MB', by: 'Meera Joshi', d: '14 Jun 2026', pdf: true  },
  { n: 'packing-list-v1.pdf',   t: 'Packing List', s: '880 KB', by: 'V. Patil',    d: '14 Jun 2026', pdf: true  },
];
const DS_DOC_TYPES = ['Packing List', 'Delivery Note', 'Transport Order', 'Photos', 'Other'];

const DS_COMMENTS = [
  { who: 'V. Patil', role: 'Dispatch In-charge', text: 'QC clearance received. Packing list ready. Transport vehicle confirmed for 01 Jul 2026 — morning slot.', time: '14 Jun 2026 · 09:15' },
];

/* phases with all 5 completed/in-progress as Dispatch would see them */
const DS_PHASES = [
  { n: 1, name: 'Cutting',  status: 'Completed' },
  { n: 2, name: 'Beamline', status: 'Completed' },
  { n: 3, name: 'Fit-Up',   status: 'Completed' },
  { n: 4, name: 'QC',       status: 'Completed' },
  { n: 5, name: 'Dispatch', status: 'In Progress' },
];

const dsIpt = 'w-full rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 py-2.5 focus:outline-none focus:border-[#0E7490] focus:ring-[3px] focus:ring-[#0E7490]/30';
const dsSel = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' };

/* ---- Confirm Dispatch modal ---- */
function ConfirmDispatchModal({ onClose, notify }) {
  const [deliveryNote, setDeliveryNote] = React.useState('');
  const [vehicleNo, setVehicleNo] = React.useState('');
  const [deliveryDate, setDeliveryDate] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const canSubmit = deliveryNote.trim() && vehicleNo.trim() && deliveryDate;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A17]/40" onClick={onClose}></div>
      <div className="relative w-full bg-white rounded-xl border border-[#DEDEDA] shadow-[0_20px_50px_rgba(26,26,23,0.25)] overflow-hidden po-rise" style={{ maxWidth: '520px' }}>
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: '#ECFEFF', color: '#0E7490' }}>
              <Icon name="dispatch" className="w-6 h-6" strokeWidth={1.8} />
            </span>
            <div>
              <h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">Confirm Dispatch</h3>
              <p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">Record dispatch details and mark Phase 5 complete. This is the final step — the project will be closed once confirmed.</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Delivery Note No. <span className="text-[#B91C1C]">*</span></label>
                <input className={dsIpt} placeholder="DN-2026-0001" value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Vehicle / Transport No. <span className="text-[#B91C1C]">*</span></label>
                <input className={dsIpt} placeholder="MH-12-AB-1234" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Delivery Address</label>
              <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#57564F]">{DS_PROJECT.deliveryAddress}</div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Expected Delivery Date <span className="text-[#B91C1C]">*</span></label>
              <input type="date" className={dsIpt} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Dispatch Notes <span className="text-[#84837C] font-normal">(optional)</span></label>
              <textarea className={dsIpt + ' min-h-[72px] resize-y'} placeholder="Any notes for site team or logistics…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA] flex items-center justify-end gap-2.5">
          <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
          <button
            className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (canSubmit ? 'text-white' : 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed')}
            style={canSubmit ? { background: '#0E7490' } : {}}
            disabled={!canSubmit}
            onClick={() => { notify('Dispatched ✓ — Project complete'); onClose(); }}
          >
            <Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Confirm Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- doc row ---- */
function DSDocRow({ doc }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
      <span className={'w-9 h-9 rounded-md grid place-items-center flex-none ' + (doc.pdf ? 'bg-[#FCECEC] text-[#B91C1C]' : 'bg-[#E9F0FF] text-[#1D4ED8]')}>
        <Icon name={doc.pdf ? 'pdf' : 'image'} className="w-[18px] h-[18px]" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold font-mono text-[#1A1A17] truncate">{doc.n}</span>
          <span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex-none" style={{ color: '#57564F', background: '#F0F0EE' }}>{doc.t}</span>
        </div>
        <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{doc.s} · {doc.by} · {doc.d}</div>
      </div>
      <button className="w-8 h-8 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE] flex-none" aria-label="Download">
        <Icon name="upload" className="w-[18px] h-[18px] rotate-180" />
      </button>
    </div>
  );
}

/* ---- phase body ---- */
function DispatchBody({ role, notify, openModal }) {
  const isOwner = role === 'Dispatch In-charge' || role === 'General Manager';
  const canComment = !['Finance Officer', 'Viewer'].includes(role);
  const canDispute = role === 'General Manager' || (!isOwner && canComment);

  const [checklist, setChecklist] = React.useState(DS_CHECKLIST_INIT);
  const toggle = (i) => {
    if (!isOwner) return;
    setChecklist((prev) => prev.map((it, idx) => {
      if (idx !== i) return it;
      const done = !it.done;
      return { ...it, done, by: done ? 'V. Patil' : undefined, date: done ? '14 Jun 2026' : undefined };
    }));
  };
  const doneCount = checklist.filter((c) => c.done).length;
  const reqLeft  = checklist.filter((c) => c.req && !c.done).length;
  const pct      = Math.round((doneCount / checklist.length) * 100);

  return (
    <div className="p-5 overflow-y-auto h-full">
      {/* QC cleared — green unlock banner for owner; blue read-only banner for others */}
      {isOwner ? (
        <div className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5 mb-3" style={{ background: '#E6F6EC', border: '1px solid #BBE5CB', borderLeft: '4px solid #15803D' }}>
          <Icon name="check" className="w-[18px] h-[18px] flex-none" style={{ color: '#15803D' }} strokeWidth={2.2} />
          <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">QC approved — Dispatch phase unlocked.</span> Complete all checklist items, then confirm dispatch.</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5 mb-3" style={{ background: '#E9F0FF', border: '1px solid #C7D9FF', borderLeft: '4px solid #1D4ED8' }}>
          <Icon name="eye" className="w-[18px] h-[18px] flex-none" style={{ color: '#1D4ED8' }} />
          <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">You're viewing this phase in read-only mode.</span></span>
        </div>
      )}

      {/* header card */}
      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 mb-3 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-9 h-9 rounded-full text-white grid place-items-center text-[15px] font-mono font-semibold flex-none" style={{ background: '#0E7490' }}>5</span>
              <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">Dispatch</h1>
              <PhasePill status="In Progress" />
              <span className="text-[12px] font-mono text-[#84837C]">Phase 5 of 5</span>
            </div>
            <div className="text-[13px] text-[#57564F] mt-2 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
              <span className="font-medium text-[#1A1A17]">{DS_PROJECT.name}</span><span className="text-[#C9C9C3]">·</span>
              <span>{DS_PROJECT.client}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">{DS_PROJECT.po}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">Target {DS_PROJECT.target}</span><span className="text-[#C9C9C3]">·</span>
              <span>Assignee {DS_PROJECT.assignee}</span>
            </div>
          </div>

          {/* owner-only actions */}
          {isOwner && (
            <div className="flex flex-col items-end gap-1.5 flex-none">
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md"
                  onClick={() => notify('Progress saved')}
                >
                  Save Progress
                </button>
                <button
                  className={'inline-flex items-center gap-2 font-semibold text-[14px] px-4 py-2.5 rounded-md text-white ' + (reqLeft === 0 ? 'hover:opacity-90' : 'cursor-not-allowed opacity-40')}
                  style={{ background: '#0E7490' }}
                  disabled={reqLeft > 0}
                  onClick={() => reqLeft === 0 && openModal('dispatch')}
                >
                  <Icon name="dispatch" className="w-[18px] h-[18px]" strokeWidth={1.8} /> Mark as Dispatched
                </button>
              </div>
              {reqLeft > 0 && (
                <span className="text-[12px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* two columns */}
      <div className="grid lg:grid-cols-[1.85fr_1fr] gap-3 items-start">
        {/* LEFT */}
        <div className="flex flex-col gap-3 min-w-0">

          {/* checklist */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <div className="flex items-center gap-2 mb-2.5">
              <h3 className="text-[16px] font-semibold text-[#1A1A17]">Checklist</h3>
              <span className="text-[12px] font-mono font-semibold rounded-full px-2 py-0.5" style={{ background: '#F0F0EE', color: '#4B5563' }}>{doneCount}/{checklist.length}</span>
              <span className="ml-auto text-[12px] font-mono tabular-nums text-[#84837C]">{pct}%</span>
            </div>
            <div className="mb-3"><Progress done={doneCount} total={checklist.length} tone="#0E7490" /></div>
            <ul>
              {checklist.map((c, i) => (
                <li key={i} className="flex items-start gap-3 py-3 border-b border-[#F0F0EE] last:border-0">
                  {isOwner ? (
                    <button type="button" onClick={() => toggle(i)} aria-pressed={c.done}
                      className="flex-none mt-0.5 cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#0E7490]/35 rounded-full">
                      {c.done
                        ? <span className="w-[20px] h-[20px] rounded-full bg-[#15803D] grid place-items-center"><Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} /></span>
                        : <span className="w-[20px] h-[20px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}
                    </button>
                  ) : (
                    <span className="flex-none mt-0.5">
                      {c.done
                        ? <span className="w-[20px] h-[20px] rounded-full bg-[#15803D] grid place-items-center"><Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} /></span>
                        : <span className="w-[20px] h-[20px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] text-[#1A1A17]">{c.t}{c.req && <span className="text-[#B91C1C] font-semibold"> *</span>}</div>
                    {c.done && c.by && <div className="text-[12px] text-[#84837C] mt-0.5 font-mono">Checked by {c.by} · {c.date}</div>}
                  </div>
                  {isOwner && <span className="text-[11px] font-mono text-[#84837C] flex-none mt-1">{c.done ? 'tap to undo' : 'tap to check'}</span>}
                </li>
              ))}
            </ul>
            {isOwner && (
              <div className="mt-3 pt-3 border-t border-[#F0F0EE] text-[12px] text-[#57564F]">
                <span className="text-[#B91C1C] font-semibold">*</span> Required — must be checked before confirming dispatch.
              </div>
            )}
          </div>

          {/* delivery details (owner editable, others static) */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="dispatch" className="w-[18px] h-[18px]" style={{ color: '#0E7490' }} strokeWidth={1.8} />
              <h3 className="text-[16px] font-semibold text-[#1A1A17]">Delivery Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div className="col-span-2">
                <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Delivery Address</label>
                <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#57564F]">{DS_PROJECT.deliveryAddress}</div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Delivery Note No.</label>
                {isOwner
                  ? <input className={dsIpt} placeholder="DN-2026-0001" />
                  : <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#84837C] italic">Not yet assigned</div>}
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Vehicle / Transport No.</label>
                {isOwner
                  ? <input className={dsIpt} placeholder="MH-12-AB-1234" />
                  : <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#84837C] italic">Not yet assigned</div>}
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Target Dispatch Date</label>
                {isOwner
                  ? <input type="date" className={dsIpt} defaultValue="2026-07-01" />
                  : <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#1A1A17] font-mono">01 Jul 2026</div>}
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Transport Type</label>
                {isOwner
                  ? <select className={dsIpt + ' pr-9 appearance-none cursor-pointer'} style={dsSel}><option>Road — Flatbed</option><option>Road — Enclosed</option><option>Rail</option></select>
                  : <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#1A1A17]">Road — Flatbed</div>}
              </div>
            </div>
          </div>

          {/* comments */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[16px] font-semibold text-[#1A1A17] mb-3">Comments &amp; activity</h3>
            <ol className="flex flex-col gap-3 mb-4">
              {DS_COMMENTS.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#3C3A33] text-white grid place-items-center text-[11px] font-semibold font-mono flex-none">
                    {c.who.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-[#1A1A17]">{c.who}</span>
                      <span className="text-[11px] text-[#84837C]">{c.role}</span>
                      <span className="text-[11px] font-mono text-[#84837C]">· {c.time}</span>
                    </div>
                    <p className="text-[14px] text-[#1A1A17] mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {canComment ? (
              <div className="flex flex-col gap-2">
                <textarea className="w-full min-h-[64px] rounded-md border border-[#C9C9C3] bg-white text-[14px] px-3 py-2.5 resize-y focus:outline-none focus:border-[#0E7490] focus:ring-[3px] focus:ring-[#0E7490]/30" placeholder="Add a comment…" />
                <div className="flex items-center justify-between gap-2">
                  {canDispute && (
                    <button className="inline-flex items-center gap-1.5 bg-white border border-[#C9C9C3] hover:border-[#B45309] hover:text-[#B45309] text-[#57564F] font-semibold text-[13px] px-3 py-2 rounded-md" onClick={() => notify('Dispute raised')}>
                      <Icon name="disputes" className="w-3.5 h-3.5" /> Raise Dispute
                    </button>
                  )}
                  <button className="ml-auto inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2 rounded-md" onClick={() => notify('Comment posted')}>Post</button>
                </div>
              </div>
            ) : (
              <div className="text-[12px] font-mono text-[#84837C] bg-[#FAFAF8] border border-dashed border-[#DEDEDA] rounded-md px-3 py-2">
                {role === 'Finance Officer' ? 'Finance Officer — financial view only, no comments' : 'Viewer — read-only, no comment access'}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3">
          {/* documents */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[15px] font-semibold text-[#1A1A17]">Phase Documents</h3>
              <span className="text-[12px] font-mono text-[#84837C]">{DS_DOCS.length}</span>
            </div>
            {DS_DOCS.map((d, i) => <DSDocRow key={i} doc={d} />)}

            {/* upload — owner only */}
            {isOwner && (
              <div className="mt-4 rounded-md border-2 border-dashed border-[#C9C9C3] bg-[#FAFAF8] p-3.5">
                <button className="w-full inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#84837C] font-medium text-[13px] px-3 py-2 rounded-md mb-2.5" onClick={() => notify('Choose file')}>
                  <Icon name="paperclip" className="w-4 h-4 flex-none" /><span className="truncate">Choose file…</span>
                </button>
                <div className="flex items-center gap-2">
                  <select className="flex-1 h-9 rounded-md border border-[#C9C9C3] text-[13px] pl-3 pr-8 bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0E7490]" style={dsSel}>
                    {DS_DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <button className="h-9 px-4 rounded-md text-white text-[13px] font-semibold flex-none" style={{ background: '#0E7490' }} onClick={() => notify('Uploading…')}>Upload</button>
                </div>
                <div className="text-[11px] text-[#84837C] mt-2">PDF, JPG, PNG — max 20 MB</div>
              </div>
            )}
          </div>

          {/* phase info */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Phase info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed mb-3">Prepare packing list, complete dispatch documents, confirm transport, and sign off on goods leaving site. Marking dispatched closes the project.</p>
            <div className="grid grid-cols-2 gap-y-2 text-[13px]">
              <span className="text-[#84837C]">Phase order</span><span className="text-[#1A1A17] font-mono text-right">5 of 5</span>
              <span className="text-[#84837C]">Started</span><span className="text-[#1A1A17] font-mono text-right">14 Jun 2026</span>
              <span className="text-[#84837C]">Completed</span><span className="text-[#1A1A17] font-mono text-right">—</span>
              <span className="text-[#84837C]">Duration</span><span className="text-[#1A1A17] font-mono text-right">in progress</span>
            </div>
          </div>

          {/* all phases */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">All phases</h3>
            <ul className="flex flex-col gap-1.5">
              {DS_PHASES.map((p) => (
                <li key={p.n} className={'flex items-center gap-2 px-2 py-1.5 rounded-md ' + (p.n === 5 ? 'bg-[#ECFEFF]' : '')}>
                  <span className="w-5 h-5 rounded-full grid place-items-center text-[11px] font-mono font-semibold flex-none"
                    style={p.status === 'Completed' ? { background: '#15803D', color: '#fff' } : p.n === 5 ? { background: '#0E7490', color: '#fff' } : { background: '#F0F0EE', color: '#84837C' }}>
                    {p.status === 'Completed' ? <Icon name="check" className="w-3 h-3" strokeWidth={2.8} /> : p.n}
                  </span>
                  <span className={'text-[13px] ' + (p.n === 5 ? 'font-semibold text-[#0E7490]' : 'text-[#1A1A17]')}>{p.name}</span>
                  <span className="ml-auto">
                    {p.n === 5
                      ? <PhasePill status="In Progress" />
                      : <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ color: '#15803D', background: '#E6F6EC' }}><Icon name="check" className="w-3 h-3" strokeWidth={2.4} /> Completed</span>}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-[#F0F0EE] flex items-start gap-2 text-[12px] text-[#57564F]">
              <Icon name="info" className="w-3.5 h-3.5 text-[#84837C] flex-none mt-0.5" />
              <span>Confirming dispatch marks this project as <span className="font-semibold text-[#1A1A17]">Complete</span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- labelled role frame ---- */
function DSRoleFrame({ tag, title, role, notify, openModal, height = 1020 }) {
  const access = ['Dispatch In-charge', 'General Manager'].includes(role) ? 'edit' : 'view';
  return (
    <section>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[12px] font-semibold text-[#0E7490] bg-[#ECFEFF] rounded px-2 py-0.5">{tag}</span>
        <span className="text-[15px] font-semibold text-[#1A1A17]">{title}</span>
        <NeutralBadge role={role} />
        <span className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold"
          style={access === 'edit' ? { background: '#DCFCE7', color: '#15803D' } : { background: '#F0F0EE', color: '#57564F' }}>
          {access === 'edit' ? 'Edit' : 'View only'}
        </span>
      </div>
      <div className="border border-[#C9C9C3] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(26,26,23,0.05)] bg-[#F4F4F2]">
        <div className="flex" style={{ height }}>
          <MiniRail />
          <div className="flex-1 min-w-0 flex flex-col">
            <FrameTopbar crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Dispatch']} role={role} access={access} />
            <div className="flex-1 overflow-hidden"><DispatchBody role={role} notify={notify} openModal={openModal} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- page ---- */
function DispatchPhasePage() {
  const [toast, setToast]   = React.useState(null);
  const [modal, setModal]   = React.useState(null);
  const timer = React.useRef(null);
  const notify = React.useCallback((m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 1900); }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A17]">
      <div className="max-w-[1180px] mx-auto px-8 py-12 pb-28">
        <header className="mb-10">
          <p className="font-mono text-[12px] tracking-[0.12em] uppercase font-semibold mb-2.5" style={{ color: '#0E7490' }}>Siteflow · Production · Phase 5</p>
          <h1 className="text-[26px] font-semibold tracking-tight mb-2">Dispatch — phase page</h1>
          <p className="text-[16px] text-[#57564F] max-w-[68ch]">Phase 5 of 5 — the final step. Dispatch In-charge owns this phase; all 8 roles shown below. General Manager has full access. The owner gets a <span className="font-semibold text-[#1A1A17]">Delivery Details</span> form and <span className="font-semibold text-[#1A1A17]">Mark as Dispatched</span> action. Finance Officer and Viewer are strict read-only.</p>
        </header>

        <div className="flex flex-col gap-12">
          <DSRoleFrame tag="State 1" title="General Manager — full access, all controls across all phases" role="General Manager" notify={notify} openModal={setModal} height={1100} />
          <DSRoleFrame tag="State 2" title="Dispatch In-charge — owner, full controls" role="Dispatch In-charge" notify={notify} openModal={setModal} height={1100} />

          {/* modal trigger */}
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#57564F] font-semibold mb-3">Confirmation dialog (owner action)</div>
            <div className="flex flex-wrap gap-2.5">
              <button
                className="inline-flex items-center gap-2 font-semibold text-[14px] px-4 py-2.5 rounded-md text-white"
                style={{ background: '#0E7490' }}
                onClick={() => setModal('dispatch')}
              >
                <Icon name="dispatch" className="w-[18px] h-[18px]" strokeWidth={1.8} /> Mark as Dispatched dialog
              </button>
            </div>
            <p className="mt-2.5 text-[12px] text-[#84837C]">In-page, the button stays disabled until all 4 checklist items are checked. This previews the confirmation dialog directly.</p>
          </div>

          <DSRoleFrame tag="State 3" title="Planning Officer — read-only, can comment + raise dispute" role="Planning Officer" notify={notify} openModal={setModal} height={980} />
          <DSRoleFrame tag="State 4" title="Project Manager — read-only, can comment + raise dispute" role="Project Manager" notify={notify} openModal={setModal} height={980} />
          <DSRoleFrame tag="State 5" title="Quality Inspector — read-only, can comment" role="Quality Inspector" notify={notify} openModal={setModal} height={980} />
          <DSRoleFrame tag="State 6" title="Quality Head — read-only, can comment" role="Quality Head" notify={notify} openModal={setModal} height={980} />
          <DSRoleFrame tag="State 7" title="Finance Officer — read-only, no comment access" role="Finance Officer" notify={notify} openModal={setModal} height={940} />
          <DSRoleFrame tag="State 8" title="Viewer — read-only, no comment or actions" role="Viewer" notify={notify} openModal={setModal} height={940} />
        </div>
      </div>

      {modal === 'dispatch' && <ConfirmDispatchModal onClose={() => setModal(null)} notify={notify} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" /><span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DispatchPhasePage />);
