import { useEffect, useState } from "react";
import "./app.css";
import apiFetch from "./customFetch/api";
import umbrella from "./assets/umbrella.png";
import outdoor from "./assets/run.png";
import clothing from "./assets/laundry.png";
import background from './assets/background.jpg';

function App() {
  const apiKey = "8ad4d967676a70027224822fcc0c33a0";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  const [temp, setTemp] = useState("");
  const [icon, setIcon] = useState("");
  const [country, setCountry] = useState("IN");
  const [city, setCity] = useState("Gorakhpur");
  const [feelslike, setFeelslike] = useState();
  const [cityInput, setCityInput] = useState("");
  const [pressure, setPressure] = useState();
  const [humidity, setHumidity] = useState();
  const [wind, setWind] = useState();
  const [description, setDescription] = useState();
  const [aqi, setAqi] = useState("");
  const [aqiWord, setAqiWord] = useState("");
  const [aqiColor, setAqiColor] = useState("");
  const [inputError, setInputError] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [process, setProcess] = useState(true);
  const [need, setNeed] = useState("");
  const [umbrellaIndi, setumbrellaIndi] = useState();
  const [good, setGood] = useState("");
  const [cloth, setCloth] = useState("");

  const weather = async (cityName = city) => {
    try {
      const response = await fetch(`https://backend-api1-k68w.onrender.com/api?city=${city}`);
      const data = await response.json();
      setProcess(true);
      setIcon(data.weather[0].icon);
      setTemp(Math.floor(data.main.temp));
      setCountry(data.sys.country);
      setFeelslike(Math.ceil(data.main.feels_like));
      setPressure(data.main.pressure);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCity(cityName);
      setDescription(data.weather[0].description);
      await apiFetch(data.coord, setAqi, apiKey, setAqiWord, setAqiColor);
      setInputError(false);
      setLocationError(null);
      setProcess(false);
    } catch (err) {
      console.log("Something went wrong in server", err);
      setInputError(true);
      setProcess(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      setProcess(true);
      setIcon(data.weather[0].icon);
      setTemp(Math.floor(data.main.temp));
      setCountry(data.sys.country);
      setFeelslike(Math.ceil(data.main.feels_like));
      setPressure(data.main.pressure);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCity(data.name);
      setDescription(data.weather[0].description);
      await apiFetch(data.coord, setAqi, apiKey, setAqiWord, setAqiColor);
      setInputError(false);
      setLocationError(null);
      setProcess(false);
    } catch (err) {
      console.log("Location fetch error", err);
      setLocationError("Unable to access your location.");
      setProcess(false);
    }
  };

  useEffect(() => {
    weather();
  }, []);

  function findCity() {
    if (cityInput.trim()) {
      weather(cityInput);
      setCityInput("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      weather(cityInput);
      setCityInput("");
    }
  }

  useEffect(() => {
    if (
      description &&
      (description.includes("rain") ||
        description.includes("drizzle") ||
        description.includes("overcast clouds"))
    ) {
      setNeed("Need");
      setumbrellaIndi(true);
      setGood("Poor");
    } else {
      setumbrellaIndi(false);
      setGood("Good");
      setNeed("No need");
    }
  }, [description]);

  useEffect(() => {
    if (temp > 20) {
      setCloth("Shorts");
    } else if (temp >= 10) {
      setCloth("Hoodie");
    } else {
      setCloth("Sweaters");
    }
  }, [temp]);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         fetchWeatherData(latitude, longitude);
  //       },
  //       (error) => {
  //         console.error("Geolocation error:", error);
  //       }
  //     );
  //   }
  // }, []);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // setLocationError("Unable to access your location. Please check permissions.");
        }
      );
    }
  };


  return (
    <div className="app">
      <div className="dashboard-container">
        <main className="content">
          {/* Search Section */}
          {process && <p className="processbar">Processing...</p>}
          <div className="search-section">
            <input
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Search for your preffered city..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />
            <button className="search-button" onClick={findCity}><i class="ri-search-line"></i>  </button>
            <button onClick={handleCurrentLocation} className= "location" ><i class="ri-map-pin-line"></i> <p>Current Location</p></button>
          </div>

          {inputError && (
            <p className="error-message">
              City not found. Please check Internet Connection!
            </p>
          )} 
           {locationError && (
            <p className="error-message">⚠️ {locationError}</p>
          )}


          {/* Weather Info */}
          <div className="weather-info">
            <div className="deal">
              {icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt="Weather icon"
                  className="weather-icon"
                />
              )}
              <div className="deal1">
                <h1 className="city-name">
                  {city}, {country}{" "}
                </h1>
                <p className="weather-condition">{description}</p>
              </div>
            </div>

            <div className="temperature-section">
              <span className="temperature">{temp}°C</span>
              <span className="feels-like">Feels like {feelslike}°C</span>
            </div>
          </div>

          {/* Extra Info */}
          <div className="extra-widgets">
            <div className="widget aqi">
              AQI: <span style={{ color: aqiColor }}>{aqiWord}</span>
            </div>
            <div className="widget pressure">
              Pressure: <span>{pressure} mbar</span>
            </div>
            <div className="widget humidity">
              <i class="ri-water-percent-line"></i> Humidity:{" "}
              <span>{humidity}%</span>
            </div>
            <div className="widget wind">
              <i class="ri-windy-line"></i> Wind: <span> {wind} km/h</span>
            </div>
          </div>

          {/* Chart */}
          <div className="chart-section">
            <h3 className="chart-title">Temperature Trends</h3>

            <div className="mainBox">
              <h4>Today's Recommendation</h4>
              <div className="recommendation-box">
                <div className="box1">
                  <div className="miniBox1">
                    <div className="logobox">
                      <img src={umbrella} alt="" />
                    </div>
                    <div className="detailu">
                      <p>Umbrella</p>
                      <div className="indicator">
                        <div
                          className="indi"
                          style={{
                            backgroundColor: need == "Need" ? "red" : "green",
                          }}
                        ></div>
                        <span>{need}</span>
                      </div>
                    </div>
                  </div>

                  <div className="miniBox2">
                    <div className="logobox">
                      <img src={outdoor} alt="Outdoor" />
                    </div>
                    <div className="detailu">
                      <p>Outdoor</p>
                      <div className="indicator">
                        <div
                          className="indi"
                          style={{
                            backgroundColor: good == "Poor" ? "red" : "green",
                          }}
                        ></div>
                        <span>{good}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box2">
                  <div className="miniBox3">
                    <div className="logobox">
                      <img src={clothing} alt="Clothing" />
                    </div>
                    <div className="detailu">
                      <p>Clothing</p>
                      <div className="indicator">
                        <div
                          className="indi"
                          style={{
                            backgroundColor: good == "Poor" ? "orange" : "green",
                          }}
                        ></div>
                        <span>{cloth}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://www.msn.com/en-in/weather/life/in-Gorakhpur,Uttar-Pradesh?loc=eyJsIjoiR29yYWtocHVyIiwiciI6IlV0dGFyIFByYWRlc2giLCJjIjoiSW5kaWEiLCJpIjoiSU4iLCJ0IjoxMDIsImciOiJlbi1pbiIsIngiOiI4My4zNzM3IiwieSI6IjI2Ljc2MDgifQ%3D%3D&weadegreetype=C&ocid=winp2fptaskbar&cvid=83494f7e8d8c4a989c845edf10f78e1a"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                    >
                    <div className="miniBox4">
                      <p>See more</p>
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </a>

                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
