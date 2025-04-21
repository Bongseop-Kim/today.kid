import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView, WebViewProps } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWebViewToken } from "../utils/useWebViewToken";
import { getWebViewUrl } from "@/config/config";
import { getAccessToken } from "@/utils/tokenStorage";
import { WebViewNavigationEvent } from "react-native-webview/lib/WebViewTypes";
import { router } from "expo-router";

interface CustomWebViewProps extends WebViewProps {
  // 필요한 경우 추가 속성을 여기에 정의할 수 있습니다
  requiresAuth?: boolean;
  onTokenReceived?: (token: string) => void;
}

const CustomWebView: React.FC<CustomWebViewProps> = (props) => {
  const { requiresAuth = false, onTokenReceived, ...restProps } = props;
  const insets = useSafeAreaInsets();
  const [freshToken, setFreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { webViewRef, handleMessage } = useWebViewToken({
    requiresAuth,
    onTokenReceived,
  });

  // 웹뷰 로드 시 새로운 토큰 요청
  useEffect(() => {
    const fetchNewToken = async () => {
      if (requiresAuth) {
        try {
          setIsLoading(true);
          // 저장된 토큰 가져오기
          const storedToken = await getAccessToken();

          if (storedToken) {
            try {
              // 리프레시 토큰을 사용하여 새 액세스 토큰 요청
              // API 경로를 /api/auth/refresh로 수정
              const response = await fetch(
                `${getWebViewUrl()}/api/auth/refresh`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ refreshToken: storedToken }),
                }
              );

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("토큰 갱신 실패:", response.status, errorData);
                router.push("/login");
              }

              const data = await response.json();
              const { accessToken, refreshToken: newRefreshToken } = data;

              // 새 토큰 저장 (필요한 경우)
              // await saveToken(newRefreshToken);

              setFreshToken(accessToken);
              console.log("새로운 토큰:", accessToken);
              if (onTokenReceived) {
                onTokenReceived(accessToken);
              }
            } catch (refreshError) {
              console.error("토큰 갱신 API 호출 오류:", refreshError);
              // 갱신 실패 시 기존 토큰 사용 (임시 방편)
              setFreshToken(storedToken);
            }
          }
        } catch (error) {
          console.error("토큰 갱신 중 오류 발생:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchNewToken();
  }, [requiresAuth, onTokenReceived]);

  // 웹뷰로 메시지를 보내는 함수
  const sendMessageToWebView = () => {
    if (requiresAuth && freshToken && webViewRef.current) {
      const messageData = JSON.stringify({
        type: "token",
        token: freshToken,
      });
      console.log("새로운 토큰을 웹뷰로 전송합니다");
      webViewRef.current.postMessage(messageData);
    }
  };

  // 웹뷰가 로드되면 토큰 전송
  const handleLoadEnd = () => {
    sendMessageToWebView();
    if (props.onLoadEnd) {
      props.onLoadEnd({} as WebViewNavigationEvent);
    }
  };

  if (requiresAuth && isLoading) {
    // 토큰을 가져오는 동안 로딩 상태 표시
    // 필요에 따라 로딩 컴포넌트를 추가할 수 있습니다
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <WebView
        {...restProps}
        ref={webViewRef}
        style={styles.webView}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        keyboardDisplayRequiresUserAction={false}
        hideKeyboardAccessoryView={true}
        renderLoading={() => (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webView: {
    flex: 1,
    marginBottom: 10,
  },
});

export default CustomWebView;
