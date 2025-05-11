// 환경 설정
export const ENV = {
  DEV: false, // 개발 환경 여부
};

// 웹뷰 URL 설정
export const WEBVIEW_URLS = {
  // 개발 환경일 때는 로컬 서버 주소 사용
  LOCAL: "https://4102-183-107-241-168.ngrok-free.app",
  // 운영 환경일 때는 실제 서비스 주소 사용
  PRODUCTION: "https://kid-pass-psi.vercel.app",
};

// 현재 환경에 맞는 웹뷰 URL 반환
export const getWebViewUrl = () => {
  return ENV.DEV ? WEBVIEW_URLS.LOCAL : WEBVIEW_URLS.PRODUCTION;
};

// 특정 경로를 포함한 전체 웹뷰 URL 생성
export const getWebViewPath = (path: string) => {
  const baseUrl = getWebViewUrl();
  // path가 '/'로 시작하는지 확인하고 URL 조합
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${formattedPath}`;
};
