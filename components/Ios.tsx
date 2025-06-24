import * as AppleAuthentication from "expo-apple-authentication";
import { saveAccessToken, saveRefreshToken } from "@/utils/tokenStorage";
import { router } from "expo-router";
import { getWebViewUrl } from "@/config/config";
import { DeviceEventEmitter, StyleSheet } from "react-native";
import { Dimensions } from "react-native";

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

          // Send data to backend
          const response = await fetch(
            `${getWebViewUrl()}/api/auth/social-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                provider: "apple",
                user: {
                  id: email,
                  email,
                  name,
                  appleIdentifier: credential.user,
                },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Apple authentication failed: ${response.status}`);
          }

          const { data } = await response.json();
          console.log(email, name, data);

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
          if (e.code === "ERR_REQUEST_CANCELED") {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    />
  );
};

export default Ios;
