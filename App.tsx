import "./global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
import mobileAds from "react-native-google-mobile-ads";

import HomeScreen from "./src/screens/HomeScreen";
import WeeklyScreen from "./src/screens/WeeklyScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

mobileAds()
  .setRequestConfiguration({ testDeviceIdentifiers: ["EMULATOR"] })
  .then(() => mobileAds().initialize());

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#0f172a",
              borderTopColor: "rgba(255,255,255,0.08)",
              borderTopWidth: 1,
              height: 68,
              paddingBottom: 12,
              paddingTop: 8,
            },
            tabBarActiveTintColor: "#a5b4fc",
            tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
            tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: "오늘",
              tabBarIcon: ({ focused }) => <TabIcon emoji="🌤️" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Weekly"
            component={WeeklyScreen}
            options={{
              tabBarLabel: "이번 주",
              tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: "설정",
              tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
