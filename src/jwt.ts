import { AUTH_API } from "./apiConfig";

export function decodeJwt(token: String) {
  try {
    const payloadBase64 = token.split(".")[1];

    const normalizedBase64 = payloadBase64
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decodedPayload = atob(normalizedBase64);

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export function isAdminToken(token: String) {
  const payload = decodeJwt(token);

  if (!payload) {
    return false;
  }

  return payload.role === "Admin";
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  let accessToken = localStorage.getItem("accessToken")!;

  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  let response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshToken =
    localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const refreshResponse = await fetch(
    `${AUTH_API}/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refreshTokenString: refreshToken
      })
    }
  );

  if (!refreshResponse.ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = "/";
    // console.error("Refresh failed");
    // console.error("Status:", refreshResponse.status);
    // console.error("StatusText:", refreshResponse.statusText);

    // try {
    //   const errorBody = await refreshResponse.text();

    //   console.error("Response body:");
    //   console.error(errorBody);
    // }
    // catch (e) {
    //   console.error("Failed to read response body", e);
    // }

    throw new Error("Refresh failed");
  }

  const refreshData = await refreshResponse.json();

  accessToken = refreshData.accessToken;

  localStorage.setItem(
    "accessToken",
    accessToken
  );

  headers.set(
    "Authorization",
    `Bearer ${accessToken}`
  );

  return fetch(url, {
    ...options,
    headers
  });
}