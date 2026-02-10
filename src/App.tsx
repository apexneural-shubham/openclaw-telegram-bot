import { useState } from 'react';
import { ChatView } from './views/ChatView';
import { ApprovalsView } from './views/ApprovalsView';
import { SettingsView } from './views/SettingsView';
import { BottomNav } from './components/BottomNav';
import { useGestureSettings } from './hooks/useGestureSettings';

export type TabId = 'chat' | 'approvals' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const gestureSettings = useGestureSettings();

  return (
    <div className="app">
      <main className="app-main">
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'approvals' && <ApprovalsView gestureSettings={gestureSettings} />}
        {activeTab === 'settings' && <SettingsView gestureSettings={gestureSettings} />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
