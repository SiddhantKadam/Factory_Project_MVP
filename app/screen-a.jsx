/* ============================================================
   SCREEN A — Purchase Orders list
   ============================================================ */

function Toolbar() {
  const ctl = 'h-9 rounded-md border border-[#C9C9C3] bg-white text-[14px] text-[#1A1A17] px-3 focus:outline-none focus:border-[#C2410C] focus:ring-[3px] focus:ring-[#C2410C]/35';
  const sel = ctl + ' pr-8 appearance-none bg-no-repeat cursor-pointer';
  const selBg = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2357564F' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundPosition: 'right 12px center',
  };
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative flex-1 min-w-[220px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#84837C]">
          <Icon name="search" className="w-[15px] h-[15px]" />
        </span>
        <input
          className={ctl + ' w-full pl-9'}
          placeholder="Search by PO number or client…"
        />
      </div>
      <select className={sel} style={selBg} defaultValue="">
        <option value="">All statuses</option>
        <option>Draft</option>
        <option>Under Review</option>
        <option>Approved</option>
        <option>Rejected</option>
        <option>Revision Requested</option>
      </select>
      <select className={sel} style={selBg} defaultValue="">
        <option value="">All clients</option>
        <option>Acme Infrastructure Ltd.</option>
        <option>Meridian Construction Co.</option>
        <option>Sterling Steel Projects</option>
        <option>Vertex Engineering Pvt Ltd</option>
      </select>
      <div className="flex items-center gap-1.5 h-9 rounded-md border border-[#C9C9C3] bg-white px-3 text-[14px] text-[#57564F]">
        <Icon name="calendar" className="w-[15px] h-[15px] text-[#84837C]" />
        <input type="date" defaultValue="2026-06-01" className="bg-transparent focus:outline-none font-mono tabular-nums text-[13px] w-[112px]" />
        <span className="text-[#84837C]">→</span>
        <input type="date" defaultValue="2026-08-31" className="bg-transparent focus:outline-none font-mono tabular-nums text-[13px] w-[112px]" />
      </div>
    </div>
  );
}

function KebabMenu({ po, open, onToggle, notify, onOpen }) {
  const act = (label) => (e) => {
    e.stopPropagation();
    onToggle(null);
    if (label === 'View' && onOpen) { onOpen(); return; }
    notify(`${label} · ${po.no}`);
  };
  return (
    <div className="relative flex justify-end">
      <button
        className={'w-8 h-8 rounded-md grid place-items-center text-[#57564F] hover:bg-[#F0F0EE] ' + (open ? 'bg-[#F0F0EE]' : '')}
        onClick={(e) => { e.stopPropagation(); onToggle(open ? null : po.no); }}
        aria-label="Row actions"
      >
        <Icon name="kebab" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-36 bg-white border border-[#DEDEDA] rounded-md shadow-[0_6px_20px_rgba(26,26,23,0.12)] py-1 text-[13px]">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[#1A1A17] hover:bg-[#FAFAF8]" onClick={act('View')}>
            <Icon name="eye" className="w-4 h-4 text-[#57564F]" /> View
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[#1A1A17] hover:bg-[#FAFAF8]" onClick={act('Edit')}>
            <Icon name="edit" className="w-4 h-4 text-[#57564F]" /> Edit
          </button>
          {(po.status === 'Draft' || po.status === 'Revision Requested') && (
            <>
              <div className="h-px bg-[#DEDEDA] my-1"></div>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[#C2410C] font-semibold hover:bg-[#FCEEE4]" onClick={act('Submit')}>
                <Icon name="send" className="w-4 h-4" /> Submit
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function POTable({ notify, onOpen }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const th = 'text-left text-[12px] font-semibold uppercase tracking-[0.04em] text-[#57564F] px-4 py-2.5 bg-[#FAFAF8] border-b border-[#C9C9C3] whitespace-nowrap';
  const td = 'px-4 py-3 border-b border-[#DEDEDA] text-[#1A1A17] align-middle';
  return (
    <div className="relative">
      {openMenu && <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)}></div>}
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr>
            <th className={th}>PO Number</th>
            <th className={th}>Title</th>
            <th className={th}>Client / Vendor</th>
            <th className={th + ' text-right'}>Total Amount</th>
            <th className={th}>Required Delivery</th>
            <th className={th}>Status</th>
            <th className={th}>Created</th>
            <th className={th + ' text-right'}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {PO_DATA.map((po) => (
            <tr
              key={po.no}
              className="group cursor-pointer hover:bg-[#FAFAF8]"
              onClick={() => onOpen && onOpen()}
            >
              <td className={td + ' font-mono font-semibold tabular-nums whitespace-nowrap'}>{po.no}</td>
              <td className={td + ' font-medium max-w-[220px]'}>{po.title}</td>
              <td className={td + ' text-[#57564F]'}>{po.client}</td>
              <td className={td + ' text-right font-mono tabular-nums whitespace-nowrap'}>{money(po.amount)}</td>
              <td className={td + ' font-mono tabular-nums text-[13px] text-[#57564F] whitespace-nowrap'}>{fmtDate(po.due)}</td>
              <td className={td}><StatusPill status={po.status} /></td>
              <td className={td + ' font-mono tabular-nums text-[12px] text-[#84837C] whitespace-nowrap'}>{fmtDate(po.created)}</td>
              <td className={td + ' py-1.5'} onClick={(e) => e.stopPropagation()}>
                <KebabMenu po={po} open={openMenu === po.no} onToggle={setOpenMenu} notify={notify} onOpen={onOpen} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyPOs({ notify }) {
  return (
    <div className="grid place-items-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FCEEE4] grid place-items-center text-[#C2410C] mb-5">
        <Icon name="po" className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-[18px] font-semibold text-[#1A1A17] mb-1.5">No purchase orders yet</h3>
      <p className="text-[14px] text-[#57564F] max-w-[44ch] mb-6">
        Upload a client PO to get started. We'll read the PDF, pull out the key fields, and route it for approval.
      </p>
      <button
        className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md"
        onClick={() => notify('New PO — Upload')}
      >
        <Icon name="plus" className="w-[18px] h-[18px]" strokeWidth={2} /> Create your first PO
      </button>
    </div>
  );
}

function ScreenA({ empty, notify, onNew, onOpen }) {
  return (
    <div className="flex flex-col h-full">
      <TopBar crumb={['Home', 'Purchase Orders']} />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Page header */}
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[26px] font-semibold text-[#1A1A17] tracking-tight leading-tight">Purchase Orders</h1>
            <p className="text-[14px] text-[#57564F] mt-1">
              {empty ? 'No orders in this view yet.' : `${PO_DATA.length} orders · 3 awaiting your review`}
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A330A] text-white font-semibold text-[14px] px-4 py-2.5 rounded-md flex-none"
            onClick={onNew}
          >
            <Icon name="plus" className="w-[18px] h-[18px]" strokeWidth={2} /> New PO
          </button>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#DEDEDA] rounded-lg shadow-[0_1px_2px_rgba(26,26,23,0.05)] overflow-hidden">
          {!empty && (
            <div className="p-4 border-b border-[#DEDEDA]">
              <Toolbar />
            </div>
          )}
          {empty ? <EmptyPOs notify={notify} /> : <POTable notify={notify} onOpen={onOpen} />}
        </div>

        {!empty && (
          <div className="flex items-center justify-between mt-3 text-[13px] text-[#57564F]">
            <span className="font-mono">Showing 1–{PO_DATA.length} of {PO_DATA.length}</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded-md border border-[#C9C9C3] bg-white text-[#84837C]" disabled>Prev</button>
              <button className="px-3 py-1.5 rounded-md border border-[#C9C9C3] bg-white hover:bg-[#FAFAF8]">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.ScreenA = ScreenA;
