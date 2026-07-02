/* ============================================================
   BEAMLINE PHASE PAGE — Phase 2 of 5
   Story: LOCKED (predecessor incomplete) → IN PROGRESS
   Role states: PM (owner) · Planning Officer (read-only + dispute)
   ============================================================ */

const BL_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Rajesh Kumar',
};

const BL_CHECKLIST = [
  { t: 'Cut components received from Cutting phase', req: true },
  { t: 'Assembly drawings reviewed', req: true },
  { t: 'Components aligned per specification', req: true },
  { t: 'Beam structure dimensions verified', req: true },
  { t: 'Accuracy check completed before handoff', req: true },
];

const BL_DOCS = [
  { n: 'assembly-drawing-A3.pdf', t: 'Assembly Drawings', s: '2.1 MB', by: 'Rajesh Kumar', d: '12 Jun 2026', pdf: true },
];
const BL_DOC_TYPES = ['Assembly Drawings', 'Photos', 'Report', 'Other'];

const BL_PHASES_LOCKED = [
  { n: 1, name: 'Cutting',  status: 'In Progress' },
  { n: 2, name: 'Beamline', status: 'Pending', locked: true },
  { n: 3, name: 'Fit-Up',   status: 'Pending', locked: true },
  { n: 4, name: 'QC',       status: 'Pending', locked: true },
  { n: 5, name: 'Dispatch', status: 'Pending', locked: true },
];
const BL_PHASES_ACTIVE = [
  { n: 1, name: 'Cutting',  status: 'Completed' },
  { n: 2, name: 'Beamline', status: 'In Progress' },
  { n: 3, name: 'Fit-Up',   status: 'Pending', locked: true },
  { n: 4, name: 'QC',       status: 'Pending', locked: true },
  { n: 5, name: 'Dispatch', status: 'Pending', locked: true },
];

/* static (non-interactive) checklist row */
function BLCheckRow({ item, checked, by, date }) {
  return (
    <li className="flex items-start gap-3 py-3 border-b border-[#F0F0EE] last:border-0">
      <span className="flex-none mt-0.5">
        {checked
          ? <span className="w-[20px] h-[20px] rounded-full bg-[#15803D] grid place-items-center"><Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} /></span>
          : <span className="w-[20px] h-[20px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-[#1A1A17]">{item.t}{item.req && <span className="text-[#B91C1C] font-semibold"> *</span>}</div>
        {checked && by && <div className="text-[12px] text-[#84837C] mt-0.5 font-mono">Checked by {by} · {date}</div>}
      </div>
    </li>
  );
}

function BLDocRow({ doc }) {
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
      <button className="w-8 h-8 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE] flex-none" aria-label="Download"><Icon name="upload" className="w-[18px] h-[18px] rotate-180" /></button>
    </div>
  );
}

/* right column shared by locked + active (upload toggled by owner/locked) */
function BLRightColumn({ owner, locked, activePhaseN = 2, phases = PHASES }) {
  return (
    <div className={'flex flex-col gap-3' + (locked ? ' opacity-60' : '')}>
      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-[15px] font-semibold text-[#1A1A17]">Phase Documents</h3>
          <span className="text-[12px] font-mono text-[#84837C]">{BL_DOCS.length}</span>
        </div>
        {BL_DOCS.map((d, i) => <BLDocRow key={i} doc={d} />)}
        {owner && !locked && (
          <div className="mt-4 rounded-md border-2 border-dashed border-[#C9C9C3] bg-[#FAFAF8] p-3.5">
            <button className="w-full inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#84837C] font-medium text-[13px] px-3 py-2 rounded-md mb-2.5">
              <Icon name="paperclip" className="w-4 h-4 flex-none" /><span className="truncate">Choose file…</span>
            </button>
            <div className="flex items-center gap-2">
              <select className="flex-1 h-9 rounded-md border border-[#C9C9C3] text-[13px] pl-3 pr-8 bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#C2410C]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                {BL_DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button className="h-9 px-4 rounded-md bg-[#C2410C] hover:bg-[#9A330A] text-white text-[13px] font-semibold flex-none">Upload</button>
            </div>
            <div className="text-[11px] text-[#84837C] mt-2">PDF, JPG, PNG — max 20 MB</div>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
        <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">Phase info</h3>
        <p className="text-[13px] text-[#57564F] leading-relaxed mb-3">Assemble cut members on the beamline — align components, verify the beam structure dimensions, and run an accuracy check before handoff to QC.</p>
        <div className="grid grid-cols-2 gap-y-2 text-[13px]">
          <span className="text-[#84837C]">Phase order</span><span className="text-[#1A1A17] font-mono text-right">2 of 5</span>
          <span className="text-[#84837C]">Started</span><span className="text-[#1A1A17] font-mono text-right">{locked ? '—' : '13 Jun 2026'}</span>
          <span className="text-[#84837C]">Completed</span><span className="text-[#1A1A17] font-mono text-right">—</span>
          <span className="text-[#84837C]">Duration</span><span className="text-[#1A1A17] font-mono text-right">{locked ? '—' : '0 days'}</span>
        </div>
      </div>

      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
        <h3 className="text-[15px] font-semibold text-[#1A1A17] mb-2.5">All phases</h3>
        <ul className="flex flex-col gap-1.5">
          {phases.map((p) => (
            <li key={p.n} className={'flex items-center gap-2 px-2 py-1.5 rounded-md ' + (p.n === activePhaseN ? 'bg-[#F0F0EE]' : '')}>
              <span className="w-5 h-5 rounded-full grid place-items-center text-[11px] font-mono font-semibold flex-none" style={p.status === 'Completed' ? { background: '#15803D', color: '#fff' } : p.status === 'In Progress' ? { background: '#1D4ED8', color: '#fff' } : { background: '#F0F0EE', color: '#84837C' }}>{p.n}</span>
              <span className={'text-[13px] ' + (p.n === activePhaseN ? 'font-semibold text-[#1A1A17]' : 'text-[#1A1A17]')}>{p.name}</span>
              <span className="ml-auto"><PhasePill status={p.status} locked={p.locked} /></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---- LOCKED body (primary render) ---- */
function BeamlineLockedBody({ role, notify }) {
  const owner = role === 'Project Manager' || role === 'General Manager';
  const canComment = !['Finance Officer', 'Viewer'].includes(role);
  const canDispute = role === 'General Manager' || (!owner && canComment);

  return (
    <div className="p-5 overflow-y-auto h-full">
      {/* read-only banner (non-owner) */}
      {!owner && (
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
              <span className="w-9 h-9 rounded-full bg-[#F0F0EE] text-[#84837C] grid place-items-center text-[15px] font-mono font-semibold flex-none">2</span>
              <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">Beamline</h1>
              <PhasePill status="Pending" locked />
              <span className="text-[12px] font-mono text-[#84837C]">Phase 2 of 5</span>
            </div>
            <div className="text-[13px] text-[#57564F] mt-2 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
              <span className="font-medium text-[#1A1A17]">{BL_PROJECT.name}</span><span className="text-[#C9C9C3]">·</span>
              <span>{BL_PROJECT.client}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">{BL_PROJECT.po}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">Target {BL_PROJECT.target}</span><span className="text-[#C9C9C3]">·</span>
              <span>Assignee {BL_PROJECT.assignee}</span>
            </div>
          </div>

          {/* ghost Start Phase (owner only) — dimmed, explains via banner */}
          {owner && (
            <div className="flex flex-col items-end gap-1.5 flex-none">
              <button className="inline-flex items-center gap-2 bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed font-semibold text-[14px] px-4 py-2.5 rounded-md" disabled aria-disabled="true">
                <Icon name="lock" className="w-4 h-4" strokeWidth={2} /> Start Phase
              </button>
              <span className="text-[11px] font-mono text-[#84837C]">appears once Cutting completes</span>
            </div>
          )}
        </div>

        {/* lock banner */}
        <div className="mt-4 flex items-center gap-2.5 rounded-md px-4 py-3" style={{ background: '#FBF1DD', border: '1px solid #EBD9AE', borderLeft: '4px solid #B45309' }}>
          <Icon name="lock" className="w-[18px] h-[18px] flex-none" style={{ color: '#B45309' }} strokeWidth={2} />
          <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">This phase is locked until Cutting (Phase 1) is completed.</span></span>
        </div>
      </div>

      {/* two columns */}
      <div className="grid lg:grid-cols-[1.85fr_1fr] gap-3 items-start">
        {/* LEFT */}
        <div className="flex flex-col gap-3 min-w-0">
          {/* checklist (static, dimmed) */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)] opacity-60">
            <div className="flex items-center gap-2 mb-2.5">
              <h3 className="text-[16px] font-semibold text-[#1A1A17]">Checklist</h3>
              <span className="text-[12px] font-mono font-semibold rounded-full px-2 py-0.5" style={{ background: '#F0F0EE', color: '#4B5563' }}>0/5</span>
              <span className="ml-auto inline-flex items-center gap-1 text-[12px] font-mono text-[#84837C]"><Icon name="lock" className="w-3.5 h-3.5" strokeWidth={2} /> locked</span>
            </div>
            <div className="mb-3"><Progress done={0} total={5} /></div>
            <ul>{BL_CHECKLIST.map((c, i) => <BLCheckRow key={i} item={c} checked={false} />)}</ul>
          </div>

          {/* comments */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <h3 className="text-[16px] font-semibold text-[#1A1A17] mb-3">Comments &amp; activity</h3>
            <p className="text-[13px] text-[#84837C] bg-[#FAFAF8] border border-dashed border-[#DEDEDA] rounded-md px-3 py-2.5">No comments yet — the phase hasn't started.</p>
            {canComment ? (
              <div className="flex flex-col gap-2 mt-3">
                <textarea className="w-full min-h-[56px] rounded-md border border-[#C9C9C3] bg-white text-[14px] px-3 py-2.5 resize-y focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35" placeholder="Add a comment…" />
                <div className="flex items-center justify-between gap-2">
                  {canDispute && (
                    <button className="inline-flex items-center gap-1.5 bg-white border border-[#C9C9C3] hover:border-[#B45309] hover:text-[#B45309] text-[#57564F] font-semibold text-[12px] px-3 py-1.5 rounded-md" onClick={() => notify('Dispute raised')}>
                      <Icon name="disputes" className="w-3.5 h-3.5" /> Raise Dispute
                    </button>
                  )}
                  <button className="ml-auto inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2 rounded-md" onClick={() => notify('Comment posted')}>Post</button>
                </div>
              </div>
            ) : (
              <div className="text-[12px] font-mono text-[#84837C] bg-[#FAFAF8] border border-dashed border-[#DEDEDA] rounded-md px-3 py-2 mt-3">
                {role === 'Finance Officer' ? 'Finance Officer — financial view only, no comments' : 'Viewer — read-only, no comment access'}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT (no upload while locked) */}
        <BLRightColumn owner={owner} locked={true} activePhaseN={2} phases={BL_PHASES_LOCKED} />
      </div>
    </div>
  );
}

/* ---- IN-PROGRESS inset (after Cutting completes & Beamline starts) ---- */
function BeamlineActiveInset({ notify }) {
  const [checklist, setChecklist] = React.useState(
    BL_CHECKLIST.map((c, i) => ({ ...c, done: i === 0, by: i === 0 ? 'Rajesh Kumar' : undefined, date: i === 0 ? '13 Jun 2026' : undefined }))
  );
  const toggle = (i) => setChecklist((prev) => prev.map((it, idx) => idx === i ? { ...it, done: !it.done, by: !it.done ? 'Rajesh Kumar' : undefined, date: !it.done ? '13 Jun 2026' : undefined } : it));
  const doneCount = checklist.filter((c) => c.done).length;
  const reqLeft = checklist.filter((c) => c.req && !c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  return (
    <div className="bg-[#F4F4F2] p-5">
      {/* header */}
      <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 mb-3 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-9 h-9 rounded-full bg-[#1D4ED8] text-white grid place-items-center text-[15px] font-mono font-semibold flex-none">2</span>
              <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">Beamline</h1>
              <PhasePill status="In Progress" />
              <span className="text-[12px] font-mono text-[#84837C]">Phase 2 of 5</span>
            </div>
            <div className="text-[13px] text-[#57564F] mt-2 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
              <span className="font-medium text-[#1A1A17]">{BL_PROJECT.name}</span><span className="text-[#C9C9C3]">·</span>
              <span>{BL_PROJECT.client}</span><span className="text-[#C9C9C3]">·</span>
              <span className="font-mono">{BL_PROJECT.po}</span><span className="text-[#C9C9C3]">·</span>
              <span>Assignee {BL_PROJECT.assignee}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-none">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md" onClick={() => notify('Progress saved')}>Save Progress</button>
              <button className={'inline-flex items-center gap-2 font-semibold text-[14px] px-4 py-2.5 rounded-md ' + (reqLeft === 0 ? 'bg-[#C2410C] hover:bg-[#9A330A] text-white' : 'bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed')} disabled={reqLeft > 0} onClick={() => reqLeft === 0 && notify('Phase completed ✓')}>
                <Icon name="check" className="w-[18px] h-[18px]" strokeWidth={2.2} /> Complete Phase
              </button>
            </div>
            {reqLeft > 0 && <span className="text-[12px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.85fr_1fr] gap-3 items-start">
        <div className="flex flex-col gap-3 min-w-0">
          <div className="bg-white border border-[#DEDEDA] rounded-lg p-5 shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
            <div className="flex items-center gap-2 mb-2.5">
              <h3 className="text-[16px] font-semibold text-[#1A1A17]">Checklist</h3>
              <span className="text-[12px] font-mono font-semibold rounded-full px-2 py-0.5" style={{ background: '#F0F0EE', color: '#4B5563' }}>{doneCount}/5</span>
              <span className="ml-auto text-[12px] font-mono tabular-nums text-[#84837C]">{pct}%</span>
            </div>
            <div className="mb-3"><Progress done={doneCount} total={5} /></div>
            <ul>
              {checklist.map((c, i) => (
                <li key={i} className="flex items-start gap-3 py-3 border-b border-[#F0F0EE] last:border-0">
                  <button type="button" onClick={() => toggle(i)} aria-pressed={c.done} className="flex-none mt-0.5 cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#C2410C]/35 rounded-full">
                    {c.done
                      ? <span className="w-[20px] h-[20px] rounded-full bg-[#15803D] grid place-items-center"><Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} /></span>
                      : <span className="w-[20px] h-[20px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] text-[#1A1A17]">{c.t}<span className="text-[#B91C1C] font-semibold"> *</span></div>
                    {c.done && c.by && <div className="text-[12px] text-[#84837C] mt-0.5 font-mono">Checked by {c.by} · {c.date}</div>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-[#F0F0EE] text-[12px] text-[#57564F]"><span className="text-[#B91C1C] font-semibold">*</span> Required — must be checked before completing the phase.</div>
          </div>
        </div>
        <BLRightColumn owner={true} locked={false} activePhaseN={2} phases={BL_PHASES_ACTIVE} />
      </div>
    </div>
  );
}

/* ---- labelled role frame ---- */
function BLRoleFrame({ tag, title, role, notify, height = 800 }) {
  const access = ['Project Manager', 'General Manager'].includes(role) ? 'edit' : 'view';
  return (
    <section>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[12px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">{tag}</span>
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
            <FrameTopbar crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Beamline']} role={role} access={access} />
            <div className="flex-1 overflow-hidden"><BeamlineLockedBody role={role} notify={notify} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeamlinePhasePage() {
  const [toast, setToast] = React.useState(null);
  const timer = React.useRef(null);
  const notify = React.useCallback((m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 1900); }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A17]">
      <div className="max-w-[1180px] mx-auto px-8 py-12 pb-28">
        <header className="mb-10">
          <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#C2410C] font-semibold mb-2.5">Siteflow · Production · Phase 2</p>
          <h1 className="text-[26px] font-semibold tracking-tight mb-2">Beamline — phase page</h1>
          <p className="text-[16px] text-[#57564F] max-w-[68ch]">Phase 2 of 5 — all 8 roles shown in the <span className="font-semibold text-[#1A1A17]">locked state</span> (Cutting not yet complete). The <span className="font-semibold text-[#1A1A17]">locked → in-progress</span> transition is shown as an inset under GM and PM frames. Finance Officer and Viewer have no comment access.</p>
        </header>

        <div className="flex flex-col gap-12">
          {/* State 1 — GM, full access */}
          <div>
            <BLRoleFrame tag="State 1" title="General Manager — full access, all controls across all phases" role="General Manager" notify={notify} height={760} />
            <div className="mt-5 ml-0 lg:ml-8 relative">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="chevron" className="w-5 h-5 text-[#C2410C] rotate-180" strokeWidth={2.2} />
                <span className="font-mono text-[12px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">After Cutting completes</span>
                <span className="text-[14px] font-semibold text-[#1A1A17]">Beamline started — In Progress, 1/5 checked</span>
              </div>
              <div className="border border-[#C2410C]/40 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
                <BeamlineActiveInset notify={notify} />
              </div>
              <p className="mt-2.5 text-[12px] text-[#84837C] leading-relaxed flex items-start gap-2">
                <Icon name="info" className="w-4 h-4 text-[#84837C] flex-none mt-0.5" />
                <span>Lock banner gone; <span className="font-semibold text-[#1A1A17]">Start Phase</span> became <span className="font-semibold text-[#1A1A17]">Save Progress + Complete Phase</span>; checklist is now interactive with item 1 checked.</span>
              </p>
            </div>
          </div>

          {/* State 2 — PM owner, locked */}
          <div>
            <BLRoleFrame tag="State 2" title="Project Manager — owner, locked (can't start yet)" role="Project Manager" notify={notify} height={760} />
            <div className="mt-5 ml-0 lg:ml-8 relative">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="chevron" className="w-5 h-5 text-[#C2410C] rotate-180" strokeWidth={2.2} />
                <span className="font-mono text-[12px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">After Cutting completes</span>
                <span className="text-[14px] font-semibold text-[#1A1A17]">Beamline started — In Progress, 1/5 checked</span>
              </div>
              <div className="border border-[#C2410C]/40 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(26,26,23,0.05)]">
                <BeamlineActiveInset notify={notify} />
              </div>
              <p className="mt-2.5 text-[12px] text-[#84837C] leading-relaxed flex items-start gap-2">
                <Icon name="info" className="w-4 h-4 text-[#84837C] flex-none mt-0.5" />
                <span>Lock banner gone; <span className="font-semibold text-[#1A1A17]">Start Phase</span> became <span className="font-semibold text-[#1A1A17]">Save Progress + Complete Phase</span>; checklist is now interactive with item 1 checked. Toggle the rest to enable Complete Phase.</span>
              </p>
            </div>
          </div>

          <BLRoleFrame tag="State 3" title="Planning Officer — read-only, can comment + raise dispute" role="Planning Officer" notify={notify} height={760} />
          <BLRoleFrame tag="State 4" title="Quality Inspector — read-only, can comment" role="Quality Inspector" notify={notify} height={760} />
          <BLRoleFrame tag="State 5" title="Quality Head — read-only, can comment" role="Quality Head" notify={notify} height={760} />
          <BLRoleFrame tag="State 6" title="Finance Officer — read-only, no comment access" role="Finance Officer" notify={notify} height={720} />
          <BLRoleFrame tag="State 7" title="Dispatch In-charge — read-only, can comment" role="Dispatch In-charge" notify={notify} height={760} />
          <BLRoleFrame tag="State 8" title="Viewer — read-only, no comment or actions" role="Viewer" notify={notify} height={720} />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" /><span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BeamlinePhasePage />);
