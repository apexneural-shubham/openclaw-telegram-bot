import type { TabId } from '../App';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'approvals', label: 'Approvals', icon: '✓' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main">
      {TABS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          className={`nav-item ${activeTab === id ? 'active' : ''}`}
          onClick={() => onTabChange(id)}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          <span className="icon" aria-hidden>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
