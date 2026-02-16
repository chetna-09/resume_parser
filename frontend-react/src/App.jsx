import { useState } from 'react';
import { useAuth } from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (!user) {
    return showLogin ? (
      <Login onSwitchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return <Dashboard />;
}

export default App;
