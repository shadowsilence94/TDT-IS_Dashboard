import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState<any>(null);
  // Optional: bypass login if config empty for demo purposes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no API key is provided, we simulate a logged-in user for demonstration.
    if (auth.app.options.apiKey === "YOUR_API_KEY") {
      setUser({ email: "demo@tdt-is.gov.th" });
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{display:'flex', justifyContent:'center', marginTop:'20vh'}}>Loading App Context...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
