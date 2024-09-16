import React from "react";
import "./Home.css"; // Import the CSS file
import img from "./myimage.png";
function Home() {
  return (
    <div className="home-container">
      <div className="note">
        <form className="form-container">
          <input
            type="text"
            id="weather"
            name="weather"
            placeholder="Enter weather condition"
            required
          />
          <input
            type="number"
            id="temperature"
            name="temperature"
            placeholder="Enter temperature"
            required
          />
          <label htmlFor="political_stability">Political Stability:</label>
          <select id="political_stability" name="political_stability" required>
            <option value="" disabled selected>
              Select political stability level
            </option>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
          </select>
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" required />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <img
        src={img}
        alt="smart-india"
        className="logo"
      />
    </div>
  );
}

export default Home;
