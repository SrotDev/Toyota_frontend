
import React from 'react';
import { LayoutDashboard, Map, UploadCloud, Flag, Settings, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: string;
  navigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRoute, navigate }) => {
  
  const navItems = [
      { id: '/', label: 'HOME', icon: LayoutDashboard },
      { id: '/tracks', label: 'TRACKS', icon: Map },
      { id: '/upload', label: 'UPLOAD DATA', icon: UploadCloud },
      { id: '/leaderboard', label: 'LEADERBOARD', icon: Flag },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col">
      {/* HEADER */}
      <header className="h-16 border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
               <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded font-bold font-['Orbitron']">TR</div>
               <h1 className="text-xl font-bold font-['Orbitron'] tracking-tighter">Track<span className="text-[#00D9FF]">n</span>Race</h1>
          </div>
          <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1 text-xs font-mono text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  SYSTEM ONLINE
              </div>
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                  <User size={16} />
              </div>
          </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <aside className="w-20 lg:w-64 bg-[#0A0A0A] border-r border-[#2A2A2A] flex flex-col py-6">
              <nav className="flex-1 space-y-2 px-3">
                  {navItems.map((item) => (
                      <button
                          key={item.id}
                          onClick={() => navigate(item.id)}
                          className={`
                              w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                              ${activeRoute === item.id || (activeRoute.startsWith(item.id) && item.id !== '/') 
                                  ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20' 
                                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}
                          `}
                      >
                          <item.icon size={20} className="flex-shrink-0" />
                          <span className="hidden lg:block text-sm font-bold tracking-wide">{item.label}</span>
                          {activeRoute === item.id && (
                              <div className="ml-auto hidden lg:block w-1.5 h-1.5 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]"></div>
                          )}
                      </button>
                  ))}
              </nav>
              
              <div className="px-3 mt-auto">
                  <button className="w-full flex items-center gap-4 px-4 py-3 text-zinc-600 hover:text-white transition-colors">
                      <Settings size={20} />
                      <span className="hidden lg:block text-sm font-bold">SETTINGS</span>
                  </button>
              </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto bg-[#050505] p-4 lg:p-8">
              {children}
          </main>
      </div>
    </div>
  );
};

export default Layout;
