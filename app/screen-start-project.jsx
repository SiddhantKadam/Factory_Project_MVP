/* ============================================================
   START PROJECT — Planning Officer sets up a project from
   an approved PO, assigns PM + stage leads, then launches.

   Globals from shell.jsx:
     Sidebar, TopBar, Icon, StatusPill, RoleBadge,
     money, fmtDate, PO_DATA, ROLE_LENS
   Globals from phase-shared.jsx:
     PhasePill, Progress
   ============================================================ */

/* ---- shared style tokens (prefixed SP_ to avoid clashes) ---- */
const SP_INPUT = 'w-full h-10 rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35 transition-colors';
const SP_SELECT = SP_INPUT + ' pr-9 appearance-none cursor-pointer';
const SP_SELECT_BG = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
};
const SP_PRIMARY = 'inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md transition-colors';
const SP_SECONDARY = 'inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md transition-colors';

/* ---- mock data ---- */
const SP_MANAGERS = [
  { name: 'R. Okafor',    initials: 'RO', dept: 'Structural' },
  { name: 'S. Iyer',      initials: 'SI', dept: 'Mechanical' },
  { name: 'T. Nakamura',  initials: 'TN', dept: 'Civil' },
  { name: 'P. Fernandes', initials: 'PF', dept: 'Structural' },
];

const SP_STAGE_USERS = [
  { name: 'Rajesh Kumar',  role: 'Production Supervisor', initials: 'RK' },
  { name: 'Anil Sharma',   role: 'Beamline Operator',     initials: 'AS' },
  { name: 'Priya Nair',    role: 'Fit-Up Technician',     initials: 'PN' },
  { name: 'K. Verma',      role: 'Quality Inspector',     initials: 'KV' },
  { name: 'M. Patel',      role: 'Production Lead',       initials: 'MP' },
  { name: 'D. Joshi',      role: 'Senior Fabricator',     initials: 'DJ' },
];

const SP_STAGE_DEFS = [
  { n: 1, name: 'Cutting Phase',  color: '#C2410C', bg: '#FCEEE4', icon: 'production', desc: 'Raw material cutting and piece tagging' },
  { n: 2, name: 'Beamline Phase', color: '#1D4ED8', bg: '#E9F0FF', icon: 'projects',   desc: 'Beam fabrication and shot-blasting' },
  { n: 3, name: 'Fit-Up Phase',   color: '#B45309', bg: '#FBF1DD', icon: 'quality',    desc: 'Structural fit-up, welding and alignment' },
  { n: 4, name: 'QC Phase',       color: '#15803D', bg: '#E6F6EC', icon: 'quality',    desc: 'Quality inspection and final sign-off' },
];

/* ============================================================
   FORM FIELD WRAPPER
   ============================================================ */
function SPField({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#1A1A17]">
        {label}{required && <span className="text-[#B91C1C] ml-0.5">*</span>}
      </label>
      {children}
      {error
        ? <span className="text-[11px] text-[#B91C1C] font-medium">{error}</span>
        : hint
        ? <span className="text-[12px] text-[#57564F]">{hint}</span>
        : null}
    </div>
  );
}

/* ============================================================
   PO PICKER — dropdown + preview strip
   ============================================================ */
function SPPOPicker({ value, onChange, error }) {
  const approved = PO_DATA.filter((p) => p.status === 'Approved');
  const selected = approved.find((p) => p.no === value);
  const borderCls = error ? ' border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/35' : '';

  return (
    <div className="flex flex-col gap-2">
      <select
        className={SP_SELECT + borderCls}
        style={SP_SELECT_BG}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select an approved PO…</option>
        {approved.map((p) => (
          <option key={p.no} value={p.no}>{p.no} — {p.title}</option>
        ))}
      </select>
      {selected && (
        <div className="flex items-center gap-3 bg-[#FAFAF8] border border-[#DEDEDA] rounded-md px-3 py-2.5 text-[13px]">
          <Icon name="po" className="w-4 h-4 text-[#84837C] flex-none" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[#1A1A17] truncate">{selected.title}</div>
            <div className="text-[#84837C] font-mono mt-0.5">{selected.client} · {money(selected.amount, 'INR')}</div>
          </div>
          <StatusPill status="Approved" />
        </div>
      )}
      {error && <span className="text-[11px] text-[#B91C1C] font-medium">{error}</span>}
    </div>
  );
}

/* ============================================================
   STAGE ASSIGNMENT CARD
   ============================================================ */
function SPStageCard({ stage, assignee, onChange, showError }) {
  const assigned = assignee !== '';
  const user = SP_STAGE_USERS.find((u) => u.name === assignee);

  return (
    <div className={
      'bg-white border rounded-lg overflow-hidden transition-all ' +
      (assigned ? 'border-[#DEDEDA] shadow-[0_1px_2px_rgba(26,26,23,0.05)]' : showError ? 'border-[#EDC9C9]' : 'border-[#DEDEDA]')
    }>
      {/* stage header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DEDEDA]" style={{ background: stage.bg + '66' }}>
        <div
          className="w-8 h-8 rounded-full grid place-items-center text-white text-[13px] font-bold font-mono flex-none"
          style={{ background: stage.color }}
        >
          {stage.n}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-[#1A1A17]">{stage.name}</div>
          <div className="text-[12px] text-[#57564F] mt-0.5">{stage.desc}</div>
        </div>
        {assigned
          ? <span className="flex-none w-5 h-5 rounded-full bg-[#15803D] grid place-items-center"><Icon name="check" className="w-3 h-3 text-white" strokeWidth={2.6} /></span>
          : <span className="flex-none text-[11px] font-mono text-[#B91C1C] font-semibold">Required</span>}
      </div>

      {/* assignee section */}
      <div className="px-4 py-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#84837C] mb-2">Assign responsible person</div>
        <select
          className={SP_SELECT + (showError && !assigned ? ' border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/35' : '')}
          style={SP_SELECT_BG}
          value={assignee}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select person…</option>
          {SP_STAGE_USERS.map((u) => (
            <option key={u.name} value={u.name}>{u.name} · {u.role}</option>
          ))}
        </select>
        {assigned && user && (
          <div className="flex items-center gap-2 mt-2.5">
            <span
              className="w-7 h-7 rounded-full grid place-items-center text-white text-[11px] font-bold font-mono flex-none"
              style={{ background: stage.color }}
            >
              {user.initials}
            </span>
            <div>
              <div className="text-[13px] font-semibold text-[#1A1A17]">{user.name}</div>
              <div className="text-[11px] text-[#84837C]">{user.role}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SUCCESS / LAUNCHED STATE
   ============================================================ */
function SPLaunchedView({ form, assignees, onBackToProjects }) {
  const po = PO_DATA.find((p) => p.no === form.poNo);
  const projectId = 'PROJ-2026-' + String(Math.floor(Math.random() * 900) + 100).padStart(4, '0');

  return (
    <div className="max-w-[680px] mx-auto">
      {/* success banner */}
      <div className="flex items-center gap-3.5 bg-[#E6F6EC] border border-[#C3E6CC] rounded-xl px-5 py-4 mb-7">
        <div className="w-10 h-10 rounded-full bg-[#15803D] grid place-items-center flex-none">
          <Icon name="check" className="w-6 h-6 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-[#15803D]">Project started successfully</div>
          <div className="text-[13px] text-[#57564F] mt-0.5">
            <span className="font-semibold text-[#1A1A17]">{form.projectName}</span> is now active. Cutting Phase has begun.
          </div>
        </div>
      </div>

      {/* project card */}
      <div className="bg-white border border-[#DEDEDA] rounded-xl shadow-[0_1px_3px_rgba(26,26,23,0.06)] overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-[#DEDEDA]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-[13px] font-semibold text-[#84837C]">{projectId}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ color: '#15803D', background: '#E6F6EC' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] po-pulse-dot" /> Active
                </span>
              </div>
              <h2 className="text-[20px] font-semibold text-[#1A1A17] tracking-tight">{form.projectName}</h2>
              <div className="text-[14px] text-[#57564F] mt-0.5">{po ? po.client : form.client}</div>
            </div>
            <RoleBadge role="Planning Officer" dot={ROLE_LENS['Planning Officer'].dot} />
          </div>

          <div className="mt-5 pt-4 border-t border-[#DEDEDA] grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
            {[
              { label: 'Linked PO',       val: form.poNo,           mono: true },
              { label: 'Project Manager', val: form.pm,             mono: false },
              { label: 'Target Date',     val: fmtDate(form.targetDate) || '—', mono: true },
              { label: 'Stages',          val: '4 stages',          mono: true },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C]">{f.label}</span>
                <span className={'text-[13px] text-[#1A1A17] font-semibold ' + (f.mono ? 'font-mono tabular-nums' : '')}>{f.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* stage pipeline */}
        <div className="px-6 py-5">
          <div className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#84837C] mb-4">Stage pipeline</div>
          <div className="flex flex-col gap-3">
            {SP_STAGE_DEFS.map((stage, i) => {
              const isFirst = i === 0;
              const status = isFirst ? 'In Progress' : 'Pending';
              const assigneeName = assignees[stage.n];
              const user = SP_STAGE_USERS.find((u) => u.name === assigneeName);
              return (
                <div key={stage.n} className="flex items-center gap-3">
                  {/* connector dot */}
                  <div className="flex flex-col items-center flex-none" style={{ width: 28 }}>
                    <div
                      className="w-7 h-7 rounded-full grid place-items-center"
                      style={{ background: isFirst ? stage.color : '#E5E5E1' }}
                    >
                      {isFirst
                        ? <span className="w-2.5 h-2.5 rounded-full bg-white po-pulse-dot" />
                        : <span className="w-2 h-2 rounded-full bg-[#C9C9C3]" />}
                    </div>
                    {i < SP_STAGE_DEFS.length - 1 && (
                      <div className="w-0.5 h-4 mt-1" style={{ background: isFirst ? stage.color + '40' : '#E5E5E1' }} />
                    )}
                  </div>
                  {/* stage info */}
                  <div className={'flex-1 flex items-center justify-between gap-3 py-2 px-3.5 rounded-lg ' + (isFirst ? 'border border-[#DEDEDA] bg-[#FAFAF8]' : 'opacity-60')}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="text-[11px] font-bold font-mono rounded-full px-2 py-0.5 flex-none"
                        style={{ color: stage.color, background: stage.bg }}
                      >
                        S{stage.n}
                      </span>
                      <span className="text-[14px] font-semibold text-[#1A1A17]">{stage.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-none">
                      {user && (
                        <span className="text-[12px] text-[#57564F] hidden sm:block">{user.name}</span>
                      )}
                      <PhasePill status={status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* footer actions */}
      <div className="flex items-center gap-3">
        <button className={SP_SECONDARY} onClick={onBackToProjects}>Back to Projects</button>
        <button className={SP_PRIMARY} onClick={onBackToProjects}>
          <Icon name="production" className="w-[18px] h-[18px]" /> Go to Cutting Phase
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN SCREEN
   ============================================================ */
function ScreenStartProject({ notify, goTo }) {
  const [launched, setLaunched] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(false);

  const [form, setForm] = React.useState({
    poNo: '', projectName: '', client: '', pm: '', targetDate: '',
  });
  const [assignees, setAssignees] = React.useState({ 1: '', 2: '', 3: '', 4: '' });

  const setField = (k) => (e) => {
    const val = e.target.value;
    if (k === 'poNo') {
      const po = PO_DATA.find((p) => p.no === val);
      setForm((f) => ({
        ...f,
        poNo: val,
        projectName: po ? po.title : f.projectName,
        client: po ? po.client : '',
      }));
    } else {
      setForm((f) => ({ ...f, [k]: val }));
    }
  };

  const setAssignee = (n) => (val) => setAssignees((a) => ({ ...a, [n]: val }));

  const allStagesAssigned = SP_STAGE_DEFS.every((s) => assignees[s.n] !== '');
  const canLaunch = form.poNo && form.projectName.trim() && form.pm && allStagesAssigned;

  const handleLaunch = () => {
    if (!canLaunch) { setShowErrors(true); return; }
    notify('Project started ✓');
    setLaunched(true);
  };

  const inputErr = (k) => showErrors && !form[k].trim()
    ? 'This field is required'
    : null;

  if (launched) {
    return (
      <div className="flex flex-col h-full">
        <TopBar crumb={['Home', 'Projects', 'Start New Project']} />
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <SPLaunchedView form={form} assignees={assignees} onBackToProjects={() => goTo && goTo('list')} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Projects', 'Start New Project']} />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto w-full max-w-[720px]">

          {/* page header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#B45309]">Projects</div>
              <span className="text-[#C9C9C3] text-[12px]">/</span>
              <RoleBadge role="Planning Officer" dot={ROLE_LENS['Planning Officer'].dot} />
            </div>
            <h1 className="text-[24px] font-semibold text-[#1A1A17] tracking-tight">Start New Project</h1>
            <p className="text-[14px] text-[#57564F] mt-1">Link an approved PO, assign a project manager, and assign a responsible person for each production stage before launching.</p>
          </div>

          {/* ---- SECTION 1: Project Setup ---- */}
          <div className="mb-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#C2410C] text-white grid place-items-center text-[12px] font-bold font-mono flex-none">1</div>
              <h2 className="text-[17px] font-semibold text-[#1A1A17]">Project Setup</h2>
            </div>
          </div>

          <section className="bg-white border border-[#DEDEDA] rounded-xl shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden mb-6">
            <div className="px-6 py-6 flex flex-col gap-5">

              {/* PO selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#1A1A17]">
                  Linked Purchase Order <span className="text-[#B91C1C]">*</span>
                </label>
                <SPPOPicker
                  value={form.poNo}
                  onChange={(val) => {
                    const po = PO_DATA.find((p) => p.no === val);
                    setForm((f) => ({ ...f, poNo: val, projectName: po ? po.title : f.projectName, client: po ? po.client : '' }));
                  }}
                  error={showErrors && !form.poNo ? 'Select an approved PO to continue' : null}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Project Name */}
                <div className="col-span-2">
                  <SPField label="Project Name" required error={inputErr('projectName')}>
                    <input
                      className={SP_INPUT + (showErrors && !form.projectName.trim() ? ' border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/35' : '')}
                      value={form.projectName}
                      onChange={setField('projectName')}
                      placeholder="e.g. Structural Beams — Bay 4"
                    />
                  </SPField>
                </div>

                {/* Client (read-only from PO) */}
                <SPField label="Client / Vendor" hint="Auto-filled from selected PO.">
                  <input
                    className={SP_INPUT + ' bg-[#FAFAF8] text-[#57564F]'}
                    value={form.client}
                    readOnly
                    tabIndex={-1}
                    placeholder="Populated from PO…"
                  />
                </SPField>

                {/* Target date */}
                <SPField label="Target Completion Date">
                  <input
                    type="date"
                    className={SP_INPUT + ' font-mono tabular-nums'}
                    value={form.targetDate}
                    onChange={setField('targetDate')}
                  />
                </SPField>

                {/* PM */}
                <div className="col-span-2">
                  <SPField label="Assign Project Manager" required error={showErrors && !form.pm ? 'Assign a project manager' : null}>
                    <select
                      className={SP_SELECT + (showErrors && !form.pm ? ' border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/35' : '')}
                      style={SP_SELECT_BG}
                      value={form.pm}
                      onChange={setField('pm')}
                    >
                      <option value="">Select project manager…</option>
                      {SP_MANAGERS.map((m) => (
                        <option key={m.name} value={m.name}>{m.name} · {m.dept}</option>
                      ))}
                    </select>
                    {form.pm && (
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="w-7 h-7 rounded-full bg-[#B45309] text-white grid place-items-center text-[11px] font-bold font-mono flex-none"
                        >
                          {SP_MANAGERS.find((m) => m.name === form.pm)?.initials}
                        </span>
                        <div>
                          <div className="text-[13px] font-semibold text-[#1A1A17]">{form.pm}</div>
                          <div className="text-[11px] text-[#84837C]">Project Manager</div>
                        </div>
                        <RoleBadge role="Project Manager" dot={ROLE_LENS['Project Manager'].dot} />
                      </div>
                    )}
                  </SPField>
                </div>
              </div>
            </div>
          </section>

          {/* ---- SECTION 2: Stage Assignment ---- */}
          <div className="mb-4 mt-8">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-full bg-[#C2410C] text-white grid place-items-center text-[12px] font-bold font-mono flex-none">2</div>
              <h2 className="text-[17px] font-semibold text-[#1A1A17]">Stage Assignment</h2>
            </div>
            <p className="text-[13px] text-[#57564F] ml-[34px]">
              Assign a responsible person for each of the {SP_STAGE_DEFS.length} production stages. All stages are required before the project can start.
            </p>
          </div>

          {/* progress indicator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-1.5 rounded-full bg-[#F0F0EE] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#15803D] transition-all duration-300"
                style={{ width: (Object.values(assignees).filter(Boolean).length / SP_STAGE_DEFS.length * 100) + '%' }}
              />
            </div>
            <span className="text-[12px] font-mono text-[#84837C] flex-none">
              {Object.values(assignees).filter(Boolean).length} / {SP_STAGE_DEFS.length} assigned
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {SP_STAGE_DEFS.map((stage) => (
              <SPStageCard
                key={stage.n}
                stage={stage}
                assignee={assignees[stage.n]}
                onChange={setAssignee(stage.n)}
                showError={showErrors}
              />
            ))}
          </div>

          {/* ---- FOOTER ---- */}
          <div className="border-t border-[#DEDEDA] pt-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              {showErrors && !canLaunch && (
                <p className="text-[13px] text-[#B91C1C] font-medium flex items-center gap-1.5">
                  <Icon name="disputes" className="w-4 h-4 flex-none" />
                  Complete all required fields and stage assignments to proceed.
                </p>
              )}
              {canLaunch && (
                <p className="text-[13px] text-[#15803D] font-medium flex items-center gap-1.5">
                  <Icon name="check" className="w-4 h-4 flex-none" strokeWidth={2.2} />
                  Ready to launch — all assignments complete.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <button className={SP_SECONDARY} onClick={() => goTo && goTo('list')}>Cancel</button>
              <button
                className={
                  canLaunch
                    ? SP_PRIMARY
                    : 'inline-flex items-center gap-2 bg-[#FAFAF8] border border-[#DEDEDA] text-[#84837C] font-semibold text-[14px] px-4 py-2.5 rounded-md cursor-not-allowed'
                }
                onClick={handleLaunch}
              >
                <Icon name="production" className="w-[18px] h-[18px]" />
                Start Project
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

window.ScreenStartProject = ScreenStartProject;
