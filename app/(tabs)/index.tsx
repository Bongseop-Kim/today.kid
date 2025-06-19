import { useState } from "react";
import { getWebViewPath } from "@/config/config";
import CustomWebView from "@/components/CustomWebView";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function HomeScreen() {
  // State to force re-render of the WebView
  const [key, setKey] = useState(0);

  // Use useFocusEffect to detect when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // When the screen is focused, increment the key to force a re-render
      setKey(prevKey => prevKey + 1);
      
      return () => {
        // Cleanup function when screen loses focus (if needed)
      };
    }, [])
  );

  return (
    <CustomWebView 
      key={key} // Using key to force re-render when it changes
      source={{ uri: getWebViewPath("/") }} 
      requiresAuth={true} 
    />
  );
}
