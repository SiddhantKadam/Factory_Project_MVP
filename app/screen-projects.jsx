/* ============================================================
   PROJECTS — List + Detail
   Two views managed by ScreenProjects:
     'list'   → ProjectList (with search / filter / pagination)
     'detail' → ProjectDetail (tabs: Overview · Stage Timeline · POs · Activity)

   Globals from shell.jsx:
     Sidebar, TopBar, Icon, StatusPill, RoleBadge,
     money, fmtDate, PO_DATA, ROLE_LENS, Timeline
   Globals from phase-shared.jsx:
     PhasePill, Progress
   ============================================================ */

/* ---- style tokens (PD_ prefix) ---- */
const PD_PRIMARY   = 'inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md transition-colors';
const PD_SECONDARY = 'inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md transition-colors';
const PD_SELECT_BG = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
};

/* ---- stage colour palette ---- */
const PD_STAGE = {
  1: { name: 'Cutting Phase',  color: '#C2410C', bg: '#FCEEE4' },
  2: { name: 'Beamline Phase', color: '#1D4ED8', bg: '#E9F0FF' },
  3: { name: 'Fit-Up Phase',   color: '#B45309', bg: '#FBF1DD' },
  4: { name: 'QC Phase',       color: '#15803D', bg: '#E6F6EC' },
};

/* ---- role access rules ---- */
const PD_ROLE_ACCESS = {
  'Planning Officer':      { tabs: ['Overview', 'Stage Timeline', 'Purchase Orders', 'Activity'], allStages: true,  canReassign: true,  canAddComment: true  },
  'Project Manager':       { tabs: ['Overview', 'Stage Timeline', 'Purchase Orders', 'Activity'], allStages: true,  canMarkComplete: true, canAddComment: true },
  'Production Supervisor': { tabs: ['Overview', 'Stage Timeline', 'Activity'], ownStage: 1, canAddComment: true  },
  'Finance Officer':       { tabs: ['Overview', 'Purchase Orders', 'Activity'] },
  'Viewer':                { tabs: ['Overview', 'Activity'] },
};
const PD_ROLES = Object.keys(PD_ROLE_ACCESS);

/* ============================================================
   MOCK DATA
   ============================================================ */
const PD_PROJECTS = [
  {
    id: 'PROJ-2026-0018',
    name: 'Structural Beams — Bay 4',
    client: 'Acme Infrastructure Ltd.',
    status: 'Active',
    pm: 'R. Okafor',
    planningOfficer: 'M. Delgado',
    startDate: '2026-06-10',
    targetDate: '2026-07-15',
    activeStage: 1,
    stagesCompleted: 0,
    stages: [
      { n: 1, status: 'In Progress', assignee: 'Rajesh Kumar', assigneeRole: 'Production Supervisor', initials: 'RK', startDate: '2026-06-10', endDate: null,         comment: 'Drawings updated to rev B — awaiting new cut schedule.' },
      { n: 2, status: 'Pending',     assignee: 'Anil Sharma',  assigneeRole: 'Beamline Operator',     initials: 'AS', startDate: null,          endDate: null,         comment: null },
      { n: 3, status: 'Pending',     assignee: 'Priya Nair',   assigneeRole: 'Fit-Up Technician',     initials: 'PN', startDate: null,          endDate: null,         comment: null },
      { n: 4, status: 'Pending',     assignee: 'K. Verma',     assigneeRole: 'Quality Inspector',     initials: 'KV', startDate: null,          endDate: null,         comment: null },
    ],
    pos: [
      { no: 'PO-2026-0042', title: 'Structural steel — Warehouse Block B', vendor: 'Acme Infrastructure Ltd.', amount: 788800, status: 'Approved', createdBy: 'M. Delgado', approvalStatus: 'Approved' },
    ],
    activity: [
      { type: 'stage_started',   label: 'Stage Started',   actor: 'R. Okafor · Project Manager',   time: '10 Jun 2026 · 09:15', note: 'Cutting Phase initiated.' },
      { type: 'project_started', label: 'Project Started', actor: 'M. Delgado · Planning Officer', time: '10 Jun 2026 · 08:45', note: 'Project created and all stage owners assigned.' },
      { type: 'po_approved',     label: 'PO Approved',     actor: 'A. Rahman · Director',           time: '06 Jun 2026 · 14:08', note: 'PO-2026-0042 approved. Proceed to production scheduling.' },
      { type: 'po_created',      label: 'PO Created',      actor: 'M. Delgado · Planning Officer', time: '02 Jun 2026 · 11:02', note: 'PO-2026-0042 raised from client PDF.' },
    ],
  },
  {
    id: 'PROJ-2026-0021',
    name: 'Crane Runway Girders',
    client: 'Meridian Construction Co.',
    status: 'Active',
    pm: 'S. Iyer',
    planningOfficer: 'T. Nakamura',
    startDate: '2026-06-01',
    targetDate: '2026-07-02',
    activeStage: 2,
    stagesCompleted: 1,
    stages: [
      { n: 1, status: 'Completed',   assignee: 'M. Patel',     assigneeRole: 'Production Lead',       initials: 'MP', startDate: '2026-06-01', endDate: '2026-06-08', comment: 'All cuts completed to tolerance.' },
      { n: 2, status: 'In Progress', assignee: 'Anil Sharma',  assigneeRole: 'Beamline Operator',     initials: 'AS', startDate: '2026-06-09', endDate: null,         comment: 'Shot-blasting 60% complete.' },
      { n: 3, status: 'Pending',     assignee: 'D. Joshi',     assigneeRole: 'Senior Fabricator',     initials: 'DJ', startDate: null,          endDate: null,         comment: null },
      { n: 4, status: 'Pending',     assignee: 'K. Verma',     assigneeRole: 'Quality Inspector',     initials: 'KV', startDate: null,          endDate: null,         comment: null },
    ],
    pos: [
      { no: 'PO-2026-0479', title: 'Crane runway girders', vendor: 'Meridian Construction Co.', amount: 624000, status: 'Approved', createdBy: 'T. Nakamura', approvalStatus: 'Approved' },
    ],
    activity: [
      { type: 'comment',         label: 'Comment',         actor: 'Anil Sharma · Beamline Operator', time: '14 Jun 2026 · 16:30', note: 'Shot-blasting 60% complete. Expected finish: 16 Jun.' },
      { type: 'stage_started',   label: 'Stage Started',   actor: 'S. Iyer · Project Manager',      time: '09 Jun 2026 · 08:00', note: 'Beamline Phase started.' },
      { type: 'stage_completed', label: 'Stage Completed', actor: 'M. Patel · Production Lead',     time: '08 Jun 2026 · 17:00', note: 'Cutting Phase complete. All pieces tagged.' },
      { type: 'project_started', label: 'Project Started', actor: 'T. Nakamura · Planning Officer', time: '01 Jun 2026 · 09:00', note: 'Project initiated from approved PO.' },
      { type: 'po_approved',     label: 'PO Approved',     actor: 'A. Rahman · Director',            time: '30 May 2026 · 11:20', note: 'PO-2026-0479 approved.' },
    ],
  },
  {
    id: 'PROJ-2026-0015',
    name: 'Mezzanine Floor Framing',
    client: 'Sterling Steel Projects',
    status: 'Completed',
    pm: 'P. Fernandes',
    planningOfficer: 'M. Delgado',
    startDate: '2026-05-05',
    targetDate: '2026-06-01',
    activeStage: null,
    stagesCompleted: 4,
    stages: [
      { n: 1, status: 'Completed', assignee: 'Rajesh Kumar', assigneeRole: 'Production Supervisor', initials: 'RK', startDate: '2026-05-05', endDate: '2026-05-10', comment: null },
      { n: 2, status: 'Completed', assignee: 'Anil Sharma',  assigneeRole: 'Beamline Operator',     initials: 'AS', startDate: '2026-05-11', endDate: '2026-05-18', comment: null },
      { n: 3, status: 'Completed', assignee: 'D. Joshi',     assigneeRole: 'Senior Fabricator',     initials: 'DJ', startDate: '2026-05-19', endDate: '2026-05-26', comment: null },
      { n: 4, status: 'Completed', assignee: 'K. Verma',     assigneeRole: 'Quality Inspector',     initials: 'KV', startDate: '2026-05-27', endDate: '2026-05-31', comment: 'All inspections passed. Dispatch cleared.' },
    ],
    pos: [
      { no: 'PO-2026-0477', title: 'Mezzanine floor framing', vendor: 'Sterling Steel Projects', amount: 918050, status: 'Approved', createdBy: 'M. Delgado', approvalStatus: 'Approved' },
    ],
    activity: [
      { type: 'project_completed', label: 'Project Completed', actor: 'P. Fernandes · Project Manager', time: '31 May 2026 · 18:00', note: 'All stages complete. Dispatched to site.' },
      { type: 'stage_completed',   label: 'Stage Completed',   actor: 'K. Verma · Quality Inspector',   time: '31 May 2026 · 17:30', note: 'QC Phase sign-off complete.' },
      { type: 'stage_completed',   label: 'Stage Completed',   actor: 'D. Joshi · Senior Fabricator',   time: '26 May 2026 · 16:00', note: 'Fit-Up Phase complete.' },
      { type: 'stage_completed',   label: 'Stage Completed',   actor: 'Anil Sharma · Beamline Operator', time: '18 May 2026 · 15:00', note: 'Beamline Phase complete.' },
      { type: 'project_started',   label: 'Project Started',   actor: 'M. Delgado · Planning Officer',  time: '05 May 2026 · 09:00', note: 'Project created.' },
    ],
  },
];

/* ============================================================
   SHARED SUB-COMPONENTS
   ============================================================ */
function PDFact({ label, children, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{label}</span>
      <span className={'text-[14px] text-[#1A1A17] ' + (mono ? 'font-mono tabular-nums font-semibold' : 'font-medium')}>
        {children}
      </span>
    </div>
  );
}

function PDProjectBadge({ status }) {
  const map = {
    Active:    { fg: '#15803D', bg: '#E6F6EC' },
    Completed: { fg: '#4B5563', bg: '#F0F0EE' },
    'On Hold': { fg: '#B45309', bg: '#FBF1DD' },
  };
  const s = map[status] || map['On Hold'];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap" style={{ color: s.fg, background: s.bg }}>
      {status === 'Active' && <span className="w-1.5 h-1.5 rounded-full po-pulse-dot" style={{ background: s.fg }} />}
      {status !== 'Active' && <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }} />}
      {status}
    </span>
  );
}

/* custom activity timeline — project events use their own colour scheme */
function PDActivityTimeline({ items }) {
  const cfg = {
    project_created:   { dot: '#84837C', labelBg: '#F0F0EE',  labelFg: '#4B5563'  },
    project_started:   { dot: '#C2410C', labelBg: '#FCEEE4',  labelFg: '#C2410C'  },
    project_completed: { dot: '#15803D', labelBg: '#E6F6EC',  labelFg: '#15803D'  },
    stage_started:     { dot: '#1D4ED8', labelBg: '#E9F0FF',  labelFg: '#1D4ED8'  },
    stage_completed:   { dot: '#15803D', labelBg: '#E6F6EC',  labelFg: '#15803D'  },
    po_created:        { dot: '#84837C', labelBg: '#F0F0EE',  labelFg: '#4B5563'  },
    po_approved:       { dot: '#15803D', labelBg: '#E6F6EC',  labelFg: '#15803D'  },
    comment:           { dot: '#B45309', labelBg: '#FBF1DD',  labelFg: '#B45309'  },
  };
  return (
    <ol className="relative">
      {items.map((it, i) => {
        const c = cfg[it.type] || cfg.comment;
        return (
          <li key={i} className="relative pl-7 pb-5 last:pb-0">
            {i < items.length - 1 && <span className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-[#C9C9C3]" />}
            <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 z-[1]" style={{ background: i === 0 ? c.dot : '#fff', borderColor: c.dot }} />
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11.5px] font-semibold rounded-full px-2.5 py-0.5" style={{ color: c.labelFg, background: c.labelBg }}>{it.label}</span>
              <span className="text-[12px] font-mono text-[#84837C]">{it.time}</span>
            </div>
            <div className="text-[14px] text-[#1A1A17] font-medium mt-1">{it.actor}</div>
            {it.note && <div className="text-[13px] text-[#57564F] mt-0.5 leading-relaxed">{it.note}</div>}
          </li>
        );
      })}
    </ol>
  );
}

/* ============================================================
   PROJECT LIST
   ============================================================ */
function ProjectList({ projects, onView, listState, setListState }) {
  const { search, statusFilter, page } = listState;
  const PAGE_SIZE = 10;

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const set = (k, v) => setListState((s) => ({ ...s, [k]: v, page: k !== 'page' ? 1 : v }));

  const thCls = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-3 bg-[#FAFAF8] border-b border-[#C9C9C3] text-left whitespace-nowrap';
  const tdCls = 'px-4 py-3.5 border-b border-[#DEDEDA] align-middle';

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Projects']} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1180px] mx-auto">

          {/* page header */}
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div>
              <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">Projects</h1>
              <p className="text-[13px] text-[#57564F] mt-0.5">{projects.length} projects · {projects.filter(p => p.status === 'Active').length} active</p>
            </div>
            <button className={PD_PRIMARY}>
              <Icon name="plus" className="w-[18px] h-[18px]" strokeWidth={2} /> New Project
            </button>
          </div>

          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84837C]"><Icon name="search" className="w-[15px] h-[15px]" /></span>
              <input
                className="w-full h-9 rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] pl-9 pr-3 focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35"
                placeholder="Search by project name, ID or client…"
                value={search}
                onChange={(e) => set('search', e.target.value)}
              />
            </div>
            <select
              className="h-9 rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] pl-3 pr-9 appearance-none cursor-pointer focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35"
              style={PD_SELECT_BG}
              value={statusFilter}
              onChange={(e) => set('statusFilter', e.target.value)}
            >
              <option value="">All statuses</option>
              <option>Active</option>
              <option>Completed</option>
              <option>On Hold</option>
            </select>
          </div>

          {/* table */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
            {shown.length === 0 ? (
              <div className="px-6 py-16 text-center text-[14px] text-[#84837C]">No projects match your search.</div>
            ) : (
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr>
                    <th className={thCls}>Project</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls + ' hidden md:table-cell'}>Active Stage</th>
                    <th className={thCls + ' hidden lg:table-cell'}>PM</th>
                    <th className={thCls + ' hidden lg:table-cell'}>Progress</th>
                    <th className={thCls + ' hidden md:table-cell'}>Target</th>
                    <th className={thCls} />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((p) => {
                    const active = p.stages.find((s) => s.status === 'In Progress');
                    const pct = Math.round((p.stagesCompleted / 4) * 100);
                    return (
                      <tr key={p.id} className="hover:bg-[#FAFAF8] group">
                        <td className={tdCls}>
                          <div className="font-mono text-[12px] text-[#84837C]">{p.id}</div>
                          <div className="font-semibold text-[#1A1A17] mt-0.5">{p.name}</div>
                          <div className="text-[12px] text-[#57564F] mt-0.5">{p.client}</div>
                        </td>
                        <td className={tdCls}>
                          <PDProjectBadge status={p.status} />
                        </td>
                        <td className={tdCls + ' hidden md:table-cell'}>
                          {active ? (
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: PD_STAGE[active.n].color }}>
                              <span className="w-2 h-2 rounded-full po-pulse-dot flex-none" style={{ background: PD_STAGE[active.n].color }} />
                              {PD_STAGE[active.n].name}
                            </span>
                          ) : (
                            <span className="text-[13px] text-[#84837C]">{p.status === 'Completed' ? 'All done' : '—'}</span>
                          )}
                        </td>
                        <td className={tdCls + ' hidden lg:table-cell text-[13px] text-[#1A1A17]'}>{p.pm}</td>
                        <td className={tdCls + ' hidden lg:table-cell'}>
                          <div className="flex items-center gap-2.5">
                            <div className="flex-1 h-1.5 rounded-full bg-[#F0F0EE] overflow-hidden min-w-[60px]">
                              <div className="h-full rounded-full bg-[#C2410C] transition-all" style={{ width: pct + '%' }} />
                            </div>
                            <span className="font-mono text-[12px] text-[#84837C] w-8 text-right flex-none">{pct}%</span>
                          </div>
                        </td>
                        <td className={tdCls + ' hidden md:table-cell font-mono text-[13px] text-[#57564F]'}>{fmtDate(p.targetDate)}</td>
                        <td className={tdCls}>
                          <button
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1D4ED8] hover:bg-[#E9F0FF] px-2.5 py-1.5 rounded-md"
                            onClick={() => onView(p)}
                          >
                            <Icon name="eye" className="w-[15px] h-[15px]" /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-[13px]">
              <span className="text-[#84837C]">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="flex items-center gap-2">
                <button className={PD_SECONDARY + ' px-3 py-1.5 text-[13px]'} disabled={page === 1} onClick={() => set('page', page - 1)}>Previous</button>
                <span className="font-mono text-[#84837C]">{page} / {totalPages}</span>
                <button className={PD_SECONDARY + ' px-3 py-1.5 text-[13px]'} disabled={page === totalPages} onClick={() => set('page', page + 1)}>Next</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL — OVERVIEW TAB
   ============================================================ */
function PDOverviewTab({ project }) {
  const pct = Math.round((project.stagesCompleted / 4) * 100);
  const cards = [
    { label: 'Project ID',    val: project.id,               mono: true  },
    { label: 'Status',        val: null,  custom: <PDProjectBadge status={project.status} /> },
    { label: 'Project Manager', val: project.pm,             mono: false },
    { label: 'Planning Officer', val: project.planningOfficer, mono: false },
    { label: 'Start Date',    val: fmtDate(project.startDate), mono: true },
    { label: 'Target Date',   val: fmtDate(project.targetDate), mono: true },
    { label: 'Active Stage',  val: null,
      custom: project.activeStage
        ? <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: PD_STAGE[project.activeStage].color }}>
            <span className="w-2 h-2 rounded-full po-pulse-dot flex-none" style={{ background: PD_STAGE[project.activeStage].color }} />
            {PD_STAGE[project.activeStage].name}
          </span>
        : <span className="text-[14px] font-semibold text-[#15803D]">All stages complete</span>
    },
    { label: 'Linked POs',   val: project.pos.length + ' PO', mono: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="border border-[#DEDEDA] rounded-lg bg-white px-4 py-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{c.label}</div>
            <div className="mt-1.5">
              {c.custom || (
                <span className={'text-[15px] text-[#1A1A17] font-semibold ' + (c.mono ? 'font-mono tabular-nums' : '')}>{c.val}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* progress */}
      <div className="border border-[#DEDEDA] rounded-lg bg-white px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-[#1A1A17]">Overall progress</span>
          <span className="text-[13px] font-mono font-semibold text-[#C2410C]">{project.stagesCompleted} / 4 stages</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#F0F0EE] overflow-hidden">
          <div className="h-full rounded-full bg-[#C2410C] transition-all duration-500" style={{ width: pct + '%' }} />
        </div>
        <div className="flex justify-between mt-2">
          {project.stages.map((s) => {
            const col = PD_STAGE[s.n];
            return (
              <div key={s.n} className="flex flex-col items-center gap-1 flex-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.status === 'Completed' ? col.color : s.status === 'In Progress' ? col.color : '#E5E5E1' }} />
                <span className="text-[10px] font-mono text-[#84837C] hidden sm:block">{col.name.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL — STAGE TIMELINE TAB
   ============================================================ */
function PDStageTimelineTab({ project, role, notify, stagesState, onMarkComplete, onAddComment }) {
  const access = PD_ROLE_ACCESS[role] || PD_ROLE_ACCESS['Viewer'];
  const [commentDraft, setCommentDraft] = React.useState({});
  const [showCommentBox, setShowCommentBox] = React.useState({});

  const submitComment = (n) => {
    const text = (commentDraft[n] || '').trim();
    if (!text) return;
    onAddComment(n, text);
    setCommentDraft((d) => ({ ...d, [n]: '' }));
    setShowCommentBox((b) => ({ ...b, [n]: false }));
    notify('Comment added ✓');
  };

  return (
    <div className="flex flex-col gap-3">
      {stagesState.map((stage, i) => {
        const col   = PD_STAGE[stage.n];
        const isOwn = access.ownStage === stage.n;
        const hide  = access.ownStage && !isOwn;
        if (hide) return null;

        const isActive   = stage.status === 'In Progress';
        const isDone     = stage.status === 'Completed';
        const canComplete = access.canMarkComplete && isActive;
        const canComment  = (access.canAddComment || isOwn) && (isActive || isDone);

        return (
          <div key={stage.n} className="flex gap-3">
            {/* connector */}
            <div className="flex flex-col items-center flex-none" style={{ width: 32 }}>
              <div className="w-8 h-8 rounded-full grid place-items-center flex-none z-10"
                style={{ background: isDone ? col.color : isActive ? col.color : '#E5E5E1' }}>
                {isDone
                  ? <Icon name="check" className="w-4 h-4 text-white" strokeWidth={2.4} />
                  : isActive
                  ? <span className="w-2.5 h-2.5 rounded-full bg-white po-pulse-dot" />
                  : <span className="w-2 h-2 rounded-full bg-[#C9C9C3]" />}
              </div>
              {i < stagesState.length - 1 && (
                <div className="flex-1 w-0.5 my-1 min-h-[24px]" style={{ background: isDone ? col.color + '50' : '#E5E5E1' }} />
              )}
            </div>

            {/* card */}
            <div className={'flex-1 min-w-0 mb-2 border rounded-lg overflow-hidden ' + (isActive ? 'border-[#DEDEDA] shadow-[0_0_0_3px_rgba(194,65,12,0.07)]' : 'border-[#DEDEDA]')}>
              {/* card header */}
              <div className={'px-4 py-3 flex items-center justify-between gap-3 flex-wrap ' + (isActive ? '' : 'opacity-' + (isDone ? '100' : '60'))}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full grid place-items-center text-white text-[11px] font-bold font-mono flex-none" style={{ background: col.color }}>
                    {stage.n}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-semibold text-[#1A1A17]">{col.name}</span>
                      {isActive && <span className="text-[9.5px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 font-mono" style={{ color: col.color, background: col.bg }}>Active</span>}
                    </div>
                    <div className="text-[12px] text-[#57564F] mt-0.5 font-mono">{stage.assignee} · {stage.assigneeRole}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <PhasePill status={stage.status} />
                  {canComplete && (
                    <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold bg-[#15803D] hover:bg-[#11652F] text-white px-3 py-1.5 rounded-md" onClick={() => { onMarkComplete(stage.n); notify('Stage marked complete ✓'); }}>
                      <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.2} /> Mark Complete
                    </button>
                  )}
                  {access.canReassign && stage.status === 'Pending' && (
                    <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1D4ED8] hover:bg-[#E9F0FF] px-2.5 py-1.5 rounded-md border border-[#DEDEDA]" onClick={() => notify('Reassign stage owner')}>
                      <Icon name="edit" className="w-3.5 h-3.5" /> Reassign
                    </button>
                  )}
                </div>
              </div>

              {/* dates + comment */}
              {(isDone || isActive) && (
                <div className="px-4 py-3 bg-[#FAFAF8] border-t border-[#DEDEDA] flex flex-col gap-2.5">
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[13px]">
                    {stage.startDate && <span className="text-[#57564F]"><span className="font-mono text-[#84837C] text-[11px] uppercase tracking-wide mr-1.5">Started</span>{fmtDate(stage.startDate)}</span>}
                    {stage.endDate   && <span className="text-[#57564F]"><span className="font-mono text-[#84837C] text-[11px] uppercase tracking-wide mr-1.5">Completed</span>{fmtDate(stage.endDate)}</span>}
                  </div>
                  {stage.comment && (
                    <div className="text-[13px] text-[#57564F] leading-relaxed border-l-2 pl-3" style={{ borderColor: col.color }}>
                      {stage.comment}
                    </div>
                  )}
                  {canComment && (
                    <div>
                      {showCommentBox[stage.n] ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <textarea
                            className="w-full min-h-[64px] rounded-md border border-[#C9C9C3] bg-white text-[13px] text-[#1A1A17] px-3 py-2 resize-none focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35"
                            placeholder="Add a comment…"
                            value={commentDraft[stage.n] || ''}
                            onChange={(e) => setCommentDraft((d) => ({ ...d, [stage.n]: e.target.value }))}
                          />
                          <div className="flex gap-2">
                            <button className="text-[13px] font-semibold bg-[#1A1A17] hover:bg-[#3C3A33] text-white px-3 py-1.5 rounded-md" onClick={() => submitComment(stage.n)}>Save comment</button>
                            <button className="text-[13px] font-semibold text-[#57564F] hover:bg-[#F0F0EE] px-3 py-1.5 rounded-md" onClick={() => setShowCommentBox((b) => ({ ...b, [stage.n]: false }))}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button className="text-[12px] font-semibold text-[#1D4ED8] hover:underline flex items-center gap-1" onClick={() => setShowCommentBox((b) => ({ ...b, [stage.n]: true }))}>
                          <Icon name="plus" className="w-3.5 h-3.5" strokeWidth={2} /> Add comment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   DETAIL — PURCHASE ORDERS TAB
   ============================================================ */
function PDPurchaseOrdersTab({ project, notify }) {
  const th = 'text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3] text-left';
  const td = 'px-4 py-3.5 border-b border-[#DEDEDA] align-middle';
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr>
            <th className={th}>PO Number</th>
            <th className={th + ' hidden md:table-cell'}>Vendor</th>
            <th className={th + ' text-right'}>Amount</th>
            <th className={th}>PO Status</th>
            <th className={th + ' hidden lg:table-cell'}>Created By</th>
            <th className={th + ' hidden lg:table-cell'}>Approval</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {project.pos.map((p, i) => (
            <tr key={i} className="hover:bg-[#FAFAF8]">
              <td className={td}>
                <span className="font-mono font-semibold text-[#1A1A17] text-[13px]">{p.no}</span>
                <div className="text-[12px] text-[#57564F] mt-0.5 truncate max-w-[200px]">{p.title}</div>
              </td>
              <td className={td + ' hidden md:table-cell text-[13px] text-[#57564F]'}>{p.vendor}</td>
              <td className={td + ' text-right font-mono tabular-nums font-semibold text-[#1A1A17] whitespace-nowrap'}>{money(p.amount, 'INR')}</td>
              <td className={td}><StatusPill status={p.status} /></td>
              <td className={td + ' hidden lg:table-cell text-[13px] text-[#57564F]'}>{p.createdBy}</td>
              <td className={td + ' hidden lg:table-cell'}>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold rounded-full px-2.5 py-0.5" style={{ color: '#15803D', background: '#E6F6EC' }}>
                  <Icon name="check" className="w-3 h-3" strokeWidth={2.6} /> {p.approvalStatus}
                </span>
              </td>
              <td className={td}>
                <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1D4ED8] hover:bg-[#E9F0FF] px-2.5 py-1.5 rounded-md" onClick={() => notify('Open PO · ' + p.no)}>
                  <Icon name="eye" className="w-[14px] h-[14px]" /> Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   PROJECT DETAIL — main view
   ============================================================ */
function ProjectDetail({ project, onBack, notify }) {
  const [role, setRole] = React.useState('Planning Officer');
  const [tab, setTab]   = React.useState('Overview');
  const [roleOpen, setRoleOpen] = React.useState(false);

  /* local mutable copies so Mark Complete + Add Comment work */
  const [stages, setStages] = React.useState(() => project.stages.map((s) => ({ ...s })));
  const [activity, setActivity] = React.useState(() => [...project.activity]);
  const col = { n: 1 };

  const access   = PD_ROLE_ACCESS[role] || PD_ROLE_ACCESS['Viewer'];
  const visibleTabs = access.tabs;

  /* keep tab valid when role changes */
  React.useEffect(() => {
    if (!visibleTabs.includes(tab)) setTab(visibleTabs[0]);
  }, [role]);

  const handleMarkComplete = (n) => {
    setStages((prev) => {
      const next = prev.map((s) => s.n === n ? { ...s, status: 'Completed', endDate: '2026-06-28' } : s);
      const nextIdx = next.findIndex((s) => s.status === 'Pending');
      if (nextIdx !== -1) next[nextIdx] = { ...next[nextIdx], status: 'In Progress', startDate: '2026-06-28' };
      return next;
    });
    setActivity((prev) => [{
      type: 'stage_completed', label: 'Stage Completed',
      actor: role + ' (you)', time: '28 Jun 2026 · now',
      note: PD_STAGE[n].name + ' marked as complete.',
    }, ...prev]);
  };

  const handleAddComment = (n, text) => {
    setStages((prev) => prev.map((s) => s.n === n ? { ...s, comment: text } : s));
    setActivity((prev) => [{
      type: 'comment', label: 'Comment',
      actor: role + ' (you)', time: '28 Jun 2026 · now',
      note: text,
    }, ...prev]);
  };

  const tabCount = { 'Stage Timeline': stages.length, 'Purchase Orders': project.pos.length, 'Activity': activity.length };
  const activeStage = stages.find((s) => s.status === 'In Progress');
  const completedCount = stages.filter((s) => s.status === 'Completed').length;
  const pct = Math.round((completedCount / 4) * 100);

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Projects', project.id]} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1180px] mx-auto">

          {/* role switcher bar */}
          <div className="flex items-center gap-3 bg-white border border-[#DEDEDA] rounded-lg px-4 py-2.5 mb-5 flex-wrap shadow-[0_1px_2px_rgba(26,26,23,0.04)]">
            <Icon name="lock" className="w-[16px] h-[16px] text-[#C2410C] flex-none" />
            <span className="text-[13px] font-semibold text-[#1A1A17]">Preview as role</span>
            <div className="relative">
              <button
                className={'inline-flex items-center gap-2 h-8 rounded-md border bg-white px-3 text-[13px] font-semibold text-[#1A1A17] ' + (roleOpen ? 'border-[#C2410C] ring-[3px] ring-[#C2410C]/35' : 'border-[#C9C9C3] hover:border-[#84837C]')}
                onClick={() => setRoleOpen((o) => !o)}
              >
                {role} <Icon name="chevron" className={'w-3 h-3 text-[#84837C] transition-transform ' + (roleOpen ? 'rotate-180' : '')} />
              </button>
              {roleOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[210px] bg-white border border-[#DEDEDA] rounded-md shadow-[0_8px_24px_rgba(26,26,23,0.14)] py-1">
                  {PD_ROLES.map((r) => (
                    <button key={r} className={'w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] ' + (r === role ? 'bg-[#FCEEE4] text-[#C2410C] font-semibold' : 'text-[#1A1A17] hover:bg-[#FAFAF8]')}
                      onClick={() => { setRole(r); setRoleOpen(false); }}>
                      {r === role ? <Icon name="check" className="w-4 h-4 flex-none" /> : <span className="w-4 h-4 flex-none" />}
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[12px] text-[#84837C] ml-auto hidden sm:block">Tabs and actions change per role</span>
          </div>

          {/* project header card */}
          <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-6 mb-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#57564F] hover:text-[#1A1A17] hover:bg-[#F0F0EE] px-2 py-1 rounded-md -ml-2" onClick={onBack}>
                    <Icon name="chevron" className="w-4 h-4 rotate-90" /> Back
                  </button>
                  <span className="text-[#C9C9C3]">/</span>
                  <span className="font-mono text-[13px] text-[#84837C]">{project.id}</span>
                  <PDProjectBadge status={project.status} />
                </div>
                <h1 className="text-[22px] font-semibold text-[#1A1A17] tracking-tight">{project.name}</h1>
                <div className="text-[14px] text-[#57564F] mt-0.5">{project.client}</div>
              </div>
              <div className="flex items-center gap-2.5 flex-none">
                {access.canMarkComplete && activeStage && (
                  <span className="text-[13px] text-[#57564F]">Active: <span className="font-semibold" style={{ color: PD_STAGE[activeStage.n].color }}>{PD_STAGE[activeStage.n].name}</span></span>
                )}
                <button className={PD_SECONDARY + ' text-[13px] px-3 py-2'} onClick={() => notify('Download project report')}><Icon name="documents" className="w-[16px] h-[16px]" /> Report</button>
              </div>
            </div>

            {/* key facts strip */}
            <div className="mt-5 pt-5 border-t border-[#DEDEDA] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-4">
              <PDFact label="Project Manager">{project.pm}</PDFact>
              <PDFact label="Planning Officer">{project.planningOfficer}</PDFact>
              <PDFact label="Start Date" mono>{fmtDate(project.startDate)}</PDFact>
              <PDFact label="Target Date" mono>{fmtDate(project.targetDate)}</PDFact>
              <PDFact label="Linked PO" mono>{project.pos.map(p => p.no).join(', ')}</PDFact>
              <PDFact label="Progress" mono>{pct}% · {completedCount}/4 stages</PDFact>
            </div>

            {/* overall progress bar */}
            <div className="mt-4">
              <div className="h-1.5 rounded-full bg-[#F0F0EE] overflow-hidden">
                <div className="h-full rounded-full bg-[#C2410C] transition-all duration-500" style={{ width: pct + '%' }} />
              </div>
              <div className="flex mt-1.5">
                {stages.map((s) => (
                  <div key={s.n} className="flex-1 text-center">
                    <span className="text-[10px] font-mono text-[#84837C]" style={{ color: s.status === 'Pending' ? '#C9C9C3' : PD_STAGE[s.n].color }}>
                      S{s.n}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* two-column body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

            {/* main body: tabs */}
            <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
              <div className="px-5 border-b border-[#DEDEDA] flex gap-1 overflow-x-auto">
                {visibleTabs.map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={'text-[14px] font-semibold px-3.5 py-3 border-b-2 -mb-px whitespace-nowrap ' + (tab === t ? 'text-[#C2410C] border-[#C2410C]' : 'text-[#57564F] border-transparent hover:text-[#1A1A17]')}>
                    {t}
                    {tabCount[t] != null && <span className="font-mono text-[12px] text-[#84837C] ml-1.5">{tabCount[t]}</span>}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {tab === 'Overview'       && <PDOverviewTab project={{ ...project, stages, activeStage: stages.find(s => s.status === 'In Progress')?.n ?? null, stagesCompleted: stages.filter(s => s.status === 'Completed').length }} />}
                {tab === 'Stage Timeline' && <PDStageTimelineTab project={project} role={role} notify={notify} stagesState={stages} onMarkComplete={handleMarkComplete} onAddComment={handleAddComment} />}
                {tab === 'Purchase Orders' && <PDPurchaseOrdersTab project={project} notify={notify} />}
                {tab === 'Activity'       && <div><h3 className="text-[16px] font-semibold text-[#1A1A17] mb-4">Activity log</h3><PDActivityTimeline items={activity} /></div>}
              </div>
            </div>

            {/* right rail: compact activity */}
            <aside className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-5 lg:sticky lg:top-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#1A1A17]">Recent activity</h3>
                <button className="text-[12px] font-semibold text-[#1D4ED8] hover:underline" onClick={() => setTab('Activity')}>View all</button>
              </div>
              <PDActivityTimeline items={activity.slice(0, 4)} />
              <div className="mt-4 pt-4 border-t border-[#DEDEDA] text-[12px] font-mono text-[#84837C] flex items-center gap-2">
                <Icon name="quality" className="w-4 h-4 text-[#15803D]" /> {activity.length} events · {stages.filter(s => s.status === 'Completed').length} stages done
              </div>
            </aside>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN PROJECTS — orchestrates list ↔ detail
   ============================================================ */
function ScreenProjects({ notify }) {
  const [view, setView]       = React.useState('list');
  const [selected, setSelected] = React.useState(null);
  const [listState, setListState] = React.useState({ search: '', statusFilter: '', page: 1 });

  const handleView = (project) => { setSelected(project); setView('detail'); };
  const handleBack = () => { setSelected(null); setView('list'); };

  if (view === 'detail' && selected) {
    return <ProjectDetail project={selected} onBack={handleBack} notify={notify} />;
  }
  return <ProjectList projects={PD_PROJECTS} onView={handleView} listState={listState} setListState={setListState} />;
}

window.ScreenProjects = ScreenProjects;
