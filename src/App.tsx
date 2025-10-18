import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoiceManager from './pages/InvoiceManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceManager />} />
      </Routes>
    </Router>
  );
}

export default App;
