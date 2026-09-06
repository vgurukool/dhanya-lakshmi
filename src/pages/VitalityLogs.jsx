import React, { useState } from 'react';
import { Activity, Droplets, Moon, Flame, Sparkles, Plus } from 'lucide-react';

export function VitalityLogs({ vitalityLogs = [], onSaveVitality }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [water, setWater] = useState(2.8);
  const [sleep, setSleep] = useState(7.5);
  const [movement, setMovement] = useState(30);
  const [fasting, setFasting] = useState(13);
  const [prana, setPrana] = useState(88);
  const [notes, setNotes] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onSaveVitality({
      date: todayStr,
      waterLiters: parseFloat(water) || 2.5,
      sleepHours: parseFloat(sleep) || 7.0,
      movementMins: parseInt(movement, 10) || 30,
      fastingHours: parseFloat(fasting) || 12.0,
      pranaScore: parseInt(prana, 10) || 85,
      notes: notes.trim()
    });
    alert('Today\'s vitality log recorded!');
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 6px 0', fontFamily: "'Cinzel', serif" }}>
          Hydration, Agni & Ojas Vitality Logs
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
          Record circadian alignment, overnight digestive rest (fasting window), water intake, and physical movement.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        {/* Log Today's Vitality Form */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
            Record Vitality for Today ({todayStr})
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Water Intake (Liters)</span>
                <span style={{ color: '#22D3EE', fontWeight: 800 }}>{water}L / 3.0L Target</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={water}
                onChange={(e) => setWater(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Restorative Sleep (Hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Movement / Yoga (Mins)</label>
                <input
                  type="number"
                  value={movement}
                  onChange={(e) => setMovement(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Overnight Fasting Window (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={fasting}
                onChange={(e) => setFasting(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Ojas & Vitality Rating (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={prana}
                onChange={(e) => setPrana(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
              />
            </div>

            <button
              type="submit"
              style={{ padding: '10px', backgroundColor: '#06B6D4', color: '#0B0F19', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', marginTop: '6px' }}
            >
              Save Vitality Record
            </button>
          </form>
        </div>

        {/* Vitality History List */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
            Past 7 Days Vitality Rhythm
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {vitalityLogs.map(log => (
              <div
                key={log.date}
                style={{
                  backgroundColor: '#1E293B',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#F8FAFC', marginBottom: '2px' }}>
                    {log.date}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                    💧 {log.waterLiters}L water • 🌙 {log.sleepHours}h sleep • ⏱️ {log.fastingHours}h fast
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#FBBF24' }}>
                    {log.pranaScore}/100
                  </div>
                  <div style={{ fontSize: '10px', color: '#34D399', fontWeight: 700 }}>Ojas Index</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
