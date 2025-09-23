
// ✅ userId 가져오기 (localStorage > sessionStorage 순서로 확인)
export const getStoredUserId = (): string | null => {
  return localStorage.getItem("userId") || sessionStorage.getItem("userId");
};

// ✅ username 가져오기
export const getStoredUsername = (): string | null => {
  return localStorage.getItem("username") || sessionStorage.getItem("username");
};

// ✅ token 가져오기
export const getStoredToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// ✅ 로그인 정보 한 번에 가져오기
export const getStoredUser = () => {
  return {
    userId: getStoredUserId(),
    username: getStoredUsername(),
    token: getStoredToken(),
  };
};