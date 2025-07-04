export function getUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  console.log("getUser", userStr);
  return userStr ? JSON.parse(userStr) : null;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function hasRole(role: string) {
  const user = getUser();
  return user?.role?.includes(role);
}

export function hasPermission(permission: string) {
  const user = getUser();
  return user?.permissions?.includes(permission);
}
