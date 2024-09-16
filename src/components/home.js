import React, { useState } from "react";
import "./Home.css";
import img from "./myimage.png";

function Home() {
  const [formData, setFormData] = useState({
    city: "",
    min_temperature: "",
    max_temperature: "",
    min_selling_price: "",
    rainfall: "",
    date: "",
  });
  const [showSpan, setShowSpan] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = "http://localhost:5000/predict";
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
        console.log(result);
        setShowSpan(true);
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  };

  return (
    <div className="home-container">
      <div className="note">
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            id="min_temperature"
            name="min_temperature"
            placeholder="Enter min temp"
            value={formData.min_temperature}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            id="max_temperature"
            name="max_temperature"
            placeholder="Enter max temp"
            value={formData.max_temperature}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            id="min_selling_price"
            name="min_selling_price"
            placeholder="Enter min selling price"
            value={formData.min_selling_price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            id="rainfall"
            name="rainfall"
            placeholder="Enter rainfall (in mm)"
            value={formData.rainfall}
            onChange={handleChange}
            required
          />
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <img src={img} alt="smart-india" className="logo" />
      {showSpan && (
        <div id="prediction" className="prediction">
          {result ? (
            <p className = "respred">{result}</p>
          ) : (
            <p className="respred">Please fill out each field in the form completely</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
