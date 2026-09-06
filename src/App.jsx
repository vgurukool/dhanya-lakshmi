import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { MealsJournal } from './pages/MealsJournal';
import { Pantry } from './pages/Pantry';
import { AyurvedicGuide } from './pages/AyurvedicGuide';
import { VitalityLogs } from './pages/VitalityLogs';
import { WearablesHub } from './pages/WearablesHub';
import { EnvironmentHub } from './pages/EnvironmentHub';
import { AddMealModal } from './components/AddMealModal';
import { AddPantryModal } from './components/AddPantryModal';
import { AIChatModal } from './components/AIChatModal';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [state, setState] = useState({
    meals: [],
    pantry: [],
    vitalityLogs: [],
    recipes: [],
    settings: {},
    wearables: [],
    recentWearableEvents: [],
    environmentalLogs: [],
    currentEnvironment: null
  });
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isAddPantryOpen, setIsAddPantryOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Fetch live state from Python FastAPI backend on mount
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (e) {
      console.error('Failed to load state from FastAPI server', e);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleSaveMeal = async (mealData) => {
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealData)
      });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) {
      console.error('Error saving meal', e);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Delete this meal from your nourishment journal?')) return;
    try {
      const res = await fetch(`/api/meals/${mealId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) {
      console.error('Error deleting meal', e);
    }
  };

  const handleSavePantryItem = async (pantryData) => {
    try {
      const res = await fetch('/api/pantry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pantryData)
      });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) {
      console.error('Error saving pantry item', e);
    }
  };

  const handleDeletePantryItem = async (itemId) => {
    if (!window.confirm('Remove this item from your grain pantry?')) return;
    try {
      const res = await fetch(`/api/pantry/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) {
      console.error('Error deleting pantry item', e);
    }
  };

  const handleSaveVitality = async (vitalityData) => {
    try {
      const res = await fetch('/api/vitality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitalityData)
      });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) {
      console.error('Error saving vitality log', e);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F1F5F9' }}>
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        state={state}
        onOpenAddMeal={() => setIsAddMealOpen(true)}
        onOpenAddPantry={() => setIsAddPantryOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main Viewport */}
      <div style={{ flex: 1, marginLeft: '270px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          activeTab={activeTab}
          todayWater={state.vitalityLogs?.[0]?.waterLiters || 2.8}
          currentEnv={state.currentEnvironment || {}}
          onOpenAddMeal={() => setIsAddMealOpen(true)}
        />

        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <Dashboard
              state={state}
              onOpenAddMeal={() => setIsAddMealOpen(true)}
              onOpenAddPantry={() => setIsAddPantryOpen(true)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'meals' && (
            <MealsJournal
              meals={state.meals}
              onOpenAddMeal={() => setIsAddMealOpen(true)}
              onDeleteMeal={handleDeleteMeal}
            />
          )}

          {activeTab === 'pantry' && (
            <Pantry
              pantry={state.pantry}
              onOpenAddPantry={() => setIsAddPantryOpen(true)}
              onDeletePantryItem={handleDeletePantryItem}
            />
          )}

          {activeTab === 'recipes' && (
            <AyurvedicGuide
              recipes={state.recipes}
              onOpenAddMeal={() => setIsAddMealOpen(true)}
            />
          )}

          {activeTab === 'vitality' && (
            <VitalityLogs
              vitalityLogs={state.vitalityLogs}
              onSaveVitality={handleSaveVitality}
            />
          )}

          {activeTab === 'wearables' && (
            <WearablesHub
              state={state}
              onRefreshState={fetchState}
            />
          )}

          {activeTab === 'environment' && (
            <EnvironmentHub
              state={state}
              onRefreshState={fetchState}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        onSaveMeal={handleSaveMeal}
      />

      <AddPantryModal
        isOpen={isAddPantryOpen}
        onClose={() => setIsAddPantryOpen(false)}
        onSavePantryItem={handleSavePantryItem}
      />

      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
