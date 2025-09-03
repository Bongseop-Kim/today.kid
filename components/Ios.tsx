import * as AppleAuthentication from "expo-apple-authentication";
import { saveAccessToken, saveRefreshToken } from "@/utils/tokenStorage";
import { router } from "expo-router";
import { getWebViewUrl } from "@/config/config";
import { DeviceEventEmitter, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import React from "react";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  appleButton: {
    width: width - 40,
    height: 44,
    backgroundColor: "black",
    borderRadius: 8,
  },
});

const Ios = () => {
  // Apple 로그인 가용성 확인
  const checkAppleSignInAvailability = async () => {
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      console.log("Apple Sign In 가용성:", isAvailable);
      if (!isAvailable) {
        console.error("Apple Sign In이 이 기기에서 사용할 수 없습니다.");
      }
    } catch (error) {
      console.error("Apple Sign In 가용성 확인 오류:", error);
    }
  };

  // 컴포넌트 마운트 시 가용성 확인
  React.useEffect(() => {
    checkAppleSignInAvailability();
  }, []);

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={styles.appleButton}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });

          // JWT 토큰에서 이메일 추출
          let email = credential.email;
          let name = "";

          // 이메일이 null이면 identityToken에서 추출
          if (!email && credential.identityToken) {
            try {
              // JWT의 두 번째 부분(payload) 추출 및 디코딩
              const payload = credential.identityToken.split(".")[1];
              const decodedPayload = JSON.parse(atob(payload));
              email = decodedPayload.email || "";
              console.log("토큰에서 추출한 이메일:", email);
            } catch (e) {
              console.error("토큰 디코딩 오류:", e);
            }
          }

          // fullName이 있으면 사용, 없으면 기본값 설정
          if (credential.fullName?.givenName) {
            name = credential.fullName.givenName;
          } else {
            // Apple 사용자의 경우 기본 이름 사용
            // 프록시 이메일에서 랜덤 문자열을 이름으로 사용하지 않음
            name = "Apple 사용자";
          }

          const url = `${getWebViewUrl()}/api/auth/social-login`;
          const config = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "apple",
              user: {
                id: credential.user.toString(),
                email,
                name,
              },
            }),
          };
          // Send data to backend
          const response = await fetch(url, config);
          console.log(url);
          console.log(config);
          console.log(response);
          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Apple authentication failed: ${response.status}`, errorData);
            throw new Error(errorData.message || `Apple authentication failed: ${response.status}`);
          }

          const result = await response.json();
          const { data } = result;

          if (data.accessToken) {
            await saveAccessToken(data.accessToken);
            await saveRefreshToken(data.refreshToken);
            DeviceEventEmitter.emit("webviewReload", {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            });
            router.navigate("/");
          }
        } catch (e: any) {
          console.error("Apple Sign In Error:", e);
          console.error("Error code:", e.code);
          console.error("Error message:", e.message);

          if (e.code === "ERR_REQUEST_CANCELED") {
            console.log("사용자가 Apple 로그인을 취소했습니다.");
          } else if (e.code === "ERR_REQUEST_FAILED") {
            console.error(
              "Apple 로그인 요청이 실패했습니다. 네트워크 또는 설정 문제일 수 있습니다."
            );
          } else if (e.code === "ERR_INVALID_RESPONSE") {
            console.error("Apple에서 유효하지 않은 응답을 받았습니다.");
          } else if (e.code === "ERR_REQUEST_NOT_HANDLED") {
            console.error(
              "Apple 로그인 요청이 처리되지 않았습니다. 설정 문제일 수 있습니다."
            );
          } else if (e.code === "ERR_REQUEST_NOT_INTERACTIVE") {
            console.error("Apple 로그인이 인터랙티브하지 않습니다.");
          } else {
            console.error("알 수 없는 Apple 로그인 오류:", e);
          }
        }
      }}
    />
  );
};

export default Ios;
