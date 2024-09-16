import React from "react";
import "./Home.css"; // Import the CSS file
import img from "./myimage.png";
function Home() {
  return (
 
    <div className="home-container">
      <div className="note">
        <form className="form-container">
          {/* Weather Condition */}
          <input
            type="text"
            id="weather"
            name="weather"
            placeholder="Enter weather condition"
            required
          />

          {/* City */}
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city"
            required
          />

          {/* Minimum Temperature */}
          <input
            type="number"
            id="min_temperature"
            name="min_temperature"
            placeholder=" Enter min temp"
            required
          />

          {/* Maximum Temperature */}
          <input
            type="number"
            id="max_temperature"
            name="max_temperature"
            placeholder=" Enter max temp"
            required
          />

          {/* Minimum Selling Price */}
          <input
            type="number"
            id="min_selling_price"
            name="min_selling_price"
            placeholder=" Enter min selling price"
            required
          />

          {/* Political Stability */}
          <label htmlFor="political_stability">Political Stability:</label>
          <select id="political_stability" name="political_stability" required>
            <option value="" disabled selected>
              Select political stability level
            </option>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
          </select>

          {/* Date */}
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" required />

          {/* Submit */}
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>

      <img src={img} alt="smart-india" className="logo" />
    </div>
  );
}



export default Home;
