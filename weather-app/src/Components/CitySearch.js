// src/components/CitySearch.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CitySearch = () => {
    const [ip, setIp] = useState('145.120.183.38'); // You can replace this with a dynamic IP fetch if needed
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch geolocation using IP-API
    const fetchLocationFromIP = async () => {
        try {
            const response = await axios.get(`http://ip-api.com/json/${ip}`);
            setLocation(response.data);
        } catch (error) {
            console.error('Error fetching location from IP:', error);
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

    useEffect(() => {
        // Fetch location based on IP address
        fetchLocationFromIP();
    }, []);

    useEffect(() => {
        if (location) {
            // Fetch weather once the location is available
            fetchWeather(location.lat, location.lon);
        }
    }, [location]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Weather based on IP Address</h1>

            {location && (
                <div>
                    <h2 className="text-xl font-semibold">
                        Location: {location.city}, {location.country}
                    </h2>
                    <p>Latitude: {location.lat}</p>
                    <p>Longitude: {location.lon}</p>
                </div>
            )}

            {weather ? (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Current Weather</h2>
                    <p>Temperature: {weather.temperature}°C</p>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
};

export default CitySearch;
