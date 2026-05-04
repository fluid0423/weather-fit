import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BannerAd from "../components/BannerAd";

const INFO_ROWS = [
  { label: "앱 이름", value: "오늘 뭐 입지?" },
  { label: "버전", value: "1.0.0" },
  { label: "날씨 데이터", value: "기상청 단기예보" },
  { label: "개발", value: "inome" },
];

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}>
            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>설정</Text>
          </View>

          <View style={{ marginHorizontal: 16, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 }}>
              <Text style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>앱 정보</Text>
            </View>
            {INFO_ROWS.map((row, idx) => (
              <View
                key={row.label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>{row.label}</Text>
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 24, alignItems: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>© 2026 inome</Text>
          </View>

          <View style={{ marginTop: 32 }}>
            <BannerAd />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
