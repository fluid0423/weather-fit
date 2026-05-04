import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWeatherStore } from "../store/useWeatherStore";

export default function SettingsScreen() {
  const { apiKey, setApiKey } = useWeatherStore();
  const [input, setInput] = useState(apiKey);

  const save = () => {
    setApiKey(input.trim());
    Alert.alert("저장됨", "API 키가 저장되었습니다. 홈으로 돌아가면 날씨를 불러옵니다.");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 pt-5">
        <Text className="text-slate-800 text-2xl font-bold">설정</Text>

        <View className="bg-white rounded-2xl p-5 mt-5" style={{ elevation: 2 }}>
          <Text className="text-slate-700 font-bold mb-1">기상청 API 키</Text>
          <Text className="text-slate-400 text-xs mb-3">
            data.go.kr → 기상청 단기예보 서비스 신청 후 인증키 입력
          </Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="인증키를 입력하세요"
            placeholderTextColor="#CBD5E1"
            className="bg-slate-50 rounded-xl px-4 py-3 text-slate-700 text-sm"
            multiline
            numberOfLines={3}
            style={{ textAlignVertical: "top" }}
          />
          <TouchableOpacity
            onPress={save}
            className="bg-indigo-500 rounded-xl py-3 mt-3 items-center"
          >
            <Text className="text-white font-bold">저장</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-indigo-50 rounded-2xl p-4 mt-4">
          <Text className="text-indigo-700 font-semibold text-sm mb-2">API 키 발급 방법</Text>
          <Text className="text-indigo-500 text-xs leading-5">
            1. data.go.kr 접속 후 회원가입{"\n"}
            2. "기상청_단기예보" 검색{"\n"}
            3. 활용 신청 → 즉시 발급{"\n"}
            4. 마이페이지 → 일반 인증키(Decoding) 복사
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-slate-400 text-xs text-center">
            오늘 뭐 입지? v1.0.0{"\n"}
            © 2026 bemarkable
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
