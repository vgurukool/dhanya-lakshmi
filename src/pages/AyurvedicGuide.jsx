import React from 'react';
import { SHAD_RASAS, AYURVEDIC_GUNAS } from '../data/vedicFoodData';
import { BookHeart, Flame, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

export function AyurvedicGuide({ recipes = [], onOpenAddMeal }) {
  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '18px',
        padding: '26px 30px',
        marginBottom: '28px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 6px 0', fontFamily: "'Cinzel', serif" }}>
          Ayurvedic Nutrition, Shad Rasas & Healing Recipes
        </h1>
        <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
          In Ayurveda, food (*Ahara*) is the primary medicine. Incorporating all 6 Rasas (tastes) and balancing the digestive fire (*Agni*) creates pure subtle vitality (*Ojas*).
        </p>
      </div>

      {/* The 6 Rasas (Tastes) Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', marginBottom: '14px' }}>
          The Six Sacred Tastes (Shad Rasas)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {SHAD_RASAS.map(r => (
            <div key={r.name} style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FBBF24', marginBottom: '4px' }}>
                {r.name}
              </div>
              <div style={{ fontSize: '11px', color: '#818CF8', fontWeight: 700, marginBottom: '6px' }}>
                Elements: {r.elements}
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4, marginBottom: '8px' }}>
                {r.action}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                Key Sources: <strong style={{ color: '#E2E8F0' }}>{r.sources}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Recipes Collection */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', marginBottom: '14px' }}>
          Sattvic & Healing Recipes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {recipes.map(rec => (
            <div
              key={rec.id}
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                    {rec.category}
                  </span>
                  <span style={{ fontSize: '11px', color: '#FBBF24', fontWeight: 800 }}>
                    {rec.calories} kcal • {rec.prepTimeMins} mins
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 2px 0' }}>
                  {rec.name}
                </h3>
                {rec.sanskritName && (
                  <div style={{ fontSize: '11.5px', color: '#94A3B8', fontStyle: 'italic', marginBottom: '10px' }}>
                    {rec.sanskritName}
                  </div>
                )}

                <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700, marginBottom: '10px' }}>
                  Dosha: {rec.doshaBalance}
                </div>

                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.45, marginBottom: '14px' }}>
                  {rec.benefits}
                </p>

                <div style={{ fontSize: '11.5px', color: '#CBD5E1', background: '#1E293B', padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>
                  <strong style={{ display: 'block', color: '#FBBF24', marginBottom: '4px' }}>Ingredients:</strong>
                  {(rec.ingredients || []).join(', ')}
                </div>
              </div>

              <button
                onClick={onOpenAddMeal}
                style={{
                  width: '100%',
                  padding: '9px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  color: '#FBBF24',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Log this Recipe into Journal
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
