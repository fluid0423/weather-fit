import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOutfitByTemp } from "../constants/outfit";
import { getWeatherEmoji, getWeatherDesc } from "../hooks/useWeather";

const MOCK_WEEKLY = [
  { label: "오늘", minTemp: 14, maxTemp: 22, sky: 1, pty: 0 },
  { label: "내일", minTemp: 12, maxTemp: 19, sky: 3, pty: 0 },
  { label: "모레", minTemp: 10, maxTemp: 16, sky: 4, pty: 1 },
  { label: "목", minTemp: 8, maxTemp: 13, sky: 4, pty: 0 },
  { label: "금", minTemp: 11, maxTemp: 18, sky: 1, pty: 0 },
  { label: "토", minTemp: 15, maxTemp: 23, sky: 1, pty: 0 },
  { label: "일", minTemp: 16, maxTemp: 25, sky: 3, pty: 0 },
];

export default function WeeklyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-5 pb-2">
          <Text className="text-slate-800 text-2xl font-bold">이번 주 날씨</Text>
          <Text className="text-slate-400 text-sm mt-1">날씨별 코디를 미리 준비해요</Text>
        </View>

        <View className="px-5 gap-3 mt-2">
          {MOCK_WEEKLY.map((day, i) => {
            const outfit = getOutfitByTemp((day.minTemp + day.maxTemp) / 2);
            const emoji = getWeatherEmoji(day.sky, day.pty);
            const desc = getWeatherDesc(day.sky, day.pty);
            return (
              <View
                key={i}
                className="bg-white rounded-2xl p-4"
                style={{ elevation: 2 }}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-slate-800 font-bold text-base w-8">{day.label}</Text>
                    <Text className="text-base">{emoji}</Text>
                    <Text className="text-slate-400 text-sm">{desc}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-blue-400 font-semibold">{day.minTemp}°</Text>
                    <Text className="text-slate-300">|</Text>
                    <Text className="text-orange-400 font-bold">{day.maxTemp}°</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">{outfit.emoji}</Text>
                  <Text className="text-slate-600 text-sm flex-1">
                    {outfit.outer ? `${outfit.outer} + ` : ""}{outfit.top[0]} + {outfit.bottom[0]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
