import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  BannerAd as RNBannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const PROD_BANNER_ID = "ca-app-pub-9386782255677460/4773440404";
const AD_UNIT_ID = __DEV__ ? TestIds.BANNER : PROD_BANNER_ID;

export default function BannerAd() {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={{ alignItems: "center", minHeight: loaded ? undefined : 0 }}>
      {__DEV__ && !loaded && (
        <View style={{ height: 52, width: "100%", backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#94a3b8", fontSize: 11 }}>광고 영역</Text>
        </View>
      )}
      <RNBannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={() => setLoaded(false)}
      />
    </View>
  );
}
