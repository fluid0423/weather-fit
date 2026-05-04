import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 pt-5">
        <Text className="text-slate-800 text-2xl font-bold">설정</Text>

        <View className="bg-white rounded-2xl p-5 mt-5" style={{ elevation: 2 }}>
          <Text className="text-slate-700 font-bold mb-3">앱 정보</Text>
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-slate-400 text-sm">앱 이름</Text>
              <Text className="text-slate-700 text-sm font-medium">오늘 뭐 입지?</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400 text-sm">버전</Text>
              <Text className="text-slate-700 text-sm font-medium">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400 text-sm">날씨 데이터</Text>
              <Text className="text-slate-700 text-sm font-medium">기상청 단기예보</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400 text-sm">개발</Text>
              <Text className="text-slate-700 text-sm font-medium">bemarkable</Text>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-slate-400 text-xs text-center">© 2026 bemarkable</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
