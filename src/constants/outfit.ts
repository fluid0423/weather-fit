export type OutfitLevel = "패딩" | "코트" | "재킷" | "가디건" | "긴팔" | "얇은긴팔" | "반팔" | "민소매";

export interface OutfitRecommendation {
  level: OutfitLevel;
  emoji: string;
  top: string[];
  bottom: string[];
  outer?: string;
  tip: string;
  tempRange: string;
}

export const OUTFIT_MAP: OutfitRecommendation[] = [
  {
    level: "민소매",
    emoji: "🌞",
    tempRange: "28°C 이상",
    top: ["민소매", "나시", "크롭티"],
    bottom: ["반바지", "숏스커트", "린넨 팬츠"],
    tip: "자외선 차단 필수! 선크림 꼭 바르세요.",
  },
  {
    level: "반팔",
    emoji: "😎",
    tempRange: "23~27°C",
    top: ["반팔 티셔츠", "반팔 셔츠", "반팔 원피스"],
    bottom: ["청바지", "면바지", "스커트"],
    tip: "가볍고 시원하게! 얇은 소재를 추천해요.",
  },
  {
    level: "얇은긴팔",
    emoji: "🙂",
    tempRange: "20~22°C",
    top: ["얇은 긴팔", "긴팔 티셔츠", "블라우스"],
    bottom: ["청바지", "슬랙스", "면바지"],
    tip: "아침저녁엔 쌀쌀할 수 있어요.",
  },
  {
    level: "긴팔",
    emoji: "😊",
    tempRange: "17~19°C",
    top: ["긴팔 티셔츠", "맨투맨", "니트"],
    bottom: ["청바지", "슬랙스"],
    tip: "딱 좋은 날씨! 레이어드 스타일 추천.",
  },
  {
    level: "가디건",
    emoji: "🍂",
    tempRange: "12~16°C",
    top: ["긴팔", "맨투맨"],
    bottom: ["청바지", "슬랙스"],
    outer: "가디건, 얇은 자켓",
    tip: "겉옷을 챙기세요. 바람이 쌀쌀해요.",
  },
  {
    level: "재킷",
    emoji: "🧥",
    tempRange: "9~11°C",
    top: ["니트", "맨투맨"],
    bottom: ["청바지", "두꺼운 면바지"],
    outer: "재킷, 점퍼",
    tip: "두꺼운 겉옷은 필수예요.",
  },
  {
    level: "코트",
    emoji: "🌬️",
    tempRange: "5~8°C",
    top: ["두꺼운 니트", "후드티"],
    bottom: ["청바지", "기모 바지"],
    outer: "코트, 두꺼운 재킷",
    tip: "목도리도 챙기면 좋아요!",
  },
  {
    level: "패딩",
    emoji: "🥶",
    tempRange: "4°C 이하",
    top: ["두꺼운 니트", "기모 후드"],
    bottom: ["기모 바지", "두꺼운 청바지"],
    outer: "패딩, 롱패딩",
    tip: "최대한 따뜻하게! 핫팩도 챙기세요.",
  },
];

export function getOutfitByTemp(temp: number): OutfitRecommendation {
  if (temp >= 28) return OUTFIT_MAP[0];
  if (temp >= 23) return OUTFIT_MAP[1];
  if (temp >= 20) return OUTFIT_MAP[2];
  if (temp >= 17) return OUTFIT_MAP[3];
  if (temp >= 12) return OUTFIT_MAP[4];
  if (temp >= 9) return OUTFIT_MAP[5];
  if (temp >= 5) return OUTFIT_MAP[6];
  return OUTFIT_MAP[7];
}
