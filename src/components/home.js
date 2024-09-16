import React, { useState } from "react";
import "./Home.css"; // Import the CSS file
import img from "./myimage.png";

function Home() {
  // State variables to store form data
  const [formData, setFormData] = useState({
    weather: "",
    city: "",
    min_temperature: "",
    max_temperature: "",
    min_selling_price: "",
    political_stability: "",
    date: ""
  });
  const [showSpan, setShowSpan] = useState(false);

  // Handle form data change
  const handleChange = (e) => {
    e.preventDefault();
      const url = "http://localhost:5000/predict";
      setIsloading(true);
      const jsonData = JSON.stringify(formData);
      fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: jsonData,
      })
        .then((response) => response.json())
        .then((response) => {
          setResult(response.message);
          setIsloading(false);
          setShowSpan(true);
        });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data: ", formData);
    // You can perform further actions like sending the form data to an API or processing it.
  };

  return (
    <div className="home-container">
      <div className="note">
        <form className="form-container" onSubmit={handleSubmit}>
          {/* Weather Condition */}
          <input
            type="text"
            id="weather"
            name="weather"
            placeholder="Enter weather condition"
            value={formData.weather}
            onChange={handleChange}
            required
          />

          {/* City */}
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          {/* Minimum Temperature */}
          <input
            type="number"
            id="min_temperature"
            name="min_temperature"
            placeholder="Enter min temp"
            value={formData.min_temperature}
            onChange={handleChange}
            required
          />

          {/* Maximum Temperature */}
          <input
            type="number"
            id="max_temperature"
            name="max_temperature"
            placeholder="Enter max temp"
            value={formData.max_temperature}
            onChange={handleChange}
            required
          />

          {/* Minimum Selling Price */}
          <input
            type="number"
            id="min_selling_price"
            name="min_selling_price"
            placeholder="Enter min selling price"
            value={formData.min_selling_price}
            onChange={handleChange}
            required
          />

          {/* Political Stability */}
          <label htmlFor="political_stability">Political Stability:</label>
          <select
            id="political_stability"
            name="political_stability"
            value={formData.political_stability}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select political stability level
            </option>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
          </select>

          {/* Date */}
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          {/* Submit */}
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>

      <img src={img} alt="smart-india" className="logo" />
      {showSpan && (
              <div id="prediction" className="pt-16 pb-16 text-center text-black text-2xl md:text-5xl bg-pri font-mono font-normal">
                {result ? <p class="p-2 bg-gray-900 text-white">{result}</p> : <p>Please fill out each field in the form completely</p>}
              </div>
            )}
    </div>
  );
}

export default Home;
