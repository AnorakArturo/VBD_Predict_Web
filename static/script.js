document.addEventListener('DOMContentLoaded', function () {
    const symptoms = [
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
    ];

    const sortedSymptoms = [...symptoms].sort(); // Sorted copy of symptoms array

    let showList = false;

    function filterSymptoms() {
        const searchTerm = document.getElementById('symptom-search').value.toLowerCase();
        const filteredSymptoms = sortedSymptoms.filter(symptom => symptom.toLowerCase().includes(searchTerm));

        const symptomsList = document.getElementById('symptoms-list');
        symptomsList.innerHTML = ''; // Clear the previous contents of the symptoms list

        filteredSymptoms.forEach(symptom => {
            const symptomItem = document.createElement('li');
            symptomItem.textContent = symptom;
            symptomItem.addEventListener('click', () => {
                addSymptomToForm(symptom);
            });
            symptomsList.appendChild(symptomItem);
        });
    }
    
    function addSymptomToForm(symptom) {
        const selectedSymptomsList = document.getElementById('selected-symptoms-list');
    
        // Create a new list item for the selected symptom
        const selectedSymptomItem = document.createElement('li');
        selectedSymptomItem.classList.add('selected-symptom-box');
    
        // Create a span for the symptom text
        const symptomText = document.createElement('span');
        symptomText.textContent = symptom;
    
        // Create a remove button with the times icon
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="fa fa-minus-square"></i>';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => {
            selectedSymptomItem.remove(); // Remove the selected symptom from the list when the remove button is clicked
        });
    
        // Append symptom text and remove button to the selected symptom item
        selectedSymptomItem.appendChild(symptomText);
        selectedSymptomItem.appendChild(removeButton);
    
        // Append the selected symptom item to the selected symptoms list
        selectedSymptomsList.appendChild(selectedSymptomItem);
    
        // Update the value of the search field with the selected symptom
        const searchField = document.getElementById('symptom-search');
        searchField.value = symptom;
    }

    function updateSearchField(symptom) {
        // Update the value of the search field with the selected symptom
        const searchField = document.getElementById('symptom-search');
        searchField.value = symptom;
    }

    document.getElementById('predict-btn').addEventListener('click', async () => {
        const selectedSymptoms = Array.from(document.querySelectorAll('.selected-symptom-box'));
        const symptoms = selectedSymptoms.map(symptomBox => symptomBox.textContent.trim());
    
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symptoms })
        });
    
        const result = await response.json();
        document.getElementById('result').innerHTML = `
            <p>Diagnosis: ${result.diagnosis}</p>
            <p>Confidence Level: ${result.confidence_level}</p>
        `;
        
        // Display explanation if available
        if (result.explanation) {
            const explanationHTML = result.explanation.map(([symptom, weight]) => `<p>${symptom}: ${weight}</p>`).join('');
            document.getElementById('result').innerHTML += `<div><h3>Explanation:</h3>${explanationHTML}</div>`;
        }
    });


    // Hide the symptom list by default when the page loads
    window.onload = function () {
        const symptomsList = document.getElementById('symptoms-list');
        symptomsList.style.display = 'none';
    }

    document.getElementById('show-all-btn').addEventListener('click', () => {
        showList = !showList;
        const symptomsList = document.getElementById('symptoms-list');
        if (showList) {
            // Show the entire list
            symptomsList.style.display = 'block';
            document.getElementById('show-all-btn').textContent = 'Hide List';
        } else {
            // Hide the entire list
            symptomsList.style.display = 'none';
            document.getElementById('show-all-btn').textContent = 'Show Entire List';
        }
    });


    // Function to handle the prediction response
    function handlePredictionResponse(response) {
        const resultDiv = document.getElementById('result');

        // Clear previous results
        resultDiv.innerHTML = '';

        if (response && response.diagnoses) {
            // Display each diagnosis and confidence level
            response.diagnoses.forEach(diagnosis => {
                const diagnosisText = diagnosis[0];
                const confidenceLevel = diagnosis[1];

                const diagnosisElement = document.createElement('p');
                diagnosisElement.textContent = `Diagnosis: ${diagnosisText}`;
                resultDiv.appendChild(diagnosisElement);

                const confidenceElement = document.createElement('p');
                confidenceElement.textContent = `Confidence Level: ${confidenceLevel}`;
                resultDiv.appendChild(confidenceElement);
            });
        } else {
            // Handle case when no diagnoses are returned
            resultDiv.textContent = 'No diagnoses found.';
        }
    }

    async function predictDisease() {
        console.log('Predicting disease...');
        // Get selected symptoms
        const selectedSymptoms = Array.from(document.querySelectorAll('.selected-symptom-box'));
        const symptoms = selectedSymptoms.map(symptomBox => symptomBox.textContent.trim());
    
        // Show loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        loadingIndicator.style.display = 'block';
    
        try {
            // Check if there are any selected symptoms
            if (symptoms.length === 0) {
                // Display a warning message
                document.getElementById('result').textContent = 'Please select at least one symptom.';
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                return; // Exit the function
            }
    
            // Fetch prediction
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symptoms })
            });
    
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Prediction request failed.');
            }
    
            // Parse response and handle prediction
            const result = await response.json();
    
            console.log('Prediction response:', result);
    
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
    
            // Check if the response contains the 'diagnosis' and 'confidence_level' properties
            if (result.diagnosis && result.confidence_level) {
                // Display the diagnosis and confidence level
                document.getElementById('result').innerHTML = `
                    <p>Diagnosis: ${result.diagnosis}</p>
                    <p>Confidence Level: ${result.confidence_level}</p>
                `;
                // Display explanation if available
                if (result.explanation) {
                    const explanationHTML = result.explanation.map(([symptom, weight]) => `<p>${symptom}: ${weight}</p>`).join('');
                    document.getElementById('result').innerHTML += `<div><h3>Explanation:</h3>${explanationHTML}</div>`;
                }
            } else {
                // Handle case when 'diagnosis' and 'confidence_level' are not provided
                document.getElementById('result').textContent = 'Prediction request failed. Please try again.';
            }
        } catch (error) {
            console.error('Prediction request failed:', error);
            // Hide loading indicator in case of error
            loadingIndicator.style.display = 'none';
            // Display error message
            document.getElementById('result').textContent = 'Error predicting disease. Please try again.';
        }
    }
    
    // Attach event listener to predict button
    document.getElementById('predict-btn').addEventListener('click', predictDisease);

    // Call filterSymptoms() when the page loads to populate the symptom list initially
    filterSymptoms();

     // Attach event listener for the 'oninput' event of the search box
     document.getElementById('symptom-search').addEventListener('input', filterSymptoms);
});