# CSE Final Year Project

Sai Krishna P - 2020503536

This project uses Machine Learning to predict vector-borne diseases based on various symptoms input by the user. It features a web interface built with Flask, allowing for easy and intuitive interaction.

## Objective

The objective of this project is to develop a system for predicting vector-borne diseases using machine learning techniques. Early detection and prediction of vector-borne diseases via symptoms can significantly impact public health by enabling timely intervention and prevention strategies.

## Features

- Symptom input interface for users
- Disease prediction using machine learning models
- Visual representation of prediction results with confidence level
- User-friendly web interface built with Flask

## Technologies Used

- Python (Flask, NumPy, scikit, etc)
- HTML/CSS/JavaScript (Frontend)
- Visual Studio Code (IDE)
- GitHub (for version control)

## Data Sources

- [Orignal Kaggle Dataset](https://www.kaggle.com/datasets/richardbernat/vector-borne-disease-prediction)
- [Synthesised Dataset - Used in Notebook](https://www.kaggle.com/competitions/playground-series-s3e13)

## Model Explanation

The machine learning model used in this project is based on Random Forest Model. The Notebook includes several other models including Naive Bayes, XGBoost and others. The model was trained using the provided dataset and achieves 94% accuracy on test data. It is suitable for predicting vector-borne diseases based on user-input symptoms.

## User Guide

To Use:

1. Download and unzip folder.
2. Navigate to project directory.
3. Install requirements.
4. Run the Flask application in Visual Studio Code or in Terminal.
5. Open localhost in browser - <http://127.0.0.1:5000>
6. Select the symptoms and click on the predict button.
7. View Results.
