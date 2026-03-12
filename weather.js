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

loadSouthBendWeather();
setInterval(loadSouthBendWeather, 600000);
setActiveNavbarLink(); 
