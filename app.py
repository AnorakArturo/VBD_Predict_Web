from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)  # Enable CORS for the API

model = joblib.load('random_forest.joblib')

symptoms = [
    "Sudden Fever", "Headache", "Mouth Bleed", "Nose Bleed", "Muscle Pain", "Joint Pain", "Vomiting", "Rash",
    "Diarrhea", "Hypotension", "Pleural Effusion", "Ascites", "Gastro Bleeding", "Swelling", "Nausea",
    "Chills", "Myalgia", "Digestion Trouble", "Fatigue", "Skin Lesions", "Stomach Pain", "Orbital Pain",
    "Neck Pain", "Weakness", "Back Pain", "Weight Loss", "Gum Bleed", "Jaundice", "Coma", "Diziness",
    "Inflammation", "Red Eyes", "Loss Of Appetite", "Urination Loss", "Slow Heart Rate", "Abdominal Pain",
    "Light Sensitivity", "Yellow Skin", "Yellow Eyes", "Facial Distortion", "Microcephaly", "Rigor",
    "Bitter Tongue", "Convulsion", "Anemia", "Cocacola Urine", "Hypoglycemia", "Prostraction",
    "Hyperpyrexia", "Stiff Neck", "Irritability", "Confusion", "Tremor", "Paralysis", "Lymph Swells",
    "Breathing Restriction", "Toe Inflammation", "Finger Inflammation", "Lips Irritation", "Itchiness",
    "Ulcers", "Toenail Loss", "Speech Problem", "Bullseye Rash"
]

# Define mapping of disease indices to disease names
disease_mapping = {
    0: 'Chikungunya',
    1: 'Dengue',
    2: 'Rift Valley fever',
    3: 'Yellow Fever',
    4: 'Zika',
    5: 'Malaria',
    6: 'Japanese encephalitis',
    7: 'West Nile fever',
    8: 'Plague',
    9: 'Tungiasis',
    10: 'Lyme disease'
}


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get symptoms from request
    symptoms_request = request.json['symptoms']
    # Encode the symptoms into a    binary vector
    input_vector = [1 if symptom in symptoms_request else 0 for symptom in symptoms]
    # Use the trained model to predict probabilities for the symptoms
    predicted_probabilities = model.predict_proba([input_vector])[0]
    
    # Get the index of the predicted diseases with confidence level above 80%
    confident_predictions = [(idx, prob) for idx, prob in enumerate(predicted_probabilities) if prob > 0.8]
    
    # Get the names of the confident diseases using the mapping
    confident_diseases = [(disease_mapping.get(idx, 'Unknown'), prob) for idx, prob in confident_predictions]
    
    # Return the predicted diseases and their probabilities
    return jsonify({
        'diagnoses': confident_diseases,
    })

if __name__ == '__main__':
    app.run(debug=True)
