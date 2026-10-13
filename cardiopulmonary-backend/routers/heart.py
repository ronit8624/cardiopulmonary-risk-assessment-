from fastapi import APIRouter, File, UploadFile
from tensorflow import keras
import numpy as np
from PIL import Image
import io

router = APIRouter()

model = keras.models.load_model("models/heart_model.keras")

CLASS_NAMES = ['Abnormal Heartbeat', 'Myocardial Infarction', 'Normal']

@router.post("/heart")
async def predict_heart(file: UploadFile = File(...)):

    contents = await file.read()
    img = Image.open(io.BytesIO(contents))

    img = img.convert("RGB")

    img = img.resize((224, 224))

    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    predicted_index = int(np.argmax(predictions[0]))
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(np.max(predictions[0])) * 100

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 2),
        "all_predictions": {
            CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 2)
            for i in range(len(CLASS_NAMES))
        }
    }
