async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function fetchWeatherGov() {
  const noCache = {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  };

  const pointsUrl = `https://api.weather.gov/points/41.6764,-86.2520?t=${Date.now()}`;
  const pointData = await fetchJSON(pointsUrl, noCache);

  const forecastUrl = `${pointData.properties.forecast}?t=${Date.now()}`;
  const forecastData = await fetchJSON(forecastUrl, noCache);

  const current = forecastData.properties.periods?.[0];
  if (!current || typeof current.temperature !== "number") {
    throw new Error("No temperature in weather.gov response");
  }

  return current.temperature;
}

async function fetchOpenMeteo() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=41.6764&longitude=-86.2520&current_weather=true&temperature_unit=fahrenheit&timeformat=unixtime&t=${Date.now()}`;
  const data = await fetchJSON(url, { cache: "no-store" });
  const temp = data.current_weather?.temperature;
  if (typeof temp !== "number") {
    throw new Error("No temperature in open-meteo response");
  }
  return temp;
}

async function loadSouthBendWeather() {
  const target = document.getElementById("weatherTemp");
  if (!target) return;

  target.textContent = "...";

  try {
    let temperature;
    try {
      temperature = await fetchWeatherGov();
    } catch (primaryError) {
      console.warn("weather.gov failed, falling back to open-meteo", primaryError);
      temperature = await fetchOpenMeteo();
    }

    target.textContent = `${temperature}°F`;
    target.classList.add("weather-updated");
    setTimeout(() => target.classList.remove("weather-updated"), 750);
  } catch (e) {
    console.error("Failed to get South Bend weather:", e);
    target.textContent = "Weather unavailable";
  }
}

function setActiveNavbarLink() {
  const pathName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  if (pathName === '' || pathName === 'index.html') {
    const brandLink = document.querySelector('.brand-link, .website-name');
    if (brandLink) brandLink.classList.add('active');
  } else {
    const brandLink = document.querySelector('.brand-link.active, .website-name.active');
    if (brandLink) brandLink.classList.remove('active');
  }

  document.querySelectorAll('.navbar a').forEach(link => {
    const linkPath = (link.getAttribute('href')?.split('/').pop() || '').toLowerCase();
    if (linkPath === pathName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initWeatherSite() {
  setActiveNavbarLink();
  loadSouthBendWeather();

  // Refresh every 10 minutes
  setInterval(loadSouthBendWeather, 600000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWeatherSite);
} else {
  initWeatherSite();
} 
