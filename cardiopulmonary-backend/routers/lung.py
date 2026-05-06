from fastapi import APIRouter, File, UploadFile
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import numpy as np
import io
import base64
import cv2
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

router = APIRouter()

NIH_CLASSES = [
    'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration',
    'Mass', 'Nodule', 'Pneumonia', 'Pneumothorax',
    'Consolidation', 'Edema', 'Emphysema', 'Fibrosis',
    'Pleural_Thickening', 'Hernia'
]

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def fix_state_dict(state_dict, prefix):
    new_state_dict = {}
    for key, value in state_dict.items():
        if key.startswith(prefix):
            new_key = key[len(prefix):]
            new_state_dict[new_key] = value
        else:
            new_state_dict[key] = value
    return new_state_dict

def load_nih_model():
    model = models.densenet121(weights=None)
    model.classifier = nn.Linear(1024, 14)
    checkpoint = torch.load("models/lung_nih.pth", map_location=torch.device("cpu"))
    if "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
    else:
        state_dict = checkpoint
    state_dict = fix_state_dict(state_dict, "densenet.")
    model.load_state_dict(state_dict)
    model.eval()
    return model

def load_rsna_model():
    model = models.densenet121(weights=None)
    model.classifier = nn.Linear(1024, 1)
    checkpoint = torch.load("models/lung_rsna.pth", map_location=torch.device("cpu"))
    if "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
    else:
        state_dict = checkpoint
    state_dict = fix_state_dict(state_dict, "densenet.")
    model.load_state_dict(state_dict)
    model.eval()
    return model

nih_model = load_nih_model()
rsna_model = load_rsna_model()

@router.post("/lung")
async def predict_lung(file: UploadFile = File(...)):

    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img_resized = img.resize((224, 224))

    img_tensor = transform(img_resized).unsqueeze(0)
    img_numpy = np.array(img_resized) / 255.0

    # NIH prediction
    with torch.no_grad():
        nih_output = nih_model(img_tensor)
        nih_probs = torch.sigmoid(nih_output).squeeze().numpy()

    nih_results = {}
    for i in range(len(NIH_CLASSES)):
        nih_results[NIH_CLASSES[i]] = round(float(nih_probs[i]) * 100, 2)

    # RSNA prediction
    with torch.no_grad():
        rsna_output = rsna_model(img_tensor)
        rsna_prob = torch.sigmoid(rsna_output).squeeze().item()
    rsna_pneumonia = round(float(rsna_prob) * 100, 2)

    top_disease = max(nih_results, key=nih_results.get)
    top_confidence = nih_results[top_disease]

    # Grad-CAM
    try:
        target_layer = [nih_model.features[-1]]
        cam = GradCAM(model=nih_model, target_layers=target_layer)
        grayscale_cam = cam(input_tensor=img_tensor)[0]
        cam_image = show_cam_on_image(img_numpy.astype(np.float32), grayscale_cam, use_rgb=True)
        _, buffer = cv2.imencode(".jpg", cv2.cvtColor(cam_image, cv2.COLOR_RGB2BGR))
        gradcam_base64 = base64.b64encode(buffer).decode("utf-8")
    except Exception:
        gradcam_base64 = None

    return {
        "top_disease": top_disease,
        "top_confidence": top_confidence,
        "pneumonia_rsna_confidence": rsna_pneumonia,
        "all_diseases": nih_results,
        "gradcam_heatmap": gradcam_base64
    }
