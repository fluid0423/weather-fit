import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWeatherStore } from "../store/useWeatherStore";
import { useWeather, getWeatherDesc, getWeatherEmoji } from "../hooks/useWeather";
import { getOutfitByTemp } from "../constants/outfit";
import LocationPicker from "../components/LocationPicker";
import BannerAd from "../components/BannerAd";
import { useInterstitialAd } from "../hooks/useInterstitialAd";

interface WeatherTheme {
  bg: string;
  bg2: string;
  accent: string;
  textLight: boolean;
}

function getWeatherTheme(sky: number, pty: number): WeatherTheme {
  if (pty === 1 || pty === 4) return { bg: "#1a237e", bg2: "#283593", accent: "#7986cb", textLight: true };
  if (pty === 2) return { bg: "#37474f", bg2: "#455a64", accent: "#90a4ae", textLight: true };
  if (pty === 3) return { bg: "#b3e5fc", bg2: "#e1f5fe", accent: "#4fc3f7", textLight: false };
  if (sky === 4) return { bg: "#607d8b", bg2: "#78909c", accent: "#b0bec5", textLight: true };
  if (sky === 3) return { bg: "#4a6fa5", bg2: "#6b9bd2", accent: "#bbdefb", textLight: true };
  return { bg: "#e8821a", bg2: "#f5a623", accent: "#fff3e0", textLight: true };
}

function getLargeEmoji(sky: number, pty: number) {
  if (pty === 1 || pty === 4) return "🌧️";
  if (pty === 2) return "🌨️";
  if (pty === 3) return "❄️";
  if (sky === 4) return "☁️";
  if (sky === 3) return "⛅";
  return "☀️";
}

export default function HomeScreen() {
  const { currentTemp, locationName, sky, pty, humidity, windSpeed, customLocation } = useWeatherStore();
  const { loading, error, refresh } = useWeather();
  const { onRefresh: onInterstitial } = useInterstitialAd();
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleRefresh = () => {
    onInterstitial();
    refresh();
  };

  const temp = currentTemp ?? 22;
  const outfit = getOutfitByTemp(temp);
  const weatherDesc = getWeatherDesc(sky, pty);
  const largeEmoji = getLargeEmoji(sky, pty);
  const { bg, bg2, textLight } = getWeatherTheme(sky, pty);

  const now = new Date();
  const dateStr = now.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });

  const headingColor = textLight ? "#fff" : "#1e293b";
  const subColor = textLight ? "rgba(255,255,255,0.7)" : "#64748b";
  const cardBg = textLight ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.75)";
  const cardBorder = textLight ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.06)";

  if (loading && currentTemp === null) {
    return (
      <View style={{ flex: 1, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 12, fontSize: 14 }}>날씨 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor="#fff" />}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* 헤더 */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
            <TouchableOpacity onPress={() => setPickerVisible(true)} activeOpacity={0.7}>
              <Text style={{ color: subColor, fontSize: 12 }}>{dateStr}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Text style={{ color: headingColor, fontSize: 16, fontWeight: "700" }}>
                  📍 {locationName || "위치 확인 중"}
                </Text>
                {customLocation && (
                  <View style={{ backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 }}>
                    <Text style={{ color: headingColor, fontSize: 10, fontWeight: "600" }}>수동</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRefresh}
              style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 20 }}
            >
              <Text style={{ fontSize: 16 }}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* 메인 날씨 */}
          <View style={{ alignItems: "center", paddingVertical: 28, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 96, lineHeight: 100 }}>{largeEmoji}</Text>
            <Text style={{ fontSize: 80, fontWeight: "900", color: headingColor, lineHeight: 88, marginTop: 8 }}>
              {temp}°
            </Text>
            <Text style={{ fontSize: 20, color: subColor, fontWeight: "600", marginTop: 4 }}>
              {weatherDesc}
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <View style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 }}>
                <Text style={{ color: headingColor, fontSize: 13, fontWeight: "600" }}>💧 {humidity}%</Text>
              </View>
              <View style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 }}>
                <Text style={{ color: headingColor, fontSize: 13, fontWeight: "600" }}>💨 {windSpeed}m/s</Text>
              </View>
            </View>
          </View>

          {/* 오늘의 코디 카드 */}
          <View style={{ marginHorizontal: 16, borderRadius: 28, backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder, padding: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 28, marginRight: 10 }}>{outfit.emoji}</Text>
              <View>
                <Text style={{ fontSize: 17, fontWeight: "800", color: headingColor }}>오늘의 코디</Text>
                <Text style={{ fontSize: 12, color: subColor, marginTop: 1 }}>{outfit.tempRange}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: subColor, marginBottom: 6 }}>상의</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {outfit.top.map((item) => (
                  <View key={item} style={{ backgroundColor: textLight ? "rgba(255,255,255,0.25)" : "rgba(99,102,241,0.12)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                    <Text style={{ color: textLight ? "#fff" : "#6366f1", fontSize: 13, fontWeight: "600" }}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: subColor, marginBottom: 6 }}>하의</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {outfit.bottom.map((item) => (
                  <View key={item} style={{ backgroundColor: textLight ? "rgba(255,255,255,0.25)" : "rgba(139,92,246,0.12)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                    <Text style={{ color: textLight ? "#fff" : "#7c3aed", fontSize: 13, fontWeight: "600" }}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {outfit.outer && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: subColor, marginBottom: 6 }}>겉옷</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                  {outfit.outer.split(", ").map((item) => (
                    <View key={item} style={{ backgroundColor: textLight ? "rgba(255,255,255,0.25)" : "rgba(245,158,11,0.12)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
                      <Text style={{ color: textLight ? "#fff" : "#d97706", fontSize: 13, fontWeight: "600" }}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ backgroundColor: textLight ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)", borderRadius: 16, padding: 12, marginTop: 4 }}>
              <Text style={{ color: textLight ? "rgba(255,255,255,0.88)" : "#64748b", fontSize: 13 }}>💡 {outfit.tip}</Text>
            </View>
          </View>

          {error && (
            <View style={{ marginHorizontal: 16, marginTop: 12, backgroundColor: "rgba(239,68,68,0.18)", borderRadius: 16, padding: 14 }}>
              <Text style={{ color: "#fca5a5", fontSize: 13, textAlign: "center" }}>{error}</Text>
            </View>
          )}

          <View style={{ marginTop: 16 }}>
            <BannerAd />
          </View>
        </ScrollView>

        <LocationPicker visible={pickerVisible} onClose={() => setPickerVisible(false)} />
      </SafeAreaView>
    </View>
  );
}
