import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import {
  Wind,
  Sun,
  Thermometer,
  Droplets,
  Home,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Leaf,
  Plus,
  Compass,
  Zap,
  Info
} from 'lucide-react';

export function EnvironmentHub({ state, onRefreshState }) {
  const envLogs = state.environmentalLogs || [];
  const currentEnv = state.currentEnvironment || envLogs[0] || {
    aqi: 38,
    pm25: 9.2,
    pm10: 18.5,
    uvIndex: 6.2,
    temperatureC: 26.5,
    humidityPct: 48,
    barometricPressureHpa: 1013.2,
    waterTdsPpm: 120,
    waterPh: 7.4,
    indoorCo2Ppm: 580,
    ayurvedicDoshaImpact: 'Balanced Tridoshic Climate',
    actionableGuidance: 'Optimal outdoor morning Prana. High air clarity supports outdoor Pranayama and mindful walking.',
    location: 'Local Micro-Climate Station',
    time: '08:00 AM',
    date: new Date().toISOString().split('T')[0]
  };

  const [refreshing, setRefreshing] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [customAqi, setCustomAqi] = useState(currentEnv.aqi || 38);
  const [customTemp, setCustomTemp] = useState(currentEnv.temperatureC || 26.5);
  const [customHumidity, setCustomHumidity] = useState(currentEnv.humidityPct || 48);
  const [customTds, setCustomTds] = useState(currentEnv.waterTdsPpm || 120);

  const handleRefreshFeed = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/environment/fetch', { method: 'POST' });
      if (res.ok) {
        await onRefreshState();
      }
    } catch (e) {
      console.error('Error refreshing environment feed', e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleManualSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aqi: parseInt(customAqi, 10) || 38,
        temperatureC: parseFloat(customTemp) || 26.5,
        humidityPct: parseInt(customHumidity, 10) || 48,
        waterTdsPpm: parseInt(customTds, 10) || 120,
        uvIndex: currentEnv.uvIndex || 6.0,
        indoorCo2Ppm: currentEnv.indoorCo2Ppm || 550,
        location: 'Manual Station Reading'
      };

      const res = await fetch('/api/environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await onRefreshState();
        setIsManualModalOpen(false);
      }
    } catch (e) {
      console.error('Error saving manual reading', e);
    }
  };

  // 7-Day Chart Data
  const chartData = envLogs.slice().reverse().map(l => ({
    date: l.date.slice(5),
    AQI: l.aqi,
    UV: l.uvIndex,
    Humidity: l.humidityPct,
    Temp: Math.round(l.temperatureC)
  }));

  // AQI color scale
  const getAqiConfig = (val) => {
    if (val <= 50) return { label: 'Good (Clean Prana)', color: '#34D399', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' };
    if (val <= 100) return { label: 'Moderate', color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' };
    return { label: 'Unhealthy for Sensitive', color: '#F87171', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' };
  };

  const aqiConfig = getAqiConfig(currentEnv.aqi);

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '750px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#34D399',
            marginBottom: '10px'
          }}>
            <Wind size={13} />
            ATMOSPHERIC PRANA & BIO-CLIMATIC HEALTH ADAPTATION
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 8px 0', fontFamily: "'Cinzel', serif" }}>
            Environmental Factors & Health Bio-Climate
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
            In Ayurvedic medicine (*Desha-Kala-Vayu*), ambient air quality, sunlight radiation, and water purity directly govern your digestive fire (*Agni*) and cellular respiration (*Pranavaha Srotas*).
          </p>
        </div>

        {/* Live Refresh / Station Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>
                {currentEnv.location}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>
                Updated {currentEnv.time}
              </div>
            </div>
            <button
              onClick={handleRefreshFeed}
              disabled={refreshing}
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: '#34D399',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Refresh Live Sensor Data"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FBBF24',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={14} /> Log Custom Sensor Reading
          </button>
        </div>
      </div>

      {/* 5 Environmental Telemetry Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {/* Card 1: Air Quality Index */}
        <div style={{ background: '#0F172A', border: `1px solid ${aqqiBorder(currentEnv.aqi)}`, borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Air Quality (AQI)</span>
            <Wind size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: aqiConfig.color, marginBottom: '2px' }}>
            {currentEnv.aqi} <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>AQI</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', backgroundColor: aqiConfig.bg, color: aqiConfig.color, display: 'inline-block', marginBottom: '8px' }}>
            {aqiConfig.label}
          </span>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            PM2.5: <strong style={{ color: '#CBD5E1' }}>{currentEnv.pm25} µg/m³</strong> • PM10: <strong style={{ color: '#CBD5E1' }}>{currentEnv.pm10}</strong>
          </div>
        </div>

        {/* Card 2: Solar & UV Index */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Solar & UV Index</span>
            <Sun size={18} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#FBBF24', marginBottom: '2px' }}>
            {currentEnv.uvIndex} <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>UV</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', display: 'inline-block', marginBottom: '8px' }}>
            Moderate Solar Prana
          </span>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Optimal Sun Window: <strong style={{ color: '#CBD5E1' }}>8:00 AM – 10:15 AM</strong>
          </div>
        </div>

        {/* Card 3: Temperature & Humidity */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Ambient Climate</span>
            <Thermometer size={18} color="#F87171" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#F8FAFC', marginBottom: '2px' }}>
            {currentEnv.temperatureC}°C <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>({Math.round(currentEnv.temperatureC * 9/5 + 32)}°F)</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'inline-block', marginBottom: '8px' }}>
            {currentEnv.humidityPct}% Humidity
          </span>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Pressure: <strong style={{ color: '#CBD5E1' }}>{currentEnv.barometricPressureHpa} hPa</strong>
          </div>
        </div>

        {/* Card 4: Drinking Water Purity */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Water Purity</span>
            <Droplets size={18} color="#22D3EE" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#22D3EE', marginBottom: '2px' }}>
            {currentEnv.waterTdsPpm} <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>ppm TDS</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', display: 'inline-block', marginBottom: '8px' }}>
            pH {currentEnv.waterPh || 7.4} Alkaline
          </span>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Optimal Mineral Balance: <strong style={{ color: '#34D399' }}>100% Pure</strong>
          </div>
        </div>

        {/* Card 5: Indoor Bio-Climate */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Indoor Air CO2</span>
            <Home size={18} color="#A78BFA" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#A78BFA', marginBottom: '2px' }}>
            {currentEnv.indoorCo2Ppm} <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>ppm</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', display: 'inline-block', marginBottom: '8px' }}>
            Fresh Ventilation
          </span>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Circadian Lighting: <strong style={{ color: '#CBD5E1' }}>Optimal</strong>
          </div>
        </div>
      </div>

      {/* Ayurvedic Environmental Adaptation & Ritu-Charya Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(99, 102, 241, 0.1) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '18px',
        padding: '24px 28px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Compass size={20} color="#FBBF24" />
          <h2 style={{ fontSize: '17px', fontWeight: 900, color: '#F8FAFC', margin: 0, fontFamily: "'Cinzel', serif" }}>
            Ayurvedic Environmental Dietetics & Seasonal Adaptation (Ritu-Charya)
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '11.5px', color: '#818CF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Current Dosha Impact: {currentEnv.ayurvedicDoshaImpact}
            </div>
            <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
              {currentEnv.actionableGuidance}
            </p>
          </div>

          <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Recommended Bio-Climate Herbal Infusions:
            </div>
            <div style={{ fontSize: '12.5px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• 🌿 <strong>Tulsi & Pippali Tea</strong>: Protects respiratory channels (*Pranavaha Srotas*) against airborne particulates.</div>
              <div>• 🪷 <strong>Coriander-Fennel Solar Elixir</strong>: Keeps internal Pitta cool during high solar UV hours.</div>
              <div>• 🌾 <strong>Warm Ushnodaka Water</strong>: Ignites cellular Agni while purging metabolic toxins (*Ama*).</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Environmental Timeline Graph */}
      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              7-Day Environmental Trends (AQI, UV Index & Humidity)
            </h3>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Atmospheric progression captured across sensor readings</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Data Source: EPA AirNow / OpenMeteo Sensor Stream
          </div>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }} />
              <Legend />
              <Area type="monotone" dataKey="AQI" stroke="#34D399" fill="rgba(16, 185, 129, 0.2)" />
              <Area type="monotone" dataKey="Humidity" stroke="#60A5FA" fill="rgba(59, 130, 246, 0.15)" />
              <Area type="monotone" dataKey="Temp" stroke="#F59E0B" fill="rgba(245, 158, 11, 0.15)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manual Reading Modal */}
      {isManualModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#F8FAFC', marginBottom: '14px' }}>
              Log Custom Environmental Reading
            </h3>

            <form onSubmit={handleManualSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Air Quality Index (AQI)</label>
                <input
                  type="number"
                  value={customAqi}
                  onChange={(e) => setCustomAqi(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={customTemp}
                    onChange={(e) => setCustomTemp(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Humidity (%)</label>
                  <input
                    type="number"
                    value={customHumidity}
                    onChange={(e) => setCustomHumidity(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Drinking Water TDS (ppm)</label>
                <input
                  type="number"
                  value={customTds}
                  onChange={(e) => setCustomTds(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  style={{ flex: 1, padding: '10px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#94A3B8', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px', backgroundColor: '#34D399', border: 'none', borderRadius: '8px', color: '#0B0F19', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function aqqiBorder(val) {
  if (val <= 50) return 'rgba(16, 185, 129, 0.3)';
  if (val <= 100) return 'rgba(245, 158, 11, 0.3)';
  return 'rgba(239, 68, 68, 0.3)';
}
