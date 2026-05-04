import { useEffect, useRef } from "react";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const PROD_ID = "ca-app-pub-9386782255677460/9246114444";
const AD_UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : PROD_ID;

// 전면광고를 n번 새로고침마다 1회 노출
const SHOW_EVERY = 5;

export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const loadedRef = useRef(false);
  const refreshCount = useRef(0);

  const load = () => {
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });
    ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false;
      load();
    });
    ad.load();
    adRef.current = ad;
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = () => {
    refreshCount.current += 1;
    if (refreshCount.current % SHOW_EVERY === 0 && loadedRef.current && adRef.current) {
      adRef.current.show();
    }
  };

  return { onRefresh };
}
