import { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

export type District = {
  name: string;
  nameTa?: string;
  lat: number;
  lon: number;
};

export type Weather = {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  rain: number;
  wind_speed_10m: number;
  weather_code: number;
  time: string;
};

export type DistrictWeather = District & Weather;

export const DISTRICTS: District[] = [
  { name: "Ariyalur", nameTa: "அரியலூர்", lat: 11.1401, lon: 79.0786 },
  { name: "Chengalpattu", nameTa: "செங்கல்பட்டு", lat: 12.6819, lon: 79.9888 },
  { name: "Chennai", nameTa: "சென்னை", lat: 13.0827, lon: 80.2707 },
  { name: "Coimbatore", nameTa: "கோயம்புத்தூர்", lat: 11.0168, lon: 76.9558 },
  { name: "Cuddalore", nameTa: "கடலூர்", lat: 11.748, lon: 79.7714 },
  { name: "Dharmapuri", nameTa: "தருமபுரி", lat: 12.1277, lon: 78.1579 },
  { name: "Dindigul", nameTa: "திண்டுக்கல்", lat: 10.3673, lon: 77.9803 },
  { name: "Erode", nameTa: "ஈரோடு", lat: 11.341, lon: 77.7172 },
  { name: "Kallakurichi", nameTa: "கள்ளக்குறிச்சி", lat: 11.7401, lon: 78.9597 },
  { name: "Kancheepuram", nameTa: "காஞ்சிபுரம்", lat: 12.8185, lon: 79.6947 },
  { name: "Kanniyakumari", nameTa: "கன்னியாகுமரி", lat: 8.0883, lon: 77.5385 },
  { name: "Karur", nameTa: "கரூர்", lat: 10.9601, lon: 78.0766 },
  { name: "Krishnagiri", nameTa: "கிருஷ்ணகிரி", lat: 12.5186, lon: 78.2137 },
  { name: "Madurai", nameTa: "மதுரை", lat: 9.9252, lon: 78.1198 },
  { name: "Mayiladuthurai", nameTa: "மயிலாடுதுறை", lat: 11.1018, lon: 79.6526 },
  { name: "Nagapattinam", nameTa: "நாகப்பட்டினம்", lat: 10.7672, lon: 79.8449 },
  { name: "Namakkal", nameTa: "நாமக்கல்", lat: 11.2189, lon: 78.1677 },
  { name: "Nilgiris", nameTa: "நீலகிரி", lat: 11.4102, lon: 76.695 },
  { name: "Perambalur", nameTa: "பெரம்பலூர்", lat: 11.232, lon: 78.88 },
  { name: "Pudukkottai", nameTa: "புதுக்கோட்டை", lat: 10.3797, lon: 78.8208 },
  { name: "Ramanathapuram", nameTa: "ராமநாதபுரம்", lat: 9.3639, lon: 78.8395 },
  { name: "Ranipet", nameTa: "இராணிப்பேட்டை", lat: 12.9249, lon: 79.3333 },
  { name: "Salem", nameTa: "சேலம்", lat: 11.6643, lon: 78.146 },
  { name: "Sivaganga", nameTa: "சிவகங்கை", lat: 9.8433, lon: 78.4809 },
  { name: "Tenkasi", nameTa: "தென்காசி", lat: 8.959, lon: 77.3152 },
  { name: "Thanjavur", nameTa: "தஞ்சாவூர்", lat: 10.787, lon: 79.1378 },
  { name: "Theni", nameTa: "தேனி", lat: 10.0104, lon: 77.4768 },
  { name: "Thoothukudi", nameTa: "தூத்துக்குடி", lat: 8.7642, lon: 78.1348 },
  { name: "Tiruchirappalli", nameTa: "திருச்சிராப்பள்ளி", lat: 10.7905, lon: 78.7047 },
  { name: "Tirunelveli", nameTa: "திருநெல்வேலி", lat: 8.7139, lon: 77.7567 },
  { name: "Tirupathur", nameTa: "திருப்பத்தூர்", lat: 12.4956, lon: 78.5678 },
  { name: "Tiruppur", nameTa: "திருப்பூர்", lat: 11.1085, lon: 77.3411 },
  { name: "Tiruvallur", nameTa: "திருவள்ளூர்", lat: 13.1437, lon: 79.9089 },
  { name: "Tiruvannamalai", nameTa: "திருவண்ணாமலை", lat: 12.2253, lon: 79.0747 },
  { name: "Tiruvarur", nameTa: "திருவாரூர்", lat: 10.7727, lon: 79.6368 },
  { name: "Vellore", nameTa: "வேலூர்", lat: 12.9165, lon: 79.1325 },
  { name: "Viluppuram", nameTa: "விழுப்புரம்", lat: 11.9401, lon: 79.4861 },
  { name: "Virudhunagar", nameTa: "விருதுநகர்", lat: 9.568, lon: 77.9624 },
];

export function description(code: number): string {
  if (code === 0) return "☀️ Clear sky";
  if (code <= 3) return "⛅ Cloudy";
  if (code === 45 || code === 48) return "🌫️ Fog";
  if (code >= 51 && code <= 57) return "🌦️ Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "🌧️ Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return "❄️ Snow";
  if ([95, 96, 99].includes(code)) return "⛈️ Thunderstorm";
  return "🌤️ Variable conditions";
}

export function descriptionTa(code: number): string {
  if (code === 0) return "☀️ தெளிவான வானம்";
  if (code <= 3) return "⛅ மேகமூட்டம்";
  if (code === 45 || code === 48) return "🌫️ பனிமூட்டம்";
  if (code >= 51 && code <= 57) return "🌦️ லேசான தூறல்";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "🌧️ மழை பொழிவு";
  if ([95, 96, 99].includes(code)) return "⛈️ இடியுடன் கூடிய மழை";
  return "🌤️ மாறுபட்ட வானிலை";
}

export async function fetchAllWeather(): Promise<DistrictWeather[]> {
  const params = new URLSearchParams({
    latitude: DISTRICTS.map(d => d.lat).join(","),
    longitude: DISTRICTS.map(d => d.lon).join(","),
    current:
      "temperature_2m,apparent_temperature," +
      "relative_humidity_2m,rain,wind_speed_10m,weather_code",
    timezone: "Asia/Kolkata",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`
  );

  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}`);
  }

  const json: unknown = await response.json();
  const results = Array.isArray(json) ? json : [json];

  if (results.length !== DISTRICTS.length) {
    throw new Error("Unexpected response from weather API");
  }

  return DISTRICTS.map((district, i) => {
    const item = results[i] as { current?: Weather };

    if (!item.current) {
      throw new Error(`Weather missing for ${district.name}`);
    }

    return { ...district, ...item.current };
  });
}

interface TamilNaduWeatherProps {
  onBackToDashboard?: () => void;
  showBackHeader?: boolean;
}

export default function TamilNaduWeather({ onBackToDashboard, showBackHeader }: TamilNaduWeatherProps = {}) {
  const [data, setData] = useState<DistrictWeather[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRainOnly, setFilterRainOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'temp-desc' | 'temp-asc' | 'rain-desc'>('name');
  const [showFeelsLike, setShowFeelsLike] = useState(true);

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      setData(await fetchAllWeather());
    } catch {
      setError("Could not load live weather. Check your internet and retry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const visible = data
    .filter(d => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || 
        d.name.toLowerCase().includes(q) || 
        (d.nameTa && d.nameTa.toLowerCase().includes(q));
      const matchesRain = !filterRainOnly || d.rain > 0 || [61, 63, 65, 80, 81, 82, 95].includes(d.weather_code);
      return matchesSearch && matchesRain;
    })
    .sort((a, b) => {
      if (sortBy === 'temp-desc') return b.temperature_2m - a.temperature_2m;
      if (sortBy === 'temp-asc') return a.temperature_2m - b.temperature_2m;
      if (sortBy === 'rain-desc') return b.rain - a.rain;
      return a.name.localeCompare(b.name);
    });

  // Calculate live stats across all 38 districts
  const hottest = data.length > 0 ? [...data].sort((a, b) => b.temperature_2m - a.temperature_2m)[0] : null;
  const coolest = data.length > 0 ? [...data].sort((a, b) => a.temperature_2m - b.temperature_2m)[0] : null;
  const rainingCount = data.filter(d => d.rain > 0 || [61, 63, 65, 80, 81, 82, 95].includes(d.weather_code)).length;

  // Chart data formatted for recharts line chart
  const chartData = useMemo(() => {
    return visible.map(d => ({
      name: d.name,
      nameTa: d.nameTa || '',
      temp: Math.round(d.temperature_2m * 10) / 10,
      feelsLike: Math.round(d.apparent_temperature * 10) / 10,
      humidity: d.relative_humidity_2m,
      rain: d.rain,
      condition: description(d.weather_code),
    }));
  }, [visible]);

  const { filteredAvgTemp, filteredMinTemp, filteredMaxTemp } = useMemo(() => {
    if (chartData.length === 0) return { filteredAvgTemp: 0, filteredMinTemp: 0, filteredMaxTemp: 0 };
    const temps = chartData.map(d => d.temp);
    const sum = temps.reduce((a, b) => a + b, 0);
    return {
      filteredAvgTemp: Math.round((sum / temps.length) * 10) / 10,
      filteredMinTemp: Math.min(...temps),
      filteredMaxTemp: Math.max(...temps),
    };
  }, [chartData]);

  return (
    <main style={{
      maxWidth: 1240,
      margin: "0 auto",
      padding: "24px 16px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#0f172a",
    }}>
      {/* Top Header */}
      <header style={{
        marginBottom: 24,
        padding: "24px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #0f766e 100%)",
        color: "white",
        boxShadow: "0 10px 25px -5px rgba(6, 78, 59, 0.25)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.15)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#34d399",
                  boxShadow: "0 0 10px #34d399"
                }} />
                Real-Time Batch Telemetry
              </span>
              <span style={{ fontSize: 12, opacity: 0.85 }}>All 38 Districts TN</span>
            </div>

            <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, margin: "6px 0", letterSpacing: "-0.02em" }}>
              🌦️ Tamil Nadu Live Weather
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 15, opacity: 0.9 }}>
              Direct live satellite & meteorological telemetry across all 38 districts of Tamil Nadu
            </p>
            <p style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              Source: Open-Meteo High-Resolution Numerical Weather Models · Asia/Kolkata (IST)
            </p>
          </div>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                background: "rgba(255, 255, 255, 0.12)",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                backdropFilter: "blur(8px)"
              }}
            >
              ← Back to Farm Ops
            </button>
          )}
        </div>

        {/* Live Aggregates Ribbon */}
        {!loading && !error && data.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 20,
            paddingTop: 18,
            borderTop: "1px solid rgba(255, 255, 255, 0.18)"
          }}>
            <div style={{ background: "rgba(0, 0, 0, 0.18)", padding: "10px 14px", borderRadius: 12 }}>
              <span style={{ fontSize: 11, opacity: 0.8, textTransform: "uppercase", display: "block" }}>Hottest District</span>
              <strong style={{ fontSize: 16 }}>{hottest?.name}: {Math.round(hottest?.temperature_2m || 0)}°C</strong>
            </div>
            <div style={{ background: "rgba(0, 0, 0, 0.18)", padding: "10px 14px", borderRadius: 12 }}>
              <span style={{ fontSize: 11, opacity: 0.8, textTransform: "uppercase", display: "block" }}>Coolest District</span>
              <strong style={{ fontSize: 16 }}>{coolest?.name}: {Math.round(coolest?.temperature_2m || 0)}°C</strong>
            </div>
            <div style={{ background: "rgba(0, 0, 0, 0.18)", padding: "10px 14px", borderRadius: 12 }}>
              <span style={{ fontSize: 11, opacity: 0.8, textTransform: "uppercase", display: "block" }}>Rainfall Active</span>
              <strong style={{ fontSize: 16 }}>{rainingCount} of 38 Districts</strong>
            </div>
            <div style={{ background: "rgba(0, 0, 0, 0.18)", padding: "10px 14px", borderRadius: 12 }}>
              <span style={{ fontSize: 11, opacity: 0.8, textTransform: "uppercase", display: "block" }}>Coverage</span>
              <strong style={{ fontSize: 16 }}>100% (38/38 TN)</strong>
            </div>
          </div>
        )}
      </header>

      {/* Filter and Search Bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        background: "#ffffff",
        padding: "14px 18px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)"
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, flex: "1 1 300px" }}>
          <input
            type="search"
            placeholder="Search district (e.g. Salem, Thanjavur, Madurai)..."
            aria-label="Search districts"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: "1 1 240px",
              padding: "10px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              fontSize: 14,
              outline: "none"
            }}
          />

          <button
            onClick={() => setFilterRainOnly(!filterRainOnly)}
            style={{
              padding: "10px 14px",
              border: filterRainOnly ? "1px solid #0284c7" : "1px solid #cbd5e1",
              borderRadius: 10,
              background: filterRainOnly ? "#e0f2fe" : "#ffffff",
              color: filterRainOnly ? "#0369a1" : "#475569",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13
            }}
          >
            🌧️ {filterRainOnly ? "Showing Rain Areas" : "Filter: Raining Now"}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "10px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              background: "#ffffff",
              color: "#334155",
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            <option value="name">Sort: A-Z (Name)</option>
            <option value="temp-desc">Sort: Highest Temp</option>
            <option value="temp-asc">Sort: Lowest Temp</option>
            <option value="rain-desc">Sort: Most Rain</option>
          </select>
        </div>

        <button
          onClick={() => void refresh()}
          disabled={loading}
          style={{
            padding: "10px 20px",
            border: 0,
            borderRadius: 10,
            background: "#059669",
            color: "white",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            boxShadow: "0 2px 6px rgba(5, 150, 105, 0.3)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13
          }}
        >
          {loading ? "Syncing..." : "↻ Refresh Live Telemetry"}
        </button>
      </div>

      {loading && (
        <div style={{
          textAlign: "center",
          padding: "48px 24px",
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          color: "#475569"
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
            🛰️ Synchronizing Live Weather for all 38 Tamil Nadu Districts via Open-Meteo...
          </p>
          <span style={{ fontSize: 13, color: "#94a3b8", marginTop: 6, display: "block" }}>
            Querying real-time satellite models for 38 coordinate pairs
          </span>
        </div>
      )}

      {error && (
        <div role="alert" style={{
          padding: "16px 20px",
          borderRadius: 12,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#b91c1c",
          marginBottom: 20,
          fontWeight: 500
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          fontSize: 13,
          color: "#64748b"
        }}>
          <span>
            Showing <strong>{visible.length}</strong> of <strong>{DISTRICTS.length}</strong> Tamil Nadu districts
          </span>
          <span>
            Updated: {new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(new Date())} IST
          </span>
        </div>
      )}

      {/* Temperature Distribution Line Chart (recharts) across currently filtered districts */}
      {!loading && !error && visible.length > 0 && (
        <section style={{
          marginBottom: 24,
          background: "#ffffff",
          borderRadius: 20,
          padding: "20px 22px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
          overflow: "hidden"
        }}>
          {/* Header & Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 16
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#ecfdf5",
                  color: "#059669",
                  fontSize: 14
                }}>
                  📈
                </span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                  Temperature Distribution Curve
                </h3>
                <span style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "#f1f5f9",
                  color: "#475569"
                }}>
                  {visible.length} Districts Plotted
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Real-time thermal comparison across currently filtered Tamil Nadu districts with average threshold
              </p>
            </div>

            {/* Quick Metrics Badges & Toggle */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{
                padding: "6px 12px",
                borderRadius: 10,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                fontSize: 12,
                color: "#334155"
              }}>
                <span style={{ color: "#64748b", fontSize: 11, marginRight: 4 }}>Avg:</span>
                <strong style={{ color: "#059669", fontFamily: "monospace" }}>{filteredAvgTemp}°C</strong>
              </div>

              <div style={{
                padding: "6px 12px",
                borderRadius: 10,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                fontSize: 12,
                color: "#334155"
              }}>
                <span style={{ color: "#64748b", fontSize: 11, marginRight: 4 }}>Range:</span>
                <strong style={{ color: "#0284c7", fontFamily: "monospace" }}>{filteredMinTemp}°C – {filteredMaxTemp}°C</strong>
              </div>

              <button
                type="button"
                onClick={() => setShowFeelsLike(!showFeelsLike)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  border: showFeelsLike ? "1px solid #38bdf8" : "1px solid #cbd5e1",
                  background: showFeelsLike ? "#f0f9ff" : "#ffffff",
                  color: showFeelsLike ? "#0284c7" : "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: showFeelsLike ? "#0284c7" : "#94a3b8"
                }} />
                {showFeelsLike ? "Feels Like Active" : "Show Feels Like"}
              </button>
            </div>
          </div>

          {/* Recharts LineChart */}
          <div style={{ width: "100%", height: 280, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 12, right: 16, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-40} 
                  textAnchor="end" 
                  interval={visible.length > 25 ? 1 : 0}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  height={55}
                />
                <YAxis 
                  unit="°C" 
                  domain={['dataMin - 2', 'dataMax + 2']} 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  width={42}
                />
                <Tooltip 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div style={{
                          background: "#0f172a",
                          color: "#f8fafc",
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                          fontSize: "12px",
                          minWidth: "160px"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <strong style={{ fontSize: "14px", color: "#34d399" }}>{item.name}</strong>
                            {item.nameTa && <span style={{ fontSize: "11px", color: "#a7f3d0" }}>{item.nameTa}</span>}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "8px" }}>{item.condition}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", margin: "3px 0" }}>
                            <span style={{ color: "#cbd5e1" }}>Ambient Temp:</span>
                            <strong style={{ color: "#34d399", fontFamily: "monospace", fontSize: "13px" }}>{item.temp}°C</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", margin: "3px 0" }}>
                            <span style={{ color: "#cbd5e1" }}>Feels Like:</span>
                            <strong style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "13px" }}>{item.feelsLike}°C</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", margin: "3px 0" }}>
                            <span style={{ color: "#94a3b8" }}>Humidity:</span>
                            <span style={{ color: "#e2e8f0" }}>{item.humidity}%</span>
                          </div>
                          {item.rain > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", margin: "3px 0" }}>
                              <span style={{ color: "#60a5fa" }}>Rainfall:</span>
                              <span style={{ color: "#93c5fd", fontWeight: 600 }}>{item.rain} mm</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }} 
                />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  height={28}
                  wrapperStyle={{ fontSize: 12, paddingBottom: 6 }}
                />
                <ReferenceLine 
                  y={filteredAvgTemp} 
                  stroke="#10b981" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ value: `Avg ${filteredAvgTemp}°C`, position: 'insideTopLeft', fill: '#059669', fontSize: 11, fontWeight: 600 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  name="Ambient Temp (°C)" 
                  stroke="#059669" 
                  strokeWidth={2.5} 
                  dot={{ r: visible.length > 25 ? 2.5 : 3.5, fill: "#059669" }}
                  activeDot={{ r: 6, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                />
                {showFeelsLike && (
                  <Line 
                    type="monotone" 
                    dataKey="feelsLike" 
                    name="Feels Like (°C)" 
                    stroke="#0284c7" 
                    strokeWidth={1.8} 
                    strokeDasharray="4 4"
                    dot={{ r: visible.length > 25 ? 2 : 3, fill: "#0284c7" }}
                    activeDot={{ r: 5, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* 38 Districts Grid */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 16,
      }}>
        {!loading && !error && visible.map(d => {
          const isHot = d.temperature_2m >= 34;
          const isRaining = d.rain > 0 || [61, 63, 65, 80, 81, 82, 95].includes(d.weather_code);
          const isCool = d.temperature_2m <= 22;

          return (
            <article 
              key={d.name} 
              style={{
                border: isRaining ? "1px solid #7dd3fc" : isHot ? "1px solid #fed7aa" : "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 18,
                background: isRaining ? "linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)" : isHot ? "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)" : "#ffffff",
                boxShadow: "0 3px 12px rgba(15, 23, 42, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                      {d.name}
                    </h2>
                    {d.nameTa && (
                      <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                        {d.nameTa}
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    padding: "2px 6px",
                    borderRadius: 6,
                    background: isRaining ? "#e0f2fe" : isHot ? "#ffedd5" : isCool ? "#dbeafe" : "#f1f5f9",
                    color: isRaining ? "#0369a1" : isHot ? "#c2410c" : isCool ? "#1e40af" : "#475569",
                    fontWeight: 600
                  }}>
                    {isRaining ? "RAIN" : isHot ? "HEAT" : isCool ? "COOL" : "NORMAL"}
                  </span>
                </div>

                {/* Big Temperature Display */}
                <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  margin: "12px 0 6px"
                }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", fontFamily: "monospace" }}>
                    {Math.round(d.temperature_2m)}°C
                  </span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>
                    ({d.apparent_temperature ? Math.round(d.apparent_temperature) : Math.round(d.temperature_2m)}°C feels)
                  </span>
                </div>

                {/* Weather Description */}
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>{description(d.weather_code)}</span>
                </div>

                {/* Metrics Breakdown */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  padding: "10px 0",
                  borderTop: "1px solid #f1f5f9",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: 12,
                  color: "#475569"
                }}>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: 10, textTransform: "uppercase" }}>Humidity</span>
                    <strong style={{ color: "#0f172a" }}>{d.relative_humidity_2m}%</strong>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: 10, textTransform: "uppercase" }}>Wind</span>
                    <strong style={{ color: "#0f172a" }}>{d.wind_speed_10m} km/h</strong>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: 10, textTransform: "uppercase" }}>Rain</span>
                    <strong style={{ color: d.rain > 0 ? "#0284c7" : "#0f172a" }}>{d.rain} mm</strong>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: 10, textTransform: "uppercase" }}>Coordinates</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace" }}>{d.lat.toFixed(1)}°, {d.lon.toFixed(1)}°</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small style={{ color: "#94a3b8", fontSize: 11 }}>
                  Local time: {d.time.replace("T", " ")}
                </small>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981"
                }} title="Station online" />
              </div>
            </article>
          );
        })}
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 32,
        paddingTop: 16,
        borderTop: "1px solid #e2e8f0",
        fontSize: 13,
        color: "#64748b",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }}>
        <span>
          Weather data provided live by{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}>
            Open-Meteo
          </a>.
        </span>
        <span>
          Leo Green Farm · Tamil Nadu Agro-Meteorological Network
        </span>
      </footer>
    </main>
  );
}
