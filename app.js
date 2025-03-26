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

// State
let currentUnit = 'celsius';
let currentData = null;

// Initialize
fetchWeather('London');

// Event Listeners
searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim()) {
        fetchWeather(cityInput.value.trim());
    }
});

cityInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && cityInput.value.trim()) {
        fetchWeather(cityInput.value.trim());
    }
});

locationBtn.addEventListener('click', () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, showError);
    } else {
        showError("Geolocation is not supported by your browser");
    }
});

unitToggle.addEventListener('click', toggleUnit);
themeToggle.addEventListener('click', toggleTheme);

// API Functions
async function fetchWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
        if(!response.ok) throw new Error('City not found');
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
    updateBackground(data.weather[0].main);
}

function updateWeatherIcon(condition) {
    const iconMap = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Thunderstorm': 'fa-bolt',
        'Snow': 'fa-snowflake',
        'Mist': 'fa-smog',
        'Drizzle': 'fa-cloud-rain',
        'Fog': 'fa-smog'
    };
    
    weatherIcon.innerHTML = `<i class="fas ${iconMap[condition] || 'fa-cloud'}"></i>`;
}

function updateBackground(condition) {
    document.body.className = '';
    document.body.classList.add(condition.toLowerCase());
}

function toggleUnit() {
    if(currentData) {
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
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    themeToggle.querySelector('i').classList.toggle('fa-sun');
    themeToggle.querySelector('i').classList.toggle('fa-moon');
}

function showError(message) {
    alert(`Error: ${message}`);
}
