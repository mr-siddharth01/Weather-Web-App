
async function apiFetch(coord,setAqi,apiKey,setAqiWord,setAqiColor) {

    // Fetch AQI using coordinates from weather data
    const { lat, lon } = coord;
    const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    const aqiData = await aqiRes.json();
    console.log(aqiData);
    const aqiIndex = aqiData.list[0].main.aqi;
    setAqi(aqiIndex);

    const statusLabels = ["Good","Fair","Moderate","Poor","Very Poor"] 
    const aqiColor = ['green','yellow','Teal','orange','red','gray']
    setAqiWord(statusLabels[aqiIndex-1])
    setAqiColor(aqiColor[aqiIndex-1])
}

export default apiFetch;