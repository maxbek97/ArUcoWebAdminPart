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