async function loadSouthBendWeather() {
  try {
    const target = document.getElementById("weatherTemp");
    if (!target) return;

    const point = await fetch("https://api.weather.gov/points/41.6764,-86.2520");
    const pointData = await point.json();

    const forecast = await fetch(pointData.properties.forecast);
    const forecastData = await forecast.json();

    const current = forecastData.properties.periods?.[0];
    if (!current || typeof current.temperature !== "number") {
      target.textContent = "--°F";
      return;
    }

    target.textContent = `${current.temperature}°F`;
  } catch (e) {
    console.error("Failed to get South Bend weather:", e);
    const target = document.getElementById("weatherTemp");
    if (target) target.textContent = "Weather unavailable";
  }
}

loadSouthBendWeather();
setInterval(loadSouthBendWeather, 600000); // every 10 minutes
