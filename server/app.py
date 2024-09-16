from flask import Flask,request,jsonify
import pickle
from flask_cors import CORS
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import joblib
from sklearn.preprocessing import OneHotEncoder

app = Flask(__name__)
CORS(app)
model = pickle.load(open('model.pkl','rb'))
scaler = pickle.load(open('scaler.pkl','rb'))

@app.route('/', methods=['GET'])
def get_data():
    data = {
        "message":"API is Running"
    }
    return jsonify(data)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        # Extract the form data sent from the frontend
        weather = data.get('weather')
        city = data.get('city')
        min_temperature = float(data.get('min_temperature'))
        max_temperature = float(data.get('max_temperature'))
        min_selling_price = float(data.get('min_selling_price'))
        political_stability = data.get('political_stability')
        date = data.get('date')  # Date in 'YYYY-MM-DD' format
        # You can implement a rule to convert 'weather' and 'political_stability' into numeric or encoded features if necessary
        rainfall = 0  # Assuming rainfall data is required, this can be a default or fetched from another source
        # Use the predict_price function to get the prediction
        predicted_price = predict_price(date, city, min_selling_price, rainfall, max_temperature, min_temperature)
        # Create a response dictionary
        response = {
            'message': f"The predicted price for {city} on {date} is {predicted_price:.2f}"
        }
        # Return the prediction as JSON
        return jsonify(response)

    except Exception as e:
        # In case of an error, return the error message
        return jsonify({"error": str(e)}), 500

    


def load_model_and_scalers(city):
    # Load the model for the given city
    model = load_model(f'{city}_model.h5')
    
    # Load the scalers
    scaler_X = joblib.load(f'{city}_scaler_X.pkl')
    scaler_y = joblib.load(f'{city}_scaler_y.pkl')
    
    return model, scaler_X, scaler_y

def predict_price(date, city, msp, rainfall, max_temp, min_temp):
    # Load model and scalers
    model, scaler_X, scaler_y = load_model_and_scalers(city)
    
    # Prepare the input DataFrame
    input_df = pd.DataFrame({
        'date': [date],
        'city': [city],  # Ensure city column is included
        'MSP': [msp],
        'rainfall': [rainfall],
        'max_temp': [max_temp],
        'min_temp': [min_temp]
    })
    
    # Ensure the date is in the correct format
    input_df['date'] = pd.to_datetime(input_df['date'], format='%d-%m-%Y')
    
    # Create the 'Month' column
    input_df['Month'] = input_df['date'].dt.to_period('M')
    
    # Aggregate data by month (mean values)
    input_df = input_df.groupby('Month').agg({
        'rainfall': 'mean',
        'max_temp': 'mean',
        'min_temp': 'mean',
        'MSP': 'mean'
    }).reset_index()

    # One-Hot Encode city
    enc = OneHotEncoder(sparse_output=False)  # Update to new parameter name
    city_encoded = enc.fit_transform([[city]])  # Ensure city is passed correctly
    
    # Prepare feature data (without the city)
    features = ['rainfall', 'max_temp', 'min_temp', 'MSP']
    input_data = input_df[features].values
    
    # Concatenate the city encoding with the other features
    input_data = np.concatenate((input_data, city_encoded), axis=1)
    
    # Ensure enough time steps for the model
    time_step = 30
    if input_data.shape[0] < time_step:
        padding = np.zeros((time_step - input_data.shape[0], input_data.shape[1]))
        input_data = np.vstack((padding, input_data))
    
    # Use only the most recent time_steps
    input_data = input_data[-time_step:]
    
    # Reshape for LSTM (batch_size, time_steps, features)
    input_data = np.reshape(input_data, (1, time_step, input_data.shape[1]))
    
    # Check shapes
    print("Input data shape:", input_data.shape)
    
    # Predict using the model
    scaled_price_pred = model.predict(input_data)
    price_pred = scaler_y.inverse_transform(scaled_price_pred)
    
    return price_pred[0][0]




if(__name__ == '__main__'):
    app.run(port='5000',debug=True)
