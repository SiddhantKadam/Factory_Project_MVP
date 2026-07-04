/* ============================================================
   BEAMLINE PHASE PAGE — Phase 2 of 5
   ============================================================ */

const BL_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Priya Sharma',
};

const BL_CHECKLIST_INIT = [
  { t: 'Beamline machine setup verified',         req: true,  done: true,  by: 'Priya Sharma', date: '13 Jun 2026' },
  { t: 'Member alignment checked on jig',         req: true,  done: false },
  { t: 'Weld parameters set per WPS',             req: true,  done: false },
  { t: 'Tack welds completed and inspected',      req: true,  done: false },
  { t: 'Full weld run completed',                 req: true,  done: false },
  { t: 'Post-weld visual inspection done',        req: false, done: false },
];

const BL_DOCS = [
  { n: 'WPS-2026-04.pdf',          t: 'WPS',          s: '890 KB', by: 'Priya Sharma', d: '13 Jun 2026', pdf: true  },
  { n: 'beamline-setup-photo.jpg', t: 'Setup Photo',  s: '1.1 MB', by: 'Priya Sharma', d: '13 Jun 2026', pdf: false },
];
const BL_DOC_TYPES = ['WPS', 'Setup Photo', 'Report', 'Weld Map', 'Other'];

const BL_COMMENTS = [
  { who: 'Priya Sharma',  role: 'Project Manager',   text: 'Machine calibration completed. Awaiting WPS sign-off before full run.', time: '13 Jun 2026 · 09:15' },
  { who: 'Arun Menon',    role: 'Planning Officer',   text: 'WPS-2026-04 reviewed and approved. Proceed when ready.', time: '13 Jun 2026 · 11:42' },
];

const BL_PHASES = [
  { n: 1, name: 'Cutting',  status: 'Completed' },
  { n: 2, name: 'Beamline', status: 'In Progress' },
  { n: 3, name: 'Fit-Up',   status: 'Pending', locked: true },
  { n: 4, name: 'QC',       status: 'Pending', locked: true },
  { n: 5, name: 'Dispatch', status: 'Pending', locked: true },
];

const BL_OPS = [
  ['B-101', '22Ø × 12', <PTag tone="ok">Both ends</PTag>, <PTag tone="ok">Done</PTag>,    <PTag tone="ok">Complete</PTag>],
  ['B-102', '22Ø × 8',  <PTag tone="ok">1 end</PTag>,     <PTag tone="wait">In prog</PTag>, <PTag tone="wait">60%</PTag>],
  ['C-201', '18Ø × 6',  '—',                              <PTag tone="wait">Queued</PTag>,  <PTag tone="wait">0%</PTag>],
];

const BL_SETUP = [
  ['CNC Program',    'NC1 · B101.nc1'],
  ['Drill Bit Ø',    '22 mm HSS'],
  ['Hole Pos. Tol.', '± 0.5 mm'],
  ['Datum / Ref Edge','Left, top flange'],
  ['Layout Method',  'Auto-scribe'],
  ['Machine',        'Beamline BL-01'],
];

const BL_ACTIVITY = [
  { who: 'P. Sharma', action: 'completed all operations on', detail: 'B-101', type: 'done', time: '14 Jun · 10:30' },
  { who: 'P. Sharma', action: 'started coping on', detail: 'B-102', type: 'edit', time: '14 Jun · 09:15' },
  { who: 'A. Menon',  action: 'approved', detail: 'WPS-2026-04', note: 'Reviewed and cleared for full run.', type: 'approve', time: '13 Jun · 11:42' },
  { who: 'P. Sharma', action: 'loaded CNC program & set datum', type: 'edit', time: '13 Jun · 09:40' },
  { who: 'P. Sharma', action: 'verified beamline machine setup', type: 'edit', time: '13 Jun · 09:10' },
  { who: 'System',    action: 'unlocked Beamline after Cutting completed', type: 'system', time: '13 Jun · 08:00' },
];

function BeamlineBody({ role, access, notify }) {
  const acc        = PHASE_ACCENT['Beamline'];
  const owner      = access === 'edit';
  const canComment = !['Finance Officer', 'Viewer'].includes(role);
  const canDispute = role === 'General Manager' || (!owner && canComment);

  const [checklist, setChecklist]     = React.useState(BL_CHECKLIST_INIT);
  const [commentText, setCommentText] = React.useState('');

  const toggle = (i) => {
    if (!owner) return;
    setChecklist(prev => prev.map((it, idx) => {
      if (idx !== i) return it;
      const done = !it.done;
      return { ...it, done, by: done ? 'Priya Sharma' : undefined, date: done ? '14 Jun 2026' : undefined };
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
                style={{ background: acc.color }}>2</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-[22px] font-bold text-[#1A1A17] tracking-tight">Beamline</h1>
                  <PhasePill status="In Progress" />
                  <span className="text-[12px] font-mono text-[#84837C]">Phase 2 of 5</span>
                </div>
                <div className="text-[13px] text-[#57564F] flex flex-wrap gap-x-3 gap-y-0.5 items-center">
                  <span className="font-semibold text-[#1A1A17]">{BL_PROJECT.name}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>{BL_PROJECT.client}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span className="font-mono">{BL_PROJECT.po}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>Target <span className="font-semibold font-mono">{BL_PROJECT.target}</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-5 flex-none">
              <div className="text-center">
                <div className="text-[32px] font-bold font-mono leading-none" style={{ color: acc.color }}>{pct}%</div>
                <div className="text-[11px] font-mono text-[#84837C] mt-1">{doneCount}/{checklist.length} tasks</div>
              </div>
              {owner && (
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    className={'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[14px] transition-all ' +
                      (reqLeft === 0 ? 'text-white shadow-sm hover:opacity-90' : 'text-[#84837C] bg-[#FAFAF8] border border-[#DEDEDA] cursor-not-allowed opacity-60')}
                    style={reqLeft === 0 ? { background: acc.color } : {}}
                    disabled={reqLeft > 0}
                    onClick={() => reqLeft === 0 && notify('Phase marked complete!')}
                  >
                    <Icon name="check" className="w-4 h-4" strokeWidth={2.2} />
                    Complete Phase
                  </button>
                  {reqLeft > 0 && <span className="text-[11px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-[#F0F0EE]">
            <PhaseStepper phases={BL_PHASES} />
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

          {/* machining operations */}
          <TableCard
            title="Machining Operations" count="per member"
            cols={['Part Mark', 'Holes (Ø×n)', 'Cope', 'Layout Mark', 'Progress']}
            rows={BL_OPS}
          />

          {/* line setup */}
          <FieldsCard title="Line Setup & Verification" fields={BL_SETUP} />

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
                  <button
                    type="button"
                    className={'flex-none mt-0.5 ' + (owner ? 'cursor-pointer' : 'cursor-default')}
                    onClick={() => toggle(i)}
                    disabled={!owner}
                  >
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
                <span className="text-[#B91C1C] font-bold">*</span> Required — must be checked before completing the phase.
              </div>
            )}
          </div>

          {/* comments */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE]">
              <h3 className="text-[15px] font-bold text-[#1A1A17]">Comments</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {BL_COMMENTS.map((c, i) => (
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
                        onClick={() => notify('Dispute raised')}
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
              <span className="text-[12px] font-mono font-semibold bg-[#F0F0EE] text-[#4B5563] px-2 py-0.5 rounded-full">{BL_DOCS.length}</span>
            </div>
            <div className="p-4 flex flex-col gap-1">
              {BL_DOCS.map((d, i) => (
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
                      {BL_DOC_TYPES.map(t => <option key={t}>{t}</option>)}
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

          {/* phase info */}
          <InfoPanel title="Phase Info" rows={[
            ['Phase',    '2 of 5'],
            ['Started',  '13 Jun'],
            ['Members',  '1 / 3 done'],
            ['Operator', BL_PROJECT.assignee],
          ]} />

        </div>
      </div>

      {/* activity log */}
      <ActivityLog items={BL_ACTIVITY} acc={acc} />
    </div>
  );
}

function BeamlinePhasePage() {
  return (
    <PhaseShell
      crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Beamline']}
      ownerRoles={['Project Manager', 'General Manager']}
    >
      {(role, access, notify) => <BeamlineBody role={role} access={access} notify={notify} />}
    </PhaseShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BeamlinePhasePage />);
