const TOKEN_Key = "fm_auth_token";

export function saveToken(token: string) {
  return localStorage.setItem(TOKEN_Key, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_Key);
}

export function clearToken() {
  return localStorage.removeItem(TOKEN_Key);
}
