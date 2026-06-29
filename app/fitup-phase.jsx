/* ============================================================
   FIT-UP PHASE PAGE — Phase 3 of 5
   Adds: Inspection Form, Pass/Fail actions, 3 modals
   Roles: Quality Inspector (owner) · Project Manager (read-only)
   ============================================================ */

const FU_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Priya Sharma',
};

const FU_CHECKLIST_INIT = [
  { t: 'Components positioned per approved drawings', req: true, done: true,  by: 'Priya Sharma', date: '13 Jun 2026' },
  { t: 'Joint alignment verified',                    req: true, done: true,  by: 'Priya Sharma', date: '13 Jun 2026' },
  { t: 'Tolerances within specification',             req: true, done: true,  by: 'Priya Sharma', date: '13 Jun 2026' },
  { t: 'Temporary fixings in place',                  req: true, done: true,  by: 'Priya Sharma', date: '13 Jun 2026' },
  { t: 'Readiness for welding confirmed',             req: true, done: false },
  { t: 'Fit-up inspection report uploaded',           req: true, done: false },
];

const FU_DOCS = [
  { n: 'fitup-alignment-photo.jpg', t: 'Photo', s: '1.1 MB', by: 'Priya Sharma', d: '13 Jun 2026', pdf: false },
];
const FU_DOC_TYPES = ['Fit-Up Inspection Report', 'Photos', 'Other'];

const FU_INSPECTION = {
  alignment: 'Within ±0.5mm',
  tolerance: 'Pass',
  measurements: 'Bay 4 beam — web height 650mm (spec 650±2mm). Flange width 200mm (spec 200±1mm).',
  notes: 'Minor gap at joint J-12 corrected with shimming. Re-checked and within spec.',
};

const FU_COMMENTS = [
  { who: 'Priya Sharma', role: 'Quality Inspector', text: 'Fit-up looks good on the south span. Two checks pending before sign-off.', time: '13 Jun 2026 · 11:20' },
];

/* ---------- modal shell ---------- */
function Modal({ children, onClose, max = '460px' }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A17]/40" onClick={onClose}></div>
      <div className="relative w-full bg-white rounded-xl border border-[#DEDEDA] shadow-[0_20px_50px_rgba(26,26,23,0.25)] overflow-hidden po-rise" style={{ maxWidth: max }}>
        {children}
      </div>
    </div>
  );
}
const ipt = 'w-full rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 py-2.5 focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35';
const selStyle = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' };

/* ---------- Pass / Approve modal ---------- */
function PassModal({ onClose, notify }) {
  const [notes, setNotes] = React.useState('');
  const missing = !notes.trim();
  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: '#E6F6EC', color: '#15803D' }}><Icon name="check" className="w-6 h-6" strokeWidth={2.2} /></span>
          <div><h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">Approve Fit-Up Phase</h3>
            <p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">Confirm that all fit-up checks are complete and joints are within specification. This will mark Phase 3 complete and unlock Phase 4 (QC / Painting).</p></div>
        </div>
        <div className="mt-4">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] font-mono mb-1.5">Approval notes · required</div>
          <textarea className={ipt + ' min-h-[80px] resize-y'} placeholder="Confirm inspection passed…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA] flex items-center justify-end gap-2.5">
        <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
        <button className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (missing ? 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed' : 'bg-[#15803D] hover:bg-[#11652F] text-white')} disabled={missing} onClick={() => { notify('Fit-Up approved ✓'); onClose(); }}>
          <Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Approve Fit-Up
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Fail / Reject modal ---------- */
function FailModal({ onClose, notify }) {
  const [reason, setReason] = React.useState('');
  const missing = !reason.trim();
  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: '#FCECEC', color: '#B91C1C' }}><Icon name="x" className="w-6 h-6" strokeWidth={2.2} /></span>
          <div><h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">Fail Fit-Up Phase</h3>
            <p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">This will mark the phase as failed and pause the project until issues are resolved.</p></div>
        </div>
        <div className="mt-4">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] font-mono mb-1.5">Rejection reason · required</div>
          <textarea className={ipt + ' min-h-[80px] resize-y'} placeholder="Describe what needs to be corrected…" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
      <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA]">
        <div className="flex items-center justify-end gap-2.5">
          <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
          <button className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (missing ? 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed' : 'bg-[#B91C1C] hover:bg-[#991717] text-white')} disabled={missing} onClick={() => { notify('Fit-Up failed'); onClose(); }}>
            <Icon name="x" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Fail Phase
          </button>
        </div>
        <p className="text-[12px] text-[#84837C] mt-2.5 text-right">An open dispute can be raised from the comments section.</p>
      </div>
    </Modal>
  );
}

/* ---------- Raise Dispute modal ---------- */
function DisputeModal({ onClose, notify }) {
  const [desc, setDesc] = React.useState('');
  const missing = !desc.trim();
  return (
    <Modal onClose={onClose} max="480px">
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: '#FCEEE4', color: '#C2410C' }}><Icon name="disputes" className="w-6 h-6" strokeWidth={1.9} /></span>
          <div><h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">Raise Dispute</h3>
            <p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">Flag an issue on this phase for the project team to resolve.</p></div>
        </div>
        <div className="mt-4 flex flex-col gap-3.5">
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Reason</label>
            <select className={ipt + ' pr-9 appearance-none cursor-pointer'} style={selStyle}>
              <option>Quality Issue</option><option>Documentation Issue</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Description <span className="text-[#C2410C]">*</span></label>
            <textarea className={ipt + ' min-h-[80px] resize-y'} placeholder="Describe the issue…" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Attach document <span className="text-[#84837C] font-normal">(optional)</span></label>
            <button className="w-full inline-flex items-center gap-2 rounded-md border border-dashed border-[#C9C9C3] bg-[#FAFAF8] text-[#84837C] text-[13px] px-3 py-2.5 hover:border-[#84837C]"><Icon name="paperclip" className="w-4 h-4" /> Choose file…</button>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA] flex items-center justify-end gap-2.5">
        <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
        <button className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (missing ? 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed' : 'bg-[#C2410C] hover:bg-[#9A330A] text-white')} disabled={missing} onClick={() => { notify('Dispute raised'); onClose(); }}>
          <Icon name="disputes" className="w-[18px] h-[18px]" /> Raise Dispute
        </button>
      </div>
    </Modal>
  );
}

/* ---------- inspection form ---------- */
function InspectionForm({ owner }) {
  const Static = ({ children }) => <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#1A1A17] min-h-[40px] flex items-center">{children}</div>;
  const StaticArea = ({ children }) => <div className="rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3 py-2 text-[14px] text-[#1A1A17] leading-relaxed">{children}</div>;
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="quality" className="w-[18px] h-[18px] text-[#C2410C]" />
        <h3 className="text-[16px] font-semibold text-[#1A1A17]">Fit-Up Inspection Details</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div>
          <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Joint Alignment</label>
          {owner ? <input className={ipt} defaultValue={FU_INSPECTION.alignment} /> : <Static>{FU_INSPECTION.alignment}</Static>}
        </div>
        <div>
          <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Tolerance Check</label>
          {owner
            ? <select className={ipt + ' pr-9 appearance-none cursor-pointer'} style={selStyle} defaultValue="Pass"><option>Pass</option><option>Fail</option><option>Pending</option></select>
            : <Static><span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: '#15803D' }}><Icon name="check" className="w-4 h-4" strokeWidth={2.4} /> Pass</span></Static>}
        </div>
        <div className="col-span-2">
          <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Measurements</label>
          {owner ? <textarea className={ipt + ' min-h-[56px] resize-y'} defaultValue={FU_INSPECTION.measurements} /> : <StaticArea>{FU_INSPECTION.measurements}</StaticArea>}
        </div>
        <div className="col-span-2">
          <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Inspector Notes</label>
          {owner ? <textarea className={ipt + ' min-h-[56px] resize-y'} defaultValue={FU_INSPECTION.notes} /> : <StaticArea>{FU_INSPECTION.notes}</StaticArea>}
        </div>
      </div>
    </div>
  );
}

/* ---------- doc row ---------- */
function FUDocRow({ doc }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#F0F0EE] last:border-0">
      <span className={'w-9 h-9 rounded-md grid place-items-center flex-none ' + (doc.pdf ? 'bg-[#FCECEC] text-[#B91C1C]' : 'bg-[#E9F0FF] text-[#1D4ED8]')}><Icon name={doc.pdf ? 'pdf' : 'image'} className="w-[18px] h-[18px]" strokeWidth={1.5} /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><span className="text-[13px] font-semibold font-mono text-[#1A1A17] truncate">{doc.n}</span><span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex-none" style={{ color: '#57564F', background: '#F0F0EE' }}>{doc.t}</span></div>
        <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{doc.s} · {doc.by} · {doc.d}</div>
      </div>
      <button className="w-8 h-8 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE] flex-none" aria-label="Download"><Icon name="upload" className="w-[18px] h-[18px] rotate-180" /></button>
    </div>
  );
}

/* ---------- phase body ---------- */
function FitUpBody({ role, notify, openModal }) {
  const owner = role === 'Quality Inspector';
  const [checklist, setChecklist] = React.useState(FU_CHECKLIST_INIT);
  const toggle = (i) => { if (!owner) return; setChecklist((p) => p.map((it, idx) => idx === i ? { ...it, done: !it.done, by: !it.done ? 'Priya Sharma' : undefined, date: !it.done ? '13 Jun 2026' : undefined } : it)); };
  const doneCount = checklist.filter((c) => c.done).length;
  const reqLeft = checklist.filter((c) => c.req && !c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  return (
    <div className="p-5 overflow-y-auto h-full">
      {!owner && (
        <div className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5 mb-3" style={{ background: '#E9F0FF', border: '1px solid #C7D9FF', borderLeft: '4px solid #1D4ED8' }}>
          <Icon name="eye" className="w-[18px] h-[18px] flex-none" style={{ color: '#1D4ED8' }} />
          <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">You're viewing this phase in read-only mode.</span></span>
        </div>
      )}

      {/* header */}
      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 mb-3 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-9 h-9 rounded-full bg-[#1D4ED8] text-white grid place-items-center text-[15px] font-mono font-semibold flex-none">3</span>
              <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">Fit-Up</h1>
              <PhasePill status="In Progress" />
              <span className="text-[12px] font-mono text-[#84837C]">Phase 3 of 5</span>
            </div>
            <div className="text-[13px] text-[#57564F] mt-2 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
              <span className="font-medium text-[#1A1A17]">{FU_PROJECT.name}</span><span className="text-[#C9C9C3]">·</span>
              <span>{FU_PROJECT.client}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">{FU_PROJECT.po}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">Target {FU_PROJECT.target}</span><span className="text-[#C9C9C3]">·</span>
              <span>Assignee {FU_PROJECT.assignee}</span>
            </div>
          </div>

          {owner && (
            <div className="flex flex-col items-end gap-1.5 flex-none">
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[13px] px-3.5 py-2 rounded-md" onClick={() => notify('Progress saved')}>Save Progress</button>
                <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#57564F] font-semibold text-[13px] px-3.5 py-2 rounded-md" onClick={() => openModal('dispute')}><Icon name="disputes" className="w-4 h-4" /> Raise Dispute</button>
                <button className={'inline-flex items-center gap-2 font-semibold text-[13px] px-3.5 py-2 rounded-md border ' + (reqLeft === 0 ? 'bg-white border-[#B91C1C]/40 text-[#B91C1C] hover:bg-[#FCECEC]' : 'bg-[#FAFAF8] text-[#84837C] border-[#DEDEDA] cursor-not-allowed')} disabled={reqLeft > 0} onClick={() => reqLeft === 0 && openModal('fail')}><Icon name="x" className="w-4 h-4" strokeWidth={2.2} /> Fail / Reject</button>
                <button className={'inline-flex items-center gap-2 font-semibold text-[13px] px-3.5 py-2 rounded-md ' + (reqLeft === 0 ? 'text-white' : 'cursor-not-allowed')} style={reqLeft === 0 ? { background: '#15803D' } : { background: '#E6F6EC', color: '#8FB89C' }} disabled={reqLeft > 0} onClick={() => reqLeft === 0 && openModal('pass')}><Icon name="check" className="w-4 h-4" strokeWidth={2.2} /> Pass / Approve</button>
              </div>
              {reqLeft > 0 && <span className="text-[12px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>}
            </div>
          )}
        </div>
      </div>

      {/* two cols */}
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
            <div className="mb-3"><Progress done={doneCount} total={checklist.length} /></div>
            <ul>
              {checklist.map((c, i) => (
                <li key={i} className="flex items-start gap-3 py-3 border-b border-[#F0F0EE] last:border-0">
                  {owner ? (
                    <button type="button" onClick={() => toggle(i)} aria-pressed={c.done} className="flex-none mt-0.5 cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#C2410C]/35 rounded-full">
                      {c.done ? <span className="w-[20px] h-[20px] rounded-full bg-[#15803D] grid place-items-center"><Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} /></span> : <span className="w-[20px] h-[20px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}
                    </button>
                  ) : (
                    <span className="flex-none mt-0.5">{c.done ? <span className="w-[20px] h-[20px] rounded-full bg-[#15803D] grid place-items-center"><Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} /></span> : <span className="w-[20px] h-[20px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] text-[#1A1A17]">{c.t}<span className="text-[#B91C1C] font-semibold"> *</span></div>
                    {c.done && c.by && <div className="text-[12px] text-[#84837C] mt-0.5 font-mono">Checked by {c.by} · {c.date}</div>}
                  </div>
                </li>
              ))}
            </ul>
            {owner && <div className="mt-3 pt-3 border-t border-[#F0F0EE] text-[12px] text-[#57564F]"><span className="text-[#B91C1C] font-semibold">*</span> Required — must be checked before completing the phase.</div>}
          </div>

          {/* inspection form */}
          <InspectionForm owner={owner} />

          {/* comments */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[16px] font-semibold text-[#1A1A17] mb-3">Comments &amp; activity</h3>
            <ol className="flex flex-col gap-3 mb-4">
              {FU_COMMENTS.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#3C3A33] text-white grid place-items-center text-[11px] font-semibold font-mono flex-none">{c.who.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><span className="text-[13px] font-semibold text-[#1A1A17]">{c.who}</span><span className="text-[11px] text-[#84837C]">{c.role}</span><span className="text-[11px] font-mono text-[#84837C]">· {c.time}</span></div>
                    <p className="text-[14px] text-[#1A1A17] mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* comment input present for both QI + PM */}
            <div className="flex flex-col gap-2">
              <textarea className="w-full min-h-[64px] rounded-md border border-[#C9C9C3] bg-white text-[14px] px-3 py-2.5 resize-y focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35" placeholder="Add a comment…" />
              <div className="flex items-center justify-between gap-2">
                {/* PM gets a Raise Dispute ghost in comments; QI already has it in header */}
                {!owner ? (
                  <button className="inline-flex items-center gap-1.5 bg-white border border-[#C9C9C3] hover:border-[#B45309] hover:text-[#B45309] text-[#57564F] font-semibold text-[13px] px-3 py-2 rounded-md" onClick={() => openModal('dispute')}><Icon name="disputes" className="w-4 h-4" /> Raise Dispute</button>
                ) : <span />}
                <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2 rounded-md" onClick={() => notify('Comment posted')}>Post</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3">
          {/* documents */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <div className="flex items-center gap-2 mb-3"><h3 className="text-[15px] font-semibold text-[#1A1A17]">Phase Documents</h3><span className="text-[12px] font-mono text-[#84837C]">{FU_DOCS.length}</span></div>
            {FU_DOCS.map((d, i) => <FUDocRow key={i} doc={d} />)}
            {owner && (
              <div className="mt-4 rounded-md border-2 border-dashed border-[#C9C9C3] bg-[#FAFAF8] p-3.5">
                <button className="w-full inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#84837C] font-medium text-[13px] px-3 py-2 rounded-md mb-2.5"><Icon name="paperclip" className="w-4 h-4 flex-none" /><span className="truncate">Choose file…</span></button>
                <div className="flex items-center gap-2">
                  <select className="flex-1 h-9 rounded-md border border-[#C9C9C3] text-[13px] pl-3 pr-8 bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#C2410C]" style={selStyle}>{FU_DOC_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                  <button className="h-9 px-4 rounded-md bg-[#C2410C] hover:bg-[#9A330A] text-white text-[13px] font-semibold flex-none">Upload</button>
                </div>
                <div className="text-[11px] text-[#84837C] mt-2">PDF, JPG, PNG — max 20 MB</div>
              </div>
            )}
          </div>

          {/* phase info */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Phase info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed mb-3">Fit and align assembled members, verify joints and tolerances, then sign off the inspection before welding/QC.</p>
            <div className="grid grid-cols-2 gap-y-2 text-[13px]">
              <span className="text-[#84837C]">Phase order</span><span className="text-[#1A1A17] font-mono text-right">3 of 5</span>
              <span className="text-[#84837C]">Started</span><span className="text-[#1A1A17] font-mono text-right">13 Jun 2026</span>
              <span className="text-[#84837C]">Completed</span><span className="text-[#1A1A17] font-mono text-right">—</span>
              <span className="text-[#84837C]">Duration</span><span className="text-[#1A1A17] font-mono text-right">1 day</span>
            </div>
          </div>

          {/* related phases */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">All phases</h3>
            <ul className="flex flex-col gap-1.5">
              {PHASES.map((p) => (
                <li key={p.n} className={'flex items-center gap-2 px-2 py-1.5 rounded-md ' + (p.n === 3 ? 'bg-[#E9F0FF]' : '')}>
                  <span className="w-5 h-5 rounded-full grid place-items-center text-[11px] font-mono font-semibold flex-none" style={p.status === 'Completed' ? { background: '#15803D', color: '#fff' } : p.status === 'In Progress' ? { background: '#1D4ED8', color: '#fff' } : { background: '#F0F0EE', color: '#84837C' }}>{p.n}</span>
                  <span className={'text-[13px] ' + (p.n === 3 ? 'font-semibold text-[#1D4ED8]' : 'text-[#1A1A17]')}>{p.name}</span>
                  <span className="ml-auto"><PhasePill status={p.status} locked={p.locked} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FURoleFrame({ tag, title, role, notify, openModal, height = 1180 }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[12px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">{tag}</span>
        <span className="text-[15px] font-semibold text-[#1A1A17]">{title}</span>
        <NeutralBadge role={role} />
      </div>
      <div className="border border-[#C9C9C3] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(26,26,23,0.05)] bg-[#F4F4F2]">
        <div className="flex" style={{ height }}>
          <MiniRail />
          <div className="flex-1 min-w-0 flex flex-col">
            <FrameTopbar crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Fit-Up']} role={role} />
            <div className="flex-1 overflow-hidden"><FitUpBody role={role} notify={notify} openModal={openModal} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FitUpPhasePage() {
  const [toast, setToast] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const timer = React.useRef(null);
  const notify = React.useCallback((m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 1900); }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A17]">
      <div className="max-w-[1180px] mx-auto px-8 py-12 pb-28">
        <header className="mb-10">
          <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#C2410C] font-semibold mb-2.5">Siteflow · Production · Phase 3</p>
          <h1 className="text-[26px] font-semibold tracking-tight mb-2">Fit-Up — phase page</h1>
          <p className="text-[16px] text-[#57564F] max-w-[68ch]">Phase 3 of 5 adds an <span className="font-semibold text-[#1A1A17]">inspection form</span> and <span className="font-semibold text-[#1A1A17]">Pass / Fail</span> sign-off on top of the standard checklist. Shown for the Quality Inspector (owner) and the Project Manager (read-only). Pass / Approve, Fail / Reject, and Raise Dispute open confirmation dialogs.</p>
        </header>

        <div className="flex flex-col gap-12">
          <FURoleFrame tag="State 1" title="Quality Inspector — owner, full controls" role="Quality Inspector" notify={notify} openModal={setModal} height={1220} />

          {/* modal trigger row — so reviewers can open dialogs without enabling Pass first */}
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#57564F] font-semibold mb-3">Confirmation dialogs (owner actions)</div>
            <div className="flex flex-wrap gap-2.5">
              <button className="inline-flex items-center gap-2 text-white font-semibold text-[14px] px-4 py-2.5 rounded-md" style={{ background: '#15803D' }} onClick={() => setModal('pass')}><Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Pass / Approve dialog</button>
              <button className="inline-flex items-center gap-2 bg-white border border-[#B91C1C]/40 text-[#B91C1C] hover:bg-[#FCECEC] font-semibold text-[14px] px-4 py-2.5 rounded-md" onClick={() => setModal('fail')}><Icon name="x" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Fail / Reject dialog</button>
              <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md" onClick={() => setModal('dispute')}><Icon name="disputes" className="w-[18px] h-[18px]" /> Raise Dispute dialog</button>
            </div>
            <p className="mt-2.5 text-[12px] text-[#84837C]">In-page, Pass / Fail stay disabled until the 2 remaining required checklist items are completed; these buttons preview the dialogs directly.</p>
          </div>

          <FURoleFrame tag="State 2" title="Project Manager — read-only, can comment & dispute" role="Project Manager" notify={notify} openModal={setModal} height={1180} />
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-lg border border-[#DEDEDA] bg-white p-5">
          <span className="w-9 h-9 rounded-md bg-[#E9F0FF] text-[#1D4ED8] grid place-items-center flex-none"><Icon name="eye" className="w-[18px] h-[18px]" /></span>
          <div>
            <h4 className="text-[14px] font-semibold text-[#1A1A17]">Project Manager on Fit-Up</h4>
            <p className="text-[13px] text-[#57564F] mt-0.5 leading-relaxed">Read-only on phase progress (no Pass / Fail / Save / upload, checklist + inspection form static), but retains <span className="font-mono text-[#1A1A17]">po.comment.create</span> and <span className="font-mono text-[#1A1A17]">po.dispute.create</span> — so the comment input and a <span className="font-semibold text-[#1A1A17]">Raise Dispute</span> button stay in the comments card.</p>
          </div>
        </div>
      </div>

      {modal === 'pass' && <PassModal onClose={() => setModal(null)} notify={notify} />}
      {modal === 'fail' && <FailModal onClose={() => setModal(null)} notify={notify} />}
      {modal === 'dispute' && <DisputeModal onClose={() => setModal(null)} notify={notify} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" /><span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FitUpPhasePage />);
