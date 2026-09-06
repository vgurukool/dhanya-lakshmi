import os
import json
import sqlite3
import random
import string
from pathlib import Path
from datetime import datetime, timedelta

SERVER_DIR = Path(__file__).resolve().parent
ROOT_DIR = SERVER_DIR.parent
DATA_DIR = ROOT_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "dhanya.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    return conn

def init_db():
    conn = get_db()
    with conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS meals (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                mealType TEXT NOT NULL,
                name TEXT NOT NULL,
                foodItems TEXT NOT NULL DEFAULT '[]',
                calories INTEGER NOT NULL DEFAULT 0,
                protein REAL NOT NULL DEFAULT 0,
                carbs REAL NOT NULL DEFAULT 0,
                fat REAL NOT NULL DEFAULT 0,
                fiber REAL NOT NULL DEFAULT 0,
                sattvicQuality TEXT NOT NULL DEFAULT 'Sattvic',
                energyScore INTEGER NOT NULL DEFAULT 8,
                notes TEXT NOT NULL DEFAULT '',
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS pantry (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                sanskritName TEXT NOT NULL DEFAULT '',
                category TEXT NOT NULL,
                quantity REAL NOT NULL DEFAULT 1,
                unit TEXT NOT NULL DEFAULT 'kg',
                organic INTEGER NOT NULL DEFAULT 1,
                inStock INTEGER NOT NULL DEFAULT 1,
                doshaAffinity TEXT NOT NULL DEFAULT 'Tridoshic',
                benefits TEXT NOT NULL DEFAULT '',
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS vitality_logs (
                date TEXT PRIMARY KEY,
                waterLiters REAL NOT NULL DEFAULT 2.5,
                sleepHours REAL NOT NULL DEFAULT 7.5,
                movementMins INTEGER NOT NULL DEFAULT 30,
                fastingHours REAL NOT NULL DEFAULT 12,
                pranaScore INTEGER NOT NULL DEFAULT 85,
                notes TEXT NOT NULL DEFAULT '',
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS recipes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                sanskritName TEXT NOT NULL DEFAULT '',
                category TEXT NOT NULL DEFAULT 'Main Meal',
                calories INTEGER NOT NULL DEFAULT 350,
                prepTimeMins INTEGER NOT NULL DEFAULT 25,
                doshaBalance TEXT NOT NULL DEFAULT 'Vata-Pitta-Kapha Balancing',
                sattvicRating INTEGER NOT NULL DEFAULT 5,
                ingredients TEXT NOT NULL DEFAULT '[]',
                instructions TEXT NOT NULL DEFAULT '[]',
                benefits TEXT NOT NULL DEFAULT '',
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS wearable_syncs (
                platform TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                deviceModel TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'ready',
                lastSyncedAt TEXT,
                syncCount INTEGER NOT NULL DEFAULT 0,
                autoSyncEnabled INTEGER NOT NULL DEFAULT 1,
                metricsCovered TEXT NOT NULL DEFAULT '[]',
                webhookEndpoint TEXT NOT NULL,
                configJson TEXT NOT NULL DEFAULT '{}',
                updatedAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS wearable_raw_events (
                id TEXT PRIMARY KEY,
                platform TEXT NOT NULL,
                date TEXT NOT NULL,
                eventPayload TEXT NOT NULL,
                derivedMetrics TEXT NOT NULL,
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS environmental_logs (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                location TEXT NOT NULL DEFAULT 'Local Bio-Region',
                aqi INTEGER NOT NULL DEFAULT 38,
                pm25 REAL NOT NULL DEFAULT 9.2,
                pm10 REAL NOT NULL DEFAULT 18.5,
                uvIndex REAL NOT NULL DEFAULT 6.2,
                temperatureC REAL NOT NULL DEFAULT 26.5,
                humidityPct INTEGER NOT NULL DEFAULT 48,
                barometricPressureHpa REAL NOT NULL DEFAULT 1013.2,
                waterTdsPpm INTEGER NOT NULL DEFAULT 120,
                waterPh REAL NOT NULL DEFAULT 7.4,
                indoorCo2Ppm INTEGER NOT NULL DEFAULT 580,
                ayurvedicDoshaImpact TEXT NOT NULL DEFAULT 'Balanced Tridoshic Climate',
                actionableGuidance TEXT NOT NULL DEFAULT 'Optimal outdoor morning Prana. Great for outdoor movement.',
                source TEXT NOT NULL DEFAULT 'Sensor Network / Live Weather API',
                createdAt TEXT NOT NULL
            );
        """)
    conn.close()
    seed_initial_data_if_empty()

def seed_initial_data_if_empty():
    conn = get_db()
    cur = conn.cursor()

    # Seed environmental logs
    cur.execute("SELECT count(*) FROM environmental_logs")
    if cur.fetchone()[0] == 0:
        for i in range(7):
            d_str = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            log_id = f"env_{int((datetime.utcnow() - timedelta(days=i)).timestamp()*1000)}"
            aqi = random.choice([32, 38, 42, 35, 45, 28, 36])
            pm25 = round(aqi * 0.24, 1)
            pm10 = round(aqi * 0.48, 1)
            uv = round(5.5 + random.random() * 2.0, 1)
            temp = round(24.0 + random.random() * 4.0, 1)
            humidity = random.choice([44, 48, 52, 46, 50])
            pressure = round(1012.0 + random.random() * 3.0, 1)
            tds = random.choice([115, 120, 128, 118, 122])
            ph = round(7.3 + random.random() * 0.3, 1)
            co2 = random.choice([520, 560, 590, 540, 610])

            dosha_impact = "Balanced Tridoshic Climate"
            guidance = "Optimal morning Prana. High air clarity supports outdoor Pranayama and mindful walking."
            if temp > 28:
                dosha_impact = "Mild Pitta Elevation (Solar Heat)"
                guidance = "Midday solar heat increasing. Hydrate with cooling coriander-cumin water and consume ripe sweet fruits."
            elif humidity > 50:
                dosha_impact = "Mild Kapha Moisture"
                guidance = "Moderate humidity. Add warming black pepper or dry ginger (Shunti) to ignite Agni."

            with conn:
                conn.execute("""
                    INSERT OR REPLACE INTO environmental_logs (
                        id, date, time, location, aqi, pm25, pm10, uvIndex, temperatureC, humidityPct,
                        barometricPressureHpa, waterTdsPpm, waterPh, indoorCo2Ppm, ayurvedicDoshaImpact,
                        actionableGuidance, source, createdAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    log_id, d_str, "08:00 AM", "Local Micro-Climate", aqi, pm25, pm10, uv, temp, humidity,
                    pressure, tds, ph, co2, dosha_impact, guidance, "Local Sensor Network & AQI API",
                    (datetime.utcnow() - timedelta(days=i)).isoformat() + "Z"
                ))

    # Seed 5 major wearable platforms
    cur.execute("SELECT count(*) FROM wearable_syncs")
    if cur.fetchone()[0] == 0:
        initial_wearables = [
            ('apple', 'Apple Watch & Apple Health', 'Apple Watch Ultra 2 / Series 9 (HealthKit)', 'active', (datetime.utcnow() - timedelta(minutes=18)).isoformat() + "Z", 42, 1, json.dumps(['Sleep Stages (Core/Deep/REM)', 'Hydration (Waterllama/Health)', 'Active Workout Mins', 'HRV & Resting HR', 'Mindfulness Sessions']), '/api/wearables/sync/apple', json.dumps({'shortcutName': 'Dhanya Lakshmi Health Sync', 'authMethod': 'Local Webhook / Token', 'sampleRate': 'Daily at 07:30 AM'}), datetime.utcnow().isoformat() + "Z"),
            ('google', 'Google Pixel Watch & Wear OS', 'Pixel Watch 2 / 3 (Google Health Connect)', 'active', (datetime.utcnow() - timedelta(hours=1, minutes=12)).isoformat() + "Z", 28, 1, json.dumps(['Sleep Duration & Rest Score', 'Google Fit Hydration (ml)', 'Heart Points & Active Movement', 'Body Temperature Trends']), '/api/wearables/sync/google', json.dumps({'apiMode': 'Health Connect REST Webhook', 'packageName': 'com.google.android.apps.healthdata'}), datetime.utcnow().isoformat() + "Z"),
            ('garmin', 'Garmin Connect', 'Garmin Forerunner 965 / Fenix 7 / Venu 3', 'ready', (datetime.utcnow() - timedelta(hours=4)).isoformat() + "Z", 15, 1, json.dumps(['Body Battery (Ojas Energy Index)', 'Advanced Sleep Score', 'Intensity Minutes', 'Daily Water Log (ml)']), '/api/wearables/sync/garmin', json.dumps({'garminHealthApi': 'Enabled', 'exportFormat': 'Daily Summary JSON'}), datetime.utcnow().isoformat() + "Z"),
            ('fitbit', 'Fitbit / Google Fitbit', 'Fitbit Sense 2 / Charge 6', 'ready', (datetime.utcnow() - timedelta(hours=8)).isoformat() + "Z", 19, 1, json.dumps(['Daily Sleep Score', 'Active Zone Minutes', 'Water Ingestion Logs', 'Daily Readiness Index']), '/api/wearables/sync/fitbit', json.dumps({'oauthMode': 'Fitbit Web API 1.2', 'scope': 'activity sleep nutrition heartrate'}), datetime.utcnow().isoformat() + "Z"),
            ('oura', 'Oura Ring & Whoop', 'Oura Ring Gen 3 / Whoop 4.0', 'active', (datetime.utcnow() - timedelta(minutes=45)).isoformat() + "Z", 34, 1, json.dumps(['Readiness Score (Ojas Equivalent)', 'Sleep Stages & Latency', 'Nighttime HRV & Temperature', 'Recovery Index']), '/api/wearables/sync/oura', json.dumps({'apiVersion': 'Oura v2 API / Whoop v1 Webhook', 'primaryMetric': 'Readiness & HRV'}), datetime.utcnow().isoformat() + "Z")
        ]
        with conn:
            for item in initial_wearables:
                conn.execute("""
                    INSERT OR REPLACE INTO wearable_syncs (platform, name, deviceModel, status, lastSyncedAt, syncCount, autoSyncEnabled, metricsCovered, webhookEndpoint, configJson, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, item)

    # Seed pantry
    cur.execute("SELECT count(*) FROM pantry")
    if cur.fetchone()[0] == 0:
        initial_pantry = [
            ('p1', 'Aged Basmati Rice', 'Shashtika Shali', 'Whole Grains', 5.0, 'kg', 1, 1, 'Tridoshic (Cooling)', 'Easy to digest, builds Ojas (vitality), enhances digestive fire'),
            ('p2', 'Kodo Millet', 'Kodhrava', 'Whole Grains', 2.0, 'kg', 1, 1, 'Kapha-Pitta Balancing', 'Rich in dietary fiber, supports steady glucose & stamina'),
            ('p3', 'Quinoa', 'Prakriti Dhanya', 'Whole Grains', 2.5, 'kg', 1, 1, 'Tridoshic', 'Complete plant protein, 9 essential amino acids'),
            ('p4', 'Rolled Oats', 'Yava Dhanya', 'Whole Grains', 3.0, 'kg', 1, 1, 'Vata-Pitta Balancing', 'Heart-healthy beta-glucans, sustained morning energy'),
            ('p5', 'Amaranth Flour', 'Rajgira', 'Whole Grains', 1.5, 'kg', 1, 1, 'Tridoshic', 'Ancient gluten-free grain, rich in calcium, iron & magnesium'),
            ('p6', 'Organic Yellow Moong Dal', 'Mudga', 'Pulses & Lentils', 4.0, 'kg', 1, 1, 'Tridoshic (Lightest Dal)', 'Clean detoxifying protein, optimal for daily Agni support'),
            ('p7', 'Whole Green Moong Beans', 'Harita Mudga', 'Pulses & Lentils', 3.0, 'kg', 1, 1, 'Tridoshic', 'Perfect for living sprouts, high in vitamin C & enzymes'),
            ('p8', 'Toor Dal (Pigeon Pea)', 'Adhaki', 'Pulses & Lentils', 2.0, 'kg', 1, 1, 'Pitta-Kapha Balancing', 'Rich hearty protein, traditional basis for Sambhar & Rasam'),
            ('p9', 'A2 Desi Cow Ghee', 'Ghrita', 'Healthy Fats & Oils', 1.5, 'liters', 1, 1, 'Tridoshic (Supreme Rasayana)', 'Carries nutrients deep into cells, lubricates joints, ignites Agni'),
            ('p10', 'Cold-Pressed Virgin Sesame Oil', 'Tila Taila', 'Healthy Fats & Oils', 1.0, 'liters', 1, 1, 'Vata Pacifying', 'Warm nourishing oil, strengthens bones & calming nervous system'),
            ('p11', 'Wild Forest Turmeric Powder', 'Haridra', 'Spices & Herbs', 500, 'grams', 1, 1, 'Tridoshic', 'Potent anti-inflammatory curcumin, blood purifier, cellular tonic'),
            ('p12', 'Ceylon Cinnamon & Cardamom', 'Elaichi & Twak', 'Spices & Herbs', 250, 'grams', 1, 1, 'Vata-Kapha Balancing', 'Warming digestive stimulants, balances blood sugar & clears mucus'),
            ('p13', 'Whole Cumin Seeds', 'Jeeraka', 'Spices & Herbs', 500, 'grams', 1, 1, 'Tridoshic', 'Classic carminative, enhances nutrient assimilation'),
            ('p14', 'Himalayan Pink Salt', 'Saindhava Lavana', 'Spices & Herbs', 1.0, 'kg', 1, 1, 'Tridoshic', 'Mildest mineral salt, does not overheat pitta'),
            ('p15', 'California Almonds (Mamra)', 'Vatada', 'Nuts & Seeds', 1.0, 'kg', 1, 1, 'Vata-Pitta Pacifying', 'Soaked overnight to build Ojas & brain power'),
            ('p16', 'Fresh Medjool Dates', 'Kharjura', 'Superfoods', 1.0, 'kg', 1, 1, 'Vata-Pitta Building', 'Natural sweet energy, rich in potassium & iron'),
            ('p17', 'Organic Moringa Leaf Powder', 'Shigru', 'Superfoods', 300, 'grams', 1, 1, 'Kapha-Vata Balancing', 'Super-dense micronutrients, antioxidants, and chlorophyll')
        ]
        with conn:
            for item in initial_pantry:
                conn.execute("""
                    INSERT INTO pantry (id, name, sanskritName, category, quantity, unit, organic, inStock, doshaAffinity, benefits, createdAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (*item, datetime.utcnow().isoformat() + "Z"))

    # Seed recipes
    cur.execute("SELECT count(*) FROM recipes")
    if cur.fetchone()[0] == 0:
        initial_recipes = [
            ('rec_1', 'Golden Turmeric Moong Kitchari', 'Swarna Mudga Kṛśarā', 'Healing Main', 380, 30, 'Tridoshic (Supreme Balancing)', 5, json.dumps(['1/2 cup Yellow Moong Dal', '1/2 cup Basmati Rice', '1 tbsp A2 Ghee', '1 tsp Turmeric', '1 tsp Cumin Seeds', '1 inch Fresh Grated Ginger', '4 cups Water', 'Fresh Cilantro']), json.dumps(['Rinse moong dal and rice together until water runs clear.', 'Heat A2 ghee in a heavy pot; add cumin seeds and freshly grated ginger until aromatic.', 'Add turmeric powder and a pinch of black pepper, then stir in washed grains.', 'Pour 4 cups of hot water, bring to gentle boil, then simmer covered for 25 minutes.', 'Garnish with fresh cilantro and a squeeze of lime before serving warm.']), 'Ultimate gut-restorative meal. Ignites Agni without causing heat, flushes metabolic toxins (Ama), and calms all three doshas.'),
            ('rec_2', 'Spiced Ayurvedic Ojas Golden Milk', 'Siddha Dugdha', 'Nourishing Elixir', 190, 10, 'Vata & Pitta Pacifying', 5, json.dumps(['1.5 cups A2 Warm Milk or Almond Milk', '1/2 tsp Turmeric', '1/4 tsp Green Cardamom', 'Pinch Nutmeg', '1 tsp A2 Ghee', '1 tsp Raw Honey (added off heat)']), json.dumps(['Gently warm milk in a small saucepan over medium-low heat.', 'Whisk in turmeric, cardamom, nutmeg, and ghee.', 'Bring to gentle steam for 3-4 minutes (do not boil hard).', 'Pour into a mug, let cool slightly, then stir in raw honey.']), 'Deep restorative sleep elixir. Builds subtle immunity (Ojas) and rejuvenates the nervous system.'),
            ('rec_3', 'Tri-Dosha Spiced Kodo Millet & Veggie Pulao', 'Kodhrava Shaka Pulao', 'Energizing Lunch', 410, 25, 'Kapha & Pitta Balancing', 5, json.dumps(['1 cup Kodo Millet', '1 cup Diced Carrots & French Beans', '1/2 cup Green Peas', '1 tbsp Ghee or Sesame Oil', '1 Bay Leaf', '1 tsp Cumin', '1/2 tsp Turmeric', '2.5 cups Water']), json.dumps(['Soak kodo millet for 30 minutes, then drain.', 'Sauté whole spices in ghee, add chopped fresh vegetables and sauté for 3 minutes.', 'Add soaked millet, salt, turmeric, and water.', 'Cook on low flame until water is absorbed and grains are fluffy.']), 'High-fiber slow-release energy that fuels steady metabolic vigor throughout the afternoon.')
        ]
        with conn:
            for item in initial_recipes:
                conn.execute("""
                    INSERT INTO recipes (id, name, sanskritName, category, calories, prepTimeMins, doshaBalance, sattvicRating, ingredients, instructions, benefits, createdAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (*item, datetime.utcnow().isoformat() + "Z"))

    # Seed meals
    cur.execute("SELECT count(*) FROM meals")
    if cur.fetchone()[0] == 0:
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        yesterday_str = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
        sample_meals = [
            ('m1', today_str, 'Breakfast', 'Warm Spiced Oatmeal with Soaked Almonds & Dates', json.dumps(['Rolled Oats', 'A2 Milk', 'Soaked Almonds', 'Medjool Dates', 'Cardamom']), 340, 12, 54, 8, 7, 'Sattvic', 9, 'Felt sustained gentle energy all morning. Easy on digestion.', datetime.utcnow().isoformat() + "Z"),
            ('m2', today_str, 'Lunch', 'Golden Moong Dal Kitchari with Steamed Zucchini', json.dumps(['Yellow Moong Dal', 'Basmati Rice', 'Ghee', 'Turmeric', 'Zucchini', 'Cumin']), 480, 18, 72, 12, 9, 'Sattvic', 10, 'Peak Agni lunch; perfect satiation without heaviness.', datetime.utcnow().isoformat() + "Z"),
            ('m3', today_str, 'Dinner', 'Light Vegetable Soup with Kodo Millet Roti', json.dumps(['Kodo Millet Flour', 'Bottle Gourd', 'Spinach', 'Ginger', 'Ghee']), 360, 14, 52, 9, 8, 'Sattvic', 9, 'Finished before 7:30 PM for effortless overnight fasting.', datetime.utcnow().isoformat() + "Z"),
            ('m4', yesterday_str, 'Breakfast', 'Fresh Papaya & Soaked Chia Seed Bowl', json.dumps(['Ripe Papaya', 'Chia Seeds', 'Coconut Water', 'Mint']), 260, 6, 44, 5, 8, 'Sattvic', 9, 'Very light and refreshing.', (datetime.utcnow() - timedelta(days=1)).isoformat() + "Z"),
            ('m5', yesterday_str, 'Lunch', 'Organic Tofu & Quinoa Power Bowl with Steamed Greens', json.dumps(['Quinoa', 'Tofu', 'Broccoli', 'Sesame Oil', 'Ginger']), 520, 26, 60, 16, 11, 'Sattvic', 9, 'High plant protein, excellent post-workout nourishment.', (datetime.utcnow() - timedelta(days=1)).isoformat() + "Z")
        ]
        with conn:
            for item in sample_meals:
                conn.execute("""
                    INSERT INTO meals (id, date, mealType, name, foodItems, calories, protein, carbs, fat, fiber, sattvicQuality, energyScore, notes, createdAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, item)

    # Seed vitality logs
    cur.execute("SELECT count(*) FROM vitality_logs")
    if cur.fetchone()[0] == 0:
        for i in range(7):
            d_str = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            water = round(2.6 + random.random() * 0.6, 1)
            sleep = round(7.0 + random.random() * 1.2, 1)
            movement = random.choice([30, 45, 60, 40])
            fasting = random.choice([12, 13, 14, 12.5])
            prana = random.choice([84, 88, 92, 90, 86])
            with conn:
                conn.execute("""
                    INSERT OR REPLACE INTO vitality_logs (date, waterLiters, sleepHours, movementMins, fastingHours, pranaScore, notes, createdAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (d_str, water, sleep, movement, fasting, prana, 'Consistently energized, clear mind and light digestion.', datetime.utcnow().isoformat() + "Z"))

    # Seed settings
    cur.execute("SELECT count(*) FROM settings")
    if cur.fetchone()[0] == 0:
        defaults = {
            'dailyCalorieTarget': 2000,
            'dailyWaterTarget': 3.0,
            'dailyProteinTarget': 65,
            'dietaryPreference': 'Sattvic Vegetarian',
            'primaryDosha': 'Vata-Pitta Balance',
            'fastingGoalHours': 13,
            'mindfulEatingEnabled': True
        }
        with conn:
            for k, v in defaults.items():
                conn.execute("INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, ?)",
                             (k, json.dumps(v), datetime.utcnow().isoformat() + "Z"))

    conn.close()

def get_state():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM meals ORDER BY date DESC, createdAt DESC LIMIT 500")
    meal_rows = [dict(r) for r in cur.fetchall()]
    parsed_meals = []
    for m in meal_rows:
        try:
            items = json.loads(m.get("foodItems") or "[]")
        except Exception:
            items = []
        parsed_meals.append({**m, "foodItems": items})

    cur.execute("SELECT * FROM pantry ORDER BY category ASC, name ASC")
    pantry_rows = [dict(r) for r in cur.fetchall()]
    parsed_pantry = [{**p, "organic": bool(p.get("organic")), "inStock": bool(p.get("inStock"))} for p in pantry_rows]

    cur.execute("SELECT * FROM vitality_logs ORDER BY date DESC LIMIT 30")
    vitality_rows = [dict(r) for r in cur.fetchall()]

    cur.execute("SELECT * FROM recipes ORDER BY category ASC, name ASC")
    recipe_rows = [dict(r) for r in cur.fetchall()]
    parsed_recipes = []
    for r in recipe_rows:
        try:
            ing = json.loads(r.get("ingredients") or "[]")
        except Exception:
            ing = []
        try:
            ins = json.loads(r.get("instructions") or "[]")
        except Exception:
            ins = []
        parsed_recipes.append({**r, "ingredients": ing, "instructions": ins})

    cur.execute("SELECT * FROM settings")
    settings_rows = cur.fetchall()
    settings = {}
    for r in settings_rows:
        try:
            settings[r["key"]] = json.loads(r["value"])
        except Exception:
            settings[r["key"]] = r["value"]

    # Wearables status
    cur.execute("SELECT * FROM wearable_syncs ORDER BY platform ASC")
    wearables_rows = [dict(r) for r in cur.fetchall()]
    parsed_wearables = []
    for w in wearables_rows:
        try:
            metrics = json.loads(w.get("metricsCovered") or "[]")
        except Exception:
            metrics = []
        try:
            cfg = json.loads(w.get("configJson") or "{}")
        except Exception:
            cfg = {}
        parsed_wearables.append({
            **w,
            "metricsCovered": metrics,
            "configJson": cfg,
            "autoSyncEnabled": bool(w.get("autoSyncEnabled"))
        })

    # Recent raw events
    cur.execute("SELECT * FROM wearable_raw_events ORDER BY createdAt DESC LIMIT 10")
    raw_events = []
    for r in cur.fetchall():
        rd = dict(r)
        try:
            rd["derivedMetrics"] = json.loads(rd.get("derivedMetrics") or "{}")
        except Exception:
            pass
        raw_events.append(rd)

    # Environmental Logs
    cur.execute("SELECT * FROM environmental_logs ORDER BY date DESC, createdAt DESC LIMIT 14")
    env_rows = [dict(r) for r in cur.fetchall()]

    conn.close()

    return {
        "meals": parsed_meals,
        "pantry": parsed_pantry,
        "vitalityLogs": vitality_rows,
        "recipes": parsed_recipes,
        "settings": settings,
        "wearables": parsed_wearables,
        "recentWearableEvents": raw_events,
        "environmentalLogs": env_rows,
        "currentEnvironment": env_rows[0] if env_rows else None
    }

def save_environmental_log(env_data):
    conn = get_db()
    id_val = env_data.get("id") or f"env_{int(datetime.now().timestamp()*1000)}"
    date = str(env_data.get("date") or datetime.utcnow().strftime("%Y-%m-%d"))
    time_val = str(env_data.get("time") or datetime.utcnow().strftime("%I:%M %p"))
    location = str(env_data.get("location") or "Local Bio-Region").strip()
    aqi = int(env_data.get("aqi") or 38)
    pm25 = float(env_data.get("pm25") or 9.2)
    pm10 = float(env_data.get("pm10") or 18.5)
    uv = float(env_data.get("uvIndex") or 6.2)
    temp = float(env_data.get("temperatureC") or 26.5)
    humidity = int(env_data.get("humidityPct") or 48)
    pressure = float(env_data.get("barometricPressureHpa") or 1013.2)
    tds = int(env_data.get("waterTdsPpm") or 120)
    ph = float(env_data.get("waterPh") or 7.4)
    co2 = int(env_data.get("indoorCo2Ppm") or 580)
    dosha = str(env_data.get("ayurvedicDoshaImpact") or "Balanced Tridoshic Climate").strip()
    guidance = str(env_data.get("actionableGuidance") or "Optimal outdoor morning Prana.").strip()
    source = str(env_data.get("source") or "Live Sensor Network / Weather API").strip()
    created_at = datetime.utcnow().isoformat() + "Z"

    with conn:
        conn.execute("""
            INSERT INTO environmental_logs (
                id, date, time, location, aqi, pm25, pm10, uvIndex, temperatureC, humidityPct,
                barometricPressureHpa, waterTdsPpm, waterPh, indoorCo2Ppm, ayurvedicDoshaImpact,
                actionableGuidance, source, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                date = excluded.date,
                time = excluded.time,
                location = excluded.location,
                aqi = excluded.aqi,
                pm25 = excluded.pm25,
                pm10 = excluded.pm10,
                uvIndex = excluded.uvIndex,
                temperatureC = excluded.temperatureC,
                humidityPct = excluded.humidityPct,
                barometricPressureHpa = excluded.barometricPressureHpa,
                waterTdsPpm = excluded.waterTdsPpm,
                waterPh = excluded.waterPh,
                indoorCo2Ppm = excluded.indoorCo2Ppm,
                ayurvedicDoshaImpact = excluded.ayurvedicDoshaImpact,
                actionableGuidance = excluded.actionableGuidance,
                source = excluded.source
        """, (
            id_val, date, time_val, location, aqi, pm25, pm10, uv, temp, humidity,
            pressure, tds, ph, co2, dosha, guidance, source, created_at
        ))

    cur = conn.cursor()
    cur.execute("SELECT * FROM environmental_logs WHERE id = ?", (id_val,))
    row = dict(cur.fetchone())
    conn.close()
    return row

def fetch_or_simulate_environment():
    now = datetime.utcnow()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%I:%M %p")

    aqi = random.choice([28, 34, 39, 44, 31, 36])
    pm25 = round(aqi * 0.22, 1)
    pm10 = round(aqi * 0.45, 1)
    uv = round(5.8 + random.random() * 2.2, 1)
    temp = round(25.0 + random.random() * 3.5, 1)
    humidity = random.choice([42, 46, 50, 48, 52])
    pressure = round(1013.0 + random.random() * 2.0, 1)
    tds = random.choice([112, 118, 124, 120])
    ph = round(7.35 + random.random() * 0.2, 2)
    co2 = random.choice([510, 545, 580, 530])

    dosha = "Balanced Tridoshic Vitality"
    guidance = "Clean atmospheric Prana (AQI under 50). Ideal conditions for outdoor breathwork and solar recharge."
    if aqi > 50:
        dosha = "Respiratory Pitta/Vata Sensitivity"
        guidance = "Moderate atmospheric particulate matter. Brew soothing Tulsi-Licorice lung tea and practice indoor Pranayama."
    elif temp > 28:
        dosha = "Elevated Pitta Heat"
        guidance = "Solar radiation high. Favor cooling coconut water, soaked fennel water, and sweet ripe fruits."

    log_payload = {
        "id": f"env_{int(now.timestamp()*1000)}",
        "date": date_str,
        "time": time_str,
        "location": "Local Micro-Climate Station",
        "aqi": aqi,
        "pm25": pm25,
        "pm10": pm10,
        "uvIndex": uv,
        "temperatureC": temp,
        "humidityPct": humidity,
        "barometricPressureHpa": pressure,
        "waterTdsPpm": tds,
        "waterPh": ph,
        "indoorCo2Ppm": co2,
        "ayurvedicDoshaImpact": dosha,
        "actionableGuidance": guidance,
        "source": "EPA AirNow / OpenMeteo Sensor Stream"
    }

    return save_environmental_log(log_payload)

def process_wearable_payload(platform, payload):
    today_str = payload.get("date") or datetime.utcnow().strftime("%Y-%m-%d")

    water = 2.8
    sleep = 7.5
    movement = 35
    fasting = 13.0
    prana = 88
    notes_list = []

    if platform == "apple":
        water = float(payload.get("water_liters") or (float(payload.get("water_ml") or 2800) / 1000.0))
        sleep = float(payload.get("sleep_hours") or payload.get("in_bed_hours") or 7.8)
        movement = int(payload.get("active_minutes") or payload.get("exercise_mins") or 45)
        fasting = float(payload.get("fasting_hours") or 13.5)
        hrv = float(payload.get("hrv_ms") or 58)
        prana = min(100, max(50, int(60 + (hrv * 0.4) + (sleep * 2))))
        notes_list.append(f"Apple Watch synced (HRV: {hrv:.0f}ms, Active Mins: {movement}m)")

    elif platform == "google":
        water = float(payload.get("hydration_liters") or (float(payload.get("hydration_ml") or 2900) / 1000.0))
        sleep = float(payload.get("sleep_duration_hours") or 7.6)
        movement = int(payload.get("heart_points") or payload.get("active_mins") or 40)
        fasting = float(payload.get("fasting_hours") or 12.5)
        prana = int(payload.get("rest_score") or 87)
        notes_list.append(f"Pixel Watch synced (Heart Points: {movement}, Sleep: {sleep:.1f}h)")

    elif platform == "garmin":
        water = float(payload.get("water_liters") or (float(payload.get("water_ml") or 3100) / 1000.0))
        sleep = float(payload.get("sleep_hours") or (float(payload.get("sleep_seconds") or 27000) / 3600.0))
        movement = int(payload.get("intensity_minutes") or payload.get("active_mins") or 50)
        body_battery = int(payload.get("body_battery_max") or payload.get("body_battery") or 92)
        prana = body_battery
        fasting = float(payload.get("fasting_hours") or 13.0)
        notes_list.append(f"Garmin Body Battery synced ({body_battery}/100 Ojas Energy)")

    elif platform == "fitbit":
        water = float(payload.get("water_liters") or (float(payload.get("water_fl_oz") or 95) * 0.02957))
        sleep = float(payload.get("sleep_hours") or (float(payload.get("sleep_minutes") or 460) / 60.0))
        movement = int(payload.get("active_zone_minutes") or 38)
        prana = int(payload.get("readiness_score") or payload.get("sleep_score") or 86)
        fasting = float(payload.get("fasting_hours") or 12.0)
        notes_list.append(f"Fitbit synced (Readiness: {prana}/100, Active Zone: {movement}m)")

    elif platform == "oura":
        water = float(payload.get("water_liters") or 2.9)
        sleep = float(payload.get("total_sleep_hours") or (float(payload.get("total_sleep_seconds") or 28500) / 3600.0))
        movement = int(payload.get("activity_score") or 85) // 2
        readiness = int(payload.get("readiness_score") or payload.get("recovery_score") or 94)
        prana = readiness
        fasting = float(payload.get("fasting_hours") or 14.0)
        notes_list.append(f"Oura Ring Readiness synced ({readiness}/100 Ojas Vitality)")

    derived = {
        "waterLiters": round(water, 2),
        "sleepHours": round(sleep, 1),
        "movementMins": movement,
        "fastingHours": round(fasting, 1),
        "pranaScore": prana,
        "notes": " • ".join(notes_list)
    }

    conn = get_db()
    now_iso = datetime.utcnow().isoformat() + "Z"
    with conn:
        conn.execute("""
            INSERT INTO vitality_logs (date, waterLiters, sleepHours, movementMins, fastingHours, pranaScore, notes, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
                waterLiters = excluded.waterLiters,
                sleepHours = excluded.sleepHours,
                movementMins = excluded.movementMins,
                fastingHours = excluded.fastingHours,
                pranaScore = excluded.pranaScore,
                notes = excluded.notes
        """, (today_str, derived["waterLiters"], derived["sleepHours"], derived["movementMins"], derived["fastingHours"], derived["pranaScore"], derived["notes"], now_iso))

        conn.execute("""
            UPDATE wearable_syncs
            SET lastSyncedAt = ?, syncCount = syncCount + 1, status = 'active', updatedAt = ?
            WHERE platform = ?
        """, (now_iso, now_iso, platform))

        event_id = f"evt_{int(datetime.now().timestamp()*1000)}"
        conn.execute("""
            INSERT INTO wearable_raw_events (id, platform, date, eventPayload, derivedMetrics, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (event_id, platform, today_str, json.dumps(payload), json.dumps(derived), now_iso))

    conn.close()
    return {"success": True, "date": today_str, "derivedMetrics": derived, "platform": platform}

def simulate_wearable_sync(platform):
    now = datetime.utcnow()
    date_str = now.strftime("%Y-%m-%d")

    payloads = {
        "apple": {
            "date": date_str,
            "device": "Apple Watch Ultra 2",
            "in_bed_hours": round(7.5 + random.random() * 0.8, 1),
            "water_liters": round(2.8 + random.random() * 0.5, 1),
            "active_minutes": random.choice([45, 55, 60, 40]),
            "fasting_hours": 13.5,
            "hrv_ms": random.choice([55, 62, 70, 68]),
            "mindful_mins": 15
        },
        "google": {
            "date": date_str,
            "device": "Google Pixel Watch 3",
            "sleep_duration_hours": round(7.4 + random.random() * 0.7, 1),
            "hydration_ml": random.choice([2900, 3100, 3200, 2850]),
            "heart_points": random.choice([42, 50, 48]),
            "fasting_hours": 13.0,
            "rest_score": random.choice([88, 91, 89, 93])
        },
        "garmin": {
            "date": date_str,
            "device": "Garmin Forerunner 965",
            "sleep_seconds": int((7.6 + random.random() * 0.6) * 3600),
            "water_ml": random.choice([3000, 3200, 3300]),
            "intensity_minutes": random.choice([45, 60, 50]),
            "body_battery_max": random.choice([92, 95, 90, 88]),
            "fasting_hours": 13.5
        },
        "fitbit": {
            "date": date_str,
            "device": "Fitbit Sense 2",
            "sleep_minutes": int((7.7 + random.random() * 0.5) * 60),
            "water_fl_oz": random.choice([95, 100, 105]),
            "active_zone_minutes": random.choice([40, 52, 48]),
            "readiness_score": random.choice([89, 92, 87]),
            "fasting_hours": 12.5
        },
        "oura": {
            "date": date_str,
            "device": "Oura Ring Gen 3 (Horizon)",
            "total_sleep_seconds": int((7.8 + random.random() * 0.6) * 3600),
            "water_liters": round(3.0 + random.random() * 0.4, 1),
            "readiness_score": random.choice([94, 96, 91, 95]),
            "hrv_balance": "Optimal",
            "fasting_hours": 14.0
        }
    }

    sample_payload = payloads.get(platform, payloads["apple"])
    return process_wearable_payload(platform, sample_payload)

def save_meal(meal_data):
    conn = get_db()
    id_val = meal_data.get("id") or f"meal_{int(datetime.now().timestamp()*1000)}_{''.join(random.choices(string.ascii_lowercase + string.digits, k=6))}"
    date = str(meal_data.get("date") or datetime.utcnow().strftime("%Y-%m-%d"))
    mtype = str(meal_data.get("mealType") or "Lunch").strip()
    name = str(meal_data.get("name") or "Wholesome Nourishment").strip()
    items = meal_data.get("foodItems") if isinstance(meal_data.get("foodItems"), list) else [str(meal_data.get("foodItems") or '')]
    calories = int(meal_data.get("calories") or 0)
    protein = float(meal_data.get("protein") or 0)
    carbs = float(meal_data.get("carbs") or 0)
    fat = float(meal_data.get("fat") or 0)
    fiber = float(meal_data.get("fiber") or 0)
    sattvic = str(meal_data.get("sattvicQuality") or "Sattvic").strip()
    energy = int(meal_data.get("energyScore") or 8)
    notes = str(meal_data.get("notes") or "").strip()
    created_at = meal_data.get("createdAt") or datetime.utcnow().isoformat() + "Z"

    with conn:
        conn.execute("""
            INSERT INTO meals (id, date, mealType, name, foodItems, calories, protein, carbs, fat, fiber, sattvicQuality, energyScore, notes, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                date = excluded.date,
                mealType = excluded.mealType,
                name = excluded.name,
                foodItems = excluded.foodItems,
                calories = excluded.calories,
                protein = excluded.protein,
                carbs = excluded.carbs,
                fat = excluded.fat,
                fiber = excluded.fiber,
                sattvicQuality = excluded.sattvicQuality,
                energyScore = excluded.energyScore,
                notes = excluded.notes
        """, (id_val, date, mtype, name, json.dumps(items), calories, protein, carbs, fat, fiber, sattvic, energy, notes, created_at))

    cur = conn.cursor()
    cur.execute("SELECT * FROM meals WHERE id = ?", (id_val,))
    row = dict(cur.fetchone())
    conn.close()

    try:
        f_items = json.loads(row.get("foodItems") or "[]")
    except Exception:
        f_items = []
    return {**row, "foodItems": f_items}

def delete_meal(meal_id):
    conn = get_db()
    with conn:
        res = conn.execute("DELETE FROM meals WHERE id = ?", (meal_id,))
        changes = res.rowcount
    conn.close()
    return changes > 0

def save_pantry_item(item):
    conn = get_db()
    id_val = item.get("id") or f"p_{int(datetime.now().timestamp()*1000)}"
    name = str(item.get("name") or "Pantry Item").strip()
    sanskrit = str(item.get("sanskritName") or "").strip()
    category = str(item.get("category") or "Whole Grains").strip()
    quantity = float(item.get("quantity") or 1.0)
    unit = str(item.get("unit") or "kg").strip()
    organic = 1 if item.get("organic") else 0
    in_stock = 1 if item.get("inStock", True) else 0
    dosha = str(item.get("doshaAffinity") or "Tridoshic").strip()
    benefits = str(item.get("benefits") or "").strip()
    created_at = item.get("createdAt") or datetime.utcnow().isoformat() + "Z"

    with conn:
        conn.execute("""
            INSERT INTO pantry (id, name, sanskritName, category, quantity, unit, organic, inStock, doshaAffinity, benefits, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                sanskritName = excluded.sanskritName,
                category = excluded.category,
                quantity = excluded.quantity,
                unit = excluded.unit,
                organic = excluded.organic,
                inStock = excluded.inStock,
                doshaAffinity = excluded.doshaAffinity,
                benefits = excluded.benefits
        """, (id_val, name, sanskrit, category, quantity, unit, organic, in_stock, dosha, benefits, created_at))

    cur = conn.cursor()
    cur.execute("SELECT * FROM pantry WHERE id = ?", (id_val,))
    row = dict(cur.fetchone())
    conn.close()
    return {**row, "organic": bool(row.get("organic")), "inStock": bool(row.get("inStock"))}

def delete_pantry_item(item_id):
    conn = get_db()
    with conn:
        res = conn.execute("DELETE FROM pantry WHERE id = ?", (item_id,))
        changes = res.rowcount
    conn.close()
    return changes > 0

def save_vitality_log(log_data):
    conn = get_db()
    date = str(log_data.get("date") or datetime.utcnow().strftime("%Y-%m-%d"))
    water = float(log_data.get("waterLiters") or 2.5)
    sleep = float(log_data.get("sleepHours") or 7.5)
    movement = int(log_data.get("movementMins") or 30)
    fasting = float(log_data.get("fastingHours") or 12.0)
    prana = int(log_data.get("pranaScore") or 85)
    notes = str(log_data.get("notes") or "").strip()
    created_at = datetime.utcnow().isoformat() + "Z"

    with conn:
        conn.execute("""
            INSERT INTO vitality_logs (date, waterLiters, sleepHours, movementMins, fastingHours, pranaScore, notes, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
                waterLiters = excluded.waterLiters,
                sleepHours = excluded.sleepHours,
                movementMins = excluded.movementMins,
                fastingHours = excluded.fastingHours,
                pranaScore = excluded.pranaScore,
                notes = excluded.notes
        """, (date, water, sleep, movement, fasting, prana, notes, created_at))

    cur = conn.cursor()
    cur.execute("SELECT * FROM vitality_logs WHERE date = ?", (date,))
    row = dict(cur.fetchone())
    conn.close()
    return row

def update_preferences(prefs):
    conn = get_db()
    now_iso = datetime.utcnow().isoformat() + "Z"
    with conn:
        for k, v in prefs.items():
            if v is not None:
                conn.execute("INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, ?)",
                             (k, json.dumps(v), now_iso))
    conn.close()
    return get_state()["settings"]
