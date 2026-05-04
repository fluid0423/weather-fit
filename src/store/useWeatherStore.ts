import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { storage as MMKVStorage } from "zustand/middleware";

const mmkv = createMMKV({ id: "weather-store" });

const mmkvStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.delete(key),
};

export interface HourlyForecast {
  time: string;
  temp: number;
  sky: number;
  pty: number;
}

export interface DailyForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  sky: number;
  pty: number;
}

export interface WeatherState {
  locationName: string;
  currentTemp: number | null;
  feelsLike: number | null;
  sky: number;
  pty: number;
  humidity: number;
  windSpeed: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lastFetched: number | null;
  apiKey: string;

  setWeather: (data: Partial<WeatherState>) => void;
  setApiKey: (key: string) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      locationName: "",
      currentTemp: null,
      feelsLike: null,
      sky: 1,
      pty: 0,
      humidity: 0,
      windSpeed: 0,
      hourly: [],
      daily: [],
      lastFetched: null,
      apiKey: "",

      setWeather: (data) => set((s) => ({ ...s, ...data, lastFetched: Date.now() })),
      setApiKey: (key) => set({ apiKey: key }),
    }),
    {
      name: "weather-store",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
