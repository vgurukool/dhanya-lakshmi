import React from 'react';
import { VEDIC_FOOD_QUOTES } from '../data/vedicFoodData';
import { Sparkles, Droplets, Utensils, Wind, Sun } from 'lucide-react';

export function Header({ keycloak, activeTab, todayWater = 2.8, currentEnv = {}, onOpenAddMeal }) {
  const quote = VEDIC_FOOD_QUOTES[0];
  const aqi = currentEnv.aqi || 38;
  const temp = currentEnv.temperatureC || 26.5;

  return (
    <header style={{
      height: '76px',
      backgroundColor: '#0F172A',
      borderBottom: '1px solid #1E293B',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
          fontSize: '18px'
        }}>
          🌾
        </div>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 900, margin: 0, color: '#F8FAFC' }}>
            {activeTab === 'dashboard' && 'Dhanya Lakshmi Vitality & Nourishment Overview'}
            {activeTab === 'meals' && 'Daily Meal & Nutrition Journal'}
            {activeTab === 'pantry' && 'Sacred Grains & Pantry Inventory'}
            {activeTab === 'recipes' && 'Ayurvedic Principles & Sattvic Recipes'}
            {activeTab === 'vitality' && 'Hydration, Agni & Ojas Vitality Logs'}
            {activeTab === 'wearables' && 'Smartwatch & Wearables Ingestion Hub'}
            {activeTab === 'environment' && 'Environmental Factors, AQI & Bio-Climate'}
          </h2>
          <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>
            अन्नपूर्णे सदा पूर्णे शंकरप्राणवल्लभे • Pure Sustenance & Health Abundance
          </span>
        </div>
      </div>

      {/* Right Badges: Live Climate Widget + Vedic Quote */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid #334155',
          borderRadius: '14px',
          padding: '5px 12px',
          fontSize: '11.5px',
          fontWeight: 700
        }}>
          <span style={{ color: '#34D399' }}>🌬️ AQI {aqi}</span>
          <span style={{ color: '#64748B' }}>•</span>
          <span style={{ color: '#FBBF24' }}>☀️ {temp}°C</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '6px 14px',
          maxWidth: '440px'
        }}>
          <div style={{ fontSize: '11px', color: '#FBBF24', fontWeight: 800, whiteSpace: 'nowrap' }}>
            {quote.quote.split('(')[0]}
          </div>
          <div style={{ fontSize: '10.5px', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            "{quote.translation}"
          </div>
        </div>

        {keycloak && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid #334155' }}>
            <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}>
              👤 {keycloak.tokenParsed?.preferred_username || 'user'}
            </span>
            <button
              onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
              title="Sign Out of Keycloak SSO"
              style={{
                background: '#EF4444',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
