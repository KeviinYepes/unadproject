import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navItems = [
    { path: '/main', icon: 'dashboard', label: 'Dashboard' },
    { path: '#', icon: 'groups', label: 'HR' },
    { path: '#', icon: 'account_balance_wallet', label: 'Finance' },
    { path: '#', icon: 'gavel', label: 'Legal' },
    { path: '#', icon: 'headset_mic', label: 'IT Support' },
    { path: '/foro', icon: 'forum', label: 'Forum' },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
      <div className="flex flex-col gap-4">
        {/* Logo y nombre */}
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-2xl">all_inclusive</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-normal text-text-light-primary dark:text-text-dark-primary">
              CorpPortal
            </h1>
            <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary">
              internal.portal.com
            </p>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300'
                    : 'text-text-light-secondary hover:bg-primary/10 hover:text-primary dark:text-dark-secondary dark:hover:bg-primary/20 dark:hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <p className="text-sm font-medium leading-normal">{item.label}</p>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Enlaces inferiores */}
      <div className="mt-auto flex flex-col gap-1">
        <NavLink
          to="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-light-secondary transition-colors hover:bg-primary/10 hover:text-primary dark:text-dark-secondary dark:hover:bg-primary/20 dark:hover:text-primary"
        >
          <span className="material-symbols-outlined text-2xl">settings</span>
          <p className="text-sm font-medium leading-normal">Settings</p>
        </NavLink>
        <NavLink
          to="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-light-secondary transition-colors hover:bg-primary/10 hover:text-primary dark:text-dark-secondary dark:hover:bg-primary/20 dark:hover:text-primary"
        >
          <span className="material-symbols-outlined text-2xl">help</span>
          <p className="text-sm font-medium leading-normal">Help</p>
        </NavLink>
      </div>
    </aside>
  );
}