import { getWebViewPath } from "@/config/config";
import CustomWebView from "@/components/CustomWebView";

export default function HomeScreen() {
  return (
    <CustomWebView
      source={{ uri: getWebViewPath("/hospital") }}
      requiresAuth={true}
    />
  );
}
