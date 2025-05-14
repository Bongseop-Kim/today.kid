import { getWebViewPath } from "@/config/config";
import CustomWebView from "@/components/CustomWebView";
import {
  WebViewNavigationEvent,
  WebViewErrorEvent,
} from "react-native-webview/lib/WebViewTypes";
import { setWebViewLoaded } from "../_layout";

export default function HomeScreen() {
  // WebView 로딩 완료 핸들러
  const handleWebViewLoad = (
    event: WebViewNavigationEvent | WebViewErrorEvent
  ) => {
    console.log("WebView 로딩 완료");
    // 전역 함수 호출하여 로딩 완료 알림
    setWebViewLoaded();
  };

  return (
    <CustomWebView
      source={{ uri: getWebViewPath("/") }}
      requiresAuth={true}
      onLoadEnd={handleWebViewLoad}
    />
  );
}
