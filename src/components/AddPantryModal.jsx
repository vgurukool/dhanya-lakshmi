import React, { useState } from 'react';
import { X, Wheat, Sparkles } from 'lucide-react';

export function AddPantryModal({ isOpen, onClose, onSavePantryItem }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [sanskritName, setSanskritName] = useState('');
  const [category, setCategory] = useState('Whole Grains');
  const [quantity, setQuantity] = useState(2.0);
  const [unit, setUnit] = useState('kg');
  const [organic, setOrganic] = useState(true);
  const [doshaAffinity, setDoshaAffinity] = useState('Tridoshic');
  const [benefits, setBenefits] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSavePantryItem({
      name: name.trim(),
      sanskritName: sanskritName.trim(),
      category,
      quantity: parseFloat(quantity) || 1.0,
      unit,
      organic,
      inStock: true,
      doshaAffinity,
      benefits: benefits.trim()
    });

    onClose();
  };

  return (
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
        borderRadius: '20px',
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
              <Wheat size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
                Add Pantry / Grain Item
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Record sacred grains, pulses, spices or pure oils</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Item Name</label>
            <input
              type="text"
              placeholder="e.g. Foxtail Millet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Sanskrit / Vedic Name</label>
              <input
                type="text"
                placeholder="e.g. Kangni / Priyangu"
                value={sanskritName}
                onChange={(e) => setSanskritName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
              >
                <option value="Whole Grains">Whole Grains (Dhanya)</option>
                <option value="Pulses & Lentils">Pulses & Lentils (Shimbhi)</option>
                <option value="Spices & Herbs">Spices & Herbs (Deepana)</option>
                <option value="Healthy Fats & Oils">Healthy Fats & Oils (Sneha)</option>
                <option value="Nuts & Seeds">Nuts & Seeds</option>
                <option value="Superfoods">Superfoods / Rasayana</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Quantity & Unit</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '60%', padding: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '12px' }}
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '40%', padding: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '12px' }}
                >
                  <option value="kg">kg</option>
                  <option value="grams">grams</option>
                  <option value="liters">liters</option>
                  <option value="lbs">lbs</option>
                  <option value="items">items</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Dosha Affinity</label>
              <select
                value={doshaAffinity}
                onChange={(e) => setDoshaAffinity(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
              >
                <option value="Tridoshic">Tridoshic (All Body Types)</option>
                <option value="Vata-Pitta Balancing">Vata-Pitta Balancing</option>
                <option value="Kapha-Pitta Balancing">Kapha-Pitta Balancing</option>
                <option value="Vata Pacifying">Vata Pacifying</option>
                <option value="Pitta Pacifying">Pitta Pacifying</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Health & Ayurvedic Benefits</label>
            <input
              type="text"
              placeholder="e.g. Rich in complex fiber, stabilizes blood sugar and energizes Agni"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '10px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#94A3B8', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ flex: 2, padding: '10px', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#0B0F19', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
            >
              Add to Grain Pantry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
