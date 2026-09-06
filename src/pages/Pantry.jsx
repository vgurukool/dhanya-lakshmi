import React, { useState } from 'react';
import { Wheat, Plus, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function Pantry({ pantry = [], onOpenAddPantry, onDeletePantryItem }) {
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Whole Grains', 'Pulses & Lentils', 'Spices & Herbs', 'Healthy Fats & Oils', 'Nuts & Seeds', 'Superfoods'];

  const filteredPantry = selectedCat === 'All' ? pantry : pantry.filter(p => p.category === selectedCat);

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 6px 0', fontFamily: "'Cinzel', serif" }}>
            Sacred Grains & Kitchen Pantry Inventory
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            Manage the sacred nourishment (*Dhanya Varga*) of whole grains, healing lentils, pure A2 ghee, and restorative spices.
          </p>
        </div>

        <button
          onClick={onOpenAddPantry}
          style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#0B0F19', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} /> Add Grain / Pantry Item
        </button>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '22px' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCat(c)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: selectedCat === c ? '1px solid #F59E0B' : '1px solid #1E293B',
              backgroundColor: selectedCat === c ? 'rgba(245, 158, 11, 0.2)' : '#0F172A',
              color: selectedCat === c ? '#FBBF24' : '#94A3B8',
              fontWeight: selectedCat === c ? 800 : 600,
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid of Pantry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        {filteredPantry.map(item => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
                  {item.category}
                </span>
                {item.organic && (
                  <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                    100% Organic
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 2px 0' }}>
                {item.name}
              </h3>
              {item.sanskritName && (
                <div style={{ fontSize: '11.5px', color: '#94A3B8', fontStyle: 'italic', marginBottom: '8px' }}>
                  Vedic: {item.sanskritName}
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4, margin: '8px 0', minHeight: '34px' }}>
                {item.benefits || 'Pure nourishment according to Ayurvedic principles.'}
              </div>

              <div style={{ fontSize: '11px', color: '#818CF8', fontWeight: 700, marginBottom: '14px' }}>
                Dosha: {item.doshaAffinity || 'Tridoshic'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1E293B', paddingTop: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#F8FAFC' }}>
                {item.quantity} <span style={{ fontSize: '12px', color: '#94A3B8' }}>{item.unit} in stock</span>
              </div>
              <button
                onClick={() => onDeletePantryItem(item.id)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
