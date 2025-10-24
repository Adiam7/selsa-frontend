// selsa-frontend/src/lib/utils/logout.ts

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  window.location.href = "/auth/login";
}
