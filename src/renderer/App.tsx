import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Authenticating from './screens/auth/loading';
import AuthUnregistered from './screens/auth/unregistered';
import AuthError from './screens/auth/error';
// Dashboard
import Dashboard from './screens/dashboard/Dashboard';
import DashboardContentDashboard from './screens/dashboard/content/dashboard';
import DashboardContentTask from './screens/dashboard/content/task';
import DashboardContentCollection from './screens/dashboard/content/collection';
import DashboardContentSettings from './screens/dashboard/content/settings';

import MessageDialog from './element/MessageDialog';
// End of dashboard
import './App.scss';
import { useEffect, useState } from 'react';

export default function App() {
  const [messageTitle, setMessageTitle] = useState('');
  const [messageMessage, setMessageMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

  const eventListenerRecoursion = () => {
    return window.electron.ipcRenderer.once('message', (args) => {
      setMessageOpen(true);
      setMessageTitle(args.title);
      setMessageMessage(args.message);
      eventListenerRecoursion();
    });
  };

  const handleMessageClose = () => setMessageOpen(false);

  useEffect(() => {
    eventListenerRecoursion();
  }, []);

  return (
    <Router>
      <MessageDialog
        open={messageOpen}
        title={messageTitle}
        message={messageMessage}
        onClose={handleMessageClose.bind(this)}
      />
      <Routes>
        <Route path="/" element={<Authenticating />} />
        <Route path="/auth/unregistered" element={<AuthUnregistered />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route
          path="/dashboard/dashboard"
          element={<Dashboard Content={<DashboardContentDashboard />} />}
        />
        <Route
          path="/dashboard/task"
          element={<Dashboard Content={<DashboardContentTask />} />}
        />
        <Route
          path="/dashboard/collection"
          element={<Dashboard Content={<DashboardContentCollection />} />}
        />
        <Route
          path="/dashboard/settings"
          element={<Dashboard Content={<DashboardContentSettings />} />}
        />
      </Routes>
    </Router>
  );
}
