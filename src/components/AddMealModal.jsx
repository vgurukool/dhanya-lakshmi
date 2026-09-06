import React, { useState } from 'react';
import { X, Utensils, Sparkles } from 'lucide-react';

export function AddMealModal({ isOpen, onClose, onSaveMeal }) {
  if (!isOpen) return null;

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState('Lunch');
  const [name, setName] = useState('');
  const [foodItemsRaw, setFoodItemsRaw] = useState('');
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(18);
  const [carbs, setCarbs] = useState(65);
  const [fat, setFat] = useState(12);
  const [fiber, setFiber] = useState(8);
  const [sattvicQuality, setSattvicQuality] = useState('Sattvic');
  const [energyScore, setEnergyScore] = useState(9);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const items = foodItemsRaw
      ? foodItemsRaw.split(',').map(i => i.trim()).filter(Boolean)
      : [name.trim()];

    onSaveMeal({
      date,
      mealType,
      name: name.trim(),
      foodItems: items,
      calories: parseInt(calories, 10) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      fiber: parseFloat(fiber) || 0,
      sattvicQuality,
      energyScore: parseInt(energyScore, 10) || 8,
      notes: notes.trim()
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
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
              <Utensils size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
                Log Nourishment Meal
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Record Ayurvedic nutritional qualities & macronutrients</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
              >
                <option value="Breakfast">Breakfast (Pratah-Ahara)</option>
                <option value="Lunch">Lunch (Madhyahna - Peak Agni)</option>
                <option value="Dinner">Dinner (Sayam-Ahara)</option>
                <option value="Mindful Snack">Mindful Snack / Tonic</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Meal Name</label>
            <input
              type="text"
              placeholder="e.g. Golden Moong Dal Kitchari with Ghee"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Food Ingredients (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Yellow Moong Dal, Basmati Rice, Ghee, Turmeric, Cumin"
              value={foodItemsRaw}
              onChange={(e) => setFoodItemsRaw(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
            />
          </div>

          {/* Macros Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Protein (g)</label>
              <input
                type="number"
                step="0.5"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Carbs (g)</label>
              <input
                type="number"
                step="0.5"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Fat (g)</label>
              <input
                type="number"
                step="0.5"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Fiber (g)</label>
              <input
                type="number"
                step="0.5"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F8FAFC', fontSize: '12px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Ayurvedic Quality (Guna)</label>
              <select
                value={sattvicQuality}
                onChange={(e) => setSattvicQuality(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
              >
                <option value="Sattvic">Sattvic (Pure, Fresh, Nourishing)</option>
                <option value="Rajasic">Rajasic (Spicy, Stimulating, Active)</option>
                <option value="Tamasic">Tamasic (Heavy, Stale, Sedating)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Post-Meal Energy (1 to 10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyScore}
                onChange={(e) => setEnergyScore(e.target.value)}
                style={{ width: '100%', accentColor: '#F59E0B' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8' }}>
                <span>Sluggish (1)</span>
                <span style={{ fontWeight: 800, color: '#FBBF24' }}>{energyScore}/10 Energy</span>
                <span>Radiant (10)</span>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Mindful Reflection / Digestion Notes</label>
            <input
              type="text"
              placeholder="e.g. Light digestion, felt energized and peaceful after eating"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              style={{ flex: 2, padding: '10px', backgroundColor: '#F59E0B', border: 'none', borderRadius: '8px', color: '#0B0F19', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
            >
              Save Meal to Journal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
