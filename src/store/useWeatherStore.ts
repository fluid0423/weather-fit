import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";

const mmkv = createMMKV({ id: "weather-store" });

const mmkvStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.delete(key),
};

export interface WeatherState {
  locationName: string;
  currentTemp: number | null;
  sky: number;
  pty: number;
  humidity: number;
  windSpeed: number;
  lastFetched: number | null;

  setWeather: (data: Partial<WeatherState>) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      locationName: "",
      currentTemp: null,
      sky: 1,
      pty: 0,
      humidity: 0,
      windSpeed: 0,
      lastFetched: null,

      setWeather: (data) => set((s) => ({ ...s, ...data, lastFetched: Date.now() })),
    }),
    {
      name: "weather-store",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
