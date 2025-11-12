import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoiceManager from './pages/InvoiceManager';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<InvoiceManager />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
