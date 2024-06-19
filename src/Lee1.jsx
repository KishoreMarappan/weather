import React, { useState, useEffect, useRef } from 'react';
import './Weather.css';
import { FaSearch } from 'react-icons/fa';

export default function Lee1({ onCitySearch }) {
    const [cities, setCities] = useState([]);
    const [showCityResults, setShowCityResults] = useState(false);
    const cityResultsRef = useRef(null);

    useEffect(() => {
        async function fetchCities() {
            try {
                const res = await fetch('https://countriesnow.space/api/v0.1/countries');
                const data = await res.json();

                const allCities = data.data.flatMap(country => country.cities);
                setCities(allCities);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        }
        fetchCities();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (cityResultsRef.current && !cityResultsRef.current.contains(event.target)) {
                // Clicked outside the city results, so close them
                setShowCityResults(false);
            }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function handleSearch(event) {
        const searchText = event.target.value.toLowerCase();
        const filteredCities = cities.filter(city => city.toLowerCase().includes(searchText));
        setShowCityResults(searchText.length > 0);
        displayCities(filteredCities);
    }

    function handleCityItemClick(city) {
        document.getElementById("citysearch").value = city;
        setShowCityResults(false); 
        onCitySearch(city); 
    }

    function displayCities(filteredCities) {
        const cityResults = document.getElementById("cityResults");
        cityResults.innerHTML = "";
        filteredCities.forEach(city => {
            const cityItem = document.createElement("li");
            cityItem.textContent = city;
            cityItem.onclick = () => handleCityItemClick(city);
            cityResults.appendChild(cityItem);
        });
    }

    function handleSearchButtonClick() {
        const searchText = document.getElementById("citysearch").value.toLowerCase();
        const filteredCities = cities.filter(city => city.toLowerCase().includes(searchText));
        setShowCityResults(searchText.length > 0);
        displayCities(filteredCities);
        onCitySearch(searchText); 
    }

    return (
        <div>
            <div id='demo-searchbyy'>
                <div id="citySearch">
                    <input id="citysearch" type="search" placeholder='Search City..' onChange={handleSearch} />
                    <button id="searchButton" onClick={handleSearchButtonClick}><FaSearch /></button>
                    {showCityResults && (
                        <div id="cityResults" ref={cityResultsRef}></div>
                    )}
                </div>
            </div>
        </div>
    );
}
