import { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { WebViewMessageEvent } from "react-native-webview";

import { router } from "expo-router";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "./tokenStorage";

interface UseWebViewTokenOptions {
  requiresAuth?: boolean;
  onTokenReceived?: (token: string) => void;
}

export function useWebViewToken(options: UseWebViewTokenOptions = {}) {
  const { requiresAuth = false, onTokenReceived } = options;
  const webViewRef = useRef<WebView>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 토큰 가져오기
    const fetchToken = async () => {
      if (requiresAuth) {
        const authToken = await getAccessToken();
        const authRefreshToken = await getRefreshToken();
        if (authToken && authRefreshToken) {
          setToken(authToken);
          setRefreshToken(authRefreshToken);
        } else {
          router.navigate("/login");
        }
      }
    };

    fetchToken();
  }, [requiresAuth]);

  // 웹뷰로부터 메시지를 수신하는 함수
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // 토큰 메시지 처리
      if (data.type === "token" && data.token && data.refreshToken) {
        console.log("토큰을 웹뷰로부터 받았습니다");
        const receivedToken = data.token;
        const receivedRefreshToken = data.refreshToken;

        // 토큰 저장
        saveAccessToken(receivedToken);
        saveRefreshToken(receivedRefreshToken);
        setToken(receivedToken);

        // 콜백 함수가 있으면 호출
        if (onTokenReceived) {
          onTokenReceived(receivedToken);
        }
      } else if (data.type === "logout") {
        console.log("로그아웃 메시지를 웹뷰로부터 받았습니다");
        setToken(null);
        setRefreshToken(null);
        saveAccessToken("");
        saveRefreshToken("");
        router.navigate("/login");
        console.log("로그아웃");
      } else if (data.type === "NAV" && data.data && data.data.route) {
        console.log(
          "네비게이션 메시지를 웹뷰로부터 받았습니다:",
          data.data.route
        );
        router.navigate(data.data.route);
      }
    } catch (error) {
      console.error("웹뷰 메시지 처리 중 오류 발생:", error);
    }
  };

  return {
    webViewRef,
    token,
    refreshToken,
    handleMessage,
  };
}
