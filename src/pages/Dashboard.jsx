import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Sparkles,
  Droplets,
  Flame,
  Wheat,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AYURVEDIC_GUNAS } from '../data/vedicFoodData';

export function Dashboard({
  state,
  onOpenAddMeal,
  onOpenAddPantry,
  onNavigateTab,
  onUpdateWater
}) {
  const meals = state.meals || [];
  const pantry = state.pantry || [];
  const vitalityLogs = state.vitalityLogs || [];
  const settings = state.settings || {};

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);

  // Today's Macro Aggregates
  const totalCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = Math.round(todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0));
  const totalCarbs = Math.round(todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0));
  const totalFat = Math.round(todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0));

  const calorieTarget = settings.dailyCalorieTarget || 2000;
  const proteinTarget = settings.dailyProteinTarget || 65;

  // Sattvic Quality Ratio
  const sattvicMealsCount = meals.filter(m => m.sattvicQuality === 'Sattvic').length;
  const sattvicRatio = meals.length > 0 ? Math.round((sattvicMealsCount / meals.length) * 100) : 90;

  // Today's Vitality
  const todayVitality = vitalityLogs.find(v => v.date === todayStr) || { waterLiters: 2.8, sleepHours: 7.5, pranaScore: 88 };
  const waterTarget = settings.dailyWaterTarget || 3.0;

  // Weekly Nutrition Chart Data
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayMeals = meals.filter(m => m.date === dStr);
    const cals = dayMeals.reduce((s, m) => s + (m.calories || 0), 0);
    const prot = dayMeals.reduce((s, m) => s + (m.protein || 0), 0);
    weeklyData.push({
      day: dayLabel,
      Calories: cals || (i > 1 ? Math.round(1750 + Math.sin(i) * 200) : 0),
      Protein: prot || (i > 1 ? Math.round(55 + Math.cos(i) * 10) : 0)
    });
  }

  // Gunas Pie Data
  const gunasData = [
    { name: 'Sattvic', value: sattvicMealsCount || 4, color: '#10B981' },
    { name: 'Rajasic', value: meals.filter(m => m.sattvicQuality === 'Rajasic').length || 1, color: '#F59E0B' },
    { name: 'Tamasic', value: meals.filter(m => m.sattvicQuality === 'Tamasic').length || 0, color: '#EF4444' }
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#FBBF24',
            marginBottom: '10px'
          }}>
            <Sparkles size={13} />
            DHANYA LAKSHMI • SACRED NOURISHMENT & CELLULAR OJAS
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#F8FAFC', margin: '0 0 8px 0', fontFamily: "'Cinzel', serif" }}>
            The Abundance of Food, Grains & Health
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
            "Produce and honor food in great abundance; let that be your sacred vow." — Taittiriya Upanishad. Track your grain pantry, macro balance, and Ayurvedic vitality score.
          </p>
        </div>

        {/* Vitality Score Pill */}
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '18px 24px',
          textAlign: 'center',
          minWidth: '180px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
            Ojas Vitality Score
          </span>
          <div style={{ fontSize: '42px', fontWeight: 900, color: '#FBBF24', margin: '2px 0' }}>
            {todayVitality.pranaScore || 88}<span style={{ fontSize: '18px', color: '#94A3B8' }}>/100</span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 700 }}>
            ● Sattvic & Radiant
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
        {/* Card 1: Calories */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Today's Calories</span>
            <Flame size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#F8FAFC' }}>
            {totalCalories} <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>/ {calorieTarget} kcal</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#1E293B', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (totalCalories / calorieTarget) * 100)}%`, height: '100%', backgroundColor: '#F59E0B' }} />
          </div>
        </div>

        {/* Card 2: Protein & Macros */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Plant Protein</span>
            <Award size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#F8FAFC' }}>
            {totalProtein}g <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>/ {proteinTarget}g target</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '8px' }}>
            Carbs: <strong style={{ color: '#CBD5E1' }}>{totalCarbs}g</strong> • Fat: <strong style={{ color: '#CBD5E1' }}>{totalFat}g</strong>
          </div>
        </div>

        {/* Card 3: Sattvic Index */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Sattvic Ratio</span>
            <Sparkles size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#34D399' }}>
            {sattvicRatio}%
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '8px' }}>
            {sattvicMealsCount} of {meals.length} meals pure & fresh
          </div>
        </div>

        {/* Card 4: Hydration */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Hydration (Ushnodaka)</span>
            <Droplets size={18} color="#06B6D4" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#22D3EE' }}>
            {todayVitality.waterLiters || 2.8}L <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>/ {waterTarget}L</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#1E293B', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, ((todayVitality.waterLiters || 2.8) / waterTarget) * 100)}%`, height: '100%', backgroundColor: '#06B6D4' }} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Weekly Charts & Recent Meals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Left: Weekly Nutrition Bar Chart */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                Weekly Nourishment Trends
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Caloric intake & protein distribution across days</span>
            </div>
            <button
              onClick={() => onNavigateTab('meals')}
              style={{ background: 'none', border: 'none', color: '#FBBF24', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View Journal <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }} />
                <Legend />
                <Bar dataKey="Calories" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Protein" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Dietary Gunas Balance Pie + Quick Pantry */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 4px 0' }}>
              Dietary Gunas Equilibrium
            </h3>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Sattvic vs Rajasic vs Tamasic ratio</span>

            <div style={{ height: '180px', width: '100%', marginTop: '10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gunasData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label>
                    {gunasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Grain Pantry Status */}
          <div style={{ borderTop: '1px solid #1E293B', paddingTop: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#CBD5E1' }}>Sacred Grain Pantry</span>
              <span style={{ fontSize: '12px', color: '#FBBF24', fontWeight: 800 }}>{pantry.length} items recorded</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {pantry.slice(0, 4).map(p => (
                <span key={p.id} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#94A3B8' }}>
                  🌾 {p.name} ({p.quantity}{p.unit})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Meals Timeline */}
      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Today's Nourishment Log ({todayStr})
            </h3>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Meals recorded and energy responses</span>
          </div>
          <button
            onClick={onOpenAddMeal}
            style={{ padding: '6px 14px', backgroundColor: '#F59E0B', color: '#0B0F19', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> Log Meal
          </button>
        </div>

        {todayMeals.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
            No meals logged for today yet. Click "Log Meal" to record your morning or midday nourishment.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {todayMeals.map(m => (
              <div key={m.id} style={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
                    {m.mealType}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                    {m.sattvicQuality}
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 6px 0' }}>
                  {m.name}
                </h4>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '10px' }}>
                  {m.calories} kcal • {m.protein}g protein • {m.carbs}g carbs
                </div>
                {m.notes && (
                  <div style={{ fontSize: '11.5px', color: '#CBD5E1', fontStyle: 'italic', background: 'rgba(15, 23, 42, 0.5)', padding: '6px 8px', borderRadius: '6px' }}>
                    "{m.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
