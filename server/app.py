from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib
from sklearn.preprocessing import OneHotEncoder

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def get_data():
    data = {
        "message": "API is Running"
    }
    return jsonify(data)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        city = data.get('city')
        min_temperature = float(data.get('min_temperature'))
        max_temperature = float(data.get('max_temperature'))
        min_selling_price = float(data.get('min_selling_price'))
        rainfall = float(data.get('rainfall'))
        date = data.get('date')

        predicted_price = predict_price(date, city, min_selling_price, rainfall, max_temperature, min_temperature)
        response = {
            'message': f"The predicted price for {city} on {date} is {predicted_price:.2f}"
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def load_model_and_scalers(city):
    model = load_model(f'{city}_model.h5')
    scaler_X = joblib.load(f'{city}_scaler_X.pkl')
    scaler_y = joblib.load(f'{city}_scaler_y.pkl')
    return model, scaler_X, scaler_y

def predict_price(date, city, msp, rainfall, max_temp, min_temp):
    model, scaler_X, scaler_y = load_model_and_scalers(city)
    input_df = pd.DataFrame({
        'date': [date],
        'city': [city],
        'MSP': [msp],
        'rainfall': [rainfall],
        'max_temp': [max_temp],
        'min_temp': [min_temp]
    })

    input_df['date'] = pd.to_datetime(input_df['date'], format='%Y-%m-%d')
    input_df['Month'] = input_df['date'].dt.to_period('M')
    input_df = input_df.groupby('Month').agg({
        'rainfall': 'mean',
        'max_temp': 'mean',
        'min_temp': 'mean',
        'MSP': 'mean'
    }).reset_index()

    enc = OneHotEncoder(sparse_output=False)
    city_encoded = enc.fit_transform([[city]])

    features = ['rainfall', 'max_temp', 'min_temp', 'MSP']
    input_data = input_df[features].values
    input_data = np.concatenate((input_data, city_encoded), axis=1)

    time_step = 30
    if input_data.shape[0] < time_step:
        padding = np.zeros((time_step - input_data.shape[0], input_data.shape[1]))
        input_data = np.vstack((padding, input_data))

    input_data = input_data[-time_step:]
    input_data = np.reshape(input_data, (1, time_step, input_data.shape[1]))

    scaled_price_pred = model.predict(input_data)
    price_pred = scaler_y.inverse_transform(scaled_price_pred)
    return price_pred[0][0]

if __name__ == '__main__':
    app.run(port='5000', debug=True)
