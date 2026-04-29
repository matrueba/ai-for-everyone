import React from "react";

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: "home", label: "Home" },
    { id: "visualizer", label: "Attention Visualizer" },
    { id: "backpropagation", label: "Backpropagation" },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-border-subtle flex flex-col z-20 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-accent-indigo to-accent-cyan bg-clip-text text-transparent">
            AI Explained
          </span>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${activePage === item.id
                ? "bg-accent-indigo/10 text-accent-indigo"
                : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                }`}
            >
              <span className={`text-lg transition-transform duration-200 ${activePage === item.id ? "scale-110" : "group-hover:scale-110 opacity-70 group-hover:opacity-100"}`}>
                {item.icon}
              </span>
              {item.label}
              {activePage === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-indigo shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border-subtle">
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-[0.65rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">
            Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-medium text-text-secondary">Backend Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
