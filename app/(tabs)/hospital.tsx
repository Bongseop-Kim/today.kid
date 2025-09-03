import React from "react";
import CustomWebView from "@/components/CustomWebView";
import { getWebViewPath } from "@/config/config";

export default function HospitalScreen() {
  return (
    <CustomWebView
      source={{ uri: getWebViewPath("/kakaomap") }}
      requiresAuth={true}
    />
  );
}
