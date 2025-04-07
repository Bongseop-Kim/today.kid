import AsyncStorage from "@react-native-async-storage/async-storage";

// 토큰 저장 키
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * 액세스 토큰을 저장합니다
 */
export const saveAccessToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error("액세스 토큰 저장 실패:", error);
    throw error;
  }
};

/**
 * 리프레시 토큰을 저장합니다
 */
export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error("리프레시 토큰 저장 실패:", error);
    throw error;
  }
};

/**
 * 액세스 토큰을 가져옵니다
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("액세스 토큰 가져오기 실패:", error);
    return null;
  }
};

/**
 * 리프레시 토큰을 가져옵니다
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("리프레시 토큰 가져오기 실패:", error);
    return null;
  }
};

/**
 * 모든 토큰을 삭제합니다 (로그아웃 시 사용)
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error("토큰 삭제 실패:", error);
    throw error;
  }
};

/**
 * 토큰이 존재하는지 확인합니다 (로그인 상태 확인)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return token !== null;
};
