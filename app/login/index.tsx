import { getWebViewPath } from "@/config/config";
import CustomWebView from "@/components/CustomWebView";
import React from "react";
import { Stack } from "expo-router";
import { router } from "expo-router";

export default function LoginScreen() {
  return (
    <React.Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomWebView
        source={{ uri: getWebViewPath("/auth/login") }}
        onTokenReceived={() => {
          router.push("/");
        }}
      />
    </React.Fragment>
  );
}
