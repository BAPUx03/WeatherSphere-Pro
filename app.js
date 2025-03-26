// API Configuration
const API_KEY = "fb753a190d650defd15002f9586f15e3";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const unitToggle = document.getElementById('unitToggle');
const weatherDesc = document.getElementById('weatherDesc');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const themeToggle = document.getElementById('themeToggle');
const datetimeBtn = document.getElementById('datetimeBtn');
const datetimePage = document.getElementById('datetimePage');
const liveTime = document.getElementById('liveTime');
const liveDate = document.getElementById('liveDate');
const closeDatetime = document.getElementById('closeDatetime');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.getElementById('errorClose');

// State
let currentUnit = 'celsius';
let currentData = null;
let timeInterval;

// Initialize
fetchWeather('London');
startClock();

// Event Listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => e.key === 'Enter' && searchWeather());
locationBtn.addEventListener('click', getLocationWeather);
unitToggle.addEventListener('click', toggleUnit);
themeToggle.addEventListener('click', toggleTheme);
datetimeBtn.addEventListener('click', showDatetimePage);
closeDatetime.addEventListener('click', hideDatetimePage);
errorClose.addEventListener('click', () => errorModal.style.display = 'none');

// Functions
function searchWeather() {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
            (error) => showLocationError(error)
        );
    } else {
        showError("Geolocation is not supported by your browser");
    }
}

function showLocationError(error) {
    let message = "Could not get your current location";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Location access was denied. Please enable permissions.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message = "The request to get location timed out.";
            break;
    }
    showError(message);
}

function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'flex';
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        currentData = data;
        updateUI(data);
    } catch(error) {
        showError(error.message);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        currentData = data;
        updateUI(data);
    } catch(error) {
        showError(error.message);
    }
}

function updateUI(data) {
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    updateWeatherIcon(data.weather[0].main);
    updateBackground(data.weather[0].main.toLowerCase());
}

function updateWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Thunderstorm': 'fa-bolt',
        'Snow': 'fa-snowflake',
        'Mist': 'fa-smog',
        'Drizzle': 'fa-cloud-rain'
    };
    weatherIcon.innerHTML = `<i class="fas ${iconMap[condition] || 'fa-cloud'}"></i>`;
}

function updateBackground(condition) {
    document.body.className = condition + '-bg';
}

function toggleUnit() {
    if (!currentData) return;
    
    currentUnit = currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    unitToggle.textContent = currentUnit === 'celsius' ? '°C' : '°F';
    
    const temp = currentData.main.temp;
    const feelsTemp = currentData.main.feels_like;
    
    temperature.textContent = Math.round(
        currentUnit === 'celsius' ? temp : (temp * 9/5) + 32
    );
    
    feelsLike.textContent = `${Math.round(
        currentUnit === 'celsius' ? feelsTemp : (feelsTemp * 9/5) + 32
    )}°`;
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    themeToggle.querySelector('i').classList.toggle('fa-sun');
    themeToggle.querySelector('i').classList.toggle('fa-moon');
}

function showDatetimePage() {
    datetimePage.style.display = 'flex';
    document.getElementById('weatherPage').style.display = 'none';
}

function hideDatetimePage() {
    datetimePage.style.display = 'none';
    document.getElementById('weatherPage').style.display = 'block';
}

function startClock() {
    updateClock();
    timeInterval = setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    liveTime.textContent = now.toLocaleTimeString();
    liveDate.textContent = now.toLocaleDateString('en-US', options);
}
