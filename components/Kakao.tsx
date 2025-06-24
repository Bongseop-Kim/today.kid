import React, { useState, useEffect } from "react";
import {
  Pressable,
  Text,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
  DeviceEventEmitter,
} from "react-native";
import { login, me, getAccessToken } from "@react-native-kakao/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getWebViewUrl } from "@/config/config";
import { saveAccessToken, saveRefreshToken } from "@/utils/tokenStorage";

const { width } = Dimensions.get("window");

const Kakao = () => {
  const [isLoading, setIsLoading] = useState(false);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      // 카카오 토큰이 있는지 확인 (getAccessToken이 성공하면 토큰이 있는 것)
      try {
        await getAccessToken();
        const isLoggedIn = true;

        if (isLoggedIn) {
          // AsyncStorage에 저장된 사용자 정보가 있는지 확인
          const userJson = await AsyncStorage.getItem("user");

          if (!userJson) {
            // 토큰은 있지만 사용자 정보가 없는 경우, 사용자 정보 가져오기
            const profile = await me();

            const userData = {
              id: profile.id,
              nickname: profile.nickname,
              profileImageUrl: profile.profileImageUrl,
              email: profile.id + "@kakao.user",
              provider: "kakao",
            };

            await AsyncStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch {
        // 토큰이 없는 경우 (로그인되지 않음)
        console.log("카카오 로그인이 필요합니다.");
      }
    } catch (error) {
      console.error("카카오 로그인 상태 확인 오류:", error);
    }
  };

  const signInWithKakao = async () => {
    try {
      setIsLoading(true);

      // 카카오 로그인 시도
      const token = await login();

      if (token) {
        // 사용자 정보 가져오기
        const profile = await me();

        //send data to backend
        const response = await fetch(
          `${getWebViewUrl()}/api/auth/social-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "kakao",
              user: {
                id: profile.id,
                email: profile.id + "@kakao.user",
                name: profile.nickname,
                photoURL: profile.profileImageUrl,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.status}`);
        }

        const { data } = await response.json();

        if (data.accessToken) {
          await saveAccessToken(data.accessToken);
          await saveRefreshToken(data.refreshToken);
          DeviceEventEmitter.emit("webviewReload", {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          router.navigate("/");
        }
        return;
      }
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      Alert.alert(
        "로그인 실패",
        "카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      onPress={signInWithKakao}
      disabled={isLoading}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FEE500",
        gap: 8,
        borderRadius: 8,
        width: width - 40,
        height: 44,
      }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color="#000000"
          style={{ marginRight: 8 }}
        />
      ) : (
        <Image
          source={require("../assets/images/kakao.icon.png")}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      )}
      <Text style={{ color: "#000000", fontWeight: "600" }}>
        {isLoading ? "로그인 중..." : "카카오로 시작하기"}
      </Text>
    </Pressable>
  );
};

export default Kakao;
