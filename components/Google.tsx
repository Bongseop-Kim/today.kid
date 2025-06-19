import React, { useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  DeviceEventEmitter,
  Dimensions,
  Text,
} from "react-native";
import { saveAccessToken, saveRefreshToken } from "@/utils/tokenStorage";
import { router } from "expo-router";
import { getWebViewUrl } from "@/config/config";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    gap: 8,
    borderRadius: 8,
    width: width - 40,
    height: 44,
  },
  googleIcon: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

const Google = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "829184695617-ljm22fc16huk546v05sh9uns7v4ah15i.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const startSignInFlow = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      
      // 먼저 현재 사용자 확인
      let currentUser = await GoogleSignin.getCurrentUser();
      
      // 로그인된 사용자가 없으면 로그인 시도
      if (!currentUser) {
        console.log('로그인된 사용자가 없습니다. 로그인을 시도합니다.');
        const userInfo = await GoogleSignin.signIn();
        currentUser = await GoogleSignin.getCurrentUser();
        console.log('새로 로그인한 사용자:', userInfo);
      }
      
      console.log('현재 사용자:', currentUser);
      if (currentUser) {
        // Changed to POST method to match CustomWebView implementation
        const response = await fetch(
          `${getWebViewUrl()}/api/auth/social-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "google",
              user: {
                email: currentUser.user.email,
                name: currentUser.user.givenName,
                photoURL: currentUser.user.photo,
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
    } catch (error: any) {
      // 오류 처리
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("사용자가 로그인을 취소함");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("로그인이 이미 진행 중입니다");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Play 서비스를 사용할 수 없습니다");
        Alert.alert("오류", "Google Play 서비스를 사용할 수 없습니다.");
      } else {
        console.error("Google 로그인 오류:", error);
        Alert.alert("로그인 오류", "Google 로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={() => {
        startSignInFlow();
      }}
    >
      <Image
        source={require("../assets/images/google.icon.png")}
        style={styles.googleIcon}
      />
      <Text style={styles.googleButtonText}>Google로 계속하기</Text>
    </TouchableOpacity>
  );
};

export default Google;
