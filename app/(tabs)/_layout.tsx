import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            height: 100,
            paddingTop: 10,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require("../../assets/images/home.png")}
              style={{ width: 24, height: 24, marginBottom: 6 }}
              resizeMode="contain"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "아이기록",
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require("../../assets/images/ruler.png")}
              style={{ width: 24, height: 24, marginBottom: 6 }}
              resizeMode="contain"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="note"
        options={{
          title: "아이수첩",
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require("../../assets/images/book.png")}
              style={{ width: 24, height: 24, marginBottom: 6 }}
              resizeMode="contain"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="hospital"
        options={{
          title: "병원찾기",
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require("../../assets/images/cross.png")}
              style={{ width: 24, height: 24, marginBottom: 6 }}
              resizeMode="contain"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "더보기",
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require("../../assets/images/more.png")}
              style={{ width: 24, height: 24, marginBottom: 6 }}
              resizeMode="contain"
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
