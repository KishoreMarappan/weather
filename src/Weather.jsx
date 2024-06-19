import React, { useState, useEffect } from 'react';
import './Weather.css';
import { FaSearch } from 'react-icons/fa';
import Lee1 from './Lee1';
import Swal from 'sweetalert2';
Swal

function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [currCity, setCurrCity] = useState('Chennai');
    const [citySearchQuery, setCitySearchQuery] = useState('');

    useEffect(() => {
        updateTime();
        const timerID = setInterval(updateTime, 1000);
        const chennaiLatitude = 13.0827;
        const chennaiLongitude = 80.2707;
        getWeatherData(chennaiLatitude, chennaiLongitude);

        return () => {
            clearInterval(timerID);
        };
    }, []);

    useEffect(() => {
        if (citySearchQuery) {
            getWeatherDatabyCity(citySearchQuery);
        }
    }, [citySearchQuery]);

    function updateTime() {
        const date = new Date();
        const formattedTime = date.toLocaleTimeString();
        setCurrentTime(formattedTime);

        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate({
            weekday: formattedDate.split(',')[0].trim(),
            date: formattedDate.split(' ')[2].split('')[0] + formattedDate.split(' ')[2].split('')[1],
            month: formattedDate.split(' ')[1].trim(),
            year: formattedDate.split(',')[2].trim()
        });
    }

    function updateWeatherDOM(data) {
        document.getElementById("tempratures").textContent = "Temperature  " + data.data.values.temperature + " °C";
        document.getElementById("curr-temp").textContent =  data.data.values.temperature + " °C";
        document.getElementById("humidity").textContent = "Humidity  " + data.data.values.humidity + " %";
        document.getElementById("visibility").textContent = "Visibility  " + data.data.values.visibility + " mi";
        document.getElementById("wind").textContent = "Wind Speed  " + data.data.values.windSpeed + " Km/h";
    }

    async function getWeatherData(latitude, longitude) {
        try {
            const options = { method: 'GET', headers: { accept: 'application/json' } };
            const response = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&apikey=DxV3LDERbVYDmj6cFoVgviDjLawKHkD3`, options);
            const data = await response.json();
            setWeatherData(data);
            updateWeatherDOM(data);
            updateCurrCity(latitude, longitude);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    async function getWeatherDatabyCity(cityname) {
        try {
            const options = { method: 'GET', headers: { accept: 'application/json' } };
            const response = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${cityname}&apikey=cAznLAx50fEV5ESWqw5eDtK1HXjm0dzn`, options);
            const data = await response.json();
            setWeatherData(data);
            updateWeatherDOM(data);
            setCurrCity(cityname);
        } catch (error) {
            Swal.fire("Enter valid city name!");
            console.error("Error fetching weather data:", error);
        }
    }

    async function updateCurrCity(latitude, longitude) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            if (data.address) {
                setCurrCity(data.address.city || data.address.town || data.address.village || data.address.county);
            } else {
                setCurrCity('Unknown');
            }
        } catch (error) {
            console.error("Error updating current city:", error);
            setCurrCity('Unknown');
        }
    }

    function handleGetWeather() {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherData(latitude, longitude);
        });
    }

    function handleCitySearch(query) {
        setCitySearchQuery(query);
    }

    return (
        <div>
            <div className='contain'>
                <div className='left'>
                    <div id="time">
                        <h2 id="timer">{currentTime}</h2>
                        <h3 id="dater">
                            <span>{currentDate.weekday}</span>
                            <span>, &nbsp;</span>
                            <span>{currentDate.date}</span>
                            <span>&nbsp;</span>
                            <span>{currentDate.month}</span>
                            <span>&nbsp;</span>
                            <span>{currentDate.year}</span>
                        </h3>
                    </div>
                    <div id='disp-temp'>
                        <p id='curr-temp'>34.1</p>
                        <p id='curr_city'>In {currCity}</p>
                    </div>
                </div>
                <div id="weatherInfo">
                    <img src="./src/WeatherIcons.gif" id='giff' alt="loading gif" />
                    <h1>Get Weather For</h1>
                    <div id='searchbyy'>
                        <button id="btn" onClick={handleGetWeather}>My Location</button>
                        <Lee1 onCitySearch={handleCitySearch} /> 
                    </div>
                    
                    <div id="values-display">
                        <p id="tempratures">Temperature </p>
                        <hr />
                        <p id="humidity">Humidity </p>
                        <hr />
                        <p id="visibility">Visibility</p>
                        <hr />
                        <p id="wind">Wind Speed</p>
                        <hr />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Weather;
