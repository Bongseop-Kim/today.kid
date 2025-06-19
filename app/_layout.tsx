import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { Platform } from "react-native";
import { initializeKakaoSDK } from "@react-native-kakao/core";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // 카카오 SDK 초기화
  useEffect(() => {
    // 네이티브 앱 키는 app.json에서 이미 설정되어 있지만, 코드에서도 초기화 필요
    if (Platform.OS !== "web") {
      // app.json에 설정된 키와 동일한 키 사용
      initializeKakaoSDK("15fe13114d3ce37fc05be4962afb3be4");
      console.log("카카오 SDK가 초기화되었습니다.");
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
