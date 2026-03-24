import { useState } from 'react';
import { signInWithEmailAndPassword } from '../firebase';
import { auth } from '../firebase';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (auth.app.options.apiKey !== "YOUR_API_KEY") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Fallback for demo without valid firebase config
        if (email && password) {
          window.location.reload(); 
        } else {
          setError('Please enter both email and password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--accent-color)', padding: '1rem', borderRadius: '50%' }}>
            <Lock size={32} color="white" />
          </div>
        </div>
        <h2>TDT-IS Admin Login</h2>
        <p>Thailand Domestic Tourism Intelligence System</p>

        {error && <div className="error-text">{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
             <User size={20} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
             <input 
               type="email" 
               placeholder="Admin Email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               style={{ paddingLeft: '40px', marginBottom: 0 }}
             />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
             <Lock size={20} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
             <input 
               type="password" 
               placeholder="Password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               style={{ paddingLeft: '40px', marginBottom: 0 }}
             />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure SignIn'}
          </button>
        </form>
      </div>
    </div>
  );
}
