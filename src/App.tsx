import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Random from './pages/Random';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/random" element={<Random />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
