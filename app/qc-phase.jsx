/* ============================================================
   QC (PAINTING & FINISHING) PHASE — Phase 4 of 5
   ============================================================ */

const QC_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Suresh Pillai',
};

const QC_CHECKLIST_INIT = [
  { t: 'Surface preparation (blasting) verified',  req: true,  done: true,  by: 'Suresh Pillai', date: '15 Jun 2026' },
  { t: 'Primer coat applied and dried',             req: true,  done: true,  by: 'Suresh Pillai', date: '15 Jun 2026' },
  { t: 'DFT readings within spec (all zones)',      req: true,  done: true,  by: 'Suresh Pillai', date: '16 Jun 2026' },
  { t: 'Top coat applied and cured',                req: true,  done: true,  by: 'Suresh Pillai', date: '16 Jun 2026' },
  { t: 'Final visual inspection — no defects',      req: true,  done: true,  by: 'Suresh Pillai', date: '16 Jun 2026' },
  { t: 'QC certificate signed',                     req: true,  done: false },
];

const QC_DOCS = [
  { n: 'dft-readings-sheet.pdf',  t: 'DFT Report',  s: '1.0 MB', by: 'Suresh Pillai', d: '16 Jun 2026', pdf: true  },
  { n: 'surface-prep-photo.jpg',  t: 'Photo',       s: '1.4 MB', by: 'Suresh Pillai', d: '15 Jun 2026', pdf: false },
  { n: 'qc-certificate-v1.pdf',   t: 'Certificate', s: '600 KB', by: 'Suresh Pillai', d: '16 Jun 2026', pdf: true  },
];
const QC_DOC_TYPES = ['DFT Report', 'Photo', 'Certificate', 'Other'];

const QC_COMMENTS = [
  { who: 'Suresh Pillai',   role: 'Quality Head',       text: 'All DFT readings within 80–120 µm range. Surface finish is uniform — ready for final certificate sign-off.', time: '16 Jun 2026 · 14:00' },
  { who: 'Ramesh Gupta',    role: 'Dispatch In-charge',  text: 'Acknowledged. Will prepare dispatch checklist once QC certificate is signed.', time: '16 Jun 2026 · 15:30' },
];

const QC_PHASES = [
  { n: 1, name: 'Cutting',  status: 'Completed' },
  { n: 2, name: 'Beamline', status: 'Completed' },
  { n: 3, name: 'Fit-Up',   status: 'Completed' },
  { n: 4, name: 'QC',       status: 'In Progress' },
  { n: 5, name: 'Dispatch', status: 'Pending', locked: true },
];

const QC_DFT = [
  { zone: 'Zone A — Web',          prep: 'Sa 2.5', primer: 82, topcoat: 118 },
  { zone: 'Zone B — Top Flange',   prep: 'Sa 2.5', primer: 85, topcoat: 112 },
  { zone: 'Zone C — Bot Flange',   prep: 'Sa 2.5', primer: 80, topcoat: 115 },
  { zone: 'Zone D — Stiffeners',   prep: 'Sa 2.5', primer: 88, topcoat: 110 },
];

const QC_NDT = [
  ['W-01', 'Visual + UT', '100%', <PTag tone="ok">Accept</PTag>,          '—'],
  ['W-02', 'MPI',         '100%', <PTag tone="ok">Accept</PTag>,          '—'],
  ['W-03', 'UT',          '20%',  <PTag tone="no">Reject → repaired</PTag>,'NCR-07 closed'],
  ['W-04', 'DPI',         '100%', <PTag tone="wait">Pending</PTag>,        '—'],
];

const QC_ITP = [
  ['Dimensional Report', 'DR-018.pdf ✓'],
  ['TPI Witness (Lloyd’s)', 'Witnessed 16 Jun ✓'],
  ['QC Certificate', 'Pending sign ✎'],
];

const QC_ACTIVITY = [
  { who: 'S. Pillai',  action: 'issued final dimensional report', detail: 'DR-018', type: 'edit', time: '16 Jun · 14:00' },
  { who: 'Lloyd’s TPI', action: 'witnessed ITP hold point', type: 'approve', time: '16 Jun · 12:30' },
  { who: 'S. Pillai',  action: 'recorded DFT readings — all zones in spec', type: 'edit', time: '16 Jun · 11:15' },
  { who: 'S. Pillai',  action: 'closed', detail: 'NCR-07', note: 'W-03 re-inspected after repair — accepted.', type: 'done', time: '15 Jun · 16:20' },
  { who: 'S. Pillai',  action: 'raised', detail: 'NCR-07', note: 'UT on W-03 found porosity — sent for repair.', type: 'alert', time: '15 Jun · 10:40' },
  { who: 'System',     action: 'unlocked QC after Fit-Up completed', type: 'system', time: '15 Jun · 08:00' },
];

/* ── modals ── */
function ApproveQCModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[calc(100vw-32px)] overflow-hidden">
        <div className="h-1.5 bg-[#7E22CE]" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-[#F5F3FF] grid place-items-center mb-4">
            <Icon name="check" className="w-6 h-6 text-[#7E22CE]" strokeWidth={2.5} />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1A17] mb-1">Approve QC</h2>
          <p className="text-[14px] text-[#57564F] mb-4 leading-relaxed">Approving will mark QC as complete and unlock the Dispatch phase. Ensure the QC certificate is signed before confirming.</p>
          <textarea className="w-full rounded-xl border border-[#C9C9C3] text-[14px] px-4 py-3 min-h-[80px] resize-none focus:outline-none focus:border-[#7E22CE] focus:ring-2 focus:ring-[#7E22CE]/20" placeholder="QC approval notes (optional)…" />
          <div className="flex gap-3 mt-4">
            <button className="flex-1 h-10 rounded-xl border border-[#DEDEDA] text-[14px] font-semibold text-[#57564F] hover:bg-[#FAFAF8]" onClick={onClose}>Cancel</button>
            <button className="flex-1 h-10 rounded-xl bg-[#7E22CE] text-white text-[14px] font-semibold hover:bg-[#6B21A8]" onClick={onConfirm}>Approve QC</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QCIssueModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[calc(100vw-32px)] overflow-hidden">
        <div className="h-1.5 bg-[#B91C1C]" />
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] grid place-items-center mb-4">
            <Icon name="x" className="w-6 h-6 text-[#B91C1C]" strokeWidth={2.5} />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1A17] mb-1">Raise Quality Issue</h2>
          <p className="text-[14px] text-[#57564F] mb-4 leading-relaxed">Describe the quality defect found. The phase will be flagged and the project team will be notified for rework.</p>
          <textarea className="w-full rounded-xl border border-[#C9C9C3] text-[14px] px-4 py-3 min-h-[80px] resize-none focus:outline-none focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/20" placeholder="Describe the quality issue…" />
          <div className="flex gap-3 mt-4">
            <button className="flex-1 h-10 rounded-xl border border-[#DEDEDA] text-[14px] font-semibold text-[#57564F] hover:bg-[#FAFAF8]" onClick={onClose}>Cancel</button>
            <button className="flex-1 h-10 rounded-xl bg-[#B91C1C] text-white text-[14px] font-semibold hover:bg-[#991B1B]" onClick={onConfirm}>Submit Issue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QCBody({ role, access, notify }) {
  const acc        = PHASE_ACCENT['QC'];
  const owner      = access === 'edit';
  const canComment = !['Finance Officer', 'Viewer'].includes(role);
  const canDispute = role === 'General Manager' || (!owner && canComment);

  const [checklist, setChecklist]     = React.useState(QC_CHECKLIST_INIT);
  const [commentText, setCommentText] = React.useState('');
  const [modal, setModal]             = React.useState(null);

  const toggle = (i) => {
    if (!owner) return;
    setChecklist(prev => prev.map((it, idx) => {
      if (idx !== i) return it;
      const done = !it.done;
      return { ...it, done, by: done ? 'Suresh Pillai' : undefined, date: done ? '16 Jun 2026' : undefined };
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
                style={{ background: acc.color }}>4</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-[22px] font-bold text-[#1A1A17] tracking-tight">QC — Painting & Finishing</h1>
                  <PhasePill status="In Progress" />
                  <span className="text-[12px] font-mono text-[#84837C]">Phase 4 of 5</span>
                </div>
                <div className="text-[13px] text-[#57564F] flex flex-wrap gap-x-3 gap-y-0.5 items-center">
                  <span className="font-semibold text-[#1A1A17]">{QC_PROJECT.name}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>{QC_PROJECT.client}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span className="font-mono">{QC_PROJECT.po}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>Target <span className="font-semibold font-mono">{QC_PROJECT.target}</span></span>
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
                      className={'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13px] border border-[#B91C1C] text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors'}
                      onClick={() => setModal('issue')}
                    >
                      <Icon name="x" className="w-4 h-4" strokeWidth={2.2} /> Raise Issue
                    </button>
                    <button
                      className={'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-all ' +
                        (reqLeft === 0 ? 'text-white shadow-sm hover:opacity-90' : 'text-[#84837C] bg-[#FAFAF8] border border-[#DEDEDA] cursor-not-allowed opacity-60')}
                      style={reqLeft === 0 ? { background: acc.color } : {}}
                      disabled={reqLeft > 0}
                      onClick={() => reqLeft === 0 && setModal('approve')}
                    >
                      <Icon name="check" className="w-4 h-4" strokeWidth={2.2} /> Approve QC
                    </button>
                  </div>
                  {reqLeft > 0 && <span className="text-[11px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-[#F0F0EE]">
            <PhaseStepper phases={QC_PHASES} />
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

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">

        {/* LEFT */}
        <div className="flex flex-col gap-5">

          {/* NDT & weld inspection log */}
          <TableCard
            title="NDT & Weld Inspection Log" count="4 welds" right="0 defects open"
            cols={['Weld ID', 'Method', 'Extent', 'Result', 'NCR']}
            rows={QC_NDT}
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
                <span className="text-[#B91C1C] font-bold">*</span> Required — must be checked before approving QC.
              </div>
            )}
          </div>

          {/* DFT readings */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: acc.bg, color: acc.color }}>
                <Icon name="quality" className="w-4 h-4" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-bold text-[#1A1A17]">DFT Readings</h3>
              <span className="ml-auto text-[11px] font-semibold rounded-full px-2.5 py-0.5 bg-[#DCFCE7] text-[#15803D]">All within spec</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-x-4 gap-y-0 text-[12px] font-semibold text-[#84837C] border-b border-[#F0F0EE] pb-2 mb-2">
                <span>Zone</span>
                <span className="text-center">Surface Prep</span>
                <span className="text-center">Primer (µm)</span>
                <span className="text-center">Top Coat (µm)</span>
              </div>
              {QC_DFT.map((r, i) => (
                <div key={i} className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-x-4 py-2 border-b border-[#F0F0EE] last:border-0 text-[13px]">
                  <span className="text-[#57564F]">{r.zone}</span>
                  <span className="text-center font-mono text-[#57564F]">{r.prep}</span>
                  <span className="text-center font-mono font-semibold text-[#1A1A17]">{r.primer}</span>
                  <span className="text-center font-mono font-semibold text-[#1A1A17]">{r.topcoat}</span>
                </div>
              ))}
              <p className="text-[11.5px] text-[#84837C] font-mono mt-3">Spec: Primer 75–95 µm · Top coat 100–130 µm · Blast Sa 2.5</p>
            </div>
          </div>

          {/* ITP sign-off */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-3">
              <h3 className="text-[15px] font-bold text-[#1A1A17]">ITP Sign-off</h3>
              <span className="ml-auto text-[12px] font-mono text-[#84837C]">Hold / Witness / Review</span>
            </div>
            <div className="p-5">
              <div className="grid sm:grid-cols-3 gap-4">
                {QC_ITP.map(([label, value], i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[#84837C]">{label}</span>
                    <div className="border border-[#DEDEDA] bg-[#FAFAF8] rounded-lg px-3 py-2 text-[13px] font-mono text-[#1A1A17]">{value}</div>
                  </div>
                ))}
              </div>
              {owner && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="inline-flex items-center gap-1.5 border border-[#B91C1C] text-[#B91C1C] hover:bg-[#FEE2E2] font-semibold text-[13px] px-3.5 py-2 rounded-lg transition-colors"
                    onClick={() => setModal('issue')}>
                    <Icon name="disputes" className="w-3.5 h-3.5" /> Raise NCR
                  </button>
                  <button className={'ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-[13px] transition-all ' +
                    (reqLeft === 0 ? 'text-white hover:opacity-90' : 'text-[#84837C] bg-[#FAFAF8] border border-[#DEDEDA] cursor-not-allowed opacity-60')}
                    style={reqLeft === 0 ? { background: acc.color } : {}}
                    disabled={reqLeft > 0}
                    onClick={() => reqLeft === 0 && setModal('approve')}>
                    <Icon name="check" className="w-4 h-4" strokeWidth={2.2} /> Approve QC → unlock Dispatch
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* comments */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE]">
              <h3 className="text-[15px] font-bold text-[#1A1A17]">Comments</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {QC_COMMENTS.map((c, i) => (
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
              <span className="text-[12px] font-mono font-semibold bg-[#F0F0EE] text-[#4B5563] px-2 py-0.5 rounded-full">{QC_DOCS.length}</span>
            </div>
            <div className="p-4 flex flex-col gap-1">
              {QC_DOCS.map((d, i) => (
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
                      {QC_DOC_TYPES.map(t => <option key={t}>{t}</option>)}
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

          {/* inspection & TPI */}
          <InfoPanel title="Inspection & TPI" rows={[
            ['ITP',         'ITP-2026-018'],
            ['TPI agency',  'Lloyd’s'],
            ['Open NCRs',   '0'],
            ['Closed NCRs', '1 (NCR-07)'],
            ['QC Head',     QC_PROJECT.assignee],
          ]} />

          {/* phase info */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] p-5">
            <h3 className="text-[15px] font-bold text-[#1A1A17] mb-2">Phase Info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed">
              Complete weld NDT, verify surface prep and DFT across all zones, close any NCRs, then sign the QC certificate with TPI witness to unlock Dispatch.
            </p>
          </div>

        </div>
      </div>

      {/* activity log */}
      <ActivityLog items={QC_ACTIVITY} acc={acc} />

      {modal === 'approve'  && <ApproveQCModal  onClose={() => setModal(null)} onConfirm={() => { notify('QC approved!'); setModal(null); }} />}
      {modal === 'issue'    && <QCIssueModal    onClose={() => setModal(null)} onConfirm={() => { notify('Quality issue raised'); setModal(null); }} />}
    </div>
  );
}

function QCPhasePage() {
  return (
    <PhaseShell
      crumb={['Home', 'Projects', 'PROJ-2026-0018', 'QC']}
      ownerRoles={['Quality Head', 'General Manager']}
    >
      {(role, access, notify) => <QCBody role={role} access={access} notify={notify} />}
    </PhaseShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<QCPhasePage />);
