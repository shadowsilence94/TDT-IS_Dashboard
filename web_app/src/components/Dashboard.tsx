import { useEffect, useState } from 'react';
import { signOut } from '../firebase';
import { auth } from '../firebase';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#c084fc', '#4ade80', '#ef4444', '#f59e0b'];

const formatValue = (num: number) => {
  if (!num) return '0 ฿';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T ฿';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B ฿';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M ฿';
  return new Intl.NumberFormat('th-TH').format(num) + ' ฿';
};

const formatNumber = (num: number) => {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K';
  return num.toString();
};

export default function Dashboard({ user }: { user: any }) {
  const [forecast, setForecast] = useState([]);
  const [cci, setCci] = useState([]);
  const [regional, setRegional] = useState([]);
  const [topProvinces, setTopProvinces] = useState([]);
  const [demographics, setDemographics] = useState<any>({ revenue: [], volume: [] });
  const [modelParams, setModelParams] = useState<any>(null);
  const [simulatedVisitors, setSimulatedVisitors] = useState<number>(0);
  const [cciZoneFilter, setCciZoneFilter] = useState<'Red' | 'Yellow' | 'Green'>('Red');

  useEffect(() => {
    fetch('/data/national_forecast.json').then(res => res.json()).then(setForecast).catch(console.error);
    fetch('/data/cci_data.json').then(res => res.json()).then(setCci).catch(console.error);
    fetch('/data/regional_summary.json').then(res => res.json()).then(setRegional).catch(console.error);
    fetch('/data/top10_provinces.json').then(res => res.json()).then(setTopProvinces).catch(console.error);
    fetch('/data/demographics.json').then(res => res.json()).then(setDemographics).catch(console.error);
    fetch('/data/prediction_model.json').then(res => res.json()).then(data => {
      setModelParams(data);
      if (data.baseline_visitors) setSimulatedVisitors(data.baseline_visitors);
    }).catch(console.error);
  }, []);

  const handleLogout = async () => {
    if (auth.app.options.apiKey !== "YOUR_API_KEY") {
      await signOut(auth);
    } else {
      window.location.reload(); 
    }
  };

  const filteredCci = cci
    .filter((c: any) => c.Zone === cciZoneFilter)
    .sort((a: any, b: any) => b.CCI - a.CCI)
    .slice(0, 8);

  const totalTourists = regional.reduce((sum: number, r: any) => sum + (r.no_tourist_all || 0), 0);
  const totalRevenue = regional.reduce((sum: number, r: any) => sum + (r.revenue_all || 0), 0);

  const simulatedRevenue = modelParams 
    ? Math.max(0, (simulatedVisitors * modelParams.revenue_per_tourist + modelParams.intercept))
    : 0;

  const zoneColors: Record<string, string> = { Red: '#ef4444', Yellow: '#f59e0b', Green: '#4ade80' };

  return (
    <div className="app-container">
      <main className="main-content">
        <header style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', display:'flex', flexWrap:'wrap', gap:'20px' }}>
          <div style={{flex: 1}}>
            <h1 style={{margin:0, fontSize:'2rem', letterSpacing:'-0.02em'}}>TDT-IS: Tourism Intelligence System</h1>
            <p style={{color:'var(--text-muted)', margin:'4px 0', fontSize:'0.95rem'}}>Phase 2 Progress Report | Sustainable Tourism & Regional Economic Balance</p>
            <div style={{ display: 'flex', flexWrap:'wrap', gap: '8px', marginTop: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', color: '#94a3b8', border: '1px solid rgba(255,b255,255,0.1)' }}>
                TEAM: Alston, Subhajit, Santhosh, Htut Ko Ko
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                MODELS: Prophet, Linear Regression, CCI
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize:'0.9rem' }}>{user?.email}</span>
            <button className="btn-secondary" onClick={handleLogout} style={{ fontSize:'0.9rem', padding:'8px 16px' }}>
              LOGOUT
            </button>
          </div>
        </header>

        <section style={{marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border:'1px solid var(--glass-border)'}}>
            <h2 style={{fontSize:'1.1rem', marginBottom:'10px', color:'#f1f5f9'}}>Executive Summary & Policy Alignment</h2>
            <p style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
                This dashboard is designed for <b>Government Officials, policy makers, and tourism industry investors</b> to achieve <b>balanced economic growth</b> and <b>sustainable tourism practices</b>. Analytics derived from verified MOTS 2019-2023 statistics.
            </p>
        </section>

        <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
          
          <div className="glass-panel kpi-card">
            <div className="kpi-title">TOTAL VISITORS (HISTORICAL)</div>
            <div className="kpi-value">{totalTourists ? formatNumber(totalTourists) : '...'}</div>
            <div style={{color: '#94a3b8', fontSize: '0.75rem'}}>Market volume across 77 provinces.</div>
          </div>
          <div className="glass-panel kpi-card">
            <div className="kpi-title">TOTAL REVENUE (฿)</div>
            <div className="kpi-value" style={{color:'#60a5fa'}}>{totalRevenue ? formatValue(totalRevenue) : '...'}</div>
            <div style={{color: '#94a3b8', fontSize: '0.75rem'}}>Direct economic contribution.</div>
          </div>
          <div className="glass-panel kpi-card">
            <div className="kpi-title">MODEL STATUS</div>
            <div className="kpi-value" style={{color:'#c084fc'}}>ACTIVE</div>
            <div style={{color: '#94a3b8', fontSize: '0.75rem'}}>Prophet & Regression engines live.</div>
          </div>

          <div className="glass-panel chart-card" style={{ gridColumn: 'span 12', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '1.5rem' }}>
              <div style={{maxWidth: '700px'}}>
                <h3 className="chart-title" style={{ color: '#60a5fa', marginBottom: '8px' }}>
                  Policy Tool: What-If Revenue Forecast Simulation
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  <b>Model:</b> Scikit-Learn Linear Regression. Estimates revenue growth based on historical visitor-to-income coefficients.
                </p>
              </div>
              <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.03)', padding:'1rem 1.5rem', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>PROJECTED REVENUE</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4ade80', margin:'4px 0' }}>
                  {formatValue(simulatedRevenue)}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap:'wrap', gap: '2rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize:'0.9rem' }}>
                  <span>Target Monthly Visitors:</span>
                  <span style={{ color: '#60a5fa', fontWeight: '700' }}>{new Intl.NumberFormat('en').format(simulatedVisitors)}</span>
                </div>
                <input 
                  type="range" 
                  min={Math.round((modelParams?.baseline_visitors || 1000000) * 0.1)} 
                  max={Math.round((modelParams?.baseline_visitors || 1000000) * 3)} 
                  step="100000" 
                  value={simulatedVisitors} 
                  onChange={(e) => setSimulatedVisitors(parseInt(e.target.value))}
                  style={{ width: '100%', height: '6px', cursor: 'pointer', accentColor: '#3b82f6' }}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel chart-card" style={{ height: '400px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Arrival Projections (Prophet Forecasting)</h3>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <b>Model:</b> Facebook Prophet. Covers 2019 - 2027 demand projections.
            </p>
            <ResponsiveContainer width="100%" height="65%">
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="ds" stroke="var(--text-muted)" tickFormatter={(v) => v?.slice(2, 7)} fontSize={10} />
                <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `${(v/1e6).toFixed(0)}M`} fontSize={10} />
                <Tooltip labelStyle={{color: 'black'}} formatter={(value: any) => new Intl.NumberFormat('en').format(Math.round(Number(value) || 0))} />
                <Area type="monotone" dataKey="actual" name="History" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" />
                <Area type="monotone" dataKey="yhat" name="Forecast" stroke="#c084fc" fillOpacity={0.1} fill="#c084fc" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel chart-card half" style={{ height: '450px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Revenue Concentration Index</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                Ranks provinces by tourism income to identify regional dependency.
            </p>
            <ResponsiveContainer width="100%" height="70%">
              <BarChart data={topProvinces} layout="vertical" margin={{ left: 50, right: 30 }}>
                <YAxis dataKey="province_eng" type="category" stroke="var(--text-muted)" width={110} fontSize={11} />
                <XAxis type="number" stroke="var(--text-muted)" tickFormatter={(v) => `${(v/1e9).toFixed(1)}B`} fontSize={10} />
                <Tooltip labelStyle={{color: 'black'}} formatter={(val: any) => formatValue(Number(val) || 0)} />
                <Bar dataKey="revenue_all" fill="#c084fc44" stroke="#c084fc" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel chart-card half" style={{ height: '450px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Market Resilience (Real Shares)</h3>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.2rem', lineHeight: '1.4' }}>
              Verification shows that **Domestic travelers** are the primary volume driver. 
              {demographics?.volume?.length > 0 ? ` Contributing ${formatNumber(demographics.volume[0].value)} trips historically.` : ' Calculating metrics...'}
            </p>
            <div style={{ display: 'flex', height: '180px', gap: '1rem', alignItems:'center' }}>
              <div style={{ flex: 1, height: '100%' }}>
                <div style={{fontSize:'0.65rem', color:'#94a3b8', textAlign:'center', marginBottom:'4px'}}>REVENUE SHARE</div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demographics?.revenue || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                      {(demographics?.revenue || []).map((_e: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatValue(Number(v) || 0)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, height: '100%' }}>
                <div style={{fontSize:'0.65rem', color:'#94a3b8', textAlign:'center', marginBottom:'4px'}}>VOLUME SHARE (TRIPS)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demographics?.volume || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                      {(demographics?.volume || []).map((_e: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatNumber(Number(v) || 0)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem', fontSize: '0.75rem', marginTop:'15px', color:'white' }}>
                <div style={{display:'flex', alignItems:'center', gap:'6px'}}><div style={{width:10, height:10, borderRadius:'50%', background:COLORS[0]}}></div> Domestic (Thai)</div>
                <div style={{display:'flex', alignItems:'center', gap:'6px'}}><div style={{width:10, height:10, borderRadius:'50%', background:COLORS[1]}}></div> Foreign</div>
            </div>
          </div>

          <div className="glass-panel chart-card half" style={{ height: '550px' }}>
            <div className="chart-header" style={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 className="chart-title" style={{ color: zoneColors[cciZoneFilter] }}>Sustainability Sentinel: Overtourism</h3>
              <select 
                value={cciZoneFilter} 
                onChange={(e: any) => setCciZoneFilter(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}
              >
                <option value="Red">Red (Overtourism)</option>
                <option value="Yellow">Yellow (Caution)</option>
                <option value="Green">Green (Sustainable)</option>
              </select>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <b>Analysis:</b> {cciZoneFilter === 'Red' ? 'Critical hubs including Phuket, Chiang Mai, and Bangkok, along with high-pressure zones like Suphan Buri and Samut Songkhram, exceed their structural carrying capacities (CCI > 0.9), signaling a need for intervention.' : cciZoneFilter === 'Yellow' ? 'Secondary areas such as Nonthaburi and Phra Nakhon Si Ayutthaya show caution with capacities nearing limits, suggesting the need for sustainable strategies to prevent overtourism.' : 'Provinces like Nakhon Ratchasima fall within sustainable levels with ample infrastructure buffer, allowing for further balanced tourism growth.'}
            </p>
            <ResponsiveContainer width="100%" height="65%">
              <BarChart data={filteredCci} layout="vertical" margin={{ left: 50, right: 30 }}>
                <YAxis dataKey="province_eng" type="category" stroke="var(--text-muted)" width={110} fontSize={11} />
                <XAxis type="number" stroke="var(--text-muted)" domain={[0, 'auto']} fontSize={10} />
                <Tooltip labelStyle={{color: 'black'}} formatter={(v: any) => `CCI: ${Number(v).toFixed(2)}`} />
                <Bar dataKey="CCI" fill={zoneColors[cciZoneFilter] + '66'} stroke={zoneColors[cciZoneFilter]} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="glass-panel chart-card half" style={{ height: '550px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Regional Strategy Geography</h3>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              Geospatial prioritization. Red: Saturated | Yellow: Monitoring | Green: Sustainable Growth.
            </p>
            <div style={{ width: '100%', height: '75%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <iframe src="/data/thailand_map.html" title="Map" width="100%" height="100%" style={{ border: 'none' }} />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
