const TOKEN_KEY = "trello_auth_token";

// get the jwt token from the cookies with localstorage in brownser

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  // Fallback to localStorage
  return localStorage.getItem(TOKEN_KEY);
}



/**
 * Save JWT token into Cookie & localStorage
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  // Set Cookie (valid for 7 days)
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  // Set localStorage
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove JWT token from Cookie & localStorage
 */
export function removeToken(): void {
  if (typeof window === "undefined") return;
  // Clear Cookie
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  // Clear localStorage
  localStorage.removeItem(TOKEN_KEY);
}

