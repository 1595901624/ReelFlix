import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import HomePage from './pages/home/HomePage';
import PlayPage from './pages/play/PlayPage';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play/:id" element={<PlayPage />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;
