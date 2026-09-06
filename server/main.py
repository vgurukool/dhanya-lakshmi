import os
import json
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from db import (
    init_db, get_state, save_meal, delete_meal,
    save_pantry_item, delete_pantry_item, save_vitality_log, update_preferences,
    process_wearable_payload, simulate_wearable_sync,
    save_environmental_log, fetch_or_simulate_environment
)

init_db()

app = FastAPI(
    title="Dhanya Lakshmi — Vedic Nourishment & Environmental Bio-Climate API",
    description="Python FastAPI High-Performance Backend for Dhanya Lakshmi Food, Grains, Wearables & Environmental Telemetry",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "dist"

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Dhanya Lakshmi Vedic Nourishment & Environmental Platform",
        "framework": "FastAPI",
        "port": 3003
    }

# GET /api/state
@app.get("/api/state")
def api_get_state():
    try:
        return get_state()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Environmental Ingestion Endpoints
@app.get("/api/environment")
def api_get_environment():
    try:
        state = get_state()
        return {
            "current": state.get("currentEnvironment"),
            "history": state.get("environmentalLogs", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/environment")
async def api_save_environment(request: Request):
    try:
        data = await request.json()
        saved = save_environmental_log(data)
        return {"success": True, "environment": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/environment/fetch")
def api_fetch_environment():
    try:
        latest = fetch_or_simulate_environment()
        return {
            "success": True,
            "message": "Local micro-climate and Air Quality Index refreshed from sensor network.",
            "data": latest
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Smartwatch & Wearable Ingestion Endpoints
@app.get("/api/wearables")
def api_get_wearables():
    try:
        state = get_state()
        return {
            "wearables": state.get("wearables", []),
            "recentEvents": state.get("recentWearableEvents", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/wearables/sync/{platform}")
async def api_sync_wearable(platform: str, request: Request):
    try:
        payload = await request.json()
        result = process_wearable_payload(platform.lower(), payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/wearables/simulate/{platform}")
def api_simulate_wearable(platform: str):
    try:
        result = simulate_wearable_sync(platform.lower())
        return {
            "success": True,
            "message": f"Simulated live telemetry sync from {platform.title()} successfully.",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Meals Endpoints
@app.post("/api/meals")
async def api_save_meal(request: Request):
    try:
        meal_data = await request.json()
        saved = save_meal(meal_data)
        return {"success": True, "meal": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/meals/{meal_id}")
def api_delete_meal(meal_id: str):
    try:
        deleted = delete_meal(meal_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Meal not found")
        return {"success": True, "deletedId": meal_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pantry Endpoints
@app.post("/api/pantry")
async def api_save_pantry(request: Request):
    try:
        item = await request.json()
        saved = save_pantry_item(item)
        return {"success": True, "pantryItem": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/pantry/{item_id}")
def api_delete_pantry(item_id: str):
    try:
        deleted = delete_pantry_item(item_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Pantry item not found")
        return {"success": True, "deletedId": item_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vitality Logs Endpoints
@app.post("/api/vitality")
async def api_save_vitality(request: Request):
    try:
        log_data = await request.json()
        saved = save_vitality_log(log_data)
        return {"success": True, "vitalityLog": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Preferences Endpoint
@app.put("/api/preferences")
async def api_update_preferences(request: Request):
    try:
        prefs = await request.json()
        updated = update_preferences(prefs)
        return {"success": True, "settings": updated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Ayurvedic & Nutritionist Assistant
@app.post("/api/chat")
async def api_ayurvedic_chat(request: Request):
    try:
        body = await request.json()
        query = body.get("message", "").strip().lower()
        if not query:
            raise HTTPException(status_code=400, detail="Query message is required")

        state = get_state()
        meals = state.get("meals") or []
        pantry = state.get("pantry") or []
        current_env = state.get("currentEnvironment") or {}

        if "aqi" in query or "air" in query or "pollution" in query or "environment" in query:
            aqi_val = current_env.get("aqi", 38)
            reply = (
                f"🌬️ **Local Air Quality & Environmental Vitality (AQI: {aqi_val})**:\n\n"
                f"• **Air Quality Rating**: {'Good / Clean Prana' if aqi_val < 50 else 'Moderate'}\n"
                f"• **PM2.5**: {current_env.get('pm25', 9.2)} µg/m³ • **UV Index**: {current_env.get('uvIndex', 6.2)}\n"
                f"• **Temperature**: {current_env.get('temperatureC', 26.5)}°C • **Humidity**: {current_env.get('humidityPct', 48)}%\n\n"
                f"🌿 **Ayurvedic Seasonal Guidance (*Ritu-Charya*)**:\n"
                f"{current_env.get('actionableGuidance', 'Optimal morning Prana.')}\n\n"
                f"**Herbal Recommendation**: Sip warm water infused with Tulsi (Holy Basil) and a pinch of Black Pepper (*Maricha*) to protect the respiratory channels (*Pranavaha Srotas*)."
            )
        elif "kitchari" in query or "khichdi" in query or "detox" in query:
            reply = (
                "🌿 **Golden Turmeric Moong Kitchari (Ayurvedic Healing Staple)**:\n\n"
                "Kitchari balances all 3 doshas (Vata, Pitta, Kapha) and cleanses metabolic residue (*Ama*).\n\n"
                "• **Ratio**: 1 part Yellow Moong Dal to 1 part Aged Basmati Rice\n"
                "• **Key Spices**: Cumin, Turmeric, Ginger, Fresh Coriander sauteed in pure A2 Ghee\n"
                "• **Benefit**: Light on digestion, repairs gut mucosal lining, and restores cellular Ojas."
            )
        elif "watch" in query or "wearable" in query or "apple" in query or "google" in query:
            reply = (
                "⌚ **Smartwatch & Wearables Sync Hub**:\n\n"
                "Dhanya Lakshmi connects directly with Apple Watch (HealthKit), Google Pixel Watch, Garmin Connect, Fitbit, and Oura Ring.\n"
                "Water, sleep stages, active movement, and recovery are automatically normalized into your vitality logs."
            )
        elif "grain" in query or "millet" in query or "rice" in query:
            reply = (
                "🌾 **Vedic Sacred Grains (Dhanya Varga)**:\n\n"
                "• **Shashtika Shali (Aged Basmati)**: Cooling, easily digestible, builds Ojas.\n"
                "• **Kodo Millet (Kodhrava)**: Low glycemic, astringent, highly recommended for sustained energy and metabolic balance.\n"
                "• **Amaranth (Rajgira)**: Ancient gluten-free grain loaded with protein, iron, and calcium."
            )
        elif "water" in query or "hydration" in query or "tds" in query:
            tds_val = current_env.get("waterTdsPpm", 120)
            reply = (
                f"💧 **Vedic Hydration & Drinking Water Purity (TDS: {tds_val} ppm)**:\n\n"
                "• **Ideal Drinking Water TDS**: 100–150 ppm (preserves essential natural minerals like calcium and magnesium without heavy metals).\n"
                "• **Ushnodaka Principle**: Drink boiled, warm water rather than cold water to maintain steady digestive fire (*Agni*).\n"
                "• **Daily Target**: 2.8 to 3.2 Liters for optimal lymphatic circulation."
            )
        else:
            reply = (
                "🌾 **Dhanya Lakshmi Ayurvedic Environmental & Nutrition Guide**:\n\n"
                f"You currently have **{len(meals)} logged meals**, **{len(pantry)} pantry items**, **5 wearable feeds**, and live **environmental AQI monitoring ({current_env.get('aqi', 38)})**.\n\n"
                "You can ask me questions such as:\n"
                "- *\"What is the current Air Quality (AQI) and how does it impact my diet?\"*\n"
                "- *\"What is the ideal drinking water TDS and hydration level?\"*\n"
                "- *\"How does solar UV index impact Agni and circadian rhythm?\"*\n"
                "- *\"Explain the Sattvic food principles\"*\n"
                "- *\"How do I prepare a tridoshic kitchari?\"*"
            )

        return {"response": reply, "source": "dhanya-lakshmi-ayurveda-engine"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount static files
if (DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

# SPA catch-all fallback
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    target_file = DIST_DIR / full_path
    if full_path and target_file.is_file():
        return FileResponse(target_file)
    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "Dhanya Lakshmi FastAPI backend running on port 3003."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3003, reload=False)
