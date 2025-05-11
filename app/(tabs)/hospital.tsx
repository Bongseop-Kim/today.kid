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

export default function HospitalScreen() {
  // 초기 위도 경도 서울
  const [latitude, setLatitude] = useState(37.5665);
  const [longitude, setLongitude] = useState(126.978);
  const [list, setList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("병원");
  const [isLoading, setIsLoading] = useState(false);

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
      <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=e6b8e90e2018f56090316a82ae7588f2&libraries=services"></script>
      <style>
        body { margin: 0; padding: 0; height: 100%; }
        html { height: 100%; }
        #map { width: 100%; height: 100%; }
        #info { position: absolute; bottom: 10px; left: 10px; background: white; padding: 10px; z-index: 1; }
        
        /* 커스텀 오버레이 스타일 - 화살표 제거 */
        .label {
          display: inline-block;
          padding: 8px 10px;
          background-color: white;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border: 1px solid #ddd;
          font-size: 13px;
          font-weight: 500;
          color: #333;
          text-align: center;
          white-space: nowrap;
          position: relative;
          margin-bottom: 5px; /* 마커와의 간격 증가 */
        }
        
        .current-location {
          background-color: #2196F3;
          color: white;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // 카카오맵 SDK가 로드된 후 실행되도록 함수로 감싸기
        function initMap() {
          console.log("kakao map initializing");

          var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
          mapOption = {
              center: new kakao.maps.LatLng(${latitude}, ${longitude}), // 지도의 중심좌표
              level: 4 // 지도의 확대 레벨
          };  

          // 지도를 생성합니다    
          var map = new kakao.maps.Map(mapContainer, mapOption); 
          
          // 현재 위치 마커 생성
          var currentPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
          
          // 현재 위치 마커 이미지 설정
          var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
          var imageSize = new kakao.maps.Size(24, 35);
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
          
          // 현재 위치 마커 생성
          var currentMarker = new kakao.maps.Marker({
            map: map,
            position: currentPosition,
            image: markerImage,
            zIndex: 10
          });
          
          // 현재 위치 커스텀 오버레이 생성
          var currentContent = '<div class="label current-location">현재 위치</div>';
          var currentCustomOverlay = new kakao.maps.CustomOverlay({
            position: currentPosition,
            content: currentContent,
            yAnchor: 2.0, // 위치를 더 높게 조정 (값이 클수록 더 위로 올라감)
            zIndex: 10
          });
          
          // 커스텀 오버레이를 지도에 표시합니다
          currentCustomOverlay.setMap(map);

          // 마커 데이터 생성
          const markerData = ${JSON.stringify(list)};
          
          // 마커와 커스텀 오버레이 배열
          var markers = [];
          var overlays = [];
          
          // 마커 생성 및 표시
          markerData.forEach(function(item) {
            var position = new kakao.maps.LatLng(item.latitude, item.longitude);
            var marker = new kakao.maps.Marker({
              map: map,
              position: position
            });
            
            markers.push(marker);
            
            // 커스텀 오버레이 생성
            var content = '<div class="label">' + item.place_name + '</div>';
            var customOverlay = new kakao.maps.CustomOverlay({
              position: position,
              content: content,
              yAnchor: 2.0 // 위치를 더 높게 조정
            });
            
            overlays.push(customOverlay);
            
            // 마커 클릭 이벤트
            kakao.maps.event.addListener(marker, 'click', function() {
              // 모든 오버레이 숨기기
              overlays.forEach(function(overlay) {
                overlay.setMap(null);
              });
              
              // 클릭한 마커의 오버레이만 표시
              customOverlay.setMap(map);
            });
          });
          
          // 지도 클릭 시 모든 오버레이 숨기기
          kakao.maps.event.addListener(map, 'click', function() {
            overlays.forEach(function(overlay) {
              overlay.setMap(null);
            });
            
            // 현재 위치 오버레이는 항상 표시
            currentCustomOverlay.setMap(map);
          });
        }

        // 카카오맵 SDK 로드 완료 확인 후 지도 초기화
        window.onload = function() {
          if (typeof kakao !== 'undefined' && kakao.maps) {
            initMap();
          } else {
            console.error('Kakao Maps SDK not loaded');
          }
        };
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
            onLoad={() => console.log("WebView loaded successfully")}
            onError={(e) => console.error("WebView error: ", e.nativeEvent)}
            injectedJavaScript={`(function() {
            window.console.log = function(message) {
              window.ReactNativeWebView.postMessage(message);
            }
          })();`}
            onMessage={(event) => console.log(event.nativeEvent.data)}
          />

          {/* 현재 위치 새로고침 버튼 */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchLocation}
            disabled={isLoading}
          >
            <View style={styles.refreshButtonInner}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#424242" />
              ) : (
                <MaterialIcons name="my-location" size={24} color="#424242" />
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
