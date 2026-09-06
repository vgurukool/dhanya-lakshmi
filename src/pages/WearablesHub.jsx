import React, { useState } from 'react';
import {
  Watch,
  Activity,
  Droplets,
  Moon,
  Flame,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Copy
} from 'lucide-react';

export function WearablesHub({ state, onRefreshState }) {
  const wearables = state.wearables || [];
  const recentEvents = state.recentWearableEvents || [];
  const vitalityLogs = state.vitalityLogs || [];
  const todayVitality = vitalityLogs[0] || { waterLiters: 2.8, sleepHours: 7.5, movementMins: 35, pranaScore: 88 };

  const [simulating, setSimulating] = useState({});
  const [activeSetupTab, setActiveSetupTab] = useState('apple');
  const [copiedKey, setCopiedKey] = useState('');

  const handleSimulateSync = async (platform) => {
    setSimulating(prev => ({ ...prev, [platform]: true }));
    try {
      const res = await fetch(`/api/wearables/simulate/${platform}`, {
        method: 'POST'
      });
      if (res.ok) {
        await onRefreshState();
      }
    } catch (e) {
      console.error('Error simulating wearable sync', e);
    } finally {
      setSimulating(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const platformMeta = {
    apple: {
      icon: '🍏',
      color: '#A7F3D0',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#34D399',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      setupGuide: (
        <div>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '10px' }}>
            <strong>Apple Shortcuts Automation (Zero-Code Daily Sync):</strong>
          </p>
          <ol style={{ fontSize: '12.5px', color: '#94A3B8', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
            <li>Open the <strong>Shortcuts</strong> app on your iPhone.</li>
            <li>Create an Automation: <em>"When Waking Up"</em> or <em>"Daily at 7:30 AM"</em>.</li>
            <li>Add Actions: <strong>Find Health Samples</strong> (Water, In Bed Sleep, Active Energy, HRV).</li>
            <li>Add Action: <strong>Get Contents of URL</strong> → <code style={{ color: '#FBBF24', background: '#1E293B', padding: '2px 6px', borderRadius: '4px' }}>POST http://&lt;your-local-ip&gt;:3003/api/wearables/sync/apple</code>.</li>
          </ol>
        </div>
      )
    },
    google: {
      icon: '🤖',
      color: '#93C5FD',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeColor: '#60A5FA',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      setupGuide: (
        <div>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '10px' }}>
            <strong>Google Health Connect & Wear OS API:</strong>
          </p>
          <ol style={{ fontSize: '12.5px', color: '#94A3B8', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
            <li>Install <strong>Health Connect by Android</strong> on your Pixel Watch / Phone.</li>
            <li>Grant Read permissions for <em>Hydration</em>, <em>Sleep</em>, and <em>Daily Exercise Sessions</em>.</li>
            <li>Health Connect feeds directly via local REST webhook to <code style={{ color: '#FBBF24', background: '#1E293B', padding: '2px 6px', borderRadius: '4px' }}>/api/wearables/sync/google</code>.</li>
          </ol>
        </div>
      )
    },
    garmin: {
      icon: '🏃',
      color: '#FDE68A',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeColor: '#FBBF24',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      setupGuide: (
        <div>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '10px' }}>
            <strong>Garmin Connect Daily Summary Ingestion:</strong>
          </p>
          <ol style={{ fontSize: '12.5px', color: '#94A3B8', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
            <li>Connects to Garmin Health Daily Summary export.</li>
            <li>Maps Garmin <strong>Body Battery</strong> directly to your Vedic <em>Ojas</em> Vitality Index.</li>
            <li>Streams water logs from the Garmin Hydration Tracking widget.</li>
          </ol>
        </div>
      )
    },
    fitbit: {
      icon: '⌚',
      color: '#FBCFE8',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      badgeColor: '#F472B6',
      borderColor: 'rgba(236, 72, 153, 0.3)',
      setupGuide: (
        <div>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '10px' }}>
            <strong>Fitbit Web API 1.2 Ingestion:</strong>
          </p>
          <ol style={{ fontSize: '12.5px', color: '#94A3B8', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
            <li>Extracts Sleep Score & Deep/REM stages from Fitbit Sense / Charge.</li>
            <li>Pulls Active Zone Minutes (AZM) and logged daily water.</li>
            <li>Endpoints ingest seamlessly via <code style={{ color: '#FBBF24', background: '#1E293B', padding: '2px 6px', borderRadius: '4px' }}>/api/wearables/sync/fitbit</code>.</li>
          </ol>
        </div>
      )
    },
    oura: {
      icon: '💍',
      color: '#C4B5FD',
      badgeBg: 'rgba(139, 92, 246, 0.15)',
      badgeColor: '#A78BFA',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      setupGuide: (
        <div>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '10px' }}>
            <strong>Oura Ring Gen 3 / Whoop 4.0 Biometrics:</strong>
          </p>
          <ol style={{ fontSize: '12.5px', color: '#94A3B8', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
            <li>Directly streams Oura <strong>Readiness Score (1-100)</strong> as cellular Ojas.</li>
            <li>Monitors nocturnal HRV balance, sleep latency, and body temperature deviation.</li>
          </ol>
        </div>
      )
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
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
            background: 'rgba(6, 182, 212, 0.2)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#22D3EE',
            marginBottom: '10px'
          }}>
            <Watch size={13} />
            BIOMETRIC TELEMETRY & WEARABLE DATA INGESTION ENGINE
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 8px 0', fontFamily: "'Cinzel', serif" }}>
            Smartwatch & Wearables Sync Hub
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
            Continuously streams sleep architecture, hydration, active movement, and recovery metrics from the top 5 wearable platforms to compute your Ayurvedic vitality score (*Ojas*).
          </p>
        </div>

        {/* Sync Summary Badge */}
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '18px 24px',
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
            Connected Ecosystem
          </span>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#22D3EE', margin: '2px 0' }}>
            5/5 Active
          </div>
          <span style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 700 }}>
            ● Real-Time Webhooks Ready
          </span>
        </div>
      </div>

      {/* 4 Live Biometric Summary Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Watch Hydration</span>
            <Droplets size={18} color="#22D3EE" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#22D3EE' }}>
            {todayVitality.waterLiters || 2.8}L
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            Auto-synced from Watch Water Logs
          </div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Restorative Sleep</span>
            <Moon size={18} color="#818CF8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#818CF8' }}>
            {todayVitality.sleepHours || 7.5}h
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            Sleep Stages (Core, REM & Deep)
          </div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Active Movement</span>
            <Flame size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#FBBF24' }}>
            {todayVitality.movementMins || 45} mins
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            Active Heart Points & Workouts
          </div>
        </div>

        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Ojas Recovery Index</span>
            <Sparkles size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#34D399' }}>
            {todayVitality.pranaScore || 90}/100
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            HRV + Body Battery + Readiness
          </div>
        </div>
      </div>

      {/* 5 Wearable Platform Cards */}
      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
        Top 5 Major Smartwatch & Wearable Platforms
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {wearables.map(w => {
          const meta = platformMeta[w.platform] || platformMeta.apple;
          const isSim = simulating[w.platform];

          return (
            <div
              key={w.platform}
              style={{
                backgroundColor: '#0F172A',
                border: `1px solid ${meta.borderColor}`,
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ fontSize: '26px' }}>{meta.icon}</div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    backgroundColor: meta.badgeBg,
                    color: meta.badgeColor
                  }}>
                    {w.status.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 4px 0' }}>
                  {w.name}
                </h3>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', marginBottom: '12px' }}>
                  {w.deviceModel}
                </div>

                <div style={{ borderTop: '1px solid #1E293B', paddingTop: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                    Metrics Ingested:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {(w.metricsCovered || []).slice(0, 3).map((m, idx) => (
                      <span key={idx} style={{ fontSize: '11px', color: '#64748B' }}>
                        • {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '10.5px', color: '#64748B', marginBottom: '10px' }}>
                  Last sync: <strong style={{ color: '#94A3B8' }}>{w.lastSyncedAt ? new Date(w.lastSyncedAt).toLocaleTimeString() : 'Never'}</strong>
                </div>

                <button
                  onClick={() => handleSimulateSync(w.platform)}
                  disabled={isSim}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#1E293B',
                    color: '#F8FAFC',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                >
                  <RefreshCw size={13} className={isSim ? 'animate-spin' : ''} />
                  <span>{isSim ? 'Syncing...' : 'Test Live Sync'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Setup Guide & Webhook Endpoints Container */}
      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
          Smartwatch Connection & Webhook Setup Instructions
        </h3>
        <p style={{ fontSize: '12.5px', color: '#94A3B8', marginBottom: '18px' }}>
          Select your wearable platform to view the direct webhook endpoint URL and configuration guide.
        </p>

        {/* Platform Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
          {wearables.map(w => (
            <button
              key={w.platform}
              onClick={() => setActiveSetupTab(w.platform)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: activeSetupTab === w.platform ? '1px solid #F59E0B' : '1px solid #1E293B',
                backgroundColor: activeSetupTab === w.platform ? 'rgba(245, 158, 11, 0.2)' : '#1E293B',
                color: activeSetupTab === w.platform ? '#FBBF24' : '#94A3B8',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {platformMeta[w.platform]?.icon} {w.name.split('&')[0]}
            </button>
          ))}
        </div>

        {/* Active Setup Card */}
        <div style={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase' }}>
              Universal Webhook Endpoint URL
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0F172A', padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
              <code style={{ fontSize: '12px', color: '#FBBF24' }}>
                http://127.0.0.1:3003/api/wearables/sync/{activeSetupTab}
              </code>
              <button
                onClick={() => handleCopyText(`http://127.0.0.1:3003/api/wearables/sync/${activeSetupTab}`, activeSetupTab)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                title="Copy Webhook URL"
              >
                <Copy size={14} />
              </button>
              {copiedKey === activeSetupTab && <span style={{ fontSize: '11px', color: '#34D399' }}>Copied!</span>}
            </div>
          </div>

          {platformMeta[activeSetupTab]?.setupGuide}
        </div>
      </div>

      {/* Live Ingestion Log Feed */}
      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
          Recent Telemetry Ingestions & Normalized Biometric Stream
        </h3>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>
          Raw payloads parsed and converted into local Dhanya Lakshmi vitality logs
        </p>

        {recentEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '13px' }}>
            No recent events recorded. Click "Test Live Sync" above on any platform to simulate an instant stream.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentEvents.map(evt => (
              <div
                key={evt.id}
                style={{
                  backgroundColor: '#1E293B',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px' }}>{platformMeta[evt.platform]?.icon}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#F8FAFC', textTransform: 'capitalize' }}>
                      {evt.platform} Watch Sync
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>•</span>
                    <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>{new Date(evt.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
                    💧 <strong>{evt.derivedMetrics?.waterLiters}L</strong> water • 🌙 <strong>{evt.derivedMetrics?.sleepHours}h</strong> sleep • 🏃 <strong>{evt.derivedMetrics?.movementMins}m</strong> movement
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#34D399' }}>
                    {evt.derivedMetrics?.pranaScore}/100
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700 }}>Ojas Vitality</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
