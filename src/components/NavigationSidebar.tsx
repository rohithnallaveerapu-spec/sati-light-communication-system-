import { ActiveTab, TelemetryData } from '../types';
import { Home, Satellite as SatIcon, MessageSquare, Rocket, AlertTriangle } from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  telemetry: TelemetryData | null;
  unreadCount?: number;
  emergencyActive?: boolean;
}

export function NavigationSidebar({
  activeTab,
  onSelectTab,
  telemetry,
  unreadCount = 0,
  emergencyActive = false,
}: Props) {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'map' as ActiveTab, label: 'Satellite Map', icon: SatIcon },
    { id: 'chat' as ActiveTab, label: 'Messaging', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'tasks' as ActiveTab, label: 'Productivity', icon: Rocket },
    { id: 'emergency' as ActiveTab, label: 'Emergency SOS', icon: AlertTriangle, isAlert: true },
  ];

  return (
    <>
      {/* Desktop Navigation Drawer */}
      <nav
        id="desktop-nav-drawer"
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-72 z-40 bg-[#0f131f]/75 dark:bg-[#0f131f]/75 backdrop-blur-2xl text-[#00dbe7] border-r border-white/10 shadow-2xl font-sans"
      >
        {/* Commander Profile Banner */}
        <div className="p-6 flex items-center gap-4 border-b border-white/10">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Commander Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#00dbe7]/60 shadow-[0_0_15px_rgba(0,219,231,0.3)]"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00f2ff] rounded-full border-2 border-[#0f131f] animate-pulse"></span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#00dbe7] tracking-tight">Commander</h2>
            <div className="font-mono text-xs text-[#b9cacb] mt-0.5">
              Node: <span className="text-[#e1fdff]">{telemetry?.nodeCode || 'ORB-092'}</span>
            </div>
            <div className="font-mono text-xs text-[#00dbe7] mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]"></span>
              Latency: {telemetry?.latencyMs ?? 24}ms
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 flex flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAlert = item.isAlert;

            if (isAlert) {
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`mt-4 mx-2 flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                    emergencyActive || isActive
                      ? 'bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab]/50 shadow-[0_0_20px_rgba(255,180,171,0.3)] pulse-red'
                      : 'bg-[#93000a]/20 text-[#ffb4ab] hover:bg-[#93000a]/40 border border-[#ffb4ab]/20'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#ffb4ab]" />
                  <span>{item.label}</span>
                  {emergencyActive && <span className="ml-auto w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping" />}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl font-medium transition-all duration-200 text-left ${
                  isActive
                    ? 'text-[#00f2ff] font-bold border-l-4 border-[#00f2ff] bg-[#00f2ff]/10 translate-x-1 shadow-[inset_0_0_20px_rgba(0,219,231,0.08)]'
                    : 'text-[#b9cacb] hover:text-[#e1fdff] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#00f2ff]' : 'text-[#849495]'}`} />
                <span className="text-sm tracking-wide">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-[#8f03ff] text-[#f0ddff]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Connection Health Footer */}
        <div className="p-4 mx-4 mb-6 rounded-xl glass-panel text-xs font-mono">
          <div className="flex justify-between items-center text-[#b9cacb] mb-1.5">
            <span>COASTLINE LINK</span>
            <span className="text-[#00f2ff] font-bold">LOCKED</span>
          </div>
          <div className="w-full bg-[#1b1f2c] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#00dbe7] to-[#8f03ff] h-full w-[94%] rounded-full shadow-[0_0_8px_#00dbe7]"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#849495] mt-2">
            <span>Bandwidth: {telemetry?.bandwidthMbps ?? 450} Mbps</span>
            <span>LEO Synced</span>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 pb-5 pt-2.5 bg-[#0a0e1a]/85 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.6)] font-mono text-[11px]"
      >
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#8f03ff] text-[#f0ddff] scale-95 shadow-[0_0_15px_rgba(143,3,255,0.4)]'
                  : 'text-[#849495] hover:text-[#e1fdff]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="font-semibold">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        {/* Emergency button for mobile */}
        <button
          id="mobile-tab-emergency"
          onClick={() => onSelectTab('emergency')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
            activeTab === 'emergency' || emergencyActive
              ? 'bg-[#93000a] text-[#ffdad6] pulse-red'
              : 'text-[#ffb4ab]/70'
          }`}
        >
          <AlertTriangle className="w-5 h-5 mb-0.5 text-[#ffb4ab]" />
          <span className="font-semibold text-[10px]">SOS</span>
        </button>
      </nav>
    </>
  );
}
