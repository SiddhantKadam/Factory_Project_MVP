/* ============================================================
   QC (PAINTING & FINISHING) PHASE — Phase 4 of 5
   Roles: Quality Head (owner) · Dispatch In-charge (read-only)
   Dialogs: Approve QC · Raise Quality Issue
   ============================================================ */

const QC_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Meera Joshi',
};

const QC_CHECKLIST_INIT = [
  { t: 'Surface preparation inspected',          req: true, done: true,  by: 'Meera Joshi', date: '13 Jun 2026' },
  { t: 'Primer coat applied and dried',          req: true, done: true,  by: 'Meera Joshi', date: '13 Jun 2026' },
  { t: 'Paint thickness verified (DFT check)',   req: true, done: true,  by: 'Meera Joshi', date: '13 Jun 2026' },
  { t: 'Finishing quality meets spec',           req: true, done: true,  by: 'Meera Joshi', date: '13 Jun 2026' },
  { t: 'QC report completed and signed off',     req: true, done: true,  by: 'Meera Joshi', date: '13 Jun 2026' },
  { t: 'Project marked ready for dispatch',      req: true, done: false },
];

const QC_DOCS = [
  { n: 'qc-report-final.pdf',    t: 'QC Report', s: '2.4 MB', by: 'Meera Joshi', d: '13 Jun 2026', pdf: true },
  { n: 'paint-dft-readings.jpg', t: 'Photo',     s: '680 KB', by: 'Meera Joshi', d: '13 Jun 2026', pdf: false },
];
const QC_DOC_TYPES = ['QC Report', 'Photos', 'Other'];

const QC_COMMENTS = [
  { who: 'Meera Joshi', role: 'Quality Head', text: 'DFT readings all within spec (avg 142µm). Final sign-off pending dispatch readiness.', time: '13 Jun 2026 · 15:40' },
];

const qcIpt = 'w-full rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 py-2.5 focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35';
const qcSelStyle = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' };

function QCModal({ children, onClose, max = '460px' }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A17]/40" onClick={onClose}></div>
      <div className="relative w-full bg-white rounded-xl border border-[#DEDEDA] shadow-[0_20px_50px_rgba(26,26,23,0.25)] overflow-hidden po-rise" style={{ maxWidth: max }}>{children}</div>
    </div>
  );
}

/* Approve QC */
function ApproveQCModal({ onClose, notify }) {
  const [notes, setNotes] = React.useState('');
  const missing = !notes.trim();
  return (
    <QCModal onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: '#E6F6EC', color: '#15803D' }}><Icon name="quality" className="w-6 h-6" strokeWidth={1.8} /></span>
          <div><h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">Approve QC Sign-Off</h3>
            <p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">Confirm that painting, finishing, and all quality checks have passed. Approving will mark Phase 4 complete and unlock Phase 5 (Dispatch).</p></div>
        </div>
        <div className="mt-4">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[#84837C] font-mono mb-1.5">QC sign-off notes · required</div>
          <textarea className={qcIpt + ' min-h-[80px] resize-y'} placeholder="Confirm final quality approval…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA] flex items-center justify-end gap-2.5">
        <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
        <button className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (missing ? 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed' : 'bg-[#15803D] hover:bg-[#11652F] text-white')} disabled={missing} onClick={() => { notify('QC approved ✓ — Dispatch unlocked'); onClose(); }}><Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Approve QC</button>
      </div>
    </QCModal>
  );
}

/* Raise Quality Issue */
function RaiseIssueModal({ onClose, notify }) {
  const [desc, setDesc] = React.useState('');
  const missing = !desc.trim();
  return (
    <QCModal onClose={onClose} max="500px">
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          <span className="w-11 h-11 rounded-full grid place-items-center flex-none" style={{ background: '#FCEEE4', color: '#C2410C' }}><Icon name="disputes" className="w-6 h-6" strokeWidth={1.9} /></span>
          <div><h3 className="text-[18px] font-semibold text-[#1A1A17] leading-tight">Raise Quality Issue</h3>
            <p className="text-[13px] text-[#57564F] mt-1.5 leading-relaxed">Flag a quality problem found during painting &amp; finishing.</p></div>
        </div>
        <div className="mt-4 flex flex-col gap-3.5">
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Issue Type</label>
            <select className={qcIpt + ' pr-9 appearance-none cursor-pointer'} style={qcSelStyle}>
              <option>Paint thickness failure</option><option>Surface defect</option><option>Finishing not to spec</option><option>DFT check failed</option><option>Documentation missing</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Description <span className="text-[#C2410C]">*</span></label>
            <textarea className={qcIpt + ' min-h-[80px] resize-y'} placeholder="Describe the quality issue in detail…" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Severity</label>
            <select className={qcIpt + ' pr-9 appearance-none cursor-pointer'} style={qcSelStyle}><option>Minor</option><option>Major</option><option>Critical</option></select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A17] block mb-1.5">Attach evidence <span className="text-[#84837C] font-normal">(optional)</span></label>
            <button className="w-full inline-flex items-center gap-2 rounded-md border border-dashed border-[#C9C9C3] bg-[#FAFAF8] text-[#84837C] text-[13px] px-3 py-2.5 hover:border-[#84837C]"><Icon name="paperclip" className="w-4 h-4" /> Choose file…</button>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#DEDEDA]">
        <div className="flex items-center justify-end gap-2.5">
          <button className="px-4 py-2.5 rounded-md border border-[#C9C9C3] bg-white hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px]" onClick={onClose}>Cancel</button>
          <button className={'px-4 py-2.5 rounded-md font-semibold text-[14px] inline-flex items-center gap-2 ' + (missing ? 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed' : 'bg-[#C2410C] hover:bg-[#9A330A] text-white')} disabled={missing} onClick={() => { notify('Quality issue raised'); onClose(); }}><Icon name="disputes" className="w-[18px] h-[18px]" /> Raise Issue</button>
        </div>
        <p className="text-[12px] text-[#84837C] mt-2.5 text-right">A quality issue will pause phase progress until resolved by the Quality Head.</p>
      </div>
    </QCModal>
  );
}

function QCDocRow({ doc }) {
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

/* related phases highlighting QC→Dispatch */
function QCRelatedPhases() {
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
      <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">All phases</h3>
      <ul className="flex flex-col gap-1.5">
        {PHASES.map((p) => (
          <li key={p.n} className={'flex items-center gap-2 px-2 py-1.5 rounded-md ' + (p.n === 4 ? 'bg-[#E9F0FF]' : '')}>
            <span className="w-5 h-5 rounded-full grid place-items-center text-[11px] font-mono font-semibold flex-none" style={p.status === 'Completed' ? { background: '#15803D', color: '#fff' } : p.n === 4 ? { background: '#1D4ED8', color: '#fff' } : { background: '#F0F0EE', color: '#84837C' }}>{p.n}</span>
            <span className={'text-[13px] ' + (p.n === 4 ? 'font-semibold text-[#1D4ED8]' : 'text-[#1A1A17]')}>{p.name}</span>
            <span className="ml-auto">{p.n === 4 ? <PhasePill status="In Progress" /> : p.n === 5 ? <PhasePill status="Pending" locked /> : <PhasePill status={p.status} locked={p.locked} />}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-[#F0F0EE] flex items-start gap-2 text-[12px] text-[#57564F]">
        <Icon name="lock" className="w-3.5 h-3.5 text-[#84837C] flex-none mt-0.5" strokeWidth={2} />
        <span>Dispatch will unlock once QC is approved.</span>
      </div>
    </div>
  );
}

function QCBody({ role, notify, openModal }) {
  const owner = role === 'Quality Head';
  const dispatch = role === 'Dispatch In-charge';
  const [checklist, setChecklist] = React.useState(QC_CHECKLIST_INIT);
  const toggle = (i) => { if (!owner) return; setChecklist((p) => p.map((it, idx) => idx === i ? { ...it, done: !it.done, by: !it.done ? 'Meera Joshi' : undefined, date: !it.done ? '13 Jun 2026' : undefined } : it)); };
  const doneCount = checklist.filter((c) => c.done).length;
  const reqLeft = checklist.filter((c) => c.req && !c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  return (
    <div className="p-5 overflow-y-auto h-full">
      {!owner && (
        <div className="flex items-start gap-2.5 rounded-md px-3.5 py-2.5 mb-3" style={{ background: '#E9F0FF', border: '1px solid #C7D9FF', borderLeft: '4px solid #1D4ED8' }}>
          <Icon name="eye" className="w-[18px] h-[18px] flex-none mt-px" style={{ color: '#1D4ED8' }} />
          <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">You're viewing this phase in read-only mode.</span> Dispatch (Phase 5) will unlock when QC is approved.</span>
        </div>
      )}

      {/* header */}
      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 mb-3 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-9 h-9 rounded-full bg-[#1D4ED8] text-white grid place-items-center text-[15px] font-mono font-semibold flex-none">4</span>
              <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">QC <span className="text-[#57564F] font-medium text-[18px]">· Painting &amp; Finishing</span></h1>
              <PhasePill status="In Progress" />
              <span className="text-[12px] font-mono text-[#84837C]">Phase 4 of 5</span>
            </div>
            <div className="text-[13px] text-[#57564F] mt-2 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
              <span className="font-medium text-[#1A1A17]">{QC_PROJECT.name}</span><span className="text-[#C9C9C3]">·</span>
              <span>{QC_PROJECT.client}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">{QC_PROJECT.po}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">Target {QC_PROJECT.target}</span><span className="text-[#C9C9C3]">·</span>
              <span>Assignee {QC_PROJECT.assignee}</span>
            </div>
          </div>

          {owner && (
            <div className="flex flex-col items-end gap-1.5 flex-none">
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[13px] px-3.5 py-2 rounded-md" onClick={() => notify('Progress saved')}>Save Progress</button>
                <button className="inline-flex items-center gap-2 bg-white border border-[#C2410C]/50 text-[#C2410C] hover:bg-[#FCEEE4] font-semibold text-[13px] px-3.5 py-2 rounded-md" onClick={() => openModal('issue')}><Icon name="disputes" className="w-4 h-4" /> Raise Issue</button>
                <button className={'inline-flex items-center gap-2 font-semibold text-[13px] px-3.5 py-2 rounded-md ' + (reqLeft === 0 ? 'text-white' : 'cursor-not-allowed')} style={reqLeft === 0 ? { background: '#15803D' } : { background: '#E6F6EC', color: '#8FB89C' }} disabled={reqLeft > 0} onClick={() => reqLeft === 0 && openModal('approve')}><Icon name="check" className="w-4 h-4" strokeWidth={2.2} /> Approve QC</button>
              </div>
              {reqLeft > 0 && <span className="text-[12px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>}
            </div>
          )}
        </div>
      </div>

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

          {/* comments */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[16px] font-semibold text-[#1A1A17] mb-3">Comments &amp; activity</h3>
            <ol className="flex flex-col gap-3 mb-4">
              {QC_COMMENTS.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#3C3A33] text-white grid place-items-center text-[11px] font-semibold font-mono flex-none">{c.who.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><span className="text-[13px] font-semibold text-[#1A1A17]">{c.who}</span><span className="text-[11px] text-[#84837C]">{c.role}</span><span className="text-[11px] font-mono text-[#84837C]">· {c.time}</span></div>
                    <p className="text-[14px] text-[#1A1A17] mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-2">
              <textarea className="w-full min-h-[64px] rounded-md border border-[#C9C9C3] bg-white text-[14px] px-3 py-2.5 resize-y focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35" placeholder="Add a comment…" />
              <div className="flex items-center justify-between gap-2">
                {dispatch ? (
                  <button className="inline-flex items-center gap-1.5 bg-white border border-[#C9C9C3] hover:border-[#B45309] hover:text-[#B45309] text-[#57564F] font-semibold text-[13px] px-3 py-2 rounded-md" onClick={() => openModal('issue')}><Icon name="disputes" className="w-4 h-4" /> Raise Dispute</button>
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
            <div className="flex items-center gap-2 mb-3"><h3 className="text-[15px] font-semibold text-[#1A1A17]">Phase Documents</h3><span className="text-[12px] font-mono text-[#84837C]">{QC_DOCS.length}</span></div>
            {QC_DOCS.map((d, i) => <QCDocRow key={i} doc={d} />)}
            {owner && (
              <div className="mt-4 rounded-md border-2 border-dashed border-[#C9C9C3] bg-[#FAFAF8] p-3.5">
                <button className="w-full inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#84837C] font-medium text-[13px] px-3 py-2 rounded-md mb-2.5"><Icon name="paperclip" className="w-4 h-4 flex-none" /><span className="truncate">Choose file…</span></button>
                <div className="flex items-center gap-2">
                  <select className="flex-1 h-9 rounded-md border border-[#C9C9C3] text-[13px] pl-3 pr-8 bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#C2410C]" style={qcSelStyle}>{QC_DOC_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                  <button className="h-9 px-4 rounded-md bg-[#C2410C] hover:bg-[#9A330A] text-white text-[13px] font-semibold flex-none">Upload</button>
                </div>
                <div className="text-[11px] text-[#84837C] mt-2">PDF, JPG, PNG — max 20 MB</div>
              </div>
            )}
          </div>

          {/* phase info */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Phase info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed mb-3">Surface prep, primer and finish coats, DFT verification and final QC sign-off before the project is released to dispatch.</p>
            <div className="grid grid-cols-2 gap-y-2 text-[13px]">
              <span className="text-[#84837C]">Phase order</span><span className="text-[#1A1A17] font-mono text-right">4 of 5</span>
              <span className="text-[#84837C]">Started</span><span className="text-[#1A1A17] font-mono text-right">13 Jun 2026</span>
              <span className="text-[#84837C]">Completed</span><span className="text-[#1A1A17] font-mono text-right">—</span>
              <span className="text-[#84837C]">Duration</span><span className="text-[#1A1A17] font-mono text-right">1 day</span>
            </div>
          </div>

          {/* related phases — QC → Dispatch */}
          <QCRelatedPhases />
        </div>
      </div>
    </div>
  );
}

function QCRoleFrame({ tag, title, role, notify, openModal, height = 1120 }) {
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
            <FrameTopbar crumb={['Home', 'Projects', 'PROJ-2026-0018', 'QC (Painting & Finishing)']} role={role} />
            <div className="flex-1 overflow-hidden"><QCBody role={role} notify={notify} openModal={openModal} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QCPhasePage() {
  const [toast, setToast] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const timer = React.useRef(null);
  const notify = React.useCallback((m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 1900); }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A17]">
      <div className="max-w-[1180px] mx-auto px-8 py-12 pb-28">
        <header className="mb-10">
          <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#C2410C] font-semibold mb-2.5">Siteflow · Production · Phase 4</p>
          <h1 className="text-[26px] font-semibold tracking-tight mb-2">QC — Painting &amp; Finishing</h1>
          <p className="text-[16px] text-[#57564F] max-w-[68ch]">Phase 4 of 5 — the Quality Head's final sign-off before dispatch. Shown for the Quality Head (owner) and the Dispatch In-charge (read-only, watching for the unlock). Approve QC and Raise Quality Issue open confirmation dialogs.</p>
        </header>

        <div className="flex flex-col gap-12">
          <QCRoleFrame tag="State 1" title="Quality Head — owner, final sign-off" role="Quality Head" notify={notify} openModal={setModal} height={1080} />

          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#57564F] font-semibold mb-3">Confirmation dialogs (owner actions)</div>
            <div className="flex flex-wrap gap-2.5">
              <button className="inline-flex items-center gap-2 text-white font-semibold text-[14px] px-4 py-2.5 rounded-md" style={{ background: '#15803D' }} onClick={() => setModal('approve')}><Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Approve QC dialog</button>
              <button className="inline-flex items-center gap-2 bg-white border border-[#C2410C]/50 text-[#C2410C] hover:bg-[#FCEEE4] font-semibold text-[14px] px-4 py-2.5 rounded-md" onClick={() => setModal('issue')}><Icon name="disputes" className="w-[18px] h-[18px]" /> Raise Quality Issue dialog</button>
            </div>
            <p className="mt-2.5 text-[12px] text-[#84837C]">In-page, Approve QC stays disabled until the last required item ("Project marked ready for dispatch") is checked; this button previews the dialog directly.</p>
          </div>

          <QCRoleFrame tag="State 2" title="Dispatch In-charge — read-only, awaiting unlock" role="Dispatch In-charge" notify={notify} openModal={setModal} height={1120} />
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-lg border border-[#DEDEDA] bg-white p-5">
          <span className="w-9 h-9 rounded-md bg-[#E9F0FF] text-[#1D4ED8] grid place-items-center flex-none"><Icon name="dispatch" className="w-[18px] h-[18px]" /></span>
          <div>
            <h4 className="text-[14px] font-semibold text-[#1A1A17]">Dispatch In-charge on QC</h4>
            <p className="text-[13px] text-[#57564F] mt-0.5 leading-relaxed">They own the next phase, so this read-only view is a <span className="font-semibold text-[#1A1A17]">watch state</span> — the banner spells out that Dispatch unlocks on QC approval, and the Related Phases card shows Phase 5 locked. They keep <span className="font-mono text-[#1A1A17]">po.comment.create</span> and <span className="font-mono text-[#1A1A17]">po.dispute.create</span> (comment input + Raise Dispute), but no QC controls.</p>
          </div>
        </div>
      </div>

      {modal === 'approve' && <ApproveQCModal onClose={() => setModal(null)} notify={notify} />}
      {modal === 'issue' && <RaiseIssueModal onClose={() => setModal(null)} notify={notify} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" /><span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<QCPhasePage />);
