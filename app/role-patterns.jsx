/* ============================================================
   ROLE-AWARENESS PATTERNS — reusable guardrail components + sheet
   ============================================================ */

/* 9 roles → 5 visual lenses (quiet dot encodes the lens) */
const ROLES = [
  { role: 'Admin',             lens: 'Admin',     dot: '#C2410C' },
  { role: 'Finance Officer',   lens: 'Creator',   dot: '#1D4ED8' },
  { role: 'General Manager',   lens: 'Approver',  dot: '#15803D' },
  { role: 'Planning Officer',  lens: 'Project',   dot: '#B45309' },
  { role: 'Project Manager',   lens: 'Project',   dot: '#B45309' },
  { role: 'Quality Head',      lens: 'Read-only', dot: '#84837C' },
  { role: 'Quality Inspector', lens: 'Read-only', dot: '#84837C' },
  { role: 'Dispatch In-charge',lens: 'Read-only', dot: '#84837C' },
  { role: 'Viewer',            lens: 'Read-only', dot: '#84837C' },
];

const LENSES = [
  { lens: 'Admin',     dot: '#C2410C', desc: 'Sees everything, every action — superset.' },
  { lens: 'Creator',   dot: '#1D4ED8', desc: 'Owns PO creation / editing / submission; sees own POs.' },
  { lens: 'Approver',  dot: '#15803D', desc: 'Read-any + approve / reject / revision. Cannot create.' },
  { lens: 'Project',   dot: '#B45309', desc: 'Read-mostly; can “Start project” on an approved PO.' },
  { lens: 'Read-only', dot: '#84837C', desc: 'View + comment / dispute at most. No PO-state actions.' },
];

/* ---------- 1 · ROLE BADGE (reusable) ---------- */
function RoleBadge({ role, dot }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DEDEDA] bg-[#FAFAF8] px-2 py-[3px] text-[12px] font-medium text-[#57564F] whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: dot }}></span>
      {role}
    </span>
  );
}

/* ---------- 2 · PERMISSION-GATED ACTION (reusable) ---------- */
/* allowed → render normally · hidden → render nothing · disabled → grey + tooltip */
function GatedAction({ can, mode = 'hide', label, icon = 'send', variant = 'primary', reason = "You don't have permission to do this" }) {
  if (can) {
    const cls = variant === 'primary'
      ? 'bg-[#C2410C] hover:bg-[#9A330A] text-white'
      : 'bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17]';
    return (
      <button className={'inline-flex items-center gap-2 font-semibold text-[14px] px-4 py-2.5 rounded-md ' + cls}>
        <Icon name={icon} className="w-[18px] h-[18px]" /> {label}
      </button>
    );
  }
  if (mode === 'hide') return null;
  /* disabled-with-reason */
  return (
    <span className="relative inline-flex group">
      <button
        disabled
        aria-disabled="true"
        className="inline-flex items-center gap-2 font-semibold text-[14px] px-4 py-2.5 rounded-md bg-[#FAFAF8] text-[#84837C] border border-[#DEDEDA] cursor-not-allowed"
      >
        <Icon name="lock" className="w-[18px] h-[18px]" /> {label}
      </button>
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-20 w-max max-w-[220px] opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="block bg-[#1A1A17] text-white text-[12px] leading-snug rounded-md px-2.5 py-1.5 shadow-lg">{reason}</span>
        <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#1A1A17]"></span>
      </span>
    </span>
  );
}

/* ---------- 3 · READ-ONLY BANNER (reusable) ---------- */
function ReadOnlyBanner() {
  const [open, setOpen] = React.useState(true);
  if (!open) return (
    <button className="text-[12px] font-semibold text-[#1D4ED8] hover:underline" onClick={() => setOpen(true)}>Show read-only banner</button>
  );
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-[#DEDEDA] bg-[#FAFAF8] px-3.5 py-2.5">
      <Icon name="eye" className="w-[18px] h-[18px] text-[#57564F] flex-none" />
      <span className="text-[13px] text-[#1A1A17]"><span className="font-semibold">You're viewing this in read-only mode.</span> <span className="text-[#57564F]">Your role can view this record but not change its status.</span></span>
      <button className="ml-auto w-7 h-7 rounded-md grid place-items-center text-[#84837C] hover:bg-[#F0F0EE] flex-none" aria-label="Dismiss" onClick={() => setOpen(false)}>
        <Icon name="x" className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ---------- 4 · SCOPE NOTICE (reusable) ---------- */
function ScopeNotice({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-[#57564F]">
      <Icon name="info" className="w-4 h-4 text-[#84837C] flex-none" />
      {children}
    </span>
  );
}

/* ============================================================
   SHEET CHROME
   ============================================================ */
function SheetSection({ num, title, note, children }) {
  return (
    <section className="mt-14 first:mt-0">
      <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-[#DEDEDA]">
        <span className="font-mono text-[13px] font-semibold text-[#C2410C] bg-[#FCEEE4] rounded px-2 py-0.5">{num}</span>
        <h2 className="text-[20px] font-semibold text-[#1A1A17]">{title}</h2>
        {note && <span className="ml-auto text-[13px] text-[#57564F]">{note}</span>}
      </div>
      {children}
    </section>
  );
}
function SubLabel({ children }) {
  return <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#57564F] font-semibold mt-7 first:mt-0 mb-3">{children}</div>;
}
function Panel({ children, className = '' }) {
  return <div className={'bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] p-6 ' + className}>{children}</div>;
}
function Caption({ children }) {
  return (
    <p className="mt-3 text-[13px] text-[#57564F] leading-relaxed flex items-start gap-2">
      <Icon name="info" className="w-4 h-4 text-[#84837C] flex-none mt-0.5" />
      <span>{children}</span>
    </p>
  );
}
function StateTag({ tone, children }) {
  const map = {
    allowed:  { fg: '#15803D', bg: '#E6F6EC' },
    hidden:   { fg: '#57564F', bg: '#F0F0EE' },
    disabled: { fg: '#B45309', bg: '#FBF1DD' },
  }[tone];
  return <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-wide rounded px-2 py-0.5 mb-2.5" style={{ color: map.fg, background: map.bg }}>{children}</span>;
}

/* ---------- mini app-bar (for badge context) ---------- */
function MiniTopbar({ role, dot, name }) {
  return (
    <div className="flex items-center justify-end gap-3 bg-white border border-[#DEDEDA] rounded-lg px-3 py-2.5">
      <button className="w-9 h-9 rounded-md border border-[#DEDEDA] bg-white grid place-items-center text-[#57564F] relative flex-none">
        <Icon name="bell" />
      </button>
      <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full border border-[#DEDEDA] bg-white">
        <span className="w-[30px] h-[30px] rounded-full bg-[#3C3A33] text-white grid place-items-center text-[12px] font-semibold font-mono flex-none">{name.split(' ').map(w => w[0]).join('')}</span>
        <span className="leading-tight">
          <span className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#1A1A17]">{name}</span>
            <RoleBadge role={role} dot={dot} />
          </span>
          <span className="block text-[11px] text-[#84837C] font-medium">Siteflow · Fabrication</span>
        </span>
        <Icon name="chevron" className="w-3 h-3 text-[#84837C]" />
      </div>
    </div>
  );
}

/* ---------- decision-rail thumbnails ---------- */
function RailThumb({ withRail }) {
  return (
    <div className="border border-[#DEDEDA] rounded-lg overflow-hidden bg-[#F4F4F2]">
      <div className="bg-white border-b border-[#DEDEDA] px-3 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
        <span className="text-[11px] font-mono text-[#57564F]">PO-2026-0042 · Review</span>
        <span className="ml-auto"><StatusPill status="Under Review" /></span>
      </div>
      <div className={'p-3 grid gap-3 ' + (withRail ? 'grid-cols-[1fr_92px]' : 'grid-cols-1')}>
        <div className="bg-white border border-[#DEDEDA] rounded-md p-3">
          <div className="h-2.5 w-2/3 rounded-full bg-[#E0E0DC] mb-2.5"></div>
          <div className="flex flex-col gap-1.5">
            {[88, 70, 94, 60].map((w, i) => <div key={i} className="h-1.5 rounded-full bg-[#EDEDEA]" style={{ width: w + '%' }}></div>)}
          </div>
          <div className="mt-3 border border-[#EDEDEA] rounded">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex gap-2 px-2 py-1.5 border-b border-[#F2F2EF] last:border-0">
                <div className="h-1.5 rounded-full bg-[#EDEDEA] w-1/2"></div>
                <div className="h-1.5 rounded-full bg-[#EDEDEA] w-1/6 ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
        {withRail && (
          <div className="bg-white border border-[#DEDEDA] rounded-md p-2 flex flex-col gap-2">
            <div className="h-1.5 w-3/4 rounded-full bg-[#E0E0DC]"></div>
            <div className="h-7 rounded bg-[#15803D]"></div>
            <div className="h-7 rounded border-2 border-[#C2410C] bg-white"></div>
            <div className="h-7 rounded border border-[#EDC9C9] bg-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
function RolePatterns() {
  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#1A1A17]">
      <div className="max-w-[1080px] mx-auto px-8 py-12 pb-28">

        {/* header */}
        <header className="mb-12">
          <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#C2410C] font-semibold mb-2.5">Siteflow · PO Tracker · Role-aware UI</p>
          <h1 className="text-[26px] font-semibold tracking-tight mb-2">Role-Awareness Patterns</h1>
          <p className="text-[16px] text-[#57564F] max-w-[64ch]">Reusable guardrails every PO screen uses to adapt to the signed-in user's role. Plain and utilitarian — these communicate what a user can and can't do, never decorate.</p>
        </header>

        {/* lens legend */}
        <Panel className="!p-5 mb-2">
          <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#57564F] font-semibold mb-3">Nine roles collapse into five visual lenses</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
            {LENSES.map(l => (
              <div key={l.lens} className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-none" style={{ background: l.dot }}></span>
                <div>
                  <span className="text-[14px] font-semibold text-[#1A1A17]">{l.lens}</span>
                  <span className="text-[13px] text-[#57564F]"> — {l.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* 1 · ROLE BADGE */}
        <SheetSection num="01" title="Role badge" note="Quiet, informational — never loud">
          <SubLabel>In context — next to the user's name in the top bar</SubLabel>
          <MiniTopbar role="A. Rahman" dot="#15803D" name="A. Rahman" />
          <SubLabel>All nine roles · dot encodes the lens</SubLabel>
          <Panel className="!p-5">
            <div className="flex flex-wrap gap-2.5">
              {ROLES.map(r => <RoleBadge key={r.role} role={r.role} dot={r.dot} />)}
            </div>
          </Panel>
          <Caption>One badge per role. Styling stays neutral (grey pill, hairline border); only a small coloured dot differentiates the lens, so the badge informs without competing with primary actions.</Caption>
        </SheetSection>

        {/* 2 · PERMISSION-GATED ACTION */}
        <SheetSection num="02" title="Permission-gated action" note="Same button, three resolutions">
          <Panel>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <StateTag tone="allowed">a · allowed</StateTag>
                <div><GatedAction can={true} label="Submit for approval" icon="send" /></div>
                <p className="text-[12px] text-[#57564F] mt-2.5">Rendered as a normal primary / secondary button.</p>
              </div>
              <div className="md:border-l md:border-[#DEDEDA] md:pl-6">
                <StateTag tone="hidden">b · hidden</StateTag>
                <div className="flex items-center h-[42px] rounded-md border border-dashed border-[#C9C9C3] bg-[#FAFAF8] px-3">
                  <span className="text-[12px] font-mono text-[#84837C]">— no button rendered —</span>
                </div>
                <p className="text-[12px] text-[#57564F] mt-2.5">Simply absent. Preferred for actions a role can never perform.</p>
              </div>
              <div className="md:border-l md:border-[#DEDEDA] md:pl-6">
                <StateTag tone="disabled">c · disabled + reason</StateTag>
                <div><GatedAction can={false} mode="disable" label="Submit for approval" /></div>
                <p className="text-[12px] text-[#57564F] mt-2.5">Greyed, with a tooltip on hover. Use only when the slot must stay.</p>
              </div>
            </div>
          </Panel>
          <Caption><span className="font-semibold text-[#1A1A17]">Rule:</span> Hide actions the role can never perform; disable + explain only when the control must remain visible for layout or consistency.</Caption>
        </SheetSection>

        {/* 3 · READ-ONLY BANNER */}
        <SheetSection num="03" title="Read-only banner" note="Top of a record, for view-only roles">
          <Panel>
            <ReadOnlyBanner />
            <div className="mt-4 opacity-70 pointer-events-none select-none">
              <div className="flex items-baseline gap-3">
                <span className="text-[20px] font-mono font-semibold text-[#1A1A17]">PO-2026-0042</span>
                <StatusPill status="Approved" />
              </div>
              <div className="text-[15px] font-semibold text-[#1A1A17] mt-1">Structural steel — Warehouse Block B</div>
              <div className="text-[13px] text-[#57564F]">Acme Infrastructure Ltd.</div>
            </div>
          </Panel>
          <Caption>A slim info bar pinned above the record. Quiet neutral styling with a dismiss affordance — present enough to set expectations, not alarming.</Caption>
        </SheetSection>

        {/* 4 · SCOPE NOTICE */}
        <SheetSection num="04" title="Scope notice" note="One line under a list title">
          <div className="grid md:grid-cols-2 gap-4">
            <Panel>
              <div className="flex items-center gap-2 mb-1"><h3 className="text-[18px] font-semibold">Purchase Orders</h3><RoleBadge role="Finance Officer" dot="#1D4ED8" /></div>
              <ScopeNotice>Showing <span className="font-semibold text-[#1A1A17]">purchase orders you created</span>.</ScopeNotice>
            </Panel>
            <Panel>
              <div className="flex items-center gap-2 mb-1"><h3 className="text-[18px] font-semibold">Purchase Orders</h3><RoleBadge role="General Manager" dot="#15803D" /></div>
              <ScopeNotice>Showing <span className="font-semibold text-[#1A1A17]">all purchase orders</span>.</ScopeNotice>
            </Panel>
          </div>
          <Caption>A single caption directly under the page title makes data scope explicit, so a Creator never assumes they're seeing everything — and an Approver knows they are.</Caption>
        </SheetSection>

        {/* 5 · EMPTY / NO-ACCESS */}
        <SheetSection num="05" title="Empty & no-access states">
          <div className="grid md:grid-cols-2 gap-4">
            {/* a */}
            <Panel>
              <StateTag tone="allowed">a · empty + permitted CTA</StateTag>
              <div className="grid place-items-center text-center py-8 px-4 border border-dashed border-[#C9C9C3] rounded-lg bg-[#FAFAF8]">
                <div className="w-12 h-12 rounded-xl bg-[#FCEEE4] grid place-items-center text-[#C2410C] mb-3"><Icon name="po" className="w-6 h-6" strokeWidth={1.5} /></div>
                <div className="text-[15px] font-semibold">No purchase orders yet</div>
                <p className="text-[13px] text-[#57564F] mt-1 mb-4 max-w-[34ch]">Upload a client PO to get started.</p>
                <button className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md"><Icon name="plus" className="w-[18px] h-[18px]" strokeWidth={2} /> Create your first PO</button>
              </div>
              <p className="text-[12px] text-[#57564F] mt-2.5">Creator / Admin — CTA matches a permitted action.</p>
            </Panel>
            {/* b */}
            <Panel>
              <StateTag tone="hidden">b · empty, no CTA</StateTag>
              <div className="grid place-items-center text-center py-8 px-4 border border-dashed border-[#C9C9C3] rounded-lg bg-[#FAFAF8]">
                <div className="w-12 h-12 rounded-xl bg-[#F0F0EE] grid place-items-center text-[#84837C] mb-3"><Icon name="po" className="w-6 h-6" strokeWidth={1.5} /></div>
                <div className="text-[15px] font-semibold">No purchase orders to show yet</div>
                <p className="text-[13px] text-[#57564F] mt-1 max-w-[36ch]">POs will appear here once they're created and shared with your team.</p>
              </div>
              <p className="text-[12px] text-[#57564F] mt-2.5">Read-only / Project — no create affordance offered.</p>
            </Panel>
          </div>

          {/* c full no-access */}
          <div className="mt-4">
            <StateTag tone="disabled">c · full no-access page</StateTag>
            <div className="border border-[#DEDEDA] rounded-lg bg-white shadow-[0_1px_2px_rgba(26,26,23,0.05)] grid place-items-center text-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#F0F0EE] grid place-items-center text-[#84837C] mb-5"><Icon name="block" className="w-9 h-9" strokeWidth={1.5} /></div>
              <h3 className="text-[20px] font-semibold">You don't have access to this page</h3>
              <p className="text-[14px] text-[#57564F] mt-2 max-w-[46ch]">Your role doesn't include this area of PO Tracker. If you think this is a mistake, ask an administrator to update your access.</p>
              <a className="mt-6 inline-flex items-center gap-2 bg-white border border-[#C9C9C3] hover:border-[#84837C] text-[#1A1A17] font-semibold text-[14px] px-4 py-2.5 rounded-md cursor-pointer">
                <Icon name="chevron" className="w-4 h-4 rotate-90" /> Back to dashboard
              </a>
            </div>
          </div>
          <Caption>Three escalating states: an empty list that invites a permitted action, an empty list that simply explains, and a friendly full-page block for a route the role can't reach — always with a way back.</Caption>
        </SheetSection>

        {/* 6 · DECISION-RAIL VISIBILITY */}
        <SheetSection num="06" title="Decision-rail visibility" note="Present vs. absent (column reflows)">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <StateTag tone="allowed">authorised</StateTag>
                <RoleBadge role="General Manager" dot="#15803D" />
              </div>
              <RailThumb withRail={true} />
              <p className="text-[12px] text-[#57564F] mt-2.5">Approver / Admin — decision rail is present alongside the record.</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <StateTag tone="hidden">unauthorised</StateTag>
                <RoleBadge role="Viewer" dot="#84837C" />
              </div>
              <RailThumb withRail={false} />
              <p className="text-[12px] text-[#57564F] mt-2.5">Read-only / Project — rail is absent; the record reflows to full width.</p>
            </div>
          </div>
          <Caption>Authorised roles get the action rail; for everyone else it isn't dimmed or stubbed — it's removed, and the main column expands to fill the space. No empty gutters, no teasing of actions a user can't take.</Caption>
        </SheetSection>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<RolePatterns />);
