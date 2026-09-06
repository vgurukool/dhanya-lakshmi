import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Wheat,
  BookHeart,
  Activity,
  Watch,
  Wind,
  Sparkles,
  Bot,
  Plus
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, state, onOpenAddMeal, onOpenAddPantry, onOpenAIChat }) {
  const mealsCount = state.meals?.length || 0;
  const pantryCount = state.pantry?.length || 0;
  const inStockPantryCount = state.pantry?.filter(p => p.inStock)?.length || 0;
  const aqiVal = state.currentEnvironment?.aqi || 38;

  return (
    <aside style={{
      width: '270px',
      backgroundColor: '#0F172A',
      borderRight: '1px solid #1E293B',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Brand */}
      <div style={{
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid #1E293B',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
          color: '#0B0F19'
        }}>
          🌾
        </div>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 900, color: '#F8FAFC', margin: 0, fontFamily: "'Cinzel', serif" }}>
            DHANYA LAKSHMI
          </h1>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#FBBF24', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Vedic Nourishment & Vitality
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflowY: 'auto' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'dashboard' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
            color: activeTab === 'dashboard' ? '#FBBF24' : '#94A3B8',
            fontWeight: activeTab === 'dashboard' ? 800 : 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutDashboard size={18} color={activeTab === 'dashboard' ? '#FBBF24' : '#94A3B8'} />
            <span>Vitality Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('meals')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'meals' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: activeTab === 'meals' ? '#34D399' : '#94A3B8',
            fontWeight: activeTab === 'meals' ? 800 : 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UtensilsCrossed size={18} color={activeTab === 'meals' ? '#34D399' : '#94A3B8'} />
            <span>Meals & Food Journal</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', backgroundColor: '#1E293B', color: '#CBD5E1' }}>
            {mealsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pantry')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'pantry' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
            color: activeTab === 'pantry' ? '#FBBF24' : '#94A3B8',
            fontWeight: activeTab === 'pantry' ? 800 : 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wheat size={18} color={activeTab === 'pantry' ? '#FBBF24' : '#94A3B8'} />
            <span>Grain & Pantry Inventory</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', backgroundColor: '#1E293B', color: '#FBBF24' }}>
            {inStockPantryCount}/{pantryCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'recipes' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === 'recipes' ? '#818CF8' : '#94A3B8',
            fontWeight: activeTab === 'recipes' ? 800 : 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookHeart size={18} color={activeTab === 'recipes' ? '#818CF8' : '#94A3B8'} />
            <span>Ayurvedic Recipes</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('vitality')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'vitality' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'vitality' ? '#22D3EE' : '#94A3B8',
            fontWeight: activeTab === 'vitality' ? 800 : 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={18} color={activeTab === 'vitality' ? '#22D3EE' : '#94A3B8'} />
            <span>Hydration & Ojas Logs</span>
          </div>
        </button>

        {/* Environmental Vitality Nav */}
        <button
          onClick={() => setActiveTab('environment')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'environment' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: activeTab === 'environment' ? '#34D399' : '#94A3B8',
            fontWeight: activeTab === 'environment' ? 800 : 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wind size={18} color={activeTab === 'environment' ? '#34D399' : '#94A3B8'} />
            <span>Environmental Vitality</span>
          </div>
          <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
            AQI {aqiVal}
          </span>
        </button>

        {/* Smartwatch & Wearables Sync Hub Nav */}
        <button
          onClick={() => setActiveTab('wearables')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'wearables' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
            color: activeTab === 'wearables' ? '#22D3EE' : '#94A3B8',
            fontWeight: activeTab === 'wearables' ? 800 : 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Watch size={18} color={activeTab === 'wearables' ? '#22D3EE' : '#94A3B8'} />
            <span>Wearables Sync Hub</span>
          </div>
          <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
            5 Active
          </span>
        </button>
      </nav>

      {/* Quick Action Buttons */}
      <div style={{ padding: '16px', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onOpenAddMeal}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '9px',
            borderRadius: '8px',
            backgroundColor: '#F59E0B',
            color: '#0B0F19',
            fontWeight: 800,
            fontSize: '12.5px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Log Nourishment Meal
        </button>

        <button
          onClick={onOpenAIChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '9px',
            borderRadius: '8px',
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            color: '#34D399',
            fontWeight: 700,
            fontSize: '12.5px',
            cursor: 'pointer'
          }}
        >
          <Bot size={16} /> Ayurvedic AI Advisor
        </button>

        <div style={{ fontSize: '11px', color: '#64748B', textAlign: 'center', marginTop: '4px' }}>
          Port: <strong style={{ color: '#FBBF24' }}>3003</strong> • FastAPI
        </div>
      </div>
    </aside>
  );
}
