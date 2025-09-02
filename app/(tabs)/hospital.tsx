import { WebView } from "react-native-webview";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function HospitalScreen() {
  // 초기 위도 경도 서울
  const [latitude, setLatitude] = useState(37.5665);
  const [longitude, setLongitude] = useState(126.978);
  const [list, setList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("병원");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      // 한국 지역 범위 확인 (대략적인 한국 영토 좌표 범위)
      const isInKorea = isLocationInKorea(
        location.coords.latitude,
        location.coords.longitude
      );

      if (isInKorea) {
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        console.log(location.coords.latitude, location.coords.longitude);
      } else {
        console.log("위치가 한국 밖입니다. 기본 서울 위치를 사용합니다.");
        // 기본 서울 위치 유지 (이미 state 초기값으로 설정되어 있음)
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 위치가 한국 내에 있는지 확인하는 함수
  const isLocationInKorea = (lat: number, lng: number) => {
    // 한국의 대략적인 좌표 범위
    const koreaLatRange = { min: 33.0, max: 38.6 };
    const koreaLngRange = { min: 124.5, max: 132.0 };

    return (
      lat >= koreaLatRange.min &&
      lat <= koreaLatRange.max &&
      lng >= koreaLngRange.min &&
      lng <= koreaLngRange.max
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const searchPlaces = async () => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${searchKeyword}&x=${longitude}&y=${latitude}&radius=2000`,
        {
          headers: {
            Authorization: `KakaoAK 1bf8beb8e963a381f6cdf1639d02f616`,
          },
        }
      );

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const results = data.documents.map((doc: any) => ({
          latitude: parseFloat(doc.y),
          longitude: parseFloat(doc.x),
          place_name: doc.place_name,
          distance: doc.distance,
          id: doc.id,
        }));
        setList(results);
      } else {
        alert("검색 결과가 없습니다.");
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    searchPlaces();
  }, [searchKeyword, latitude, longitude]);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=e6b8e90e2018f56090316a82ae7588f2&libraries=services"></script>
      <!-- 스타일은 그대로 유지 -->
    </head>
    <body>
      <div id="map"></div>
      <script>
        function initMap() {
          try {
            console.log("kakao map initializing");
            
            // Kakao SDK 체크를 더 엄격하게
            if (typeof kakao === 'undefined' || !kakao.maps) {
              console.error('Kakao Maps SDK not available');
              return;
            }
  
            var mapContainer = document.getElementById('map');
            if (!mapContainer) {
              console.error('Map container not found');
              return;
            }
            
            var mapOption = {
              center: new kakao.maps.LatLng(${latitude}, ${longitude}),
              level: 4
            };  
  
            var map = new kakao.maps.Map(mapContainer, mapOption);
            
            // 나머지 코드는 try-catch로 감싸기
            // ... (기존 마커 생성 코드)
            
          } catch (error) {
            console.error('Map initialization error:', error);
          }
        }
  
        // 더 안전한 로딩 체크
        function waitForKakao() {
          if (typeof kakao !== 'undefined' && kakao.maps) {
            initMap();
          } else {
            setTimeout(waitForKakao, 100);
          }
        }
  
        // DOM과 SDK 모두 로드될 때까지 대기
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', waitForKakao);
        } else {
          waitForKakao();
        }
      </script>
    </body>
  </html>
  `;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.listItem}>
      <Text style={styles.placeName}>{item.place_name}</Text>
      <Text style={styles.distance}>
        {(parseInt(item.distance) / 1000).toFixed(2)} km
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        {/* 검색 탭 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, searchKeyword === "병원" && styles.activeTab]}
            onPress={() => setSearchKeyword("병원")}
          >
            <Text
              style={[
                styles.tabText,
                searchKeyword === "병원" && styles.activeTabText,
              ]}
            >
              병원
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, searchKeyword === "약국" && styles.activeTab]}
            onPress={() => setSearchKeyword("약국")}
          >
            <Text
              style={[
                styles.tabText,
                searchKeyword === "약국" && styles.activeTabText,
              ]}
            >
              약국
            </Text>
          </TouchableOpacity>
        </View>

        {/* 지도 */}
        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            mixedContentMode="compatibility" // Android용
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={false}
            bounces={false}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onLoad={() => console.log("WebView loaded successfully")}
            onError={(e) => console.error("WebView error: ", e.nativeEvent)}
            onHttpError={(e) => console.error("HTTP error: ", e.nativeEvent)}
            // 중요: production에서 console.log 제거하거나 조건부로 사용
            injectedJavaScript={
              __DEV__
                ? `(function() {
    window.console.log = function(message) {
      window.ReactNativeWebView.postMessage(message);
    }
  })();`
                : ""
            }
            onMessage={(event) =>
              __DEV__ && console.log(event.nativeEvent.data)
            }
          />

          {/* 현재 위치 새로고침 버튼 */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchLocation}
            disabled={isLoading}
          >
            <View style={styles.refreshButtonInner}>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={Colors[colorScheme ?? "light"].tint}
                />
              ) : (
                <MaterialIcons
                  name="my-location"
                  size={24}
                  color={Colors[colorScheme ?? "light"].tint}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* 검색 결과 리스트 */}
        <View style={styles.listContainer}>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black", // 네이버 색상
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  refreshButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
  refreshButtonInner: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    maxHeight: "40%",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  listContent: {
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  placeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  distance: {
    fontSize: 14,
    color: "#666",
  },
});
