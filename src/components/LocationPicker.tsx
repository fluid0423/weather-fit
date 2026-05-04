import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { PROVINCES } from "../constants/regions";
import { useWeatherStore } from "../store/useWeatherStore";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LocationPicker({ visible, onClose }: Props) {
  const { customLocation, setCustomLocation } = useWeatherStore();
  const [selectedProvinceIdx, setSelectedProvinceIdx] = useState(() => {
    if (!customLocation) return 0;
    const idx = PROVINCES.findIndex((p) =>
      p.districts.some((d) => d.name === customLocation.name)
    );
    return idx >= 0 ? idx : 0;
  });
  const districtScrollRef = useRef<ScrollView>(null);

  const handleSelectProvince = (idx: number) => {
    setSelectedProvinceIdx(idx);
    districtScrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleSelectDistrict = (name: string, lat: number, lon: number) => {
    setCustomLocation({ name, lat, lon });
    onClose();
  };

  const handleUseGPS = () => {
    setCustomLocation(null);
    onClose();
  };

  const currentProvince = PROVINCES[selectedProvinceIdx];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
          <Text className="text-slate-800 text-lg font-bold">지역 선택</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text className="text-indigo-500 font-semibold text-base">닫기</Text>
          </TouchableOpacity>
        </View>

        {/* GPS 자동감지 버튼 */}
        <TouchableOpacity
          onPress={handleUseGPS}
          className={`mx-4 my-3 flex-row items-center px-4 py-3 rounded-xl ${
            !customLocation ? "bg-indigo-500" : "bg-slate-100"
          }`}
        >
          <Text className="text-lg mr-2">📍</Text>
          <Text className={`font-semibold text-sm flex-1 ${!customLocation ? "text-white" : "text-slate-700"}`}>
            현재 위치 자동감지
          </Text>
          {!customLocation && <Text className="text-white font-bold">✓</Text>}
        </TouchableOpacity>

        {/* 2컬럼 피커 */}
        <View className="flex-1 flex-row border-t border-slate-100">
          {/* 왼쪽: 시/도 */}
          <ScrollView
            className="w-24 bg-slate-50 border-r border-slate-100"
            showsVerticalScrollIndicator={false}
          >
            {PROVINCES.map((province, idx) => {
              const isActive = idx === selectedProvinceIdx;
              return (
                <TouchableOpacity
                  key={province.name}
                  onPress={() => handleSelectProvince(idx)}
                  className={`px-3 py-3.5 border-b border-slate-100 ${isActive ? "bg-white" : ""}`}
                >
                  <Text
                    className={`text-sm text-center ${
                      isActive ? "text-indigo-600 font-bold" : "text-slate-500 font-medium"
                    }`}
                    numberOfLines={1}
                  >
                    {province.short}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View className="h-10" />
          </ScrollView>

          {/* 오른쪽: 구/군/시 */}
          <ScrollView
            ref={districtScrollRef}
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
          >
            {currentProvince.districts.map((district, idx) => {
              const isSelected = customLocation?.name === district.name;
              const isLast = idx === currentProvince.districts.length - 1;
              return (
                <TouchableOpacity
                  key={district.name}
                  onPress={() => handleSelectDistrict(district.name, district.lat, district.lon)}
                  className={`flex-row items-center px-5 py-3.5 ${
                    !isLast ? "border-b border-slate-50" : ""
                  } ${isSelected ? "bg-indigo-50" : ""}`}
                >
                  <Text
                    className={`flex-1 text-sm ${
                      isSelected ? "text-indigo-600 font-bold" : "text-slate-700 font-medium"
                    }`}
                  >
                    {district.name}
                  </Text>
                  {isSelected && <Text className="text-indigo-500">✓</Text>}
                </TouchableOpacity>
              );
            })}
            <View className="h-10" />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
