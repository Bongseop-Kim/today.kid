import React, { useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { saveAccessToken, saveRefreshToken } from "@/utils/tokenStorage";
import { router } from "expo-router";
import { getWebViewUrl } from "@/config/config";

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
  },

  googleIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});

export default function LoginScreen() {
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
      const currentUser = await GoogleSignin.getCurrentUser();
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

      const userInfo = await GoogleSignin.signIn();
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 3, justifyContent: "center" }}>
        <Text style={{ fontSize: 26, fontWeight: "bold", textAlign: "center" }}>
          아이가 아픈 이유가 뭘까요?
        </Text>

        <View style={{ height: 20 }} />

        <Text style={{ fontSize: 18, textAlign: "center" }}>
          날씨처럼 하루하루가 다른
        </Text>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          아이의 정확한 증상을 알고 싶은
        </Text>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          엄마들에게 도움이 되고 싶어요.
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            startSignInFlow();
          }}
        >
          <Image
            source={require("../../assets/images/google.icon.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Google로 계속하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
