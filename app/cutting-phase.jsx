/* ============================================================
   CUTTING PHASE PAGE — Phase 1 of 5
   ============================================================ */

const CUT_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Rajesh Kumar',
};

const CUT_CHECKLIST_INIT = [
  { t: 'Approved drawings received and reviewed',  req: true,  done: true,  by: 'Rajesh Kumar', date: '12 Jun 2026' },
  { t: 'Raw material dimensions verified',          req: true,  done: true,  by: 'Rajesh Kumar', date: '12 Jun 2026' },
  { t: 'Cutting equipment calibrated',              req: true,  done: false },
  { t: 'Cut pieces labelled and tagged',            req: true,  done: false },
  { t: 'Quality of cut edges inspected',            req: true,  done: false },
];

const CUT_DOCS = [
  { n: 'cutting-plan-v2.pdf',    t: 'Cutting Plan', s: '1.2 MB', by: 'Rajesh Kumar', d: '12 Jun 2026', pdf: true  },
  { n: 'raw-material-photo.jpg', t: 'Photo',        s: '820 KB', by: 'Rajesh Kumar', d: '12 Jun 2026', pdf: false },
];
const CUT_DOC_TYPES = ['Cutting Plan', 'Photos', 'Report', 'Other'];

const CUT_COMMENTS = [
  { who: 'Rajesh Kumar', role: 'Project Manager', text: 'Drawings updated to rev B — awaiting new cut schedule.', time: '11 Jun 2026 · 14:32' },
];

const CUT_PHASES = [
  { n: 1, name: 'Cutting',  status: 'In Progress' },
  { n: 2, name: 'Beamline', status: 'Pending', locked: true },
  { n: 3, name: 'Fit-Up',   status: 'Pending', locked: true },
  { n: 4, name: 'QC',       status: 'Pending', locked: true },
  { n: 5, name: 'Dispatch', status: 'Pending', locked: true },
];

const CUT_LIST = [
  ['B-101', 'ISMB 400 · E250',    '6000 mm',  '4',  'HT-99341', 'Band saw', <PTag tone="ok">Cut</PTag>],
  ['B-102', 'ISMB 400 · E250',    '4500 mm',  '2',  'HT-99341', 'Band saw', <PTag tone="ok">Cut</PTag>],
  ['PL-12', 'Plate 12mm · E250',  '300×300',  '8',  'HT-88120', 'Plasma',   <PTag tone="wait">Queued</PTag>],
  ['CL-05', 'Angle 75×75×6',      '220 mm',   '16', 'HT-88120', 'Shear',    <PTag tone="wait">Queued</PTag>],
];

const CUT_TRACE = [
  ['Heat No.',        'HT-99341'],
  ['Grade / Spec',    'IS 2062 E250'],
  ['Mill Test Cert',  'MTC-4471.pdf ↗'],
  ['Issued From Store','Rack C-14 · 2.4 T'],
  ['Offcut Returned', '0.31 T → Rack R-2'],
  ['Piece Marking',   'Hard stamp ✓'],
];

const CUT_ACTIVITY = [
  { who: 'S. Iyer',   action: 'cut part', detail: 'B-102 ×2', type: 'done',    time: '13 Jun · 11:20' },
  { who: 'S. Iyer',   action: 'cut part', detail: 'B-101 ×4', type: 'done',    time: '13 Jun · 09:05' },
  { who: 'R. Kumar',  action: 'uploaded', detail: 'cutting-plan-v2.pdf', type: 'upload', time: '12 Jun · 16:40' },
  { who: 'R. Kumar',  action: 'verified heat no. against', detail: 'MTC-4471', type: 'edit', time: '12 Jun · 14:10' },
  { who: 'Store',     action: 'issued material from', detail: 'Rack C-14 (2.4 T)', type: 'system', time: '10 Jun · 08:30' },
  { who: 'R. Kumar',  action: 'started the Cutting phase', type: 'start', time: '11 Jun · 08:00' },
];

function CuttingBody({ role, access, notify }) {
  const acc        = PHASE_ACCENT['Cutting'];
  const owner      = access === 'edit';
  const canComment = !['Finance Officer', 'Viewer'].includes(role);
  const canDispute = role === 'General Manager' || (!owner && canComment);

  const [checklist, setChecklist]     = React.useState(CUT_CHECKLIST_INIT);
  const [commentText, setCommentText] = React.useState('');

  const toggle = (i) => {
    if (!owner) return;
    setChecklist(prev => prev.map((it, idx) => {
      if (idx !== i) return it;
      const done = !it.done;
      return { ...it, done, by: done ? 'Rajesh Kumar' : undefined, date: done ? '13 Jun 2026' : undefined };
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
                style={{ background: acc.color }}>1</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-[22px] font-bold text-[#1A1A17] tracking-tight">Cutting</h1>
                  <PhasePill status="In Progress" />
                  <span className="text-[12px] font-mono text-[#84837C]">Phase 1 of 5</span>
                </div>
                <div className="text-[13px] text-[#57564F] flex flex-wrap gap-x-3 gap-y-0.5 items-center">
                  <span className="font-semibold text-[#1A1A17]">{CUT_PROJECT.name}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>{CUT_PROJECT.client}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span className="font-mono">{CUT_PROJECT.po}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>Target <span className="font-semibold font-mono">{CUT_PROJECT.target}</span></span>
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
            <PhaseStepper phases={CUT_PHASES} />
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

          {/* cut list */}
          <TableCard
            title="Cut List" count="6 parts" right="Yield 87% · Scrap 13%"
            cols={['Part Mark', 'Profile / Grade', 'Length', 'Qty', 'Heat No.', 'Method', 'Status']}
            rows={CUT_LIST}
          />

          {/* material traceability */}
          <FieldsCard title="Material Traceability" right="MTC linked" fields={CUT_TRACE} />

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
              {CUT_COMMENTS.map((c, i) => (
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
              <span className="text-[12px] font-mono font-semibold bg-[#F0F0EE] text-[#4B5563] px-2 py-0.5 rounded-full">{CUT_DOCS.length}</span>
            </div>
            <div className="p-4 flex flex-col gap-1">
              {CUT_DOCS.map((d, i) => (
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
                      {CUT_DOC_TYPES.map(t => <option key={t}>{t}</option>)}
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

          {/* machine & shift */}
          <InfoPanel title="Machine & Shift" rows={[
            ['Machine',  'Bandsaw BS-02'],
            ['Operator', 'S. Iyer'],
            ['Shift',    'A · 06–14'],
            ['Started',  '11 Jun'],
            ['Assignee', CUT_PROJECT.assignee],
          ]} />

          {/* phase info */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] p-5">
            <h3 className="text-[15px] font-bold text-[#1A1A17] mb-2">Phase Info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed">
              Cut primary members to length per the approved cutting plan. Verify material dimensions, calibrate equipment, then label and inspect each cut piece.
            </p>
          </div>

        </div>
      </div>

      {/* activity log */}
      <ActivityLog items={CUT_ACTIVITY} acc={acc} />
    </div>
  );
}

function CuttingPhasePage() {
  return (
    <PhaseShell
      crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Cutting']}
      ownerRoles={['Project Manager', 'General Manager']}
    >
      {(role, access, notify) => <CuttingBody role={role} access={access} notify={notify} />}
    </PhaseShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CuttingPhasePage />);
