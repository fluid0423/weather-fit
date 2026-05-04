import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWeatherStore } from "../store/useWeatherStore";
import { useWeather, getWeatherDesc, getWeatherEmoji } from "../hooks/useWeather";
import { getOutfitByTemp } from "../constants/outfit";

export default function HomeScreen() {
  const { currentTemp, locationName, sky, pty, humidity, windSpeed } = useWeatherStore();
  const { loading, error, refresh } = useWeather();

  const temp = currentTemp ?? 22;
  const outfit = getOutfitByTemp(temp);
  const weatherEmoji = getWeatherEmoji(sky, pty);
  const weatherDesc = getWeatherDesc(sky, pty);

  const now = new Date();
  const dateStr = now.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });

  const tempColor =
    temp >= 28 ? "#EF4444" : temp >= 20 ? "#F97316" : temp >= 12 ? "#22C55E" : temp >= 5 ? "#3B82F6" : "#6366F1";

  if (loading && currentTemp === null) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-slate-400 mt-3 text-sm">날씨 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#6366F1" />}
      >
        {/* 헤더 */}
        <View className="px-6 pt-5 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-400 text-sm">{dateStr}</Text>
            <Text className="text-slate-800 text-lg font-bold mt-0.5">
              📍 {locationName || "위치 확인 중"}
            </Text>
          </View>
          <TouchableOpacity onPress={refresh} className="bg-indigo-50 p-2 rounded-full">
            <Text className="text-lg">🔄</Text>
          </TouchableOpacity>
        </View>

        {/* 날씨 카드 */}
        <View className="mx-5 mt-3 bg-white rounded-3xl p-6" style={{ elevation: 3 }}>
          <View className="flex-row justify-between items-center">
            <View>
              <Text style={{ fontSize: 64, fontWeight: "800", color: tempColor, lineHeight: 72 }}>
                {temp}°
              </Text>
              <Text className="text-slate-500 text-base mt-1">{weatherEmoji} {weatherDesc}</Text>
            </View>
            <View className="items-end gap-2">
              <View className="bg-blue-50 px-3 py-1.5 rounded-full">
                <Text className="text-blue-500 text-xs font-semibold">💧 {humidity}%</Text>
              </View>
              <View className="bg-green-50 px-3 py-1.5 rounded-full">
                <Text className="text-green-500 text-xs font-semibold">💨 {windSpeed}m/s</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 오늘 코디 추천 */}
        <View className="mx-5 mt-4 bg-white rounded-3xl p-6" style={{ elevation: 3 }}>
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-2xl">{outfit.emoji}</Text>
            <View>
              <Text className="text-slate-800 text-lg font-bold">오늘의 코디</Text>
              <Text className="text-slate-400 text-xs">{outfit.tempRange}</Text>
            </View>
          </View>

          {/* 상의 */}
          <View className="mb-3">
            <Text className="text-slate-400 text-xs font-semibold mb-2">상의</Text>
            <View className="flex-row flex-wrap gap-2">
              {outfit.top.map((item) => (
                <View key={item} className="bg-indigo-50 px-3 py-1.5 rounded-full">
                  <Text className="text-indigo-600 text-sm font-medium">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 하의 */}
          <View className="mb-3">
            <Text className="text-slate-400 text-xs font-semibold mb-2">하의</Text>
            <View className="flex-row flex-wrap gap-2">
              {outfit.bottom.map((item) => (
                <View key={item} className="bg-violet-50 px-3 py-1.5 rounded-full">
                  <Text className="text-violet-600 text-sm font-medium">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 겉옷 */}
          {outfit.outer && (
            <View className="mb-3">
              <Text className="text-slate-400 text-xs font-semibold mb-2">겉옷</Text>
              <View className="flex-row flex-wrap gap-2">
                {outfit.outer.split(", ").map((item) => (
                  <View key={item} className="bg-amber-50 px-3 py-1.5 rounded-full">
                    <Text className="text-amber-600 text-sm font-medium">{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 팁 */}
          <View className="bg-slate-50 rounded-2xl p-3 mt-1">
            <Text className="text-slate-500 text-sm">💡 {outfit.tip}</Text>
          </View>
        </View>

        {/* 에러 */}
        {error && (
          <View className="mx-5 mt-4 bg-red-50 rounded-2xl p-4">
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
