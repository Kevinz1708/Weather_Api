// src/components/CitySearch.js
import React, { useState } from 'react';
import axios from 'axios';

const CitySearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const [weather, setWeather] = useState(null);

    // Search for cities using GeoDB Cities API
    const searchCities = async () => {
        if (!query) return;

        setLoading(true);

        try {
            const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
                params: { namePrefix: query },
                headers: {
                    'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your RapidAPI Key
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            });
            setResults(response.data.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch weather using Open-Meteo API
    const fetchWeather = async (lat, lon) => {
        try {
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current_weather: true,
                }
            });
            setWeather(response.data.current_weather); // Get the current weather data
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    // Handle when a city is selected
    const handleCitySelect = (city) => {
        setSelectedCity(city);
        fetchWeather(city.latitude, city.longitude); // Fetch weather for the selected city
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Search for a City or Country</h1>

            <input
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-4"
                placeholder="Enter a city or country name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={searchCities}
            >
                {loading ? 'Loading...' : 'Search'}
            </button>

            <div className="mt-4">
                {results.length > 0 ? (
                    <ul className="list-disc">
                        {results.map((city) => (
                            <li key={city.id} className="cursor-pointer" onClick={() => handleCitySelect(city)}>
                                {city.city}, {city.country}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>

            {/* Display the selected city and its weather */}
            {selectedCity && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">
                        Weather in {selectedCity.city}, {selectedCity.country}
                    </h2>
                    {weather ? (
                        <p>Current Temperature: {weather.temperature}°C</p>
                    ) : (
                        <p>Loading weather data...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CitySearch;
