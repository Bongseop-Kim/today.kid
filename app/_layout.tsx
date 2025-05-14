import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Global state to track if WebView is loaded
let isWebViewLoaded = false;

// Function to be called from HomeScreen when WebView loads
export const setWebViewLoaded = () => {
  isWebViewLoaded = true;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [fontsReady, setFontsReady] = useState(false);
  // 로컬 상태로 전역 변수 추적
  const [webViewLoadedState, setWebViewLoadedState] = useState(false);

  // 폰트 로딩 처리
  useEffect(() => {
    if (loaded) {
      setFontsReady(true);
    }
  }, [loaded]);

  // 전역 변수 변화 감지
  useEffect(() => {
    const checkWebViewLoaded = () => {
      if (isWebViewLoaded !== webViewLoadedState) {
        setWebViewLoadedState(isWebViewLoaded);
      }
    };

    // 100ms마다 상태 확인
    const intervalId = setInterval(checkWebViewLoaded, 100);
    return () => clearInterval(intervalId);
  }, [webViewLoadedState]);

  // 스플래시 화면 숨김 처리
  useEffect(() => {
    console.log("webViewLoaded", webViewLoadedState, "fontsReady", fontsReady);
    const hideSplash = async () => {
      // 폰트와 WebView가 모두 로드되었을 때 스플래시 화면 숨김
      if (fontsReady && webViewLoadedState) {
        console.log("스플래시 화면 숨김 시도");
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [fontsReady, webViewLoadedState]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
