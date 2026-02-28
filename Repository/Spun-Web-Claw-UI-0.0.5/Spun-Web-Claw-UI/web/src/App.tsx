import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import SkillDetail from './pages/SkillDetail';
import OpenClawChat from './pages/OpenClawChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/openclaw-chat" element={<OpenClawChat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/skill/:id" element={<SkillDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
