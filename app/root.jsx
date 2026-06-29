/* ============================================================
   ROOT — shell, screen switcher, toast
   ============================================================ */
function App() {
  const [screen, setScreen] = React.useState('list'); // 'list' | 'empty' | 'wizard'
  const [toast, setToast] = React.useState(null);
  const timer = React.useRef(null);

  const notify = React.useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const SWITCHER = [
    { id: 'list',   label: 'PO List' },
    { id: 'empty',  label: 'Empty' },
    { id: 'new-po', label: 'Create New PO' },
    { id: 'wizard', label: 'AI Wizard (old)' },
    { id: 'detail', label: 'PO Detail' },
    { id: 'review', label: 'Review / Approve' },
  ];

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F4F4F2] text-[#1A1A17]">
      <Sidebar active="Purchase Orders" />
      <main className="flex-1 min-w-0 flex flex-col">
        {screen === 'new-po'
          ? <ScreenNewPO notify={notify} goTo={setScreen} />
          : screen === 'wizard'
          ? <ScreenB notify={notify} goTo={setScreen} />
          : screen === 'detail'
          ? <ScreenC notify={notify} />
          : screen === 'review'
          ? <ScreenD notify={notify} />
          : <ScreenA empty={screen === 'empty'} notify={notify} onNew={() => setScreen('new-po')} onOpen={() => setScreen('detail')} />}
      </main>

      {/* screen switcher (design-review affordance) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white border border-[#C9C9C3] rounded-full shadow-[0_6px_24px_rgba(26,26,23,0.16)] px-1.5 py-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#84837C] px-2 hidden sm:block">View</span>
        {SWITCHER.map((s) => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            className={'text-[13px] font-semibold px-3 py-1.5 rounded-full transition-colors ' + (screen === s.id ? 'bg-[#C2410C] text-white' : 'text-[#57564F] hover:bg-[#F0F0EE]')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A17] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 po-toast">
          <Icon name="check" className="w-4 h-4 text-[#86efac]" />
          <span className="font-mono">{toast}</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
