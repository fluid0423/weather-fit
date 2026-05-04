import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useWeatherStore } from "../store/useWeatherStore";

const ENV_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY ?? "";

const SKY_MAP: Record<number, string> = { 1: "맑음", 3: "구름많음", 4: "흐림" };
const PTY_MAP: Record<number, string> = { 0: "", 1: "비", 2: "비/눈", 3: "눈", 4: "소나기" };

export function getWeatherDesc(sky: number, pty: number) {
  if (pty > 0) return PTY_MAP[pty] || "";
  return SKY_MAP[sky] || "맑음";
}

export function getWeatherEmoji(sky: number, pty: number) {
  if (pty === 1 || pty === 4) return "🌧️";
  if (pty === 2) return "🌨️";
  if (pty === 3) return "❄️";
  if (sky === 4) return "☁️";
  if (sky === 3) return "⛅";
  return "☀️";
}

function toKmaGrid(lat: number, lon: number) {
  const RE = 6371.00877, GRID = 5.0, SLAT1 = 30.0, SLAT2 = 60.0;
  const OLON = 126.0, OLAT = 38.0, XO = 43, YO = 136;
  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID, slat1 = SLAT1 * DEGRAD, slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD, olat = OLAT * DEGRAD;
  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  return {
    x: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    y: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

function getBaseTime() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  const times = [2, 5, 8, 11, 14, 17, 20, 23];
  let base = times[0];
  for (const t of times) { if (h > t || (h === t && m >= 10)) base = t; }
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  return { baseDate: dateStr, baseTime: `${pad(base)}00` };
}

export function useWeather() {
  const { setWeather, lastFetched, currentTemp } = useWeatherStore();
  const apiKey = ENV_API_KEY;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { setError("위치 권한이 필요합니다."); return; }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      const { x, y } = toKmaGrid(latitude, longitude);

      const addr = await Location.reverseGeocodeAsync({ latitude, longitude });
      const a = addr[0];
      const locationName = a
        ? [a.region, a.subregion, a.district, a.city]
            .filter(Boolean)
            .slice(0, 2)
            .join(" ")
            .trim() || "현재 위치"
        : "현재 위치";

      if (!apiKey) {
        setWeather({ locationName, currentTemp: 22, sky: 1, pty: 0, humidity: 55, windSpeed: 2 });
        return;
      }

      const { baseDate, baseTime } = getBaseTime();
      const encodedKey = encodeURIComponent(apiKey);
      const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodedKey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${x}&ny=${y}`;
      const res = await globalThis.fetch(url);
      const json = await res.json();
      const items: any[] = json?.response?.body?.items?.item ?? [];

      if (!items.length) throw new Error("empty response");

      const byTimeKey: Record<string, Record<string, string>> = {};
      for (const item of items) {
        const key = `${item.fcstDate}_${item.fcstTime}`;
        if (!byTimeKey[key]) byTimeKey[key] = {};
        byTimeKey[key][item.category] = item.fcstValue;
      }

      const now = new Date();
      const sortedKeys = Object.keys(byTimeKey).sort();
      const currentKey = sortedKeys.find((k) => {
        const [d, t] = k.split("_");
        const dt = new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2, 4)}:00`);
        return dt >= now;
      });

      const current = currentKey ? byTimeKey[currentKey] : {};
      setWeather({
        locationName,
        currentTemp: Number(current.TMP ?? 22),
        sky: Number(current.SKY ?? 1),
        pty: Number(current.PTY ?? 0),
        humidity: Number(current.REH ?? 50),
        windSpeed: Number(current.WSD ?? 0),
      });
    } catch (e: any) {
      console.warn("[useWeather] error:", e?.message ?? e);
      setError("날씨를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stale = !lastFetched || Date.now() - lastFetched > 30 * 60 * 1000;
    if (stale || currentTemp === null) fetch();
  }, [apiKey]);

  return { loading, error, refresh: fetch };
}
