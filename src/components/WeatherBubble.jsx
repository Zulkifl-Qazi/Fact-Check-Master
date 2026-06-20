import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSun, FaCloud, FaCloudRain, FaCloudShowersHeavy, 
  FaSnowflake, FaBolt, FaSmog, FaMoon, FaTint, 
  FaWind, FaThermometerHalf, FaLocationArrow, FaSyncAlt
} from 'react-icons/fa';

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const getWeatherDetails = (code, isDay) => {
  const isNight = isDay === 0;
  
  if (code === 0) {
    return {
      text: 'Clear Sky',
      icon: isNight ? <FaMoon className="text-indigo-300" /> : <FaSun className="text-amber-500 animate-spin-slow" />
    };
  }
  if ([1, 2, 3].includes(code)) {
    return {
      text: code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast',
      icon: <FaCloud className="text-slate-400" />
    };
  }
  if ([45, 48].includes(code)) {
    return {
      text: 'Foggy',
      icon: <FaSmog className="text-slate-500" />
    };
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      text: 'Drizzle',
      icon: <FaCloudRain className="text-blue-300" />
    };
  }
  if ([61, 63, 65, 66, 67].includes(code)) {
    return {
      text: 'Rain',
      icon: <FaCloudRain className="text-blue-400" />
    };
  }
  if ([71, 73, 75, 77].includes(code)) {
    return {
      text: 'Snowfall',
      icon: <FaSnowflake className="text-sky-300 animate-pulse" />
    };
  }
  if ([80, 81, 82, 85, 86].includes(code)) {
    return {
      text: 'Rain Showers',
      icon: <FaCloudShowersHeavy className="text-blue-500" />
    };
  }
  if ([95, 96, 99].includes(code)) {
    return {
      text: 'Thunderstorm',
      icon: <FaBolt className="text-yellow-400 animate-bounce" />
    };
  }
  
  return {
    text: 'Clear Sky',
    icon: <FaSun className="text-amber-500" />
  };
};

const WeatherBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Islamabad');
  const [weather, setWeather] = useState(null);
  const [coords, setCoords] = useState({ latitude: 33.6844, longitude: 73.0479 }); // Default: Islamabad
  const panelRef = useRef(null);
  const bubbleRef = useRef(null);

  // Detect and fetch weather
  const getWeatherData = async (lat, lon, name) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m`
      );
      
      if (!res.ok) throw new Error('Failed to retrieve weather data');
      
      const data = await res.json();
      setWeather(data.current);
      if (name) setLocationName(name);
    } catch (err) {
      console.error(err);
      setError('Weather currently unavailable');
    } finally {
      setLoading(false);
    }
  };

  // Run location chain
  const initializeLocation = async () => {
    // 1. IP Geolocation (Sets initial city name and approximate coordinates)
    let ipLat = 33.6844;
    let ipLon = 73.0479;
    let ipCity = 'Islamabad';

    try {
      const ipRes = await fetch('https://ipapi.co/json/');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.latitude && ipData.longitude) {
          ipLat = ipData.latitude;
          ipLon = ipData.longitude;
          ipCity = ipData.city || 'Local Area';
          setCoords({ latitude: ipLat, longitude: ipLon });
          setLocationName(ipCity);
        }
      }
    } catch (e) {
      console.warn('IP Geolocation failed, using default coordinates.', e);
    }

    // 2. Query Browser Geolocation (For high precision)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const browserLat = position.coords.latitude;
          const browserLon = position.coords.longitude;
          setCoords({ latitude: browserLat, longitude: browserLon });
          // Refresh weather using precise location
          getWeatherData(browserLat, browserLon, ipCity);
        },
        () => {
          // If browser location is blocked/fails, fetch using IP location coordinates
          getWeatherData(ipLat, ipLon, ipCity);
        },
        { timeout: 5000 }
      );
    } else {
      getWeatherData(ipLat, ipLon, ipCity);
    }
  };

  useEffect(() => {
    initializeLocation();
  }, []);

  // Handle clicking outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target) &&
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (error && !weather) return null; // Hide widget silently on absolute fail

  const weatherDetails = weather ? getWeatherDetails(weather.weather_code, weather.is_day) : { text: 'Clear', icon: <FaSun /> };

  return (
    <div className="fixed bottom-6 right-6 z-[60] font-sans">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
      `}</style>

      {/* Floating Detailed Panel */}
      {isOpen && weather && (
        <div 
          ref={panelRef}
          className="absolute bottom-16 right-0 w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-2xl transition-all duration-300 transform scale-100 origin-bottom-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3 mb-4">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                <FaLocationArrow className="text-blue-500 text-xs flex-shrink-0" />
                {locationName}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Local Weather Conditions</p>
            </div>
            <button 
              onClick={() => getWeatherData(coords.latitude, coords.longitude, locationName)}
              disabled={loading}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-40"
              title="Refresh weather"
            >
              <FaSyncAlt className={`text-xs ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Condition Display */}
          <div className="flex items-center gap-4">
            <div className="text-4xl">{weatherDetails.icon}</div>
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {Math.round(weather.temperature_2m)}
                </span>
                <span className="text-sm font-bold text-blue-500 dark:text-blue-400 ml-0.5">°C</span>
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                {weatherDetails.text}
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px]">
            {/* Apparent Temp */}
            <div className="flex items-center gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
              <FaThermometerHalf className="text-red-400 text-sm" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(weather.apparent_temperature)}°C
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">Feels Like</p>
              </div>
            </div>

            {/* Humidity */}
            <div className="flex items-center gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
              <FaTint className="text-blue-400 text-sm" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {weather.relative_humidity_2m}%
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">Humidity</p>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl col-span-2">
              <FaWind className="text-teal-400 text-sm" />
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {weather.wind_speed_10m} km/h
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">Wind Velocity</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bubble */}
      <button
        ref={bubbleRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 text-slate-700 dark:text-slate-200 group hover:border-blue-500 dark:hover:border-blue-500"
      >
        {loading && !weather ? (
          <div className="w-4 h-4 rounded-full border border-blue-500 border-t-transparent animate-spin" />
        ) : (
          <>
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">
              {weatherDetails.icon}
            </span>
            <span className="text-xs font-black tracking-wide">
              {weather ? `${Math.round(weather.temperature_2m)}°C` : 'Weather'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default WeatherBubble;
