import os
import sys
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import tensorflow as tf
import contextlib

# Suppress TensorFlow INFO and WARNING logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Assuming the model file is in the same directory as this script
model_path = os.path.join(os.path.dirname(__file__), 'trained_lung_cancer_model.h5')
if not os.path.exists(model_path):
    print(f"Model file not found at {model_path}")
    sys.exit(1)

model = load_model(model_path)

IMAGE_SIZE = (350, 350)

def load_and_preprocess_image(img_path, target_size):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array

def predict_image_class(model, img_path, target_size):
    img = load_and_preprocess_image(img_path, target_size)
    
    # Suppress the progress bar and other logs from Keras
    with open(os.devnull, 'w') as f, contextlib.redirect_stdout(f), contextlib.redirect_stderr(f):
        predictions = model.predict(img)
    
    predicted_class = np.argmax(predictions[0])
    class_labels = ['normal', 'adenocarcinoma', 'large cell carcinoma', 'squamous cell carcinoma']
    predicted_label = class_labels[predicted_class]
    return predicted_label

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <image_path>")
        sys.exit(1)

    img_path = sys.argv[1]
    predicted_label = predict_image_class(model, img_path, IMAGE_SIZE)
    print(predicted_label)
