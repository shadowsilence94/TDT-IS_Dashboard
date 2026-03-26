import Dashboard from './components/Dashboard';

function App() {
  const user = { email: "admin@tdt-is.gov.th" };
  return <Dashboard user={user} />;
}

export default App;
