module.exports = {
  expo: {
    name: "today.kid",
    slug: "todaykid",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/Frame.png",
    userInterfaceStyle: "light",
    scheme: "todaykid",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bongsub.todaykid",
      googleServicesFile: "./GoogleService-Info.plist",
      entitlements: {
        "com.apple.developer.applesignin": ["Default"],
      },
      usesAppleSignIn: true,
    },
    android: {
      package: "com.bongsub.todaykid",
      icon: "./assets/images/Frame.png",
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      eas: {
        projectId: "39abd23b-0efb-4260-ac8f-b59630fa9b73",
      },
    },
    owner: "bongsub",
    plugins: [
      [
        "expo-splash-screen",
        {
          backgroundColor: "#729BED",
          image: "./assets/images/splash-icon.png",
          resizeMode: "contain",
          imageWidth: 200,
        },
      ],
      "expo-web-browser",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "사용자 위치를 확인하여 주변 병원을 찾기 위해 위치 정보를 허용해주세요.",
          locationAlwaysUsageDescription:
            "사용자 위치를 확인하여 주변 병원을 찾기 위해 위치 정보를 허용해주세요.",
          locationWhenInUseUsageDescription:
            "사용자 위치를 확인하여 주변 병원을 찾기 위해 위치 정보를 허용해주세요.",
        },
      ],
      ["@react-native-google-signin/google-signin"],
      ["expo-apple-authentication"],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: "15fe13114d3ce37fc05be4962afb3be4",
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
      "expo-router",
    ],
  },
};
