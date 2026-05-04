import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOutfitByTemp } from "../constants/outfit";
import { getWeatherEmoji, getWeatherDesc } from "../hooks/useWeather";
import BannerAd from "../components/BannerAd";

const MOCK_WEEKLY = [
  { minTemp: 14, maxTemp: 22, sky: 1, pty: 0 },
  { minTemp: 12, maxTemp: 19, sky: 3, pty: 0 },
  { minTemp: 10, maxTemp: 16, sky: 4, pty: 1 },
  { minTemp: 8, maxTemp: 13, sky: 4, pty: 0 },
  { minTemp: 11, maxTemp: 18, sky: 1, pty: 0 },
  { minTemp: 15, maxTemp: 23, sky: 1, pty: 0 },
  { minTemp: 16, maxTemp: 25, sky: 3, pty: 0 },
];

const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

function buildWeekDays() {
  const today = new Date();
  return MOCK_WEEKLY.map((data, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = i === 0 ? "오늘" : i === 1 ? "내일" : DAY_KO[d.getDay()];
    const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    return { ...data, label, dateLabel, dayOfWeek: d.getDay() };
  });
}

export default function WeeklyScreen() {
  const days = buildWeekDays();

  return (
    <View style={{ flex: 1, backgroundColor: "#1e293b" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}>
            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>이번 주 날씨</Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 4 }}>날씨별 코디를 미리 준비해요</Text>
          </View>

          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {days.map((day, i) => {
              const outfit = getOutfitByTemp((day.minTemp + day.maxTemp) / 2);
              const emoji = getWeatherEmoji(day.sky, day.pty);
              const desc = getWeatherDesc(day.sky, day.pty);
              const isToday = i === 0;
              const isSat = day.dayOfWeek === 6;
              const isSun = day.dayOfWeek === 0;
              const dayColor = isSun ? "#f87171" : isSat ? "#60a5fa" : "#fff";

              return (
                <View
                  key={i}
                  style={{
                    backgroundColor: isToday ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isToday ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.09)",
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <View style={{ width: 56 }}>
                      <Text style={{ color: dayColor, fontWeight: "800", fontSize: 15 }}>{day.label}</Text>
                      <Text style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, marginTop: 1 }}>{day.dateLabel}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 6 }}>
                      <Text style={{ fontSize: 20 }}>{emoji}</Text>
                      <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{desc || "맑음"}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={{ color: "#93c5fd", fontWeight: "700", fontSize: 14 }}>{day.minTemp}°</Text>
                      <Text style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>|</Text>
                      <Text style={{ color: "#fca5a5", fontWeight: "800", fontSize: 14 }}>{day.maxTemp}°</Text>
                    </View>
                  </View>

                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.22)",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    gap: 8,
                  }}>
                    <Text style={{ fontSize: 18 }}>{outfit.emoji}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, flex: 1 }}>
                      {outfit.outer ? `${outfit.outer} + ` : ""}{outfit.top[0]} + {outfit.bottom[0]}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ marginTop: 20 }}>
            <BannerAd />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
