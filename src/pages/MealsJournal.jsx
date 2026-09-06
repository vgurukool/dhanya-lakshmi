import React, { useState } from 'react';
import { Utensils, Plus, Trash2, Calendar, Sparkles, Filter } from 'lucide-react';

export function MealsJournal({ meals = [], onOpenAddMeal, onDeleteMeal }) {
  const [filterType, setFilterType] = useState('All');

  const filteredMeals = filterType === 'All' ? meals : meals.filter(m => m.mealType === filterType);

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 6px 0', fontFamily: "'Cinzel', serif" }}>
            Daily Nourishment & Meal Journal
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            Chronological record of mindful meals, nutritional density, and Ayurvedic digestion ratings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', background: '#0F172A', padding: '4px', borderRadius: '10px', border: '1px solid #1E293B' }}>
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Mindful Snack'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: filterType === t ? '#F59E0B' : 'transparent',
                  color: filterType === t ? '#0B0F19' : '#94A3B8',
                  fontWeight: filterType === t ? 800 : 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddMeal}
            style={{ padding: '8px 16px', backgroundColor: '#F59E0B', color: '#0B0F19', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Log Meal
          </button>
        </div>
      </div>

      {/* Meals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredMeals.map(meal => (
          <div
            key={meal.id}
            style={{
              backgroundColor: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Utensils size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
                    {meal.mealType}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>•</span>
                  <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>{meal.date}</span>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: meal.sattvicQuality === 'Sattvic' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: meal.sattvicQuality === 'Sattvic' ? '#34D399' : '#FBBF24'
                  }}>
                    {meal.sattvicQuality}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 6px 0' }}>
                  {meal.name}
                </h3>

                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Ingredients: <span style={{ color: '#CBD5E1' }}>{(meal.foodItems || []).join(', ') || 'Wholesome recipe'}</span>
                </div>
              </div>
            </div>

            {/* Macros & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#F8FAFC' }}>
                  {meal.calories} <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600 }}>kcal</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  P: <strong style={{ color: '#94A3B8' }}>{meal.protein}g</strong> • C: <strong style={{ color: '#94A3B8' }}>{meal.carbs}g</strong> • F: <strong style={{ color: '#94A3B8' }}>{meal.fat}g</strong>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '6px 12px', backgroundColor: '#1E293B', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Energy</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#FBBF24' }}>{meal.energyScore}/10</div>
              </div>

              <button
                onClick={() => onDeleteMeal(meal.id)}
                title="Delete Meal Log"
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '6px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
