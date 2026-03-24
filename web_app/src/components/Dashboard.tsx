import { useEffect, useState } from 'react';
import { signOut } from '../firebase';
import { auth } from '../firebase';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Map, TrendingUp, Users, Activity, Info, UsersIcon, Calculator, Zap } from 'lucide-react';

const COLORS = ['#3b82f6', '#c084fc', '#4ade80', '#ef4444', '#f59e0b'];

const formatValue = (num: number) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T ฿';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B ฿';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M ฿';
  return new Intl.NumberFormat('th-TH').format(num) + ' ฿';
};

const formatNumber = (num: number) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K';
  return num.toString();
};

export default function Dashboard({ user }: { user: any }) {
  const [forecast, setForecast] = useState([]);
  const [cci, setCci] = useState([]);
  const [regional, setRegional] = useState([]);
  const [topProvinces, setTopProvinces] = useState([]);
  const [demographics, setDemographics] = useState<any>(null);
  const [yearlyTrend, setYearlyTrend] = useState([]);
  const [modelParams, setModelParams] = useState<any>(null);
  const [simulatedVisitors, setSimulatedVisitors] = useState<number>(0);

  useEffect(() => {
    fetch('/data/national_forecast.json').then(res => res.json()).then(setForecast).catch(console.error);
    fetch('/data/cci_data.json').then(res => res.json()).then(setCci).catch(console.error);
    fetch('/data/regional_summary.json').then(res => res.json()).then(setRegional).catch(console.error);
    fetch('/data/top10_provinces.json').then(res => res.json()).then(setTopProvinces).catch(console.error);
    fetch('/data/demographics.json').then(res => res.json()).then(setDemographics).catch(console.error);
    fetch('/data/yearly_trend.json').then(res => res.json()).then(setYearlyTrend).catch(console.error);
    fetch('/data/prediction_model.json').then(res => res.json()).then(data => {
      setModelParams(data);
      setSimulatedVisitors(data.baseline_visitors || 10000000);
    }).catch(console.error);
  }, []);

  const handleLogout = async () => {
    if (auth.app.options.apiKey !== "YOUR_API_KEY") {
      await signOut(auth);
    } else {
      window.location.reload(); 
    }
  };

  const cciRedZones = cci.filter((c: any) => c.Zone === 'Red').slice(0, 5);
  const totalTourists = regional.reduce((sum: number, r: any) => sum + (r.no_tourist_all || 0), 0);
  const totalRevenue = regional.reduce((sum: number, r: any) => sum + (r.revenue_all || 0), 0);

  // Simulated Revenue Calculation using ML regression parameter (฿/visitor)
  const simulatedRevenue = modelParams 
    ? Math.max(0, (simulatedVisitors * modelParams.revenue_per_tourist + modelParams.intercept))
    : 0;

  return (
    <div className="app-container">
      <main className="main-content">
        <header style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', display:'flex', flexWrap:'wrap', gap:'20px' }}>
          <div style={{flex: 1}}>
            <h1 style={{margin:0, fontSize:'2.2rem'}}>Thailand Tourism Intelligence (TDT-IS)</h1>
            <p style={{color:'var(--text-muted)', margin:'4px 0'}}>Phase 2 Progress Report: Real-time Analytics & Forecasting Engine</p>
            <div style={{ display: 'flex', flexWrap:'wrap', gap: '8px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                <UsersIcon size={14} /> <b>Team:</b> Alston, Subhajit, Santhosh, Htut Ko Ko
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                <Zap size={14} /> <b>Status:</b> Live Machine Learning Pipeline (Prophet/Regression)
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize:'0.9rem' }}>{user?.email}</span>
            <button className="btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
          
          {/* Dashboard KPIs with REAL data */}
          <div className="glass-panel kpi-card">
            <div className="kpi-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Users size={16}/> Historical Market Volume</div>
            <div className="kpi-value">{totalTourists ? formatNumber(totalTourists) : 'Calculating...'}</div>
            <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Aggregate arrivals across all provinces.</div>
          </div>
          <div className="glass-panel kpi-card">
            <div className="kpi-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Activity size={16}/> Documented Economy</div>
            <div className="kpi-value" style={{color:'#60a5fa'}}>{totalRevenue ? formatValue(totalRevenue) : 'Calculating...'}</div>
            <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Direct tourism revenue documented (MOTS).</div>
          </div>
          <div className="glass-panel kpi-card">
            <div className="kpi-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><TrendingUp size={16}/> Seasonal Sensitivity</div>
            <div className="kpi-value" style={{color:'#c084fc'}}>High Variance</div>
            <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Prophet model detected 12-Month cycles.</div>
          </div>

          {/* WHAT-IF SIMULATION TOOL (Real Regression Model Parameter) */}
          <div className="glass-panel chart-card" style={{ gridColumn: 'span 12', padding: '2rem', background: 'rgba(15, 23, 42, 0.4)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '1.5rem' }}>
              <div style={{maxWidth: '600px'}}>
                <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
                  <Calculator size={24} /> Decision Support: What-If Revenue Forecast Simulation
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px', lineHeight: '1.5' }}>
                  <b>Methodology:</b> Based on our <b>Linear Regression Analysis</b> of 2019-2023 data, we discovered that each additional visitor contributes approximately <b>฿{modelParams?.revenue_per_tourist.toFixed(2)}</b> to the national economy. Adjust the monthly visitor target below to predict total revenue.
                </p>
              </div>
              <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.05)', padding:'1.5rem', borderRadius:'16px', border:'1px solid rgba(74,222,128,0.2)', minWidth:'300px' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing:'0.05em' }}>Simulated Monthly Revenue</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ade80', margin:'8px 0' }}>
                  {formatValue(simulatedRevenue)}
                </div>
                <div style={{fontSize:'0.8rem', color:'#4ade8088'}}>↑ Prediction confidence based on R²: 0.79</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap:'wrap', gap: '2rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <label style={{ fontSize: '1rem', fontWeight: '700' }}>Target Visitors (Month)</label>
                  <span style={{ color: '#60a5fa', fontWeight: '800', fontSize:'1.1rem' }}>{new Intl.NumberFormat('en').format(simulatedVisitors)} Tourists</span>
                </div>
                <input 
                  type="range" 
                  min={Math.round((modelParams?.baseline_visitors || 1000000) * 0.1)} 
                  max={Math.round((modelParams?.baseline_visitors || 1000000) * 3)} 
                  step="100000" 
                  value={simulatedVisitors} 
                  onChange={(e) => setSimulatedVisitors(parseInt(e.target.value))}
                  style={{ width: '100%', height: '10px', cursor: 'pointer', accentColor: '#3b82f6' }}
                />
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'8px'}}>
                  <span>Min Activity (10%)</span>
                  <span>Historic Baseline: {formatNumber(modelParams?.baseline_visitors || 0)}</span>
                  <span>Aggressive Growth (300%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Series Output */}
          <div className="glass-panel chart-card" style={{ height: '450px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Arrival Projections (Prophet AI Output)</h3>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              <b>Analytical Insight:</b> Our Prophet model isolated seasonal peaks corresponding to Songkran (April) and New Year (December). The 12-month extension predicts a sustainable plateau rather than a vertical return, accounting for economic cooling factors.
            </p>
            <ResponsiveContainer width="100%" height="70%">
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="ds" stroke="var(--text-muted)" tickFormatter={(v) => v?.slice(2, 7)} fontSize={10} />
                <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `${(v/1e6).toFixed(0)}M`} fontSize={10} />
                <Tooltip labelStyle={{color: 'black'}} formatter={(value: any) => new Intl.NumberFormat('en').format(Math.round(Number(value) || 0))} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="actual" name="Historical Observed" stroke="#3b82f6" fillOpacity={0.2} fill="#3b82f6" strokeWidth={2} />
                <Area type="monotone" dataKey="yhat" name="Machine Learning Forecast" stroke="#c084fc" fillOpacity={0.2} fill="#c084fc" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Distribution (Top 10) */}
          <div className="glass-panel chart-card half" style={{ height: '500px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Revenue Concentration Index</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>
              <b>Finding:</b> Analysis of 77 provinces confirms high economic centralisation in <b>Bangkok, Phuket and Chonburi</b>. To meet Phase 2 proposal objectives, we designated secondary provinces as "Target Growth Areas" to distribute this revenue.
            </p>
            <ResponsiveContainer width="100%" height="75%">
              <BarChart data={topProvinces} layout="vertical" margin={{ left: 50, right: 30 }}>
                <YAxis dataKey="province_eng" type="category" stroke="var(--text-muted)" width={110} fontSize={11} />
                <XAxis type="number" stroke="var(--text-muted)" tickFormatter={(v) => `${(v/1e9).toFixed(1)}B`} fontSize={10} />
                <Tooltip labelStyle={{color: 'black'}} formatter={(val) => formatValue(Number(val))} />
                <Bar dataKey="revenue_all" fill="#c084fc66" stroke="#c084fc" radius={[0, 4, 4, 0]} name="Province Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Demographics / Structure */}
          <div className="glass-panel chart-card half" style={{ height: '500px' }}>
            <div className="chart-header">
              <h3 className="chart-title">Structural Market Breakdown</h3>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>
              <b>Result:</b> Domestic trips (Thai voters/travelers) represent <b>{demographics?.revenue?.[0]?.name === "Domestic (Thai)" ? ((demographics.revenue[0].value / (demographics.revenue[0].value + demographics.revenue[1].value)) * 100).toFixed(0) : "..."}%</b> of total revenue recorded during this period, signifying domestic stability during global volatility.
            </p>
            <div style={{ display: 'flex', height: '70%', gap: '1rem', alignItems:'center' }}>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demographics?.revenue} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2}>
                      {demographics?.revenue.map((_e: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatValue(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', marginTop:'10px' }}>
                  <span style={{ color: COLORS[0] }}>● Domestic (Thai)</span>
                  <span style={{ color: COLORS[1] }}>● Foreign</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom:'10px' }}>Annual Volume (Millions)</div>
                 <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={yearlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                      <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={10} />
                      <YAxis stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => `${(v/1e6).toFixed(0)}M`} />
                      <Tooltip labelStyle={{color: 'black'}} formatter={(v: number) => formatNumber(v)} />
                      <Bar dataKey="no_tourist_all" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Diagnosis & Mapping Section */}
          <div className="glass-panel chart-card half" style={{ height: '600px' }}>
            <div className="chart-header">
              <h3 className="chart-title" style={{ color: '#ef4444' }}>Diagnosis: Carrying Capacity Sentinel</h3>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              <b>Indicator:</b> We applied a statistical Carrying Capacity Index (CCI). Provinces like Koh Samui and Phuket often breach the 1.0 threshold during high-season, indicating overtourism stress.
            </p>
            <ResponsiveContainer width="100%" height="35%">
              <BarChart data={cciRedZones} layout="vertical" margin={{ left: 50, right: 30 }}>
                <YAxis dataKey="province_eng" type="category" stroke="var(--text-muted)" width={110} fontSize={11} />
                <XAxis type="number" stroke="var(--text-muted)" hide />
                <Tooltip labelStyle={{color: 'black'}} formatter={(val) => Number(val).toFixed(2)} />
                <Bar dataKey="CCI" fill="#ef444499" stroke="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ color: '#4ade80', marginBottom: '0.5rem', fontSize: '1rem' }}>Prescriptive Growth Zones (Secondary):</h4>
              <p style={{color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:'12px'}}>Targeted recommendation engine identifying locales with CCI &lt; 0.8:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {cci.filter((c: any) => c.Zone === 'Green').slice(0, 4).map((c: any, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'rgba(74, 222, 128, 0.05)', borderRadius: '12px', borderLeft: '3px solid #4ade80', backdropFilter:'blur(5px)' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{c.province_eng}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', alignItems:'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.region_eng}</span>
                      <strong style={{ color: '#4ade80', fontSize: '0.8rem', background:'rgba(74,222,128,0.1)', padding:'2px 6px', borderRadius:'4px' }}>CCI: {c.CCI.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="glass-panel chart-card half" style={{ height: '600px' }}>
            <div className="chart-header">
              <h3 className="chart-title"><Map size={20} style={{display:'inline', verticalAlign:'bottom', marginRight:'8px'}}/> Spatial Dispersal Strategy</h3>
            </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              <b>Geospatial Output:</b> This interactive map pins our ML-derived hotspots. Hover over markers to see real-time CCI capacity metrics processed by the Python engine.
            </p>
            <div style={{ width: '100%', height: '78%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <iframe src="/data/thailand_map.html" title="Thailand Map" width="100%" height="100%" style={{ border: 'none' }} />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
