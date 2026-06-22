// src/components/WeatherBubble.jsx
import React, { useState, useEffect, useRef } from 'react';

// Custom SVG Weather Icons matching Google Weather aesthetics
const WavySun = ({ className = "w-10 h-10" }) => {
  const path = React.useMemo(() => {
    let p = "";
    const cx = 50;
    const cy = 50;
    const r = 32;
    const amplitude = 4;
    const waves = 12;
    for (let i = 0; i <= 360; i += 2) {
      const rad = (i * Math.PI) / 180;
      const currentR = r + amplitude * Math.sin(waves * rad);
      const x = cx + currentR * Math.cos(rad);
      const y = cy + currentR * Math.sin(rad);
      if (i === 0) {
        p += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
      } else {
        p += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
    }
    p += " Z";
    return p;
  }, []);

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF29A" />
          <stop offset="30%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path 
        d={path} 
        stroke="url(#sunGrad)" 
        strokeWidth="3.5" 
        fill="url(#sunGrad)" 
        fillOpacity="0.15"
      />
      <circle cx="50" cy="50" r="22" fill="url(#sunGrad)" />
    </svg>
  );
};

const CloudySun = ({ className = "w-10 h-10", isDay = true }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    {isDay && (
      <g transform="translate(15, 10) scale(0.7)">
        <circle cx="50" cy="50" r="22" fill="url(#sunGrad)" />
      </g>
    )}
    <path 
      d="M25 65 
         C15 65, 10 55, 18 45 
         C18 30, 38 20, 48 30 
         C58 20, 78 25, 75 40 
         C85 40, 89 50, 82 60 
         C77 65, 72 65, 68 65 Z" 
      fill="url(#cloudGrad)" 
      stroke="#E2E8F0"
      strokeWidth="2"
    />
  </svg>
);

const OvercastCloud = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="overcastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    <path 
      d="M25 65 
         C15 65, 10 55, 18 45 
         C18 30, 38 20, 48 30 
         C58 20, 78 25, 75 40 
         C85 40, 89 50, 82 60 
         C77 65, 72 65, 68 65 Z" 
      fill="url(#overcastGrad)" 
      stroke="#CBD5E1"
      strokeWidth="2"
    />
  </svg>
);

const RainCloud = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>
    <path 
      d="M25 60 
         C15 60, 10 50, 18 40 
         C18 25, 38 15, 48 25 
         C58 15, 78 20, 75 35 
         C85 35, 89 45, 82 55 
         C77 60, 72 60, 68 60 Z" 
      fill="url(#rainCloudGrad)" 
      stroke="#94A3B8"
      strokeWidth="2"
    />
    <path d="M35 70 L30 82" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 72 L45 84" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
    <path d="M65 70 L60 82" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ThunderCloud = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="thunderCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    <path 
      d="M25 60 
         C15 60, 10 50, 18 40 
         C18 25, 38 15, 48 25 
         C58 15, 78 20, 75 35 
         C85 35, 89 45, 82 55 
         C77 60, 72 60, 68 60 Z" 
      fill="url(#thunderCloudGrad)" 
      stroke="#334155"
      strokeWidth="2"
    />
    <path d="M50 52 L42 68 H52 L44 84" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="#FBBF24" />
  </svg>
);

const SnowCloud = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="snowCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    <path 
      d="M25 60 
         C15 60, 10 50, 18 40 
         C18 25, 38 15, 48 25 
         C58 15, 78 20, 75 35 
         C85 35, 89 45, 82 55 
         C77 60, 72 60, 68 60 Z" 
      fill="url(#snowCloudGrad)" 
      stroke="#CBD5E1"
      strokeWidth="2"
    />
    <circle cx="32" cy="72" r="3" fill="#38BDF8" />
    <circle cx="50" cy="75" r="3" fill="#38BDF8" />
    <circle cx="68" cy="72" r="3" fill="#38BDF8" />
  </svg>
);

const FoggyCloud = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fogCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    <path 
      d="M25 55 
         C15 55, 10 45, 18 35 
         C18 20, 38 10, 48 20 
         C58 10, 78 15, 75 30 
         C85 30, 89 40, 82 50 
         C77 55, 72 55, 68 55 Z" 
      fill="url(#fogCloudGrad)" 
      stroke="#CBD5E1"
      strokeWidth="2"
    />
    <line x1="20" y1="65" x2="80" y2="65" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    <line x1="25" y1="73" x2="75" y2="73" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const getWeatherDetails = (code, isDay) => {
  if (code === 0) {
    return {
      text: 'Clear Sky',
      icon: <WavySun className="w-10 h-10 md:w-12 md:h-12" />
    };
  }
  if ([1, 2, 3].includes(code)) {
    return {
      text: code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast',
      icon: code === 3 ? <OvercastCloud className="w-10 h-10 md:w-12 md:h-12" /> : <CloudySun className="w-10 h-10 md:w-12 md:h-12" isDay={isDay !== 0} />
    };
  }
  if ([45, 48].includes(code)) {
    return {
      text: 'Foggy',
      icon: <FoggyCloud className="w-10 h-10 md:w-12 md:h-12" />
    };
  }
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 85, 86].includes(code)) {
    return {
      text: 'Rain',
      icon: <RainCloud className="w-10 h-10 md:w-12 md:h-12" />
    };
  }
  if ([71, 73, 75, 77].includes(code)) {
    return {
      text: 'Snowfall',
      icon: <SnowCloud className="w-10 h-10 md:w-12 md:h-12" />
    };
  }
  if ([95, 96, 99].includes(code)) {
    return {
      text: 'Thunderstorm',
      icon: <ThunderCloud className="w-10 h-10 md:w-12 md:h-12" />
    };
  }
  return {
    text: 'Clear Sky',
    icon: <WavySun className="w-10 h-10 md:w-12 md:h-12" />
  };
};

const TargetIcon = () => (
  <svg className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
  </svg>
);

const WeatherBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Rawalpindi');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [coords, setCoords] = useState({ latitude: 33.6844, longitude: 73.0479 }); // Default: Rawalpindi
  const containerRef = useRef(null);

  // Fetch weather data
  const getWeatherData = async (lat, lon, name) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      if (!res.ok) throw new Error('Failed to retrieve weather data');
      
      const data = await res.json();
      setWeather(data.current);
      
      if (data.daily && data.daily.time) {
        const list = [];
        // Map next 4 days
        for (let i = 1; i <= 4; i++) {
          if (data.daily.time[i]) {
            const dateStr = data.daily.time[i];
            const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
            list.push({
              day: dayName,
              code: data.daily.weather_code[i],
              maxTemp: Math.round(data.daily.temperature_2m_max[i]),
              minTemp: Math.round(data.daily.temperature_2m_min[i])
            });
          }
        }
        setForecast(list);
      }
      
      if (name) setLocationName(name);
    } catch (err) {
      console.error(err);
      setError('Weather currently unavailable');
    } finally {
      setLoading(false);
    }
  };

  // Run location detection chain
  const initializeLocation = async () => {
    let ipLat = 33.6844;
    let ipLon = 73.0479;
    let ipCity = 'Rawalpindi';

    try {
      const ipRes = await fetch('https://ipwho.is/');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.success && ipData.latitude && ipData.longitude) {
          ipLat = ipData.latitude;
          ipLon = ipData.longitude;
          ipCity = ipData.city || ipData.region || 'Local Area';
          setCoords({ latitude: ipLat, longitude: ipLon });
          setLocationName(ipCity);
        }
      }
    } catch (e) {
      console.warn('IP Geolocation failed, using default coordinates.', e);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const browserLat = position.coords.latitude;
          const browserLon = position.coords.longitude;
          setCoords({ latitude: browserLat, longitude: browserLon });
          getWeatherData(browserLat, browserLon, ipCity);
        },
        () => {
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

  // Handle clicking outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (error && !weather) return null;

  const weatherDetails = weather 
    ? getWeatherDetails(weather.weather_code, weather.is_day) 
    : { text: 'Clear Sky', icon: <WavySun /> };

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-50 font-sans transition-all duration-300"
    >
      {/* 1. EXTENDED VIEW (Image 2) */}
      {isOpen && weather && (
        <div 
          className="flex items-center gap-4 px-4 py-2 h-[76px] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 select-none animate-in fade-in zoom-in-95 duration-200"
        >
          {/* 4-Day Forecast list */}
          <div className="flex items-center gap-5 mr-1">
            {forecast.map((f, i) => {
              const dayDetails = getWeatherDetails(f.code, 1);
              return (
                <div key={i} className="flex flex-col items-center justify-center text-center w-10">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                    {f.day}
                  </span>
                  <div className="w-8 h-8 flex items-center justify-center">
                    {React.cloneElement(dayDetails.icon, { className: "w-7 h-7" })}
                  </div>
                  <div className="text-[11px] mt-0.5 flex gap-1 justify-center">
                    <span className="font-bold text-slate-800 dark:text-white">{f.maxTemp}°</span>
                    <span className="text-slate-400 dark:text-slate-500">{f.minTemp}°</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical Divider */}
          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700" />

          {/* Right Collapse Arrow Chevron */}
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full flex items-center justify-center border-none bg-transparent"
            aria-label="Collapse weather"
          >
            <svg className="w-4 h-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Current Weather on the right */}
          <div className="flex items-center gap-3 pr-1">
            <div className="flex-shrink-0">
              {React.cloneElement(weatherDetails.icon, { className: "w-11 h-11" })}
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>Your local weather</span>
                <TargetIcon />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white leading-none mt-0.5">
                {Math.round(weather.temperature_2m)}°C
              </span>
              <a 
                href="https://www.google.com/search?q=weather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-blue-500 dark:text-blue-400 font-bold hover:underline mt-0.5"
                style={{ textDecoration: 'none' }}
              >
                Google Weather
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. UNEXTENDED VIEW (Image 1) */}
      {!isOpen && (
        <div 
          onClick={() => {
            if (weather) setIsOpen(true);
          }}
          className="flex items-center gap-3 px-3 py-1.5 h-[58px] bg-slate-900 text-white shadow-xl rounded-2xl border border-slate-800 hover:bg-slate-800 transition-colors duration-200 cursor-pointer select-none"
        >
          {/* Left Arrow Chevron */}
          <div className="flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>

          {/* Main Weather Icon */}
          <div className="flex-shrink-0">
            {loading && !weather ? (
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            ) : (
              weatherDetails.icon
            )}
          </div>

          {/* Info Block */}
          {!loading && weather && (
            <div className="flex flex-col justify-center leading-tight pr-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                <span>{locationName}</span>
                <TargetIcon />
              </div>
              <span className="text-xl font-bold text-white leading-none mt-0.5">
                {Math.round(weather.temperature_2m)}°C
              </span>
              <a 
                href="https://www.google.com/search?q=weather"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[9px] text-blue-400 font-bold hover:underline mt-0.5"
                style={{ textDecoration: 'none' }}
              >
                Google Weather
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherBubble;
