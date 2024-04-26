from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import joblib
import lime
from lime import lime_tabular

app = Flask(__name__)
CORS(app)   # Enable CORS for the API

# Load the trained model
model = joblib.load('model.joblib')     # NB

# Load the inverse mapping
inv_mapping = {
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

# Define symptoms
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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get symptoms from request
    symptoms_request = request.json['symptoms']

    # Check if any symptoms are selected
    if not symptoms_request:
        return jsonify({'error': 'No symptoms selected'}), 400  # Return error response with status code 400

    # Encode the symptoms into a binary vector
    input_vector = np.array([1 if symptom in symptoms_request else 0 for symptom in symptoms]).reshape(1, -1)

    # Use the trained model to predict probabilities for the symptoms
    predicted_probabilities = model.predict_proba(input_vector)[0]

    # Predicted disease for custom symptoms
    predicted_disease_custom = inv_mapping[np.argmax(predicted_probabilities)]

    # Explanation using LIME
    explainer = lime_tabular.LimeTabularExplainer(training_data=np.zeros((1, len(symptoms))),
                                                   feature_names=symptoms,
                                                   class_names=list(inv_mapping.values()),
                                                   mode="classification")

    # Fn defn to make predictions with model
    def predict_fn(x):
        return model.predict_proba(x)

    # Get the explanation for the predicted class
    explanation = explainer.explain_instance(data_row=input_vector[0],
                                             predict_fn=predict_fn,
                                             num_features=len(symptoms),
                                             top_labels=1)

    # Filter out features with importance between -0.0001 and 0.0001 (inclusive), except for the custom symptoms
    filtered_explanation = [(symptom, weight) for symptom, weight in explanation.as_list(label=explanation.available_labels()[0]) if weight > 0.0001 or weight < -0.0001 or symptom in symptoms_request]

    # Calculate confidence level
    confidence_level = max(predicted_probabilities) * 100

    # Return the predicted disease, confidence level, and explanation
    return jsonify({
        'diagnosis': predicted_disease_custom,
        'confidence_level': confidence_level,
        'explanation': filtered_explanation
    })

if __name__ == '__main__':
    app.run(debug=True)
