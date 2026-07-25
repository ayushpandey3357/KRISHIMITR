import io
import json
import os
from typing import Optional
from urllib.request import Request, urlopen

import joblib
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

try:
    from tensorflow.keras import layers, models
    TF_AVAILABLE = True
except ImportError:
    layers = models = None
    TF_AVAILABLE = False

from backend.recommendation_data import CROP_CATALOG, format_recommendation, SEASONS, SOIL_TYPES
from backend.weather_data import WEATHER_COORDINATES, WEATHER_REGIONS, WEATHER_SEASONS

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_disease_model.h5")
MARKET_MODEL_PATH = os.path.join(BASE_DIR, "models", "market_model.joblib")
RAINFALL_MODEL_PATH = os.path.join(BASE_DIR, "models", "rainfall_model.joblib")

app = FastAPI(title="KrishiMitra AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("DEBUG") else ["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_disease_model(input_shape=(224, 224, 3), num_classes=4):
    if not TF_AVAILABLE:
        raise ImportError("TensorFlow is not available for disease model creation.")
    model = models.Sequential(
        [
            layers.Input(shape=input_shape),
            layers.Conv2D(16, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),
            layers.Flatten(),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.4),
            layers.Dense(num_classes, activation="softmax"),
        ]
    )
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def load_disease_model():
    if not TF_AVAILABLE:
        return None
    if not os.path.exists(MODEL_PATH):
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        model = build_disease_model()
        model.save(MODEL_PATH)
        return model
    return models.load_model(MODEL_PATH)


def load_market_model():
    if not os.path.exists(MARKET_MODEL_PATH):
        raise FileNotFoundError(
            f"Market model not found at {MARKET_MODEL_PATH}. Run backend/train_market_model.py to generate it."
        )
    return joblib.load(MARKET_MODEL_PATH)


def load_rainfall_model():
    if not os.path.exists(RAINFALL_MODEL_PATH):
        raise FileNotFoundError(
            f"Rainfall model not found at {RAINFALL_MODEL_PATH}. Run backend/train_rainfall_model.py to generate it."
        )
    return joblib.load(RAINFALL_MODEL_PATH)


def preprocess_image(file_bytes: bytes, target_size=(224, 224)):
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    image = image.resize(target_size)
    array = np.array(image, dtype=np.float32) / 255.0
    return np.expand_dims(array, axis=0)


MODEL = load_disease_model()

try:
    MARKET_MODEL = load_market_model()
except FileNotFoundError:
    MARKET_MODEL = None

try:
    RAINFALL_MODEL = load_rainfall_model()
except FileNotFoundError:
    RAINFALL_MODEL = None


def encode_rainfall_features(payload: dict):
    region_index = WEATHER_REGIONS.index(payload.get("region")) if payload.get("region") in WEATHER_REGIONS else 0
    season_index = WEATHER_SEASONS.index(payload.get("season")) if payload.get("season") in WEATHER_SEASONS else 0
    temp = float(payload.get("temp", 25))
    humidity = float(payload.get("humidity", 50))
    pressure = float(payload.get("pressure", 1010))
    wind = float(payload.get("wind", 10))
    return [region_index, season_index, temp, humidity, pressure, wind]


def get_disease_classes():
    return ["yellow_rust", "rice_blast", "tomato_blight", "healthy_leaf"]


def disease_metadata():
    return {
        "yellow_rust": {
            "crop": {"hi": "गेहूँ (Wheat)", "en": "Wheat"},
            "name": {"hi": "पीला रतुआ (Yellow Rust / Stripe Rust)", "en": "Yellow Rust (Stripe Rust)"},
            "severity": "High / उच्च ⚠️",
            "symptoms": {
                "hi": [
                    "पत्तियों पर पीले रंग की धारियां और पाउडर जैसी संरचना।",
                    "पत्तियां समय से पहले पीली पड़कर सूखने लगती हैं।",
                    "दाने छोटे और कमजोर रह जाते हैं।",
                ],
                "en": [
                    "Yellow stripe-like pustules forming lines on upper leaf surface.",
                    "Leaves turn yellow prematurely and dry up.",
                    "Grain filling is severely impaired.",
                ],
            },
            "organicRemedy": {
                "hi": "खट्टी छाछ 5% घोल या नीम तेल 1500 ppm के साथ छिड़काव करें।",
                "en": "Spray 5% sour buttermilk or 1500 ppm Neem Oil.",
            },
            "chemicalRemedy": {
                "hi": "प्रोपीकोनाज़ोल 25% EC 1 मिली/लीटर पानी से छिड़काव करें।",
                "en": "Foliar spray of Propiconazole 25% EC @ 1 ml/litre of water.",
            },
            "prevention": {
                "hi": "प्रतिरोधी किस्मों की बुवाई करें और अधिक नाइट्रोजन से बचें।",
                "en": "Plant resistant varieties and avoid over-fertilization.",
            },
        },
        "rice_blast": {
            "crop": {"hi": "धान / चावल (Paddy)", "en": "Paddy (Rice)"},
            "name": {"hi": "धान का झोंका रोग (Rice Blast Disease)", "en": "Rice Blast Disease"},
            "severity": "Critical / अति गंभीर 🚨",
            "symptoms": {
                "hi": [
                    "पत्तियों पर आँख या नाव के आकार के भूरे- सफेद धब्बे।",
                    "बालियों के गले का काला पड़ना।",
                    "फसल का भूसा बन जाना।",
                ],
                "en": [
                    "Spindle-shaped or eye-shaped lesions with grey center on leaves.",
                    "Neck region turns blackish brown.",
                    "Severe grain discoloration and empty panicles.",
                ],
            },
            "organicRemedy": {
                "hi": "ट्राइकोडर्मा विरिडी 5 ग्राम/लीटर पानी में मिलाकर शाम को छिड़कें।",
                "en": "Spray Trichoderma viride @ 5g/litre during evening hours.",
            },
            "chemicalRemedy": {
                "hi": "ट्राइसाइक्लाज़ोल 75% WP 0.6 ग्राम/लीटर पानी में छिड़कें।",
                "en": "Spray Tricyclazole 75% WP @ 0.6g/litre of water.",
            },
            "prevention": {
                "hi": "बीज को कारबेंडाजिम से उपचारित करें तथा पानी का स्तर नियंत्रित रखें।",
                "en": "Treat seeds with Carbendazim and maintain optimal water levels.",
            },
        },
        "tomato_blight": {
            "crop": {"hi": "टमाटर (Tomato)", "en": "Tomato"},
            "name": {"hi": "लेट ब्लाइट (Late Blight of Tomato)", "en": "Late Blight of Tomato"},
            "severity": "High / उच्च ⚠️",
            "symptoms": {
                "hi": [
                    "पत्तियों पर काले भूरे पानी जैसे धब्बे।",
                    "नमी में पत्तियों के नीचे सफेद फफूंद।",
                    "फल पर काले चकत्ते।",
                ],
                "en": [
                    "Dark water-soaked spots appear on leaf edges.",
                    "White fungal growth beneath leaves in humid weather.",
                    "Hard dark brown rot spots on fruits.",
                ],
            },
            "organicRemedy": {
                "hi": "कॉपर ऑक्सीक्लोराइड 3 ग्राम/लीटर पानी में मिलाकर छिड़काव करें।",
                "en": "Apply Copper Oxychloride @ 3g/litre of water.",
            },
            "chemicalRemedy": {
                "hi": "मैनकोज़ेब 75% WP या साइमोक्सानिल + मैनकोज़ेब का छिड़काव करें।",
                "en": "Spray Cymoxanil + Mancozeb @ 2g/litre of water.",
            },
            "prevention": {
                "hi": "पौधों के बीच हवा का आवागमन बनाए रखें और जलभराव न करें।",
                "en": "Ensure air circulation and avoid waterlogging.",
            },
        },
        "healthy_leaf": {
            "crop": {"hi": "स्वस्थ फसल (Healthy Crop)", "en": "Healthy Crop"},
            "name": {"hi": "कोई रोग नहीं पाया गया (Healthy & Disease Free)", "en": "Healthy & Disease Free"},
            "severity": "Safe / सुरक्षित ✅",
            "symptoms": {
                "hi": ["पत्तियां हरी और चमकदार हैं।", "कोई संक्रमण नहीं पाया गया।"],
                "en": ["Vibrant green leaves with uniform coloration.", "No visible infection or pest damage."],
            },
            "organicRemedy": {
                "hi": "फसल स्वस्थ है। नियमित सिंचाई एवं पोषण बनाए रखें।",
                "en": "Crop is healthy. Continue balanced nutrition and irrigation.",
            },
            "chemicalRemedy": {
                "hi": "रासायनिक स्प्रे की आवश्यकता नहीं है।",
                "en": "No chemical sprays are required.",
            },
            "prevention": {
                "hi": "संतुलित सिंचाई और पोषण जारी रखें।",
                "en": "Maintain balanced irrigation and nutrition.",
            },
        },
    }


def predict_disease_from_image(file_bytes: bytes):
    if MODEL is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "Disease model is unavailable because TensorFlow is not installed. "
                "Install TensorFlow or use the sample disease options."
            ),
        )
    image = preprocess_image(file_bytes)
    prediction = MODEL.predict(image)
    index = int(np.argmax(prediction[0]))
    confidence = float(np.max(prediction[0]))
    class_name = get_disease_classes()[index]
    meta = disease_metadata()[class_name]
    return {
        "class": class_name,
        "confidence": confidence,
        **meta,
    }


def predict_disease_from_sample(sample_id: str):
    data = disease_metadata().get(sample_id)
    if not data:
        raise HTTPException(status_code=404, detail="Sample disease not found")
    return {"class": sample_id, "confidence": 1.0, **data}


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "disease_model": bool(MODEL),
        "tensorflow_available": TF_AVAILABLE,
        "market_model": bool(MARKET_MODEL),
        "rainfall_model": bool(RAINFALL_MODEL),
    }


@app.post("/predict-disease")
async def predict_disease(
    file: Optional[UploadFile] = File(None),
    sampleId: Optional[str] = Form(None),
):
    if sampleId:
        return predict_disease_from_sample(sampleId)
    if not file:
        raise HTTPException(status_code=400, detail="Please upload an image file or provide a sampleId.")
    file_bytes = await file.read()
    return predict_disease_from_image(file_bytes)


def fetch_live_weather(region: str):
    coords = WEATHER_COORDINATES.get(region)
    if not coords:
        raise HTTPException(status_code=400, detail=f"Unknown region '{region}' for live weather data.")

    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}"
        "&current_weather=true&hourly=temperature_2m,relativehumidity_2m,pressure_msl,windspeed_10m,precipitation_probability"
        "&forecast_days=2&timezone=Asia/Kolkata"
    )
    try:
        request = Request(url, headers={"User-Agent": "KrishiMitraWeather/1.0"})
        with urlopen(request, timeout=15) as response:
            data = json.load(response)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Live weather API request failed: {exc}")

    current = data.get("current_weather", {})
    hourly = data.get("hourly", {})
    time_index = None
    if current and hourly.get("time"):
        try:
            time_index = hourly["time"].index(current["time"])
        except ValueError:
            time_index = None

    weather = {
        "temperature": current.get("temperature") if current else None,
        "wind": current.get("windspeed") if current else None,
        "pressure": None,
        "humidity": None,
        "precipProbability": None,
        "source": "Open-Meteo",
    }

    if time_index is not None:
        if hourly.get("relativehumidity_2m"):
            weather["humidity"] = hourly["relativehumidity_2m"][time_index]
        if hourly.get("pressure_msl"):
            weather["pressure"] = hourly["pressure_msl"][time_index]
        if hourly.get("precipitation_probability"):
            weather["precipProbability"] = hourly["precipitation_probability"][time_index]

    if weather["pressure"] is None and current:
        weather["pressure"] = 1010
    if weather["humidity"] is None:
        weather["humidity"] = 65
    if weather["precipProbability"] is None:
        weather["precipProbability"] = 0

    return weather


@app.get("/weather")
def get_weather(region: str):
    return fetch_live_weather(region)


@app.post("/predict-rainfall")
def predict_rainfall(
    region: str = Form(...),
    season: str = Form(...),
    temp: float = Form(...),
    humidity: float = Form(...),
    pressure: float = Form(...),
    wind: float = Form(...),
):
    if RAINFALL_MODEL is None:
        raise HTTPException(status_code=500, detail="Rainfall model is not trained. Run backend/train_rainfall_model.py first.")

    features = encode_rainfall_features({
        "region": region,
        "season": season,
        "temp": temp,
        "humidity": humidity,
        "pressure": pressure,
        "wind": wind,
    })
    prediction = RAINFALL_MODEL.predict([features])[0]
    probability = float(np.clip(prediction[0], 0, 100))
    volume = float(np.clip(prediction[1], 0, 200))

    if probability > 75:
        recommendation_hi = "भारी बारिश की संभावना! खेत में पानी निकासी (Drainage) का प्रबंधन करें और कीटनाशक छिड़काव स्थगित करें।"
        recommendation_en = "High chance of heavy rain! Manage field drainage and defer chemical spraying."
        alert_level = "High"
    elif probability > 45:
        recommendation_hi = "हल्की से मध्यम बारिश की संभावना। सामान्य सिंचाई करें और नमी का ध्यान रखें।"
        recommendation_en = "Moderate rain expected. Proceed with light irrigation and monitor moisture."
        alert_level = "Moderate"
    else:
        recommendation_hi = "बारिश की संभावना कम है। फसलों के लिए कृत्रिम सिंचाई (Irrigation) की योजना बनाएं।"
        recommendation_en = "Low rain probability. Plan artificial irrigation for your crops."
        alert_level = "Low"

    forecast = [
        {
            "day": "आज" if season == "Monsoon" else "Today",
            "temp": f"{int(temp)}°C",
            "condition": "🌧️ Rain" if probability > 60 else "⛅ Cloudy",
            "rainChance": f"{round(probability)}%",
        },
        {
            "day": "कल" if season == "Monsoon" else "Tomorrow",
            "temp": f"{int(temp - 1)}°C",
            "condition": "🌧️ Showers" if probability > 55 else "🌤️ Partly Cloudy",
            "rainChance": f"{round(min(95, probability + 10))}%",
        },
        {
            "day": "दिन 3" if season == "Monsoon" else "Day 3",
            "temp": f"{int(temp - 2)}°C",
            "condition": "⛈️ Thunderstorm" if probability > 70 else "⛅ Cloudy",
            "rainChance": f"{round(min(90, probability + 5))}%",
        },
        {
            "day": "दिन 4" if season == "Monsoon" else "Day 4",
            "temp": f"{int(temp + 1)}°C",
            "condition": "⛅ Partly Cloudy",
            "rainChance": "35%",
        },
        {
            "day": "दिन 5" if season == "Monsoon" else "Day 5",
            "temp": f"{int(temp + 2)}°C",
            "condition": "☀️ Sunny",
            "rainChance": "15%",
        },
    ]

    return {
        "probability": round(probability, 1),
        "volume": round(volume, 1),
        "alertLevel": alert_level,
        "recommendationHi": recommendation_hi,
        "recommendationEn": recommendation_en,
        "forecast": forecast,
    }


@app.post("/recommend-crop")
def recommend_crop(
    season: str = Form(...),
    soilType: str = Form(...),
    nitrogen: float = Form(...),
    phosphorus: float = Form(...),
    potassium: float = Form(...),
    ph: float = Form(...),
):
    if MARKET_MODEL is None:
        raise HTTPException(status_code=500, detail="Market model is not trained. Run backend/train_market_model.py first.")

    crop_scores = []
    for crop in CROP_CATALOG:
        features = [
            nitrogen,
            phosphorus,
            potassium,
            ph,
            SEASONS.index(season) if season in SEASONS else 0,
            SOIL_TYPES.index(soilType) if soilType in SOIL_TYPES else 0,
            CROP_CATALOG.index(crop),
        ]
        score = float(MARKET_MODEL.predict([features])[0])
        predicted_price = crop["baseMarket"] * (0.8 + score / 100)
        crop_scores.append((crop, score, predicted_price))

    crop_scores.sort(key=lambda item: item[1], reverse=True)
    recommendations = [format_recommendation(crop, score, predicted_price) for crop, score, predicted_price in crop_scores[:5]]
    return {"recommendations": recommendations}
