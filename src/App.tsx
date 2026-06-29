import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Expired from './pages/Expired';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Expired />} />
      </Routes>
    </Router>
  );
}

export default App;
