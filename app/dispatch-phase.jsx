/* ============================================================
   DISPATCH PHASE PAGE — Phase 5 of 5
   ============================================================ */

const DS_PROJECT = {
  name: 'Structural Beams — Bay 4',
  client: 'Acme Infrastructure Ltd.',
  po: 'PO-2026-0042',
  target: '30 Jun 2026',
  assignee: 'Ramesh Gupta',
};

const DS_CHECKLIST_INIT = [
  { t: 'QC sign-off received',                   req: true,  done: true,  by: 'Ramesh Gupta', date: '16 Jun 2026' },
  { t: 'Delivery note prepared and signed',       req: true,  done: true,  by: 'Ramesh Gupta', date: '17 Jun 2026' },
  { t: 'Vehicle assigned and loaded',             req: true,  done: false },
  { t: 'Client notified of dispatch',             req: false, done: false },
];

const DS_DOCS = [
  { n: 'delivery-note-DN-0042.pdf', t: 'Delivery Note', s: '450 KB', by: 'Ramesh Gupta', d: '17 Jun 2026', pdf: true  },
  { n: 'packing-photos.jpg',        t: 'Photos',        s: '2.1 MB', by: 'Ramesh Gupta', d: '17 Jun 2026', pdf: false },
];
const DS_DOC_TYPES = ['Delivery Note', 'Photos', 'Invoice', 'Other'];

const DS_COMMENTS = [
  { who: 'Ramesh Gupta',   role: 'Dispatch In-charge', text: 'Delivery note DN-0042 signed. Vehicle TN-35-AB-1234 assigned. Awaiting loading completion.', time: '17 Jun 2026 · 08:45' },
  { who: 'Priya Sharma',   role: 'Project Manager',    text: 'Client has been informed. Delivery scheduled for 18 Jun 2026 morning.', time: '17 Jun 2026 · 10:20' },
];

const DS_PHASES = [
  { n: 1, name: 'Cutting',  status: 'Completed' },
  { n: 2, name: 'Beamline', status: 'Completed' },
  { n: 3, name: 'Fit-Up',   status: 'Completed' },
  { n: 4, name: 'QC',       status: 'Completed' },
  { n: 5, name: 'Dispatch', status: 'In Progress' },
];

const DS_RECON = [
  ['B-101', '4',  '4',  '4',  <PTag tone="ok">✓ Match</PTag>],
  ['B-102', '2',  '2',  '2',  <PTag tone="ok">✓ Match</PTag>],
  ['ST-03', '4',  '4',  '3',  <PTag tone="wait">1 pending</PTag>],
  ['CL-05', '16', '16', '16', <PTag tone="ok">✓ Match</PTag>],
];

const DS_ACTIVITY = [
  { who: 'R. Gupta',  action: 'loaded', detail: 'B-101, B-102, CL-05', note: 'ST-03 — 1 pc still in finishing.', type: 'edit', time: '17 Jun · 12:15' },
  { who: 'P. Sharma', action: 'notified client of dispatch schedule', type: 'comment', time: '17 Jun · 10:20' },
  { who: 'R. Gupta',  action: 'generated', detail: 'e-way bill EWB-88213047', type: 'upload', time: '17 Jun · 09:30' },
  { who: 'R. Gupta',  action: 'prepared', detail: 'delivery note DN-0042', type: 'edit', time: '17 Jun · 08:45' },
  { who: 'S. Pillai', action: 'released QC certificate to dispatch', type: 'approve', time: '16 Jun · 17:00' },
  { who: 'System',    action: 'unlocked Dispatch after QC completed', type: 'system', time: '16 Jun · 17:00' },
];

/* ── confirm dispatch modal ── */
function ConfirmDispatchModal({ onClose, onConfirm }) {
  const [form, setForm] = React.useState({ deliveryNote: 'DN-0042', vehicleNo: 'TN-35-AB-1234', deliveryDate: '2026-06-18', notes: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const acc = PHASE_ACCENT['Dispatch'];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[440px] max-w-[calc(100vw-32px)] overflow-hidden">
        <div className="h-1.5" style={{ background: acc.color }} />
        <div className="p-6">
          <div className="w-12 h-12 rounded-full grid place-items-center mb-4" style={{ background: acc.bg, color: acc.color }}>
            <Icon name="dispatch" className="w-6 h-6" strokeWidth={1.8} />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1A17] mb-1">Confirm Dispatch</h2>
          <p className="text-[14px] text-[#57564F] mb-5 leading-relaxed">This will mark the project as dispatched and close all production phases. Please verify the delivery details below.</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              ['Delivery Note', 'deliveryNote', form.deliveryNote],
              ['Vehicle No.',   'vehicleNo',    form.vehicleNo],
            ].map(([label, key, val]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#57564F]">{label}</label>
                <input type="text" value={val} onChange={e => set(key, e.target.value)}
                  className="h-9 rounded-lg border border-[#C9C9C3] px-3 text-[13px] focus:outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/20" />
              </div>
            ))}
          </div>
          <div className="mb-3">
            <label className="text-[12px] font-semibold text-[#57564F] block mb-1">Delivery Date</label>
            <input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)}
              className="w-full h-9 rounded-lg border border-[#C9C9C3] px-3 text-[13px] focus:outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/20" />
          </div>
          <div className="mb-5">
            <label className="text-[12px] font-semibold text-[#57564F] block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full rounded-lg border border-[#C9C9C3] px-3 py-2 text-[13px] resize-none focus:outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/20"
              placeholder="Any delivery instructions…" />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-10 rounded-xl border border-[#DEDEDA] text-[14px] font-semibold text-[#57564F] hover:bg-[#FAFAF8]" onClick={onClose}>Cancel</button>
            <button className="flex-1 h-10 rounded-xl text-white text-[14px] font-semibold hover:opacity-90"
              style={{ background: acc.color }}
              onClick={onConfirm}>Confirm Dispatch</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DispatchBody({ role, access, notify }) {
  const acc        = PHASE_ACCENT['Dispatch'];
  const owner      = access === 'edit';
  const canComment = !['Finance Officer', 'Viewer'].includes(role);
  const canDispute = role === 'General Manager' || (!owner && canComment);

  const [checklist, setChecklist]     = React.useState(DS_CHECKLIST_INIT);
  const [commentText, setCommentText] = React.useState('');
  const [showModal, setShowModal]     = React.useState(false);
  const [dispatched, setDispatched]   = React.useState(false);

  const toggle = (i) => {
    if (!owner) return;
    setChecklist(prev => prev.map((it, idx) => {
      if (idx !== i) return it;
      const done = !it.done;
      return { ...it, done, by: done ? 'Ramesh Gupta' : undefined, date: done ? '17 Jun 2026' : undefined };
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
                style={{ background: acc.color }}>5</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-[22px] font-bold text-[#1A1A17] tracking-tight">Dispatch</h1>
                  {dispatched ? <PhasePill status="Completed" /> : <PhasePill status="In Progress" />}
                  <span className="text-[12px] font-mono text-[#84837C]">Phase 5 of 5</span>
                </div>
                <div className="text-[13px] text-[#57564F] flex flex-wrap gap-x-3 gap-y-0.5 items-center">
                  <span className="font-semibold text-[#1A1A17]">{DS_PROJECT.name}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>{DS_PROJECT.client}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span className="font-mono">{DS_PROJECT.po}</span>
                  <span className="text-[#C9C9C3]">·</span>
                  <span>Target <span className="font-semibold font-mono">{DS_PROJECT.target}</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-5 flex-none">
              <div className="text-center">
                <div className="text-[32px] font-bold font-mono leading-none" style={{ color: dispatched ? '#15803D' : acc.color }}>{dispatched ? '100' : pct}%</div>
                <div className="text-[11px] font-mono text-[#84837C] mt-1">{dispatched ? checklist.length : doneCount}/{checklist.length} tasks</div>
              </div>
              {owner && !dispatched && (
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    className={'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[14px] transition-all ' +
                      (reqLeft === 0 ? 'text-white shadow-sm hover:opacity-90' : 'text-[#84837C] bg-[#FAFAF8] border border-[#DEDEDA] cursor-not-allowed opacity-60')}
                    style={reqLeft === 0 ? { background: acc.color } : {}}
                    disabled={reqLeft > 0}
                    onClick={() => reqLeft === 0 && setShowModal(true)}
                  >
                    <Icon name="dispatch" className="w-4 h-4" strokeWidth={2} />
                    Mark Dispatched
                  </button>
                  {reqLeft > 0 && <span className="text-[11px] text-[#B45309] font-medium">{reqLeft} required item{reqLeft !== 1 ? 's' : ''} remaining</span>}
                </div>
              )}
              {dispatched && (
                <div className="flex items-center gap-2 bg-[#DCFCE7] rounded-xl px-4 py-2.5">
                  <Icon name="check" className="w-5 h-5 text-[#15803D]" strokeWidth={2.5} />
                  <span className="text-[14px] font-semibold text-[#15803D]">Dispatched</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-[#F0F0EE]">
            <PhaseStepper phases={DS_PHASES} />
          </div>
        </div>
      </div>

      {/* ── dispatched banner ── */}
      {dispatched && (
        <div className="flex items-center gap-3 rounded-xl px-5 py-4 mb-5 border"
          style={{ background: '#DCFCE7', borderColor: '#86EFAC', borderLeft: '4px solid #15803D' }}>
          <Icon name="check" className="w-5 h-5 flex-none text-[#15803D]" strokeWidth={2.5} />
          <div>
            <div className="text-[14px] font-bold text-[#14532D]">Project dispatched successfully!</div>
            <div className="text-[12px] text-[#15803D] mt-0.5">Vehicle TN-35-AB-1234 · Delivery Note DN-0042 · Delivery date: 18 Jun 2026</div>
          </div>
        </div>
      )}

      {/* ── read-only banner ── */}
      {!owner && !dispatched && (
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

          {/* piece reconciliation */}
          <TableCard
            title="Piece Reconciliation vs BOM" count="30 pcs" right="Gross 4.9 T · Net 4.6 T"
            cols={['Part Mark', 'BOM Qty', 'QC-Passed', 'Loaded', 'Match']}
            rows={DS_RECON}
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
              <span className="text-[13px] font-bold font-mono" style={{ color: dispatched ? '#15803D' : acc.color }}>{dispatched ? 100 : pct}%</span>
            </div>
            <div className="px-5 pt-3 pb-2">
              <Progress done={dispatched ? checklist.length : doneCount} total={checklist.length} tone={dispatched ? '#15803D' : acc.color} />
            </div>
            <ul className="px-5 pb-2">
              {checklist.map((c, i) => (
                <li key={i}
                  className="flex items-start gap-3 py-3 px-3 -mx-3 rounded-xl transition-colors"
                  style={c.done || dispatched ? { background: '#F0FDF4' } : {}}>
                  <button type="button"
                    className={'flex-none mt-0.5 ' + (owner && !dispatched ? 'cursor-pointer' : 'cursor-default')}
                    onClick={() => toggle(i)} disabled={!owner || dispatched}>
                    {(c.done || dispatched)
                      ? <span className="w-[22px] h-[22px] rounded-full bg-[#15803D] grid place-items-center">
                          <Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={2.6} />
                        </span>
                      : <span className="w-[22px] h-[22px] rounded-full border-2 border-[#C9C9C3] bg-white block" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className={'text-[14px] ' + ((c.done || dispatched) ? 'text-[#57564F] line-through' : 'text-[#1A1A17] font-medium')}>
                      {c.t}{c.req && !c.done && !dispatched && <span className="text-[#B91C1C] font-bold"> *</span>}
                    </div>
                    {(c.done) && c.by && (
                      <div className="text-[11.5px] text-[#15803D] mt-0.5 font-mono flex items-center gap-1">
                        <Icon name="check" className="w-3 h-3" strokeWidth={2.5} />
                        {c.by} · {c.date}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {owner && !dispatched && (
              <div className="px-5 pb-4 pt-1 text-[11.5px] text-[#84837C] border-t border-[#F0F0EE] mt-1">
                <span className="text-[#B91C1C] font-bold">*</span> Required — must be checked before dispatch.
              </div>
            )}
          </div>

          {/* delivery details */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: acc.bg, color: acc.color }}>
                <Icon name="dispatch" className="w-4 h-4" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-bold text-[#1A1A17]">Delivery Details</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                ['Delivery Note',    'DN-0042'],
                ['E-Way Bill',       'EWB-88213047'],
                ['Vehicle Number',   'TN-35-AB-1234'],
                ['Driver',          'Mohan Das'],
                ['Delivery Date',    '18 Jun 2026'],
                ['Destination',     'Acme Site, Bay 4, Chennai'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#84837C]">{k}</span>
                  <span className="text-[14px] font-semibold text-[#1A1A17]">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* comments */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0EE]">
              <h3 className="text-[15px] font-bold text-[#1A1A17]">Comments</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {DS_COMMENTS.map((c, i) => (
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
              <span className="text-[12px] font-mono font-semibold bg-[#F0F0EE] text-[#4B5563] px-2 py-0.5 rounded-full">{DS_DOCS.length}</span>
            </div>
            <div className="p-4 flex flex-col gap-1">
              {DS_DOCS.map((d, i) => (
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
            {owner && !dispatched && (
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
                      {DS_DOC_TYPES.map(t => <option key={t}>{t}</option>)}
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

          {/* consignment */}
          <InfoPanel title="Consignment" rows={[
            ['Pieces',    dispatched ? '30 / 30' : '29 / 30'],
            ['Gross wt.', '4.9 T'],
            ['Packages',  '3 bundles'],
            ['Transport', 'Road · FTL'],
            ['POD',       dispatched ? 'Signed ✓' : 'Pending'],
          ]} />

          {/* phase info */}
          <div className="bg-white rounded-2xl border border-[#DEDEDA] shadow-[0_1px_4px_rgba(26,26,23,0.05)] p-5">
            <h3 className="text-[15px] font-bold text-[#1A1A17] mb-2">Phase Info</h3>
            <p className="text-[13px] text-[#57564F] leading-relaxed">
              Reconcile every part mark against the BOM, weigh and pack per erection sequence, raise the delivery note &amp; e-way bill, then confirm dispatch to close the project.
            </p>
          </div>

        </div>
      </div>

      {/* activity log */}
      <ActivityLog items={DS_ACTIVITY} acc={acc} />

      {showModal && (
        <ConfirmDispatchModal
          onClose={() => setShowModal(false)}
          onConfirm={() => { setShowModal(false); setDispatched(true); notify('Project dispatched!'); }}
        />
      )}
    </div>
  );
}

function DispatchPhasePage() {
  return (
    <PhaseShell
      crumb={['Home', 'Projects', 'PROJ-2026-0018', 'Dispatch']}
      ownerRoles={['Dispatch In-charge', 'General Manager']}
    >
      {(role, access, notify) => <DispatchBody role={role} access={access} notify={notify} />}
    </PhaseShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DispatchPhasePage />);
