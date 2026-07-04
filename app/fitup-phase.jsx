/* ============================================================
   FIT-UP PHASE PAGE — Phase 3 of 5
   ============================================================ */

const FU_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Kavya Nair',
};

const FU_CHECKLIST_INIT = [
  { t: 'Member identification verified',           req: true,  done: true,  by: 'Kavya Nair', date: '14 Jun 2026' },
  { t: 'Joint alignment within tolerance',         req: true,  done: true,  by: 'Kavya Nair', date: '14 Jun 2026' },
  { t: 'Root gap measurement recorded',            req: true,  done: true,  by: 'Kavya Nair', date: '14 Jun 2026' },
  { t: 'Bevels dressed and clean',                 req: true,  done: true,  by: 'Kavya Nair', date: '14 Jun 2026' },
  { t: 'Fit-up inspection form completed',         req: true,  done: false },
  { t: 'Fit-up approved for next phase',           req: true,  done: false },
];

const FU_DOCS = [
  { n: 'fitup-inspection-v1.pdf',  t: 'Inspection',  s: '740 KB', by: 'Kavya Nair', d: '14 Jun 2026', pdf: true  },
  { n: 'joint-photo-001.jpg',      t: 'Photo',       s: '950 KB', by: 'Kavya Nair', d: '14 Jun 2026', pdf: false },
];
const FU_DOC_TYPES = ['Inspection Report', 'Photo', 'Sketch', 'Other'];

const FU_COMMENTS = [
  { who: 'Kavya Nair',    role: 'Quality Inspector', text: 'Joint alignment confirmed on all 4 primary members. Root gap within ±0.5 mm tolerance.', time: '14 Jun 2026 · 10:20' },
  { who: 'Priya Sharma',  role: 'Project Manager',   text: 'Noted. Please complete the inspection form and submit for approval.', time: '14 Jun 2026 · 11:05' },
];

const FU_PHASES = [
  { n: 1, name: 'Cutting',  status: 'Completed' },
  { n: 2, name: 'Beamline', status: 'Completed' },
  { n: 3, name: 'Fit-Up',   status: 'In Progress' },
  { n: 4, name: 'QC',       status: 'Pending', locked: true },
  { n: 5, name: 'Dispatch', status: 'Pending', locked: true },
];

const FU_FITTINGS = [
  ['CL-05', 'End cleat',     '2', 'Both ends',  <PTag tone="ok">✓ Fitted</PTag>],
  ['ST-03', 'Web stiffener', '4', '@ 1.5m ctrs',<PTag tone="ok">✓ Fitted</PTag>],
  ['EP-01', 'End plate',     '1', 'Left end',   <PTag tone="wait">Fitting</PTag>],
];

const FU_SURVEY = [
  ['Overall Length', '6000 / +2 mm ✓'],
  ['Root Gap',       '3.5 mm (±0.5) ✓'],
  ['Joint Alignment','+0.2 mm ✓'],
  ['Squareness',     '1.0 mm ✓'],
  ['Diagonal Diff.', '2 mm ✓'],
  ['Camber',         '3 mm (spec 5) ✓'],
  ['Bevel Angle',    '35° ✓'],
  ['Root Face',      '1.5 mm ✓'],
  ['Tack Weld',      'Per WPS ✓'],
];

const FU_ACTIVITY = [
  { who: 'K. Nair',   action: 'recorded dimensional survey — all within tolerance', type: 'edit', time: '15 Jun · 10:20' },
  { who: 'K. Nair',   action: 'fitted', detail: 'ST-03 ×4 web stiffeners', type: 'done', time: '14 Jun · 15:10' },
  { who: 'K. Nair',   action: 'fitted', detail: 'CL-05 end cleats', type: 'done', time: '14 Jun · 13:45' },
  { who: 'P. Sharma', action: 'commented', note: 'Please complete the inspection form and submit for approval.', type: 'comment', time: '14 Jun · 11:05' },
  { who: 'K. Nair',   action: 'uploaded', detail: 'joint-photo-001.jpg', type: 'upload', time: '14 Jun · 10:25' },
  { who: 'System',    action: 'unlocked Fit-Up after Beamline completed', type: 'system', time: '14 Jun · 08:00' },
];

/* ── modals ── */
function PassModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[calc(100vw-32px)] overflow-hidden">
        <div className="h-1.5 bg-[#15803D]" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] grid place-items-center mb-4">
            <Icon name="check" className="w-6 h-6 text-[#15803D]" strokeWidth={2.5} />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1A17] mb-1">Approve Fit-Up</h2>
          <p className="text-[14px] text-[#57564F] mb-4 leading-relaxed">All items have been verified. This action confirms the fit-up is correct and ready to proceed to QC.</p>
          <textarea className="w-full rounded-xl border border-[#C9C9C3] text-[14px] px-4 py-3 min-h-[80px] resize-none focus:outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20" placeholder="Approval notes (optional)…" />
          <div className="flex gap-3 mt-4">
            <button className="flex-1 h-10 rounded-xl border border-[#DEDEDA] text-[14px] font-semibold text-[#57564F] hover:bg-[#FAFAF8]" onClick={onClose}>Cancel</button>
            <button className="flex-1 h-10 rounded-xl bg-[#15803D] text-white text-[14px] font-semibold hover:bg-[#166534]" onClick={onConfirm}>Confirm Approval</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FailModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[calc(100vw-32px)] overflow-hidden">
        <div className="h-1.5 bg-[#B91C1C]" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] grid place-items-center mb-4">
            <Icon name="x" className="w-6 h-6 text-[#B91C1C]" strokeWidth={2.5} />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1A17] mb-1">Reject Fit-Up</h2>
          <p className="text-[14px] text-[#57564F] mb-4 leading-relaxed">Describe the defects found. The Project Manager will be notified and the phase will be sent back for rework.</p>
          <textarea className="w-full rounded-xl border border-[#C9C9C3] text-[14px] px-4 py-3 min-h-[80px] resize-none focus:outline-none focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/20" placeholder="Describe the issue…" />
          <div className="flex gap-3 mt-4">
            <button className="flex-1 h-10 rounded-xl border border-[#DEDEDA] text-[14px] font-semibold text-[#57564F] hover:bg-[#FAFAF8]" onClick={onClose}>Cancel</button>
            <button className="flex-1 h-10 rounded-xl bg-[#B91C1C] text-white text-[14px] font-semibold hover:bg-[#991B1B]" onClick={onConfirm}>Confirm Rejection</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DisputeModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[calc(100vw-32px)] overflow-hidden">
        <div className="h-1.5 bg-[#B45309]" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-[#FBF1DD] grid place-items-center mb-4">
            <Icon name="disputes" className="w-6 h-6 text-[#B45309]" strokeWidth={2} />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1A17] mb-1">Raise Dispute</h2>
          <p className="text-[14px] text-[#57564F] mb-4 leading-relaxed">Disputes are escalated to the General Manager for resolution. Please provide a clear description.</p>
          <textarea className="w-full rounded-xl border border-[#C9C9C3] text-[14px] px-4 py-3 min-h-[80px] resize-none focus:outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20" placeholder="Describe the dispute…" />
          <div className="flex gap-3 mt-4">
            <button className="flex-1 h-10 rounded-xl border border-[#DEDEDA] text-[14px] font-semibold text-[#57564F] hover:bg-[#FAFAF8]" onClick={onClose}>Cancel</button>
            <button className="flex-1 h-10 rounded-xl bg-[#B45309] text-white text-[14px] font-semibold hover:bg-[#92400E]" onClick={onConfirm}>Submit Dispute</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const fuIpt = 'w-full h-9 rounded-lg border border-[#C9C9C3] px-3 text-[13px] focus:outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20 bg-white';

function InspectionForm({ owner, acc }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: acc.bg, color: acc.color }}>
          <Icon name="quality" className="w-4.5 h-4.5" strokeWidth={2} />
        </div>
        <h3 className="text-[15px] font-bold text-[#1A1A17]">Inspection Form</h3>
        {!owner && <span className="ml-auto text-[11px] font-mono text-[#84837C] bg-[#F0F0EE] px-2 py-0.5 rounded-full">read-only</span>}
      </div>
      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          ['Overall Length (mm)',  '6000 / +2'],
          ['Root Gap (mm)',        '3.5'],
          ['Joint Alignment (mm)', '+0.2'],
          ['Squareness (mm)',      '1.0'],
          ['Diagonal Diff. (mm)',  '2'],
          ['Camber (mm)',          '3 (spec 5)'],
          ['Bevel Angle (°)',      '35'],
          ['Root Face (mm)',       '1.5'],
          ['Tack Weld',            'Per WPS'],
        ].map(([label, ph]) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#57564F]">{label}</label>
            <input type="text" defaultValue={owner ? '' : ph} placeholder={ph} disabled={!owner}
              className={fuIpt + (owner ? '' : ' bg-[#FAFAF8] text-[#84837C] cursor-not-allowed')} />
          </div>
        ))}
        <div className="col-span-2 sm:col-span-3 flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#57564F]">Inspector Notes</label>
          <textarea placeholder="Additional observations…" disabled={!owner} rows={3}
            className={'w-full rounded-lg border border-[#C9C9C3] px-3 py-2 text-[13px] resize-none focus:outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20' +
              (owner ? ' bg-white' : ' bg-[#FAFAF8] text-[#84837C] cursor-not-allowed')} />
        </div>
        {owner && (
          <div className="col-span-2 sm:col-span-3">
            <button className="h-9 px-5 rounded-lg text-white text-[13px] font-semibold hover:opacity-90"
              style={{ background: acc.color }}>
              Save Inspection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FitUpBody({ role, access, notify }) {
  const acc        = PHASE_ACCENT['Fit-Up'];
  const owner      = access === 'edit';
  const canComment = !['Finance Officer', 'Viewer'].includes(role);
  const canDispute = role === 'General Manager' || (!owner && canComment);

  const [checklist, setChecklist]     = React.useState(FU_CHECKLIST_INIT);
  const [commentText, setCommentText] = React.useState('');
  const [modal, setModal]             = React.useState(null); // 'pass' | 'fail' | 'dispute'

  const toggle = (i) => {
    if (!owner) return;
    setChecklist(prev => prev.map((it, idx) => {
      if (idx !== i) return it;
      const done = !it.done;
      return { ...it, done, by: done ? 'Kavya Nair' : undefined, date: done ? '15 Jun 2026' : undefined };
    }));
  };

  const doneCount = checklist.filter(c => c.done).length;
  const reqLeft   = checklist.filter(c => c.req && !c.done).length;
  const pct       = Math.round(doneCount / checklist.length * 100);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-6 pb-12">

      {/* ── Phase Hero ── */}
      <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_2px_12px_rgba(26,26,23,0.07)] overflow-hidden mb-5">
        <div className="h-1.5" style={{ background: acc.color }} />
        <div className="p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-2xl grid place-items-center flex-none text-white text-[22px] font-bold font-mono shadow-sm"
                style={{ background: acc.color }}>3</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-[22px] font-bold text-[#1A1A17] tracking-tight">Fit-Up</h1>
                  <PhasePill status="In Progress" />
                  <span className="text-[12px] font-mono text-[#84837C]">Phase 3 of 5</span>
                </div>
                <div className="text-[13px] text-[#57564F] flex flex-wrap gap-x-3 gap-y-0.5 items-center">
                  <span className="font-semibold text-[#1A1A17]">{FU_PROJECT.name}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>{FU_PROJECT.client}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span className="font-mono">{FU_PROJECT.po}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>Target <span className="font-semibold font-mono">{FU_PROJECT.target}</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-5 flex-none">
              <div className="text-center">
                <div className="text-[32px] font-bold font-mono leading-none" style={{ color: acc.color }}>{pct}%</div>
                <div className="text-[11px] font-mono text-[#84837C] mt-1">{doneCount}/{checklist.length} tasks</div>
              </div>
              {owner && (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      className={'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-all border ' +
                        (reqLeft === 0 ? 'border-[#B91C1C] text-[#B91C1C] hover:bg-[#FEE2E2]' : 'border-[#DEDEDA] text-[#84837C] cursor-not-allowed opacity-60')}
                      disabled={reqLeft > 0}
                      onClick={() => reqLeft === 0 && setModal('fail')}
                    >
                      <Icon name="x" className="w-4 h-4" strokeWidth={2.2} /> Reject
                    </button>
                    <button
                      className={'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-all ' +
                        (reqLeft === 0 ? 'text-white shadow-sm hover:opacity-90' : 'text-[#84837C] bg-[#FAFAF8] border border-[#DEDEDA] cursor-not-allowed opacity-60')}
                      style={reqLeft === 0 ? { background: acc.color } : {}}
                      disabled={reqLeft > 0}
                      onClick={() => reqLeft === 0 && setModal('pass')}
                    >
                      <Icon name="check" className="w-4 h-4" strokeWidth={2.2} /> Approve
                    </button>
                  </div>
                  {reqLeft > 0 && <span className="text-[11px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-[#F0F0EE]">
            <PhaseStepper phases={FU_PHASES} />
          </div>
        </div>
      </div>

      {/* ── read-only banner ── */}
      {!owner && (
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 border"
          style={{ background: '#EFF6FF', borderColor: '#BFDBFE', borderLeft: '4px solid #1D4ED8' }}>
          <Icon name="eye" className="w-5 h-5 flex-none text-[#1D4ED8]" />
          <span className="text-[13px] text-[#1A1A17]">
            <span className="font-semibold">Read-only</span> — {role} can{canComment ? ' comment' : "'t comment"}{canDispute ? ' and raise disputes' : ''} but cannot edit this phase.
          </span>
        </div>
      )}

      {/* ── two-column layout ── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">

        {/* LEFT */}
        <div className="flex flex-col gap-5">

          {/* fitting BOM */}
          <TableCard
            title="Fitting Assembly (BOM)" count="4 items"
            cols={['Fitting Mark', 'Type', 'Qty', 'Position', 'Fitted']}
            rows={FU_FITTINGS}
          />

          {/* checklist */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-3">
              <h3 className="text-[15px] font-bold text-[#1A1A17]">Checklist</h3>
              <span className="text-[12px] font-mono font-semibold rounded-full px-2.5 py-0.5"
                style={doneCount === checklist.length ? { background: '#DCFCE7', color: '#15803D' } : { background: '#F0F0EE', color: '#4B5563' }}>
                {doneCount}/{checklist.length}
              </span>
              <div className="flex-1" />
              <span className="text-[13px] font-bold font-mono" style={{ color: acc.color }}>{pct}%</span>
            </div>
            <div className="px-5 pt-3 pb-2">
              <Progress done={doneCount} total={checklist.length} tone={acc.color} />
            </div>
            <ul className="px-5 pb-2">
              {checklist.map((c, i) => (
                <li key={i}
                  className="flex items-start gap-3 py-3 px-3 -mx-3 rounded-xl transition-colors"
                  style={c.done ? { background: '#F0FDF4' } : {}}>
                  <button type="button"
                    className={'flex-none mt-0.5 ' + (owner ? 'cursor-pointer' : 'cursor-default')}
                    onClick={() => toggle(i)} disabled={!owner}>
                    {c.done
                      ? <span className="w-[22px] h-[22px] rounded-full bg-[#15803D] grid place-items-center">
                          <Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} />
                        </span>
                      : <span className="w-[22px] h-[22px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className={'text-[14px] ' + (c.done ? 'text-[#57564F] line-through' : 'text-[#1A1A17] font-medium')}>
                      {c.t}{c.req && !c.done && <span className="text-[#B91C1C] font-bold"> *</span>}
                    </div>
                    {c.done && c.by && (
                      <div className="text-[11.5px] text-[#15803D] mt-0.5 font-mono flex items-center gap-1">
                        <Icon name="check" className="w-3 h-3" strokeWidth={2.5} />
                        {c.by} · {c.date}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {owner && (
              <div className="px-5 pb-4 pt-1 text-[11.5px] text-[#84837C] border-t border-[#F0F0EE] mt-1">
                <span className="text-[#B91C1C] font-bold">*</span> Required — must be checked before approving.
              </div>
            )}
          </div>

          {/* inspection form */}
          <InspectionForm owner={owner} acc={acc} />

          {/* comments */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE]">
              <h3 className="text-[15px] font-bold text-[#1A1A17]">Comments</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {FU_COMMENTS.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-bold font-mono flex-none text-white"
                    style={{ background: acc.color }}>
                    {c.who.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                  <div className="flex-1 min-w-0 bg-[#FAFAF8] rounded-xl px-4 py-3 border border-[#F0F0EE]">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-[13px] font-semibold text-[#1A1A17]">{c.who}</span>
                      <span className="text-[11px] rounded-full px-2 py-0.5 font-medium bg-[#F0F0EE] text-[#57564F]">{c.role}</span>
                      <span className="text-[11px] font-mono text-[#84837C] ml-auto">{c.time}</span>
                    </div>
                    <p className="text-[14px] text-[#1A1A17] leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}

              {canComment ? (
                <div className="flex flex-col gap-2.5">
                  <textarea
                    className="w-full min-h-[80px] rounded-xl border border-[#C9C9C3] bg-white text-[14px] px-4 py-3 resize-y focus:outline-none"
                    placeholder="Add a comment…"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onFocus={e => { e.target.style.borderColor = acc.color; e.target.style.boxShadow = `0 0 0 3px ${acc.ring}`; }}
                    onBlur={e => { e.target.style.borderColor = '#C9C9C3'; e.target.style.boxShadow = 'none'; }}
                  />
                  <div className="flex items-center gap-2">
                    {canDispute && (
                      <button
                        className="inline-flex items-center gap-1.5 border border-[#C9C9C3] hover:border-[#B45309] hover:text-[#B45309] text-[#57564F] font-semibold text-[13px] px-3.5 py-2 rounded-lg transition-colors"
                        onClick={() => setModal('dispute')}
                      >
                        <Icon name="disputes" className="w-3.5 h-3.5" /> Raise Dispute
                      </button>
                    )}
                    <button
                      className="ml-auto px-5 py-2 rounded-lg font-semibold text-[13px] text-white hover:opacity-90"
                      style={{ background: acc.color }}
                      onClick={() => { if (commentText.trim()) { notify('Comment posted'); setCommentText(''); } }}
                    >Post</button>
                  </div>
                </div>
              ) : (
                <div className="text-[12px] font-mono text-[#84837C] bg-[#FAFAF8] border border-dashed border-[#DEDEDA] rounded-xl px-4 py-3 text-center">
                  {role === 'Finance Officer' ? 'Finance Officer — financial view only, commenting not available' : 'Viewer — read-only access'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">

          {/* documents */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#1A1A17]">Documents</h3>
              <span className="text-[12px] font-mono font-semibold bg-[#F0F0EE] text-[#4B5563] px-2 py-0.5 rounded-full">{FU_DOCS.length}</span>
            </div>
            <div className="p-4 flex flex-col gap-1">
              {FU_DOCS.map((d, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-[#FAFAF8] transition-colors">
                  <span className={'w-10 h-10 rounded-xl grid place-items-center flex-none ' + (d.pdf ? 'bg-[#FCECEC] text-[#B91C1C]' : 'bg-[#E9F0FF] text-[#1D4ED8]')}>
                    <Icon name={d.pdf ? 'pdf' : 'image'} className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-semibold font-mono text-[#1A1A17] truncate">{d.n}</span>
                      <span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex-none bg-[#F0F0EE] text-[#57564F]">{d.t}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#84837C] mt-0.5">{d.s} · {d.by} · {d.d}</div>
                  </div>
                  <button className="w-8 h-8 rounded-lg grid place-items-center text-[#57564F] hover:bg-[#F0F0EE] flex-none">
                    <Icon name="upload" className="w-[18px] h-[18px] rotate-180" />
                  </button>
                </div>
              ))}
            </div>
            {owner && (
              <div className="px-4 pb-4">
                <div className="rounded-xl border-2 border-dashed border-[#DEDEDA] bg-[#FAFAF8] p-4">
                  <div className="flex flex-col items-center mb-3">
                    <div className="w-10 h-10 rounded-xl grid place-items-center mb-1.5" style={{ background: acc.bg, color: acc.color }}>
                      <Icon name="upload" className="w-5 h-5" />
                    </div>
                    <p className="text-[12px] text-[#84837C]">PDF, JPG, PNG — max 20 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <select className="flex-1 h-9 rounded-lg border border-[#C9C9C3] text-[13px] pl-3 pr-8 bg-white appearance-none focus:outline-none"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                      {FU_DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <button
                      className="h-9 px-4 rounded-lg text-white text-[13px] font-semibold flex-none hover:opacity-90"
                      style={{ background: acc.color }}
                      onClick={() => notify('Uploading…')}
                    >Upload</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* weld reference */}
          <InfoPanel title="Weld Reference" rows={[
            ['WPS',        'WPS-2026-04'],
            ['Joint type', 'Butt · full pen'],
            ['Process',    'SMAW / FCAW'],
            ['Welder ID',  'W-118'],
            ['Inspector',  'K. Nair (QI)'],
          ]} />

          {/* phase info */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] p-5">
            <h3 className="text-[15px] font-bold text-[#1A1A17] mb-2">Phase Info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed">
              Verify joint alignment, root gap, and bevel condition per specification. Complete the inspection form, then approve or reject the fit-up for welding.
            </p>
          </div>

        </div>
      </div>

      {/* activity log */}
      <ActivityLog items={FU_ACTIVITY} acc={acc} />

      {modal === 'pass'    && <PassModal    onClose={() => setModal(null)} onConfirm={() => { notify('Fit-Up approved!'); setModal(null); }} />}
      {modal === 'fail'    && <FailModal    onClose={() => setModal(null)} onConfirm={() => { notify('Rejection submitted'); setModal(null); }} />}
      {modal === 'dispute' && <DisputeModal onClose={() => setModal(null)} onConfirm={() => { notify('Dispute raised'); setModal(null); }} />}
    </div>
  );
}

function FitUpPhasePage() {
  return (
    <PhaseShell
      crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Fit-Up']}
      ownerRoles={['Quality Inspector', 'General Manager']}
    >
      {(role, access, notify) => <FitUpBody role={role} access={access} notify={notify} />}
    </PhaseShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FitUpPhasePage />);
