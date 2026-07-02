/* ============================================================
   SCREEN PROJECT DETAIL — role access matrix + all-role stack
   Globals: Icon, Sidebar, TopBar, fmtDate, money, StatusPill
   PD_PROJECTS, PD_STAGE from screen-projects.jsx
   ============================================================ */

const PDR_ACCESS = {
  'Planning Officer': {
    'Project Overview':  { level: 'editable', note: 'Can edit name, PM, dates, status' },
    'Stage Timeline':    { level: 'editable', note: 'Can reassign any stage owner' },
    'Purchase Orders':   { level: 'editable', note: 'Can create and link POs' },
    'Financial Summary': { level: 'readonly', note: 'View-only — managed by Finance' },
    'Documents':         { level: 'editable', note: 'Can upload and manage all files' },
    'Activity Log':      { level: 'visible',  note: 'Full audit trail' },
  },
  'Project Manager': {
    'Project Overview':  { level: 'editable', note: 'Can update status and target date' },
    'Stage Timeline':    { level: 'editable', note: 'Cutting + Beamline (stages 1–2)' },
    'Purchase Orders':   { level: 'readonly', note: 'View-only — cannot create POs' },
    'Financial Summary': { level: 'hidden',   note: null },
    'Documents':         { level: 'readonly', note: 'Can download; cannot upload' },
    'Activity Log':      { level: 'visible',  note: 'Full audit trail' },
  },
  'Quality Inspector': {
    'Project Overview':  { level: 'readonly', note: 'View-only' },
    'Stage Timeline':    { level: 'editable', note: 'Fit-Up Phase (stage 3) only' },
    'Purchase Orders':   { level: 'hidden',   note: null },
    'Financial Summary': { level: 'hidden',   note: null },
    'Documents':         { level: 'readonly', note: 'Quality & fit-up documents only' },
    'Activity Log':      { level: 'visible',  note: 'Own stage events' },
  },
  'Quality Head': {
    'Project Overview':  { level: 'readonly', note: 'View-only' },
    'Stage Timeline':    { level: 'editable', note: 'QC Phase (stage 4) — final sign-off' },
    'Purchase Orders':   { level: 'readonly', note: 'View for quality reference' },
    'Financial Summary': { level: 'hidden',   note: null },
    'Documents':         { level: 'readonly', note: 'All quality & inspection reports' },
    'Activity Log':      { level: 'visible',  note: 'Full audit trail' },
  },
  'Finance Officer': {
    'Project Overview':  { level: 'readonly', note: 'View-only' },
    'Stage Timeline':    { level: 'hidden',   note: null },
    'Purchase Orders':   { level: 'readonly', note: 'View PO values and status' },
    'Financial Summary': { level: 'editable', note: 'Can record payments, update budget' },
    'Documents':         { level: 'readonly', note: 'Financial documents only' },
    'Activity Log':      { level: 'visible',  note: 'Finance events visible' },
  },
  'Dispatch In-charge': {
    'Project Overview':  { level: 'readonly', note: 'View-only' },
    'Stage Timeline':    { level: 'editable', note: 'Dispatch Phase (stage 5) — packing & shipping' },
    'Purchase Orders':   { level: 'readonly', note: 'View delivery and PO details' },
    'Financial Summary': { level: 'hidden',   note: null },
    'Documents':         { level: 'readonly', note: 'Shipping docs and packing lists' },
    'Activity Log':      { level: 'visible',  note: 'Dispatch-related events' },
  },
  'Viewer': {
    'Project Overview':  { level: 'readonly', note: 'View-only' },
    'Stage Timeline':    { level: 'readonly', note: 'No actions available' },
    'Purchase Orders':   { level: 'hidden',   note: null },
    'Financial Summary': { level: 'hidden',   note: null },
    'Documents':         { level: 'hidden',   note: null },
    'Activity Log':      { level: 'visible',  note: 'Recent events only' },
  },
};

const PDR_ROLES = Object.keys(PDR_ACCESS);

const PDR_ROLE_STYLE = {
  'Planning Officer':   { dot: '#C2410C', bg: '#FCEEE4', text: '#C2410C' },
  'Project Manager':    { dot: '#1D4ED8', bg: '#E9F0FF', text: '#1D4ED8' },
  'Quality Inspector':  { dot: '#B45309', bg: '#FBF1DD', text: '#B45309' },
  'Quality Head':       { dot: '#6D28D9', bg: '#EDE9FE', text: '#6D28D9' },
  'Finance Officer':    { dot: '#15803D', bg: '#E6F6EC', text: '#15803D' },
  'Dispatch In-charge': { dot: '#0E7490', bg: '#ECFEFF', text: '#0E7490' },
  'Viewer':             { dot: '#84837C', bg: '#F0F0EE', text: '#57564F' },
};

const PDR_STAGE_CFG = {
  1: { name: 'Cutting Phase',  color: '#C2410C', bg: '#FCEEE4', taskTotal: 8 },
  2: { name: 'Beamline Phase', color: '#1D4ED8', bg: '#E9F0FF', taskTotal: 6 },
  3: { name: 'Fit-Up Phase',   color: '#B45309', bg: '#FBF1DD', taskTotal: 6 },
  4: { name: 'QC Phase',       color: '#15803D', bg: '#E6F6EC', taskTotal: 5 },
  5: { name: 'Dispatch Phase', color: '#0E7490', bg: '#ECFEFF', taskTotal: 4 },
};

const PDR_FINANCIALS = { budget: 2400000, costToDate: 788800, invoiced: 600000, paid: 600000 };

const PDR_DOCS = [
  { name: 'Structural Drawings Rev B', type: 'Drawing',   date: '2026-06-10', size: '4.2 MB', cat: 'production' },
  { name: 'Material Specification',    type: 'Spec',      date: '2026-06-08', size: '1.1 MB', cat: 'production' },
  { name: 'QC Inspection Report',      type: 'QC Report', date: '2026-06-20', size: '2.8 MB', cat: 'quality'    },
  { name: 'PO-2026-0042 Invoice',      type: 'Financial', date: '2026-06-05', size: '0.4 MB', cat: 'finance'    },
];

const LEVEL_CFG = {
  editable: { label: 'Editable',  fg: '#15803D', bg: '#DCFCE7', icon: 'edit' },
  readonly: { label: 'Read-only', fg: '#1D4ED8', bg: '#DBEAFE', icon: 'eye'  },
  visible:  { label: 'Visible',   fg: '#B45309', bg: '#FEF3C7', icon: 'eye'  },
  hidden:   { label: 'Hidden',    fg: '#84837C', bg: '#F0F0EE', icon: 'lock' },
};

/* ---- access badge ---- */
function PDRBadge({ level }) {
  const c = LEVEL_CFG[level] || LEVEL_CFG.readonly;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 font-mono flex-none" style={{ color: c.fg, background: c.bg }}>
      <Icon name={c.icon} className="w-3 h-3" strokeWidth={2.2} />
      {c.label}
    </span>
  );
}

/* ---- section wrapper ---- */
function PDRSection({ title, access, children }) {
  const { level, note } = access;
  const isHidden = level === 'hidden';
  const leftColors = { editable: '#15803D', readonly: '#1D4ED8', visible: '#B45309', hidden: '#E5E5E1' };
  return (
    <div className={'border border-[#DEDEDA] rounded-lg overflow-hidden ' + (isHidden ? 'opacity-55' : '')}
      style={{ borderLeft: '3px solid ' + (leftColors[level] || '#E5E5E1') }}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#FAFAF8] border-b border-[#DEDEDA]">
        <span className={'text-[11.5px] font-semibold uppercase tracking-wider ' + (isHidden ? 'text-[#B0B0A8]' : 'text-[#57564F]')}>{title}</span>
        <div className="flex items-center gap-2.5">
          {note && !isHidden && <span className="text-[11px] text-[#84837C] hidden xl:block">{note}</span>}
          <PDRBadge level={level} />
        </div>
      </div>
      {isHidden ? (
        <div className="flex items-center gap-2 px-4 py-4 text-[12.5px] text-[#B0B0A8]">
          <Icon name="lock" className="w-4 h-4 text-[#C9C9C3]" />
          <span>Not accessible to this role</span>
        </div>
      ) : children}
    </div>
  );
}

/* ---- editable field ---- */
function PDRField({ label, value, editable, mono }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#84837C]">{label}</span>
      {editable ? (
        <div className="relative inline-block min-w-[100px]">
          <span className={'block border border-[#C9C9C3] rounded-md px-3 py-1.5 bg-white text-[13px] font-medium text-[#1A1A17] pr-8 ' + (mono ? 'font-mono' : '')}>{value}</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#84837C]"><Icon name="edit" className="w-3 h-3" strokeWidth={1.8} /></span>
        </div>
      ) : (
        <span className={'text-[13.5px] font-medium text-[#1A1A17] ' + (mono ? 'font-mono' : '')}>{value}</span>
      )}
    </div>
  );
}

/* ---- PROJECT OVERVIEW ---- */
function PDROverview({ project, level }) {
  const ed = level === 'editable';
  const pct = Math.round((project.stagesCompleted / 5) * 100);
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
        <PDRField label="Project ID"       value={project.id}                 editable={false} mono />
        <PDRField label="Status"           value={project.status}             editable={ed} />
        <PDRField label="Project Manager"  value={project.pm}                 editable={ed} />
        <PDRField label="Planning Officer" value={project.planningOfficer}    editable={ed} />
        <PDRField label="Client"           value={project.client}             editable={ed} />
        <PDRField label="Start Date"       value={fmtDate(project.startDate)} editable={false} mono />
        <PDRField label="Target Date"      value={fmtDate(project.targetDate)} editable={ed} mono />
        <PDRField label="Active Stage"     value={project.activeStage ? PDR_STAGE_CFG[project.activeStage].name : 'All complete'} editable={false} />
      </div>
      <div>
        <div className="flex justify-between text-[12px] text-[#84837C] mb-1.5 font-mono">
          <span>Overall progress</span>
          <span className="font-semibold text-[#C2410C]">{project.stagesCompleted}/5 stages</span>
        </div>
        <div className="h-2 rounded-full bg-[#F0F0EE] overflow-hidden">
          <div className="h-full rounded-full bg-[#C2410C] transition-all" style={{ width: pct + '%' }} />
        </div>
      </div>
      {ed && (
        <div className="flex gap-2 pt-1">
          <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-[#1A1A17] hover:bg-[#3C3A33] text-white px-3 py-1.5 rounded-md">
            <Icon name="check" className="w-3.5 h-3.5" /> Save changes
          </button>
          <button className="text-[12px] font-semibold text-[#57564F] hover:bg-[#F0F0EE] px-3 py-1.5 rounded-md border border-[#C9C9C3]">Cancel</button>
        </div>
      )}
    </div>
  );
}

/* ---- STAGE TIMELINE ---- */
// null = owns all (Planning Officer); [] = readonly, no stage ownership
const PDR_STAGE_OWN = {
  'Planning Officer':   null,
  'Project Manager':    [1, 2],
  'Quality Inspector':  [3],
  'Quality Head':       [4],
  'Finance Officer':    [],
  'Dispatch In-charge': [5],
  'Viewer':             [],
};

/* ---- STAGE TIMELINE — horizontal cards ---- */
function PDRStageCards({ project, level, role }) {
  const ownStages = PDR_STAGE_OWN[role]; // null = all stages, [] = none

  return (
    <div className="px-4 pt-4 pb-5">
      <div className="flex items-start gap-0">
        {project.stages.map((stage, i) => {
          const col      = PDR_STAGE_CFG[stage.n];
          const isDone   = stage.status === 'Completed';
          const isActive = stage.status === 'In Progress';
          const isMine   = ownStages === null || ownStages.includes(stage.n);
          const isLocked = !isDone && !isActive && ownStages !== null && ownStages.length > 0 && !isMine;
          const canAct   = level === 'editable' && isMine && isActive;
          const total    = col.taskTotal || 6;
          const done     = isDone ? total : (stage.tasksDone || 0);
          const pct      = total > 0 ? Math.round((done / total) * 100) : 0;

          /* visual tokens */
          const badgeBg    = isDone ? '#15803D' : isActive ? col.color : '#F0F0EE';
          const badgeFg    = (isDone || isActive) ? '#fff' : '#9CA3AF';
          const barFill    = isDone ? '#15803D' : isActive ? col.color : '#E0E0DC';
          const statusFg   = isDone ? '#15803D' : isActive ? col.color : '#9CA3AF';
          const cardBorder = isActive
            ? `2px solid ${col.color}`
            : '1px solid #E5E7EB';
          const cardShadow = isActive
            ? `0 0 0 4px ${col.color}18`
            : 'none';

          return (
            <React.Fragment key={stage.n}>
              <div
                className="flex-1 min-w-0 rounded-2xl flex flex-col bg-white overflow-hidden"
                style={{ border: cardBorder, boxShadow: cardShadow }}
              >
                {/* body */}
                <div className={'flex flex-col gap-2.5 p-3.5 flex-1 ' + (isLocked ? 'opacity-45' : '')}>

                  {/* badge + stage name */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex-none grid place-items-center text-[13px] font-bold font-mono leading-none"
                      style={{ background: badgeBg, color: badgeFg }}
                    >
                      {isDone
                        ? <Icon name="check" className="w-[17px] h-[17px]" strokeWidth={2.8} />
                        : <span>{stage.n}</span>}
                    </div>
                    <span className="text-[14px] font-bold text-[#111827] truncate flex-1 leading-tight">
                      {col.name.replace(' Phase', '')}
                    </span>
                    {isLocked && (
                      <Icon name="lock" className="w-3.5 h-3.5 text-[#C9C9C3] flex-none" strokeWidth={1.8} />
                    )}
                  </div>

                  {/* status */}
                  <div className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: statusFg }}>
                    {isLocked
                      ? <Icon name="lock" className="w-3 h-3 flex-none" strokeWidth={2.2} />
                      : <span className="w-2 h-2 rounded-full flex-none" style={{ background: statusFg }} />}
                    <span>{stage.status}</span>
                  </div>

                  {/* progress bar */}
                  <div className="h-[7px] rounded-full bg-[#F0F0EE] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: pct + '%', background: barFill }}
                    />
                  </div>

                  {/* task count — right-aligned */}
                  <div className="flex justify-end -mt-1">
                    <span className="text-[12px] font-mono font-semibold" style={{ color: statusFg }}>{done}/{total}</span>
                  </div>

                </div>

                {/* Open Phase button — only for the role's active owned stage */}
                {canAct && (
                  <div className="px-3.5 pb-3.5 -mt-0.5">
                    <button
                      className="w-full py-2 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
                      style={{ background: '#C2410C' }}
                    >
                      Open Phase
                    </button>
                  </div>
                )}
              </div>

              {/* right-pointing chevron between cards */}
              {i < project.stages.length - 1 && (
                <div className="flex items-center self-center flex-none px-1 text-[#D1D5DB]">
                  <Icon name="chevron" className="w-4 h-4 -rotate-90" strokeWidth={2} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ---- PURCHASE ORDERS ---- */
function PDRPurchaseOrders({ project, level }) {
  const canEdit = level === 'editable';
  const th = 'text-[11px] font-semibold uppercase tracking-wider text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3] text-left whitespace-nowrap';
  const td = 'px-4 py-3 border-b border-[#DEDEDA] align-middle text-[13px]';
  return (
    <div>
      {canEdit && (
        <div className="px-4 py-2.5 border-b border-[#DEDEDA] flex justify-end">
          <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-[#C2410C] hover:bg-[#9A330A] text-white px-3 py-1.5 rounded-md">
            <Icon name="plus" className="w-3.5 h-3.5" /> Create PO
          </button>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={th}>PO Number</th>
            <th className={th + ' hidden md:table-cell'}>Vendor</th>
            <th className={th + ' text-right'}>Amount</th>
            <th className={th}>Status</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {project.pos.map((po, i) => (
            <tr key={i} className="hover:bg-[#FAFAF8]">
              <td className={td}>
                <span className="font-mono font-semibold text-[#1A1A17] text-[12.5px]">{po.no}</span>
                <div className="text-[11.5px] text-[#57564F] mt-0.5 truncate max-w-[200px]">{po.title}</div>
              </td>
              <td className={td + ' hidden md:table-cell text-[#57564F]'}>{po.vendor}</td>
              <td className={td + ' text-right font-mono font-semibold text-[#1A1A17]'}>{money(po.amount, 'INR')}</td>
              <td className={td}><StatusPill status={po.status} /></td>
              <td className={td}>
                <button className="text-[12px] font-semibold text-[#1D4ED8] hover:bg-[#E9F0FF] px-2.5 py-1 rounded-md">
                  {canEdit ? 'Open' : 'View'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- FINANCIAL SUMMARY ---- */
function PDRFinancial({ level }) {
  const canEdit = level === 'editable';
  const fin = PDR_FINANCIALS;
  const pct = Math.round((fin.costToDate / fin.budget) * 100);

  function FinField({ label, value, editable }) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#84837C]">{label}</span>
        {editable ? (
          <div className="relative">
            <span className="block border border-[#C9C9C3] rounded-md px-3 py-1.5 bg-white font-mono font-semibold text-[13px] text-[#1A1A17] pr-8">{value}</span>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#84837C]"><Icon name="edit" className="w-3 h-3" strokeWidth={1.8} /></span>
          </div>
        ) : (
          <span className="font-mono font-semibold text-[13.5px] text-[#1A1A17]">{value}</span>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FinField label="Budget"       value={money(fin.budget, 'INR')}      editable={canEdit} />
        <FinField label="Cost to Date" value={money(fin.costToDate, 'INR')}  editable={false} />
        <FinField label="Invoiced"     value={money(fin.invoiced, 'INR')}    editable={canEdit} />
        <FinField label="Paid"         value={money(fin.paid, 'INR')}        editable={false} />
      </div>
      <div>
        <div className="flex justify-between text-[12px] text-[#84837C] mb-1.5 font-mono">
          <span>Budget utilisation</span>
          <span className="font-semibold">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#F0F0EE] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: pct + '%', background: pct > 90 ? '#B91C1C' : '#1D4ED8' }} />
        </div>
      </div>
      {canEdit && (
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-[#15803D] hover:bg-[#11652F] text-white px-3 py-1.5 rounded-md">
            <Icon name="check" className="w-3.5 h-3.5" /> Record Payment
          </button>
          <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#57564F] border border-[#C9C9C3] hover:bg-[#F0F0EE] px-3 py-1.5 rounded-md">
            <Icon name="plus" className="w-3.5 h-3.5" /> Raise Invoice
          </button>
        </div>
      )}
    </div>
  );
}

/* ---- DOCUMENTS ---- */
function PDRDocuments({ level, role }) {
  const canEdit = level === 'editable';
  const isFinance = role === 'Finance Officer';
  const docs = isFinance ? PDR_DOCS.filter(d => d.cat === 'finance') : PDR_DOCS;
  return (
    <div>
      {canEdit && (
        <div className="px-4 py-2.5 border-b border-[#DEDEDA] flex justify-end">
          <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-[#1A1A17] hover:bg-[#3C3A33] text-white px-3 py-1.5 rounded-md">
            <Icon name="upload" className="w-3.5 h-3.5" /> Upload
          </button>
        </div>
      )}
      <div className="divide-y divide-[#DEDEDA]">
        {docs.map((doc, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAF8]">
            <Icon name="documents" className="w-7 h-7 text-[#C2410C] flex-none" strokeWidth={1.4} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#1A1A17] truncate">{doc.name}</div>
              <div className="text-[11.5px] font-mono text-[#84837C] mt-0.5">{doc.type} · {doc.date} · {doc.size}</div>
            </div>
            <div className="flex items-center gap-2 flex-none">
              <button className="text-[12px] font-semibold text-[#1D4ED8] hover:bg-[#E9F0FF] px-2.5 py-1 rounded-md">Download</button>
              {canEdit && <button className="text-[12px] font-semibold text-[#B91C1C] hover:bg-[#FCECEC] px-2.5 py-1 rounded-md">Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- ACTIVITY LOG ---- */
function PDRActivity({ project }) {
  const cfg = {
    project_started:   { dot: '#C2410C', labelBg: '#FCEEE4', labelFg: '#C2410C' },
    project_completed: { dot: '#15803D', labelBg: '#E6F6EC', labelFg: '#15803D' },
    stage_started:     { dot: '#1D4ED8', labelBg: '#E9F0FF', labelFg: '#1D4ED8' },
    stage_completed:   { dot: '#15803D', labelBg: '#E6F6EC', labelFg: '#15803D' },
    po_created:        { dot: '#84837C', labelBg: '#F0F0EE', labelFg: '#4B5563' },
    po_approved:       { dot: '#15803D', labelBg: '#E6F6EC', labelFg: '#15803D' },
    comment:           { dot: '#B45309', labelBg: '#FBF1DD', labelFg: '#B45309' },
  };
  return (
    <div className="px-4 py-4">
      <ol className="relative">
        {project.activity.map((it, i) => {
          const c = cfg[it.type] || cfg.comment;
          return (
            <li key={i} className="relative pl-7 pb-4 last:pb-0">
              {i < project.activity.length - 1 && <span className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-[#C9C9C3]" />}
              <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 z-[1]" style={{ background: i === 0 ? c.dot : '#fff', borderColor: c.dot }} />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11.5px] font-semibold rounded-full px-2.5 py-0.5" style={{ color: c.labelFg, background: c.labelBg }}>{it.label}</span>
                <span className="text-[11px] font-mono text-[#84837C]">{it.time}</span>
              </div>
              <div className="text-[13px] text-[#1A1A17] font-medium mt-1">{it.actor}</div>
              {it.note && <div className="text-[12px] text-[#57564F] mt-0.5">{it.note}</div>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---- single role view ---- */
function PDRRoleView({ project, role }) {
  const access = PDR_ACCESS[role];
  const style = PDR_ROLE_STYLE[role];

  return (
    <div className="border-2 rounded-xl overflow-hidden" style={{ borderColor: style.dot + '50' }}>
      {/* role header */}
      <div className="flex items-center gap-3 px-5 py-3.5 flex-wrap" style={{ background: style.bg }}>
        <span className="w-3 h-3 rounded-full flex-none" style={{ background: style.dot }} />
        <span className="text-[15px] font-bold" style={{ color: style.text }}>{role}</span>
        <div className="ml-auto flex gap-1.5 flex-wrap">
          {Object.entries(access).map(([section, a]) => {
            const c = LEVEL_CFG[a.level] || LEVEL_CFG.readonly;
            return (
              <span key={section} className="text-[10px] font-mono font-bold rounded-full px-2 py-0.5 whitespace-nowrap" style={{ color: c.fg, background: c.bg }}>
                {section.split(' ')[0]}: {a.level}
              </span>
            );
          })}
        </div>
      </div>

      {/* all sections */}
      <div className="p-4 flex flex-col gap-3 bg-[#F4F4F2]">
        <PDRSection title="Stage Timeline" access={access['Stage Timeline']}>
          <PDRStageCards project={project} level={access['Stage Timeline'].level} role={role} />
        </PDRSection>

        <PDRSection title="Project Overview" access={access['Project Overview']}>
          <PDROverview project={project} level={access['Project Overview'].level} />
        </PDRSection>

        <PDRSection title="Purchase Orders" access={access['Purchase Orders']}>
          <PDRPurchaseOrders project={project} level={access['Purchase Orders'].level} />
        </PDRSection>

        <PDRSection title="Financial Summary" access={access['Financial Summary']}>
          <PDRFinancial level={access['Financial Summary'].level} />
        </PDRSection>

        <PDRSection title="Documents" access={access['Documents']}>
          <PDRDocuments level={access['Documents'].level} role={role} />
        </PDRSection>

        <PDRSection title="Activity Log" access={access['Activity Log']}>
          <PDRActivity project={project} />
        </PDRSection>
      </div>
    </div>
  );
}

/* ---- role access matrix table ---- */
function PDRAccessMatrix() {
  const sections = Object.keys(PDR_ACCESS['Planning Officer']);
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(26,26,23,0.05)] mb-6">
      <div className="px-5 py-3.5 border-b border-[#DEDEDA] bg-[#FAFAF8]">
        <h2 className="text-[14px] font-semibold text-[#1A1A17]">Role Access Matrix</h2>
        <p className="text-[12px] text-[#84837C] mt-0.5">Which sections each role can see and interact with — based on industry practice</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#57564F] bg-[#FAFAF8] border-b border-[#DEDEDA] whitespace-nowrap">Section</th>
              {PDR_ROLES.map(role => {
                const s = PDR_ROLE_STYLE[role];
                return (
                  <th key={role} className="px-3 py-2.5 bg-[#FAFAF8] border-b border-[#DEDEDA] border-l border-l-[#DEDEDA] text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: s.text }}>
                      <span className="w-2 h-2 rounded-full flex-none" style={{ background: s.dot }} />
                      {role}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sections.map((section, i) => (
              <tr key={section} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}>
                <td className="px-4 py-3 font-semibold text-[#1A1A17] border-b border-[#DEDEDA] text-[12.5px] whitespace-nowrap">{section}</td>
                {PDR_ROLES.map(role => {
                  const a = PDR_ACCESS[role][section];
                  const c = LEVEL_CFG[a.level] || LEVEL_CFG.readonly;
                  return (
                    <td key={role} className="px-3 py-3 border-b border-[#DEDEDA] border-l border-l-[#DEDEDA] text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="inline-block text-[11px] font-bold rounded-full px-2.5 py-0.5 font-mono whitespace-nowrap" style={{ color: c.fg, background: c.bg }}>{c.label}</span>
                        {a.note && <span className="text-[10px] text-[#84837C] leading-tight text-center hidden xl:block">{a.note}</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- project summary header ---- */
function PDRProjectHeader({ project }) {
  const pct = Math.round((project.stagesCompleted / 5) * 100);
  const activeStage = project.stages.find(s => s.status === 'In Progress');
  return (
    <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-5 mb-6">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <button
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#57564F] hover:text-[#1A1A17] hover:bg-[#F0F0EE] px-2 py-1 rounded-md -ml-2"
              onClick={() => window.location.href = 'Step_6_Project_List.html'}
            >
              <Icon name="chevron" className="w-4 h-4 rotate-90" /> Back to Projects
            </button>
            <span className="text-[#C9C9C3]">/</span>
            <span className="font-mono text-[12px] text-[#84837C]">{project.id}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{ color: project.status === 'Active' ? '#15803D' : '#4B5563', background: project.status === 'Active' ? '#E6F6EC' : '#F0F0EE' }}>
              {project.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />}
              {project.status}
            </span>
          </div>
          <h1 className="text-[20px] font-bold text-[#1A1A17] tracking-tight">{project.name}</h1>
          <p className="text-[13px] text-[#57564F] mt-0.5">{project.client}</p>
        </div>
        <div className="text-right flex-none">
          <div className="text-[11px] text-[#84837C] font-mono uppercase tracking-wider">Progress</div>
          <div className="text-[24px] font-bold text-[#C2410C] font-mono leading-tight">{pct}%</div>
          <div className="text-[11px] text-[#84837C] font-mono">{project.stagesCompleted}/5 stages done</div>
        </div>
      </div>
      {(activeStage || project.pm) && (
        <div className="mt-3 pt-3 border-t border-[#DEDEDA] flex gap-4 flex-wrap text-[12.5px] text-[#57564F]">
          {activeStage && <span>Active stage: <span className="font-semibold" style={{ color: PDR_STAGE_CFG[activeStage.n].color }}>{PDR_STAGE_CFG[activeStage.n].name}</span></span>}
          <span>PM: <span className="font-semibold text-[#1A1A17]">{project.pm}</span></span>
          <span>Target: <span className="font-mono font-semibold text-[#1A1A17]">{fmtDate(project.targetDate)}</span></span>
        </div>
      )}
    </div>
  );
}

/* ---- main screen ---- */
function ScreenProjectDetail({ notify }) {
  const [project] = React.useState(() => {
    try {
      const stored = localStorage.getItem('pd_project');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return window.PD_PROJECTS ? window.PD_PROJECTS[0] : null;
  });

  const [activeRole, setActiveRole] = React.useState(null);

  if (!project) return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Projects']} />
      <div className="flex-1 flex items-center justify-center text-[#84837C]">No project selected.</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Projects', project.id]} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1280px] mx-auto">

          <PDRProjectHeader project={project} />
          <PDRAccessMatrix />

          {/* role filter + section title */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-[16px] font-bold text-[#1A1A17]">Role-by-role detail view</h2>
              <p className="text-[12px] text-[#84837C] mt-0.5">Each role sees only what's permitted — editable fields, visible sections, and available actions differ per role</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className={'text-[12px] font-semibold px-3 py-1.5 rounded-md border ' + (activeRole === null ? 'bg-[#1A1A17] text-white border-[#1A1A17]' : 'border-[#C9C9C3] text-[#57564F] hover:bg-[#F0F0EE]')}
                onClick={() => setActiveRole(null)}>All roles</button>
              {PDR_ROLES.map(r => {
                const s = PDR_ROLE_STYLE[r];
                const isActive = activeRole === r;
                return (
                  <button key={r}
                    className={'text-[12px] font-semibold px-3 py-1.5 rounded-md border transition-colors ' + (isActive ? 'text-white border-transparent' : 'border-[#C9C9C3] text-[#57564F] hover:bg-[#F0F0EE]')}
                    style={isActive ? { background: s.dot, borderColor: s.dot } : {}}
                    onClick={() => setActiveRole(r === activeRole ? null : r)}>
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {(activeRole ? [activeRole] : PDR_ROLES).map(role => (
              <PDRRoleView key={role} project={project} role={role} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

window.ScreenProjectDetail = ScreenProjectDetail;
