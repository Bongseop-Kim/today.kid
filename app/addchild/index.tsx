import { getWebViewPath } from "@/config/config";
import CustomWebView from "@/components/CustomWebView";
import React from "react";
import { Stack } from "expo-router";

export default function AddChildScreen() {
  return (
    <React.Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomWebView source={{ uri: getWebViewPath("/kid/register") }} />
    </React.Fragment>
  );
}
